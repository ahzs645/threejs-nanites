// node --test examples/pgmaps/content-hash.test.ts
/// <reference types="node" />
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { contentHash, sceneKey } from './content-hash.ts';
import { random } from './tree-bins.ts';

/** A small package of the real one's shape: grids of posts (numbers and nulls), a stem table, polygons, names. */
function scene(seed = 1) {
  const rnd = random(seed);
  const grid = (columns: number, rows: number, spacing: number) => ({
    west: -columns * spacing / 2, south: -rows * spacing / 2, spacing, columns, rows,
    heights: Array.from({ length: columns * rows }, () => Math.round(rnd() * 200000) / 100),
    canopy: Array.from({ length: columns * rows }, () => (rnd() < 0.2 ? 0 : 0.45)),
    cover: Array.from({ length: columns * rows }, () => Math.floor(rnd() * 8)),
    burntYear: Array.from({ length: columns * rows }, () => (rnd() < 0.9 ? null : 2017)),
  });
  return {
    format: 'pgmaps-forest-scene', version: 1, createdAt: '2026-11-15T09:27:19.316Z',
    origin: { lng: -116.9632011, lat: 50.2488275, elevationMeters: 558.03 },
    terrain: grid(9, 7, 30), farTerrain: grid(5, 5, 60),
    trees: { fields: ['x', 'y', 'z', 'species', 'height', 'crownWidth', 'tone'], species: ['pine', 'spruce'], count: 40, data: Array.from({ length: 280 }, () => rnd() * 500 - 250) },
    species: { pine: { label: 'Lodgepole pine', crownRatio: 0.14, crownBase: 0.54, broadleaf: false }, spruce: { label: 'Interior spruce', crownRatio: 0.17, crownBase: 0.3, broadleaf: false } },
    openings: [{ id: 'a', rings: [[[0, 0], [50, 0], [50, 40]]], harvestYear: 2019 }],
    water: [{ rings: [[[-10, -10], [10, -10], [10, 10], [-10, 10]]], elevation: null }],
    camera: { position: [0, 0, 559.63], bearingDegrees: 89.99986483693829, pitchDegrees: -5.5, verticalFovDegrees: 36.87 },
    environment: { dateTime: '2026-11-15T14:00:00-07:00', ground: 'bare', weather: 'clear', cloudCover: 0.2 },
    notes: ['Hwy 31 (looking north)'],
  };
}

/** Every path to a leaf of `v` (a number, string, boolean or null). */
function leaves(v: unknown, path: Array<string | number> = [], out: Array<Array<string | number>> = []): Array<Array<string | number>> {
  if (v !== null && typeof v === 'object') for (const [k, e] of Object.entries(v)) leaves(e, [...path, Array.isArray(v) ? Number(k) : k], out);
  else out.push(path);
  return out;
}
const at = (v: unknown, path: Array<string | number>): unknown => path.reduce((o, k) => (o as Record<string | number, unknown>)[k], v);
function withLeaf<T>(v: T, path: Array<string | number>, value: unknown): T {
  const copy = structuredClone(v);
  (at(copy, path.slice(0, -1)) as Record<string | number, unknown>)[path[path.length - 1]] = value;
  return copy;
}

test('equal packages hash alike: a clone, a JSON round trip, the same package twice', () => {
  const a = scene();
  const h = contentHash(a);
  assert.match(h, /^[0-9a-f]{32}$/);
  assert.equal(contentHash(a), h);
  assert.equal(contentHash(structuredClone(a)), h); // (what postMessage hands the engine)
  assert.equal(contentHash(JSON.parse(JSON.stringify(a))), h);
  assert.equal(contentHash(scene()), h);
  assert.notEqual(contentHash(scene(2)), h);
});

