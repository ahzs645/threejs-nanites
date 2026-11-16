// A PGMaps forest scene package (https://github.com/ahzs645/PGMaps, src/pages/dev-forestry/scenePackage.ts) drawn with
// the demo's look: each B.C. species an ez-tree (branches and leaf cards, the demo's bark and leaf images) as Nanite
// types, a few per species for the stems' crown widths (examples/pgmaps/trees.ts); the demo's sky, sun shadows, god
// rays and TAA (src/godrays.ts, src/taa.ts); its forest floor over the package's ground, with the openings harvested,
// the debris as slash piles and the road's cut and fill slopes bare (examples/pgmaps/floor.ts, debris.ts); optional
// water with a planar reflection (water.ts); and the environment the parent sends: date, place, ground and weather
// (environment.ts, particles.ts). The stems are seen from the package's eye.
//   examples/pgmaps-scene.html?scene=<url of a package JSON>   (or pick a file). Needs WebGPU (compute).
//   &embed: driven by a parent page (an iframe): no overlay, no pointer input, the scene and camera by postMessage.
//   &env=<json> or &dateTime=2026-07-15T14:00:00-07:00&ground=snow&weather=overcast: an environment (as the message)
//   &taa=0, &rays=0: switches; &tau=: the clusters' error in pixels (2)
//   &reuse=0: the same package posted again is rebuilt (else its drawing is kept); &treecache=1: grown trees kept
//   across page loads (trees.ts; off otherwise, and what was kept is deleted); &bake=plain: the impostor bake as the library runs it (else leanBake's passes);
//   &atlasdigest: the baked atlases' hashes on window.pgmaps.atlasDigests. window.pgmaps.timing: each stage's ms.
//
// The postMessage bridge (postMessage(data, '*'); a local trial):
//   out { type: 'pgmaps-engine-hello', engine: 'nanite', accepts }   loaded in a frame with no ?scene: send the
//                                          package. `accepts`: what PGMaps may send beyond the plain protocol
//                                          (packed-arrays.ts): the package's long numeric arrays as Float64Arrays
//                                          (NaN for null; turned back on arrival), and a package named by key alone
//   in  { type: 'pgmaps-scene', key }     the package drawn now, when PGMaps sent it with this `key` and its drawing
//                                          can be kept; else out { type: 'pgmaps-engine-scene-needed', key } and
//                                          PGMaps sends it whole
//   in  { type: 'pgmaps-scene', scene }   a package to draw. A later one tears the drawing down (its WebGPU device
//                                          destroyed, so nothing leaks) and builds the new one in the same page;
//                                          the same package again (its content hash, `createdAt` apart, and the
//                                          same view year and look) keeps the drawing, its atlases and its final
//                                          stand, puts the view back on the package's eye and says ready again
//                                          (&reuse=0: always rebuilt).
//   in  { type: 'pgmaps-camera', position: [x, y, z], bearingDegrees, pitchDegrees, verticalFovDegrees }
//                                          the eye in the frame of the latest package sent (local metres, z up). One
//                                          that arrives while a package builds is kept, the latest, and applied after.
//   in  { type: 'pgmaps-environment', dateTime, timeZone?, utc?, sun?: 'true' | 'daylight', sunPosition?, latitude, longitude,
//         ground: 'bare' | 'snow', weather: 'clear' | 'overcast' | 'rain' | 'snow', cloudCover?: 0..1, visibilityKm? }
//                                          before or after a package (cloudCover: the share of the sky drawn under
//                                          cloud, 0 none; visibilityKm: Koschmieder's haze, sky-cover.ts, 1000 or
//                                          more none); the
//                                          latest is kept for every later build and applied without rebuilding (the
//                                          sun the parent's `sunPosition`, else from the instant, `utc` before `dateTime`, and the place; 'true' lights
//                                          from the real sun and not at all once it has set, 'daylight' or none holds
//                                          the light 6 degrees up).
//   out { type: 'pgmaps-engine-ready', engine: 'nanite' }   the first frame of a (new) package is drawn
//   out { type: 'pgmaps-engine-stats', engine: 'nanite', drawn, fps, clusters, impostors, splats, stems,
//         crownErrorMean, crownErrorP90, sun: { elevation, azimuth, drawnElevation, drawnAzimuth, exposure, mode },
//         environment: { cloudCover, visibilityKm, … } }   (the cloud share and visibility as applied)
//                                          about 1 s (crown errors: |stem crown width / drawn - 1|; degrees to 0.1)
//   out { type: 'pgmaps-engine-error', engine: 'nanite', message }
//   in  { type: 'pgmaps-capture', id, position, frames, classes, zones? }   (PGMaps' engineCapture.ts) one camera's frames
//                                          drawn offscreen, each the picture (TAA settled, PNG), the ground class pass
//                                          `classes` (flat unlit colours: the class layers draped on the terrain, far
//                                          terrain too, no trees, debris or litter; the water; sky transparent), the
//                                          screened pass `screened` (the same with the trees: each tree the class of the
//                                          ground under its stem, the vegetation colour only on unlisted ground or water),
//                                          linear depth (of the screened pass) and, with `zones`, the zone pass (its
//                                          polygons on the bare terrain); the live view is put back after. Every
//                                          stem is drawn however far (impostors at their own size, none thinned). One
//                                          that arrives while a package builds waits for it.
//   out { type: 'pgmaps-engine-capture', engine: 'nanite', id, version, frames, scene, environment, maxTreeHeightMeters,
//         missing, missingDetail }   (class, depth and zone buffers transferred), or { type: 'pgmaps-engine-capture', id, error }
//   A package's `farTerrain` (coarser) is drawn wherever `terrain` has no posts, its `skylineTerrain` (coarsest, out to
//   the real skyline, already lowered for the earth's curvature) wherever neither has; past them all, an apron. The
//   sky and the far plane reach past the outermost grid's corners.
//   The capture's `quality: 'final'` (final-stand.ts): its `stand` (real-density stems, the package's tree fields, a
//         Float32Array, `radiusMeters`, `bearings`) drawn in place of the package's stems where it reaches (a second
//         Nanite renderer, kept for the next capture of the same stand), the far forest hidden there, the canopy
//         cut-off from `canopyCutoffPx`, the shadow map widened to FINAL_SHADOW_HALF, water reflected at full
//         resolution, FINAL_WARM frames then `samples` accumulated with the camera held (TAA as a running mean); the
//         reply's `final: { samples, stems, canopyCutoffMeters, millis }`. The ground class pass is unchanged.
//   The environment's `windMs` (Cox–Munk roughness on the water, 0 a mirror) and `look` ('via' | 'photo': the far
//         forest's grade, the water's preset, haze from 8 km or from the eye) apply without rebuilding.
//   The far forest (far-forest-scene.ts): the package's aggregate stems as stand patches, the canopy surface past the
//         cut-off; &farforest=0 draws them as trees again. window.pgmaps.syntheticStand(request, perHectare) makes a
//         test stand for a final request.
//   &burnTest=<fire year>: a stand-in burn (burnt.ts syntheticBurn: forest posts east of the eye), for a package with none.
//   &captureTest: after the scene is ready, a capture of the package's own view with a test class layer, the reply on
//         window.pgmaps.lastCapture and its pictures' URLs on window.pgmaps.captureUrls; window.pgmaps.capture(request)
//         runs any request.
//
// The package is local metres: x east, y north, z up (heights absolute). Here y is up and north is -z.
import * as THREE from 'three/webgpu';
import { attribute, float, vec2, vec3, vec4, mix, hash, clamp, dot, positionWorld, select, texture, uniform, smoothstep, length, cameraPosition } from 'three/tsl';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import {
  NaniteRenderer, createAtlas, bakeImpostors, impostorCoverage, makeLeafAlpha, defaultLook, asReceivedShadow, mipBias,
  IMPOSTOR_CUT, PHASE2_LAYER, CLASS_DEBUG, ditherShift, impMinPx, impExact, type ImpostorAtlas, type NaniteLook, type Float, type Vec3,
} from '../src/nanite-lib/index.ts';
import { TAA } from '../src/taa.ts';
import { GodRays } from '../src/godrays.ts';
import { detailPos } from '../src/planet.ts';
import { reliefSteps } from '../src/ground/relief.ts';
import { buildStand, type Stand } from './pgmaps/trees.ts';
import { buildFarForest, planFarForest, setGrade, type FarForest } from './pgmaps/far-forest-scene.ts';
import { lookGrade, type LookGrade } from './pgmaps/stand-patches.ts';
import { mergeStems, syntheticStand, withPlaceholderStem, type FinalOptions } from './pgmaps/final-stand.ts';
import { buildTerrain, buildMasks, inRing } from './pgmaps/terrain.ts';
import { floorMaterial } from './pgmaps/floor.ts';
import { TREE_KEEP, coverCounts, coverShareSampler, skylineSea, syntheticCover, thinSceneByCover, thinStems } from './pgmaps/ground-cover.ts';
import { coverGrade, setCoverGrade } from './pgmaps/cover-shading.ts';
import { buildDebris } from './pgmaps/debris.ts';
import { buildWater } from './pgmaps/water.ts';
import { createEnvironment, type SunReport } from './pgmaps/environment.ts';
import { createParticles } from './pgmaps/particles.ts';
import { DEFAULT_ENVIRONMENT, environmentFromUrl, instantOf, parseEnvironment, type Environment, type ScenePackage } from './pgmaps/package.ts';
import { fractionalYear, snagScene, snagStems, syntheticBurn } from './pgmaps/burnt.ts';
import { fitCameraViewport, type CameraProjection } from './pgmaps/camera.ts';
import { contentHash, sceneKey } from './pgmaps/content-hash.ts';
import { ACCEPTS, unpackArrays } from './pgmaps/packed-arrays.ts';
import {
  captureMissing, classPixels, classRasterKey, framePoints, linearDepth, stemClasses, paddedRow, pinholePose, rasterizeClassLayers, readCaptureRequest, unpadRows,
  type CaptureFrame, type CaptureLayer, type CaptureRequest, type ClassGrid, type Rgb, type SeenGround,
} from './pgmaps/capture-math.ts';
import { host } from './pgmaps/host.ts';

