// The ground's material: the demo's forest floor (src/ground/: soil with twigs and pebbles, the conifers' needle
// sprays over it and parallax relief, its maps built procedurally in its own workers) under the stand; out in the gaps
// a mossy, grassy floor; in the package's openings harvested ground greened up by the opening's age (soil and slash,
// shrubs coming in, green, a young stand: ground-look.ts); on the road's cut and fill slopes exposed soil and rock;
// past the near stand the forest as a canopy shaded by its crown closure (the package's `canopy`, else the stems'
// crowns averaged), finely textured, closed where the stand is closed and open where it is not. Snow lies over all of
// it when the environment says so, deepest on open flat ground.
// The package's natural cover (ground-cover.ts, cover-shading.ts) over all of it but the openings and road scars:
// rock bluffs and talus pale grey-tan, cracked and streaked down the fall line; herb openings yellow-green and tan;
// shrub dark olive and mottled; sparse forest light ground under a thinned canopy. Each graded by the look.
// Burnt ground (burnt.ts) is its regrowth by the years since the fire: charred duff and ash, the herb flush's pale
// yellow-green, grey-green shrubs, a young stand; far off a snag stand's shade streaked up and down. Under the `via`
// look a fresh cut (a year or less) is painted as the renders paint their blocks: pinkish-brown and tan with a fine
// slash speckle at the pixel's own scale (ground-look.ts VIA_CUT), lit by the terrain as before.
// The far stand's crowns (past the near square, between the slabs) are laid in the view's frame, narrow and tall
// (pixel-pattern.ts), not as ground noise foreshortened into horizontal smears.
import * as THREE from 'three/webgpu';
import {
  Fn, texture, positionWorld, cameraPosition, cameraViewMatrix, normalWorld, float, vec2, vec3, vec4, mix, smoothstep,
  mx_noise_float, select, max, min, clamp, sqrt, fract, log2, length, pow, abs,
} from 'three/tsl';
import { reliefUv } from '../../src/ground/relief.ts';
import { FLOOR_TILE, HEIGHT_CM, type PBRData } from '../../src/ground/floor-maps.ts';
import { LEAF_TILE, LEAF_KINDS } from '../../src/ground/floor-leaves.ts';
import { asReceivedShadow, type Float, type Vec2, type Vec3 } from '../../src/nanite-lib/index.ts';
import type { CanopyTexture, GroundMasks } from './terrain.ts';
import { AGE_SCALE, CUT_STAGES, DEFAULT_CUT_AGE, OBLIQUE_EXPONENT, RESIDUAL_GREEN, SHRUB_SHARE, VIA_CUT } from './ground-look.ts';
import { burnAt, coverWeights, gradedCover, skylineWater, type CoverGrade } from './cover-shading.ts';
import { BURN_PALETTE, BURN_STAGES } from './burnt.ts';
import { screenNoise, viewFrame, volumeNoise } from './pixel-pattern.ts';
import { CANOPY_KEEP, COVER } from './ground-cover.ts';

