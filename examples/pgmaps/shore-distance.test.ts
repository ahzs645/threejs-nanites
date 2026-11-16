// node --test examples/pgmaps/shore-distance.test.ts
/// <reference types="node" />
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { shoreDistances, type ShoreRing } from './shore-distance.ts';
import { random } from './tree-bins.ts';

/** The shore distances as water.ts worked them out before the cells: every texel against every edge. */
function everyEdge(shapes: ShoreRing[][], cap = 30) {
  const pts = shapes.flatMap((rings) => rings.flat());
  const xs = pts.map((q) => q[0]), ys = pts.map((q) => q[1]);
  const west = Math.min(...xs) - 5, east = Math.max(...xs) + 5, south = Math.min(...ys) - 5, north = Math.max(...ys) + 5;
  const N = Math.max(16, Math.min(512, Math.ceil(Math.max(east - west, north - south) / 2)));
  const segs: number[][] = [];
  for (const rings of shapes) for (const r of rings) for (let i = 0; i < r.length; i++) segs.push([...r[i], ...r[(i + 1) % r.length]]);
  const px = new Uint8Array(N * N * 4);
  for (let j = 0; j < N; j++)
    for (let i = 0; i < N; i++) {
      const x = west + ((i + 0.5) / N) * (east - west), y = south + ((j + 0.5) / N) * (north - south);
      let d2 = cap * cap;
      for (const [ax, ay, bx, by] of segs) {
        if (Math.min(ax, bx) - x > cap || x - Math.max(ax, bx) > cap || Math.min(ay, by) - y > cap || y - Math.max(ay, by) > cap) continue;
        const dx = bx - ax, dy = by - ay, l = dx * dx + dy * dy;
        const t = l > 0 ? Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / l)) : 0;
        d2 = Math.min(d2, (ax + t * dx - x) ** 2 + (ay + t * dy - y) ** 2);
      }
      px[(j * N + i) * 4] = Math.round((Math.sqrt(d2) / cap) * 255);
      px[(j * N + i) * 4 + 3] = 255;
    }
  return { px, size: N, west, south, east, north };
}

/** A wobbly ring of `n` points round (cx, cy). */
function blob(rnd: () => number, cx: number, cy: number, radius: number, n: number): Array<[number, number]> {
  return Array.from({ length: n }, (_, k) => {
    const a = (k / n) * Math.PI * 2, r = radius * (0.6 + 0.8 * rnd());
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
  });
}

test('the shore distances through the cells are the bytes every texel against every edge gave', () => {
  const rnd = random(11);
  const cases: ShoreRing[][][] = [
    [[blob(rnd, 0, 0, 12, 7)]], // (a pond smaller than the cap: 16 texels)
    [[blob(rnd, 100, -40, 150, 60), blob(rnd, 110, -30, 30, 9)]], // (a lake with an island)
    [[blob(rnd, -900, 700, 400, 300)], [blob(rnd, 300, 200, 80, 20)], [blob(rnd, -200, -500, 25, 5)]], // (three bodies far apart: 512 texels)
    [[[[0, 0], [2000, 0], [2000, 31], [0, 31]]]], // (a long river reach: edges far longer than the cap)
    [[[[0, 0, 5], [60, 0, 5], [60, 60, 5], [0, 60, 5]]]], // (points with a third number, read as the spread read them)
    [[[[0.5, 0.5], [90.25, 0.5], [90.25, 60.125], [45, 30], [0.5, 60.125]]]], // (texel centres on cell edges)
  ];
  for (const [k, shapes] of cases.entries()) {
    const want = everyEdge(shapes), got = shoreDistances(shapes);
    assert.deepEqual({ size: got.size, west: got.west, south: got.south, east: got.east, north: got.north }, { size: want.size, west: want.west, south: want.south, east: want.east, north: want.north }, `case ${k}: the box`);
    assert.ok(Buffer.from(got.px).equals(Buffer.from(want.px)), `case ${k}: the texels`);
    assert.ok(got.px.some((v, i) => i % 4 === 0 && v > 0 && v < 255), `case ${k}: some texels near the shore`);
  }
  // another cap
  const lake = [[blob(rnd, 0, 0, 200, 80)]];
  assert.ok(Buffer.from(shoreDistances(lake, 12).px).equals(Buffer.from(everyEdge(lake, 12).px)));
});

test('an edge with a number that is not finite spoils the same texels as before', () => {
  // (a point's third number is read as the next edge's end: here an Infinity, in a box that stays finite)
  const three: ShoreRing[][] = [[[[0, 0, 0], [80, 0, Infinity], [80, 80, 0], [0, 80, 0]]]];
  const want = everyEdge(three), got = shoreDistances(three);
  assert.equal(got.size, want.size);
  assert.ok(Buffer.from(got.px).equals(Buffer.from(want.px)));
});