declare const __NANITE_VERSION__: string | undefined;
/** This build's version: the package's and the commit's (vite.config.ts). */
const VERSION = typeof __NANITE_VERSION__ === 'string' ? __NANITE_VERSION__ : 'unknown';
/** A final capture's warm-up frames (lists, HZB, the stand's first LOD pass) before its samples, and its shadow map's half-extent (m). */
const FINAL_WARM = 6;
/** The stand's own trees take the look's grade from here to there (m from the eye). */
const GRADE_FROM = 1200, GRADE_TO = 4000;
const FINAL_SHADOW_HALF = 600;

// (a worker's location is its script's address, with the options PGMaps put on it: `?embed&treecache=1`)
const params = new URLSearchParams(location.search);
const ENGINE = 'nanite';
const embedded = host.embedded;
const toParent = (message: Record<string, unknown>, transfer: Transferable[] = []): void => host.post({ engine: ENGINE, ...message }, transfer);
/** The orbit controls a page opened alone looks round with; in a worker (no DOM events), a stand-in that holds the target. */
type Controls = { enabled: boolean; target: THREE.Vector3; update: () => unknown; dispose: () => void };

type CameraMessage = { position: [number, number, number]; bearingDegrees: number; pitchDegrees: number; verticalFovDegrees?: number; projection?: CameraProjection };
type Drawing = {
  setEye: (eye: CameraMessage) => void;
  setEnvironment: (env: Environment) => void;
  capture: (request: CaptureRequest) => Promise<CaptureReply>;
  teardown: () => Promise<void>;
  /**
   * Whether building `scene` (a package of this drawing's content: the caller compares the hashes) for `env` now
   * would draw what this drawing does: the same view year (which decides the burns' snags) and the same look.
   */
  sameAs: (scene: ScenePackage, env: Environment) => boolean;
  /**
   * Shown again for another copy of its package, as a build would leave it: the capture it is drawing finished, the
   * view on the package's eye, the copy's `createdAt` taken, ready said once the next frame is drawn.
   */
  again: (scene: ScenePackage) => Promise<void>;
};
type CaptureReplyFrame = {
  width: number; height: number; image: Blob;
  /** The ground class pass (no trees); `screened`: the same with the trees, each in its ground's class. */
  classes: Uint8ClampedArray; screened: Uint8ClampedArray; depth: Float32Array; zones?: Uint8ClampedArray;
  camera: { position: [number, number, number]; bearingDegrees: number; pitchDegrees: number; horizontalFovDegrees: number; verticalFovDegrees: number; near: number; far: number };
};
type CaptureReply = {
  type: 'pgmaps-engine-capture'; engine: string; id: string; version: string; frames: CaptureReplyFrame[];
  scene: { createdAt: string | null; origin: ScenePackage['origin'] | null }; environment: Record<string, unknown> | null;
  maxTreeHeightMeters: number | null; missing: string[]; missingDetail: string[];
  /** Stems by the class their tree took in the class pass (a layer's id, or 'vegetation'): not in PGMaps' protocol. */
  stemClasses: Record<string, number>;
  /** Milliseconds of each frame's picture, screened pass, ground and zone passes and readbacks (not in PGMaps' protocol: for the trial). */
  timings: Array<{ imageMs: number; screenedMs: number; bareMs: number; readMs: number }>;
  /** What a `final` request drew (null for `active`). */
  final: { samples: number; stems: number; canopyCutoffMeters: number | null; millis: number } | null;
};
/** What is drawn now, the package waiting behind a build, the parent's latest eye (in the latest package's frame) and environment. */
let current: Drawing | null = null;
let building = false;
let queued: ScenePackage | null = null;
/** The queued package came as its key alone (it is the one drawn now): see `show`. */
let queuedKeyOnly: string | null = null;
let latestCamera: CameraMessage | null = null;
let latestEnvironment: Environment = environmentFromUrl(params) ?? DEFAULT_ENVIRONMENT;
let environmentOverridden = environmentFromUrl(params) !== null;
/** Why the last build failed (a capture waiting on it says so). */
let lastError: string | null = null;
/** The package drawn now, and its key (content-hash.ts sceneKey; null: not hashed, `&reuse=0`). */
let currentScene: ScenePackage | null = null;
let currentKey: string | null = null;
/**
 * PGMaps' own key for a package it sent (`{ type: 'pgmaps-scene', scene, key }`), by the package object. A later
 * `{ type: 'pgmaps-scene', key }` with no package means the one drawn now, when that is the package of that key and
 * its drawing can be kept; otherwise the page asks for it whole (`pgmaps-engine-scene-needed`).
 */
const postedKeys = new WeakMap<ScenePackage, string>();
/**
 * Milliseconds of the stages of the last build, final stand and capture, on window.pgmaps.timing (for the trial and
 * PGMaps' time estimate; not in its protocol). `lap(name)` adds the time since the last lap to `name`.
 */
const stages = () => {
  let t = performance.now();
  const ms: Record<string, number> = {};
  return { ms, lap: (name: string): void => { const now = performance.now(); ms[name] = Math.round(((ms[name] ?? 0) + now - t) * 10) / 10; t = now; } };
};
/** When the latest package's message arrived (epoch ms) and the milliseconds the browser took to unpack it. */
let arrival = { at: 0, unpack: 0, packed: 0 };
const timing: { show: Record<string, number>; build: Record<string, number>; finalStand: Record<string, number>; capture: Record<string, number> } = { show: {}, build: {}, finalStand: {}, capture: {} };

/** Draw `scene`, after tearing down what is drawn. Packages that arrive during a build wait; only the latest is built. */
async function show(scene: ScenePackage, keyOnly: string | null = null): Promise<void> {
  if (building) {
    queued = scene;
    queuedKeyOnly = keyOnly;
    return;
  }
  building = true;
  try {
    if (!environmentOverridden) latestEnvironment = parseEnvironment(scene.environment as Record<string, unknown> | undefined) ?? DEFAULT_ENVIRONMENT;
    // The same package again: PGMaps posts a view's package before each of its captures (stamped anew, `createdAt`),
    // and tearing the drawing down and building it again was 5 s, the final stand another 5 s. Every number of the
    // package is hashed (postMessage hands over a copy, so there is no identity to compare): alike, the drawing stays.
    const shown = stages();
    timing.show = shown.ms;
    (shown.ms.arrivedAt = arrival.at), (shown.ms.unpack = arrival.unpack), (shown.ms.packedArrays = arrival.packed);
    let key: string | null = null;
    try {
      // (the very package drawn now, named by PGMaps' key: its hash is the one it was drawn under)
      if (params.get('reuse') !== '0') key = keyOnly !== null && scene === currentScene ? currentKey : sceneKey(scene);
    } catch { /* (not a package that can be hashed: built, or refused, as before) */ }
    shown.lap('hash');
    if (current && key !== null && key === currentKey && current.sameAs(scene, latestEnvironment)) {
      await current.again(scene);
      shown.ms.reused = 1;
      shown.lap('again');
    } else if (keyOnly !== null) {
      // Named by its key alone, but its drawing cannot be kept (another year or look, `&reuse=0`): the held copy is
      // never built from again (a build may have changed it); PGMaps sends the package whole and that one is built.
      shown.ms.reused = 0;
      toParent({ type: 'pgmaps-engine-scene-needed', key: keyOnly });
      return;
    } else {
      if (current) await current.teardown();
      current = null;
      currentKey = null;
      current = await build(scene, latestEnvironment);
      currentKey = key;
      shown.ms.reused = 0;
      shown.lap('build');
    }
    currentScene = scene;
    current.setEnvironment(latestEnvironment); // (one that came during the build)
    if (latestCamera) current.setEye(latestCamera);
    lastError = null;
  } catch (error) {
    console.error(error);
    lastError = error instanceof Error ? error.message : String(error);
    fail(error);
  } finally {
    building = false;
    const next = queued, nextKeyOnly = queuedKeyOnly;
    queued = null;
    queuedKeyOnly = null;
    if (next) void show(next, nextKeyOnly);
  }
}

function fail(error: unknown): void {
  const message = error instanceof Error ? error.message : String(error);
  host.status(`failed: ${message}`);
  host.expose({ pgmaps: { ready: true, error: message } });
  toParent({ type: 'pgmaps-engine-error', message });
}

addEventListener('message', (event: MessageEvent) => {
  const arrived = performance.now();
  const data = event.data as { type?: string; scene?: ScenePackage; key?: unknown } & Partial<CameraMessage> & Record<string, unknown>;
  if (data?.type === 'pgmaps-scene' && data.scene) {
    // (reading the message is the browser unpacking the package's copy, then its packed arrays turned back into the
    // plain ones the build reads, packed-arrays.ts: timed, with when it arrived, for the trial)
    const packed = unpackArrays(data.scene);
    arrival = { at: Math.round(performance.timeOrigin + arrived), unpack: Math.round((performance.now() - arrived) * 10) / 10, packed };
    if (typeof data.key === 'string') postedKeys.set(data.scene, data.key);
    latestCamera = null; // (an eye sent before belongs to the previous package's frame)
    void show(data.scene);
  } else if (data?.type === 'pgmaps-scene' && typeof data.key === 'string') {
    // The key alone: the package drawn now, if that is the one PGMaps sent under this key (else it is asked for).
    // (during a build, or with another package waiting, it is asked for whole and takes its turn like any other)
    if (!building && current && currentScene && postedKeys.get(currentScene) === data.key) {
      arrival = { at: Math.round(performance.timeOrigin + arrived), unpack: 0, packed: 0 };
      latestCamera = null;
      void show(currentScene, data.key);
    } else toParent({ type: 'pgmaps-engine-scene-needed', key: data.key });
  } else if (data?.type === 'pgmaps-camera' && Array.isArray(data.position)) {
    latestCamera = data as CameraMessage;
    if (current && !building) current.setEye(latestCamera);
  } else if (data?.type === 'pgmaps-capture') {
    void capture(data, true).then(
      (reply) => toParent(reply, reply.frames.flatMap((f) => [f.classes.buffer, f.screened.buffer, f.depth.buffer, ...(f.zones ? [f.zones.buffer] : [])])),
      (error: unknown) => toParent({ type: 'pgmaps-engine-capture', id: typeof data.id === 'string' ? data.id : null, error: error instanceof Error ? error.message : String(error) }),
    );
  } else if (data?.type === 'pgmaps-environment') {
    const env = parseEnvironment(data);
    if (!env) return;
    environmentOverridden = true;
    latestEnvironment = env;
    if (current && !building) current.setEnvironment(env);
  }
});

