// node --test examples/pgmaps/tree-bins.test.ts
/// <reference types="node" />
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  LADDER, LADDER_STEP, LADDER_STEPS, RATIO_MAX, RATIO_MIN, TOP_RUNG, assignBins, binOf, binRatio, binSeed, errorSummary, geometrySeed, orderByType, random,
} from './tree-bins.ts';

const SPECIES_SEEDS = [101, 202, 303, 404, 505, 606];

/** A stand: stems with a species, a place and a crown width / height ratio (log-normal round 0.3, some past the ends). */
function stand(n: number, seed: number) {
  const rnd = random(seed);
  return Array.from({ length: n }, (_, id) => {
    const u = rnd() + rnd() + rnd() - 1.5;
    return { id, species: SPECIES_SEEDS[Math.floor(rnd() * SPECIES_SEEDS.length)], x: rnd() * 800, y: rnd() * 800, ratio: 0.3 * Math.exp(u * 1.6) };
  });
}

/** Each stem's type as buildStand derives it: its species' rungs over the stems present. */
function types(stems: ReturnType<typeof stand>) {
  const out = new Map<number, { bin: number; ratio: number; seed: number }>();
  for (const sp of SPECIES_SEEDS) {
    const of = stems.filter((s) => s.species === sp);
    const { binOf: bins } = assignBins(of.map((s) => s.ratio));
    of.forEach((s, k) => out.set(s.id, { bin: bins[k], ratio: binRatio(bins[k]), seed: binSeed(sp, bins[k]) }));
  }
  return out;
}

test('the ladder runs from the generator\'s lower limit to its upper one in equal log steps', () => {
  assert.equal(LADDER.length, TOP_RUNG + 1);
  assert.equal(LADDER[0], RATIO_MIN);
  assert.equal(LADDER[LADDER_STEPS], RATIO_MAX);
  for (let k = 1; k < LADDER.length; k++) assert.ok(Math.abs(LADDER[k] / LADDER[k - 1] - LADDER_STEP) < 1e-9);
  assert.ok(LADDER_STEP > 1.3 && LADDER_STEP < 1.4);
});

test('a stem takes the rung nearest its ratio in log terms', () => {
  for (let k = 0; k <= LADDER_STEPS; k++) assert.equal(binOf(LADDER[k]), k);
  for (let r = 0.05; r < 2; r *= 1.01) {
    const k = binOf(r);
    for (let j = 0; j <= LADDER_STEPS; j++) assert.ok(Math.abs(Math.log(r / LADDER[k])) <= Math.abs(Math.log(r / LADDER[j])) + 1e-12);
  }
  assert.equal(binOf(0.01), 0);
  assert.equal(binOf(RATIO_MAX * 1.05), LADDER_STEPS);
  // (a far stem standing for several trees: a clump rung, its own crown width kept within half a step)
  assert.ok(binOf(2.4) > LADDER_STEPS && Math.abs(Math.log(2.4 / LADDER[binOf(2.4)])) <= Math.log(LADDER_STEP) / 2 + 1e-12);
  assert.equal(binOf(100), TOP_RUNG);
  assert.equal(binOf(NaN), 0);
  assert.equal(binOf(0), 0);
});

test('a harvest of 40% leaves every retained stem its rung, its rung\'s ratio and its seed', () => {
  const before = stand(5000, 7);
  const rnd = random(99);
  const after = before.filter(() => rnd() >= 0.4);
  assert.ok(after.length > 2700 && after.length < 3300);
  const a = types(before), b = types(after);
  for (const s of after) assert.deepEqual(b.get(s.id), a.get(s.id), `stem ${s.id}`);
  // the rungs grown after the harvest are a subset of those before
  for (const sp of SPECIES_SEEDS) {
    const grownBefore = new Set(assignBins(before.filter((s) => s.species === sp).map((s) => s.ratio)).bins);
    for (const bin of assignBins(after.filter((s) => s.species === sp).map((s) => s.ratio)).bins) assert.ok(grownBefore.has(bin));
  }
});

