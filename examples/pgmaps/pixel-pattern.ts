// Texture that keeps its scale on screen: noise and columns whose cells are a set number of pixels across wherever
// the ground lies, laid in the directions from the eye: `q` the bearing (east of north) and the elevation, in
// milliradians. Anchored to world directions, so turning the camera holds them (and TAA settles them); they shift only
// with the eye's own movement, which past a few hundred metres is a fraction of a pixel. A far hillside seen at a grazing
// angle foreshortens any pattern laid on the ground (x, z) into horizontal smears, and one laid in (metres across,
// height) turned with the distance as the eye looks up a slope; this one stretched up and down reads as the VIA
// renders' spires — narrow vertical crowns and the dark gaps between them — at 300 m and at 8 km alike (the library's
// vertical-edge ratio: renders 1.1–1.8). The cell size steps by octaves with the pixel's angle and the two octaves round
// it are blended, so nothing pops; a cell never shrinks under `minCell` metres at the fragment's distance.
import { atan, normalize, length, float, floor, fract, log2, exp2, max, mix, select, sin, dot, vec2, mx_noise_float, positionWorld, cameraPosition } from 'three/tsl';
import type { Float, Vec2, Vec3 } from '../../src/nanite-lib/index.ts';

/** Milliradians a radian. */
const MRAD = 1000;

/**
 * The view's frame at the fragment: q = (bearing, elevation) from the eye in milliradians, the pixel's angle `foot`
 * (mrad) and the distance (m). The bearing's seam due south of the eye is one column where the pattern restarts.
 */
export function viewFrame(): { q: Vec2; foot: Float; dist: Float } {
  const d = positionWorld.sub(cameraPosition);
  const h = max(length(d.xz), 1e-3);
  const q = vec2(atan(d.x, d.z.negate()), atan(d.y, h)).mul(MRAD) as Vec2;
  const dir = normalize(d);
  const foot = max(length(dir.dFdx()).add(length(dir.dFdy())).mul(0.5 * MRAD), 1e-4) as Float;
  return { q, foot, dist: length(d) as Float };
}

export interface ScreenPattern {
  /** Cells this many pixels across at least (each octave's cells span `px`–2·`px`). */
  px: number;
  /** Cells this many times as tall as wide. */
  stretch: number;
  /** Never finer than this (m across at the fragment's distance): a crown's width. */
  minCell: number;
  /** Decorrelates patterns. */
  offset: number;
}

/** The two octaves round the footprint: their cell widths and the blend toward the coarser (`foot`'s units). */
function octaves(foot: Float, minCell: Float, px: number): { s0: Float; s1: Float; t: Float } {
  const lv = log2(max(foot.mul(px), minCell));
  const l0 = floor(lv);
  const s0 = exp2(l0) as Float;
  return { s0, s1: s0.mul(2) as Float, t: lv.sub(l0) as Float };
}

/** Noise in about -1..1 at cells `o.px`–2·`o.px` pixels across, stretched up and down (q, foot, dist: viewFrame). */
export function screenNoise(q: Vec2, foot: Float, dist: Float, o: ScreenPattern): Float {
  const { s0, s1, t } = octaves(foot, float(o.minCell * MRAD).div(dist), o.px);
  const at = (s: Float) => mx_noise_float(vec2(q.x.div(s), q.y.div(s.mul(o.stretch))).add(o.offset));
  return mix(at(s0), at(s1), t).mul(1.5) as Float;
}

/** A seeded random in 0..1 per cell (fract-sine: plenty for picking columns). */
const cellRandom = (c: Vec2, salt: number): Float => fract(sin(dot(c.add(salt), vec2(12.9898, 78.233))).mul(43758.5453)) as Float;

/**
 * 1 on a share of narrow columns, 0 elsewhere: columns `o.px`–2·`o.px` pixels wide, `o.stretch` times as tall, each
 * kept by a random draw under `share` (a snag stand's flat pass keeps the share of its pixels its trunks screen).
 */
export function screenColumns(q: Vec2, foot: Float, dist: Float, share: Float | number, o: ScreenPattern): Float {
  const { s0, s1, t } = octaves(foot, float(o.minCell * MRAD).div(dist), o.px);
  const at = (s: Float) => {
    const c = floor(vec2(q.x.div(s), q.y.div(s.mul(o.stretch))));
    return select(cellRandom(c, o.offset).lessThan(share), float(1), float(0));
  };
  // (the octave is picked, not blended: a flat pass has no partial pixels)
  return select(t.lessThan(0.5), at(s0), at(s1)) as Float;
}

/**
 * 3D noise in about -1..1 over world positions, cells `o.px`–2·`o.px` pixels across (and never under `o.minCell` m):
 * on the ground itself, so its speckle stays put as the eye moves.
 */
export function volumeNoise(pos: Vec3, foot: Float, dist: Float, o: { px: number; minCell: number; offset: number }): Float {
  const { s0: a0, s1: a1, t } = octaves(foot, float(o.minCell * MRAD).div(dist), o.px);
  const s0 = a0.mul(dist).div(MRAD), s1 = a1.mul(dist).div(MRAD);
  const at = (s: Float) => mx_noise_float(pos.div(s).add(o.offset));
  return mix(at(s0), at(s1), t).mul(1.5) as Float;
}
