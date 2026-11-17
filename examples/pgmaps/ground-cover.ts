// The package's natural ground cover (PGMaps' `terrain.cover`, `SCENE_COVER`), free of three.js and the DOM
// (`node --test examples/pgmaps/ground-cover.test.ts`): what the ground is where the forest is not closed, per terrain
// post on each grid — forest, sparse forest, shrub, herb/grass, rock or exposed soil (VRI non-vegetated, or a bluff
// past about 45°), water, cut ground; null unknown.
//
// Here: the codes as a raster per grid (finest grid first), the share of the stems kept on each class (none on rock
// or water, thinned on herb, shrub and sparse forest), the stems thinned by it (each stem's fate a hash of its place,
// so the same stem goes in every pass and every rebuild), how much of the canopy the ground keeps, and the texels the
// floor and the canopy surface blend the classes from (floor.ts, canopy-surface.ts), and the look's grade of the
// ground's colours.
//
// Judged against Visual Nature Studio's VIA renders: pale grey-tan rock bluffs and talus, yellow-green herb openings,
// dark low shrub, sparse forest as scattered trees over light ground.
import type { ScenePackage, TerrainGrid } from './package.ts';
import { fireYearsFromGrid } from './burnt.ts';

/** `terrain.cover` codes (PGMaps' SCENE_COVER). */
export const COVER = { forest: 0, sparse: 1, shrub: 2, herb: 3, rock: 4, water: 5, cut: 6, burnt: 7, rockyStand: 8 } as const;
/**
 * Rock (4) under a standing stand: a post whose canopy is at least this. PGMaps marks bluffs and coastal stands whose
 * VRI lists bedrock or talus as rock but keeps their stand (its stems and `canopy`): pale rock between the crowns, not
 * bare rock. The adapter reads such a post as its own code `rockyStand` (8), never one PGMaps sends.
 */
export const ROCKY_STAND_CLOSURE = 0.1;
export type CoverCode = (typeof COVER)[keyof typeof COVER];
const CODES = new Set<number>(Object.values(COVER));

/**
 * The share of the package's stems kept on each class: none on rock and water; on herb and shrub the odd tree
 * (VRI's non-treed ground still carries a few); on sparse forest about half (its stems are grown to its closure
 * already: this only opens it to read as scattered trees). Forest and cut ground keep theirs (a cut's are its
 * retention), and unknown ground too.
 */
export const TREE_KEEP: Record<CoverCode, number> = { 0: 1, 1: 0.55, 2: 0.2, 3: 0.12, 4: 0, 5: 0, 6: 1, 7: 1, 8: 1 };
/**
 * The share of the crown closure the ground keeps where the forest is drawn as a canopy (the floor's far stand, the
 * stand patches and the canopy surface): none on rock, water, herb and shrub — that ground is drawn as itself, never
 * raised by a stand's height — and on sparse forest about half. Burnt ground keeps its stand's closure: its snags
 * stand at the stand's own density (the canopy surface draws them as a snag stand, burnt.ts).
 */
export const CANOPY_KEEP: Record<CoverCode, number> = { 0: 1, 1: 0.5, 2: 0, 3: 0, 4: 0, 5: 0, 6: 1, 7: 1, 8: 1 };

/** A grid's cover posts: the code at each post (-1 unknown), row-major from the south row. */
export interface CoverRaster {
  west: number;
  south: number;
  spacing: number;
  columns: number;
  rows: number;
  code: Int8Array;
  /** The fire year at each post (NaN unknown), when the grid carries `fireYear` (burnt.ts). */
  fireYear?: Float32Array | null;
}

/** A grid's own `cover` posts, or null when it carries none (older packages) or they do not fit the grid. */
export function coverFromGrid(grid: TerrainGrid | undefined | null): CoverRaster | null {
  if (!grid?.cover || grid.cover.length !== grid.columns * grid.rows) return null;
  const n = grid.columns * grid.rows;
  const code = new Int8Array(n).fill(-1);
  let any = false;
  for (let k = 0; k < n; k++) {
    const v = grid.cover[k];
    if (typeof v === 'number' && CODES.has(v) && v !== COVER.rockyStand) {
      const cc = grid.canopy?.[k];
      // (rock with a stand on it: the stand stands, the rock shows between its crowns)
      code[k] = v === COVER.rock && typeof cc === 'number' && cc >= ROCKY_STAND_CLOSURE ? COVER.rockyStand : v;
      any = true;
    }
  }
  return any ? { west: grid.west, south: grid.south, spacing: grid.spacing, columns: grid.columns, rows: grid.rows, code, fireYear: fireYearsFromGrid(grid) } : null;
}

