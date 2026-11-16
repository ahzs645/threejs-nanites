// The final render's request and stems (PGMaps' engineCapture.ts `quality: 'final'`), pure: no DOM, no three.js
// (final-stand.test.ts). A final request carries the frame's forest at real density (`stand`: the package's tree
// fields, a Float32Array, a radius and a bearing span from the eye); the engine draws those stems in place of the
// package's own wherever the stand reaches and keeps the package's stems (and their far-forest drawing) past it.
import { fieldIndex, isAggregate, type StemTable } from './far-forest.ts';

/** The stand PGMaps sends: stems in package metres, the package's tree fields, where it reaches. */
export interface FinalStand {
  fields: string[];
  species: string[];
  count: number;
  data: Float32Array;
  radiusMeters: number;
  /** Bearing span covered, degrees clockwise from north, [from, to] (may wrap past 360). */
  bearings: [number, number];
}

export interface FinalOptions {
  /** Jittered samples accumulated per frame (TAA held still). */
  samples: number;
  stand: FinalStand | null;
  /** Past the distance at which the stand's median tree is under this many pixels tall: the canopy surface. */
  canopyCutoffPx: number;
}

export const DEFAULT_SAMPLES = 24;
export const MAX_SAMPLES = 256;
export const DEFAULT_CUTOFF_PX = 4;
/** More stems than this are refused (each a Nanite instance: 32 bytes and a slot in every per-instance list). */
export const MAX_FINAL_STEMS = 4_000_000;

const isRecord = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object';
const finite = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);

/** A request's final options: null for `active` (or none). Throws a reason the engine sends back on a malformed stand. */
export function readFinalOptions(data: Record<string, unknown>): FinalOptions | null {
  if (data.quality !== 'final') return null;
  const samples = finite(data.samples) && data.samples >= 1 ? Math.min(MAX_SAMPLES, Math.round(data.samples)) : DEFAULT_SAMPLES;
  const canopyCutoffPx = finite(data.canopyCutoffPx) && data.canopyCutoffPx > 0 ? data.canopyCutoffPx : DEFAULT_CUTOFF_PX;
  return { samples, stand: readStand(data.stand), canopyCutoffPx };
}

function readStand(s: unknown): FinalStand | null {
  if (s === undefined || s === null) return null;
  if (!isRecord(s)) throw new Error('The final stand is not an object.');
  const fields = Array.isArray(s.fields) ? s.fields.map(String) : null;
  if (!fields || !['x', 'y', 'species', 'height'].every((k) => fields.includes(k))) throw new Error('The final stand lacks x, y, species or height.');
  const species = Array.isArray(s.species) ? s.species.map(String) : [];
  const count = finite(s.count) ? Math.round(s.count) : -1;
  if (count < 0 || count > MAX_FINAL_STEMS) throw new Error(`The final stand's count must be 0 to ${MAX_FINAL_STEMS.toLocaleString('en')}.`);
  const raw = s.data;
  const data = raw instanceof Float32Array ? raw : Array.isArray(raw) ? Float32Array.from(raw as number[]) : ArrayBuffer.isView(raw) ? new Float32Array((raw as ArrayBufferView).buffer as ArrayBuffer) : null;
  if (!data || data.length < count * fields.length) throw new Error('The final stand\'s data is shorter than count × fields.');
  const radiusMeters = finite(s.radiusMeters) && s.radiusMeters > 0 ? s.radiusMeters : 0;
  const b = Array.isArray(s.bearings) && s.bearings.length === 2 && s.bearings.every(finite) ? (s.bearings as [number, number]) : ([0, 360] as [number, number]);
  return { fields, species, count, data, radiusMeters, bearings: [b[0], b[1]] };
}

/** Whether a bearing (degrees from north, clockwise) lies in [from, to], which may wrap past 360 or be a full turn. */
export function inBearings(bearing: number, [from, to]: readonly [number, number]): boolean {
  const span = to - from;
  if (span >= 360 || span <= -360) return true;
  const norm = (v: number) => ((v % 360) + 360) % 360;
  const d = norm(bearing - from), w = span >= 0 ? span : norm(span);
  return d <= w + 1e-9;
}

/** Whether the stand reaches a ground point (package metres) from the eye (x, y): within its radius and bearings. */
export function standReaches(stand: Pick<FinalStand, 'radiusMeters' | 'bearings'>, eye: readonly [number, number], x: number, y: number): boolean {
  const dx = x - eye[0], dy = y - eye[1];
  if (dx * dx + dy * dy > stand.radiusMeters * stand.radiusMeters) return false;
  const bearing = (Math.atan2(dx, dy) * 180) / Math.PI;
  return inBearings(bearing, stand.bearings);
}

export interface MergedStems extends StemTable {
  fields: string[];
  species: string[];
  data: Float32Array;
  /** Stems taken from the stand, and the package's kept past it. */
  fromStand: number;
  kept: number;
}

/**
 * The stems a final frame draws, in the package's own fields: the stand's (species renamed onto one list: the
 * package's names, then any new), and the package's own outside the stand's reach. A field the stand lacks takes
 * `fill(field, x, y)` (its ground height for `z`, NaN otherwise; tone 0.5).
 */
