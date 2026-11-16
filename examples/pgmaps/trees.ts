// A package's stems as Nanite types and instances: per species, each stem's crown width / height ratio put on the
// rung of a fixed ladder nearest it (tree-bins.ts: never from the other stems, so a harvest leaves the retained stems'
// trees as they were), one ez-tree type grown per (species, rung) in a worker (tree-worker.ts), each stem an
// instance of its rung's type at its own height. The demo's bark and leaf images (public/textures), tinted per
// species, are the texture arrays. Grown types and loaded images are kept for the page's later packages; the workers
// that grow them are kept too, and the grown types are kept across page loads in the browser (tree-cache.ts), each
// checked against a fresh growth before the page trusts the cache. That cache is off unless asked for (`&treecache=1`).
import * as THREE from 'three/webgpu';
import { uint, uniformArray } from 'three/tsl';
import { loadLayer, arrayTexture } from '../../src/textures.ts';
import type { LayerData } from '../../src/texture-pixels.ts';
import { LEAF_DITHER, type NaniteType, type NaniteTextures, type Float, type Uint } from '../../src/nanite-lib/index.ts';
import { lookOf, type BarkImage, type LeafImage } from './species.ts';
import { assignBins, binOf as binOfRatio, binRatio, binSeed, errorSummary, orderByType } from './tree-bins.ts';
import type { GrowJob, GrowReply } from './tree-worker.ts';
import type { ScenePackage } from './package.ts';
import { lockedVersion, replyDigest, treeCacheKey, treeCacheNamespace } from './tree-cache-key.ts';
import { dropTreeStore, openTreeStore, type TreeStore } from './tree-cache.ts';
// (the installed versions of the libraries that grow a tree, for the cache's keys: the lockfile's own text)
import lockfile from '../../package-lock.json?raw';

declare const __NANITE_VERSION__: string | undefined;
/** Where the bark and leaf images are, from the page: ../textures/ on the full site, textures/ beside a release's page
 * (vite.config.ts, `--mode pgmaps`). */
declare const __PGMAPS_TEXTURES__: string | undefined;
const TEXTURES = typeof __PGMAPS_TEXTURES__ === 'string' ? __PGMAPS_TEXTURES__ : '../textures/';

/** Each model is built this tall and scaled to its stem's height. */
export const MODEL_HEIGHT = 20;
const TEX = 1024;

const images = new Map<string, Promise<LayerData>>();
const image = (url: string, leaf: boolean): Promise<LayerData> => {
  let p = images.get(url);
  if (!p) images.set(url, (p = loadLayer(url, TEX, leaf)));
  return p;
};
/** A bark image's texels (the debris' logs take it too). */
export const barkImage = (b: BarkImage) => image(`${TEXTURES}${b}_color_1k.jpg`, false);
const leafImage = (l: LeafImage) => image(`${TEXTURES}${l}_color.png`, true);

/** A copy of a layer with its sRGB bytes scaled (the alpha, its scales and mask kept). */
function tinted(l: LayerData, [r, g, b]: [number, number, number]): LayerData {
  const px = new Uint8ClampedArray(l.px);
  for (let i = 0; i < px.length; i += 4) (px[i] *= r), (px[i + 1] *= g), (px[i + 2] *= b);
  return { px, alphaScales: l.alphaScales, mask: l.mask };
}

/** Workers growing at once: each instantiates its own WebAssembly memory, and a package's 30-odd types started
 * together ran the page out of it ("Cannot allocate Wasm memory"). */
const MAX_GROWING = Math.max(2, Math.min(6, (navigator.hardwareConcurrency || 4) - 1));
let growing = 0;
const waiting: (() => void)[] = [];
async function slot<T>(run: () => Promise<T>): Promise<T> {
  if (growing >= MAX_GROWING) await new Promise<void>((go) => waiting.push(go)); // (handed the slot as it frees)
  else growing++;
  try {
    return await run();
  } finally {
    const next = waiting.shift();
    if (next) next();
    else growing--;
  }
}

/**
 * The workers, kept between jobs: a new module worker a type and its end after one job was about 65 ms of start-up
 * each (the tree library and the mesh library's WebAssembly evaluated again), for a package's 50-odd types and a
 * final stand's 8 more (0.6 s of a build). A worker with no job for POOL_IDLE_MS is ended, so an idle page holds none
 * of their memory. Trees grown in a kept worker are the bytes a new worker grows.
 */