/** The package's cover rasters, finest first (the detailed grid, the far grid, the skyline grid); empty: none. */
export function coverRasters(scene: Pick<ScenePackage, 'terrain' | 'farTerrain' | 'skylineTerrain'>): CoverRaster[] {
  return [scene.terrain, scene.farTerrain, scene.skylineTerrain].map(coverFromGrid).filter((c): c is CoverRaster => !!c);
}

/** How many posts of each class a package's grids carry (null: no grid has cover). */
export function coverCounts(rasters: readonly CoverRaster[]): Record<keyof typeof COVER | 'unknown', number> | null {
  if (!rasters.length) return null;
  const out = { forest: 0, sparse: 0, shrub: 0, herb: 0, rock: 0, water: 0, cut: 0, burnt: 0, rockyStand: 0, unknown: 0 };
  const names = Object.keys(COVER) as Array<keyof typeof COVER>;
  for (const r of rasters) for (const c of r.code) c < 0 ? out.unknown++ : out[names[c]]++;
  return out;
}

/**
 * A share per class read at a package point (x east, y north): bilinear over the four posts round it in the finest
 * grid that holds the point, an unknown post taking `unknown`. Null outside every grid.
 */
export function coverShareSampler(rasters: readonly CoverRaster[], share: Record<CoverCode, number>, unknown = 1): (x: number, y: number) => number | null {
  return (x, y) => {
    for (const g of rasters) {
      const gx = (x - g.west) / g.spacing, gy = (y - g.south) / g.spacing;
      if (gx < 0 || gy < 0 || gx > g.columns - 1 || gy > g.rows - 1) continue;
      const c0 = Math.min(g.columns - 2, Math.floor(gx)), r0 = Math.min(g.rows - 2, Math.floor(gy));
      const fx = gx - c0, fy = gy - r0;
      const at = (c: number, r: number) => {
        const v = g.code[r * g.columns + c];
        return v < 0 ? unknown : share[v as CoverCode];
      };
      return (at(c0, r0) * (1 - fx) + at(c0 + 1, r0) * fx) * (1 - fy) + (at(c0, r0 + 1) * (1 - fx) + at(c0 + 1, r0 + 1) * fx) * fy;
    }
    return null;
  };
}

/** The code of the post nearest a package point, in the finest grid that holds it (null: unknown or outside). */
export function coverAt(rasters: readonly CoverRaster[], x: number, y: number): CoverCode | null {
  for (const g of rasters) {
    const c = Math.round((x - g.west) / g.spacing), r = Math.round((y - g.south) / g.spacing);
    if (c < 0 || r < 0 || c >= g.columns || r >= g.rows) continue;
    const v = g.code[r * g.columns + c];
    return v < 0 ? null : (v as CoverCode);
  }
  return null;
}

