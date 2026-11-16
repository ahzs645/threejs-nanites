// The package's ground as heights, free of three.js and the DOM (`node --test examples/pgmaps/ground-grid.test.ts`):
// the detailed grid (`terrain`), the coarse one past it when a capture's package carries one (`farTerrain`), the
// coarsest out to the real skyline past that (`skylineTerrain`, its heights already lowered for the earth's curvature
// by PGMaps: drawn as given), and past them all an apron of invented ground easing to the mean. Where two grids meet
// the outer ground is eased onto the inner grid's edge, so one mesh over all has no step and no crack; the mesh's
// columns and rows are the detailed grid's posts, each coarser grid's past the finer, then the apron's rings
// (terrain.ts).
//
// Package metres: x east, y north.
import type { TerrainGrid } from './package.ts';

/** How far the apron reaches past the outermost grid (m), in rings of these distances from its edge. */
export const APRON = [250, 700, 1600, 3500, 8000, 16000];
/** Past the outermost grid the ground eases to the mean over this (m). */
const EASE_TO_MEAN = 9000;
/** Past the detailed grid the far ground is eased onto the detailed grid's edge over this (m), at least. */
const SEAM_BLEND = 300;

export interface GridBounds { west: number; south: number; east: number; north: number }

export const gridBounds = (g: TerrainGrid): GridBounds => ({
  west: g.west, south: g.south, east: g.west + (g.columns - 1) * g.spacing, north: g.south + (g.rows - 1) * g.spacing,
});

/** What a place's height comes from: the detailed grid, the far grid, a gap filled from neighbours, or the apron. */
export type GroundSource = 'terrain' | 'farTerrain' | 'skylineTerrain' | 'filled' | 'invented';

export interface FilledGrid {
  grid: TerrainGrid;
  bounds: GridBounds;
  /** Heights, every post filled (row-major from the south row, as the grid's). */
  h: Float64Array;
  /** 1 where the post is the grid's own value. */
  known: Uint8Array;
  /** Mean of the known posts. */
  mean: number;
}

/**
 * A grid with its unknown posts filled: from `fallback(x, y)` where it gives a number (another grid's own value), then
 * from the nearest known post along the row and then the column, then the mean.
 */
export function fillGrid(grid: TerrainGrid, fallback?: (x: number, y: number) => number): FilledGrid {
  const { columns, rows, west, south, spacing } = grid;
  const h = new Float64Array(columns * rows);
  const known = new Uint8Array(columns * rows);
  const set = new Uint8Array(columns * rows);
  let sum = 0, n = 0;
  for (let k = 0; k < columns * rows; k++) {
    const v = grid.heights[k];
    if (typeof v === 'number' && Number.isFinite(v)) {
      h[k] = v;
      known[k] = set[k] = 1;
      sum += v;
      n++;
    } else if (fallback) {
      const f = fallback(west + (k % columns) * spacing, south + Math.floor(k / columns) * spacing);
      if (Number.isFinite(f)) (h[k] = f), (set[k] = 1);
    }
  }
  const mean = n ? sum / n : 0;
  const sweep = (index: (i: number, j: number) => number, outer: number, inner: number): void => {
    for (let i = 0; i < outer; i++) {
      let last = NaN;
      for (let j = 0; j < inner; j++) if (set[index(i, j)]) last = h[index(i, j)];
      for (let j = inner - 1; j >= 0; j--) {
        const k = index(i, j);
        if (set[k]) last = h[k];
        else if (Number.isFinite(last)) (h[k] = last), (set[k] = 1);
      }
    }
  };
  // (as the adapter always filled its gaps: along the rows, then the columns for rows with no value at all)
  sweep((r, c) => r * columns + c, rows, columns);
  sweep((c, r) => r * columns + c, columns, rows);
  for (let k = 0; k < columns * rows; k++) if (!set[k]) h[k] = mean;
  return { grid, bounds: gridBounds(grid), h, known, mean };
}

