// Grown tree types kept across page loads, in the browser's IndexedDB (the pure parts and the rules: tree-cache-key.ts;
// its user: trees.ts). A grown type is its cluster DAG and source meshes, 2.6 MB of typed arrays on average, which
// IndexedDB stores and hands back as they are (a structured clone: the same bytes).
//
// Everything here fails soft. The page runs in a cross-site iframe under PGMaps, where the browser partitions storage
// and may refuse it altogether: any error opening, reading or writing turns the cache off for the page (`null`,
// `false`), and trees.ts grows the tree as it would without one.
//
// Two object stores: `entries` (small rows: key, namespace, bytes, last use, digest), read whole when the page first
// asks, and `trees` (the replies, by key), read one at a time.
import { TREE_CACHE_CAP_BYTES, evictions, replyBytes, replyDigest, type CacheEntry } from './tree-cache-key.ts';

const DB_NAME = 'pgmaps-tree-cache', ENTRIES = 'entries', TREES = 'trees';

const done = <T>(request: IDBRequest<T>): Promise<T> => new Promise((resolve, reject) => {
  request.onsuccess = () => resolve(request.result);
  request.onerror = () => reject(request.error ?? new Error('IndexedDB request failed'));
});
const settled = (tx: IDBTransaction): Promise<void> => new Promise((resolve, reject) => {
  tx.oncomplete = () => resolve();
  tx.onerror = tx.onabort = () => reject(tx.error ?? new Error('IndexedDB transaction failed'));
});

/** Deletes the whole cache from this browser profile (a page that does not use it); fails soft, like the rest. */
export function dropTreeStore(): void {
  try {
    indexedDB.deleteDatabase(DB_NAME);
  } catch { /* (no storage here: nothing was stored either) */ }
}

export interface TreeStore {
  /** What is held for a key, or undefined. */
  entry(key: string): CacheEntry | undefined;
  /** The stored reply (and its entry marked used now); null when it is gone or cannot be read. */
  read<T extends object>(key: string): Promise<T | null>;
  /** Stores a reply under a key, dropping what tree-cache-key.ts's `evictions` names first; false when it failed. */
  write(key: string, reply: object): Promise<boolean>;
  /** Empties the cache. */
  clear(): Promise<boolean>;
  stats(): { entries: number; bytes: number; capBytes: number; otherNamespaces: number; hits: number; misses: number; writes: number; evicted: number; failed: string | null };
}

/**
 * The cache for one namespace (tree-cache-key.ts treeCacheNamespace), or null when the browser gives no storage here.
 * Entries of other namespaces (grown by other code) are deleted when it opens.
 */
export async function openTreeStore(namespace: string, cap = TREE_CACHE_CAP_BYTES): Promise<TreeStore | null> {
  let db: IDBDatabase;
  const entries = new Map<string, CacheEntry>();
  try {
    const open = indexedDB.open(DB_NAME, 1);
    open.onupgradeneeded = () => {
      open.result.createObjectStore(ENTRIES, { keyPath: 'key' });
      open.result.createObjectStore(TREES);
    };
    db = await done(open);
    for (const e of await done(db.transaction(ENTRIES).objectStore(ENTRIES).getAll() as IDBRequest<CacheEntry[]>)) entries.set(e.key, e);
  } catch {
    return null; // (storage refused, or blocked: no cache)
  }
  const counts = { hits: 0, misses: 0, writes: 0, evicted: 0 };
  let failed: string | null = null;
  /** Keys read or written by this page: never evicted while it runs. */
  const inUse = new Set<string>();
  const fail = (error: unknown): void => {
    failed = error instanceof Error ? error.message : String(error);
  };
  const drop = async (keys: string[]): Promise<void> => {
    if (!keys.length) return;
    const tx = db.transaction([ENTRIES, TREES], 'readwrite', { durability: 'relaxed' });
    for (const k of keys) {
      tx.objectStore(ENTRIES).delete(k);
      tx.objectStore(TREES).delete(k);
    }
    await settled(tx);
    for (const k of keys) entries.delete(k);
    counts.evicted += keys.length;
  };
  try {
    await drop(evictions([...entries.values()], namespace, 0, cap)); // (other namespaces' entries, and any overflow)
  } catch (error) {
    fail(error);
    return null;
  }
  /** Writes one after another: each sees the entries the last one left. */
  let writing: Promise<unknown> = Promise.resolve();
  return {
    entry: (key) => (failed ? undefined : entries.get(key)),
    async read<T extends object>(key: string): Promise<T | null> {
      const e = entries.get(key);
      if (failed || !e) return null;
      try {
        inUse.add(key);
        const reply = await done(db.transaction(TREES).objectStore(TREES).get(key) as IDBRequest<T | undefined>);
        if (!reply) {
          counts.misses++;
          return null;
        }
        counts.hits++;
        e.at = Date.now();
        // (its last use, for the eviction order; not waited for)
        try {
          db.transaction(ENTRIES, 'readwrite', { durability: 'relaxed' }).objectStore(ENTRIES).put(e);
        } catch { /* (the order is only a little stale) */ }
        return reply;
      } catch (error) {
        fail(error);
        return null;
      }
    },
    write(key, reply) {
      if (failed) return Promise.resolve(false);
      const run = writing.then(async () => {
        if (failed) return false;
        try {
          const e: CacheEntry = { key, namespace, bytes: replyBytes(reply), at: Date.now(), digest: replyDigest(reply) };
          inUse.add(key);
          await drop(evictions([...entries.values()].filter((x) => x.key !== key), namespace, e.bytes, cap, inUse));
          // (what this page uses is never dropped: when that alone fills the cache, this one is not stored)
          let held = e.bytes;
          for (const x of entries.values()) if (x.key !== key) held += x.bytes;
          if (held > cap) return false;
          const tx = db.transaction([ENTRIES, TREES], 'readwrite', { durability: 'relaxed' });
          tx.objectStore(ENTRIES).put(e);
          tx.objectStore(TREES).put(reply, key);
          await settled(tx);
          entries.set(key, e);
          counts.writes++;
          return true;
        } catch (error) {
          fail(error); // (the quota, most likely: no more writes or reads from here)
          return false;
        }
      });
      writing = run;
      return run;
    },
    async clear() {
      try {
        const tx = db.transaction([ENTRIES, TREES], 'readwrite', { durability: 'relaxed' });
        tx.objectStore(ENTRIES).clear();
        tx.objectStore(TREES).clear();
        await settled(tx);
        entries.clear();
        return true;
      } catch (error) {
        fail(error);
        return false;
      }
    },
    stats: () => {
      const mine = [...entries.values()].filter((e) => e.namespace === namespace);
      return { entries: mine.length, bytes: mine.reduce((n, e) => n + e.bytes, 0), capBytes: cap, otherNamespaces: entries.size - mine.length, ...counts, failed };
    },
  };
}
