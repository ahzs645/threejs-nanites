// node --test examples/pgmaps/tree-bins.test.ts
/// <reference types="node" />
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  LADDER, LADDER_STEP, LADDER_STEPS, RATIO_MAX, RATIO_MIN, assignBins, binOf, binRatio, binSeed, errorSummary, geometrySeed, random,
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
  assert.equal(LADDER.length, LADDER_STEPS + 1);
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
  assert.equal(binOf(5), LADDER_STEPS);
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
