// The package's water (optional): each polygon a flat surface at its elevation (none given: the lowest ground on its
// outer ring; terrain.ts works the levels out and lowers the ground under them), drawn as three's WebGPU WaterMesh draws water (three/addons/objects/WaterMesh.js: a planar reflection
// through TSL's reflector(), rippled by a normal map, with Fresnel), its normal map made here (no image file). One
// reflector per distinct level: its render is the scene again from below the surface (sky, ground, debris and the
// stand's phase-1 clusters: what the eye saw last frame, which is what a lake mirrors).
import * as THREE from 'three/webgpu';
import {
  Fn, add, cameraPosition, div, normalize, positionWorld, sub, time, texture, vec2, max, dot, reflect, pow, length, float,
  uniform, reflector, mul, mix, vec3, smoothstep,
} from 'three/tsl';
import { makeFbm } from '../../src/ground/floor-maps.ts';
import type { ScenePackage, Ring } from './package.ts';
import { shoreDistances } from './shore-distance.ts';
import type { Vec2, Vec3 } from '../../src/nanite-lib/index.ts';

/** A tileable normal map from fractal noise (as the water's ripples): 256 texels, RepeatWrapping. */
function rippleNormals(): THREE.DataTexture {
  const N = 256, f = makeFbm(7, 8, 4), h = new Float32Array(N * N);
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) h[y * N + x] = f(x / N, y / N);
  const px = new Uint8Array(N * N * 4);
  for (let y = 0; y < N; y++)
    for (let x = 0; x < N; x++) {
      const dx = (h[y * N + ((x + 1) % N)] - h[y * N + ((x + N - 1) % N)]) * 18, dy = (h[((y + 1) % N) * N + x] - h[((y + N - 1) % N) * N + x]) * 18;
      const l = Math.hypot(dx, dy, 1);
      px.set([(-dx / l * 0.5 + 0.5) * 255, (-dy / l * 0.5 + 0.5) * 255, (1 / l * 0.5 + 0.5) * 255, 255], (y * N + x) * 4);
    }
  const t = new THREE.DataTexture(px, N, N);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.magFilter = THREE.LinearFilter;
  t.minFilter = THREE.LinearMipmapLinearFilter;
  t.generateMipmaps = true;
  t.needsUpdate = true;
  return t;
}

export interface WaterInputs {
  sunDir: THREE.Vector3;
  sunColour: THREE.Color;
}

/**
 * Cox–Munk's mean-square slope for a wind (m/s): σ² = 0.003 + 0.00512 U (Cox & Munk 1954; an open-ocean fit, a lake's
 * fetch keeps it lower: here the same law, the parent's wind the only input). No wind: 0, a mirror.
 */
/** Which way down the reflection's image is (its v). */
const BLUR_SIGN = Number(new URLSearchParams(location.search).get('blursign') ?? 1);

export const coxMunkSlope2 = (windMs: number): number => (windMs > 0 ? 0.003 + 0.00512 * windMs : 0);

/** The water's look: wind (m/s) and the preset (`via`: a crisp mirror darkened toward slate, a thin tan shore). */
export interface WaterLook { windMs: number; look: 'via' | 'photo'; full: boolean }

/** A body's shore distance over its bounding box (package metres): texels of metres to the nearest edge, capped (shore-distance.ts). */
function shoreTexture(shapes: Ring[][], cap = 30): { texture: THREE.DataTexture; west: number; south: number; east: number; north: number } {
  const { px, size, west, south, east, north } = shoreDistances(shapes, cap);
  const texture = new THREE.DataTexture(px, size, size);
  texture.magFilter = texture.minFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return { texture, west, south, east, north };
}

