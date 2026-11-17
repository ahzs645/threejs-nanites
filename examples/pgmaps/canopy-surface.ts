// The canopy surface: past the cut-off (a tree under ~4 px tall, VNS's "dissolve" rule: far-forest.ts cutoffMeters)
// the forest is the terrain raised by its stand's height where the crown closure says forest, coloured by its
// species mix (the stand patches' own mean albedo: no step at the switch) and closure, lit like the slabs (Lambert,
// the average self-shadow past the shadow map, so a slope away from the sun is the shadowed side), with mottling
// stretched up and down at crown-cluster scales (stems read as vertical texture, not round blobs) and dark gaps
// between them. It shares the terrain's geometry (no copy); ridgelines carry the canopy's height as a silhouette.
// Nearer than the cut-off it draws nothing: the slabs and the stand's own stems do (the same dither splits a pixel
// in the cross-fade, stand-patches.ts). In a flat pass it is its ground's class colour, or the vegetation colour on
// unlisted ground (the stems' rule), cut where the closure is under the forest threshold.
// On the package's rock, herb and shrub posts (ground-cover.ts) it is neither raised (read per vertex, at the posts'
// own spacing, not the field's coarser cells) nor drawn: the floor draws that ground as itself.
// The spires are laid in the view's frame at a set number of pixels (pixel-pattern.ts): narrow and tall at every
// distance, never the ground's noise foreshortened into horizontal smears; the gaps between them narrow and dark.
// On burnt ground (burnt.ts) it is a snag stand: raised less (trunks, no crown layer), its regrowth's colour by the
// years since the fire under the renders' darker grey-green, streaked by charred trunks; in the flat pass it keeps
// only SNAG_SCREEN of its pixels, in narrow columns (snags screen far less than a live stand).
import * as THREE from 'three/webgpu';
import {
  Fn, If, Discard, cameraPosition, cameraViewMatrix, cameraWorldMatrix, float, vec2, vec3, vec4, positionLocal, positionWorld, normalWorld, select, texture, uniform, smoothstep, mix,
  clamp, length, abs,
} from 'three/tsl';
import { setEmissive, type Float, type Vec2, type Vec3 } from '../../src/nanite-lib/index.ts';
import { canopyShare, graded, hiddenByStand, splitDither, type FarUniforms } from './stand-patches.ts';
import { makeFbm } from '../../src/ground/floor-maps.ts';
import type { CanopyField } from './far-forest.ts';
import { burnAt, coverWeights, type CoverAtlas } from './cover-shading.ts';
import { screenColumns, screenNoise, viewFrame } from './pixel-pattern.ts';
import { BURN_PALETTE, BURN_STAGES, SNAG_RAISE, SNAG_SCREEN } from './burnt.ts';

/** The share of the canopy surface its crowns' gaps take (about: the spires' noise past the gap threshold), and their shade. */
const GAP_SHARE = 0.35, GAP_SHADE = 0.32;

/** Under this closure the canopy surface draws nothing (the ground shows): open ground and fresh cuts. */
const FOREST_CLOSURE = 0.12;

/** The noise texture's period (cells of the noise a tile). */
const NOISE_PERIOD = 8;
let noiseTex: THREE.DataTexture | null = null;
/** A tiling fractal noise (256 texels, NOISE_PERIOD cells across), mipmapped: made once a page. */
function noiseTexture(): THREE.DataTexture {
  if (noiseTex) return noiseTex;
  const N = 256, f = makeFbm(41, NOISE_PERIOD, 3), px = new Uint8Array(N * N * 4);
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) px.fill(Math.round(Math.min(1, Math.max(0, f(x / N, y / N))) * 255), (y * N + x) * 4, (y * N + x) * 4 + 4);
  const t = new THREE.DataTexture(px, N, N);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.magFilter = THREE.LinearFilter;
  t.minFilter = THREE.LinearMipmapLinearFilter;
  t.generateMipmaps = true;
  t.needsUpdate = true;
  return (noiseTex = t);
}

/** A field's two textures: (closure, height, known, 1) and the colour (linear), half floats, filtered. */
function fieldTextures(f: CanopyField): { stand: THREE.DataTexture; colour: THREE.DataTexture } {
  const half = (a: Float32Array) => {
    const out = new Uint16Array(a.length);
    for (let i = 0; i < a.length; i++) out[i] = THREE.DataUtils.toHalfFloat(a[i]);
    return out;
  };
  const make = (a: Float32Array) => {
    const t = new THREE.DataTexture(half(a), f.columns, f.rows, THREE.RGBAFormat, THREE.HalfFloatType);
    t.magFilter = THREE.LinearFilter;
    t.minFilter = THREE.LinearFilter;
    t.generateMipmaps = false;
    t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;
    t.needsUpdate = true;
    return t;
  };
  return { stand: make(f.stand), colour: make(f.colour) };
}

