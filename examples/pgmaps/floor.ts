// The ground's material: the demo's forest floor (src/ground/: soil with twigs and pebbles, the conifers' needle
// sprays over it and parallax relief, its maps built procedurally in its own workers) under the stand; out in the gaps
// a mossy, grassy floor; in the package's openings harvested ground (trampled duff, dry grass, mineral soil showing);
// on the road's cut and fill slopes exposed soil and rock; past the stand the far forest's dark mottle (PGMaps sends
// stems only near the road). Snow lies over all of it when the environment says so, deepest on open flat ground.
import * as THREE from 'three/webgpu';
import {
  Fn, texture, positionWorld, cameraPosition, cameraViewMatrix, normalWorld, float, vec2, vec3, vec4, mix, smoothstep,
  mx_noise_float, select, max, clamp, sqrt, fract, log2, length,
} from 'three/tsl';
import { reliefUv } from '../../src/ground/relief.ts';
import { FLOOR_TILE, HEIGHT_CM, type PBRData } from '../../src/ground/floor-maps.ts';
import { LEAF_TILE, LEAF_KINDS } from '../../src/ground/floor-leaves.ts';
import { asReceivedShadow, type Float, type Vec2, type Vec3 } from '../../src/nanite-lib/index.ts';
import type { GroundMasks } from './terrain.ts';

const SIZE = 1024;
const TILE = FLOOR_TILE; // (5 m a tile)
const NEEDLE_SCALE = FLOOR_TILE / LEAF_TILE.pine; // (the sprays' layer is 2.5 m a tile)
const RELIEF = { depth: HEIGHT_CM / 100, tile: TILE, fade: 40 };
/** Past this the litter's per-texel detail is averaged (the mips take over). */
const NEAR = 120;

type Pixels = { soil: PBRData; needles: Uint8ClampedArray<ArrayBuffer> };
let pixels: Promise<Pixels> | null = null;
/** The soil's maps and the needle sprays' layer, built once a page in two workers (src/ground/floor-worker.ts). */
function floorPixels(): Promise<Pixels> {
  const job = <T>(leaf: number | null): Promise<T> => new Promise((resolve, reject) => {
    const w = new Worker(new URL('../../src/ground/floor-worker.ts', import.meta.url), { type: 'module' });
    w.onmessage = (e: MessageEvent<{ out: T }>) => (w.terminate(), resolve(e.data.out));
    w.onerror = (e) => (w.terminate(), reject(new Error(`floor worker: ${e.message}`)));
    w.postMessage({ leaf, size: SIZE });
  });
  pixels ??= Promise.all([job<PBRData>(null), job<Uint8ClampedArray<ArrayBuffer>>(LEAF_KINDS.indexOf('pine'))]).then(([soil, needles]) => ({ soil, needles }));
  return pixels;
}

const tex = (px: Uint8ClampedArray, srgb: boolean): THREE.DataTexture => {
  const t = new THREE.DataTexture(new Uint8Array(px.buffer.slice(0)), SIZE, SIZE);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.magFilter = THREE.LinearFilter;
  t.minFilter = THREE.LinearMipmapLinearFilter;
  t.generateMipmaps = true;
  t.anisotropy = 8;
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  t.needsUpdate = true;
  return t;
};

export interface FloorInputs {
  masks: GroundMasks;
  snow: THREE.UniformNode<'float', number>;
  wet: THREE.UniformNode<'float', number>;
  /** The receivers' shadow node, fading to `far` past the shadow map (environment.ts). */
  fadeShadow: (far: Float) => unknown;
}

