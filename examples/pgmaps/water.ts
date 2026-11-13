// The package's water (optional): each polygon a flat surface at its elevation (none given: the lowest ground on its
// outer ring; terrain.ts works the levels out and lowers the ground under them), drawn as three's WebGPU WaterMesh draws water (three/addons/objects/WaterMesh.js: a planar reflection
// through TSL's reflector(), rippled by a normal map, with Fresnel), its normal map made here (no image file). One
// reflector per distinct level: its render is the scene again from below the surface (sky, ground, debris and the
// stand's phase-1 clusters: what the eye saw last frame, which is what a lake mirrors).
import * as THREE from 'three/webgpu';
import {
  Fn, add, cameraPosition, div, normalize, positionWorld, sub, time, texture, vec2, max, dot, reflect, pow, length, float,
  uniform, reflector, mul, mix, vec3,
} from 'three/tsl';
import { makeFbm } from '../../src/ground/floor-maps.ts';
import type { ScenePackage, Ring } from './package.ts';
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

/** The water meshes (each at its level, on layer 0), or null when the package has none. */
export function buildWater(scene: ScenePackage, levels: number[], o: WaterInputs): { group: THREE.Group; update: () => void } | null {
  const bodies = (scene.water ?? []).filter((w) => Array.isArray(w?.rings) && w.rings[0]?.length >= 3);
  if (!bodies.length) return null;
  const normals = rippleNormals();
  const byLevel = new Map<number, THREE.Shape[]>();
  for (const [k, w] of bodies.entries()) {
    const outer = w.rings[0];
    const key = Math.round(levels[k] * 10) / 10; // (terrain.ts: the given level, or the lowest ground on the ring)
    const toPath = <T extends THREE.Path>(r: Ring, path: T): T => {
      r.forEach(([x, y], i) => (i ? path.lineTo(x, y) : path.moveTo(x, y)));
      return path;
    };
    const shape = toPath(outer, new THREE.Shape());
    for (const hole of w.rings.slice(1)) if (hole.length >= 3) shape.holes.push(toPath(hole, new THREE.Path()));
    if (!byLevel.has(key)) byLevel.set(key, []);
    byLevel.get(key)!.push(shape);
  }
  const group = new THREE.Group();
  group.name = 'water';
  const sunDirection = uniform(o.sunDir.clone()), sunColor = uniform(new THREE.Vector3(o.sunColour.r, o.sunColour.g, o.sunColour.b));
  const deep = new THREE.Color(0x0d2a2a), waterColor = uniform(new THREE.Vector3(deep.r, deep.g, deep.b));
  for (const [level, shapes] of byLevel) {
    // (shape x east, y north; turned flat: local +z, the reflector's normal, up)
    const geometry = new THREE.ShapeGeometry(shapes, 4);
    const mesh = new THREE.Mesh(geometry, waterMaterial(normals, sunDirection, sunColor, waterColor, (m) => mesh.add(m)));
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
  };
}

/** WaterMesh's material (three/addons/objects/WaterMesh.js, MIT), with the normal map given and the reflector's target added by `adopt`. */
function waterMaterial(normals: THREE.Texture, sunDirection: THREE.UniformNode<'vec3', THREE.Vector3>, sunColor: THREE.UniformNode<'vec3', THREE.Vector3>,
  waterColor: THREE.UniformNode<'vec3', THREE.Vector3>, adopt: (o: THREE.Object3D) => void): THREE.NodeMaterial {
  const material = new THREE.NodeMaterial(); // (unlit, as WaterMesh's: the light is in its colour)
  const size = 1.4, distortionScale = 0.35; // (WaterMesh's 20 is for an ocean seen from hundreds of metres)
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
  const surfaceNormal = normalize(noise.xzy.mul(vec3(0.3, 1.0, 0.3))); // (a lake's ripples, not swell)
  const worldToEye = cameraPosition.sub(positionWorld);
  const eyeDirection = normalize(worldToEye);
  const reflection = normalize(reflect(sunDirection.negate(), surfaceNormal));
  const direction = max(0.0, dot(eyeDirection, reflection));
  const specularLight = sunC.mul(pow(direction, 100)).mul(2.0);
  const diffuseLight = sunC.mul(max(dot(sunDirection, surfaceNormal), 0.0)).mul(0.5);
  const distance = length(worldToEye);
  const distortion = surfaceNormal.xz.mul(float(0.001).add(float(1.0).div(distance))).mul(distortionScale);
  material.colorNode = Fn(() => {
    const mirror = reflector({ resolutionScale: 0.5 });
    mirror.uvNode = mirror.uvNode!.add(distortion);
    adopt(mirror.target);
    const theta = max(dot(eyeDirection, surfaceNormal), 0.0);
    const rf0 = float(0.02);
    const reflectance = mul(pow(float(1.0).sub(theta), 5.0), float(1.0).sub(rf0)).add(rf0);
    const scatter = waterC.mul(max(0.0, dot(surfaceNormal, eyeDirection)));
    const base: Vec3 = diffuseLight.mul(0.3).add(scatter);
    return base.mul(float(1).sub(reflectance)).add(mirror.rgb.add(specularLight).mul(reflectance));
  })();
  return material;
}