/** Bilinear height at (x, y), the point clamped into the grid; `out`: how far (m) the point lay outside it. */
export function sampleGrid(f: FilledGrid, x: number, y: number): { v: number; out: number; cx: number; cy: number } {
  const { west, south, spacing, columns, rows } = f.grid;
  const gx = (x - west) / spacing, gy = (y - south) / spacing;
  const cx = Math.min(columns - 1.0001, Math.max(0, gx)), cy = Math.min(rows - 1.0001, Math.max(0, gy));
  const x0 = Math.floor(cx), y0 = Math.floor(cy), fx = cx - x0, fy = cy - y0;
  const at = (c: number, r: number) => f.h[Math.min(rows - 1, r) * columns + Math.min(columns - 1, c)];
  const v = at(x0, y0) * (1 - fx) * (1 - fy) + at(x0 + 1, y0) * fx * (1 - fy) + at(x0, y0 + 1) * (1 - fx) * fy + at(x0 + 1, y0 + 1) * fx * fy;
  return { v, out: Math.hypot(Math.max(0, Math.abs(gx - cx) - 0.0001), Math.max(0, Math.abs(gy - cy) - 0.0001)) * spacing, cx: west + cx * spacing, cy: south + cy * spacing };
}

/** Whether the post nearest (x, y) is the grid's own value (false outside it). */
export function knownNear(f: FilledGrid, x: number, y: number): boolean {
  const { west, south, spacing, columns, rows } = f.grid;
  const c = Math.round((x - west) / spacing), r = Math.round((y - south) / spacing);
  return c >= 0 && r >= 0 && c < columns && r < rows && f.known[r * columns + c] === 1;
}

const inside = (b: GridBounds, x: number, y: number, slack = 0): boolean =>
  x >= b.west - slack && x <= b.east + slack && y >= b.south - slack && y <= b.north + slack;

export interface Ground {
  near: FilledGrid;
  far: FilledGrid | null;
  /** The skyline grid (`skylineTerrain`), drawn only where neither grid inside it has posts. */
  skyline: FilledGrid | null;
  /** The outermost real ground: the outermost grid's extent (skyline, far, else the detailed grid's). */
  outer: GridBounds;
  /** Package x (east), y (north): the ground's height anywhere (the apron's past the grids). */
  heightAt: (x: number, y: number) => number;
  /** Where the height at (x, y) comes from. */
  sourceAt: (x: number, y: number) => GroundSource;
  /** The mesh's columns (x) and rows (y), ascending: the detailed grid's posts, the far grid's past them, the skyline
   * grid's past those, the apron. */
  xs: number[];
  ys: number[];
  /** Known posts of the far grid that were unknown (null). */
  farUnknown: number;
}

/**
 * The ground from a package's grids. `near.h` may be edited afterwards (the water's beds): `heightAt` reads it live.
 */
