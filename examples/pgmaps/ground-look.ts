// How cleared and forested ground reads from far off, free of three.js and the DOM
// (`node --test examples/pgmaps/ground-look.test.ts`): the cut ground's green-up by the opening's age, and the forest's
// crown closure as a raster the floor shades the far stand from (floor.ts) — the package's own `canopy` posts when it
// carries them, else the stems' crowns averaged over a few tens of metres.
//
// Judged against the Forest Practices Board's photos of Kootenay Lake blocks about a year after harvest: muted
// grey-brown soil and slash, a little green coming in, a closed and finely textured canopy round it; not bare earth.
import type { Opening, ScenePackage, TerrainGrid } from './package.ts';

/** An opening with no age (older packages, or a record with no date) is drawn as about a year after harvest. */
export const DEFAULT_CUT_AGE = 1;
/** Ages are written into a mask byte over this many years (8 bits: about 0.16 year a step); older reads as this. */
export const AGE_SCALE = 40;

/**
 * The green-up's stages (years): fresh soil and slash to `shrubStart`; shrubs and seedlings over the brown to
 * `shrubFull` (half the ground green); green by `greenFull`; a young stand from `standStart`, closed by `standFull`.
 */
export const CUT_STAGES = { shrubStart: 1, shrubFull: 5, greenFull: 10, standStart: 13, standFull: 20 } as const;
/** The share of the ground green at `shrubFull`. */
export const SHRUB_SHARE = 0.5;
/** Green in a cut at any age: brush and advance regeneration left by the harvest (a year on, the photos' flecks). */
export const RESIDUAL_GREEN = 0.1;

/** An opening's age (years), absent or unusable: DEFAULT_CUT_AGE. */
export function cutAgeOf(o: Pick<Opening, 'ageYears'>): number {
  const a = o.ageYears;
  return typeof a === 'number' && Number.isFinite(a) ? Math.max(0, a) : DEFAULT_CUT_AGE;
}

/** An opening's dispersed retention, 0..1 (absent: none). */
export function retainedShareOf(o: Pick<Opening, 'retainedShare'>): number {
  const r = o.retainedShare;
  return typeof r === 'number' && Number.isFinite(r) ? Math.min(1, Math.max(0, r)) : 0;
}

/** An age as a mask byte's value, 0..1. */
export const encodeAge = (age: number): number => Math.min(1, Math.max(0, age / AGE_SCALE));

/** The age back from a mask: the age layer is drawn premultiplied by the opening's own (softened) coverage. */
export function decodeAge(ageLayer: number, opening: number): number {
  return opening > 1 / 255 ? Math.min(1, ageLayer / opening) * AGE_SCALE : DEFAULT_CUT_AGE;
}

const smooth = (a: number, b: number, x: number): number => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/** The share of a cut's ground green at an age (shrubs, then green cover), 0..1. The floor's shader follows this. */
export function greenShare(age: number): number {
  const s = CUT_STAGES;
  const grown = SHRUB_SHARE * smooth(s.shrubStart, s.shrubFull, age) + (1 - SHRUB_SHARE) * smooth(s.shrubFull, s.greenFull, age);
  return RESIDUAL_GREEN + (1 - RESIDUAL_GREEN) * grown;
}

/**
 * The `via` look's fresh cut (Visual Nature Studio's harvested blocks in the VIA renders, sampled from the Gun Lake
 * CP007 block: sRGB about #9c7d72 in shade to #b89a86 lit): pinkish-brown and tan with a fine slash speckle, linear
 * albedo (the floor's light makes about 1.2× of it). `light` and `dark` the speckle's flecks: bleached slash and the
 * shadow between it. Drawn on openings up to `maxAge` years old, gone by `maxAge + fade`; `photo` keeps the soil look.
 */
export const VIA_CUT = { base: [0.33, 0.225, 0.18], light: [0.46, 0.355, 0.29], dark: [0.15, 0.1, 0.085], maxAge: 1, fade: 0.5 } as const;
/** The share of a cut drawn in the `via` paint at an age (1 to VIA_CUT.maxAge, 0 past it and its fade). */
export const viaCutShare = (age: number): number => 1 - smooth(VIA_CUT.maxAge, VIA_CUT.maxAge + VIA_CUT.fade, age);

/** How far a cut has grown into a young stand at an age, 0..1. */
export const standShare = (age: number): number => smooth(CUT_STAGES.standStart, CUT_STAGES.standFull, age);

/**
 * How much of the ground a stand's crowns hide seen from the side at a low angle, from its crown closure (the share
 * hidden seen from above): 1 - (1 - c)^k. A 45% stand reads closed from across a valley (the Kootenay photos).
 */
export const OBLIQUE_EXPONENT = 2.5;
export const visibleCover = (closure: number): number => 1 - (1 - Math.min(1, Math.max(0, closure))) ** OBLIQUE_EXPONENT;

/** Crown closure over a grid of posts (package metres, row-major from the south row), and which posts are known. */
export interface CanopyRaster {
  west: number;
  south: number;
  spacing: number;
  columns: number;
  rows: number;
  closure: Float32Array;
  known: Uint8Array;
}