test('any single changed value changes the hash', () => {
  const a = scene();
  const h = contentHash(a);
  const paths = leaves(a);
  assert.ok(paths.length > 600, `${paths.length} leaves`);
  const seen = new Set([h]);
  for (const path of paths) {
    const v = at(a, path);
    const changed: unknown[] =
      typeof v === 'number' ? [v + 1, v === 0 ? 5e-324 : v * (1 + 2 ** -52), -v || -0, null, String(v), NaN]
      : typeof v === 'string' ? [`${v} `, v.slice(1), v.toUpperCase() === v ? v.toLowerCase() : v.toUpperCase(), null]
      : typeof v === 'boolean' ? [!v, null, 0]
      : [0, 2017, undefined, 'null', false];
    for (const c of changed) {
      if (Object.is(c, v)) continue;
      const hc = contentHash(withLeaf(a, path, c));
      assert.notEqual(hc, h, `${path.join('.')}: ${String(v)} -> ${String(c)}`);
      seen.add(hc);
    }
  }
  // (and the changed packages' hashes are spread: thousands of them, few alike, those the same change made twice)
  assert.ok(seen.size > 2500, `${seen.size} distinct`);
  const all = paths.flatMap((path) => (typeof at(a, path) === 'number' ? [contentHash(withLeaf(a, path, (at(a, path) as number) + 1))] : []));
  assert.equal(new Set(all).size, all.length);
});

test('structure counts: nesting, lengths, order, kinds', () => {
  const distinct = [
    [1, [2]], [[1], 2], [1, 2], [[1, 2]], [1, 2, undefined], [1, 2, null], [], [[]], {}, [{}], '', [''], 0, -0, [0], [-0], '0', null, undefined, false,
    [5e-324], [null], { a: 1, b: 2 }, { b: 2, a: 1 }, { a: [1, 2] }, { a: 1, 2: 2 }, 'ab', ['a', 'b'], 'a\u0000', 'a',
    new Float32Array([1, 2]), new Float32Array([1, 2, 0]), new Float64Array([1, 2]), new Uint8Array(new Float32Array([1, 2]).buffer), new Uint8Array([1, 2, 3, 4, 5]), new Uint8Array([1, 2, 3, 4, 6]),
  ];
  const hashes = distinct.map(contentHash);
  assert.equal(new Set(hashes).size, distinct.length);
});

test('typed arrays hash by their bytes, wherever they sit in a buffer', () => {
  const rnd = random(4);
  const data = Float32Array.from({ length: 10001 }, () => rnd() * 1000);
  const h = contentHash({ count: 10001, data });
  assert.equal(contentHash({ count: 10001, data: data.slice() }), h);
  // (a view that does not start on a word)
  const shifted = new Uint8Array(data.byteLength + 3);
  shifted.set(new Uint8Array(data.buffer), 3);
  assert.equal(contentHash(new Uint8Array(shifted.buffer, 3)), contentHash(new Uint8Array(data.buffer)));
  for (const i of [0, 1, 5000, 9999, 10000]) {
    const other = data.slice();
    other[i] = Math.fround(other[i] * (1 + 2 ** -20)) === other[i] ? other[i] + 1 : other[i] * (1 + 2 ** -20);
    assert.notEqual(contentHash({ count: 10001, data: other }), h, `element ${i}`);
  }
});

test("a scene's key leaves createdAt out and nothing else", () => {
  const a = scene();
  const k = sceneKey(a);
  assert.equal(sceneKey({ ...a, createdAt: '2026-11-15T09:27:55.000Z' }), k);
  assert.equal(sceneKey({ ...a, createdAt: undefined }), k);
  assert.notEqual(contentHash({ ...a, createdAt: '2026-11-15T09:27:55.000Z' }), contentHash(a));
  for (const key of Object.keys(a).filter((key) => key !== 'createdAt')) {
    const without = { ...a } as Record<string, unknown>;
    delete without[key];
    assert.notEqual(sceneKey(without), k, `without ${key}`);
  }
  assert.notEqual(sceneKey(withLeaf(a, ['terrain', 'heights', 17], 1)), k);
  assert.notEqual(sceneKey(withLeaf(a, ['environment', 'weather'], 'rain')), k);
});
