// Burnt ground (PGMaps' `SCENE_COVER.burnt`, cover 7: a recent wildfire from BC's fire perimeters), free of three.js and
// the DOM (`node --test examples/pgmaps/burnt.test.ts`): which stems stand dead, how far the ground has greened since
// the fire, and the texels the floor and the canopy surface read the burn and its age from (cover-shading.ts).
//
// Judged against the Gun Lake CP007 VIA renders (Visual Nature Studio): bare grey-black snags with no foliage at the
// stand's own stem density, over pale yellow-green herb and grey-green shrub regrowth; far off a darker grey-green
// mottled surface streaked by the snags. The snags are the package's own stems on burnt ground, kept where they stand
// (their positions and heights), drawn as a leafless tree type (species.ts SNAG_LOOK); a snag's crown is its stubs,
// so it screens far less than the live tree did.
import type { ScenePackage, SpeciesInfo, TerrainGrid } from './package.ts';
import { stemDraw, type CoverRaster } from './ground-cover.ts';
import { isAggregate, type StemTable } from './far-forest.ts';

/** `terrain.cover` code of burnt ground (PGMaps' SCENE_COVER.burnt). */
export const BURNT = 7;
/** The species name the adapter gives a stem standing dead on burnt ground (not one PGMaps sends). */
export const SNAG_SPECIES = 'snag';
/** A snag's width over its height: its trunk and the stubs of its branches (a live conifer's crown is ~0.2–0.35). */
export const SNAG_RATIO = 0.12;
/** A snag stand's stems a hectare are a live conifer stand's of this crown ratio at its closure (far-forest.ts stemsPerHectare). */
export const SNAG_DENSITY_RATIO = 0.2;
export const SNAG_INFO: SpeciesInfo = { label: 'Snag (burnt)', crownRatio: SNAG_RATIO, crownBase: 0.12, broadleaf: false };
/** A burn with no fire year is drawn this many years after the fire (the herb flush: what the renders show). */
export const DEFAULT_BURN_AGE = 3;
/**
 * The regrowth's stages (years since the fire): black ash and charred duff gone by `ashGone`; herbs (fireweed, grass)
 * full by `herbFull`; shrubs (willow, alder, aspen suckers) over the herbs from `shrubStart` to `shrubFull`; a young
 * pine stand from `regenStart`, closed by `regenFull`. Snags stand to `fallStart`, half down by `fallHalf`.
 */
export const BURN_STAGES = { ashGone: 1.5, herbFull: 3, shrubStart: 4, shrubFull: 14, regenStart: 10, regenFull: 25, fallStart: 8, fallHalf: 25 } as const;
/** Fire years go into a byte over [FIRE_YEAR_BASE, FIRE_YEAR_BASE + FIRE_YEAR_SPAN] (about 0.4 year a step). */
export const FIRE_YEAR_BASE = 1950;
export const FIRE_YEAR_SPAN = 100;
/**
 * The burn's colours (linear albedo; the floor's light makes about 1.2× of them), sampled from the Gun Lake renders:
 * `ash` charred duff and `ashGrey` its grey ash; the herb flush (`herbDry` tan-yellow, `herb` the renders' pale
 * yellow-green, sRGB about #969659 lit); `shrub` the grey-green shrub bands; `regen` a young pine stand; `snag` a
 * charred trunk (the dark purple-grey spikes); `farStand` a snag stand over its regrowth seen past the trees' cut-off
 * (the renders' darker grey-green, sRGB about #5a5a50).
 */
export const BURN_PALETTE = {
  ash: [0.035, 0.032, 0.03], ashGrey: [0.1, 0.095, 0.09],
  herbDry: [0.25, 0.225, 0.1], herb: [0.215, 0.235, 0.075],
  shrub: [0.12, 0.14, 0.095], regen: [0.05, 0.08, 0.037],
  snag: [0.05, 0.044, 0.054], farStand: [0.085, 0.09, 0.07],
} as const;
/** The canopy surface raises a snag stand by this share of its height (its trunks, not a crown layer). */
export const SNAG_RAISE = 0.6;
/**
 * A snag stand's closure where the package posts none: PGMaps posts a burn's `canopy` as its stand's closure before the
 * fire (the snags' density); older packages or unknown posts take this.
 */
