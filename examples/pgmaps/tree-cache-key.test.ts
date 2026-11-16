// node --test examples/pgmaps/tree-cache-key.test.ts
/// <reference types="node" />
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  GROW_VERSION, TREE_CACHE_CAP_BYTES, TREE_CACHE_FORMAT, evictions, lockedVersion, replyBytes, replyDigest, treeCacheKey, treeCacheNamespace, type CacheEntry, type CachedJob,
} from './tree-cache-key.ts';
import { random } from './tree-bins.ts';

const versions = { engine: '1.0.0+467b44c', ezTree: '1.1.0 sha512-6pvS6hD6', meshoptimizer: '1.3.0 sha512-abc' };
const job = (): CachedJob => ({
  look: { preset: 'Pine Large', conifer: true, bark: 'pine', leaf: 'pine', barkTint: [0.92, 0.86, 0.8], leafTint: [0.7, 0.78, 1.05], options: { branch: { angle: { 1: 98 } }, leaves: { count: 16, size: 2.4 } }, seed: 101 },
  seed: 118, height: 20, ratio: 0.1049, crownBase: 0.54, leafMask: { size: 4, bits: Uint8Array.from([0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0]) },
});

/** A reply as tree-worker.ts posts one: the DAG's arrays, the source meshes, a few numbers. */
function reply(seed: number, n = 600) {
  const rnd = random(seed);
  const f32 = (len: number) => Float32Array.from({ length: len }, () => rnd() * 40 - 20);
  const u32 = (len: number) => Uint32Array.from({ length: len }, () => Math.floor(rnd() * n));
  return {
    id: 7, vtx: f32(n * 8), idx: u32(n * 3), rec: f32(64), meta: u32(32), stats: { barkTris: 100, leafTris: 80, barkClusters: 3, leafClusters: 2, barkLevels: 2, leafGrowth: [1.3, 1.29], ms: 94 },
    src: { bark: { pos: f32(n * 3), nrm: f32(n * 3), uv: f32(n * 2), idx: u32(n * 3) }, leaves: { pos: f32(n * 3), nrm: f32(n * 3), uv: f32(n * 2), vpl: 4 } },
    radius: 12.5, height: 20, grown: 0.1031, squash: 1.0175, ms: 187.3,
  };
}

test("the lockfile's version of a package, with its integrity hash; null when it lists none", () => {
  const lock = JSON.stringify({ packages: { '': { version: '1.0.0' }, 'node_modules/@dgreenheck/ez-tree': { version: '1.1.0', integrity: 'sha512-6pvS' }, 'node_modules/meshoptimizer': { version: '1.3.0' }, 'node_modules/x/node_modules/meshoptimizer': { version: '1.1.1' } } });
  assert.equal(lockedVersion(lock, '@dgreenheck/ez-tree'), '1.1.0 sha512-6pvS');
  assert.equal(lockedVersion(lock, 'meshoptimizer'), '1.3.0');
  assert.equal(lockedVersion(lock, 'three'), null);
  assert.equal(lockedVersion('not json', 'meshoptimizer'), null);
  assert.equal(lockedVersion('{}', 'meshoptimizer'), null);
  // this repository's own lockfile names both libraries the trees are grown with
  const own = readFileSync(new URL('../../package-lock.json', import.meta.url), 'utf8');
  assert.match(lockedVersion(own, '@dgreenheck/ez-tree') ?? '', /^\d+\.\d+\.\d+ sha512-/);
  assert.match(lockedVersion(own, 'meshoptimizer') ?? '', /^\d+\.\d+\.\d+ sha512-/);
});