test('only rungs that have stems are grown', () => {
  const { binOf: of, bins } = assignBins([0.3, 0.31, 0.29, 0.9]);
  assert.deepEqual(bins, [...new Set(of)].sort((x, y) => x - y));
  assert.equal(bins.length, 2);
});

test('the quantisation error stays within half a step', () => {
  const stems = stand(2000, 3).filter((s) => s.ratio >= RATIO_MIN && s.ratio <= RATIO_MAX);
  const errors = stems.map((s) => Math.abs(s.ratio / binRatio(binOf(s.ratio)) - 1));
  const { mean, p90 } = errorSummary(errors);
  const half = Math.sqrt(LADDER_STEP) - 1;
  assert.ok(Math.max(...errors) <= half + 1e-9);
  assert.ok(mean < 0.1 && p90 <= half + 1e-9);
});

test('a debris pile\'s seed comes from its place, whatever the order of the piles', () => {
  const rnd = random(5);
  const piles = Array.from({ length: 300 }, () => ({ x: rnd() * 600 - 300, y: rnd() * 600 - 300 }));
  const draws = (p: { x: number; y: number }) => {
    const r = random(geometrySeed(p.x, p.y));
    return [r(), r(), r(), r()];
  };
  const first = new Map(piles.map((p) => [`${p.x},${p.y}`, draws(p)]));
  // reversed, shuffled and with a third dropped: each remaining pile draws the same numbers
  const shuffled = piles.slice().reverse().filter((_, i) => i % 3 !== 0);
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  for (const p of shuffled) assert.deepEqual(draws(p), first.get(`${p.x},${p.y}`));
  // distinct places, distinct seeds (no collisions over this set)
  assert.equal(new Set(piles.map((p) => geometrySeed(p.x, p.y))).size, piles.length);
  // a float's last bits (a package re-encoded) do not move it
  assert.equal(geometrySeed(12.3400001, -45.6699999), geometrySeed(12.34, -45.67));
});

test('the error summary is bit for bit what sorting with a comparator gave', () => {
  // (the summary before it sorted in a typed array: Array.sort with a comparator, summed in ascending order)
  const bySort = (errors: readonly number[]) => {
    if (!errors.length) return { mean: 0, p90: 0 };
    const sorted = errors.slice().sort((a, b) => a - b);
    return { mean: sorted.reduce((s, e) => s + e, 0) / sorted.length, p90: sorted[Math.floor(sorted.length * 0.9)] ?? 0 };
  };
  assert.deepEqual(errorSummary([]), { mean: 0, p90: 0 });
  assert.deepEqual(errorSummary(new Float64Array(0)), { mean: 0, p90: 0 });
  for (const [n, seed] of [[1, 1], [2, 2], [9, 3], [10, 4], [11, 5], [1000, 6], [54321, 7]]) {
    const rnd = random(seed);
    // (duplicates, zeros and a long tail, as a stand's crown errors have)
    const errors = Array.from({ length: n }, () => (rnd() < 0.1 ? 0 : rnd() < 0.3 ? 0.125 : Math.abs(Math.exp(rnd() * 6 - 5) - 0.01)));
    const want = bySort(errors);
    for (const got of [errorSummary(errors), errorSummary(Float64Array.from(errors))]) {
      assert.equal(got.mean, want.mean, `mean of ${n}`);
      assert.equal(got.p90, want.p90, `p90 of ${n}`);
    }
    // (the figures as the panel and the stats message print them)
    assert.equal((errorSummary(errors).mean * 100).toFixed(1), (want.mean * 100).toFixed(1));
    assert.equal(errorSummary(errors).p90.toFixed(4), want.p90.toFixed(4));
  }
});

test('stems ordered by type as a stable sort orders them', () => {
  assert.deepEqual([...orderByType(new Int32Array(0))], []);
  for (const [n, types, seed] of [[1, 1, 1], [50, 3, 2], [5000, 64, 3], [5000, 1, 4]]) {
    const rnd = random(seed);
    const typeOf = Int32Array.from({ length: n }, () => Math.floor(rnd() * types));
    const want = Array.from({ length: n }, (_, i) => i).sort((x, y) => typeOf[x] - typeOf[y]);
    assert.deepEqual([...orderByType(typeOf)], want);
  }
});
