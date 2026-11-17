// The far forest's pure parts (no DOM, no three.js: far-forest.test.ts runs them).
//
// Past ~600 m each package stem stands for hundreds of trees, widened to hold the stand's crown closure (crowns 18 m
// wide at 1–3 km, 55 m past 3 km): drawn as trees they were squat blobs. Those "aggregate" stems are not drawn as
// trees. Their ground is drawn instead as
//   - stand patches (stand-patches.ts): one camera-facing slab per 60 m cell, its picture a 60 × 60 m patch of
//     real-density forest baked from a few elevations, chosen by the cell's species and crown closure; and
//   - the canopy surface (canopy-surface.ts): past the distance at which a tree is under `cutoffPx` pixels tall
//     (Visual Nature Studio's "dissolve" rule), the terrain raised by the stand's height, coloured by its species and
//     closure, with crown-scale spires and a shadowed side.
// Here: which stems are aggregates, the cells' stand (height, species, closure), the slabs' instances, the cut-off
// distance and the look presets' canopy colours.

/**
 * A stem whose crown is wider than this share of its height, or four times its species' own, stands for many trees.
 * (The package's 1–3 km stems, crowns ~16 m on 22 m, stay trees: as slabs, 60 m cells that near were big enough on
 * screen to show their edges as steps up a hillside; its 45–57 m clumps past ~2.8 km are the squat blobs.)
 */
export const AGGREGATE_RATIO = 1;
/** Side of a stand patch (m): 60 m slabs showed their edges as steps up a hillside 2–3 km off. */
export const PATCH_METERS = 30;
/** Crown closure under which a cell draws no patch (open ground, a fresh cut). */
export const MIN_PATCH_CLOSURE = 0.08;
/** Stems a hectare a baked patch holds at each density level, and the closures they stand for (stand-patches.ts). */
export const PATCH_CLOSURES = [0.35, 0.6, 0.85] as const;
/** Real-density cap (stems / ha): VRI's dense pole stands run past it, but their crowns then overlap anyway. */
export const MAX_STEMS_HA = 1000;
/** A tree's crown width / height in the patches and the final stand, at most (the proposal's "≤ 0.35"). */
export const REAL_RATIO_MAX = 0.35;

export interface StemTable { ids?: readonly string[]; fields: readonly string[]; species: readonly string[]; count: number; data: ArrayLike<number> }

/** The fields' indexes (x, y, z, species, height, crownWidth, tone; -1 absent). */
export function fieldIndex(fields: readonly string[]) {
  const at = (k: string) => fields.indexOf(k);
  return { x: at('x'), y: at('y'), z: at('z'), species: at('species'), height: at('height'), crownWidth: at('crownWidth'), tone: at('tone'), stride: fields.length };
}

/** Whether stem i stands for many trees (its crown wider than AGGREGATE_RATIO of its height, or twice its species'). */
export function isAggregate(t: StemTable, i: number, speciesRatio: (name: string) => number | undefined = () => undefined): boolean {
  const f = fieldIndex(t.fields);
  const source=t.fields.indexOf('source'), expansion=t.fields.indexOf('expansion');
  if ((source>=0 && t.data[i*f.stride+source]===2) || (expansion>=0 && t.data[i*f.stride+expansion]===1)) return false;
  if (f.crownWidth < 0 || f.height < 0) return false;
  const o = i * f.stride, w = t.data[o + f.crownWidth], h = t.data[o + f.height];
  if (!(w > 0 && h > 0)) return false;
  const own = speciesRatio(t.species[t.data[o + f.species]] ?? '') ?? 0.2;
  return w / h > Math.max(AGGREGATE_RATIO, 4 * own);
}

/** A grid of cells (package metres: x east, y north), row-major from the south row. */
export interface CellGrid { west: number; south: number; cell: number; columns: number; rows: number }