/** The drawing once no package is building or waiting (a capture that arrives during a build waits for it). */
async function drawn(): Promise<Drawing> {
  for (;;) {
    if (current && !building && !queued) return current;
    if (!current && !building && !queued) throw new Error(lastError ? `The scene failed to build: ${lastError}` : 'No scene package to capture: send one first.');
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
}

let captures: Promise<unknown> = Promise.resolve();
/**
 * The running capture's steps for PGMaps' time-left estimate: `{ type: 'pgmaps-capture-progress', id, done, total,
 * stage }`, one step per warm-up and sample render, at most four times a second and once at the end.
 */
const progress = {
  id: null as string | null,
  /** The request came from PGMaps (not `window.pgmaps.capture`): its steps are reported. */
  source: false,
  done: 0,
  total: 0,
  perFrame: 1,
  sentAt: 0,
  begin(frames: number, perFrame: number) {
    this.done = 0;
    this.perFrame = Math.max(1, perFrame);
    this.total = frames * this.perFrame;
    this.sentAt = 0;
  },
  step() {
    if (!this.id || !this.source || !this.total) return;
    this.done = Math.min(this.total, this.done + 1);
    const now = performance.now();
    if (now - this.sentAt < 250 && this.done < this.total) return;
    this.sentAt = now;
    const stage = `frame ${Math.min(this.total / this.perFrame, Math.floor((this.done - 1) / this.perFrame) + 1)} of ${this.total / this.perFrame}`;
    toParent({ type: 'pgmaps-capture-progress', id: this.id, done: this.done, total: this.total, stage });
  },
};
/** A capture request, checked, drawn after any capture before it. */
function capture(data: unknown, source = false): Promise<CaptureReply> {
  const run = captures.then(async () => {
    const request = readCaptureRequest(data);
    progress.id = source ? request.id : null;
    progress.source = source;
    try {
      return await (await drawn()).capture(request);
    } finally {
      progress.id = null;
      progress.source = false;
    }
  });
  captures = run.catch(() => undefined);
  return run;
}

async function loadScene(): Promise<ScenePackage> {
  const url = params.get('scene');
  if (url) return (await fetch(url)).json();
  host.status('choose a PGMaps scene package (forestry-scene-package.json)');
  const input = document.getElementById('file') as HTMLInputElement;
  input.hidden = false;
  return new Promise((resolve) => {
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      try {
        const scene = JSON.parse(await file.text()) as ScenePackage;
        input.hidden = true;
        resolve(scene);
      } catch {
        host.status('Could not read that file as JSON. Choose a PGMaps scene package.');
        input.value = '';
      }
    };
  });
}

/**
 * The stand's look in the library's hooks: per-stem brightness (a hash and the package's tone, b.w), and snow dusting
 * the crowns when the ground is snowy. No wind: the stand stands still (the parent compares frames, and the water's
 * reflection renders the stand without the scene target's motion output, which a wind's MRT output would need).
 */
function standLook(snow: THREE.UniformNode<'float', number>, grade: LookGrade): NaniteLook {
  // the look's grade (stand-patches.ts), eased in with distance: the far stand reads as the far forest does
  const far = (c: Vec3): Vec3 => {
    const y = dot(c, vec3(0.2126, 0.7152, 0.0722));
    const k = smoothstep(GRADE_FROM, GRADE_TO, length(positionWorld.sub(cameraPosition)));
    return mix(c, mix(vec3(y, y, y), c, grade.chroma).mul(grade.tint), k);
  };
  const dusted = (c: Vec3): Vec3 => far(mix(c, vec3(0.78, 0.81, 0.86).mul(dot(c, vec3(0.3, 0.59, 0.11)).mul(2).add(0.55)), snow.mul(0.2)));
  const toneOf = (tone: Float): Float => clamp(tone, 0, 1).mul(0.3).add(0.85);
  return {
    ...defaultLook(),
    tint: (inst) => hash(inst).mul(0.24).add(0.88),
    cardValue: (_inst, b) => b.w,
    impostorValue: (_inst, b) => b.w,
    solidColour: (rgb) => rgb.mul(vec3(0.9, 0.86, 0.8)),
    cardColour: (rgb, _layer, tint, tone) => dusted(rgb.mul(tint).mul(toneOf(tone))),
    impostorColour: (albedo, gain, tint, tone) => dusted(albedo.mul(gain).mul(tint).mul(toneOf(tone))),
    bakeCardColour: (rgb) => rgb,
  };
}

