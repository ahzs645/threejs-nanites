// A package's stems as Nanite types and instances: per species, its stems' crown width / height ratios binned into
// width classes (species.ts), one ez-tree type grown per (species, class) in a worker (tree-worker.ts), each stem an
// instance of its class's type at its own height. The demo's bark and leaf images (public/textures), tinted per
// species, are the texture arrays. Grown types and loaded images are kept for the page's later packages.
import * as THREE from 'three/webgpu';
import { loadLayer, arrayTexture, layerLookup } from '../../src/textures.ts';
import type { LayerData } from '../../src/texture-pixels.ts';
import { LEAF_DITHER, type NaniteType, type NaniteTextures } from '../../src/nanite-lib/index.ts';
import { lookOf, widthClasses, type BarkImage, type LeafImage } from './species.ts';
import type { GrowJob, GrowReply } from './tree-worker.ts';
import type { ScenePackage } from './package.ts';

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
export const barkImage = (b: BarkImage) => image(`../textures/${b}_color_1k.jpg`, false);
const leafImage = (l: LeafImage) => image(`../textures/${l}_color.png`, true);

/** A copy of a layer with its sRGB bytes scaled (the alpha, its scales and mask kept). */
function tinted(l: LayerData, [r, g, b]: [number, number, number]): LayerData {
  const px = new Uint8ClampedArray(l.px);
  for (let i = 0; i < px.length; i += 4) (px[i] *= r), (px[i + 1] *= g), (px[i + 2] *= b);
  return { px, alphaScales: l.alphaScales, mask: l.mask };
}

const grown = new Map<string, Promise<GrowReply>>();
function growType(job: Omit<GrowJob, 'id'>, id: number): Promise<GrowReply> {
  const key = JSON.stringify({ ...job, leafMask: null });
  let p = grown.get(key);
  if (!p) {
    p = new Promise<GrowReply>((resolve, reject) => {
      const w = new Worker(new URL('./tree-worker.ts', import.meta.url), { type: 'module' });
      w.onmessage = (e: MessageEvent<GrowReply>) => (w.terminate(), resolve(e.data));
      w.onerror = (e) => (w.terminate(), reject(new Error(`tree worker: ${e.message}`)));
      w.postMessage({ ...job, id } satisfies GrowJob);
    });
    grown.set(key, p);
    p.then((r) => 'error' in r && grown.delete(key), () => grown.delete(key));
  }
  return p;
}

export interface Stand {
  types: NaniteType[];
  instances: { a: Float32Array; b: Float32Array };
  textures: NaniteTextures;
  barkLayers: number[];
  leafLayers: number[];
  /** Mean and 90th percentile of |stem crown width / drawn crown width - 1|, and the classes' log. */
  residual: { mean: number; p90: number; lines: string[] };
  growMs: number;
}

export async function buildStand(scene: ScenePackage, samples: number): Promise<Stand> {
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
  const used = [...stemsOf.keys()].sort((x, y) => x - y);
  const names = used.map((i) => scene.trees.species[i] ?? 'spruce');
  const jobs: { job: Omit<GrowJob, 'id'>; species: number; layer: number }[] = [];
  const typeOf = new Int32Array(count);
  const errors: number[] = [];
  const lines: string[] = [];
  for (const [layer, sp] of used.entries()) {
    const name = names[layer], look = lookOf(name), info = scene.species?.[name];
    const stems = stemsOf.get(sp)!;
    const ratioOf = (i: number): number => {
      const o = i * stride, w = F.crownWidth >= 0 ? data[o + F.crownWidth] : NaN;
      return Number.isFinite(w) && w > 0 ? w / Math.max(1, data[o + F.height]) : (info?.crownRatio ?? 0.25);
    };
    const ratios = stems.map(ratioOf);
    const { centres, classOf } = widthClasses(ratios);
    const mask = (await leafImage(look.leaf)).mask;
    const first = jobs.length;
    centres.forEach((ratio, c) => jobs.push({
      job: { look, seed: look.seed + c * 17, height: MODEL_HEIGHT, ratio: Math.min(1.2, Math.max(0.08, ratio)), crownBase: info?.crownBase ?? null, leafMask: mask },
      species: sp, layer,
    }));
    stems.forEach((i, k) => {
      typeOf[i] = first + classOf[k];
      errors.push(Math.abs(ratios[k] / centres[classOf[k]] - 1));
    });
    lines.push(`${name}: ${stems.length} stems, crown/height classes ${centres.map((c) => c.toFixed(2)).join(' / ')}`);
  }
  const replies = await Promise.all(jobs.map(({ job }, id) => growType(job, id)));
  const types: NaniteType[] = replies.map((r, id) => {
    if ('error' in r) throw new Error(`growing ${names[jobs[id].layer]}: ${r.error}`);
    const { src, radius, height } = r;
    return { ...r, id, name: `${names[jobs[id].layer]}-${id}`, radius, height, src };
  });
  replies.forEach((r, id) => {
    if (!('error' in r)) lines.push(`  type ${id}: ratio ${jobs[id].job.ratio.toFixed(2)} grown ${r.grown.toFixed(2)} (x${r.squash.toFixed(2)} across), ${(r.idx.length / 3).toLocaleString()} tris, ${Math.round(r.ms)} ms`);
  });

  // the instances, in type order: a = (x, y, z, scale), b = (cos, sin, type, tone)
  const order = Array.from({ length: count }, (_, i) => i).sort((x, y) => typeOf[x] - typeOf[y]);
  const a = new Float32Array(count * 4), b = new Float32Array(count * 4);
  order.forEach((i, k) => {
    const o = i * stride;
    // (a yaw from the position: the package's stems carry none)
    const yaw = (Math.sin(data[o + F.x] * 12.9898 + data[o + F.y] * 78.233) * 43758.5453) % 1 * Math.PI * 2;
    const tone = F.tone >= 0 ? data[o + F.tone] : 0.5;
    a.set([data[o + F.x], data[o + F.z], -data[o + F.y], data[o + F.height] / MODEL_HEIGHT], k * 4);
    b.set([Math.cos(yaw), Math.sin(yaw), typeOf[i], Number.isFinite(tone) ? tone : 0.5], k * 4);
  });

  // texture arrays: a bark and a leaf layer per species, tinted
  const barkTex = await arrayTexture(names.map(async (n) => tinted(await barkImage(lookOf(n).bark), lookOf(n).barkTint)), TEX);
  const leafTex = await arrayTexture(names.map(async (n) => tinted(await leafImage(lookOf(n).leaf), lookOf(n).leafTint)), TEX);
  barkTex.colorSpace = leafTex.colorSpace = THREE.SRGBColorSpace;
  leafTex.wrapS = leafTex.wrapT = THREE.ClampToEdgeWrapping;
  const layers = jobs.map((j) => j.layer);
  const textures: NaniteTextures = {
    bark: barkTex,
    leaf: leafTex,
    barkLayerOf: layerLookup(layers),
    leafLayerOf: layerLookup(layers),
    // the demo's: under TAA (one sample) the leaves by coverage against a moving dither; with MSAA, alpha to coverage
    alphaToCoverage: samples > 1,
    leafDither: samples === 1 && LEAF_DITHER,
  };
  errors.sort((x, y) => x - y);
  const mean = errors.reduce((s, e) => s + e, 0) / Math.max(1, errors.length);
  return { types, instances: { a, b }, textures, barkLayers: layers, leafLayers: layers, residual: { mean, p90: errors[Math.floor(errors.length * 0.9)] ?? 0, lines }, growMs: performance.now() - t0 };
}
