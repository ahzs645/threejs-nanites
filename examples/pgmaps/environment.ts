// The sky, fog, sun and shadow map, set by the parent's environment (package.ts): the sun placed from the date and
// place (below the horizon: a dim dusk, never black), its light held 6 degrees up under `sun: 'daylight'` (the
// default) or from the real sun under `sun: 'true'` (none, and no shadows, once it has set); clear (the demo's sky,
// sun shadows, god rays), overcast (a grey sky, no hard shadows, flat light) or rain / snow (overcast, nearer fog and falling particles, particles.ts).
// The parent's `cloudCover` is the share of the clear sky drawn under cloud (sky-cover.ts finds the SkyMesh coverage
// that draws it; 0 none), and its `visibilityKm` the haze: Koschmieder's law, every surface blended towards the
// horizon sky's colour in its direction by 1 − exp(−σ d), σ = 3.912 / visibility; 1000 km or more, no haze at all. Changing the environment never rebuilds the drawing: only uniforms, the
// lights and a new sky capture.
import * as THREE from 'three/webgpu';
import {
  Fn, float, max, abs, mix, positionWorld, cameraPosition, cubeTexture, fog, smoothstep, uniform,
  vec3, vec4, positionLocal, exp, length, dot, min,
} from 'three/tsl';
import { SkyMesh } from 'three/addons/objects/SkyMesh.js';
import { PHASE2_LAYER, type Float, type Vec3 } from '../../src/nanite-lib/index.ts';
import { sunFor, type Environment, type ScenePackage } from './package.ts';
import { cloudParamsForShare, extinctionPerMeter, skyCloudShare } from './sky-cover.ts';

const SKY_SCALE = 18000;

/** The sun as computed and as drawn (degrees, to 0.1): the stats message's `sun`. */
export interface SunReport { elevation: number; azimuth: number; drawnElevation: number; drawnAzimuth: number; exposure: number; mode: 'true' | 'daylight' }
/** The shadow map: its side (texels) and half-extent across the sun (m), in front of the eye. */
const params = new URLSearchParams(location.search);
const SHADOW_SIZE = Number(params.get('smap') ?? 4096), SHADOW_HALF = Number(params.get('shalf') ?? 220);
/** Over this the stands' shadow can reach above the ground (m: the tallest stems, ~35 m, and some relief). */
const RISE = 60;

/** `visibilityKm`: the weather's own haze when the parent sends none. */
interface Look { sky: 'clear' | 'grey'; grey: THREE.Color; sun: number; hemi: number; shadows: boolean; visibilityKm: number; exposure: number; rays: boolean }
const WEATHER: Record<Environment['weather'], Look> = {
  clear: { sky: 'clear', grey: new THREE.Color(0.62, 0.66, 0.7), sun: 3.2, hemi: 1.3, shadows: true, visibilityKm: 50, exposure: 0.9, rays: true },
  overcast: { sky: 'grey', grey: new THREE.Color(0.58, 0.61, 0.64), sun: 0.35, hemi: 2.5, shadows: false, visibilityKm: 25, exposure: 1.0, rays: false },
  rain: { sky: 'grey', grey: new THREE.Color(0.42, 0.45, 0.48), sun: 0.2, hemi: 2.3, shadows: false, visibilityKm: 8, exposure: 1.05, rays: false },
  snow: { sky: 'grey', grey: new THREE.Color(0.7, 0.72, 0.75), sun: 0.25, hemi: 2.6, shadows: false, visibilityKm: 3, exposure: 1.0, rays: false },
};
/** The clear sky's cloud with no `cloudCover` from the parent: SkyMesh's coverage as the adapter always drew it. */
const DEFAULT_COVERAGE = 0.18;
/** A visibility at or past this (km) is no haze at all (PGMaps' `NO_HAZE_KM`). */
export const NO_HAZE_KM = 1000;
/** At or over this share the clear sky is drawn as the overcast dome (SkyMesh's cloud never closes completely). */
const DOME_SHARE = 0.97;