test('the namespace holds every version; an unknown library means no cache', () => {
  const ns = treeCacheNamespace(versions)!;
  assert.deepEqual(JSON.parse(ns), { format: TREE_CACHE_FORMAT, grow: GROW_VERSION, ...versions });
  assert.equal(treeCacheNamespace({ ...versions }), ns);
  const others = [
    treeCacheNamespace({ ...versions, grow: GROW_VERSION + 1 }), treeCacheNamespace({ ...versions, format: TREE_CACHE_FORMAT + 1 }),
    treeCacheNamespace({ ...versions, engine: '1.0.0+467b44c-dirty' }), treeCacheNamespace({ ...versions, ezTree: '1.1.1 sha512-6pvS6hD6' }),
    treeCacheNamespace({ ...versions, ezTree: '1.1.0 sha512-other' }), treeCacheNamespace({ ...versions, meshoptimizer: '1.3.1 sha512-abc' }),
  ];
  assert.equal(new Set([ns, ...others]).size, others.length + 1);
  assert.equal(treeCacheNamespace({ ...versions, ezTree: null }), null);
  assert.equal(treeCacheNamespace({ ...versions, meshoptimizer: null }), null);
  assert.equal(treeCacheNamespace({ ...versions, engine: '' }), null);
});

test('a key is the namespace and the whole job: any changed value of the job is another key', () => {
  const ns = treeCacheNamespace(versions)!;
  const key = treeCacheKey(ns, job());
  assert.equal(treeCacheKey(ns, job()), key);
  assert.equal(treeCacheKey(ns, structuredClone(job())), key);
  // (the id a stand gives a type is not part of it)
  assert.equal(treeCacheKey(ns, { ...job(), id: 31 } as CachedJob), key);
  const keys = new Set([key]);
  const differs = (k: string, what: string) => {
    assert.ok(!keys.has(k), what);
    keys.add(k);
  };
  differs(treeCacheKey(treeCacheNamespace({ ...versions, grow: GROW_VERSION + 1 })!, job()), 'the growing code\'s version');
  differs(treeCacheKey(treeCacheNamespace({ ...versions, ezTree: '1.2.0 sha512-zz' })!, job()), 'the tree library\'s version');
  differs(treeCacheKey(treeCacheNamespace({ ...versions, engine: '1.0.1+0000000' })!, job()), 'the engine\'s version');
  differs(treeCacheKey(ns, { ...job(), seed: 135 }), 'the seed');
  differs(treeCacheKey(ns, { ...job(), height: 21 }), 'the height');
  differs(treeCacheKey(ns, { ...job(), ratio: 0.10490000000000001 }), 'the ratio, by its last bit');
  differs(treeCacheKey(ns, { ...job(), crownBase: null }), 'no crown base');
  differs(treeCacheKey(ns, { ...job(), crownBase: 0.55 }), 'the crown base');
  differs(treeCacheKey(ns, { ...job(), leafMask: null }), 'no mask');
  const look = job().look as Record<string, unknown>;
  differs(treeCacheKey(ns, { ...job(), look: { ...look, preset: 'Aspen Large' } }), 'the preset');
  differs(treeCacheKey(ns, { ...job(), look: { ...look, conifer: false } }), 'the kind');
  differs(treeCacheKey(ns, { ...job(), look: { ...look, leafTint: [0.7, 0.78, 1.06] } }), 'a tint');
  differs(treeCacheKey(ns, { ...job(), look: { ...look, options: { branch: { angle: { 1: 99 } }, leaves: { count: 16, size: 2.4 } } } }), 'a preset option');
  differs(treeCacheKey(ns, { ...job(), look: { ...look, options: { branch: { angle: { 1: 98 } }, leaves: { count: 16, size: 2.4, angle: 22 } } } }), 'a preset option more');
  // every bit of the leaf mask, and its size
  const mask = job().leafMask!;
  for (let i = 0; i < mask.bits.length; i++) {
    const bits = mask.bits.slice();
    bits[i] ^= 1;
    differs(treeCacheKey(ns, { ...job(), leafMask: { size: mask.size, bits } }), `mask bit ${i}`);
  }
  differs(treeCacheKey(ns, { ...job(), leafMask: { size: 2, bits: mask.bits } }), 'the mask\'s size');
});