async function build(scene: ScenePackage, env0: Environment): Promise<Drawing> {
  if (scene?.format !== 'pgmaps-forest-scene' || scene.version !== 1) throw new Error('Not a PGMaps forest scene package (v1).');
  const t0 = performance.now();
  const built = stages();
  timing.build = built.ms;
  // the natural ground cover (ground-cover.ts): no stems on rock or water, fewer on herb, shrub and sparse forest,
  // before anything reads them (the floor's masks, the far forest, the stand), so each pass draws the same stems
  // (?coverTest: a stand-in cover from the grids' slope and canopy, for a package that carries none)
  if (params.has('coverTest')) {
    const test = <G extends ScenePackage['terrain'] | undefined>(g: G): G => (g && !g.cover ? { ...g, cover: syntheticCover(g) } : g);
    scene = { ...scene, terrain: test(scene.terrain), farTerrain: test(scene.farTerrain), skylineTerrain: test(scene.skylineTerrain) };
  }
  // (?burnTest=<fire year>: a stand-in burn east of the eye, burnt.ts syntheticBurn, for a package that carries none)
  if (params.has('burnTest')) {
    const year = Number(params.get('burnTest')) || 2021, east = scene.camera.position[0] + 150;
    const test = <G extends ScenePackage['terrain'] | undefined>(g: G): G => (g ? syntheticBurn(g, east, year) : g);
    scene = { ...scene, terrain: test(scene.terrain), farTerrain: test(scene.farTerrain), skylineTerrain: test(scene.skylineTerrain) };
  }
  const covered = thinSceneByCover(scene);
  scene = covered.scene;
  // burnt ground (burnt.ts): its stems stand dead as snags, those fallen by the burn's age left out; the view's year
  // (the environment's, else the package's writing, else now) ages a burn
  // (the package's stamp: a later copy of the same package brings its own, `again`)
  let createdAt = scene.createdAt;
  const { origin } = scene;
  const yearFrom = (env: Environment, created: string | undefined): number | null => fractionalYear(instantOf(env)) ?? fractionalYear(created ? new Date(created) : null);
  const yearOf = (env: Environment): number => yearFrom(env, createdAt) ?? fractionalYear(new Date())!;
  const viewYear0 = yearOf(env0);
  const snagged = snagScene(scene, covered.rasters, viewYear0);
  scene = snagged.scene;
  // (the skyline's sea, which has no polygons, laid flat at its dropped level: ground-cover.ts skylineSea)
  const sea = scene.skylineTerrain ? skylineSea(scene.skylineTerrain) : null;
  if (sea?.posts) scene = { ...scene, skylineTerrain: sea.grid };
  const coverReport = { posts: coverCounts(covered.rasters), stemsRemoved: covered.removed, snags: snagged.snags, snagsFallen: snagged.fallen, skylineSeaPosts: sea?.posts ?? 0, test: params.has('coverTest') };
  console.info('pgmaps cover', JSON.stringify(coverReport));
  const treeKeep = covered.rasters.length ? coverShareSampler(covered.rasters, TREE_KEEP) : null;
  built.lap('cover');
  // (the adapter's own buffer limits, as the demo asks for them (src/webgpu-start.ts): a capture's far stems grow clump
  // types, and their impostor atlas, 8192 x 5120 half floats, read back past the default 256 MB buffer; the floor samples
  // more than the default 16 textures with the cover's three grids)
  const adapter = await navigator.gpu?.requestAdapter({ powerPreference: 'high-performance' });
  const lim = adapter?.limits;
  const renderer = new THREE.WebGPURenderer({
    canvas: host.canvas(), antialias: false, powerPreference: 'high-performance',
    ...(lim ? { requiredLimits: { maxBufferSize: lim.maxBufferSize, maxStorageBufferBindingSize: lim.maxStorageBufferBindingSize, maxStorageBuffersPerShaderStage: lim.maxStorageBuffersPerShaderStage, maxSampledTexturesPerShaderStage: lim.maxSampledTexturesPerShaderStage } } : {}),
  });
  await renderer.init();
  if (!(renderer.backend as unknown as { isWebGPUBackend?: boolean }).isWebGPUBackend) throw new Error('this example needs WebGPU (compute)');
  const view0 = host.viewport();
  renderer.setPixelRatio(Math.min(view0.pixelRatio, 1.5));
  // (an OffscreenCanvas has no style to size: PGMaps sizes and places the element it handed over)
  renderer.setSize(view0.width, view0.height, !host.worker);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  host.mount(renderer.domElement);
  built.lap('device');

  const three = new THREE.Scene();
  const { camera: eye } = scene;
  const camera = new THREE.PerspectiveCamera(eye.verticalFovDegrees, view0.width / view0.height, 0.3, 30000);
  // (OrbitControls' update turns the camera to its target even when disabled: that is what aims the parent's eye, so
  // the worker's stand-in does the same)
  const target = new THREE.Vector3();
  const controls: Controls = host.worker
    ? { enabled: false, target, update: () => camera.lookAt(target), dispose: () => {} }
    : new OrbitControls(camera as never, renderer.domElement as HTMLCanvasElement);
  controls.enabled = !params.has('embed') && !host.worker; // (embedded, the parent drives the camera)
  let savedProjection = eye.projection;
  let updateViewport = (): void => {};
  /** The package's eye (local metres, z up, bearing clockwise from north) as the camera and the orbit's target. */
  const setEye = (e: CameraMessage): void => {
    savedProjection = e.projection;
    const b = THREE.MathUtils.degToRad(e.bearingDegrees), p = THREE.MathUtils.degToRad(e.pitchDegrees);
    camera.position.set(e.position[0], e.position[2], -e.position[1]);
    if (e.verticalFovDegrees) camera.fov = e.verticalFovDegrees;
    camera.updateProjectionMatrix();
    updateViewport();
    controls.target.copy(camera.position).add(new THREE.Vector3(Math.sin(b) * Math.cos(p), Math.sin(p), -Math.cos(b) * Math.cos(p)).multiplyScalar(100));
    controls.update();
  };
  setEye(eye);

  // ---------------------------------------------------------------- ground, sky, light
  const terrain = buildTerrain(scene);
  built.lap('terrain');
  // the sky past the outermost real ground's corners (a skyline grid's, up to ~85 km), and the far plane past the sky
  // (the depth's precision is set by the near plane: z = 1 - near / d, the far plane only scales it by far / (far - near))
  const groundOuter = terrain.ground.outer;
  const { west: gw, south: gs, east: ge, north: gn } = groundOuter;
  const groundReach = Math.max(...[[gw, gs], [gw, gn], [ge, gs], [ge, gn]].map(([x, y]) => Math.hypot(x, y))) * 1.02;
  const envr = createEnvironment(three, terrain.heightAt, groundReach);
  camera.far = Math.max(30000, envr.skyScale + Math.hypot(eye.position[0], eye.position[1]) + 1000);
  camera.updateProjectionMatrix();
  built.lap('environment');
  const masks = buildMasks(scene, terrain.bounds, terrain.farBounds, viewYear0);
  built.lap('masks');
  const groundGrade = coverGrade();
  setCoverGrade(groundGrade, env0.look ?? 'via', viewYear0);
  const samples = 1; // (TAA: leaves by coverage against a moving dither; see src/webgpu-start.ts)
  // the far forest's plan: the package's aggregate stems (each for hundreds of trees) leave the stand, real-crown
  // types are grown for the stand patches (far-forest-scene.ts)
  const plan = planFarForest(scene);
  // (a stand of no stems, a view over open water, drawn as one stem far under the ground: no zero-sized buffers)
  const placeholder = <T extends ScenePackage['trees']>(t: T): T => withPlaceholderStem(t, eye.position[0], eye.position[1], terrain.heightAt(eye.position[0], -eye.position[1]));
  const [floor, stand] = await Promise.all([
    floorMaterial({ masks, snow: envr.snow, wet: envr.wet, fadeShadow: (far) => envr.fadeShadow(far), coverGrade: groundGrade }),
    buildStand({ ...scene, trees: placeholder(plan ? plan.trees : scene.trees) }, samples, plan?.extra ?? []),
  ]);
  built.lap('floorAndStand');
  terrain.mesh.material = floor;
  terrain.mesh.renderOrder = 1; // (after the trees: what they hide is rejected before the floor's shader)
  three.add(terrain.mesh);
  const debris = await buildDebris(scene, terrain.heightAt, envr.snow);
  if (debris) three.add(debris);
  built.lap('debris');
  const water = buildWater(scene, terrain.waterLevels, { sunDir: envr.lightDir, sunColour: envr.sun.color });
  built.lap('water');
  if (water) three.add(water.group);
  const particles = createParticles();
  three.add(particles.mesh);

  // ---------------------------------------------------------------- the stand
  const grade = lookGrade();
  setGrade(grade, env0.look ?? 'via');
  const look = standLook(envr.snow, grade);
  const { types } = stand;
  // (every stem drawn however far: a capture's package carries them kilometres out)
  const { fields: treeFields, data: treeData, count: treeCount } = scene.trees;
  const fieldX = treeFields.indexOf('x'), fieldY = treeFields.indexOf('y');
  /** The farthest stem from a place (package metres, across the ground). */
  const treeReach = (x: number, y: number): number | null => {
    let far = -1;
    for (let i = 0; i < treeCount; i++) far = Math.max(far, Math.hypot(treeData[i * treeFields.length + fieldX] - x, treeData[i * treeFields.length + fieldY] - y));
    return far >= 0 ? far : null;
  };
  const treeShade = float(0.4); // (past the shadow map, the crowns' average self-shade)
  const fog = (pos: Vec3) => ({ color: envr.fogColour(pos), factor: envr.fogFactor(pos) });
  /**
   * `&atlasdigest`: a stand's baked atlas in numbers, for comparing two ways of baking it (window.pgmaps.atlasDigests):
   * the content hash of its coverage scales, and of the albedo and normal atlases read back at mip levels 0, 1, 4 and 8.
   */
  const atlasDigests: Record<string, unknown> = {};
  const atlasDigest = async (at: ImpostorAtlas) => {
    const backend = renderer.backend as unknown as { device: GPUDevice; get: (t: THREE.Texture) => { texture: GPUTexture } };
    /** A mip level's bytes as the GPU holds them (rows padded to 256 bytes, the padding zero), hashed. */
    const level = async (t: THREE.Texture, l: number): Promise<string> => {
      const w = Math.max(1, at.renderTarget.width >> l), h = Math.max(1, at.renderTarget.height >> l), bytesPerRow = Math.ceil((w * 8) / 256) * 256;
      const buffer = backend.device.createBuffer({ size: bytesPerRow * h, usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ });
      const encoder = backend.device.createCommandEncoder();
      encoder.copyTextureToBuffer({ texture: backend.get(t).texture, mipLevel: l }, { buffer, bytesPerRow }, { width: w, height: h });
      backend.device.queue.submit([encoder.finish()]);
      await buffer.mapAsync(GPUMapMode.READ);
      const hash = contentHash(new Uint8Array(buffer.getMappedRange()));
      buffer.unmap();
      buffer.destroy();
      return hash;
    };
    const of = async (t: THREE.Texture) => [await level(t, 0), await level(t, 1), await level(t, 4), await level(t, 8)];
    return { tiles: at.views, scales: contentHash(at.coverage.scales), albedo: await of(at.texture), normals: await of(at.normals) };
  };
  /**
   * The impostor bake in fewer GPU passes, the same texels. The library's bake is a render a tile and target: 432
   * renders into an 8192 x 3584 half-float atlas (4 samples) for a live stand's 54 types, 496 into an 8192 x 4096
   * one for a final stand's 62, and the builds waited 1.1-1.2 s and 1.6-1.9 s on the GPU for them (measured on the
   * Hwy 31 scene; the atlas's readback after them is 0.06-0.13 s, its coverage worker 0.12-0.2 s). Two things each
   * render did are done once here (0.4 s and 0.6-1 s then; the atlases and their coverage scales the same bytes,
   * `&atlasdigest`):
   *   - three.js makes a render target's mipmaps at the end of every render into it (WebGPUBackend.finishRender). The
   *     atlases' textures are made first (with their mip levels), their `generateMipmaps` is off while the tiles are
   *     drawn, and one chain is made at the end from the same level 0;
   *   - the bake clears the depth before each tile with `renderer.clearDepth()`, a render pass of its own. The clear
   *     is held and done by the tile's own render (its depth attachment's load, the colour kept).
   * `&bake=plain`: the library's bake as it is.
   */
  const leanBake = (at: ImpostorAtlas, bake: () => void): void => {
    if (params.get('bake') === 'plain') return bake();
    const targets = [at.renderTarget, at.normalsTarget];
    const was = { target: renderer.getRenderTarget(), colour: renderer.getClearColor(new THREE.Color()), alpha: renderer.getClearAlpha() };
    renderer.setClearColor(0x000000, 0);
    for (const t of targets) {
      renderer.setRenderTarget(t);
      renderer.clear(); // (makes the target's textures; the bake clears them again)
    }
    renderer.setRenderTarget(was.target);
    renderer.setClearColor(was.colour, was.alpha);
    for (const t of targets) t.texture.generateMipmaps = false;
    // (the renderer's own methods, put back after: `delete` uncovers the class's)
    const own = renderer as unknown as { clearDepth?: () => void; render?: (scene: THREE.Object3D, camera: THREE.Camera) => unknown };
    const render = renderer.render.bind(renderer) as (scene: THREE.Object3D, camera: THREE.Camera) => unknown;
    let depthDue = false;
    own.clearDepth = () => {
      depthDue = true;
    };
    own.render = (scene, camera) => {
      if (!depthDue) return render(scene, camera);
      depthDue = false;
      const auto = [renderer.autoClear, renderer.autoClearColor, renderer.autoClearDepth, renderer.autoClearStencil];
      (renderer.autoClear = true), (renderer.autoClearColor = false), (renderer.autoClearDepth = true), (renderer.autoClearStencil = false);
      try {
        return render(scene, camera);
      } finally {
        [renderer.autoClear, renderer.autoClearColor, renderer.autoClearDepth, renderer.autoClearStencil] = auto;
      }
    };
    try {
      bake();
    } finally {
      delete own.clearDepth;
      delete own.render;
      const backend = renderer.backend as unknown as { generateMipmaps: (texture: THREE.Texture) => void };
      for (const t of targets) {
        t.texture.generateMipmaps = true;
        backend.generateMipmaps(t.texture);
      }
    }
  };
  /** A stand as a Nanite renderer with its impostors baked: the live one, or a final capture's (real density). */
  const naniteOf = async (st: Stand, maxDist: number, { lap, ms }: ReturnType<typeof stages>) => {
    const n = new NaniteRenderer(renderer, st.types, st.instances, st.textures, look);
    n.u.maxDist.value = maxDist;
    n.u.tau.value = Number(params.get('tau') ?? 2); // (px of error: at 1 the stand's lists overflowed into 17-35 ms frames on an M4 Pro, at 2 ~5.5 ms)
    n.group.traverse((o) => {
      if (o instanceof THREE.Mesh && !o.castShadow) (o.material as THREE.NodeMaterial).receivedShadowNode = asReceivedShadow(envr.fadeShadow(treeShade));
    });
    n.group.add(n.sw.buildResolveMesh({ fadeShadow: (pos: Vec3) => envr.fadeShadow(treeShade, pos), fog }));
    const at = createAtlas(st.types.length);
    const imp = n.buildImpostorMesh(at, st.types.map(() => ({ side: [1, 1, 1] as [number, number, number], top: [1, 1, 1] as [number, number, number] })));
    imp.receiveShadow = true;
    (imp.material as THREE.NodeMaterial).receivedShadowNode = asReceivedShadow(envr.fadeShadow(treeShade));
    n.group.add(imp, n.splats.build(at, { fadeShadow: (pos: Vec3) => envr.fadeShadow(treeShade, pos), shadow: (pos: Vec3) => envr.fadeShadow(treeShade, pos), fog }), n.buildImpostorShadowMesh(at));
    lap('naniteRenderer');
    leanBake(at, () => bakeImpostors(renderer, at, st.types, { bark: st.textures.bark, leaf: st.textures.leaf, barkLayers: st.barkLayers, leafLayers: st.leafLayers, leafAlpha: makeLeafAlpha(st.textures.leaf, attribute('uv', 'vec2')) }, look, n.u.impostorPx.value));
    lap('impostorBake');
    // (the bake's renders done on the GPU before the readback is timed: the readback waits for them anyway)
    await (renderer.backend as unknown as { device: GPUDevice }).device.queue.onSubmittedWorkDone();
    lap('impostorBakeGpu');
    await impostorCoverage(renderer, at, IMPOSTOR_CUT);
    lap('impostorCoverage');
    // (of which: waiting for the atlas's readback, the bake's GPU work before it, and the coverage worker)
    if (at.coverage.ms) (ms.coverageReadback = Math.round(at.coverage.ms.readback)), (ms.coverageWork = Math.round(at.coverage.ms.work));
    if (params.has('atlasdigest')) (atlasDigests[st === stand ? 'live' : 'final'] = await atlasDigest(at));
    n.impostorsBaked(at, st.types.map(() => [1, 1] as [number, number]));
    n.splats.enabled.value = 1;
    return { nanite: n, atlas: at };
  };
  const live = await naniteOf(stand, Math.max(9000, (treeReach(eye.position[0], eye.position[1]) ?? 0) + 1500), built);
  const liveNanite = live.nanite, atlas = live.atlas;
  /** The stand drawn now: the live one, or a final capture's while it draws. */
  let nanite = liveNanite;
  three.add(nanite.group);
  /** The far forest (built with the capture's drapes, below). */
  let farForest: FarForest | null = null;

  // ---------------------------------------------------------------- the frame: the demo's targets and passes
  const sceneRT = new THREE.RenderTarget(1, 1, { type: THREE.HalfFloatType, samples, depthBuffer: true });
  sceneRT.depthTexture = new THREE.DepthTexture(1, 1, THREE.FloatType);
  nanite.setDepthSource(sceneRT.depthTexture, samples);
  const rays = new GodRays(renderer, sceneRT.depthTexture, envr.sunDir, { enabled: params.get('rays') !== '0' });
  const taa = new TAA(renderer, sceneRT, samples, { enabled: params.get('taa') !== '0', extra: rays.at });
  const output = new THREE.RenderPipeline(renderer, vec4(taa.displayNode, 1));
  const size = new THREE.Vector2();
  let viewWidth = 0, viewHeight = 0;
  const resize = (): void => {
    const box = host.viewport();
    const view = fitCameraViewport(savedProjection, box.width, box.height);
    if (Math.min(box.pixelRatio, 1.5) !== renderer.getPixelRatio()) {
      renderer.setPixelRatio(Math.min(box.pixelRatio, 1.5));
      viewWidth = 0; // (the drawing buffer changes size with it)
    }
    camera.aspect = view.aspect;
    camera.updateProjectionMatrix();
    if (viewWidth !== view.width || viewHeight !== view.height) {
      renderer.setSize(view.width, view.height, !host.worker);
      renderer.getDrawingBufferSize(size);
      sceneRT.setSize(size.x, size.y);
      viewWidth = view.width; viewHeight = view.height;
    }
    host.place(renderer.domElement, view);
  };
  updateViewport = resize;
  const unlistenResize = host.onResize(resize);
  resize();

  let sunReport: SunReport | null = null;
  /** The water's reflection at full resolution (a final capture), else half. */
  let finalWater = false;
  let drawnEnvironment: Environment = env0;
  const setEnvironment = (env: Environment): void => {
    drawnEnvironment = env;
    const sun = (sunReport = envr.apply(env, scene.origin));
    setGrade(grade, env.look ?? 'via');
    setCoverGrade(groundGrade, env.look ?? 'via', yearOf(env));
    particles.set(env.weather === 'rain' || env.weather === 'snow' ? env.weather : null);
    water?.update();
    water?.setLook({ windMs: env.windMs ?? 0, look: env.look ?? 'via', full: finalWater });
    const sky = envr.skyReport();
    state.environment = { ...env, ...sky, sunElevation: +sun.elevation.toFixed(2), sunAzimuth: +sun.azimuth.toFixed(2) };
  };

  const still = new THREE.Vector3(); // (the TAA's planet drop: none here)
  let lastStats = 0, lastPost = 0, disposed = false;
  /** Ready is to be said again at the next frame (the same package posted again, `again`). */
  let readyDue = false;
  /** The stats readback in flight: teardown waits for it, since destroying the device aborts its mapAsync. */
  let reading: Promise<unknown> | null = null;
  let fps = 0, lastFrame = performance.now();
  const state: Record<string, unknown> & { frames: number; ready: boolean } = {
    frames: 0, nanite, camera, controls, scene: three, ready: false, residual: stand.residual, buildMs: 0, environment: null, cover: coverReport, timing, atlasDigests,
    debug: { envr, rays, taa, terrain, reliefSteps, noShadows: false, noRays: false },
  };
  host.expose({ pgmaps: state });
  setEnvironment(env0);
  const t1 = performance.now();
  /**
   * The scene into sceneRT from `camera` at `size`: `live`, as shown (the shadow map, the god rays' switch and TAA's
   * jitter), or for the class pass (none of them, the dither held still).
   */
  /** The canopy surface's cut-off (pixels of a tree's height): the final request's while it draws. */
  let cutoffPx: number | undefined;
  const drawScene = (time: number, live: boolean): void => {
    camera.updateMatrixWorld();
    look.viewer.copy(camera.position);
    detailPos.value.copy(camera.position); // (the floor's relief fades from the eye)
    particles.update(time, camera.position);
    const debug = state.debug as { noShadows: boolean; noRays: boolean };
    const castShadows = envr.frame(renderer, camera, live && !debug.noShadows);
    rays.enabled = live && params.get('rays') !== '0' && envr.raysOn() && !debug.noRays;
    if (live) taa.jitter(camera, size.x, size.y);
    else {
      camera.updateProjectionMatrix();
      ditherShift.value.set(0, 0);
    }
    mipBias.value = 0;
    // the software rasterizer and its splats only from high up, as the demo's (src/webgpu-frame.ts: from 2 km, down to
    // 70% of it): near the ground its tiny leaf clusters, dithered, came out as pale specks on the crowns' tips
    const altitude = camera.position.y - terrain.heightAt(camera.position.x, camera.position.z);
    nanite.sw.idle = nanite.splats.idle = altitude < (nanite.sw.idle ? 2000 : 1400);
    farForest?.update(camera, size.y, cutoffPx);
    nanite.update(camera, size, time, castShadows ? envr.sun.shadow.camera : null);
    // phase 1: ground, sky and the trees visible last frame (and the shadow map)
    renderer.setRenderTarget(sceneRT);
    camera.layers.set(0);
    renderer.render(three, camera);
    // phase 2: occlusion from that depth, the rest of the stand, the tiny clusters and the precipitation
    nanite.occlusion(camera, size.x, size.y);
    nanite.rasterize(camera, size.x, size.y);
    const autoClear = renderer.autoClear;
    renderer.autoClear = false;
    envr.sun.shadow.needsUpdate = false; // (drawn in phase 1)
    camera.layers.set(PHASE2_LAYER);
    renderer.render(three, camera);
    camera.layers.set(0);
    renderer.autoClear = autoClear;
  };
  const frame = (): void => {
    state.frames++;
    const now = performance.now();
    fps = fps ? fps * 0.9 + (1000 / Math.max(1, now - lastFrame)) * 0.1 : 60;
    lastFrame = now;
    const time = (now - t1) / 1000;
    controls.update();
    drawScene(time, true);
    rays.render(camera, size.x, size.y);
    taa.resolve(camera, still);
    renderer.setRenderTarget(null);
    output.render();
    if (state.frames === 1) {
      built.lap('firstFrame');
      state.buildMs = Math.round(performance.now() - t0);
      toParent({ type: 'pgmaps-engine-ready' });
    } else if (readyDue) toParent({ type: 'pgmaps-engine-ready' });
    readyDue = false;
    if (time - lastStats > 0.5 && !reading) {
      lastStats = time;
      reading = nanite.readStats().then((s) => {
        reading = null;
        if (!s || disposed) return;
        host.status(`${scene.trees.count.toLocaleString()} stems, ${types.length} tree types (${stand.residual.lines.length - types.length} species)\n` +
          `drawn: ${s.instances.toLocaleString()} as clusters, ${s.impostors.toLocaleString()} impostors, ${(s.splats ?? 0).toLocaleString()} splats\n` +
          `crown width off by ${(stand.residual.mean * 100).toFixed(1)}% mean, ${(stand.residual.p90 * 100).toFixed(1)}% p90`);
        state.ready = state.frames > 10;
        if (time - lastPost >= 1) {
          lastPost = time;
          toParent({
            type: 'pgmaps-engine-stats', drawn: s.instances + s.impostors, fps: Math.round(fps),
            clusters: s.instances, impostors: s.impostors, splats: s.splats ?? 0, stems: scene.trees.count,
            crownErrorMean: +stand.residual.mean.toFixed(4), crownErrorP90: +stand.residual.p90.toFixed(4), sun: sunReport,
            environment: envr.skyReport(),
          });
        }
      }, () => (reading = null));
    }
  };
  // ---------------------------------------------------------------- capture (pgmaps-capture: PGMaps' engineCapture.ts)
  // Each frame offscreen at its own size: the picture as shown (TAA settled with the camera held, god rays, tone
  // mapping), then the class pass from the same camera into the same scene target (Nanite's debug 7: the trees one flat
  // colour, leaves cut at 0.5, no dither; the terrain the class layers' textures, near and far; the water flat; lights
  // off, haze off, no sky), its colour and depth read back, then with `zones` the zone pass (its polygons on the bare
  // terrain: trees, water and debris hidden). Through the whole capture every impostor is drawn at its own size, none
  // thinned or dropped (impExact): a far stand's trees each stand where the package puts them, in the picture and in
  // the class pass. The live view's camera, size and impostor switches are put back after.
  const IMAGE_FRAMES = Math.max(1, Number(params.get('captureFrames') ?? 24)); // (TAA's history weighs ~10 frames)
  const device = (renderer.backend as unknown as { device: GPUDevice }).device;
  const backend = renderer.backend as unknown as { copyTextureToBuffer: (t: THREE.Texture, x: number, y: number, w: number, h: number, face: number) => Promise<Float32Array> };
  const imageRT = new THREE.RenderTarget(1, 1, { depthBuffer: false }); // (RGBA8: the output pass tone maps and encodes sRGB)
  const linear = (rgb: readonly number[]) => new THREE.Vector3(rgb[0] / 255, rgb[1] / 255, rgb[2] / 255);
  const classWater = uniform(new THREE.Vector3());
  // (package x east = world x, package y north = -world z; a texture's row 0 is its grid's north edge)
  const uvOver = (b: { west: number; south: number; east: number; north: number }) => vec2(positionWorld.x.sub(b.west).div(b.east - b.west), positionWorld.z.add(b.north).div(b.north - b.south));
  const within = (uv: ReturnType<typeof uvOver>) => uv.x.greaterThanEqual(0).and(uv.x.lessThanEqual(1)).and(uv.y.greaterThanEqual(0)).and(uv.y.lessThanEqual(1));
  const cuv = uvOver(terrain.bounds);
  const farBounds = terrain.farBounds;
  const fuv = farBounds ? uvOver(farBounds) : null;
  const skylineBounds = terrain.skylineBounds;
  const suv = skylineBounds ? uvOver(skylineBounds) : null;
  /** A flat drape over the terrain: a raster over the detailed grid, coarser ones over the far and skyline grids, `rest` past them. */
  const drape = () => {
    const placeholder = () => new THREE.DataTexture(new Uint8Array(4), 1, 1);
    const near = texture(placeholder(), cuv), far = fuv ? texture(placeholder(), fuv) : null, sky = suv ? texture(placeholder(), suv) : null;
    const rest = uniform(new THREE.Vector3());
    const material = new THREE.MeshBasicNodeMaterial({ fog: false });
    const past = sky && suv ? select(within(suv), sky.rgb, rest) : rest; // (the apron: invented ground, `rest`)
    material.colorNode = select(within(cuv), near.rgb, far && fuv ? select(within(fuv), far.rgb, past) : past);
    let made: THREE.DataTexture[] = [];
    // (the grids the layers go over, finest first: the detailed one, about 7 m texels at 15 km, about 40 m at 85 km)
    const grids: ClassGrid[] = [{ bounds: terrain.bounds }, ...(far && farBounds ? [{ bounds: farBounds, maxSide: 4096, minTexel: 2 }] : []), ...(sky && skylineBounds ? [{ bounds: skylineBounds, maxSide: 4096, minTexel: 10 }] : [])];
    /** What the textures hold: the key of its layers and grids (capture-math.ts classRasterKey) and what `set` returned. */
    let held: { key: string; set: { cut: string[]; rasters: Array<ReturnType<typeof rasterizeClassLayers>> } } | null = null;
    /**
     * The layers rasterized over the grids, nearest; returns the rasters (finest first) and the layers cut at the
     * outermost grid's edge. The same layers and colours as the last call's: its textures and rasters are kept (a
     * view's captures carry the same layers, and rasterizing them was 1.6 s of each).
     */
    const set = (rgb: Rgb, layers: readonly CaptureLayer[]): { cut: string[]; rasters: Array<ReturnType<typeof rasterizeClassLayers>> } => {
      const key = classRasterKey(grids, rgb, layers);
      if (held?.key === key) return held.set;
      held = null;
      for (const t of made) t.dispose();
      made = [];
      const tex = (r: ReturnType<typeof rasterizeClassLayers>) => {
        const t = new THREE.DataTexture(r.data, r.width, r.height);
        t.magFilter = t.minFilter = THREE.NearestFilter;
        t.generateMipmaps = false;
        t.needsUpdate = true;
        made.push(t);
        return t;
      };
      const rasters = grids.map((g) => rasterizeClassLayers(g.bounds, rgb, layers, g.maxSide, g.minTexel));
      near.value = tex(rasters[0]);
      rest.value.copy(linear(rgb));
      if (far && farBounds) far.value = tex(rasters[1]);
      if (sky && skylineBounds) sky.value = tex(rasters[rasters.length - 1]);
      held = { key, set: { cut: rasters[rasters.length - 1].cut, rasters } };
      return held.set;
    };
    return { material, set, colour: material.colorNode as Vec3, rest };
  };
  const classDrape = drape(), zoneDrape = drape();
  built.lap('frameSetup');
  // ---------------------------------------------------------------- the far forest (stand patches, canopy surface)
  if (plan) {
    try {
      farForest = await buildFarForest({
        renderer, scene, plan, terrain, types, atlas, extraTypes: stand.extraTypes, snow: envr.snow, grade,
        receivedShadow: () => asReceivedShadow(envr.fadeShadow(treeShade)),
        drape: { colour: classDrape.colour, rest: classDrape.rest, vegetation: liveNanite.u.classColour },
        cover: masks.cover, viewYear: groundGrade.viewYear,
      });
      three.add(farForest.group);
      farForest.setLook(drawnEnvironment.look ?? 'via');
      state.farForest = farForest.stats;
    } catch (error) {
      console.error('far forest', error);
      state.farForestError = error instanceof Error ? error.message : String(error);
    }
  }
  built.lap('farForest');
  const waterClass = new THREE.MeshBasicNodeMaterial({ fog: false, side: THREE.DoubleSide });
  waterClass.colorNode = classWater;
  const waterMeshes = water ? water.group.children.filter((o): o is THREE.Mesh => o instanceof THREE.Mesh) : [];
  // each tree's stem (package x, y) in the instances' order, and whether it stands in water
  const stemXY = new Float32Array(stand.instances.a.length / 2);
  for (let k = 0; k < stemXY.length / 2; k++) (stemXY[k * 2] = stand.instances.a[k * 4]), (stemXY[k * 2 + 1] = -stand.instances.a[k * 4 + 2]);
  const waterRings = (scene.water ?? []).filter((w) => w?.rings?.[0]?.length >= 3).map((w) => {
    const xs = w.rings[0].map((q) => q[0]), ys = w.rings[0].map((q) => q[1]);
    return { rings: w.rings, box: [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)] };
  });
  const onWater = (x: number, y: number): boolean => waterRings.some(({ rings: [outer, ...holes], box }) =>
    x >= box[0] && y >= box[1] && x <= box[2] && y <= box[3] && inRing(x, y, outer) && !holes.some((hole) => inRing(x, y, hole)));
  const heightField = treeFields.indexOf('height');
  let maxTreeHeight: number | null = null;
  if (heightField >= 0) for (let i = 0; i < treeCount; i++) maxTreeHeight = Math.max(maxTreeHeight ?? 0, treeData[i * treeFields.length + heightField]);

  /**
   * The flat passes' switches: `screened` (the trees drawn), `ground` (the class layers on the bare terrain, the water
   * flat) or `zones` (the zone polygons on the bare terrain, no water); returns what puts them back.
   */
  const classMode = (pass: 'screened' | 'ground' | 'zones'): (() => void) => {
    const zones = pass === 'zones';
    const shown = (o: THREE.Object3D) => o === terrain.mesh || ((o === nanite.group || o === farForest?.group) && pass === 'screened') || (o === water?.group && !zones);
    const hidden = three.children.filter((o) => o.visible && !(o instanceof THREE.Light) && !shown(o));
    const was = {
      debug: nanite.u.debug.value, extinction: envr.extinction.value, sun: envr.sun.intensity, hemi: envr.hemi.intensity,
      terrain: terrain.mesh.material, water: waterMeshes.map((m) => m.material), clear: renderer.getClearColor(new THREE.Color()), alpha: renderer.getClearAlpha(),
    };
    for (const o of hidden) o.visible = false; // (sky, dome, debris, precipitation; the bare passes: the stand; the zone pass: the water)
    nanite.u.debug.value = CLASS_DEBUG;
    if (farForest) farForest.u.flat.value = 1;
    envr.extinction.value = 0; // (no haze)
    envr.sun.intensity = envr.hemi.intensity = 0; // (the trees' class colour is their emissive)
    terrain.mesh.material = zones ? zoneDrape.material : classDrape.material;
    for (const m of waterMeshes) m.material = waterClass;
    renderer.setClearColor(0x000000, 0);
    return () => {
      for (const o of hidden) o.visible = true;
      nanite.u.debug.value = was.debug;
      if (farForest) farForest.u.flat.value = 0;
      envr.extinction.value = was.extinction;
      envr.sun.intensity = was.sun;
      envr.hemi.intensity = was.hemi;
      terrain.mesh.material = was.terrain;
      waterMeshes.forEach((m, k) => (m.material = was.water[k]));
      renderer.setClearColor(was.clear, was.alpha);
    };
  };

  const settle = (): Promise<unknown> => Promise.race([device.queue.onSubmittedWorkDone(), new Promise((resolve) => setTimeout(resolve, 2000))]);
  const png = (rgba: Uint8ClampedArray<ArrayBuffer>, w: number, h: number): Promise<Blob> => {
    const canvas = new OffscreenCanvas(w, h);
    canvas.getContext('2d')!.putImageData(new ImageData(rgba, w, h), 0, 0);
    return canvas.convertToBlob({ type: 'image/png' });
  };
  const DEG = 180 / Math.PI;
  /** A flat pass's colour and depth from the scene target, read back. */
  const readFlat = async (w: number, h: number) => {
    const halfs = renderer.readRenderTargetPixelsAsync(sceneRT, 0, 0, w, h) as Promise<ArrayLike<number>>;
    const raw = backend.copyTextureToBuffer(sceneRT.depthTexture!, 0, 0, w, h, 0);
    return { halfs: await halfs, raw: await raw };
  };

  const captureFrame = async (position: [number, number, number], f: CaptureFrame, zones: boolean, imageFrames = IMAGE_FRAMES, warm = 0) => {
    const pose = pinholePose(position, f);
    camera.position.set(...pose.position);
    camera.up.set(...pose.up);
    camera.lookAt(...pose.target);
    camera.fov = pose.fov;
    camera.aspect = pose.aspect;
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld();
    const { width: w, height: h } = f;
    size.set(w, h);
    sceneRT.setSize(w, h);
    imageRT.setSize(w, h);
    taa.size = new THREE.Vector2(w, h);
    taa.reset = true;
    const tImage = performance.now();
    let time = 0;
    for (let i = 0; i < warm + imageFrames; i++) {
      if (i === warm && warm) taa.reset = true; // (the warm-up drew the lists and the HZB; the samples start here)
      time = (performance.now() - t1) / 1000;
      drawScene(time, true);
      rays.render(camera, w, h);
      taa.resolve(camera, still);
      await settle();
      progress.step();
    }
    renderer.setRenderTarget(imageRT);
    output.render();
    renderer.setRenderTarget(null);
    const image = await renderer.readRenderTargetPixelsAsync(imageRT, 0, 0, w, h);
    const tClass = performance.now();
    /** One flat pass (`draws`: frames drawn, the last read: a second takes occlusion from the first's depth). */
    const pass = async (mode: Parameters<typeof classMode>[0], draws: number) => {
      const restore = classMode(mode);
      try {
        for (let i = 0; i < draws; i++) {
          drawScene(time, false);
          await settle();
        }
        return await readFlat(w, h);
      } finally {
        restore();
      }
    };
    const flat = await pass('screened', 2);
    const tZone = performance.now();
    const ground = await pass('ground', 1);
    const zoneFlat = zones ? await pass('zones', 1) : null;
    const tRead = performance.now();
    const depth = linearDepth(flat.raw, w, h, camera.near, camera.far, paddedRow(w, 4, 4));
    const screened = classPixels(flat.halfs, w, h, depth, paddedRow(w, 8, 2));
    const bare = (f: Awaited<ReturnType<typeof readFlat>>) => classPixels(f.halfs, w, h, linearDepth(f.raw, w, h, camera.near, camera.far, paddedRow(w, 4, 4)), paddedRow(w, 8, 2));
    const classes = bare(ground);
    const zonePixels = zoneFlat ? bare(zoneFlat) : undefined;
    const rgba = unpadRows(image, w, h, 4, paddedRow(w, 4, 1), new Uint8ClampedArray(w * h * 4));
    const blob = await png(rgba, w, h);
    const dir = camera.getWorldDirection(new THREE.Vector3());
    const frame: CaptureReplyFrame = {
      width: w, height: h, image: blob, classes, screened, depth, ...(zonePixels ? { zones: zonePixels } : {}),
      camera: {
        position: [camera.position.x, -camera.position.z, camera.position.y],
        bearingDegrees: (Math.atan2(dir.x, -dir.z) * DEG + 360) % 360,
        pitchDegrees: Math.asin(Math.max(-1, Math.min(1, dir.y))) * DEG,
        horizontalFovDegrees: 2 * Math.atan(Math.tan(camera.fov / DEG / 2) * camera.aspect) * DEG,
        verticalFovDegrees: camera.fov,
        near: camera.near, far: camera.far,
      },
    };
    return { frame, timing: { imageMs: Math.round(tClass - tImage), screenedMs: Math.round(tZone - tClass), bareMs: Math.round(tRead - tZone), readMs: Math.round(performance.now() - tRead) } };
  };

  // ---------------------------------------------------------------- final (quality: 'final', final-stand.ts)
  // The request's stand at real density drawn in place of the package's stems where it reaches (a second Nanite
  // renderer, kept for the next capture of the same stand), the far forest hidden there, the canopy cut-off from the
  // request, the shadow map widened over the frame's near stand, the samples accumulated with the camera held.
  type FinalDrawing = { key: string; nanite: NaniteRenderer; stems: number; stemXY: Float32Array };
  let finalDrawing: FinalDrawing | null = null;
  const disposeGroup = (g: THREE.Object3D) => g.traverse((o) => {
    if (o instanceof THREE.Mesh) {
      o.geometry.dispose();
      (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => m.dispose());
    }
  });
  /**
   * A final stand's key: the content hash of all of it (every stem's every field) and the eye its stems are merged
   * round. The drawing is kept across captures and across the same package posted again, so nothing is sampled.
   */
  const standKey = (st: NonNullable<FinalOptions['stand']>, eyeXY: [number, number]): string =>
    contentHash({ fields: st.fields, species: st.species, count: st.count, radiusMeters: st.radiusMeters, bearings: st.bearings, eye: eyeXY, data: st.data });
  const finalStandDrawing = async (st: NonNullable<FinalOptions['stand']>, eyeXY: [number, number]): Promise<FinalDrawing> => {
    const tKey = performance.now();
    const key = standKey(st, eyeXY);
    timing.capture.standKey = Math.round((performance.now() - tKey) * 10) / 10;
    if (finalDrawing?.key === key) return finalDrawing;
    if (finalDrawing) disposeGroup(finalDrawing.nanite.group);
    finalDrawing = null;
    const made = stages();
    timing.finalStand = made.ms;
    const merged0 = mergeStems(plan ? plan.trees : scene.trees, st, eyeXY, (f, x, y) => (f === 'z' ? terrain.heightAt(x, -y) : f === 'tone' ? 0.5 : NaN));
    // (the stand's stems thinned by the cover as the package's are: what leaves the picture leaves the screened pass)
    made.lap('merge');
    const thinned = treeKeep ? thinStems(merged0, treeKeep) : { table: merged0, removed: 0 };
    made.lap('thin');
    // (and its stems on burnt ground stood dead, as the package's are)
    const merged = snagStems(thinned.table, covered.rasters, viewYear0, (name) => scene.species?.[name]?.crownRatio).table;
    made.lap('snags');
    state.finalCoverRemoved = thinned.removed;
    const grown = await buildStand({ ...scene, trees: placeholder({ fields: merged.fields, species: merged.species, count: merged.count, data: merged.data as unknown as number[] }) }, samples);
    made.lap('buildStand');
    const { nanite: n } = await naniteOf(grown, Math.max(9000, st.radiusMeters + 1500, liveNanite.u.maxDist.value), made);
    n.setDepthSource(sceneRT.depthTexture!, samples);
    const xy = new Float32Array(grown.instances.a.length / 2);
    for (let k = 0; k < xy.length / 2; k++) (xy[k * 2] = grown.instances.a[k * 4]), (xy[k * 2 + 1] = -grown.instances.a[k * 4 + 2]);
    finalDrawing = { key, nanite: n, stems: merged.count, stemXY: xy };
    made.lap('finish');
    return finalDrawing;
  };
  /** Draws `n` in place of the live stand (and back). */
  const swapStand = (n: NaniteRenderer): void => {
    if (n === nanite) return;
    three.remove(nanite.group);
    nanite = n;
    three.add(nanite.group);
    state.nanite = nanite;
  };
  const taaU = (taa as unknown as { u: { maxWeight: { value: number } } }).u;

  /** The capture being drawn (`again` waits for it: it holds the camera). */
  let capturing: Promise<unknown> | null = null;
  const captureNow = (request: CaptureRequest): Promise<CaptureReply> => {
    const run = captureOnce(request);
    const mine = (capturing = run.then(() => undefined, () => undefined).then(() => {
      if (capturing === mine) capturing = null;
    }));
    return run;
  };
  const captureOnce = async (request: CaptureRequest): Promise<CaptureReply> => {
    while (!disposed && state.frames < 3) await new Promise((resolve) => setTimeout(resolve, 50)); // (the first frames compile)
    if (disposed) throw new Error('The scene was replaced before the capture.');
    renderer.setAnimationLoop(null);
    await reading?.catch(() => undefined);
    const final = request.final;
    const took = stages();
    timing.capture = took.ms;
    progress.begin(request.frames.length, final ? FINAL_WARM + final.samples : IMAGE_FRAMES);
    const tFinal = performance.now();
    let finalReport: CaptureReply['final'] = null;
    if (final) {
      cutoffPx = final.canopyCutoffPx;
      if (final.stand && final.stand.count > 0) {
        const fd = await finalStandDrawing(final.stand, [request.position[0], request.position[1]]);
        swapStand(fd.nanite);
        farForest?.hide({ eye: [request.position[0], request.position[1]], radius: final.stand.radiusMeters, bearings: final.stand.bearings });
      }
      envr.setShadowHalf(FINAL_SHADOW_HALF);
      finalWater = true;
      setEnvironment(drawnEnvironment);
    }
    took.lap('finalStand');
    const saved = { position: camera.position.clone(), quaternion: camera.quaternion.clone(), up: camera.up.clone(), fov: camera.fov, aspect: camera.aspect, size: size.clone(), taaSize: taa.size, prepass: nanite.leafPrepass.mode, impMin: impMinPx.value, impExact: impExact.value, maxWeight: taaU.maxWeight.value };
    const { cut, rasters } = classDrape.set(request.classes.terrain, request.classes.layers);
    const zonesCut = request.zones ? zoneDrape.set(request.zones.terrain, request.zones.layers).cut : [];
    took.lap('classRasters');
    // a tree takes the class of the ground under its stem (a landform's own forest is the landform); only trees on
    // unlisted ground or in water screen, in the vegetation colour. Once a tree, its geometry and impostor alike.
    const tStems = performance.now();
    const stems = stemClasses({ stems: nanite === liveNanite ? stemXY : finalDrawing!.stemXY, rasters, terrain: request.classes.terrain, vegetation: request.classes.vegetation, layers: request.classes.layers, onWater });
    nanite.setInstanceClasses(stems.rgb);
    farForest?.setClasses({ rasters, terrain: request.classes.terrain, vegetation: request.classes.vegetation, layers: request.classes.layers, onWater });
    state.lastStemClasses = { counts: stems.counts, ms: Math.round(performance.now() - tStems) };
    classWater.value.copy(linear(request.classes.water));
    nanite.u.classColour.value.copy(linear(request.classes.vegetation));
    took.lap('stemClasses');
    const frames: CaptureReplyFrame[] = [], timings: CaptureReply['timings'] = [];
    // what the frames' surfaces stand on, sampled every 4th pixel of the class pass's depth
    const seen: SeenGround = { drawn: 0, invented: 0, filled: 0, far: 0, beyondTrees: 0 };
    const [ex, ey] = request.position;
    const reach = treeReach(ex, ey);
    try {
      nanite.leafPrepass.mode = false; // (its depth pass dithers as the picture does; the picture is the same without it)
      impExact.value = 1; // (every impostor at its own size: none thinned, none dropped)
      impMinPx.value = 0.01;
      if (final) taaU.maxWeight.value = Math.max(1, final.samples - 1); // (a running mean of the samples, the camera held)
      for (const f of request.frames) {
        const { frame: drawnFrame, timing } = final
          ? await captureFrame(request.position, f, !!request.zones, final.samples, FINAL_WARM)
          : await captureFrame(request.position, f, !!request.zones);
        frames.push(drawnFrame);
        timings.push(timing);
        framePoints(request.position, f, drawnFrame.depth, 4, (x, y) => {
          seen.drawn++;
          const source = terrain.ground.sourceAt(x, y);
          if (source === 'invented') seen.invented++;
          else if (source === 'filled') seen.filled++;
          else if (source === 'farTerrain') seen.far++;
          if (reach === null || Math.hypot(x - ex, y - ey) > reach) seen.beyondTrees++;
        });
      }
    } finally {
      camera.position.copy(saved.position);
      camera.quaternion.copy(saved.quaternion);
      camera.up.copy(saved.up);
      camera.fov = saved.fov;
      camera.aspect = saved.aspect;
      camera.updateProjectionMatrix();
      camera.updateMatrixWorld();
      size.copy(saved.size);
      sceneRT.setSize(size.x, size.y);
      taa.size = saved.taaSize;
      taa.reset = true;
      nanite.leafPrepass.mode = saved.prepass;
      impExact.value = saved.impExact;
      impMinPx.value = saved.impMin;
      nanite.setInstanceClasses(null);
      farForest?.setClasses(null);
      taaU.maxWeight.value = saved.maxWeight;
      if (final) {
        finalReport = { samples: final.samples, stems: nanite === liveNanite ? stand.instances.a.length / 4 : finalDrawing!.stems, canopyCutoffMeters: farForest ? Math.round(farForest.cutoff()) : null, millis: Math.round(performance.now() - tFinal) };
        swapStand(liveNanite);
        farForest?.hide(null);
        envr.setShadowHalf(null);
        cutoffPx = undefined;
        finalWater = false;
        setEnvironment(drawnEnvironment);
      }
      if (!disposed) renderer.setAnimationLoop(frame);
      took.lap('frames');
    }
    const outer = terrain.ground.outer;
    const { missing, missingDetail } = captureMissing({
      seen,
      realGroundMeters: Math.max(0, Math.min(ex - outer.west, outer.east - ex, ey - outer.south, outer.north - ey)),
      farTerrain: !!terrain.farBounds,
      skylineTerrain: !!terrain.skylineBounds,
      treeReachMeters: reach,
      stems: treeCount,
      cut,
      zonesCut,
    });
    return {
      type: 'pgmaps-engine-capture', engine: ENGINE, id: request.id, version: VERSION, frames,
      scene: { createdAt: createdAt ?? null, origin: origin ?? null },
      environment: { ...drawnEnvironment, ...envr.skyReport(), sun: sunReport },
      maxTreeHeightMeters: maxTreeHeight,
      missing, missingDetail,
      stemClasses: stems.counts,
      timings,
      final: finalReport,
    };
  };
  state.capture = (request: unknown) => capture(request);
  /** A synthetic real-density stand over a request's frames (testing a final capture without PGMaps): `&standRadius=` m (6500). */
  state.syntheticStand = (req: { position: number[]; frames: Array<{ bearingDegrees: number; horizontalFovDegrees: number }> }, perHectare = 700) => {
    const from = Math.min(...req.frames.map((f) => f.bearingDegrees - f.horizontalFovDegrees / 2 - 2));
    const to = Math.max(...req.frames.map((f) => f.bearingDegrees + f.horizontalFovDegrees / 2 + 2));
    return syntheticStand(scene.trees, [req.position[0], req.position[1]], Number(params.get('standRadius') ?? 6500), [from, to], perHectare);
  };

  renderer.setAnimationLoop(frame);

  return {
    setEye,
    setEnvironment,
    capture: captureNow,
    sameAs: (next, env) => {
      // (the year a build would take now: the environment's instant, else the copy's own stamp; neither: the clock,
      // never the same twice)
      const year = yearFrom(env, next.createdAt);
      return year !== null && year === viewYear0 && (env.look ?? 'via') === (env0.look ?? 'via');
    },
    again: async (next) => {
      await capturing;
      createdAt = next.createdAt;
      setEye(next.camera);
      taa.reset = true;
      state.reused = (typeof state.reused === 'number' ? state.reused : 0) + 1;
      readyDue = true;
    },
    teardown: async () => {
      disposed = true;
      renderer.setAnimationLoop(null);
      await reading?.catch(() => undefined);
      unlistenResize();
      controls.dispose();
      // (destroys the WebGPU device this renderer made: every buffer, texture and pipeline of this package with it)
      await renderer.dispose();
      host.unmount(renderer.domElement);
    },
  };
}