export function buildGround(terrain: TerrainGrid, farTerrain?: TerrainGrid | null, skylineTerrain?: TerrainGrid | null): Ground {
  const nearRaw = gridBounds(terrain);
  const ownNear = (x: number, y: number): number => {
    const c = Math.round((x - terrain.west) / terrain.spacing), r = Math.round((y - terrain.south) / terrain.spacing);
    if (c < 0 || r < 0 || c >= terrain.columns || r >= terrain.rows) return NaN;
    const v = terrain.heights[r * terrain.columns + c];
    return typeof v === 'number' ? v : NaN;
  };
  const usable = (g: TerrainGrid | null | undefined): TerrainGrid | null => (g && g.columns > 1 && g.rows > 1 && g.heights?.length === g.columns * g.rows ? g : null);
  const farGrid = usable(farTerrain), skyGrid = usable(skylineTerrain);
  // the far grid's gaps from the detailed grid where it has posts; the detailed grid's from the far grid's own posts
  const far = farGrid ? fillGrid(farGrid, (x, y) => (inside(nearRaw, x, y) ? ownNear(x, y) : NaN)) : null;
  const near = fillGrid(terrain, far ? (x, y) => (knownNear(far, x, y) ? sampleGrid(far, x, y).v : NaN) : undefined);
  // (the skyline grid's gaps from its own neighbours only: its heights are lowered for the curvature, the others' not)
  const skyline = skyGrid ? fillGrid(skyGrid) : null;
  const union = (a: GridBounds, b: GridBounds): GridBounds => ({ west: Math.min(a.west, b.west), south: Math.min(a.south, b.south), east: Math.max(a.east, b.east), north: Math.max(a.north, b.north) });
  const inner = far ? union(far.bounds, near.bounds) : near.bounds;
  const outer = skyline ? union(skyline.bounds, inner) : inner;
  const blend = far ? Math.max(SEAM_BLEND, 3 * far.grid.spacing) : 0;
  const skyBlend = skyline ? Math.max(SEAM_BLEND, 3 * skyline.grid.spacing) : 0;
  const mean = near.mean;
  /** The detailed and far grids' ground (no apron), how far past them, and the point on their edge nearest. */
  const innerAt = (x: number, y: number): { v: number; out: number; cx: number; cy: number } => {
    const n = sampleGrid(near, x, y);
    if (n.out === 0 || !far) return n;
    // the far ground, eased onto the detailed grid's edge (at the edge exactly its height: no step, no crack)
    const f = sampleGrid(far, x, y);
    const atEdge = sampleGrid(far, n.cx, n.cy).v;
    return { v: f.v + (n.v - atEdge) * Math.max(0, 1 - n.out / blend), out: f.out, cx: f.cx, cy: f.cy };
  };
  const heightAt = (x: number, y: number): number => {
    const i = innerAt(x, y);
    if (i.out === 0) return i.v;
    let v = i.v, outside = i.out;
    if (skyline) {
      // the skyline ground as given, eased onto the inner grids' edge the same way
      const s = sampleGrid(skyline, x, y);
      const atEdge = sampleGrid(skyline, i.cx, i.cy).v;
      v = s.v + (innerAt(i.cx, i.cy).v - atEdge) * Math.max(0, 1 - i.out / skyBlend);
      outside = s.out;
    }
    return outside > 0 ? v + (mean - v) * Math.min(1, outside / EASE_TO_MEAN) : v;
  };
  const sourceAt = (x: number, y: number): GroundSource => {
    if (inside(near.bounds, x, y)) return knownNear(near, x, y) ? 'terrain' : far && knownNear(far, x, y) ? 'farTerrain' : 'filled';
    if (far && inside(far.bounds, x, y)) return knownNear(far, x, y) ? 'farTerrain' : 'filled';
    if (skyline && inside(skyline.bounds, x, y)) return knownNear(skyline, x, y) ? 'skylineTerrain' : 'filled';
    return 'invented';
  };
  // the mesh's lines: the detailed grid's posts, each coarser grid's outside the lines so far (none within a quarter of
  // its spacing of their edge: no sliver), then the apron's rings past the outermost
  type Line = { start: number; spacing: number; count: number };
  const axis = (own: Line, coarser: Line[], lo: number, hi: number): number[] => {
    let lines = Array.from({ length: own.count }, (_, i) => own.start + i * own.spacing);
    for (const g of coarser) {
      const first = lines[0], last = lines[lines.length - 1];
      const west: number[] = [], east: number[] = [];
      for (let i = 0; i < g.count; i++) {
        const v = g.start + i * g.spacing;
        if (v < first - g.spacing * 0.25) west.push(v);
        else if (v > last + g.spacing * 0.25) east.push(v);
      }
      lines = [...west, ...lines, ...east];
    }
    return [...APRON.slice().reverse().map((d) => lo - d), ...lines, ...APRON.map((d) => hi + d)];
  };
  const coarser = [far, skyline].filter((g): g is FilledGrid => !!g).map((g) => g.grid);
  const xs = axis({ start: terrain.west, spacing: terrain.spacing, count: terrain.columns }, coarser.map((g) => ({ start: g.west, spacing: g.spacing, count: g.columns })), outer.west, outer.east);
  const ys = axis({ start: terrain.south, spacing: terrain.spacing, count: terrain.rows }, coarser.map((g) => ({ start: g.south, spacing: g.spacing, count: g.rows })), outer.south, outer.north);
  let farUnknown = 0;
  if (far) for (let k = 0; k < far.known.length; k++) if (!far.known[k]) farUnknown++;
  return { near, far, skyline, outer, heightAt, sourceAt, xs, ys, farUnknown };
}