/** A stem's draw in 0..1 from its place (package metres, to the decimetre): the same stem, the same draw, every pass. */
export function stemDraw(x: number, y: number): number {
  let h = Math.imul(Math.round(x * 10) | 0, 0x27d4eb2d) ^ Math.imul(Math.round(y * 10) | 0, 0x165667b1) ^ 0x5bd1e995;
  h = Math.imul(h ^ (h >>> 15), 0x85ebca6b);
  h = Math.imul(h ^ (h >>> 13), 0xc2b2ae35);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

export interface StemRows { ids?: readonly string[]; fields: readonly string[]; count: number; data: ArrayLike<number> }

/**
 * The indexes of the stems the ground keeps: each stem kept when its draw is under the keep share at its place
 * (TREE_KEEP, bilinear across the posts round it, so a class's edge thins rather than steps). Idempotent: thinning a
 * thinned table again keeps every stem.
 */
export function keptStems(t: StemRows, keepAt: (x: number, y: number) => number | null): number[] {
  const st = t.fields.length, fx = t.fields.indexOf('x'), fy = t.fields.indexOf('y');
  const keep: number[] = [];
  for (let i = 0; i < t.count; i++) {
    const x = t.data[i * st + fx], y = t.data[i * st + fy];
    const share = keepAt(x, y) ?? 1;
    if (share >= 1 || (share > 0 && stemDraw(x, y) < share)) keep.push(i);
  }
  return keep;
}

/** A stem table with only the stems the ground keeps (the same table when it keeps all of them). */
export function thinStems<T extends StemRows & { data: ArrayLike<number> }>(t: T, keepAt: (x: number, y: number) => number | null): { table: T; removed: number } {
  const keep = keptStems(t, keepAt);
  if (keep.length === t.count) return { table: t, removed: 0 };
  const st = t.fields.length;
  const out = t.data instanceof Float32Array ? new Float32Array(keep.length * st) : new Array<number>(keep.length * st);
  keep.forEach((i, k) => {
    for (let j = 0; j < st; j++) out[k * st + j] = t.data[i * st + j];
  });
  return { table: { ...t, count: keep.length, data: out, ...(t.ids?{ids:keep.map(i=>t.ids![i])}:{}) }, removed: t.count - keep.length };
}

/** The scene's stems thinned by its cover (the package unchanged when it carries none). */
export function thinSceneByCover(scene: ScenePackage): { scene: ScenePackage; removed: number; rasters: CoverRaster[] } {
  const rasters = coverRasters(scene);
  if (!rasters.length) return { scene, removed: 0, rasters };
  const { table, removed } = thinStems(scene.trees, coverShareSampler(rasters, TREE_KEEP));
  return { scene: removed ? { ...scene, trees: table } : scene, removed, rasters };
}

/**
 * The texels a grid's cover is drawn from (RGBA bytes, row 0 the south row): r sparse forest, g shrub, b herb, a rock,
 * each 255 at its own posts (forest, cut, water and unknown ground: all 0, the floor as before). Filtered, the
 * classes blend across a post's spacing.
 */
export function coverTexels(c: CoverRaster): Uint8Array {
  const px = new Uint8Array(c.columns * c.rows * 4);
  const channel: Partial<Record<number, number>> = { [COVER.sparse]: 0, [COVER.shrub]: 1, [COVER.herb]: 2, [COVER.rock]: 3 };
  for (let k = 0; k < c.code.length; k++) {
    const ch = channel[c.code[k]];
    if (ch !== undefined) px[k * 4 + ch] = 255;
  }
  return px;
}

export type Look = 'via' | 'photo';
/**
 * The look's grade of the natural ground's colours (linear RGB): `via` the renders' own (pale rock, yellow-green
 * herb), `photo` muted and a little blue-grey with distance, as a photograph's open ground is.
 */
export const COVER_GRADE: Record<Look, { chroma: number; tint: [number, number, number] }> = {
  via: { chroma: 1, tint: [1, 1, 1] },
  photo: { chroma: 0.7, tint: [0.96, 0.99, 1.05] },
};

/** A linear colour graded (chroma toward its luminance, then tinted). */
export function gradeCover(rgb: readonly [number, number, number], look: Look): [number, number, number] {
  const y = 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
  const g = COVER_GRADE[look];
  return [0, 1, 2].map((i) => (y + (rgb[i] - y) * g.chroma) * g.tint[i]) as [number, number, number];
}

/**
 * A stand-in cover for testing without PGMaps' (`?coverTest`): from the grid's own slope and canopy, rock on a bluff
 * past `bluffDegrees`, then by crown closure herb (none), shrub, sparse forest and forest; null where the height or
 * the canopy is unknown. Not the PGMaps rule (VRI's land cover): only something to look at.
 */
export function syntheticCover(grid: TerrainGrid, bluffDegrees = 42): Array<number | null> {
  const { columns, rows, spacing, heights, canopy } = grid;
  const h = (c: number, r: number) => heights[Math.min(rows - 1, Math.max(0, r)) * columns + Math.min(columns - 1, Math.max(0, c))];
  const out: Array<number | null> = new Array(columns * rows).fill(null);
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < columns; c++) {
      const z = h(c, r), e = h(c + 1, r), w = h(c - 1, r), n = h(c, r + 1), s = h(c, r - 1);
      if (z === null || e === null || w === null || n === null || s === null) continue;
      const slope = (Math.atan(Math.hypot((e - w) / (2 * spacing), (n - s) / (2 * spacing))) * 180) / Math.PI;
      const k = r * columns + c;
      if (slope > bluffDegrees) {
        out[k] = COVER.rock;
        continue;
      }
      const cc = canopy?.[k];
      if (typeof cc !== 'number') continue;
      out[k] = cc < 0.05 ? COVER.herb : cc < 0.2 ? COVER.shrub : cc < 0.35 ? COVER.sparse : COVER.forest;
    }
  return out;
}