/** A cell's stand: the stems' crown-area weighted height and species shares, and the share of the cell under crowns. */
export interface StandCells extends CellGrid {
  /** Mean height (m), NaN where no stem. */
  height: Float32Array;
  /** Crown area over the cell's area (0..1, capped): the closure the aggregate stems were widened to hold. */
  crownShare: Float32Array;
  /** Per cell, `species.length` weights (crown area), then normalised to shares. */
  shares: Float32Array;
  /** Whether an aggregate stem's crown reaches the cell. */
  aggregate: Uint8Array;
  /** Whether any stem's crown reaches the cell. */
  touched: Uint8Array;
  species: readonly string[];
  /** The farthest real (not aggregate) stem from `eye` (m), and the stems' most common species. */
  realReach: number;
  commonSpecies: number;
  /** The stems' median height (m). */
  medianHeight: number;
}

export interface CellOptions {
  cell?: number;
  speciesRatio?: (name: string) => number | undefined;
  /** Cover this square too (package metres), not only the aggregate stems' extent. */
  extent?: { west: number; south: number; east: number; north: number } | null;
  /** The package's eye (x, y): `realReach` is measured from it. */
  eye?: readonly [number, number];
  /**
   * Species never taken as the stems' most common (the stand drawn where no stem reaches): burnt.ts's snags, which a
   * large burn makes the commonest, and which would then stand over every unburnt far hill.
   */
  notCommon?: (species: string) => boolean;
}

/**
 * The stems' stand on a grid of `cell` metres over the aggregate stems and `extent` (each crown spread over the cells
 * its disk reaches, by area). Real stems add their height and species too but mark no cell as aggregate. Null when
 * there is neither an aggregate stem nor an extent.
 */
export function standCells(t: StemTable, o: CellOptions = {}): StandCells | null {
  const cell = o.cell ?? PATCH_METERS;
  const f = fieldIndex(t.fields);
  if (f.x < 0 || f.y < 0 || f.height < 0 || f.species < 0) return null;
  let west = o.extent?.west ?? Infinity, south = o.extent?.south ?? Infinity, east = o.extent?.east ?? -Infinity, north = o.extent?.north ?? -Infinity;
  let any = !!o.extent;
  const agg = new Uint8Array(t.count);
  const [ex, ey] = o.eye ?? [0, 0];
  let realReach = 0;
  const counts = new Float64Array(t.species.length);
  const heights: number[] = [];
  for (let i = 0; i < t.count; i++) {
    const k = i * f.stride, sp = t.data[k + f.species];
    if (sp >= 0 && sp < counts.length && !o.notCommon?.(t.species[sp] ?? '')) counts[sp]++;
    heights.push(t.data[k + f.height]);
    if (!isAggregate(t, i, o.speciesRatio)) {
      realReach = Math.max(realReach, Math.hypot(t.data[k + f.x] - ex, t.data[k + f.y] - ey));
      continue;
    }
    agg[i] = 1;
    any = true;
    if (o.extent) continue;
    const r = t.data[k + f.crownWidth] / 2;
    west = Math.min(west, t.data[k + f.x] - r), east = Math.max(east, t.data[k + f.x] + r);
    south = Math.min(south, t.data[k + f.y] - r), north = Math.max(north, t.data[k + f.y] + r);
  }
  if (!any) return null;
  west = Math.floor(west / cell) * cell, south = Math.floor(south / cell) * cell;
  const columns = Math.max(1, Math.ceil((east - west) / cell)), rows = Math.max(1, Math.ceil((north - south) / cell));
  const n = columns * rows, ns = t.species.length;
  const hSum = new Float64Array(n), wSum = new Float64Array(n), area = new Float64Array(n), shares = new Float32Array(n * ns);
  const aggregate = new Uint8Array(n), touched = new Uint8Array(n);
  for (let i = 0; i < t.count; i++) {
    const k0 = i * f.stride, x = t.data[k0 + f.x], y = t.data[k0 + f.y], h = t.data[k0 + f.height];
    const w = f.crownWidth >= 0 && t.data[k0 + f.crownWidth] > 0 ? t.data[k0 + f.crownWidth] : h * 0.2;
    const r = w / 2, sp = t.data[k0 + f.species];
    // (the crown's disk over the cells it reaches, each cell's share of it by a 4 × 4 sampling of the disk's square)
    const c0 = Math.floor((x - r - west) / cell), c1 = Math.floor((x + r - west) / cell);
    const r0 = Math.floor((y - r - south) / cell), r1 = Math.floor((y + r - south) / cell);
    const disk = Math.PI * r * r;
    for (let rr = Math.max(0, r0); rr <= Math.min(rows - 1, r1); rr++)
      for (let cc = Math.max(0, c0); cc <= Math.min(columns - 1, c1); cc++) {
        const share = c0 === c1 && r0 === r1 ? 1 : overlapShare(x, y, r, west + cc * cell, south + rr * cell, cell);
        if (share <= 0) continue;
        const k = rr * columns + cc, a = disk * share;
        hSum[k] += h * a, wSum[k] += a, area[k] += a;
        if (sp >= 0 && sp < ns) shares[k * ns + sp] += a;
        touched[k] = 1;
        if (agg[i]) aggregate[k] = 1;
      }
  }
  const height = new Float32Array(n), crownShare = new Float32Array(n);
  for (let k = 0; k < n; k++) {
    height[k] = wSum[k] > 0 ? hSum[k] / wSum[k] : NaN;
    crownShare[k] = Math.min(1, area[k] / (cell * cell));
    let s = 0;
    for (let j = 0; j < ns; j++) s += shares[k * ns + j];
    if (s > 0) for (let j = 0; j < ns; j++) shares[k * ns + j] /= s;
  }
  let commonSpecies = 0;
  counts.forEach((c, j) => c > counts[commonSpecies] && (commonSpecies = j));
  heights.sort((a, b) => a - b);
  const medianHeight = heights.length ? heights[Math.floor(heights.length / 2)] : 22;
  return { west, south, cell, columns, rows, height, crownShare, shares, aggregate, touched, species: t.species, realReach, commonSpecies, medianHeight };
}