export const SNAG_CLOSURE = 0.45;

/**
 * A closure sampler that stands a snag stand on burnt ground: there the stand's closure is the posted one (PGMaps': the
 * stand's before the fire, which sets the snags' density), else SNAG_CLOSURE where the post says nothing; elsewhere
 * unchanged.
 */
export function withSnagClosure(closureAt: (x: number, y: number) => number | null, burntAt: (x: number, y: number) => number | null): (x: number, y: number) => number | null {
  return (x, y) => {
    const c = closureAt(x, y), b = burntAt(x, y) ?? 0;
    if (!(b > 0) || c !== null) return c;
    return SNAG_CLOSURE * b;
  };
}

/** The share of a burnt place's canopy-surface pixels a snag stand screens in the flat (screened) pass. */
export const SNAG_SCREEN = 0.3;

const smooth = (a: number, b: number, x: number): number => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/** The view's year as a fraction (2025-07-02 ≈ 2025.5), from an instant; null for none. */
export const fractionalYear = (at: Date | null | undefined): number | null => {
  if (!at || Number.isNaN(at.getTime())) return null;
  const y = at.getUTCFullYear(), start = Date.UTC(y, 0, 1), end = Date.UTC(y + 1, 0, 1);
  return y + (at.getTime() - start) / (end - start);
};

/** Years since the fire (a fire year counts from its midsummer); unknown or unusable: DEFAULT_BURN_AGE. */
export function burnAge(fireYear: number | null | undefined, viewYear: number): number {
  if (typeof fireYear !== 'number' || !Number.isFinite(fireYear)) return DEFAULT_BURN_AGE;
  return Math.max(0, viewYear - (Math.floor(fireYear) + 0.6));
}

/**
 * The burnt ground's look at an age, 0..1 each: `ash` (charred, black-grey), `herb` (yellow-green flush over the ash),
 * `shrub` (grey-green shrubs over the herbs), `regen` (a young stand). The floor's shader follows this.
 */
export function regrowth(age: number): { ash: number; herb: number; shrub: number; regen: number } {
  const s = BURN_STAGES;
  return { ash: 1 - smooth(0, s.ashGone, age), herb: smooth(0.3, s.herbFull, age), shrub: smooth(s.shrubStart, s.shrubFull, age), regen: smooth(s.regenStart, s.regenFull, age) };
}

/** The share of a burn's snags still standing at an age (1 to `fallStart`, half by `fallHalf`, a few for decades). */
export function snagsStanding(age: number): number {
  const s = BURN_STAGES;
  if (age <= s.fallStart) return 1;
  return 0.1 + 0.9 * 2 ** (-(age - s.fallStart) / (s.fallHalf - s.fallStart));
}

/** The fire year a burn with none is drawn from at the view's year (DEFAULT_BURN_AGE before it, a whole year). */
export const fallbackFireYear = (viewYear: number): number => Math.round(viewYear - DEFAULT_BURN_AGE - 0.6);

/** A fire year as a byte's value, 0..1 (clamped to the encoded span). */
export const encodeFireYear = (year: number): number => Math.min(1, Math.max(0, (year - FIRE_YEAR_BASE) / FIRE_YEAR_SPAN));
export const decodeFireYear = (v: number): number => FIRE_YEAR_BASE + v * FIRE_YEAR_SPAN;

/**
 * A grid's fire year at each post (NaN unknown), from its `burntYear` posts (else `fireYear`; the same layout as
 * `cover`); null when it carries none or they do not fit.
 */
export function fireYearsFromGrid(grid: TerrainGrid | undefined | null): Float32Array | null {
  const posts = grid?.burntYear ?? grid?.fireYear;
  if (!grid || !Array.isArray(posts) || posts.length !== grid.columns * grid.rows) return null;
  const out = new Float32Array(posts.length).fill(NaN);
  let any = false;
  posts.forEach((v, k) => {
    if (typeof v === 'number' && Number.isFinite(v) && v > 1800 && v < 2200) (out[k] = v), (any = true);
  });
  return any ? out : null;
}

