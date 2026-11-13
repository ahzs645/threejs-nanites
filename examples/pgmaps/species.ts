// The B.C. species PGMaps sends, as ez-tree trees: a preset and the changes that make a conifer a narrow spire and a
// broadleaf an open crown, the demo's bark and leaf images tinted per species, and the crown-width classes a
// species' stems are binned into (instances take one uniform scale: a type per class keeps each stem's height and
// gets its crown width approximately). No DOM: the tree worker reads it too.

export type BarkImage = 'pine' | 'birch' | 'oak';
export type LeafImage = 'pine' | 'aspen' | 'ash' | 'oak';

export interface SpeciesLook {
  preset: string;
  conifer: boolean;
  bark: BarkImage;
  leaf: LeafImage;
  /** Multipliers on the image's sRGB bytes. */
  barkTint: [number, number, number];
  leafTint: [number, number, number];
  /** ez-tree option changes (deep-merged over the preset). */
  options: Record<string, unknown>;
  seed: number;
}

// Conifers from 'Pine Large' (an evergreen: one whorl of branches, each shorter up the trunk, so a cone); the branch
// angle from the trunk (90 horizontal, more drooping), the needles' count and size. Broadleaves from 'Aspen Large'.
const conifer = (angle: number, leaves: number, size: number) => ({
  branch: { angle: { 1: angle }, children: { 0: 110 }, gnarliness: { 0: 0.03, 1: 0.06 } },
  leaves: { count: leaves, size, angle: 22, sizeVariance: 0.25 },
});
export const SPECIES: Record<string, SpeciesLook> = {
  // lodgepole pine: a short, high crown of up-swept branches, yellow-green
  pine: { preset: 'Pine Large', conifer: true, bark: 'pine', leaf: 'pine', barkTint: [0.92, 0.86, 0.8], leafTint: [0.7, 0.78, 1.05], options: conifer(98, 16, 2.4), seed: 101 },
  // interior spruce: a dense spire to the ground, drooping, blue-green
  spruce: { preset: 'Pine Large', conifer: true, bark: 'pine', leaf: 'pine', barkTint: [0.72, 0.68, 0.66], leafTint: [0.5, 0.64, 1.12], options: conifer(118, 22, 2.3), seed: 202 },
  // subalpine fir: the narrowest spire, dark
  fir: { preset: 'Pine Large', conifer: true, bark: 'pine', leaf: 'pine', barkTint: [0.78, 0.78, 0.8], leafTint: [0.42, 0.57, 1.02], options: conifer(124, 22, 2.1), seed: 303 },
  // Douglas-fir: broader, rough reddish bark
  douglasFir: { preset: 'Pine Large', conifer: true, bark: 'pine', leaf: 'pine', barkTint: [0.8, 0.68, 0.6], leafTint: [0.6, 0.72, 0.98], options: conifer(110, 18, 2.6), seed: 404 },
  // trembling aspen: pale greenish bark, round leaves (the demo's aspen image is autumn-yellow: pulled to summer green)
  aspen: { preset: 'Aspen Large', conifer: false, bark: 'birch', leaf: 'aspen', barkTint: [0.9, 0.95, 0.86], leafTint: [0.4, 0.74, 0.82], options: { leaves: { count: 22 } }, seed: 505 },
  // paper birch: white bark, small leaves (the ash image)
  birch: { preset: 'Aspen Large', conifer: false, bark: 'birch', leaf: 'ash', barkTint: [1, 1, 1], leafTint: [0.9, 0.9, 0.86], options: { branch: { angle: { 1: 38 } }, leaves: { count: 24, size: 2.6 } }, seed: 606 },
};
/** A species the adapter has no look for draws as this one. */
export const FALLBACK_SPECIES = 'spruce';
export const lookOf = (species: string): SpeciesLook => SPECIES[species] ?? SPECIES[FALLBACK_SPECIES];

/** Width classes per species (types: species x classes; fewer when a species has few stems). */
export const WIDTH_CLASSES = 3;

/**
 * A species' stems' crown width / height ratios binned into up to `k` classes (1-D k-means on the log ratio): each
 * class's ratio (the geometric mean of its stems'), and each stem's class.
 */
export function widthClasses(ratios: number[], k = WIDTH_CLASSES): { centres: number[]; classOf: number[] } {
  const logs = ratios.map((r) => Math.log(Math.max(0.02, r)));
  const sorted = logs.slice().sort((a, b) => a - b);
  const n = Math.min(k, new Set(sorted.map((v) => v.toFixed(3))).size);
  let centres = Array.from({ length: n }, (_, i) => sorted[Math.floor(((i + 0.5) / n) * (sorted.length - 1))]);
  const classOf = new Array<number>(logs.length).fill(0);
  for (let iter = 0; iter < 30; iter++) {
    const sum = new Array<number>(n).fill(0), count = new Array<number>(n).fill(0);
    logs.forEach((v, i) => {
      let best = 0;
      for (let c = 1; c < n; c++) if (Math.abs(v - centres[c]) < Math.abs(v - centres[best])) best = c;
      classOf[i] = best;
      sum[best] += v;
      count[best]++;
    });
    const next = centres.map((c, i) => (count[i] ? sum[i] / count[i] : c));
    if (next.every((c, i) => Math.abs(c - centres[i]) < 1e-6)) break;
    centres = next;
  }
  return { centres: centres.map(Math.exp), classOf };
}

/** Deep-merges `over` into `into` (plain objects; ez-tree's options). */
export function mergeOptions(into: Record<string, unknown>, over: Record<string, unknown>): void {
  for (const [k, v] of Object.entries(over)) {
    if (v && typeof v === 'object' && !Array.isArray(v) && into[k] && typeof into[k] === 'object') mergeOptions(into[k] as Record<string, unknown>, v as Record<string, unknown>);
    else into[k] = v;
  }
}