const SIZE = 1024;
const TILE = FLOOR_TILE; // (5 m a tile)
const NEEDLE_SCALE = FLOOR_TILE / LEAF_TILE.pine; // (the sprays' layer is 2.5 m a tile)
const RELIEF = { depth: HEIGHT_CM / 100, tile: TILE, fade: 40 };
/** Past this the litter's per-texel detail is averaged (the mips take over). */
const NEAR = 120;
/** Crown closure assumed where nothing says (the apron, posts with no record): a typical stand. */
const UNKNOWN_CLOSURE = 0.55;

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
  /** The look's grade of the natural cover's colours (cover-shading.ts). */
  coverGrade: CoverGrade;
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
  // past the near square, a capture's far stand: its canopy cover (r) and openings (g), coarse (terrain.ts)
  const farMask = masks.far;
  const fuv = farMask ? vec2(p.x.sub(farMask.west).div(farMask.side), p.y.add(farMask.north).div(farMask.side)) : null;
  const inFar = farMask && fuv ? select(fuv.x.greaterThan(0).and(fuv.x.lessThan(1)).and(fuv.y.greaterThan(0)).and(fuv.y.lessThan(1)), float(1), float(0)).mul(float(1).sub(inGrid)) : float(0);
  const fm = farMask && fuv ? texture(farMask.texture, fuv) : null;
  const farOpen = fm ? fm.g.mul(inFar) : float(0);
  // the openings' ages (premultiplied by their coverage: terrain.ts), near or far
  const nearCuts = texture(masks.cuts, muv);
  const farCuts = farMask && fuv ? texture(farMask.cuts, fuv) : null;
  const openAll = open.add(farOpen);
  const ageLayer = nearCuts.r.mul(inGrid).add(farCuts ? farCuts.r.mul(inFar) : float(0));
  const cutAge = select(openAll.greaterThan(0.004), min(ageLayer.div(max(openAll, 1 / 255)), 1).mul(AGE_SCALE), float(DEFAULT_CUT_AGE)).toVar();
  // past the near square: the crown closure, by priority the detailed grid's posts, the far grid's, the stems' crowns
  // (package x east, y north; looked up a little off, so a coarse grid's stand edges are ragged, not its cells' lines)
  const pkg = vec2(p.x.add(mx_noise_float(p.mul(0.02).add(7)).mul(18)), p.y.negate().add(mx_noise_float(p.mul(0.02).add(13)).mul(18)));
  let closure: Float = float(UNKNOWN_CLOSURE);
  for (const c of [masks.canopy.stems, masks.canopy.skyline, masks.canopy.far, masks.canopy.near] as Array<CanopyTexture | null>) {
    if (!c) continue;
    const cuv = vec2(pkg.x.sub(c.west).div(c.spacing).add(0.5).div(c.columns), pkg.y.sub(c.south).div(c.spacing).add(0.5).div(c.rows));
    const inside = select(cuv.x.greaterThan(0).and(cuv.x.lessThan(1)).and(cuv.y.greaterThan(0)).and(cuv.y.lessThan(1)), float(1), float(0));
    const t = texture(c.texture, cuv);
    const known = smoothstep(0.3, 0.9, t.g).mul(inside);
    closure = mix(closure, min(t.r.div(max(t.g, 1 / 255)), 1), known);
  }
  // the natural cover's weights (cover-shading.ts: sparse, shrub, herb, rock), looked up off by a few metres as well
  // (a class's edge ragged at the posts' own scale, not the jitter's 18 m alone)
  const cw = masks.cover
    ? coverWeights(masks.cover, pkg.add(vec2(mx_noise_float(p.mul(0.09).add(3)), mx_noise_float(p.mul(0.09).add(5))).mul(5))).toVar()
    : vec4(0, 0, 0, 0);
  const wSparse = cw.x, wShrub = cw.y, wHerb = cw.z, wRock = cw.w;
  // the burn (burnt.ts): its share and the years since the fire, looked up off as the cover is
  const burn = masks.cover?.burn ? burnAt(masks.cover, pkg.add(vec2(mx_noise_float(p.mul(0.09).add(3)), mx_noise_float(p.mul(0.09).add(5))).mul(5)), o.coverGrade.viewYear) : null;
  const wBurn = burn ? burn.share.toVar() : float(0);
  const burnAge = burn ? burn.age.toVar() : float(0);
  // rock showing between a standing stand's crowns (ground-cover.ts rockyStand: PGMaps' rock posts that keep a canopy)
  const wRocky = burn ? burn.rocky.toVar() : float(0);
  const seaW = masks.cover?.sea ? skylineWater(masks.cover, vec2(p.x, p.y.negate())).toVar() : float(0);
  // the share of the closure the ground keeps (ground-cover.ts CANOPY_KEEP): rock, herb and shrub none, sparse some
  // (and on burnt ground none of the live crowns: its snag stand is drawn as itself)
  const keepCanopy = clamp(float(1).sub(wRock.mul(1 - CANOPY_KEEP[COVER.rock])).sub(wHerb.mul(1 - CANOPY_KEEP[COVER.herb]))
    .sub(wShrub.mul(1 - CANOPY_KEEP[COVER.shrub])).sub(wSparse.mul(1 - CANOPY_KEEP[COVER.sparse])).sub(wBurn), 0, 1);
  // how much of the ground the crowns hide from the side (ground-look.ts visibleCover), none in an opening
  const farCover = float(1).sub(pow(float(1).sub(clamp(closure.mul(keepCanopy), 0, 1)), OBLIQUE_EXPONENT)).mul(float(1).sub(farOpen)).toVar();
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
    // detail at a scale the pixel can carry: an octave of noise fades out as the pixel's footprint nears its size
    const foot = sqrt(length(p.dFdx()).mul(length(p.dFdy()))).max(0.01).toVar();
    const octave = (freq: number, offset: number): Float => mx_noise_float(p.mul(freq).add(offset)).mul(float(1).sub(smoothstep(0.2, 0.45, foot.mul(freq))));
    const meanKeeping = (share: Float, detail: Float): Float => clamp(share.add(detail.mul(float(1).sub(abs(share.mul(2).sub(1)).mul(0.6)))), 0, 1);
    // the cut by its age (ground-look.ts): soil and slash, shrubs coming in over the brown, green, a young stand
    // (slash and soil in streaks and patches a few to tens of metres across, the skid trails' darker lines)
    const m1 = octave(0.55, 21), m2 = octave(0.14, 33), m4 = octave(0.055, 37), m3 = mx_noise_float(p.mul(0.03).add(41));
    const soil = vec3(0.17, 0.12, 0.078).mul(m1.mul(0.12).add(1));
    const slash = vec3(0.175, 0.152, 0.122).mul(m1.mul(0.18).add(0.95));
    const fresh = mix(soil, slash, meanKeeping(float(0.45), m2.mul(0.6).add(m4.mul(0.6)).add(m1.mul(0.3))))
      .mul(m4.mul(0.12).add(m2.mul(0.08)).add(m3.mul(0.05)).add(1)).toVar();
    // (near the eye, the trampled duff's own texture)
    fresh.assign(mix(harvested, fresh, smoothstep(NEAR * 0.5, NEAR * 1.4, dist)));
    const s = CUT_STAGES;
    const grown = smoothstep(s.shrubStart, s.shrubFull, cutAge).mul(SHRUB_SHARE).add(smoothstep(s.shrubFull, s.greenFull, cutAge).mul(1 - SHRUB_SHARE));
    const greenAt = grown.mul(1 - RESIDUAL_GREEN).add(RESIDUAL_GREEN);
    // (shrubs and seedlings: lighter than the old stand's crowns, not a lawn's yellow-green)
    const shrubs = mix(vec3(0.045, 0.072, 0.03), vec3(0.07, 0.095, 0.04), smoothstep(-0.3, 0.5, m4)).mul(m1.mul(0.2).add(m2.mul(0.12)).add(1));
    const greened = mix(fresh, shrubs, meanKeeping(greenAt, m2.mul(0.6).add(m4.mul(0.5)).add(m3.mul(0.15))));
    // a young stand: a closed canopy of small crowns, a lighter green than the old stand's
    const young = vec3(0.05, 0.082, 0.037).mul(octave(0.3, 51).mul(0.3).add(octave(0.07, 53).mul(0.25)).add(m4.mul(0.1)).add(1));
    const cutLook = mix(greened, young, smoothstep(s.standStart, s.standFull, cutAge)).toVar();
    // the `via` look's fresh cut (ground-look.ts VIA_CUT): pinkish-brown and tan, a fine speckle of bleached slash and
    // the shade between it at the pixel's own scale (so a block 5 km off is speckled as the renders' are, not flat),
    // patches of it tens of metres across; the terrain's light on it as on any ground
    // (3D noise on the ground itself, cells a pixel or two across: on a far slope a pixel's height spans more ground than
    // its width, so the speckle never smears level; near the eye its cells stay decimetres, never the view's bands)
    const { q: vq, foot: vfoot, dist: vdist } = viewFrame();
    const speck = volumeNoise(positionWorld, vfoot, vdist, { px: 1, minCell: 0.3, offset: 131 }).mul(0.8)
      .add(volumeNoise(positionWorld, vfoot, vdist, { px: 2.6, minCell: 1.2, offset: 137 }).mul(0.3)).toVar();
    const vc = (rgb: readonly number[]) => vec3(rgb[0], rgb[1], rgb[2]);
    const viaPatch = m2.mul(0.5).add(m4.mul(0.5)).add(m3.mul(0.3));
    const viaCut = mix(mix(vc(VIA_CUT.base), vc(VIA_CUT.dark), smoothstep(0.35, 0.9, speck.negate()).mul(0.65)), vc(VIA_CUT.light), smoothstep(0.3, 0.85, speck).mul(0.7))
      .mul(viaPatch.mul(0.07).add(1));
    const viaShare = o.coverGrade.via.mul(float(1).sub(smoothstep(VIA_CUT.maxAge, VIA_CUT.maxAge + VIA_CUT.fade, cutAge)));
    cutLook.assign(mix(cutLook, viaCut, viaShare));
    colour.assign(mix(colour, mix(cutLook, needle, on.mul(0.6).mul(near)), open));
    // the natural cover (ground-cover.ts): its colours at scales a 2-10 km pixel carries (tens of metres) and finer
    // ones that fade with the pixel's footprint (octave), so the far face reads by its classes' mean tone
    const steep = float(1).sub(smoothstep(0.6, 0.8, normalWorld.y)).toVar(); // (past ~40 degrees: a bluff's face)
    const r1 = octave(0.022, 101), r2 = octave(0.09, 103), r3 = octave(0.35, 107), r4 = octave(1.4, 109);
    // rock: pale grey-tan, its tone varying over a hundred metres, lighter talus and darker weathered faces
    // (pale, not white: lit, the renders' bluffs read about sRGB #b4aa94 at their lightest)
    const rockTone = mix(vec3(0.4, 0.36, 0.27), vec3(0.5, 0.455, 0.34), smoothstep(-0.5, 0.6, r1.mul(0.6).add(r2.mul(0.4))));
    // cracks and gullies down the fall line (noise stretched along the height: streaks on a face, not blotches)
    const fallFoot = float(1).sub(smoothstep(0.2, 0.45, foot.mul(0.1)));
    const streak = mx_noise_float(vec3(p.x.mul(0.1), positionWorld.y.mul(0.012), p.y.mul(0.1)).add(31)).mul(fallFoot);
    const gully = smoothstep(0.72, 0.95, float(1).sub(abs(octave(0.03, 113))));
    const crackShade = clamp(gully.mul(0.3).add(streak.mul(0.5).add(0.5).mul(steep).mul(0.3)), 0, 0.6);
    // ledges: the odd shrub and tree in them (dark olive flecks a few metres across, their mean kept far off)
    const fleck = meanKeeping(float(0.12).mul(float(1).sub(steep.mul(0.5))), r3.mul(0.5).add(r4.mul(0.4)).sub(0.25));
    // talus below the faces: lighter and finer grained, on the gentler rock
    const talus = vec3(0.48, 0.44, 0.34).mul(r4.mul(0.12).add(r3.mul(0.08)).add(1));
    const rockFace = rockTone.mul(r2.mul(0.08).add(r3.mul(0.1)).add(r4.mul(0.08)).add(1)).mul(float(1).sub(crackShade))
      .mul(mix(float(1), float(0.86), steep)); // (a face's own shading: overhangs and weathering)
    const rockCol = mix(mix(talus, rockFace, smoothstep(0.15, 0.6, steep)), vec3(0.05, 0.065, 0.035), fleck);
    // herb: yellow-green grass and tan, in drifts tens of metres across
    const herbCol = mix(vec3(0.15, 0.18, 0.055), vec3(0.24, 0.21, 0.11), smoothstep(-0.35, 0.5, r1.mul(0.4).add(r2.mul(0.5)).add(r3.mul(0.3))))
      .mul(r3.mul(0.1).add(r4.mul(0.1)).add(1));
    // shrub: low, dark olive, mottled in clumps a few metres across with darker gaps and the odd herb opening
    const clump = smoothstep(0.35, 0.75, r3.mul(0.6).add(r4.mul(0.4)).mul(0.5).add(0.5));
    const shrubCol = mix(mix(vec3(0.05, 0.062, 0.03), vec3(0.075, 0.088, 0.042), smoothstep(-0.4, 0.5, r2)).mul(mix(float(1), float(0.6), clump.mul(0.6))),
      herbCol.mul(0.8), smoothstep(0.45, 0.8, r1.mul(0.5).add(r2.mul(0.5))).mul(0.25));
    // sparse forest's ground: dry grass, light, some rock showing
    const sparseGround = mix(herbCol.mul(vec3(1.05, 1, 0.95)), rockTone.mul(0.85), smoothstep(0.2, 0.7, r2.mul(0.5).add(0.5)).mul(0.3));
    const natW = clamp(wRock.add(wHerb).add(wShrub), 0, 1).toVar();
    const natural = gradedCover(rockCol.mul(wRock).add(herbCol.mul(wHerb)).add(shrubCol.mul(wShrub)).div(max(natW, 1e-3)), o.coverGrade).toVar();
    const sparseCol = gradedCover(sparseGround, o.coverGrade);
    // near: over the floor but the openings, herb, shrub and sparse ground thinner under the stand's own crowns
    const notCut = float(1).sub(open);
    colour.assign(mix(colour, sparseCol, wSparse.mul(float(1).sub(forest.mul(0.7))).mul(0.85).mul(notCut)));
    colour.assign(mix(colour, natural, wRock.add(wHerb.add(wShrub).mul(float(1).sub(forest.mul(0.6)))).min(1).mul(notCut)));
    // burnt ground (burnt.ts regrowth): charred duff and grey ash, the herb flush's pale yellow-green in drifts, grey-green
    // shrubs coming in in clumps, then a young stand; the snags stand over it (the stand's own stems)
    const B = BURN_PALETTE, S = BURN_STAGES;
    const bc = (rgb: readonly number[]) => vec3(rgb[0], rgb[1], rgb[2]);
    const ash = mix(bc(B.ash), bc(B.ashGrey), smoothstep(0.1, 0.7, r2.mul(0.5).add(r3.mul(0.5)).mul(0.5).add(0.5)).mul(0.6));
    const flush = mix(bc(B.herb), bc(B.herbDry), smoothstep(-0.3, 0.6, r1.mul(0.5).add(r2.mul(0.4)).add(r3.mul(0.2)))).mul(r3.mul(0.1).add(r4.mul(0.1)).add(1));
    const shrubClumps = meanKeeping(smoothstep(S.shrubStart, S.shrubFull, burnAge), r2.mul(0.5).add(r3.mul(0.4)).add(r1.mul(0.3)));
    const burntGround = gradedCover(mix(mix(mix(ash, flush, smoothstep(0, S.herbFull, burnAge)), bc(B.shrub).mul(r3.mul(0.15).add(1)), shrubClumps),
      young, smoothstep(S.regenStart, S.regenFull, burnAge)), o.coverGrade).toVar();
    colour.assign(mix(colour, burntGround, wBurn.mul(notCut)));
    // rock under a standing stand: the rock between its crowns, shaded a little under them
    const rockUnder = gradedCover(rockCol.mul(0.85), o.coverGrade);
    colour.assign(mix(colour, rockUnder, wRocky.mul(notCut).mul(float(1).sub(forest.mul(0.45)))));
    // road cut: mineral soil and rock; fill: grey-brown gravel
    const rock = vec3(0.4, 0.39, 0.36).mul(n3.mul(0.3).add(0.8));
    const cutCol = mix(vec3(0.44, 0.33, 0.21).mul(n2.mul(0.25).add(0.85)), rock, smoothstep(0.4, 0.7, mx_noise_float(p.mul(0.9)).mul(0.5).add(0.5)));
    const fillCol = mix(vec3(0.38, 0.35, 0.3), raw.mul(1.4), 0.35).mul(n3.mul(0.2).add(0.9));
    colour.assign(mix(colour, cutCol, cut));
    colour.assign(mix(colour, fillCol, fill.mul(float(1).sub(cut))));
    // past the near square: the forest as a canopy by its closure, crowns a few metres across over shaded ground,
    // the stands' tone varying over a hundred metres or so; open ground (closure 0) the gaps' grass and soil
    // (crowns ~6 m and their clusters ~18 m: what a 2-10 km pixel can carry; the stands' tone over 80 m and 300 m)
    // (the crowns laid in the view's frame, narrow and tall at a pixel or two: pixel-pattern.ts)
    const f1 = screenNoise(vq, vfoot, vdist, { px: 1.1, stretch: 5, minCell: 4, offset: 61 }), f2 = screenNoise(vq, vfoot, vdist, { px: 3, stretch: 4, minCell: 10, offset: 71 });
    const g1 = octave(0.055, 75), f3 = mx_noise_float(p.mul(0.012).add(81)), f4 = mx_noise_float(p.mul(0.0035).add(91));
    const crowns = meanKeeping(farCover, f1.mul(0.7).add(f2.mul(0.35)).add(g1.mul(0.2)));
    const crownCol = mix(vec3(0.05, 0.08, 0.04), vec3(0.08, 0.105, 0.05), smoothstep(0.1, 0.8, f4).mul(0.5))
      .mul(f3.mul(0.08).add(1)).mul(f2.mul(0.12).add(g1.mul(0.06)).add(1));
    // (open ground far off: grass, rock and soil muted together, not the stand gaps' bright grass)
    const openFar = mix(gap.mul(0.75), vec3(0.14, 0.13, 0.105).mul(m4.mul(0.15).add(m3.mul(0.1)).add(1)), 0.55);
    const under = mix(mix(openFar, gap.mul(0.35), smoothstep(0, 0.6, farCover)), sparseCol, wSparse);
    // (the natural cover over the stand where the ground keeps none of the canopy: rock, herb, shrub)
    // (herb, shrub and sparse ground past a kilometre or so grained up and down at a pixel or two, as grass and
    // shrub clumps seen from the side are: the renders' open ground is never a smooth wash, and laid on the ground
    // any grain foreshortens level)
    const grain = screenNoise(vq, vfoot, vdist, { px: 1, stretch: 6, minCell: 2, offset: 151 }).mul(0.6)
      .add(screenNoise(vq, vfoot, vdist, { px: 2.5, stretch: 5, minCell: 6, offset: 157 }).mul(0.4))
      .mul(smoothstep(800, 2500, dist)).mul(0.14).add(1).toVar();
    const naturalFar = natural.mul(mix(grain, float(1), clamp(wRock.div(max(natW, 1e-3)), 0, 1)));
    const stand = mix(mix(mix(under.mul(grain), rockUnder.mul(0.85), wRocky), crownCol, crowns), naturalFar, natW).toVar();
    // (a burn far off: its regrowth in the shade of its snags, streaked up and down by their trunks)
    if (burn) {
      const trunks = smoothstep(0.05, 0.5, screenNoise(vq, vfoot, vdist, { px: 1, stretch: 7, minCell: 3, offset: 141 }).negate());
      stand.assign(mix(stand, mix(burntGround.mul(0.9), gradedCover(bc(B.snag), o.coverGrade), trunks.mul(0.5)), wBurn));
    }
    colour.assign(mix(mix(stand, cutLook, farOpen), colour, inGrid));
    // the skyline's sea (cover 5 past the grids whose water is polygons: terrain.ts levels it): a dark slate surface
    // brightening toward the sky's colour at a grazing look, as a far calm sea reads in the renders
    if (masks.cover?.sea) {
      const graze = float(1).sub(clamp(cameraPosition.sub(positionWorld).normalize().y, 0, 1));
      const seaCol = gradedCover(mix(vec3(0.05, 0.08, 0.115), vec3(0.2, 0.27, 0.36), pow(graze, 8)), o.coverGrade);
      colour.assign(mix(colour, seaCol, seaW));
    }
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
  mat.roughnessNode = mix(mix(mix(float(0.95), float(0.55), o.wet), float(0.8), snowCover), float(0.35), seaW);
  // past the shadow map: darkened by the canopy over it (the far forest as a full one)
  // (a canopy seen from the side shows its lit crowns as well as their shade: less than under the near stand)
  const far = float(1).sub(max(wide.mul(inGrid).mul(0.6), float(1).sub(inGrid).mul(farCover).mul(0.4)));
  mat.receivedShadowNode = asReceivedShadow(o.fadeShadow(far));
  return mat;
}

/** Snow on a material's colour from above (debris and the like): `amount` of the snow uniform where it faces up. */
export const snowOn = (colour: Vec3, snow: Float, strength = 0.85): Vec3 =>
  mix(colour, vec3(0.7, 0.73, 0.78), clamp(snow.mul(smoothstep(0.35, 0.8, normalWorld.y)).mul(strength), 0, 1));
