// The sky, fog, sun and shadow map, set by the parent's environment (package.ts): the sun placed from the date and
// place (below the horizon: a dim dusk, never black), clear (the demo's sky, sun shadows, god rays), overcast (a grey
// sky, no hard shadows, flat light) or rain / snow (overcast, nearer fog and falling particles, particles.ts). The
// fog takes the sky's own colour in the view direction, as the demo's (src/lighting.ts), so far ground melts into the
// sky rather than meeting it at a band. Changing the environment never rebuilds the drawing: only uniforms, the
// lights and a new sky capture.
import * as THREE from 'three/webgpu';
import {
  Fn, float, max, abs, mix, positionWorld, cameraPosition, cubeTexture, fog, rangeFogFactor, smoothstep, uniform,
  vec3, vec4, positionLocal,
} from 'three/tsl';
import { SkyMesh } from 'three/addons/objects/SkyMesh.js';
import { PHASE2_LAYER, type Float, type Vec3 } from '../../src/nanite-lib/index.ts';
import { sunFor, type Environment, type ScenePackage } from './package.ts';

const SKY_SCALE = 18000;
/** The shadow map: its side (texels) and half-extent across the sun (m), in front of the eye. */
const params = new URLSearchParams(location.search);
const SHADOW_SIZE = Number(params.get('smap') ?? 4096), SHADOW_HALF = Number(params.get('shalf') ?? 220);
/** Over this the stands' shadow can reach above the ground (m: the tallest stems, ~35 m, and some relief). */
const RISE = 60;

interface Look { sky: 'clear' | 'grey'; grey: THREE.Color; sun: number; hemi: number; shadows: boolean; fog: [number, number]; exposure: number; rays: boolean }
const WEATHER: Record<Environment['weather'], Look> = {
  clear: { sky: 'clear', grey: new THREE.Color(0.62, 0.66, 0.7), sun: 3.2, hemi: 1.3, shadows: true, fog: [900, 14000], exposure: 0.9, rays: true },
  overcast: { sky: 'grey', grey: new THREE.Color(0.58, 0.61, 0.64), sun: 0.35, hemi: 2.5, shadows: false, fog: [400, 7000], exposure: 1.0, rays: false },
  rain: { sky: 'grey', grey: new THREE.Color(0.42, 0.45, 0.48), sun: 0.2, hemi: 2.3, shadows: false, fog: [150, 2600], exposure: 1.05, rays: false },
  snow: { sky: 'grey', grey: new THREE.Color(0.7, 0.72, 0.75), sun: 0.25, hemi: 2.6, shadows: false, fog: [60, 1300], exposure: 1.0, rays: false },
};

export function createEnvironment(scene: THREE.Scene, heightAt: (x: number, z: number) => number) {
  // the sky: the demo's (three's SkyMesh) under a clear sky, a grey dome under cloud
  const sky = new SkyMesh();
  sky.scale.setScalar(SKY_SCALE);
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
  dome.scale.setScalar(SKY_SCALE * 0.98);
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
  const fogNear = uniform(900), fogFar = uniform(14000);
  const fogColour = (pos: Vec3): Vec3 => {
    const d = pos.sub(cameraPosition).normalize();
    return cubeTexture(cube.texture, vec3(d.x, max(d.y, 0.02), d.z).normalize()).level(float(2)).rgb;
  };
  scene.fogNode = fog(fogColour(positionWorld), rangeFogFactor(fogNear, fogFar));

  // lights: sky and ground bounce, and the sun with the shadow map (its casters, the stand's shadow meshes, on layer 1)
  const hemi = new THREE.HemisphereLight(0xbcd3ec, 0x4a4632, 1.3);
  const sun = new THREE.DirectionalLight(0xfff1dc, 3.2);
  sun.castShadow = true;
  sun.shadow.mapSize.set(SHADOW_SIZE, SHADOW_SIZE);
  sun.shadow.camera.layers.set(1);
  for (const l of [hemi, sun]) l.layers.enable(PHASE2_LAYER);
  scene.add(hemi, sun, sun.target);

  /** Towards the sun as the sky draws it, and as the light comes (held a few degrees up at dusk: no grazing shadows). */
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
    const focus = camera.position.clone().addScaledVector(fwd, SHADOW_HALF * 0.6);
    focus.y = heightAt(focus.x, focus.z);
    let relief = 0;
    for (let i = -2; i <= 2; i++) for (let j = -2; j <= 2; j++) relief = Math.max(relief, Math.abs(heightAt(focus.x + (i * SHADOW_HALF) / 2, focus.z + (j * SHADOW_HALF) / 2) - focus.y));
    setExtent(SHADOW_HALF, Math.ceil((relief + RISE) / 10) * 10);
    const sinE = Math.max(0.1, lightDir.y);
    const texel = Math.max(2 * SH, (2 * SV) / sinE) / SHADOW_SIZE;
    sun.shadow.normalBias = texel;
    sun.shadow.bias = (-texel * sinE) / (2 * back());
    const tx = (2 * SH) / SHADOW_SIZE, ty = (2 * SV) / SHADOW_SIZE;
    const lx = new THREE.Vector3().crossVectors(new THREE.Vector3(0, 1, 0), lightDir).normalize();
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
  /** Sets the environment (any time: before the first frame or between frames). */
  function apply(env: Environment, origin: ScenePackage['origin']): { elevation: number; azimuth: number } {
    const pos = sunFor(env, origin);
    look = WEATHER[env.weather];
    const rad = Math.PI / 180;
    const dirOf = (el: number, out: THREE.Vector3) => out.set(Math.sin(pos.azimuth * rad) * Math.cos(el * rad), Math.sin(el * rad), -Math.cos(pos.azimuth * rad) * Math.cos(el * rad));
    dirOf(Math.max(pos.elevation, -1), sunDir); // (the sky's glow stays at dusk; SkyMesh is black under ~-2 degrees)
    dirOf(Math.max(pos.elevation, 6), lightDir);
    sky.sunPosition.value.copy(sunDir);
    sky2.sunPosition.value.copy(sunDir);
    const day = THREE.MathUtils.smoothstep(pos.elevation, -4, 10); // (0 dusk, 1 day)
    const low = THREE.MathUtils.smoothstep(pos.elevation, 2, 28); // (0 a low warm sun)
    sun.color.setRGB(1, 0.5 + 0.45 * low, 0.28 + 0.58 * low);
    sun.intensity = look.sun * day;
    hemi.intensity = look.hemi * (0.32 + 0.68 * THREE.MathUtils.smoothstep(pos.elevation, -8, 18));
    hemi.color.setRGB(0.74 - 0.2 * (1 - day), 0.83 - 0.12 * (1 - day), 0.93);
    castShadows = look.shadows && day > 0.15;
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
    fogNear.value = look.fog[0];
    fogFar.value = look.fog[1];
    snow.value = env.ground === 'snow' ? 1 : 0;
    // (dusk: the eye adapts, never black; snow on the ground: the camera stops down, or the snow is a white sheet)
    exposure = look.exposure * (1 + 0.9 * (1 - day)) * (env.ground === 'snow' ? 0.72 : 1);
    wet.value = env.weather === 'rain' ? 1 : 0;
    recapture = true;
    return pos;
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

  return { sky, sun, hemi, sunDir, lightDir, fogNear, fogFar, fogColour, fadeShadow, snow, wet, apply, frame, raysOn };
}