test("a reply's digest covers every array and number, the growth's own time and id apart", () => {
  const a = reply(1);
  const d = replyDigest(a);
  assert.equal(replyDigest(reply(1)), d);
  assert.equal(replyDigest(structuredClone(a)), d); // (what the cache stores and hands back)
  assert.equal(replyDigest({ ...a, ms: 12, id: 3 }), d);
  assert.equal(replyDigest({ ...a, stats: { ...a.stats, ms: 131 } }), d); // (the DAG build's own time)
  assert.notEqual(replyDigest({ ...a, stats: { ...a.stats, leafGrowth: [1.3, 1.3] } }), d);
  assert.notEqual(replyDigest(reply(2)), d);
  assert.notEqual(replyDigest({ ...a, radius: 12.500000000000002 }), d);
  assert.notEqual(replyDigest({ ...a, squash: 1.02 }), d);
  assert.notEqual(replyDigest({ ...a, stats: { ...a.stats, leafTris: 81 } }), d);
  assert.notEqual(replyDigest({ ...a, src: { ...a.src, leaves: { ...a.src.leaves, vpl: 8 } } }), d);
  // one element of each array, first and last
  const arrays: Array<[string, (r: ReturnType<typeof reply>) => Float32Array | Uint32Array]> = [
    ['vtx', (r) => r.vtx], ['idx', (r) => r.idx], ['rec', (r) => r.rec], ['meta', (r) => r.meta], ['bark.pos', (r) => r.src.bark.pos], ['bark.nrm', (r) => r.src.bark.nrm],
    ['bark.uv', (r) => r.src.bark.uv], ['bark.idx', (r) => r.src.bark.idx], ['leaves.pos', (r) => r.src.leaves.pos], ['leaves.nrm', (r) => r.src.leaves.nrm], ['leaves.uv', (r) => r.src.leaves.uv],
  ];
  for (const [name, of] of arrays)
    for (const end of [false, true]) {
      const b = structuredClone(a), arr = of(b), i = end ? arr.length - 1 : 0;
      arr[i] += 1;
      assert.notEqual(arr[i], of(a)[i]);
      assert.notEqual(replyDigest(b), d, `${name}[${i}]`);
    }
  // its weight: the arrays' bytes
  assert.equal(replyBytes(a), arrays.reduce((n, [, of]) => n + of(a).byteLength, 0));
});

test('what a full cache drops: other namespaces first, then the least recently used, never an entry in use', () => {
  const ns = treeCacheNamespace(versions)!, old = treeCacheNamespace({ ...versions, grow: GROW_VERSION - 1 })!;
  const e = (key: string, bytes: number, at: number, namespace = ns): CacheEntry => ({ key, namespace, bytes, at, digest: 'd' });
  const entries = [e('a', 30, 5), e('b', 30, 2), e('c', 30, 9), e('old1', 30, 99, old), e('d', 30, 1), e('old2', 5, 0, old)];
  // room for all of this namespace: only the other namespace's go
  assert.deepEqual(evictions(entries, ns, 10, 200), ['old1', 'old2']);
  // 120 held + 30 incoming over a cap of 100: the two oldest go (d, then b)
  assert.deepEqual(evictions(entries, ns, 30, 100), ['old1', 'old2', 'd', 'b']);
  // an entry in use stays; the next oldest goes in its place
  assert.deepEqual(evictions(entries, ns, 30, 100, new Set(['d'])), ['old1', 'old2', 'b', 'a']);
  // nothing fits: everything not in use goes
  assert.deepEqual(evictions(entries, ns, 500, 100, new Set(['c'])), ['old1', 'old2', 'd', 'b', 'a']);
  assert.deepEqual(evictions([], ns, 30, 100), []);
  // the limit as shipped holds the measured scene (62 types of 2.6 MB) twice over
  assert.ok(TREE_CACHE_CAP_BYTES >= 2 * 62 * 2.6e6 && TREE_CACHE_CAP_BYTES <= 512 * 1024 * 1024);
  const scene = Array.from({ length: 62 }, (_, k) => e(`t${k}`, 2_600_000, k));
  assert.deepEqual(evictions(scene, ns, 2_600_000), []);
});