/** Whether any of the rasters carries a burnt post. */
export const hasBurn = (rasters: readonly CoverRaster[]): boolean => rasters.some((r) => r.code.includes(BURNT));
/** The cover atlas's second set of sections (burnTexels) is needed: a burnt post, or rock under a stand (code 8). */
export const hasStandGround = (rasters: readonly CoverRaster[]): boolean => rasters.some((r) => r.code.includes(BURNT) || r.code.includes(ROCKY_STAND));
/** ground-cover.ts COVER.rockyStand (the adapter's own code: rock showing between a standing stand's crowns). */
const ROCKY_STAND = 8;

/** The burnt share at a package point (bilinear over the finest grid's posts round it; null outside every grid). */
export function burntShareSampler(rasters: readonly CoverRaster[]): (x: number, y: number) => number | null {
  return (x, y) => {
    for (const g of rasters) {
      const gx = (x - g.west) / g.spacing, gy = (y - g.south) / g.spacing;
      if (gx < 0 || gy < 0 || gx > g.columns - 1 || gy > g.rows - 1) continue;
      const c0 = Math.min(g.columns - 2, Math.floor(gx)), r0 = Math.min(g.rows - 2, Math.floor(gy));
      const fx = gx - c0, fy = gy - r0;
      const at = (c: number, r: number) => (g.code[r * g.columns + c] === BURNT ? 1 : 0);
      return (at(c0, r0) * (1 - fx) + at(c0 + 1, r0) * fx) * (1 - fy) + (at(c0, r0 + 1) * (1 - fx) + at(c0 + 1, r0 + 1) * fx) * fy;
    }
    return null;
  };
}

/** The fire year of the nearest burnt post round a point in the finest grid holding it (null: none known). */
export function fireYearAt(rasters: readonly CoverRaster[], x: number, y: number): number | null {
  for (const g of rasters) {
    const gx = (x - g.west) / g.spacing, gy = (y - g.south) / g.spacing;
    if (gx < -0.5 || gy < -0.5 || gx > g.columns - 0.5 || gy > g.rows - 0.5) continue;
    if (!g.fireYear) return null;
    const c0 = Math.floor(gx), r0 = Math.floor(gy);
    let best: number | null = null, bestD = Infinity;
    for (const [c, r] of [[c0, r0], [c0 + 1, r0], [c0, r0 + 1], [c0 + 1, r0 + 1]]) {
      if (c < 0 || r < 0 || c >= g.columns || r >= g.rows) continue;
      const v = g.fireYear[r * g.columns + c];
      const d = (gx - c) ** 2 + (gy - r) ** 2;
      if (Number.isFinite(v) && d < bestD) (best = v), (bestD = d);
    }
    return best;
  }
  return null;
}

/** A stem table as the adapter keeps them (the package's `trees`, a final stand merged into them). */
export interface SnagTable { fields: readonly string[]; species: readonly string[]; count: number; data: ArrayLike<number> }

/**
 * The stems on burnt ground stood dead: each stem whose draw (a hash of its place, not the cover thinning's) falls
 * under the burnt share at its place becomes a snag (`SNAG_SPECIES`, appended to the species when missing), its crown
 * narrowed to SNAG_RATIO of its height unless it stands for many trees (a far aggregate keeps its width: its cell's
 * closure); those fallen by the burn's age (snagsStanding) are left out. The table itself when nothing changes.
 */