export function mergeStems(pkg: StemTable, stand: FinalStand, eye: readonly [number, number], fill: (field: string, x: number, y: number) => number): MergedStems {
  const fields = [...pkg.fields];
  const species = [...pkg.species];
  const speciesOf = stand.species.map((name) => {
    let k = species.indexOf(name);
    if (k < 0) k = species.push(name) - 1;
    return k;
  });
  const pf = fieldIndex(pkg.fields), stride = fields.length;
  const keep: number[] = [];
  for (let i = 0; i < pkg.count; i++) {
    const o = i * pf.stride;
    if (!standReaches(stand, eye, pkg.data[o + pf.x], pkg.data[o + pf.y])) keep.push(i);
  }
  // the stand's stems with a place and a height (a NaN there reached the renderer's chunk bounds and sized its
  // buffers NaN: WebGPU refuses a non-integer buffer size)
  const sx0 = stand.fields.indexOf('x'), sy0 = stand.fields.indexOf('y'), sh0 = stand.fields.indexOf('height'), st0 = stand.fields.length;
  const good: number[] = [];
  for (let i = 0; i < stand.count; i++) {
    const o = i * st0, h = stand.data[o + sh0];
    if (Number.isFinite(stand.data[o + sx0]) && Number.isFinite(stand.data[o + sy0]) && Number.isFinite(h) && h > 0.5) good.push(i);
  }
  const count = keep.length + good.length;
  const data = new Float32Array(count * stride);
  keep.forEach((i, k) => {
    for (let j = 0; j < stride; j++) data[k * stride + j] = pkg.data[i * pf.stride + j];
  });
  const from = fields.map((f) => stand.fields.indexOf(f));
  const sx = stand.fields.indexOf('x'), sy = stand.fields.indexOf('y'), ss = stand.fields.indexOf('species'), sStride = stand.fields.length;
  good.forEach((i, n) => {
    const o = i * sStride, k = (keep.length + n) * stride, x = stand.data[o + sx], y = stand.data[o + sy];
    fields.forEach((f, j) => {
      if (j === pf.species) data[k + j] = speciesOf[stand.data[o + ss]] ?? 0;
      else {
        const v = from[j] >= 0 ? stand.data[o + from[j]] : NaN;
        data[k + j] = Number.isFinite(v) ? v : fill(f, x, y);
      }
    });
  });
  return { fields, species, count, data, fromStand: good.length, kept: keep.length };
}

/**
 * A synthetic dense stand for testing without PGMaps (`?captureTest`): every aggregate package stem's crown filled
 * with real trees at `perHectare` (each the stem's species and about its height, a real crown, `ratio` of its height),
 * out to `radius` within `bearings`. Seeded by the stem's place: the same stand every time.
 */
export function syntheticStand(pkg: StemTable, eye: readonly [number, number], radius: number, bearings: [number, number], perHectare: number, ratio = 0.17): FinalStand {
  const f = fieldIndex(pkg.fields);
  const fields = ['x', 'y', 'species', 'height', 'crownWidth', 'tone'];
  const out: number[] = [];
  const reach = { radiusMeters: radius, bearings };
  for (let i = 0; i < pkg.count; i++) {
    const o = i * f.stride, x = pkg.data[o + f.x], y = pkg.data[o + f.y], h = pkg.data[o + f.height];
    if (!standReaches(reach, eye, x, y)) continue;
    const w = f.crownWidth >= 0 ? pkg.data[o + f.crownWidth] : h * ratio;
    // a real stem stays as it is; an aggregate one becomes trees over its crown's disk
    if (!isAggregate(pkg, i)) {
      out.push(x, y, pkg.data[o + f.species], h, w, f.tone >= 0 ? pkg.data[o + f.tone] : 0.5);
      continue;
    }
    const n = Math.max(1, Math.round((Math.PI * (w / 2) ** 2 * perHectare) / 10000));
    let s = (Math.imul(Math.round(x * 10), 0x9e3779b1) ^ Math.imul(Math.round(y * 10), 0x85ebca6b)) >>> 0;
    const rnd = () => ((s = (Math.imul(s ^ (s >>> 15), 0x2c1b3c6d) + 0x6d2b79f5) >>> 0), s / 4294967296);
    for (let k = 0; k < n; k++) {
      const r = (w / 2) * Math.sqrt(rnd()), a = rnd() * Math.PI * 2;
      const tx = x + r * Math.cos(a), ty = y + r * Math.sin(a);
      if (!standReaches(reach, eye, tx, ty)) continue;
      const th = h * (0.75 + 0.5 * rnd());
      out.push(tx, ty, pkg.data[o + f.species], th, th * ratio * (0.85 + 0.3 * rnd()), rnd());
    }
  }
  return { fields, species: [...pkg.species], count: out.length / fields.length, data: Float32Array.from(out), radiusMeters: radius, bearings };
}

/**
 * A stem table with at least one stem: a table with none (a view over open water, or every stem on rock) gets one
 * metre-tall stem at (x, y) `depth` metres under the ground at `z`, where nothing sees it. The Nanite renderer sizes
 * its buffers by the instances, and WebGPU refuses a zero-sized binding (Captain Island's package has no stems).
 */
export function withPlaceholderStem<T extends { fields: readonly string[]; count: number; data: ArrayLike<number> }>(t: T, x: number, y: number, z: number, depth = 500): T {
  if (t.count > 0) return t;
  const f = fieldIndex(t.fields);
  const row: number[] = t.fields.map((name) => (name === 'tone' ? 0.5 : 0));
  if (f.x >= 0) row[f.x] = x;
  if (f.y >= 0) row[f.y] = y;
  if (f.z >= 0) row[f.z] = z - depth;
  if (f.height >= 0) row[f.height] = 1;
  if (f.crownWidth >= 0) row[f.crownWidth] = 0.3;
  return { ...t, count: 1, data: t.data instanceof Float32Array ? Float32Array.from(row) : row };
}
