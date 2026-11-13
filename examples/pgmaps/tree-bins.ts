// The pure parts of the stand's tree types and the debris' variation, kept free of the DOM and of three so
// `node --test examples/pgmaps/tree-bins.test.ts` runs them.
//
// A stem's crown model must not depend on which other stems the package carries: a harvest phase removes stems, and a
// retained stem has to keep its tree. So a species' stems are not clustered (that moved the classes when stems went);
// each stem takes the rung nearest its own crown width / height ratio on one fixed geometric ladder, and a type's
// generator seed comes from the species and the rung alone.
//
// The ladder: 11 rungs from 0.08 to 1.2 (the generator's allowed ratios, tree-worker.ts), each ×15^(1/10) ≈ 1.311 the
// last. The ends are the generator's limits, so a clamped stem sits on a rung exactly; ×1.31 keeps the worst
// quantisation within √1.311 − 1 ≈ 14.5% of a stem's crown width (about 7% on average for ratios spread evenly in log
// terms), and a species with a typical spread of ratios (0.2–0.5) grows about four types.

/** The generator's crown width / height limits (tree-worker.ts grows nothing outside them). */
export const RATIO_MIN = 0.08, RATIO_MAX = 1.2;
/** Steps on the ladder (rungs: one more). */
export const LADDER_STEPS = 10;
/** The ratio between neighbouring rungs (≈ 1.311). */
export const LADDER_STEP = (RATIO_MAX / RATIO_MIN) ** (1 / LADDER_STEPS);

/** The ladder's ratios, rung 0 (RATIO_MIN) to rung LADDER_STEPS (RATIO_MAX). */
export const LADDER: readonly number[] = Array.from({ length: LADDER_STEPS + 1 }, (_, k) => (k === LADDER_STEPS ? RATIO_MAX : RATIO_MIN * LADDER_STEP ** k));

/** The rung nearest a ratio in log terms (ratios past the ends take the end rungs; no ratio, rung 0). */
export function binOf(ratio: number): number {
  if (!(ratio > 0)) return 0;
  const k = Math.round(Math.log(ratio / RATIO_MIN) / Math.log(LADDER_STEP));
  return Math.min(LADDER_STEPS, Math.max(0, k));
}

/** A rung's ratio. */
export const binRatio = (bin: number): number => LADDER[bin];

/** A tree type's generator seed: the species' own seed and the rung, nothing else. */
export const binSeed = (speciesSeed: number, bin: number): number => speciesSeed + bin * 17;

/**
 * A species' stems on the ladder: each stem's rung, and the rungs that have stems (ascending), the only ones grown.
 */
export function assignBins(ratios: readonly number[]): { binOf: number[]; bins: number[] } {
  const of = ratios.map(binOf);
  return { binOf: of, bins: [...new Set(of)].sort((a, b) => a - b) };
}

/** Mean and 90th percentile of a list of errors (0 for none). */
export function errorSummary(errors: readonly number[]): { mean: number; p90: number } {
  if (!errors.length) return { mean: 0, p90: 0 };
  const sorted = errors.slice().sort((a, b) => a - b);
  return { mean: sorted.reduce((s, e) => s + e, 0) / sorted.length, p90: sorted[Math.floor(sorted.length * 0.9)] ?? 0 };
}

/**
 * A seed from an item's own place: its coordinates rounded to `step` metres (default 0.1 m), hashed. The same item
 * gets the same seed whatever else the package carries and in whatever order.
 */
export function geometrySeed(x: number, y: number, step = 0.1): number {
  const ix = Math.round(x / step) | 0, iy = Math.round(y / step) | 0;
  let h = 0x811c9dc5 ^ Math.imul(ix, 0x9e3779b1);
  h = Math.imul(h ^ (h >>> 16), 0x85ebca6b);
  h ^= Math.imul(iy, 0xc2b2ae35);
  h = Math.imul(h ^ (h >>> 13), 0x27d4eb2f);
  return (h ^ (h >>> 16)) >>> 0;
}

/** A seeded random in 0..1 (mulberry32). */
export function random(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