const POOL_IDLE_MS = 30_000;
const idle: Worker[] = [];
let idleTimer: ReturnType<typeof setTimeout> | undefined;
const pool = { spawned: 0, jobs: 0 };
/** One type grown in a worker of the pool (at most MAX_GROWING at once). */
function grow(job: Omit<GrowJob, 'id'>, id: number): Promise<GrowReply> {
  return slot(() => new Promise<GrowReply>((resolve, reject) => {
    let w = idle.pop();
    if (!w) {
      w = new Worker(new URL('./tree-worker.ts', import.meta.url), { type: 'module' });
      pool.spawned++;
    }
    pool.jobs++;
    const worker = w;
    worker.onmessage = (e: MessageEvent<GrowReply>) => {
      worker.onmessage = worker.onerror = null;
      idle.push(worker);
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => idle.splice(0).forEach((x) => x.terminate()), POOL_IDLE_MS);
      resolve(e.data);
    };
    worker.onerror = (e) => (worker.terminate(), reject(new Error(`tree worker: ${e.message}`))); // (not kept: its state is unknown)
    worker.postMessage({ ...job, id } satisfies GrowJob);
  }));
}

/**
 * The grown types' cache across page loads (tree-cache.ts): off unless the page is opened with `&treecache=1`. It
 * saves about a second of a cold page's build and holds about 120 MB on disk for one scene's types, in every browser
 * profile that opens the page (a capture harness's throwaway profiles among them), so it is for whoever asks for it.
 * A page opened without it deletes what an earlier page stored, so switching it off gives the disk back.
 */
const TREE_CACHE = new URLSearchParams(location.search).get('treecache') === '1';
if (!TREE_CACHE) dropTreeStore();
let namespace: string | null = null;
let opened: Promise<TreeStore | null> | null = null;
/** The cache, or null: switched off, a library's version unknown, or the browser gives this frame no storage. */
const treeStore = (): Promise<TreeStore | null> => (opened ??= (async () => {
  if (!TREE_CACHE) return null;
  namespace = treeCacheNamespace({
    engine: typeof __NANITE_VERSION__ === 'string' ? __NANITE_VERSION__ : '',
    ezTree: lockedVersion(lockfile, '@dgreenheck/ez-tree'),
    meshoptimizer: lockedVersion(lockfile, 'meshoptimizer'),
  });
  return namespace ? openTreeStore(namespace) : null;
})().catch(() => null));

/**
 * Whether this page's growing code still gives what the cache holds, per kind of tree (conifer or broadleaf): the
 * first cached type of a kind a page asks for is grown afresh all the same and its bytes' digest compared with its
 * entry's. Alike, the kind's other entries are read; different (the growing code changed and nobody bumped
 * GROW_VERSION), the whole cache is emptied and everything is grown.
 */
const verdicts = new Map<boolean, Promise<boolean>>();

/** A type from the cache when it holds a trusted entry for the job, else grown (and stored). */
async function cachedOrGrown(job: Omit<GrowJob, 'id'>, id: number): Promise<GrowReply> {
  const store = await treeStore();
  if (!store || !namespace) return grow(job, id);
  const key = treeCacheKey(namespace, job);
  const keep = (r: GrowReply): GrowReply => {
    if (!('error' in r)) void store.write(key, r);
    return r;
  };
  const held = store.entry(key);
  if (!held) return keep(await grow(job, id));
  const kind = job.look.conifer;
  let verdict = verdicts.get(kind);
  if (!verdict) {
    const fresh = grow(job, id);
    verdict = fresh.then(async (r) => {
      if ('error' in r) return false;
      if (replyDigest(r) === held.digest) return true;
      console.warn('pgmaps trees: a cached tree no longer matches its growth (bump GROW_VERSION in tree-cache-key.ts); the cache is emptied');
      await store.clear();
      return false;
    }, () => false);
    verdicts.set(kind, verdict);
    const r = await fresh;
    return (await verdict) ? r : keep(r);
  }
  if (await verdict) {
    const r = await store.read<GrowReply>(key);
    if (r) return r;
  }
  return keep(await grow(job, id));
}

const grown = new Map<string, Promise<GrowReply>>();
function growType(job: Omit<GrowJob, 'id'>, id: number): Promise<GrowReply> {
  const key = JSON.stringify({ ...job, leafMask: null });
  let p = grown.get(key);
  if (!p) {
    p = cachedOrGrown(job, id);
    grown.set(key, p);
    p.then((r) => 'error' in r && grown.delete(key), () => grown.delete(key));
  }
  return p;
}

