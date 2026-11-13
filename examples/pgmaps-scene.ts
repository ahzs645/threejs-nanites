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
//
// The postMessage bridge (postMessage(data, '*'); a local trial):
//   out { type: 'pgmaps-engine-hello', engine: 'nanite' }   loaded in a frame with no ?scene: send the package
//   in  { type: 'pgmaps-scene', scene }   a package to draw. A later one tears the drawing down (its WebGPU device
//                                          destroyed, so nothing leaks) and builds the new one in the same page.
//   in  { type: 'pgmaps-camera', position: [x, y, z], bearingDegrees, pitchDegrees, verticalFovDegrees }
//                                          the eye in the frame of the latest package sent (local metres, z up). One
//                                          that arrives while a package builds is kept, the latest, and applied after.
//   in  { type: 'pgmaps-environment', dateTime, latitude, longitude, ground: 'bare' | 'snow', weather: 'clear' |
//         'overcast' | 'rain' | 'snow' }   before or after a package; the latest is kept for every later build and
//                                          applied without rebuilding (the sun from the date and place).
//   out { type: 'pgmaps-engine-ready', engine: 'nanite' }   the first frame of a (new) package is drawn
//   out { type: 'pgmaps-engine-stats', engine: 'nanite', drawn, fps, clusters, impostors, splats, stems }  about 1 s
//   out { type: 'pgmaps-engine-error', engine: 'nanite', message }
//
// The package is local metres: x east, y north, z up (heights absolute). Here y is up and north is -z.
import * as THREE from 'three/webgpu';
import { attribute, float, vec3, vec4, smoothstep, mix, hash, clamp, dot } from 'three/tsl';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import {
  NaniteRenderer, createAtlas, bakeImpostors, impostorCoverage, makeLeafAlpha, defaultLook, asReceivedShadow, mipBias,
  IMPOSTOR_CUT, PHASE2_LAYER, type NaniteLook, type Float, type Vec3,
} from '../src/nanite-lib/index.ts';
import { TAA } from '../src/taa.ts';
import { GodRays } from '../src/godrays.ts';
import { detailPos } from '../src/planet.ts';
import { reliefSteps } from '../src/ground/relief.ts';
import { buildStand } from './pgmaps/trees.ts';
import { buildTerrain, buildMasks } from './pgmaps/terrain.ts';
import { floorMaterial } from './pgmaps/floor.ts';
import { buildDebris } from './pgmaps/debris.ts';
import { buildWater } from './pgmaps/water.ts';
import { createEnvironment } from './pgmaps/environment.ts';
import { createParticles } from './pgmaps/particles.ts';
import { DEFAULT_ENVIRONMENT, environmentFromUrl, parseEnvironment, type Environment, type ScenePackage } from './pgmaps/package.ts';

const info = document.getElementById('info')!;
const params = new URLSearchParams(location.search);
const ENGINE = 'nanite';
const embedded = window.parent !== window;
if (params.has('embed')) info.hidden = true;
const toParent = (message: Record<string, unknown>): void => {
  if (embedded) window.parent.postMessage({ engine: ENGINE, ...message }, '*');
};

type CameraMessage = { position: [number, number, number]; bearingDegrees: number; pitchDegrees: number; verticalFovDegrees?: number };
type Drawing = { setEye: (eye: CameraMessage) => void; setEnvironment: (env: Environment) => void; teardown: () => Promise<void> };
/** What is drawn now, the package waiting behind a build, the parent's latest eye (in the latest package's frame) and environment. */
let current: Drawing | null = null;
let building = false;
let queued: ScenePackage | null = null;
let latestCamera: CameraMessage | null = null;
let latestEnvironment: Environment = environmentFromUrl(params) ?? DEFAULT_ENVIRONMENT;

/** Draw `scene`, after tearing down what is drawn. Packages that arrive during a build wait; only the latest is built. */
async function show(scene: ScenePackage): Promise<void> {
  if (building) {
    queued = scene;
    return;
  }
  building = true;
  try {
    if (current) await current.teardown();
    current = null;
    current = await build(scene, latestEnvironment);
    current.setEnvironment(latestEnvironment); // (one that came during the build)
    if (latestCamera) current.setEye(latestCamera);
  } catch (error) {
    console.error(error);
    fail(error);
  } finally {
    building = false;
    const next = queued;
    queued = null;
    if (next) void show(next);
  }
}