export function snagStems<T extends SnagTable>(t: T, rasters: readonly CoverRaster[], viewYear: number, speciesRatio: (name: string) => number | undefined = () => undefined): { table: T; snags: number; fallen: number } {
  const st = t.fields.length, fx = t.fields.indexOf('x'), fy = t.fields.indexOf('y'), fs = t.fields.indexOf('species');
  const fw = t.fields.indexOf('crownWidth'), fh = t.fields.indexOf('height');
  if (!hasBurn(rasters) || fx < 0 || fy < 0 || fs < 0) return { table: t, snags: 0, fallen: 0 };
  const shareAt = burntShareSampler(rasters);
  const known = t.species.indexOf(SNAG_SPECIES);
  const snagIndex = known >= 0 ? known : t.species.length;
  // (each kept stem's fields written straight into a table of the input's kind: a row array and a spread a stem, then
  // Float32Array.from over the lot, were 0.4 s of a final stand's 1.4 M stems; the values are the same)
  const typed = t.data instanceof Float32Array;
  const out: Float32Array | number[] = typed ? new Float32Array(t.count * st) : new Array<number>(t.count * st);
  let snags = 0, fallen = 0, kept = 0;
  for (let i = 0; i < t.count; i++) {
    const o = i * st, x = t.data[o + fx], y = t.data[o + fy];
    const share = shareAt(x, y) ?? 0;
    const k = kept * st;
    for (let j = 0; j < st; j++) out[k + j] = t.data[o + j];
    if (share > 0 && t.data[o + fs] !== snagIndex && stemDraw(x + 0.37, y - 0.21) < share) {
      const age = burnAge(fireYearAt(rasters, x, y), viewYear);
      if (stemDraw(x - 0.53, y + 0.29) >= snagsStanding(age)) {
        fallen++;
        continue; // (its row is written over by the next stem kept)
      }
      if (fw >= 0 && fh >= 0 && !isAggregate(t as unknown as StemTable, i, speciesRatio)) out[k + fw] = Math.min(t.data[o + fw] > 0 ? t.data[o + fw] : Infinity, SNAG_RATIO * t.data[o + fh]);
      out[k + fs] = snagIndex;
      snags++;
    }
    kept++;
  }
  if (!snags && !fallen) return { table: t, snags, fallen };
  const data = kept === t.count ? out : out.slice(0, kept * st);
  return { table: { ...t, species: known >= 0 ? t.species : [...t.species, SNAG_SPECIES], count: kept, data }, snags, fallen };
}

/** The scene with its stems on burnt ground stood dead (snagStems), and the snag's species info. */
export function snagScene(scene: ScenePackage, rasters: readonly CoverRaster[], viewYear: number): { scene: ScenePackage; snags: number; fallen: number } {
  const r = snagStems(scene.trees, rasters, viewYear, (name) => scene.species?.[name]?.crownRatio);
  if (r.table === scene.trees) return { scene, snags: 0, fallen: 0 };
  return { scene: { ...scene, trees: r.table, species: { ...(scene.species ?? {}), [SNAG_SPECIES]: SNAG_INFO } }, snags: r.snags, fallen: r.fallen };
}

/**
 * The texels a grid's burn is drawn from (RGBA bytes, row 0 the south row): r 255 at burnt posts, g the fire year
 * (encodeFireYear, `fallbackYear` where the post has none) premultiplied by r, so a filtered read divides it back;
 * b 255 where rock shows under a standing stand (ground-cover.ts rockyStand).
 */
export function burnTexels(c: CoverRaster, fallbackYear: number): Uint8Array {
  const px = new Uint8Array(c.columns * c.rows * 4);
  for (let k = 0; k < c.code.length; k++) {
    if (c.code[k] === ROCKY_STAND) px[k * 4 + 2] = 255;
    if (c.code[k] !== BURNT) continue;
    const y = c.fireYear && Number.isFinite(c.fireYear[k]) ? c.fireYear[k] : fallbackYear;
    px[k * 4] = 255;
    px[k * 4 + 1] = Math.round(encodeFireYear(Math.floor(y)) * 255);
  }
  return px;
}

/**
 * A stand-in burn for testing without PGMaps' (`?burnTest=<fire year>`): the grid's forest and sparse-forest posts in
 * the half east of `eastOf` (package x) made burnt, with `fireYear` (a grid with no cover: its posts there, the rest
 * unknown). Not PGMaps' rule (BC's fire perimeters): only something to look at.
 */
export function syntheticBurn<G extends TerrainGrid>(grid: G, eastOf: number, fireYear: number): G {
  const n = grid.columns * grid.rows;
  const own = grid.cover && grid.cover.length === n;
  const cover = own ? grid.cover!.slice() : new Array<number | null>(n).fill(0).map((_, k) => (grid.heights[k] === null ? null : grid.west + (k % grid.columns) * grid.spacing > eastOf ? 0 : null));
  const years: Array<number | null> = new Array(n).fill(null);
  for (let k = 0; k < cover.length; k++) {
    const x = grid.west + (k % grid.columns) * grid.spacing;
    if (x > eastOf && (cover[k] === 0 || cover[k] === 1)) (cover[k] = BURNT), (years[k] = fireYear);
  }
  return { ...grid, cover, burntYear: years };
}