/** A grid's own `canopy` posts, or null when it carries none (older packages) or they do not fit the grid. */
export function canopyFromGrid(grid: TerrainGrid | undefined | null): CanopyRaster | null {
  if (!grid?.canopy || grid.canopy.length !== grid.columns * grid.rows) return null;
  const n = grid.columns * grid.rows;
  const closure = new Float32Array(n), known = new Uint8Array(n);
  let any = false;
  for (let k = 0; k < n; k++) {
    const v = grid.canopy[k];
    if (typeof v === 'number' && Number.isFinite(v)) {
      closure[k] = Math.min(1, Math.max(0, v));
      known[k] = 1;
      any = true;
    }
  }
  return any ? { west: grid.west, south: grid.south, spacing: grid.spacing, columns: grid.columns, rows: grid.rows, closure, known } : null;
}

/** The stems' crowns averaged over this (m) when a package has no `canopy`: finer than a far clump's own spacing. */
export const STEM_CANOPY_SMOOTH = 30;

/**
 * Crown closure from the stems when a package has no `canopy`: each crown's area spread over the cells round it
 * (cells of `cell` metres), the cover read as 1 - e^(-area share) (crowns overlap at random), averaged over about
 * STEM_CANOPY_SMOOTH. Known within `reach` of the eye (the farthest stem: no stems were sent past it).
 */
export function canopyFromStems(
  scene: Pick<ScenePackage, 'trees' | 'camera'>,
  bounds: { west: number; south: number; east: number; north: number },
  cell: number,
): CanopyRaster | null {
  const { fields, data, count } = scene.trees;
  if (!count) return null;
  const st = fields.length, fx = fields.indexOf('x'), fy = fields.indexOf('y'), fw = fields.indexOf('crownWidth'), fh = fields.indexOf('height');
  const columns = Math.max(2, Math.ceil((bounds.east - bounds.west) / cell) + 1);
  const rows = Math.max(2, Math.ceil((bounds.north - bounds.south) / cell) + 1);
  const area = new Float32Array(columns * rows);
  const [ex, ey] = scene.camera?.position ?? [0, 0];
  let reach = 0;
  for (let i = 0; i < count; i++) {
    const o = i * st, x = data[o + fx], y = data[o + fy];
    const w = fw >= 0 && data[o + fw] > 0 ? data[o + fw] : fh >= 0 ? data[o + fh] * 0.25 : 4;
    reach = Math.max(reach, Math.hypot(x - ex, y - ey));
    // (bilinear: a stem's crown shared among the four posts round it)
    const gx = (x - bounds.west) / cell, gy = (y - bounds.south) / cell;
    const c0 = Math.floor(gx), r0 = Math.floor(gy), fxr = gx - c0, fyr = gy - r0;
    const a = Math.PI * (w / 2) ** 2;
    const put = (c: number, r: number, wt: number) => {
      if (c >= 0 && r >= 0 && c < columns && r < rows) area[r * columns + c] += a * wt;
    };
    put(c0, r0, (1 - fxr) * (1 - fyr));
    put(c0 + 1, r0, fxr * (1 - fyr));
    put(c0, r0 + 1, (1 - fxr) * fyr);
    put(c0 + 1, r0 + 1, fxr * fyr);
  }
  const radius = Math.max(1, Math.round(STEM_CANOPY_SMOOTH / cell / 2));
  const blurred = boxBlur(boxBlur(area, columns, rows, radius), columns, rows, radius);
  const closure = new Float32Array(columns * rows), known = new Uint8Array(columns * rows);
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < columns; c++) {
      const k = r * columns + c;
      closure[k] = 1 - Math.exp(-blurred[k] / (cell * cell));
      known[k] = Math.hypot(bounds.west + c * cell - ex, bounds.south + r * cell - ey) <= reach ? 1 : 0;
    }
  return { west: bounds.west, south: bounds.south, spacing: cell, columns, rows, closure, known };
}

/** A box blur of radius `r` cells (the edges averaged over the cells inside). */
export function boxBlur(src: Float32Array, columns: number, rows: number, r: number): Float32Array {
  const tmp = new Float32Array(src.length), out = new Float32Array(src.length);
  const pass = (from: Float32Array, to: Float32Array, n: number, m: number, at: (i: number, j: number) => number) => {
    for (let i = 0; i < n; i++) {
      let sum = 0, cnt = 0;
      for (let j = 0; j <= Math.min(m - 1, r); j++) (sum += from[at(i, j)]), cnt++;
      for (let j = 0; j < m; j++) {
        to[at(i, j)] = sum / cnt;
        const add = j + r + 1, drop = j - r;
        if (add < m) (sum += from[at(i, add)]), cnt++;
        if (drop >= 0) (sum -= from[at(i, drop)]), cnt--;
      }
    }
  };
  pass(src, tmp, rows, columns, (i, j) => i * columns + j);
  pass(tmp, out, columns, rows, (i, j) => j * columns + i);
  return out;
}

/** The raster as texels (RGBA bytes, row 0 the south row): r closure premultiplied by g, known (so filtering across
 * an unknown post's edge reads the known posts' closure: r / g). */
export function canopyTexels(c: CanopyRaster): Uint8Array {
  const px = new Uint8Array(c.columns * c.rows * 4);
  for (let k = 0; k < c.columns * c.rows; k++) {
    px[k * 4] = c.known[k] ? Math.round(c.closure[k] * 255) : 0;
    px[k * 4 + 1] = c.known[k] ? 255 : 0;
    px[k * 4 + 3] = 255;
  }
  return px;
}