/** The share of a disk (centre x, y, radius r) inside a square cell (west, south, side), by 4 × 4 samples. */
function overlapShare(x: number, y: number, r: number, w: number, s: number, side: number): number {
  let inside = 0, total = 0;
  for (let i = 0; i < 4; i++)
    for (let j = 0; j < 4; j++) {
      const px = x - r + ((i + 0.5) / 4) * 2 * r, py = y - r + ((j + 0.5) / 4) * 2 * r;
      if ((px - x) ** 2 + (py - y) ** 2 > r * r) continue;
      total++;
      if (px >= w && px < w + side && py >= s && py < s + side) inside++;
    }
  return total ? inside / total : 0;
}

/** A seeded random in 0..1 from two integers (the same cell, the same jitter, whatever else changes). */
export function cellRandom(i: number, j: number, salt = 0): number {
  let h = Math.imul(i | 0, 0x27d4eb2d) ^ Math.imul(j | 0, 0x165667b1) ^ Math.imul(salt | 0, 0x9e3779b1);
  h = Math.imul(h ^ (h >>> 15), 0x85ebca6b);
  h = Math.imul(h ^ (h >>> 13), 0xc2b2ae35);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

/** The slabs: per patch (x, y, z, height), (dz/dx, dz/dy, closure, species), (seed, 0, 0, 0). */
export interface Patches { count: number; a: Float32Array; b: Float32Array; c: Float32Array }

export interface PatchOptions {
  /** The package's eye (x, y) and how far from it patches go (m). */
  eye?: readonly [number, number];
  maxReach?: number;
  /** The share of a place's closure its ground keeps (ground-cover.ts: none on rock and water); null or absent: all. */
  keepAt?: (x: number, y: number) => number | null;
  standAt?: (x:number,y:number)=>import('./stand-palette.ts').StandRecord|null;
}

/**
 * One slab per cell that is forest the package's stems do not draw as trees: an aggregate stem's cell, or past the
 * farthest real stem a cell no stem reaches (the package sent none there: ridges past the landform), with a closure
 * of at least MIN_PATCH_CLOSURE (`closureAt`: the package's canopy posts, null where they say nothing; then the stems'
 * crown share). At the cell's centre jittered by a fifth of a cell, its ground plane from `heightAt` (package metres);
 * `species` the cell's dominant one (an index into the stems'), its height the stems' or their median.
 */
export function standPatches(cells: StandCells, heightAt: (x: number, y: number) => number, closureAt: (x: number, y: number) => number | null, o: PatchOptions = {}): Patches {
  const out: number[][] = [[], [], []];
  const ns = cells.species.length;
  const [ex, ey] = o.eye ?? [0, 0];
  const maxReach = o.maxReach ?? Infinity;
  for (let r = 0; r < cells.rows; r++)
    for (let c = 0; c < cells.columns; c++) {
      const k = r * cells.columns + c;
      const x = cells.west + (c + 0.5 + (cellRandom(c, r, 1) - 0.5) * 0.4) * cells.cell;
      const y = cells.south + (r + 0.5 + (cellRandom(c, r, 2) - 0.5) * 0.4) * cells.cell;
      const d = Math.hypot(x - ex, y - ey);
      if (d > maxReach) continue;
      const beyond = !cells.touched[k] && d > cells.realReach + cells.cell;
      if (!cells.aggregate[k] && !beyond) continue;
      const posted = closureAt(x, y);
      const closure = (posted ?? (cells.touched[k] ? cells.crownShare[k] : 0)) * (o.keepAt?.(x, y) ?? 1);
      if (!(closure >= MIN_PATCH_CLOSURE)) continue;
      let sp = cells.commonSpecies, best = 0;
      for (let j = 0; j < ns; j++) if (cells.shares[k * ns + j] > best) (best = cells.shares[k * ns + j]), (sp = j);
      const known=o.standAt?.(x,y);
      let h = Number.isFinite(cells.height[k]) ? cells.height[k] : cells.medianHeight;
      if(known){
        h=known.heightMeters;
        const mix=known.species.filter(s=>s.share>0 && cells.species.includes(s.species));
        const total=mix.reduce((n,s)=>n+s.share,0);let at=cellRandom(c,r,7)*total;
        for(const s of mix){at-=s.share;if(at<=0){sp=cells.species.indexOf(s.species);h=s.heightMeters??h;break;}}
      }
      const z = heightAt(x, y), dd = cells.cell / 4;
      const gx = (heightAt(x + dd, y) - heightAt(x - dd, y)) / (2 * dd), gy = (heightAt(x, y + dd) - heightAt(x, y - dd)) / (2 * dd);
      if (!Number.isFinite(z)) continue;
      out[0].push(x, y, z, h);
      out[1].push(Number.isFinite(gx) ? gx : 0, Number.isFinite(gy) ? gy : 0, Math.min(1, closure), sp);
      out[2].push(cellRandom(c, r, 3), 0, 0, 0);
    }
  return { count: out[0].length / 4, a: Float32Array.from(out[0]), b: Float32Array.from(out[1]), c: Float32Array.from(out[2]) };
}

/**
 * Stems a hectare for a crown closure: the Boolean model's −ln(1 − c) / (π w² / 4) for crowns `crownWidth` across,
 * capped at MAX_STEMS_HA.
 */
export function stemsPerHectare(closure: number, crownWidth: number): number {
  const c = Math.min(0.97, Math.max(0, closure));
  const a = (Math.PI * crownWidth * crownWidth) / 4;
  return Math.max(0, Math.min(MAX_STEMS_HA, (-Math.log(1 - c) / a) * 10000));
}

/** The distance (m) at which a tree `height` tall is `px` pixels tall through a lens of `focalPx` (VNS's dissolve). */
export const cutoffMeters = (px: number, focalPx: number, height: number): number => (height * focalPx) / Math.max(1e-6, px);
/** A frame's focal length in pixels from its height and vertical field (degrees). */
export const focalPixels = (heightPx: number, verticalFovDegrees: number): number => heightPx / 2 / Math.tan((verticalFovDegrees * Math.PI) / 360);

export type Look = 'via' | 'photo';
export type Rgb = [number, number, number];

/**
 * Canopy colours per species (linear RGB, a lit crown's albedo-like tone before the light): conifers dark and blue- or
 * yellow-green, broadleaves lighter. The far forest's colour is these by the cell's shares, then the look's grade.
 */
export const SPECIES_CANOPY: Record<string, Rgb> = {
  pine: [0.06, 0.085, 0.04],
  spruce: [0.04, 0.065, 0.045],
  fir: [0.035, 0.058, 0.042],
  douglasFir: [0.05, 0.072, 0.045],
  aspen: [0.075, 0.11, 0.05],
  birch: [0.08, 0.11, 0.055],
  hemlock: [.033,.058,.039], blackSpruce: [.031,.053,.041], cottonwood: [.075,.115,.055],
};
const DEFAULT_CANOPY: Rgb = [0.045, 0.07, 0.045];
export const canopyColourOf = (species: string): Rgb => SPECIES_CANOPY[species] ?? DEFAULT_CANOPY;

/**
 * The look's grade of a far-forest colour (linear RGB): its chroma scaled toward its own luminance (`via`: to the
 * renders' dark olive, saturation ≤ 0.2; `photo`: less again, and tinted blue-grey as a photo's distance is).
 */
export function gradeColour(rgb: Rgb, look: Look): Rgb {
  const y = 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
  const k = LOOK_GRADE[look].chroma, tint = LOOK_GRADE[look].tint;
  return [0, 1, 2].map((i) => (y + (rgb[i] - y) * k) * tint[i]) as Rgb;
}
/** Per look: the chroma kept and a multiplier (the photo's blue-grey). */
export const LOOK_GRADE: Record<Look, { chroma: number; tint: Rgb }> = {
  via: { chroma: 0.3, tint: [1, 1, 0.98] },
  photo: { chroma: 0.22, tint: [0.95, 1, 1.1] },
};

/** HSV saturation of an sRGB-encoded colour (0..1 channels): what the board's metric reads. */
export function hsvSaturation(rgb: Rgb): number {
  const mx = Math.max(...rgb), mn = Math.min(...rgb);
  return mx > 0 ? (mx - mn) / mx : 0;
}
/** Linear to sRGB-encoded (0..1). */
export const toSrgb = (v: number): number => (v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055);

/** Crown closure posts (ground-look.ts CanopyRaster's shape). */
export interface ClosurePosts { west: number; south: number; spacing: number; columns: number; rows: number; closure: Float32Array; known: Uint8Array }

/**
 * Closure at a package point from posts, finest first: bilinear over the known posts round it (an unknown post
 * left out and the rest reweighted), null where a grid's posts there are all unknown and no coarser grid knows.
 */
export function closureSampler(grids: ReadonlyArray<ClosurePosts | null>): (x: number, y: number) => number | null {
  const list = grids.filter((g): g is ClosurePosts => !!g);
  return (x, y) => {
    for (const g of list) {
      const gx = (x - g.west) / g.spacing, gy = (y - g.south) / g.spacing;
      if (gx < 0 || gy < 0 || gx > g.columns - 1 || gy > g.rows - 1) continue;
      const c0 = Math.min(g.columns - 2, Math.floor(gx)), r0 = Math.min(g.rows - 2, Math.floor(gy));
      const fx = gx - c0, fy = gy - r0;
      let v = 0, w = 0;
      for (const [dc, dr, wt] of [[0, 0, (1 - fx) * (1 - fy)], [1, 0, fx * (1 - fy)], [0, 1, (1 - fx) * fy], [1, 1, fx * fy]] as const) {
        const k = (r0 + dr) * g.columns + c0 + dc;
        if (!g.known[k] || wt <= 0) continue;
        (v += g.closure[k] * wt), (w += wt);
      }
      if (w > 1e-6) return v / w;
    }
    return null;
  };
}

/** The canopy surface's field: per texel (closure, stand height, known, 1) and its colour (linear RGB, 1). */
export interface CanopyField extends CellGrid {
  stand: Float32Array;
  colour: Float32Array;
}

/**
 * The canopy surface's field over `extent` at `cell` metres (at most `maxSide` texels a side): the closure from
 * `closureAt` (unknown: `unknownClosure`), the height and colour from the stand cells where a stem's crown reaches
 * (their species shares through `colourOf`), else the stems' median height and their most common species' colour.
 */
export function canopyField(
  extent: { west: number; south: number; east: number; north: number },
  closureAt: (x: number, y: number) => number | null,
  cells: StandCells | null,
  colourOf: (species: number) => Rgb,
  o: { cell?: number; maxSide?: number; unknownClosure?: number; medianHeight?: number; commonSpecies?: number; keepAt?: (x: number, y: number) => number | null; standAt?: (x:number,y:number)=>import('./stand-palette.ts').StandRecord|null } = {},
): CanopyField {
  const cell = Math.max(o.cell ?? 120, Math.max(extent.east - extent.west, extent.north - extent.south) / (o.maxSide ?? 1024));
  const columns = Math.max(2, Math.ceil((extent.east - extent.west) / cell)), rows = Math.max(2, Math.ceil((extent.north - extent.south) / cell));
  const stand = new Float32Array(columns * rows * 4), colour = new Float32Array(columns * rows * 4);
  const median = o.medianHeight ?? cells?.medianHeight ?? 22, common = o.commonSpecies ?? cells?.commonSpecies ?? 0;
  const ns = cells?.species.length ?? 0;
  const palette = Array.from({ length: Math.max(ns, common + 1) }, (_, j) => colourOf(j));
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < columns; c++) {
      const k = r * columns + c, x = extent.west + (c + 0.5) * cell, y = extent.south + (r + 0.5) * cell;
      const posted = closureAt(x, y);
      let h = median, rgb = palette[common];
      if (cells) {
        const cc = Math.floor((x - cells.west) / cells.cell), cr = Math.floor((y - cells.south) / cells.cell);
        if (cc >= 0 && cr >= 0 && cc < cells.columns && cr < cells.rows) {
          const ck = cr * cells.columns + cc;
          if (cells.touched[ck]) {
            if (Number.isFinite(cells.height[ck])) h = cells.height[ck];
            const mix: Rgb = [0, 0, 0];
            for (let j = 0; j < ns; j++) {
              const w = cells.shares[ck * ns + j];
              if (w > 0) for (let i = 0; i < 3; i++) mix[i] += palette[j][i] * w;
            }
            if (mix[0] + mix[1] + mix[2] > 0) rgb = mix;
          }
        }
      }
      const known=o.standAt?.(x,y);
      if(known){h=known.heightMeters;const mixed:Rgb=[0,0,0];let sum=0;
        for(const s of known.species){const j=cells?.species.indexOf(s.species)??-1;if(j<0||!(s.share>0))continue;sum+=s.share;for(let i=0;i<3;i++)mixed[i]+=palette[j][i]*s.share;}
        if(sum>0)rgb=mixed.map(v=>v/sum) as Rgb;
      }
      // (the ground's share of it: none on rock, herb, shrub and water, ground-cover.ts CANOPY_KEEP)
      stand.set([(posted ?? o.unknownClosure ?? 0.55) * (o.keepAt?.(x, y) ?? 1), h, posted === null ? 0 : 1, 1], k * 4);
      colour.set([rgb[0], rgb[1], rgb[2], 1], k * 4);
    }
  return { west: extent.west, south: extent.south, cell, columns, rows, stand, colour };
}
