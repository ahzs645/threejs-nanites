// One tree type of a PGMaps package, off the main thread: an ez-tree grown from its species' preset (species.ts),
// its branch lengths tuned until its crown is the width class's share of its height, the last few percent taken up
// by scaling it across, then its cluster DAG (the library's buildDag) with the leaf texture's mask.
import { Tree, Billboard } from '@dgreenheck/ez-tree';
// (straight from the module, not the library's index: a worker's bundle takes only what it imports)
import { buildDag } from '../../src/nanite-lib/dag/build.ts';
import type { BarkSource, DagResult, LeafMask, LeafSource } from '../../src/nanite-lib/dag/types.ts';
import { mergeOptions, type SpeciesLook } from './species.ts';
import { RATIO_MAX } from './tree-bins.ts';

export interface GrowJob {
  id: number;
  look: SpeciesLook;
  seed: number;
  /** Height the model is built at (m); stems scale it to their own. */
  height: number;
  /** Crown width / height to reach. */
  ratio: number;
  /** Where the live crown starts (share of the height), or null for the preset's. */
  crownBase: number | null;
  leafMask: LeafMask | null;
}
export type GrowReply =
  | (DagResult & { src: { bark: BarkSource; leaves: LeafSource }; radius: number; height: number; grown: number; squash: number; ms: number })
  | { id: number; error: string };

type Options = { seed: number; branch: { length: Record<number, number>; start: Record<number, number> }; leaves: { billboard: string }; bark: { textureScale: { x: number; y: number } } };
type Grown = { branches: { verts: number[]; normals: number[]; uvs: number[]; indices: number[] }; leaves: { verts: number[]; normals: number[]; uvs: number[] } };

/** Crown width / height of a grown tree: twice the 95th percentile of its leaves' distance from the trunk, over its top. */
function measure(t: Grown): { ratio: number; top: number } {
  let top = 0;
  for (const v of [t.branches.verts, t.leaves.verts]) for (let i = 1; i < v.length; i += 3) top = Math.max(top, v[i]);
  const from = t.leaves.verts.length ? t.leaves.verts : t.branches.verts;
  const r: number[] = [];
  for (let i = 0; i < from.length; i += 3) r.push(Math.hypot(from[i], from[i + 2]));
  r.sort((a, b) => a - b);
  return { ratio: (2 * (r[Math.floor(r.length * 0.95)] ?? 0)) / Math.max(top, 1e-6), top };
}