export async function floorMaterial(o: FloorInputs): Promise<THREE.MeshStandardNodeMaterial> {
  const px = await floorPixels();
  const maps = { map: tex(px.soil.albedo, true), normal: tex(px.soil.normal, false), height: tex(px.soil.rough, false), needles: tex(px.needles, false) };
  const { masks, snow } = o;
  const mat = new THREE.MeshStandardNodeMaterial({ roughness: 0.95, metalness: 0 });
  const p = positionWorld.xz; // (x east, z south)
  // the masks, looked up a little off (ragged edges, not the texels' straight ones)
  const jit = vec2(mx_noise_float(p.mul(0.31)), mx_noise_float(p.mul(0.31).add(17))).mul(1.4);
  const muv = vec2(p.x.add(jit.x).sub(masks.west).div(masks.side), p.y.add(jit.y).add(masks.north).div(masks.side));
  const inGrid = select(muv.x.greaterThan(0).and(muv.x.lessThan(1)).and(muv.y.greaterThan(0)).and(muv.y.lessThan(1)), float(1), float(0));
  const m = texture(masks.texture, muv);
  const wide = texture(masks.texture, muv).level(float(4)).r; // (the canopy over ~8 m round: the forest floor's extent)
  const cover = m.r.mul(inGrid), forest = smoothstep(0.08, 0.5, wide).mul(inGrid);
  const open = m.g.mul(inGrid), cut = m.b.mul(inGrid), fill = m.a.mul(inGrid);
  const flat = smoothstep(0.55, 0.93, normalWorld.y);
  const n1 = mx_noise_float(p.mul(0.07)).mul(0.5).add(0.5), n2 = mx_noise_float(p.mul(0.45).add(3)).mul(0.5).add(0.5);
  const n3 = mx_noise_float(p.mul(1.7).add(9)).mul(0.5).add(0.5);
  // how much snow lies: open flat ground most, under the crowns less (they hold it), patchy
  const snowCover = clamp(snow.mul(flat.mul(0.8).add(0.25).mul(mix(float(1), float(0.5), cover)).add(open.mul(0.3)).sub(n2.mul(0.25)).add(0.12)), 0, 1).toVar();

  const tilt = vec2(0).toVar();
  mat.colorNode = Fn(() => {
    const dist = positionWorld.sub(cameraPosition).length().toVar();
    const uv0 = p.div(TILE).toVar();
    const duv = { x: uv0.dFdx().toVar(), y: uv0.dFdy().toVar() };
    const near = float(1).sub(smoothstep(NEAR * 0.6, NEAR, dist)).toVar();
    // the needles that lie: by their layer's key under the amount fallen (under the crowns, thin in a cut block)
    const amount = clamp(mix(float(0.25), float(0.95), forest).mul(float(1).sub(cut.add(fill))).add(open.mul(-0.1)), 0, 1).toVar();
    const needleAt = (q: Vec2, dx: Vec2, dy: Vec2) => texture(maps.needles, q.mul(NEEDLE_SCALE)).level(log2(max(sqrt(length(dx).mul(length(dy))).mul(NEEDLE_SCALE * SIZE), 1)));
    const lies = (lf: ReturnType<typeof needleAt>): Float => select(lf.r.greaterThan(0.003).and(lf.a.sub(0.1).div(0.9).lessThan(amount)), float(1), float(0));
    const sample = (_t: THREE.Texture, q: Vec2, dx: Vec2, dy: Vec2): Float => {
      const lf = needleAt(q, dx, dy);
      return max(texture(maps.height, q).grad(dx, dy).r, lf.r.mul(lies(lf)));
    };
    const uv = reliefUv(maps.height, uv0, duv.x, duv.y, RELIEF, sample, near.mul(float(1).sub(snowCover)));
    // (last-stand's colours, x 2 for this light, its pale pebbles toned down: in full sun they read as white dots)
    const raw0 = texture(maps.map, uv).grad(duv.x, duv.y).rgb.mul(2);
    const raw = raw0.mul(float(0.5).div(raw0.add(0.25)).min(1.2));
    const baseH = texture(maps.height, uv).grad(duv.x, duv.y).r;
    const nmBase = texture(maps.normal, uv).grad(duv.x, duv.y).xyz.mul(2).sub(1);
    const lf = needleAt(uv, duv.x, duv.y);
    const on = mix(lies(lf).mul(select(lf.r.greaterThan(baseH), float(1), float(0))), amount.mul(0.85), float(1).sub(near));
    // conifer litter: rust-brown sprays, darker in the lower layers, varied per spray
    const key = mix(lf.a, float(0.6), float(1).sub(near));
    const needle = vec3(0.22, 0.125, 0.07).mul(mix(float(0.55), float(1.1), key)).mul(fract(key.mul(37.1)).mul(0.3).add(0.85));
    const litter = mix(raw, needle, on).toVar();
    // moss in large patches over the litter, less where the needles lie thick
    const moss = smoothstep(0.5, 0.72, n1.mul(0.7).add(n2.mul(0.3))).mul(0.55).mul(float(1).sub(on.mul(0.7)));
    litter.assign(mix(litter, vec3(0.05, 0.095, 0.03).mul(n3.mul(0.3).add(0.85)), moss));
    // the gaps in the stand: grass and moss over the soil
    const grass = mix(vec3(0.11, 0.14, 0.05), vec3(0.19, 0.2, 0.09), n1).mul(n3.mul(0.3).add(0.85));
    const gap = mix(raw, grass, smoothstep(0.3, 0.7, n2.mul(0.6).add(0.4)).mul(0.75));
    const colour = mix(gap, litter, forest).toVar();
    // a cut block: trampled duff and soil, dry grass and fireweed coming in, the skid trails' mineral soil
    const duff = raw.mul(vec3(1.08, 1.0, 0.92));
    const dryGrass = vec3(0.2, 0.18, 0.1).mul(n3.mul(0.4).add(0.75));
    const mineral = vec3(0.3, 0.24, 0.17).mul(n3.mul(0.25).add(0.85));
    const fine = mx_noise_float(p.mul(6.3)).mul(0.5).add(0.5); // (tufts: a few decimetres)
    const harvested = mix(mix(duff, dryGrass, smoothstep(0.35, 0.75, n2.mul(0.6).add(fine.mul(0.4))).mul(0.6)), mineral, smoothstep(0.66, 0.82, n1).mul(0.45));
    colour.assign(mix(colour, mix(harvested, needle, on.mul(0.6)), open));
    // road cut: mineral soil and rock; fill: grey-brown gravel
    const rock = vec3(0.4, 0.39, 0.36).mul(n3.mul(0.3).add(0.8));
    const cutCol = mix(vec3(0.44, 0.33, 0.21).mul(n2.mul(0.25).add(0.85)), rock, smoothstep(0.4, 0.7, mx_noise_float(p.mul(0.9)).mul(0.5).add(0.5)));
    const fillCol = mix(vec3(0.38, 0.35, 0.3), raw.mul(1.4), 0.35).mul(n3.mul(0.2).add(0.9));
    colour.assign(mix(colour, cutCol, cut));
    colour.assign(mix(colour, fillCol, fill.mul(float(1).sub(cut))));
    // past the stand (no stems sent there): the far forest's canopy, mottled, under the fog
    const farForest = mix(vec3(0.045, 0.075, 0.04), vec3(0.08, 0.11, 0.055), n1).mul(n2.mul(0.3).add(0.8));
    colour.assign(mix(farForest, colour, inGrid));
    // snow over it all
    // (wet after rain: darker)
    colour.assign(colour.mul(float(1).sub(o.wet.mul(0.35))));
    // snow: drifted a little (large and small undulations in its brightness), bluish where it's thin
    const drift = mx_noise_float(p.mul(0.9).add(5)).mul(0.5).add(0.5);
    const snowCol = mix(vec3(0.58, 0.62, 0.7), vec3(0.72, 0.74, 0.78), smoothstep(0.2, 0.7, snowCover)).mul(n2.mul(0.1).add(drift.mul(0.06)).add(0.88));
    colour.assign(mix(colour, snowCol, snowCover));
    // the maps' normals on the terrain's, none under the snow (v runs along +z: dh/dz = g)
    const nm = mix(nmBase, vec3(lf.g.mul(2).sub(1), lf.b.mul(2).sub(1), 0.5), on.mul(near));
    tilt.assign(vec2(nm.x, nm.y.negate()).mul(near.mul(0.8).mul(float(1).sub(snowCover)).mul(inGrid)));
    return colour;
  })();
  const nW = normalWorld.add(vec3(tilt.x, 0, tilt.y)).normalize();
  mat.normalNode = cameraViewMatrix.mul(vec4(nW, 0)).xyz.normalize();
  mat.roughnessNode = mix(mix(float(0.95), float(0.55), o.wet), float(0.8), snowCover);
  // past the shadow map: darkened by the canopy over it (the far forest as a full one)
  const far = float(1).sub(max(wide.mul(inGrid), float(1).sub(inGrid).mul(0.8)).mul(0.6));
  mat.receivedShadowNode = asReceivedShadow(o.fadeShadow(far));
  return mat;
}

/** Snow on a material's colour from above (debris and the like): `amount` of the snow uniform where it faces up. */
export const snowOn = (colour: Vec3, snow: Float, strength = 0.85): Vec3 =>
  mix(colour, vec3(0.7, 0.73, 0.78), clamp(snow.mul(smoothstep(0.35, 0.8, normalWorld.y)).mul(strength), 0, 1));