// ---------------------------------------------------------------- &captureTest: a capture without a parent
/** PNG object URLs to look at a reply with: the picture, the class pass, depth (log-scaled grey, sky black) and the class pass's edges over the picture. */
async function captureUrls(reply: CaptureReply): Promise<Array<Record<string, string>>> {
  const toUrl = async (rgba: Uint8ClampedArray<ArrayBuffer>, w: number, h: number): Promise<string> => {
    const canvas = new OffscreenCanvas(w, h);
    canvas.getContext('2d')!.putImageData(new ImageData(rgba, w, h), 0, 0);
    return URL.createObjectURL(await canvas.convertToBlob({ type: 'image/png' }));
  };
  return Promise.all(reply.frames.map(async (f) => {
    const { width: w, height: h, depth, classes } = f;
    const grey = new Uint8ClampedArray(w * h * 4);
    let far = 0;
    for (const d of depth) far = Math.max(far, d);
    for (let i = 0; i < w * h; i++) {
      const v = depth[i] > 0 ? 255 - (230 * Math.log(1 + depth[i])) / Math.log(1 + far) : 0;
      grey.set([v, v, v, 255], i * 4);
    }
    const bitmap = await createImageBitmap(f.image);
    const canvas = new OffscreenCanvas(w, h), g = canvas.getContext('2d')!;
    g.drawImage(bitmap, 0, 0);
    const over = g.getImageData(0, 0, w, h);
    const key = (i: number) => (classes[i * 4] << 16) | (classes[i * 4 + 1] << 8) | classes[i * 4 + 2] | (classes[i * 4 + 3] ? 1 << 24 : 0);
    for (let y = 0; y < h; y++)
      for (let x = 0; x < w; x++) {
        const i = y * w + x;
        if ((x + 1 < w && key(i) !== key(i + 1)) || (y + 1 < h && key(i) !== key(i + w))) over.data.set([255, 0, 255, 255], i * 4);
      }
    return {
      image: URL.createObjectURL(f.image),
      classes: await toUrl(new Uint8ClampedArray(classes), w, h),
      depth: await toUrl(grey, w, h),
      overlay: await toUrl(over.data, w, h),
    };
  }));
}