/** The water meshes (each at its level, on layer 0), or null when the package has none. */
export function buildWater(scene: ScenePackage, levels: number[], o: WaterInputs): { group: THREE.Group; update: () => void; setLook: (l: WaterLook) => void } | null {
  const bodies = (scene.water ?? []).filter((w) => Array.isArray(w?.rings) && w.rings[0]?.length >= 3);
  if (!bodies.length) return null;
  const normals = rippleNormals();
  const byLevel = new Map<number, { shapes: THREE.Shape[]; rings: Ring[][] }>();
  for (const [k, w] of bodies.entries()) {
    const outer = w.rings[0];
    const key = Math.round(levels[k] * 10) / 10; // (terrain.ts: the given level, or the lowest ground on the ring)
    const toPath = <T extends THREE.Path>(r: Ring, path: T): T => {
      r.forEach(([x, y], i) => (i ? path.lineTo(x, y) : path.moveTo(x, y)));
      return path;
    };
    const shape = toPath(outer, new THREE.Shape());
    for (const hole of w.rings.slice(1)) if (hole.length >= 3) shape.holes.push(toPath(hole, new THREE.Path()));
    if (!byLevel.has(key)) byLevel.set(key, { shapes: [], rings: [] });
    byLevel.get(key)!.shapes.push(shape);
    byLevel.get(key)!.rings.push(w.rings.filter((r) => r.length >= 3));
  }
  const group = new THREE.Group();
  group.name = 'water';
  const sunDirection = uniform(o.sunDir.clone()), sunColor = uniform(new THREE.Vector3(o.sunColour.r, o.sunColour.g, o.sunColour.b));
  const deep = new THREE.Color(0x0d2a2a), waterColor = uniform(new THREE.Vector3(deep.r, deep.g, deep.b));
  const u: WaterUniforms = { slope: uniform(0), via: uniform(1) };
  const mirrors: Array<{ resolutionScale: number }> = [];
  for (const [level, { shapes, rings }] of byLevel) {
    // (shape x east, y north; turned flat: local +z, the reflector's normal, up)
    const geometry = new THREE.ShapeGeometry(shapes, 4);
    const shore = shoreTexture(rings);
    const mesh = new THREE.Mesh(geometry, waterMaterial(normals, sunDirection, sunColor, waterColor, u, shore, (m) => mesh.add(m), (r) => mirrors.push(r)));
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.y = level;
    mesh.receiveShadow = true;
    mesh.name = `water-${level}`;
    // (layer 0, the first phase: its reflection's render then draws what that phase does, the stand's clusters seen
    // last frame included. A reflector drawn in the second phase rendered black: none of the scene but a few leaves)
    group.add(mesh);
  }
  return {
    group,
    update: () => {
      sunDirection.value.copy(o.sunDir);
      sunColor.value.set(o.sunColour.r, o.sunColour.g, o.sunColour.b);
    },
    setLook: (l) => {
      u.slope.value = Math.sqrt(coxMunkSlope2(l.windMs));
      u.via.value = l.look === 'via' ? 1 : 0;
      for (const m of mirrors) m.resolutionScale = l.full ? 1 : 0.5;
    },
  };
}

interface WaterUniforms {
  /** Cox–Munk's rms slope (0: a mirror). */
  slope: THREE.UniformNode<'float', number>;
  /** 1: the VIA renders' look (slate-darkened mirror, tan shore band); 0: a photo's. */
  via: THREE.UniformNode<'float', number>;
}

/**
 * WaterMesh's material (three/addons/objects/WaterMesh.js, MIT), reworked: Fresnel with water's F0 (0.02, IOR 1.333;
 * WaterMesh's 0.3 greys the near water), the ripples' slope from Cox–Munk (the wind), the reflection blurred up and
 * down in proportion to it (a lake's streaked shore), the shore band darker (and, in the VIA look, a thin tan beach).
 */
