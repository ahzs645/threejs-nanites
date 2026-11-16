// The grown tree types' cache across page loads (tree-cache.ts keeps it in the browser), its pure parts, free of the
// DOM and of three (`node --test examples/pgmaps/tree-cache-key.test.ts`): what a cached tree is filed under, how it
// is checked, and which entries go when the cache is full.
//
// A cached tree must be the tree a growth would return now. So an entry is filed under everything that decides it:
//   - GROW_VERSION, below: the growing code's own version;
//   - the tree generator's and the mesh library's installed versions (the lockfile's version and integrity hash);
//   - the engine build's version (its package version and commit, vite.config.ts);
//   - the whole job: the species' look with its preset options, the seed, the height, the ratio, the crown base, and
//     the leaf mask's content (hashed).
// And trees.ts grows one cached job of each kind afresh on every page before it trusts the rest: a growth that no
// longer matches its entry empties the cache (a change nobody bumped the version for).
import { contentHash } from './content-hash.ts';

/**
 * The growing code's version. BUMP IT whenever a tree grown for the same job would come out different in any byte:
 * a change to tree-worker.ts (`grow`, `measure`, the reply), to species.ts's `mergeOptions`, to RATIO_MAX, or to the
 * cluster DAG it builds (src/nanite-lib/dag/). A bump empties every browser's cache of grown trees.
 */
export const GROW_VERSION = 1;
/** How an entry is stored (tree-cache.ts): bump when its layout changes. */
export const TREE_CACHE_FORMAT = 1;

/**
 * The cache's size limit: 400 MiB. A grown type is 2.6 MB on average and 3.1 MB at most (measured on the Hwy 31 scene:
 * 62 types, 161 MB, with its final stand), so this holds about 150 types: two such scenes with nothing evicted, and
 * most of what the ladder's 17 rungs of ten species can ask for, on a machine short of disk.
 */
export const TREE_CACHE_CAP_BYTES = 400 * 1024 * 1024;

/** A job as the cache files it: tree-worker.ts's GrowJob without its `id` (the type's place in one stand). */
export interface CachedJob {
  look: unknown;
  seed: number;
  height: number;
  ratio: number;
  crownBase: number | null;
  leafMask: { size: number; bits: Uint8Array } | null;
}

/**
 * An installed package's version and integrity hash from a package-lock.json's text (`node_modules/<name>`), or null
 * when the lockfile does not list it: then nothing is known about what grows the trees, and the cache stays off.
 */
export function lockedVersion(lockText: string, name: string): string | null {
  try {
    const entry = (JSON.parse(lockText) as { packages?: Record<string, { version?: unknown; integrity?: unknown }> }).packages?.[`node_modules/${name}`];
    if (!entry || typeof entry.version !== 'string' || !entry.version) return null;
    return typeof entry.integrity === 'string' && entry.integrity ? `${entry.version} ${entry.integrity}` : entry.version;
  } catch {
    return null;
  }
}

/** Everything but the job that an entry is filed under; null (no cache) when a library's version is unknown. */
export function treeCacheNamespace(v: { engine: string; ezTree: string | null; meshoptimizer: string | null; grow?: number; format?: number }): string | null {
  if (!v.ezTree || !v.meshoptimizer || !v.engine) return null;
  return JSON.stringify({ format: v.format ?? TREE_CACHE_FORMAT, grow: v.grow ?? GROW_VERSION, engine: v.engine, ezTree: v.ezTree, meshoptimizer: v.meshoptimizer });
}

/** A job's key in the cache: the namespace, the job's JSON without its mask, and the mask's content hash. */
export function treeCacheKey(namespace: string, job: CachedJob): string {
  const { look, seed, height, ratio, crownBase, leafMask } = job;
  return `${namespace}\n${JSON.stringify({ look, seed, height, ratio, crownBase })}\n${leafMask ? contentHash([leafMask.size, leafMask.bits]) : 'no mask'}`;
}

type Typed = Float32Array | Uint32Array | Uint8Array;
/** A reply's typed arrays, in a fixed order, with their names. */
function arraysOf(reply: Record<string, unknown>, path = ''): Array<[string, Typed]> {
  const out: Array<[string, Typed]> = [];
  for (const k of Object.keys(reply).sort()) {
    const v = reply[k], p = path ? `${path}.${k}` : k;
    if (ArrayBuffer.isView(v)) out.push([p, v as Typed]);
    else if (v && typeof v === 'object') out.push(...arraysOf(v as Record<string, unknown>, p));
  }
  return out;
}

/** The bytes of a grown reply's arrays: what an entry weighs in the cache. */
export function replyBytes(reply: object): number {
  return arraysOf(reply as Record<string, unknown>).reduce((n, [, a]) => n + a.byteLength, 0);
}

/**
 * A grown reply's content hash: every array's bytes and every number, apart from what belongs to the growth and not
 * to the tree: the times it took (`ms`, and the DAG build's `stats.ms`) and `id` (the type's place in the stand that
 * asked, which buildStand overwrites). Two growths of one job by the same code have the same digest.
 */
export function replyDigest(reply: object): string {
  const strip = (o: Record<string, unknown>, top: boolean): Record<string, unknown> => {
    const out: Record<string, unknown> = {};
    for (const k of Object.keys(o).sort()) {
      if (k === 'ms' || (top && k === 'id')) continue;
      const v = o[k];
      out[k] = v && typeof v === 'object' && !ArrayBuffer.isView(v) && !Array.isArray(v) ? strip(v as Record<string, unknown>, false) : v;
    }
    return out;
  };
  return contentHash(strip(reply as Record<string, unknown>, true));
}

/** What the cache knows of an entry without reading it. */
export interface CacheEntry { key: string; namespace: string; bytes: number; at: number; digest: string }

/**
 * The entries to delete before one of `incoming` bytes is written: every entry of another namespace (grown by other
 * code: never read again), then the least recently used of the rest until the cache with the new entry is within
 * `cap`. `keep`: keys in use now, never evicted.
 */
export function evictions(entries: readonly CacheEntry[], namespace: string, incoming: number, cap = TREE_CACHE_CAP_BYTES, keep: ReadonlySet<string> = new Set()): string[] {
  const out = entries.filter((e) => e.namespace !== namespace).map((e) => e.key);
  const mine = entries.filter((e) => e.namespace === namespace).sort((a, b) => a.at - b.at || (a.key < b.key ? -1 : 1));
  let total = mine.reduce((n, e) => n + e.bytes, 0) + incoming;
  for (const e of mine) {
    if (total <= cap) break;
    if (keep.has(e.key)) continue;
    out.push(e.key);
    total -= e.bytes;
  }
  return out;
}