export interface CanopySurface {
  mesh: THREE.Mesh;
  /** Its colour's gain (a calibration against the slabs' mean at the switch). */
  gain: THREE.UniformNode<'float', number>;
  dispose(): void;
}

/**
 * The surface over `geometry` (the terrain's, world positions: x east, y up, z south). `classColour`: the flat
 * pass's colour at positionWorld (the class drape, the vegetation colour on unlisted ground).
 */
export function buildCanopySurface(geometry: THREE.BufferGeometry, field: CanopyField, u: FarUniforms, receivedShadow: unknown, classColour: Vec3, cover: CoverAtlas | null = null, viewYear: Float = float(2025.5)): CanopySurface {
  /** The share of the ground that is rock, herb or shrub (none raised or drawn), at package (x, y). */
  const bare = (x: Float, y: Float, vertex: boolean): Float => {
    if (!cover) return float(0);
    const w = coverWeights(cover, vec2(x, y), vertex);
    return clamp(w.y.add(w.z).add(w.w), 0, 1);
  };
  const tex = fieldTextures(field);
  const gain = uniform(1);
  // (package x east = world x, y north = -world z; texel centres at cell middles)
  const uvAt = (x: Float, z: Float): Vec2 => vec2(x.sub(field.west).div(field.cell * field.columns), z.negate().sub(field.south).div(field.cell * field.rows));
  const inside = (uv: Vec2) => uv.x.greaterThanEqual(0).and(uv.x.lessThanEqual(1)).and(uv.y.greaterThanEqual(0)).and(uv.y.lessThanEqual(1));
  const material = new THREE.MeshLambertNodeMaterial();
  material.positionNode = Fn(() => {
    const uv = uvAt(positionLocal.x, positionLocal.z);
    const s = texture(tex.stand, uv).level(float(0));
    const forest = select(inside(uv), smoothstep(float(FOREST_CLOSURE * 0.6), float(0.35), s.x), float(0));
    const keep = float(1).sub(smoothstep(0.05, 0.5, bare(positionLocal.x, positionLocal.z.negate(), true)));
    // (a snag stand: its trunks' height, less than a crown layer's)
    const burnt = cover?.burn ? burnAt(cover, vec2(positionLocal.x, positionLocal.z.negate()), viewYear, true).share : float(0);
    return positionLocal.add(vec3(0, s.y.mul(forest).mul(keep).mul(0.92).mul(float(1).sub(burnt.mul(1 - SNAG_RAISE))), 0));
  })();
  const p = positionWorld;
  const noiseTex = texture(noiseTexture());
  /** A tiling noise in -1..1 at `xy` (cells of one unit), mipmapped: cheaper than Perlin per pixel, filtered by the pixel. */
  const noise = (xy: Vec2): Float => noiseTex.sample(xy.div(NOISE_PERIOD)).r.mul(2).sub(1);
  // (the edges ragged, not the field's cells: looked up a little off)
  const jitter = vec2(noise(p.xz.mul(0.011)), noise(p.xz.mul(0.011).add(19.3))).mul(field.cell * 0.45);
  const uv = uvAt(p.x.add(jitter.x), p.z.add(jitter.y));
  const s = texture(tex.stand, uv);
  const closure = select(inside(uv), s.x, float(0));
  const dist = length(p.sub(cameraPosition));
  // the spires: in (across the view, height) metres at a set number of pixels (pixel-pattern.ts), tall and narrow,
  // crowns a pixel or two across with clusters of them a few pixels across
  const { q, foot, dist: qd } = viewFrame();
  const spires = screenNoise(q, foot, qd, { px: 1.1, stretch: 5, minCell: 4, offset: 3.1 }).mul(0.65)
    .add(screenNoise(q, foot, qd, { px: 3.2, stretch: 4, minCell: 12, offset: 7.7 }).mul(0.35)).toVar();
  // (the stands' tone over hundreds of metres, on the ground: held low, since a grazing look lays it in level bands)
  const stands = noise(p.xz.mul(0.004).add(23.1)).mul(0.07).add(noise(p.xz.mul(0.0011).add(29.3)).mul(0.05));
  // the dark gaps between crowns (shade under the canopy): narrow, wider and more where the stand is open
  const open = float(1).sub(clamp(closure, 0, 1));
  const gap = smoothstep(float(0.2).sub(open.mul(0.25)), float(0.65).sub(open.mul(0.25)), spires.negate()).toVar();
  // (the crowns lifted by what the gaps take, so the surface's mean stays the slabs' at the switch: the gaps cover
  // about GAP_SHARE of it, at GAP_SHADE)
  const shade = mix(float(1), float(GAP_SHADE), gap).div(1 - GAP_SHARE * (1 - GAP_SHADE));
  const base = texture(tex.colour, uv).rgb.mul(gain);
  const burn = cover?.burn ? burnAt(cover, vec2(p.x, p.z.negate()), viewYear) : null;
  // (rock under a standing stand, ground-cover.ts rockyStand: pale rock in the gaps between its crowns)
  const rockGap = burn ? gap.mul(burn.rocky).mul(0.75) : float(0);
  const live = mix(base.mul(spires.mul(0.2).add(stands).add(1)).mul(shade), vec3(0.3, 0.28, 0.22), rockGap);
  // a snag stand on burnt ground: its regrowth by the years since the fire (burnt.ts regrowth) under the renders'
  // darker grey-green, charred trunks in narrow dark columns, the herbs lighter between them
  const burnt = burn ? burn.share.toVar() : float(0);
  let colour: Vec3 = live as Vec3;
  if (burn) {
    const B = BURN_PALETTE, S = BURN_STAGES, age = burn.age;
    const c = (rgb: readonly number[]) => vec3(rgb[0], rgb[1], rgb[2]);
    const regrown = mix(mix(mix(c(B.ash), c(B.herb), smoothstep(0, S.herbFull, age)), c(B.shrub), smoothstep(S.shrubStart, S.shrubFull, age)), c(B.regen), smoothstep(S.regenStart, S.regenFull, age));
    const trunks = smoothstep(0.05, 0.5, screenNoise(q, foot, qd, { px: 1, stretch: 7, minCell: 3, offset: 11.3 }).negate());
    // (mostly its regrowth: a snag stand's crowns are gone, so it reads lighter than the live forest round it)
    const snagStand = mix(mix(c(B.farStand), regrown, 0.7).mul(spires.mul(0.15).add(stands).add(1)), c(B.snag), trunks.mul(0.6)).mul(mix(float(1), float(0.7), gap));
    colour = mix(live, snagStand, burnt) as Vec3;
  }
  material.colorNode = Fn(() => {
    // where it is drawn: past the cut-off (the dither split with the slabs), on forest, not a final stand's ground;
    // out first, before the texture work (most of the screen is nearer than the cut-off)
    const share = canopyShare(dist, u);
    If(splitDither(u).greaterThanEqual(share), () => Discard());
    If(closure.lessThanEqual(FOREST_CLOSURE).or(hiddenByStand(p.x, p.z.negate(), u)).or(bare(p.x, p.z.negate(), false).greaterThan(0.5)), () => Discard());
    // (a snag stand screens only its trunks' share in the flat pass)
    if (burn) If(u.flat.greaterThan(0.5).and(burnt.greaterThan(0.5)).and(screenColumns(q, foot, qd, SNAG_SCREEN, { px: 1, stretch: 6, minCell: 3, offset: 5.9 }).lessThan(0.5)), () => Discard());
    return vec4(select(u.flat.greaterThan(0.5), vec3(0), graded(colour, u)), 1);
  })();
  setEmissive(material, select(u.flat.greaterThan(0.5), classColour, vec3(0)));
  // a crown's rounded top: the normal tipped toward the view's sides by the spires' slope across the screen (a lit
  // and a shaded side), a little: the spires change a pixel or two apart, and a full tilt turned whole slopes from the
  // sun (black far hills)
  material.normalNode = Fn(() => {
    const right = cameraWorldMatrix.mul(vec4(1, 0, 0, 0)).xyz;
    const tilt = clamp(spires.dFdx().mul(0.12), -0.3, 0.3);
    const nw = normalWorld.add(right.mul(tilt)).normalize();
    return cameraViewMatrix.mul(vec4(nw, 0)).xyz.normalize();
  })();
  (material as THREE.NodeMaterial).receivedShadowNode = receivedShadow as () => THREE.Node;
  const mesh = new THREE.Mesh(geometry, material);
  mesh.frustumCulled = false;
  mesh.receiveShadow = true;
  mesh.name = 'canopy-surface';
  geometry.computeBoundingBox();
  if(geometry.boundingBox){let height=0;for(let k=1;k<field.stand.length;k+=4)height=Math.max(height,field.stand[k]);
    geometry.boundingBox.max.y+=height;geometry.boundingSphere=geometry.boundingBox.getBoundingSphere(new THREE.Sphere());}
  return { mesh, gain, dispose: () => (material.dispose(), tex.stand.dispose(), tex.colour.dispose()) };
}