function waterMaterial(normals: THREE.Texture, sunDirection: THREE.UniformNode<'vec3', THREE.Vector3>, sunColor: THREE.UniformNode<'vec3', THREE.Vector3>,
  waterColor: THREE.UniformNode<'vec3', THREE.Vector3>, u: WaterUniforms, shore: ReturnType<typeof shoreTexture>, adopt: (o: THREE.Object3D) => void,
  register: (r: { resolutionScale: number }) => void): THREE.NodeMaterial {
  const material = new THREE.NodeMaterial(); // (unlit, as WaterMesh's: the light is in its colour)
  const size = 1.4;
  const waterNormals = texture(normals);
  const sunC = sunColor, waterC = waterColor;
  const noiseAt = (p: Vec2) => {
    const uv0 = add(div(p, 103), vec2(div(time, 17), div(time, 29)));
    const uv1 = div(p, 107).sub(vec2(div(time, -19), div(time, 31)));
    const uv2 = add(div(p, vec2(897.0, 983.0)), vec2(div(time, 101), div(time, 97)));
    const uv3 = sub(div(p, vec2(1091.0, 1027.0)), vec2(div(time, 109), div(time, -113)));
    return waterNormals.sample(uv0).add(waterNormals.sample(uv1)).add(waterNormals.sample(uv2)).add(waterNormals.sample(uv3)).mul(0.5).sub(1);
  };
  const noise = noiseAt(positionWorld.xz.mul(size * 40));
  // (the noise's tilt is about 0.35 rms: scaled to the wind's slope)
  const surfaceNormal = normalize(vec3(noise.x.mul(u.slope.div(0.35)), 1, noise.y.mul(u.slope.div(0.35))));
  const worldToEye = cameraPosition.sub(positionWorld);
  const eyeDirection = normalize(worldToEye);
  const reflection = normalize(reflect(sunDirection.negate(), surfaceNormal));
  const direction = max(0.0, dot(eyeDirection, reflection));
  // (the sun's glitter: sharper the calmer)
  const specularLight = sunC.mul(pow(direction, max(float(60), float(2).div(max(u.slope.mul(u.slope), 1e-4))))).mul(u.slope.greaterThan(0).select(float(2), float(0.6)));
  const diffuseLight = sunC.mul(max(dot(sunDirection, surfaceNormal), 0.0)).mul(0.5);
  const distance = length(worldToEye);
  const distortion = surfaceNormal.xz.mul(float(0.001).add(float(1.0).div(distance))).mul(u.slope.mul(4));
  // the shore: metres from the edge (package x east, y north = -world z)
  const suv = vec2(positionWorld.x.sub(shore.west).div(shore.east - shore.west), positionWorld.z.negate().sub(shore.south).div(shore.north - shore.south));
  const toShore = texture(shore.texture, suv).r.mul(30);
  material.colorNode = Fn(() => {
    const mirror = reflector({ resolutionScale: 0.5 });
    register(mirror.reflector as unknown as { resolutionScale: number });
    mirror.uvNode = mirror.uvNode!.add(distortion);
    adopt(mirror.target);
    // the reflection streaked down the image by the slope (5 taps along its vertical, one way: the other reached past
    // the shoreline into the reflection's empty texels, a white band along the shore), none on a mirror
    const blur = u.slope.mul(BLUR_SIGN * 0.05).div(max(distance.div(400), 1));
    const tap = (k: number) => {
      const m = reflector({ reflector: mirror.reflector } as never); // (the same render: three's getDepthNode does this)
      m.uvNode = mirror.uvNode!.add(vec2(0, blur.mul(k)));
      return m.rgb;
    };
    const reflected = mirror.rgb.mul(0.3).add(tap(1).mul(0.25)).add(tap(2).mul(0.2)).add(tap(3).mul(0.15)).add(tap(4).mul(0.1));
    const theta = max(dot(eyeDirection, surfaceNormal), 0.0);
    const rf0 = float(0.02);
    const reflectance = mul(pow(float(1.0).sub(theta), 5.0), float(1.0).sub(rf0)).add(rf0);
    const scatter = waterC.mul(max(0.0, dot(surfaceNormal, eyeDirection)));
    const base: Vec3 = diffuseLight.mul(0.3).add(scatter);
    // the VIA renders: the mirror darkened toward slate blue
    const slate = vec3(0.16, 0.2, 0.25);
    const mirrored = mix(reflected.mul(0.85), mix(reflected.mul(0.78), slate.mul(dot(reflected, vec3(0.3, 0.59, 0.11)).mul(1.4)), 0.3), u.via);
    const colour = base.mul(float(1).sub(reflectance)).add(mirrored.add(specularLight).mul(reflectance)).toVar();
    // the shore: darker within a few metres (shallow water over a dark bed), in the VIA look a thin tan band at the edge
    const nearShore = float(1).sub(smoothstep(0, 6, toShore));
    colour.assign(colour.mul(mix(float(1), float(0.72), nearShore)));
    const tan = vec3(0.42, 0.35, 0.25).mul(sunC.mul(max(sunDirection.y, 0.2)).mul(0.35).add(0.25));
    colour.assign(mix(colour, tan, float(1).sub(smoothstep(0.6, 2.2, toShore)).mul(u.via)));
    return colour;
  })();
  return material;
}