function fail(error: unknown): void {
  const message = error instanceof Error ? error.message : String(error);
  info.textContent = `failed: ${message}`;
  Object.assign(window, { pgmaps: { ready: true, error: message } });
  toParent({ type: 'pgmaps-engine-error', message });
}

addEventListener('message', (event: MessageEvent) => {
  const data = event.data as { type?: string; scene?: ScenePackage } & Partial<CameraMessage> & Record<string, unknown>;
  if (data?.type === 'pgmaps-scene' && data.scene) {
    latestCamera = null; // (an eye sent before belongs to the previous package's frame)
    void show(data.scene);
  } else if (data?.type === 'pgmaps-camera' && Array.isArray(data.position)) {
    latestCamera = data as CameraMessage;
    if (current && !building) current.setEye(latestCamera);
  } else if (data?.type === 'pgmaps-environment') {
    const env = parseEnvironment(data);
    if (!env) return;
    latestEnvironment = env;
    if (current && !building) current.setEnvironment(env);
  }
});

async function loadScene(): Promise<ScenePackage> {
  const url = params.get('scene');
  if (url) return (await fetch(url)).json();
  info.textContent = 'choose a PGMaps scene package (forestry-scene-package.json)';
  const input = document.getElementById('file') as HTMLInputElement;
  input.hidden = false;
  return new Promise((resolve) => {
    input.onchange = async () => resolve(JSON.parse(await input.files![0].text()));
  });
}

/**
 * The stand's look in the library's hooks: per-stem brightness (a hash and the package's tone, b.w), and snow dusting
 * the crowns when the ground is snowy. No wind: the stand stands still (the parent compares frames, and the water's
 * reflection renders the stand without the scene target's motion output, which a wind's MRT output would need).
 */