// A change here that alters any byte of a job's reply: bump GROW_VERSION (tree-cache-key.ts), or browsers keep
// serving the trees they cached. (The workers are kept between jobs, trees.ts: nothing here may carry over from one
// job to the next.)
function grow(job: GrowJob) {
  const tree = new Tree();
  tree.loadPreset(job.look.preset);
  const o = tree.options as unknown as Options;
  mergeOptions(o as unknown as Record<string, unknown>, job.look.options);
  o.seed = job.seed;
  if (job.crownBase !== null) o.branch.start[1] = Math.min(0.8, Math.max(0.05, job.crownBase));
  // the crown's width by its branches' length: a few rounds towards the ratio (ez-tree's growth isn't linear in it)
  const base = { ...o.branch.length };
  const keys = job.look.conifer ? [1] : [1, 2];
  // (a clump rung past the generator's widest: grown at its widest, the rest scaled across, tree-bins.ts WIDE_STEPS)
  const target = Math.min(job.ratio, RATIO_MAX);
  let k = 1, m = { ratio: 1, top: 1 };
  for (let round = 0; round < 3; round++) {
    for (const key of keys) o.branch.length[key] = base[key] * k;
    tree.generate();
    m = measure(tree as unknown as Grown);
    if (Math.abs(m.ratio / target - 1) < 0.04) break;
    k = Math.min(4, Math.max(0.2, k * (target / Math.max(m.ratio, 1e-3)) ** (job.look.conifer ? 1 : 1.25)));
  }
  const grown = m.ratio;
  const squash = job.ratio / Math.max(grown, 1e-3); // (the rest: the tree scaled across)
  const s = job.height / m.top;
  const t = tree as unknown as Grown;
  const tex = o.bark.textureScale;
  const bark: BarkSource = {
    pos: Float32Array.from(t.branches.verts, (v, i) => v * s * (i % 3 === 1 ? 1 : squash)),
    nrm: new Float32Array(t.branches.normals.length),
    uv: Float32Array.from(t.branches.uvs, (v, i) => (i % 2 === 0 ? v * tex.x : v / tex.y)),
    idx: Uint32Array.from(t.branches.indices),
  };
  // (normals of a mesh scaled across: divided by the scale, renormalized)
  for (let i = 0; i < bark.nrm.length; i += 3) {
    const x = t.branches.normals[i] / squash, y = t.branches.normals[i + 1], z = t.branches.normals[i + 2] / squash;
    const l = Math.hypot(x, y, z) || 1;
    bark.nrm.set([x / l, y / l, z / l], i);
  }
  // Leaf normals as the demo's (src/tree-grow.ts): the card's blended with the way out of the crown, so the crown
  // shades as a volume rather than as flat cards.
  const lpos = Float32Array.from(t.leaves.verts, (v, i) => v * s * (i % 3 === 1 ? 1 : squash));
  const n = lpos.length / 3;
  let cx = 0, cy = 0, cz = 0;
  for (let i = 0; i < n; i++) (cx += lpos[i * 3]), (cy += lpos[i * 3 + 1]), (cz += lpos[i * 3 + 2]);
  (cx /= n || 1), (cy /= n || 1), (cz /= n || 1);
  const lnrm = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    let x = lpos[i * 3] - cx, y = (lpos[i * 3 + 1] - cy) * 1.4 + 0.3 * job.height, z = lpos[i * 3 + 2] - cz;
    const len = Math.hypot(x, y, z) || 1;
    (x /= len), (y /= len), (z /= len);
    let nx = t.leaves.normals[i * 3] ?? 0, ny = t.leaves.normals[i * 3 + 1] ?? 1, nz = t.leaves.normals[i * 3 + 2] ?? 0;
    if (nx * x + ny * y + nz * z < 0) (nx = -nx), (ny = -ny), (nz = -nz);
    const mx = x * 0.8 + nx * 0.2, my = y * 0.8 + ny * 0.2, mz = z * 0.8 + nz * 0.2;
    const ml = Math.hypot(mx, my, mz) || 1;
    lnrm.set([mx / ml, my / ml, mz / ml], i * 3);
  }
  const leaves: LeafSource = { pos: lpos, nrm: lnrm, uv: Float32Array.from(t.leaves.uvs), vpl: o.leaves.billboard === Billboard.Double ? 8 : 4 };
  let radius = 0;
  for (const p of [bark.pos, lpos]) for (let i = 0; i < p.length; i += 3) radius = Math.max(radius, Math.hypot(p[i], p[i + 1] - job.height / 2, p[i + 2]));
  return { bark, leaves, radius, grown, squash };
}

const scope = self as unknown as { onmessage: (e: MessageEvent<GrowJob>) => void; postMessage(msg: GrowReply, transfer?: Transferable[]): void };
scope.onmessage = async (e) => {
  const job = e.data;
  try {
    const t0 = performance.now();
    const g = grow(job);
    const r = await buildDag({ id: job.id, bark: structuredClone(g.bark), leaves: structuredClone(g.leaves), ...(job.leafMask ? { leafMask: job.leafMask } : {}) });
    const { bark, leaves } = g;
    scope.postMessage(
      { ...r, src: { bark, leaves }, radius: g.radius, height: job.height, grown: g.grown, squash: g.squash, ms: performance.now() - t0 },
      [r.vtx.buffer, r.idx.buffer, r.rec.buffer, r.meta.buffer, bark.pos.buffer, bark.nrm.buffer, bark.uv.buffer, bark.idx.buffer, leaves.pos.buffer, leaves.nrm.buffer, leaves.uv.buffer],
    );
  } catch (err) {
    scope.postMessage({ id: job.id, error: String(err instanceof Error ? (err.stack ?? err) : err) });
  }
};