/** The package's own view, one 960 x 540 frame at 60 degrees across, and a 200 m square class layer (`&captureAhead=` m ahead, 150). */
async function captureTest(): Promise<void> {
  while (!(current && currentScene && (globalThis as unknown as { pgmaps?: { ready?: boolean } }).pgmaps?.ready)) await new Promise((resolve) => setTimeout(resolve, 250));
  const eye = currentScene.camera;
  const b = (eye.bearingDegrees * Math.PI) / 180;
  const ahead = Number(params.get('captureAhead') ?? 150); // (its near edge 50 m out: on open ground in the sample packages, the stand over its far part)
  const cx = eye.position[0] + Math.sin(b) * ahead, cy = eye.position[1] + Math.cos(b) * ahead;
  const square: Array<[number, number]> = [[cx - 100, cy - 100], [cx + 100, cy - 100], [cx + 100, cy + 100], [cx - 100, cy + 100]];
  const width = 960, height = 540, hfov = 60;
  const request = {
    type: 'pgmaps-capture', id: `capture-test-${Date.now().toString(36)}`, position: eye.position,
    frames: [{ bearingDegrees: eye.bearingDegrees, pitchDegrees: eye.pitchDegrees, horizontalFovDegrees: hfov, verticalFovDegrees: (2 * Math.atan(Math.tan((hfov * Math.PI) / 360) * (height / width)) * 180) / Math.PI, width, height }],
    classes: { terrain: [96, 96, 96], layers: [{ id: 'test-square', rgb: [0, 90, 255], polygons: [[square]] }], vegetation: [255, 255, 255], water: [255, 128, 0] },
  };
  try {
    const reply = await capture(request);
    const urls = await captureUrls(reply);
    Object.assign((globalThis as unknown as { pgmaps: Record<string, unknown> }).pgmaps, { lastCaptureRequest: request, lastCapture: reply, captureUrls: urls });
    console.info('captureTest', reply.timings, urls);
  } catch (error) {
    console.error(error);
    Object.assign((globalThis as unknown as { pgmaps: Record<string, unknown> }).pgmaps, { lastCaptureError: error instanceof Error ? error.message : String(error) });
  }
}
if (params.has('captureTest')) void captureTest();
host.expose({ pgmapsCaptureUrls: captureUrls });

if (params.has('scene') || !embedded) loadScene().then(show, fail);
else {
  host.status('waiting for a scene from the parent page');
  toParent({ type: 'pgmaps-engine-hello', accepts: [...ACCEPTS] });
}