function standLook(snow: THREE.UniformNode<'float', number>): NaniteLook {
  const dusted = (c: Vec3): Vec3 => mix(c, vec3(0.78, 0.81, 0.86).mul(dot(c, vec3(0.3, 0.59, 0.11)).mul(2).add(0.55)), snow.mul(0.2));
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
  const renderer = new THREE.WebGPURenderer({ antialias: false, powerPreference: 'high-performance' });
  await renderer.init();
  if (!(renderer.backend as unknown as { isWebGPUBackend?: boolean }).isWebGPUBackend) throw new Error('this example needs WebGPU (compute)');
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.setSize(innerWidth, innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  document.body.appendChild(renderer.domElement);
  if (embedded || params.has('embed')) renderer.domElement.style.pointerEvents = 'none';

  const three = new THREE.Scene();
  const { camera: eye } = scene;
  const camera = new THREE.PerspectiveCamera(eye.verticalFovDegrees, innerWidth / innerHeight, 0.3, 30000);
  const controls = new OrbitControls(camera as never, renderer.domElement);
  controls.enabled = !params.has('embed'); // (embedded, the parent drives the camera)
  /** The package's eye (local metres, z up, bearing clockwise from north) as the camera and the orbit's target. */
  const setEye = (e: CameraMessage): void => {
    const b = THREE.MathUtils.degToRad(e.bearingDegrees), p = THREE.MathUtils.degToRad(e.pitchDegrees);
    camera.position.set(e.position[0], e.position[2], -e.position[1]);
    if (e.verticalFovDegrees) camera.fov = e.verticalFovDegrees;
    camera.updateProjectionMatrix();
    controls.target.copy(camera.position).add(new THREE.Vector3(Math.sin(b) * Math.cos(p), Math.sin(p), -Math.cos(b) * Math.cos(p)).multiplyScalar(100));
    controls.update();
  };
  setEye(eye);

  // ---------------------------------------------------------------- ground, sky, light
  const terrain = buildTerrain(scene);
  const envr = createEnvironment(three, terrain.heightAt);
  const masks = buildMasks(scene, terrain.bounds);
  const samples = 1; // (TAA: leaves by coverage against a moving dither; see src/webgpu-start.ts)
  const [floor, stand] = await Promise.all([floorMaterial({ masks, snow: envr.snow, wet: envr.wet, fadeShadow: (far) => envr.fadeShadow(far) }), buildStand(scene, samples)]);
  terrain.mesh.material = floor;
  terrain.mesh.renderOrder = 1; // (after the trees: what they hide is rejected before the floor's shader)
  three.add(terrain.mesh);
  const debris = await buildDebris(scene, terrain.heightAt, envr.snow);
  if (debris) three.add(debris);
  const water = buildWater(scene, terrain.waterLevels, { sunDir: envr.lightDir, sunColour: envr.sun.color });
  if (water) three.add(water.group);
  const particles = createParticles();
  three.add(particles.mesh);

  // ---------------------------------------------------------------- the stand
  const look = standLook(envr.snow);
  const { types, instances, textures } = stand;
  const nanite = new NaniteRenderer(renderer, types, instances, textures, look);
  nanite.u.maxDist.value = 9000;
  nanite.u.tau.value = Number(params.get('tau') ?? 2); // (px of error: at 1 the stand's lists overflowed into 17-35 ms frames on an M4 Pro, at 2 ~5.5 ms)
  const treeShade = float(0.4); // (past the shadow map, the crowns' average self-shade)
  nanite.group.traverse((o) => {
    if (o instanceof THREE.Mesh && !o.castShadow) (o.material as THREE.NodeMaterial).receivedShadowNode = asReceivedShadow(envr.fadeShadow(treeShade));
  });
  const fog = (pos: Vec3, viewZ: Float) => ({ color: envr.fogColour(pos), factor: smoothstep(envr.fogNear, envr.fogFar, viewZ) });
  nanite.group.add(nanite.sw.buildResolveMesh({ fadeShadow: (pos: Vec3) => envr.fadeShadow(treeShade, pos), fog }));
  const atlas = createAtlas(types.length);
  const impostors = nanite.buildImpostorMesh(atlas, types.map(() => ({ side: [1, 1, 1] as [number, number, number], top: [1, 1, 1] as [number, number, number] })));
  impostors.receiveShadow = true;
  (impostors.material as THREE.NodeMaterial).receivedShadowNode = asReceivedShadow(envr.fadeShadow(treeShade));
  nanite.group.add(impostors, nanite.splats.build(atlas, { fadeShadow: (pos: Vec3) => envr.fadeShadow(treeShade, pos), shadow: (pos: Vec3) => envr.fadeShadow(treeShade, pos), fog }), nanite.buildImpostorShadowMesh(atlas));
  bakeImpostors(renderer, atlas, types, { bark: textures.bark, leaf: textures.leaf, barkLayers: stand.barkLayers, leafLayers: stand.leafLayers, leafAlpha: makeLeafAlpha(textures.leaf, attribute('uv', 'vec2')) }, look, nanite.u.impostorPx.value);
  await impostorCoverage(renderer, atlas, IMPOSTOR_CUT);
  nanite.impostorsBaked(atlas, types.map(() => [1, 1] as [number, number]));
  nanite.splats.enabled.value = 1;
  three.add(nanite.group);

  // ---------------------------------------------------------------- the frame: the demo's targets and passes
  const sceneRT = new THREE.RenderTarget(1, 1, { type: THREE.HalfFloatType, samples, depthBuffer: true });
  sceneRT.depthTexture = new THREE.DepthTexture(1, 1, THREE.FloatType);
  nanite.setDepthSource(sceneRT.depthTexture, samples);
  const rays = new GodRays(renderer, sceneRT.depthTexture, envr.sunDir, { enabled: params.get('rays') !== '0' });
  const taa = new TAA(renderer, sceneRT, samples, { enabled: params.get('taa') !== '0', extra: rays.at });
  const output = new THREE.RenderPipeline(renderer, vec4(taa.displayNode, 1));
  const size = new THREE.Vector2();
  const resize = (): void => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
    renderer.getDrawingBufferSize(size);
    sceneRT.setSize(size.x, size.y);
  };
  addEventListener('resize', resize);
  resize();

  const setEnvironment = (env: Environment): void => {
    const sun = envr.apply(env, scene.origin);
    particles.set(env.weather === 'rain' || env.weather === 'snow' ? env.weather : null);
    water?.update();
    state.environment = { ...env, sunElevation: +sun.elevation.toFixed(2), sunAzimuth: +sun.azimuth.toFixed(2) };
  };

  const still = new THREE.Vector3(); // (the TAA's planet drop: none here)
  let lastStats = 0, lastPost = 0, disposed = false;
  /** The stats readback in flight: teardown waits for it, since destroying the device aborts its mapAsync. */
  let reading: Promise<unknown> | null = null;
  let fps = 0, lastFrame = performance.now();
  const state: Record<string, unknown> & { frames: number; ready: boolean } = {
    frames: 0, nanite, camera, controls, scene: three, ready: false, residual: stand.residual, buildMs: 0, environment: null,
    debug: { envr, rays, taa, terrain, reliefSteps, noShadows: false, noRays: false },
  };
  Object.assign(window, { pgmaps: state });
  setEnvironment(env0);
  const t1 = performance.now();
  const frame = (): void => {
    state.frames++;
    const now = performance.now();
    fps = fps ? fps * 0.9 + (1000 / Math.max(1, now - lastFrame)) * 0.1 : 60;
    lastFrame = now;
    const time = (now - t1) / 1000;
    controls.update();
    camera.updateMatrixWorld();
    look.viewer.copy(camera.position);
    detailPos.value.copy(camera.position); // (the floor's relief fades from the eye)
    particles.update(time, camera.position);
    const debug = state.debug as { noShadows: boolean; noRays: boolean };
    const castShadows = envr.frame(renderer, camera, !debug.noShadows);
    rays.enabled = params.get('rays') !== '0' && envr.raysOn() && !debug.noRays;
    taa.jitter(camera, size.x, size.y);
    mipBias.value = 0;
    // the software rasterizer and its splats only from high up, as the demo's (src/webgpu-frame.ts: from 2 km, down to
    // 70% of it): near the ground its tiny leaf clusters, dithered, came out as pale specks on the crowns' tips
    const altitude = camera.position.y - terrain.heightAt(camera.position.x, camera.position.z);
    nanite.sw.idle = nanite.splats.idle = altitude < (nanite.sw.idle ? 2000 : 1400);
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
    rays.render(camera, size.x, size.y);
    taa.resolve(camera, still);
    renderer.setRenderTarget(null);
    output.render();
    if (state.frames === 1) {
      state.buildMs = Math.round(performance.now() - t0);
      toParent({ type: 'pgmaps-engine-ready' });
    }
    if (time - lastStats > 0.5 && !reading) {
      lastStats = time;
      reading = nanite.readStats().then((s) => {
        reading = null;
        if (!s || disposed) return;
        info.textContent = `${scene.trees.count.toLocaleString()} stems, ${types.length} tree types (${stand.residual.lines.length - types.length} species)\n` +
          `drawn: ${s.instances.toLocaleString()} as clusters, ${s.impostors.toLocaleString()} impostors, ${(s.splats ?? 0).toLocaleString()} splats\n` +
          `crown width off by ${(stand.residual.mean * 100).toFixed(1)}% mean, ${(stand.residual.p90 * 100).toFixed(1)}% p90`;
        state.ready = state.frames > 10;
        if (time - lastPost >= 1) {
          lastPost = time;
          toParent({
            type: 'pgmaps-engine-stats', drawn: s.instances + s.impostors, fps: Math.round(fps),
            clusters: s.instances, impostors: s.impostors, splats: s.splats ?? 0, stems: scene.trees.count,
          });
        }
      }, () => (reading = null));
    }
  };
  renderer.setAnimationLoop(frame);

  return {
    setEye,
    setEnvironment,
    teardown: async () => {
      disposed = true;
      renderer.setAnimationLoop(null);
      await reading?.catch(() => undefined);
      removeEventListener('resize', resize);
      controls.dispose();
      // (destroys the WebGPU device this renderer made: every buffer, texture and pipeline of this package with it)
      await renderer.dispose();
      renderer.domElement.remove();
    },
  };
}

if (params.has('scene') || !embedded) loadScene().then(show, fail);
else {
  info.textContent = 'waiting for a scene from the parent page';
  toParent({ type: 'pgmaps-engine-hello' });
}