// (for the trial: the pool's and the cache's counters, emptying the cache, and the replies this page holds by job)
Object.assign(globalThis, {
  pgmapsTrees: {
    stats: async () => ({ cache: TREE_CACHE, pool: { ...pool, idle: idle.length }, store: (await treeStore())?.stats() ?? null, namespace }),
    clear: async () => (await treeStore())?.clear() ?? false,
    replies: () => Promise.all([...grown].map(async ([key, p]) => [key, await p] as const)),
  },
});

/**
 * Each type's texture layer, from a uniform array: the demo's chain of selects (src/textures.ts layerLookup) is one
 * select a type, and a capture's package, with its clump rungs, grew past 60 types: past WGSL's 127-deep nesting.
 */
const layerOf = (layers: number[]): ((type: Uint) => Float) => {
  const arr = uniformArray(layers, 'float');
  return (type) => arr.element(uint(type)) as unknown as Float;
};

export interface Stand {
  types: NaniteType[];
  instances: { a: Float32Array; b: Float32Array };
  textures: NaniteTextures;
  barkLayers: number[];
  leafLayers: number[];
  /** Mean and 90th percentile of |stem crown width / drawn crown width - 1| (the drawn width: the grown model's
   * measured ratio after its scaling across, at the stem's height), and the types' log. */
  residual: { mean: number; p90: number; lines: string[] };
  growMs: number;
}

/** A tree type to grow with no stems of its own (the stand patches' real crowns): a species index and its ratio. */
export interface ExtraRung { species: number; ratio: number }