/** The skyline grid's water posts as texels (r 255 at cover 5; RGBA bytes, row 0 the south row). */
export function waterTexels(c: CoverRaster): Uint8Array {
  const px = new Uint8Array(c.columns * c.rows * 4);
  for (let k = 0; k < c.code.length; k++) if (c.code[k] === COVER.water) px[k * 4] = 255;
  return px;
}

/**
 * The skyline grid with its sea laid flat: PGMaps sends no sea polygons there (a flat sea cannot follow the grid's
 * curvature drop), so each water post (cover 5) with no height or one under the dropped sea level is set to it,
 * 0 − d² / (2R) × (1 − k) for its distance d from the origin (the grid's `earthCurvature`). A lake's posts stand
 * above that level and keep their heights. The grid itself when it has no cover or nothing changes.
 */
export function skylineSea<G extends TerrainGrid & { earthCurvature?: { earthRadiusMeters: number; refraction: number } }>(grid: G): { grid: G; posts: number } {
  if (!grid.cover || grid.cover.length !== grid.columns * grid.rows) return { grid, posts: 0 };
  const R = grid.earthCurvature?.earthRadiusMeters ?? 6371000, k = grid.earthCurvature?.refraction ?? 0.13;
  let heights: Array<number | null> | null = null, posts = 0;
  for (let i = 0; i < grid.cover.length; i++) {
    if (grid.cover[i] !== COVER.water) continue;
    const x = grid.west + (i % grid.columns) * grid.spacing, y = grid.south + Math.floor(i / grid.columns) * grid.spacing;
    const sea = -((x * x + y * y) / (2 * R)) * (1 - k);
    const h = grid.heights[i];
    if (typeof h === 'number' && Number.isFinite(h) && h >= sea) continue;
    heights ??= grid.heights.slice();
    heights[i] = sea;
    posts++;
  }
  return heights ? { grid: { ...grid, heights }, posts } : { grid, posts };
}

/** Where a raster's texels lie in the cover atlas: its first row and its size (texels). */
export interface AtlasSection { row: number; columns: number; rows: number }

/** Texels left empty between two sections (a filtered lookup clamped half a texel inside never reaches the next). */
export const ATLAS_GAP = 2;

/**
 * The floor's cover in one texture (WebGPU allows a fragment stage 16 samplers, and the floor already uses most):
 * every grid's cover texels (`coverTexels`) and then the skyline's water (`waterTexels`) stacked as sections, south
 * row first, ATLAS_GAP rows apart; the width the widest section's.
 */
export function coverAtlas(sections: ReadonlyArray<{ raster: CoverRaster; texels: (c: CoverRaster) => Uint8Array }>): { width: number; height: number; data: Uint8Array; sections: AtlasSection[] } {
  const width = Math.max(1, ...sections.map((s) => s.raster.columns));
  const out: AtlasSection[] = [];
  let row = 0;
  for (const s of sections) {
    out.push({ row, columns: s.raster.columns, rows: s.raster.rows });
    row += s.raster.rows + ATLAS_GAP;
  }
  const height = Math.max(1, row - ATLAS_GAP);
  const data = new Uint8Array(width * height * 4);
  sections.forEach((s, i) => {
    const px = s.texels(s.raster), { columns, rows } = s.raster;
    for (let r = 0; r < rows; r++) data.set(px.subarray(r * columns * 4, (r + 1) * columns * 4), ((out[i].row + r) * width) * 4);
  });
  return { width, height, data, sections: out };
}