/** The sky as applied: the parent's cloud share and visibility, and SkyMesh's settings that draw them. */
export interface SkyReport { cloudCover: number; visibilityKm: number; skyCoverage: number; skyDensity: number; dome: boolean; haze: boolean }

/**
 * `reach`: how far from the origin real ground lies (m; a capture's skyline grid, up to ~85 km at its corners). The sky
 * is a sphere round the origin drawn after the ground, so it must lie past that or it covers the far ridges.
 */
export function createEnvironment(scene: THREE.Scene, heightAt: (x: number, z: number) => number, reach = 0) {
  const skyScale = Math.max(SKY_SCALE, reach);
  // the sky: the demo's (three's SkyMesh) under a clear sky, a grey dome under cloud
  const sky = new SkyMesh();
  sky.scale.setScalar(skyScale);
  sky.turbidity.value = 2.4;
  sky.rayleigh.value = 1.6;
  sky.mieCoefficient.value = 0.003;
  sky.mieDirectionalG.value = 0.78;
  sky.cloudCoverage.value = 0.18;
  sky.cloudSpeed.value = 0; // (still: the parent's frames are compared)
  sky.material.fog = false;
  sky.renderOrder = 2;
  const greyTop = uniform(new THREE.Color(0.5, 0.53, 0.56)), greyHorizon = uniform(new THREE.Color(0.62, 0.65, 0.68));
  const domeMaterial = new THREE.MeshBasicNodeMaterial({ side: THREE.BackSide, depthWrite: false, fog: false });
  domeMaterial.colorNode = mix(greyHorizon, greyTop, smoothstep(-0.05, 0.6, positionLocal.normalize().y));
  const dome = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 16), domeMaterial);
  dome.scale.setScalar(skyScale * 0.98);
  dome.renderOrder = 2;
  dome.frustumCulled = false;
  scene.add(sky, dome);

  // the fog's colour: a small cube capture of the sky, looked up in the view direction (below the horizon, the horizon)
  const capture = new THREE.Scene();
  const sky2 = new SkyMesh();
  for (const k of ['turbidity', 'rayleigh', 'mieCoefficient', 'mieDirectionalG', 'cloudCoverage', 'cloudSpeed'] as const) sky2[k].value = sky[k].value;
  sky2.scale.setScalar(100);
  const dome2 = new THREE.Mesh(dome.geometry, domeMaterial);
  dome2.scale.setScalar(98);
  capture.add(sky2, dome2);
  const cube = new THREE.CubeRenderTarget(64, { type: THREE.HalfFloatType, generateMipmaps: true, minFilter: THREE.LinearMipmapLinearFilter });
  const cubeCam = new THREE.CubeCamera(1, 1000, cube);
  /** Koschmieder's extinction (per metre); 0: no haze (the class pass). */
  const extinction = uniform(extinctionPerMeter(50));
  /**
   * The airlight's brightest: a white surface's radiance under the scene's sun and sky light. SkyMesh draws its sky in
   * its own units, about a hundred times a lit forest (the picture clips it white); blended toward that, 3% of haze
   * at 400 m turned the far shore pale. Capped here, a forest is about a twentieth of the horizon, as in daylight.
   */
  const airlight = uniform(1.2);
  /** The horizon sky's colour in the direction of `pos` from the eye (its luminance capped at `airlight`). */
  const fogColour = (pos: Vec3): Vec3 => {
    const d = pos.sub(cameraPosition);
    const c = cubeTexture(cube.texture, vec3(d.x, length(d.xz).mul(0.02).add(1e-3), d.z).normalize()).level(float(2)).rgb;
    const lum = max(dot(c, vec3(0.2126, 0.7152, 0.0722)), 1e-4);
    return c.mul(min(float(1), airlight.div(lum)));
  };
  /** Where the haze starts (m): the VIA look's renders draw none to about 8 km, a photo's from the eye. */
  const hazeStart = uniform(0);
  /** The share of the way to the horizon sky a surface at `pos` is drawn: 1 − exp(−σ max(0, d − start)). */
  const fogFactor = (pos: Vec3): Float => float(1).sub(exp(extinction.negate().mul(max(length(pos.sub(cameraPosition)).sub(hazeStart), 0))));
  scene.fogNode = fog(fogColour(positionWorld), fogFactor(positionWorld));

  // lights: sky and ground bounce, and the sun with the shadow map (its casters, the stand's shadow meshes, on layer 1)
  const hemi = new THREE.HemisphereLight(0xbcd3ec, 0x4a4632, 1.3);
  const sun = new THREE.DirectionalLight(0xfff1dc, 3.2);
  sun.castShadow = true;
  sun.shadow.mapSize.set(SHADOW_SIZE, SHADOW_SIZE);
  sun.shadow.camera.layers.set(1);
  for (const l of [hemi, sun]) l.layers.enable(PHASE2_LAYER);
  scene.add(hemi, sun, sun.target);

  /** Towards the sun as the sky draws it, and as the light comes (under 'daylight', held a few degrees up at dusk: no
   * grazing shadows; under 'true', the real sun, below the horizon too, when the light is off). */
  const sunDir = new THREE.Vector3(0, 1, 0), lightDir = new THREE.Vector3(0, 1, 0);
  const snow = uniform(0); // (the ground's and the crowns' snow: floor.ts, the stand's look)
  const wet = uniform(0); // (rain: the ground darker and glossier)
  const shadowOn = uniform(1); // (0: receivers see no shadow, the far average neither)
  let look = WEATHER.clear, castShadows = true;

  // Past the shadow map the receivers fade to an average shadow (the demo's makeFadeShadow): `far` for the ground
  // under canopy, a constant canopy self-shade for the trees.
  const shadowMatrix = uniform(sun.shadow.matrix);
  const fadeShadow = (far: Float, pos: Vec3 = positionWorld) => Fn(([shadow]: [Float]) => {
    const c = shadowMatrix.mul(vec4(pos, 1)).xy;
    const edge = max(abs(c.x.sub(0.5)), abs(c.y.sub(0.5))).mul(2);
    return mix(mix(float(1), shadow, shadowOn), mix(float(1), far, shadowOn), smoothstep(0.75, 0.97, edge));
  });

  let SH = 0, SV = 0;
  /** The shadow map's half-extent in front of the eye (m): a final capture widens it over the frame's near stand. */
  let shadowHalf = SHADOW_HALF;
  const back = () => SH * 2.5 + 400;
  function setExtent(h: number, rise: number): void {
    const sinE = Math.max(0.1, lightDir.y), cosE = Math.sqrt(1 - sinE * sinE);
    const v = Math.min(h, h * sinE + rise * cosE);
    if (h === SH && v === SV) return;
    (SH = h), (SV = v);
    Object.assign(sun.shadow.camera, { left: -SH, right: SH, top: SV, bottom: -SV, near: 1, far: 2 * back() });
    sun.shadow.camera.updateProjectionMatrix();
  }

  /** Per frame: the map over the ground in front of the eye, snapped to its texels (no shimmer as the eye turns). */
  function follow(camera: THREE.Camera): void {
    const fwd = camera.getWorldDirection(new THREE.Vector3()).setY(0);
    if (fwd.lengthSq() < 1e-6) fwd.set(0, 0, -1);
    fwd.normalize();
    const focus = camera.position.clone().addScaledVector(fwd, shadowHalf * 0.6);
    focus.y = heightAt(focus.x, focus.z);
    let relief = 0;
    for (let i = -2; i <= 2; i++) for (let j = -2; j <= 2; j++) relief = Math.max(relief, Math.abs(heightAt(focus.x + (i * shadowHalf) / 2, focus.z + (j * shadowHalf) / 2) - focus.y));
    setExtent(shadowHalf, Math.ceil((relief + RISE) / 10) * 10);
    const sinE = Math.max(0.1, lightDir.y);
    const texel = Math.max(2 * SH, (2 * SV) / sinE) / SHADOW_SIZE;
    sun.shadow.normalBias = texel;
    sun.shadow.bias = (-texel * sinE) / (2 * back());
    const tx = (2 * SH) / SHADOW_SIZE, ty = (2 * SV) / SHADOW_SIZE;
    const lx = new THREE.Vector3().crossVectors(new THREE.Vector3(0, 1, 0), lightDir);
    if (lx.lengthSq() < 1e-10) lx.set(1, 0, 0); // (a sun straight overhead)
    lx.normalize();
    const ly = new THREE.Vector3().crossVectors(lightDir, lx);
    const fx = Math.round(focus.dot(lx) / tx) * tx, fy = Math.round(focus.dot(ly) / ty) * ty, fz = focus.dot(lightDir);
    focus.copy(lx).multiplyScalar(fx).addScaledVector(ly, fy).addScaledVector(lightDir, fz);
    sun.target.position.copy(focus);
    sun.position.copy(focus).addScaledVector(lightDir, back());
    sun.updateMatrixWorld();
    sun.target.updateMatrixWorld();
    sun.shadow.updateMatrices(sun);
  }

  let recapture = true, exposure = 0.9;
  let skyReport: SkyReport = { cloudCover: DEFAULT_COVERAGE, visibilityKm: 50, skyCoverage: DEFAULT_COVERAGE, skyDensity: 0.4, dome: false, haze: true };
  /** Sets the environment (any time: before the first frame or between frames). */
  function apply(env: Environment, origin: ScenePackage['origin']): SunReport {
    const pos = sunFor(env, origin);
    const mode = env.sun ?? 'daylight', trueSun = mode === 'true';
    look = WEATHER[env.weather];
    const rad = Math.PI / 180;
    const dirOf = (el: number, out: THREE.Vector3) => out.set(Math.sin(pos.azimuth * rad) * Math.cos(el * rad), Math.sin(el * rad), -Math.cos(pos.azimuth * rad) * Math.cos(el * rad));
    dirOf(Math.max(pos.elevation, -1), sunDir); // (the sky's glow stays at dusk; SkyMesh is black under ~-2 degrees)
    const drawnElevation = trueSun ? pos.elevation : Math.max(pos.elevation, 6);
    dirOf(drawnElevation, lightDir);
    /** Direct sunlight: none under the horizon with the true sun. */
    const up = trueSun ? (pos.elevation > 0 ? 1 : 0) : 1;
    sky.sunPosition.value.copy(sunDir);
    sky2.sunPosition.value.copy(sunDir);
    const day = THREE.MathUtils.smoothstep(pos.elevation, -4, 10); // (0 dusk, 1 day)
    const low = THREE.MathUtils.smoothstep(pos.elevation, 2, 28); // (0 a low warm sun)
    sun.color.setRGB(1, 0.5 + 0.45 * low, 0.28 + 0.58 * low);
    sun.intensity = look.sun * day * up;
    hemi.intensity = look.hemi * (0.32 + 0.68 * THREE.MathUtils.smoothstep(pos.elevation, -8, 18));
    hemi.color.setRGB(0.74 - 0.2 * (1 - day), 0.83 - 0.12 * (1 - day), 0.93);
    castShadows = look.shadows && day > 0.15 && up > 0;
    sun.shadow.intensity = castShadows ? 1 : 0;
    shadowOn.value = castShadows ? 1 : 0;
    sun.shadow.needsUpdate = true;
    // a clear sky after sunset (from 1.5 degrees down): the dome in twilight blues rather than SkyMesh's black
    const twilight = look.sky === 'clear' && pos.elevation < -1.5;
    sky.visible = sky2.visible = look.sky === 'clear' && !twilight;
    dome.visible = dome2.visible = !sky.visible;
    if (twilight) {
      const t = THREE.MathUtils.smoothstep(pos.elevation, -14, -1.5); // (1 just after sunset, 0 by nautical dusk)
      greyHorizon.value.setRGB(0.1 + 0.22 * t, 0.12 + 0.16 * t, 0.2 + 0.14 * t);
      greyTop.value.setRGB(0.03 + 0.05 * t, 0.05 + 0.09 * t, 0.12 + 0.16 * t);
    } else {
      greyHorizon.value.copy(look.grey).multiplyScalar(0.35 + 0.65 * day);
      greyTop.value.copy(look.grey).multiplyScalar((0.35 + 0.65 * day) * 0.82);
    }
    // the cloud: the parent's share of the clear sky (none: as always drawn), the overcast dome under full cloud
    const share = look.sky === 'clear' ? env.cloudCover : 1;
    const overcastDome = look.sky === 'grey' || (share !== undefined && share >= DOME_SHARE);
    const cloud = share === undefined ? { coverage: DEFAULT_COVERAGE, density: 0.4 } : overcastDome ? { coverage: 0, density: 0.4 } : cloudParamsForShare(share);
    for (const s of [sky, sky2]) {
      s.cloudCoverage.value = cloud.coverage;
      s.cloudDensity.value = cloud.density;
    }
    if (overcastDome && look.sky === 'clear' && !twilight) {
      sky.visible = sky2.visible = false;
      dome.visible = dome2.visible = true;
      greyHorizon.value.copy(WEATHER.overcast.grey).multiplyScalar(0.35 + 0.65 * day);
      greyTop.value.copy(WEATHER.overcast.grey).multiplyScalar((0.35 + 0.65 * day) * 0.82);
    }
    // (a photo's distance is blue-grey, not the sky's white: the airlight held lower)
    airlight.value = Math.max(0.03, (sun.intensity * Math.max(0, lightDir.y) + hemi.intensity) / Math.PI) * (env.look === 'photo' ? 0.55 : 1);
    hazeStart.value = env.look === 'photo' ? 0 : 8000;
    const visibilityKm = env.visibilityKm ?? look.visibilityKm;
    extinction.value = visibilityKm >= NO_HAZE_KM ? 0 : extinctionPerMeter(visibilityKm); // (PGMaps' "No haze")
    skyReport = { cloudCover: +(share ?? skyCloudShare(DEFAULT_COVERAGE)).toFixed(3), visibilityKm, skyCoverage: +cloud.coverage.toFixed(3), skyDensity: +cloud.density.toFixed(3), dome: overcastDome, haze: visibilityKm < NO_HAZE_KM };
    snow.value = env.ground === 'snow' ? 1 : 0;
    // (dusk: the eye adapts, never black; snow on the ground: the camera stops down, or the snow is a white sheet)
    exposure = look.exposure * (1 + 0.9 * (1 - day)) * (env.ground === 'snow' ? 0.72 : 1);
    wet.value = env.weather === 'rain' ? 1 : 0;
    recapture = true;
    const r1 = (v: number) => Math.round(v * 10) / 10;
    return { elevation: r1(pos.elevation), azimuth: r1(pos.azimuth), drawnElevation: r1(drawnElevation), drawnAzimuth: r1(pos.azimuth), exposure: +exposure.toFixed(3), mode };
  }

  /** Per frame, before the scene is drawn: the sky capture when the environment changed, and the shadow map. */
  function frame(renderer: THREE.WebGPURenderer, camera: THREE.Camera, allowShadows = true): boolean {
    if (recapture) {
      recapture = false;
      cubeCam.update(renderer, capture);
    }
    renderer.toneMappingExposure = exposure;
    const cast = castShadows && allowShadows;
    if (cast) follow(camera);
    // (once a frame, by needsUpdate: with autoUpdate the water's reflection render drew the shadow map a second time)
    sun.shadow.autoUpdate = false;
    sun.shadow.needsUpdate = cast;
    return cast;
  }

  /** The god rays want the sun on screen under a clear sky. */
  const raysOn = (): boolean => look.rays && castShadows;

  /** Sets the shadow map's half-extent (m; null: the live view's). */
  const setShadowHalf = (h: number | null): void => {
    shadowHalf = h ?? SHADOW_HALF;
  };

  return { setShadowHalf, skyScale, sky, sun, hemi, sunDir, lightDir, extinction, fogColour, fogFactor, fadeShadow, snow, wet, apply, frame, raysOn, skyReport: (): SkyReport => skyReport };
}