export async function buildStand(scene: ScenePackage, samples: number, extra: ExtraRung[] = []): Promise<Stand & { extraTypes: Map<number, number[]> }> {
  const t0 = performance.now();
  const { fields, data, count } = scene.trees;
  const stride = fields.length;
  const F = Object.fromEntries(['x', 'y', 'z', 'species', 'height', 'crownWidth', 'tone'].map((k) => [k, fields.indexOf(k)]));
  if (F.x < 0 || F.y < 0 || F.z < 0 || F.species < 0 || F.height < 0) throw new Error('The package\'s trees lack x, y, z, species or height.');
  // the species in use, and each one's stems
  const stemsOf = new Map<number, number[]>();
  for (let i = 0; i < count; i++) {
    const sp = data[i * stride + F.species];
    if (!stemsOf.has(sp)) stemsOf.set(sp, []);
    stemsOf.get(sp)!.push(i);
  }
  for (const e of extra) if (!stemsOf.has(e.species)) stemsOf.set(e.species, []);
  const used = [...stemsOf.keys()].sort((x, y) => x - y);
  /** Per species index, the types grown for its extra rungs. */
  const extraTypes = new Map<number, number[]>();
  const names = used.map((i) => scene.trees.species[i] ?? 'spruce');
  const jobs: { job: Omit<GrowJob, 'id'>; species: number; layer: number; bin: number }[] = [];
  const typeOf = new Int32Array(count);
  /** Each stem's own ratio, for its error against what its type draws. */
  const ratioAt = new Float64Array(count);
  const lines: string[] = [];
  for (const [layer, sp] of used.entries()) {
    const name = names[layer], look = lookOf(name), info = scene.species?.[name];
    const stems = stemsOf.get(sp)!;
    const ratioOf = (i: number): number => {
      const o = i * stride, w = F.crownWidth >= 0 ? data[o + F.crownWidth] : NaN;
      return Number.isFinite(w) && w > 0 ? w / Math.max(1, data[o + F.height]) : (info?.crownRatio ?? 0.25);
    };
    const ratios = stems.map(ratioOf);
    const assigned = assignBins(ratios);
    const { binOf } = assigned;
    const extraBins = extra.filter((e) => e.species === sp).map((e) => binOfRatio(e.ratio));
    const bins = [...new Set([...assigned.bins, ...extraBins])].sort((a, b) => a - b);
    const mask = (await leafImage(look.leaf)).mask;
    const jobOfBin = new Map<number, number>();
    for (const bin of bins) {
      jobOfBin.set(bin, jobs.length);
      jobs.push({
        job: { look, seed: binSeed(look.seed, bin), height: MODEL_HEIGHT, ratio: binRatio(bin), crownBase: info?.crownBase ?? null, leafMask: mask },
        species: sp, layer, bin,
      });
    }
    if (extraBins.length) extraTypes.set(sp, [...new Set(extraBins)].map((b) => jobOfBin.get(b)!));
    stems.forEach((i, k) => {
      typeOf[i] = jobOfBin.get(binOf[k])!;
      ratioAt[i] = ratios[k];
    });
    lines.push(`${name}: ${stems.length} stems, crown/height rungs ${bins.map((b) => `${b}:${binRatio(b).toFixed(2)}`).join(' / ')}`);
  }
  const replies = await Promise.all(jobs.map(({ job }, id) => growType(job, id)));
  const types: NaniteType[] = replies.map((r, id) => {
    if ('error' in r) throw new Error(`growing ${names[jobs[id].layer]}: ${r.error}`);
    const { src, radius, height } = r;
    return { ...r, id, name: `${names[jobs[id].layer]}-${id}`, radius, height, src };
  });
  replies.forEach((r, id) => {
    if (!('error' in r)) lines.push(`  type ${id}: rung ${jobs[id].bin} ratio ${jobs[id].job.ratio.toFixed(2)} grown ${r.grown.toFixed(2)} (x${r.squash.toFixed(2)} across), ${(r.idx.length / 3).toLocaleString()} tris, ${Math.round(r.ms)} ms`);
  });
  // each stem's crown width against what is drawn: the grown model's ratio after its scaling across (the worker
  // measures `grown` before it and takes the rest up with `squash`)
  const drawnRatio = replies.map((r, id) => ('error' in r ? jobs[id].job.ratio : r.grown * r.squash));
  const errors = new Float64Array(count);
  for (let i = 0; i < count; i++) errors[i] = Math.abs(ratioAt[i] / drawnRatio[typeOf[i]] - 1);

  // the instances, in type order: a = (x, y, z, scale), b = (cos, sin, type, tone)
  const order = orderByType(typeOf);
  const a = new Float32Array(count * 4), b = new Float32Array(count * 4);
  for (let k = 0; k < count; k++) {
    const i = order[k], o = i * stride, k4 = k * 4;
    // (a yaw from the position: the package's stems carry none)
    const yaw = (Math.sin(data[o + F.x] * 12.9898 + data[o + F.y] * 78.233) * 43758.5453) % 1 * Math.PI * 2;
    const tone = F.tone >= 0 ? data[o + F.tone] : 0.5;
    (a[k4] = data[o + F.x]), (a[k4 + 1] = data[o + F.z]), (a[k4 + 2] = -data[o + F.y]), (a[k4 + 3] = data[o + F.height] / MODEL_HEIGHT);
    (b[k4] = Math.cos(yaw)), (b[k4 + 1] = Math.sin(yaw)), (b[k4 + 2] = typeOf[i]), (b[k4 + 3] = Number.isFinite(tone) ? tone : 0.5);
  }

  // texture arrays: a bark and a leaf layer per species, tinted
  const barkTex = await arrayTexture(names.map(async (n) => tinted(await barkImage(lookOf(n).bark), lookOf(n).barkTint)), TEX);
  const leafTex = await arrayTexture(names.map(async (n) => tinted(await leafImage(lookOf(n).leaf), lookOf(n).leafTint)), TEX);
  barkTex.colorSpace = leafTex.colorSpace = THREE.SRGBColorSpace;
  leafTex.wrapS = leafTex.wrapT = THREE.ClampToEdgeWrapping;
  const layers = jobs.map((j) => j.layer);
  const textures: NaniteTextures = {
    bark: barkTex,
    leaf: leafTex,
    barkLayerOf: layerOf(layers),
    leafLayerOf: layerOf(layers),
    // the demo's: under TAA (one sample) the leaves by coverage against a moving dither; with MSAA, alpha to coverage
    alphaToCoverage: samples > 1,
    leafDither: samples === 1 && LEAF_DITHER,
  };
  // (the crown errors' mean and p90 worked out when first read: the live view's panel and stats; a final stand's are
  // never read, and sorting its 1.4 M errors was 0.4 s of every final capture's stand)
  let summary: { mean: number; p90: number } | null = null;
  const summed = () => (summary ??= errorSummary(errors));
  const residual = { get mean() { return summed().mean; }, get p90() { return summed().p90; }, lines };
  return { types, instances: { a, b }, textures, barkLayers: layers, leafLayers: layers, residual, growMs: performance.now() - t0, extraTypes };
}
