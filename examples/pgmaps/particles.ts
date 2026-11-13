// Falling rain or snow round the eye: a fixed set of quads in a box that follows the camera, each falling and
// wrapping round in the vertex shader (no per-frame CPU work), turned to face the eye about the vertical. Drawn after
// both tree phases (PHASE2_LAYER), blended, no depth writes. Rain: thin streaks, fast; snow: flakes drifting down.
import * as THREE from 'three/webgpu';
import { attribute, cameraPosition, positionWorld, uniform, vec3, float, sin, cross, normalize, select, mix, smoothstep } from 'three/tsl';
import { PHASE2_LAYER } from '../../src/nanite-lib/index.ts';

const COUNT = 14000;
const BOX = new THREE.Vector3(60, 30, 60); // (m: round the eye)

export function createParticles() {
  // per quad: a random position in the box (xyz) and a phase (w); per corner its offset across (x) and up (y)
  const seed = new Float32Array(COUNT * 4 * 4), corner = new Float32Array(COUNT * 4 * 2), idx = new Uint32Array(COUNT * 6);
  for (let i = 0; i < COUNT; i++) {
    const s = [Math.random(), Math.random(), Math.random(), Math.random()];
    for (let c = 0; c < 4; c++) {
      seed.set(s, (i * 4 + c) * 4);
      corner.set([c & 1 ? 0.5 : -0.5, c & 2 ? 0.5 : -0.5], (i * 4 + c) * 2);
    }
    idx.set([i * 4, i * 4 + 1, i * 4 + 2, i * 4 + 1, i * 4 + 3, i * 4 + 2], i * 6);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(COUNT * 4 * 3), 3));
  geometry.setAttribute('seed', new THREE.BufferAttribute(seed, 4));
  geometry.setAttribute('corner', new THREE.BufferAttribute(corner, 2));
  geometry.setIndex(new THREE.BufferAttribute(idx, 1));

  const u = {
    time: uniform(0),
    snow: uniform(0), // 0 rain, 1 snow
    share: uniform(1), // the share of the particles drawn (the others collapse)
    eye: uniform(new THREE.Vector3()),
  };
  const box = vec3(BOX.x, BOX.y, BOX.z);
  const s = attribute('seed', 'vec4'), c = attribute('corner', 'vec2');
  const speed = mix(float(9), float(1.1), u.snow); // (m/s)
  const drift = vec3(sin(u.time.mul(0.7).add(s.w.mul(40))).mul(0.6), 0, sin(u.time.mul(0.53).add(s.w.mul(23))).mul(0.6)).mul(u.snow);
  const fall = vec3(0.6, 0, 0.3).mul(float(1).sub(u.snow)); // (rain slants a little in the wind)
  const p0 = s.xyz.mul(box).add(fall.sub(vec3(0, 1, 0)).mul(speed).mul(u.time)).add(drift);
  // wrapped into the box round the eye
  const q = p0.sub(u.eye).add(box.mul(0.5));
  const rel = q.sub(box.mul(q.div(box).floor())).sub(box.mul(0.5));
  const centre = u.eye.add(rel);
  const toEye = normalize(vec3(cameraPosition.x.sub(centre.x), 0, cameraPosition.z.sub(centre.z)));
  const across = cross(vec3(0, 1, 0), toEye);
  const size = mix(vec3(0.01, 0.38, 0), vec3(0.035, 0.035, 0), u.snow).mul(s.w.mul(0.6).add(0.7));
  const keep = select(s.w.lessThan(u.share), float(1), float(0));
  const material = new THREE.MeshBasicNodeMaterial({ transparent: true, depthWrite: false, fog: true, side: THREE.DoubleSide });
  material.positionNode = centre.add(across.mul(c.x.mul(size.x)).add(vec3(0, c.y.mul(size.y), 0))).mul(keep).add(u.eye.mul(float(1).sub(keep)));
  material.colorNode = mix(vec3(0.62, 0.66, 0.7), vec3(0.95, 0.96, 1), u.snow);
  // (faded right at the eye: a streak a metre off crossed the whole view as a white pole)
  material.opacityNode = mix(float(0.22), float(0.85), u.snow).mul(smoothstep(1.5, 6, positionWorld.sub(cameraPosition).length()));
  const mesh = new THREE.Mesh(geometry, material);
  mesh.frustumCulled = false;
  mesh.layers.set(PHASE2_LAYER);
  mesh.visible = false;
  mesh.name = 'precipitation';

  return {
    mesh,
    /** 'rain' / 'snow' / none. */
    set(kind: 'rain' | 'snow' | null): void {
      mesh.visible = kind !== null;
      u.snow.value = kind === 'snow' ? 1 : 0;
      u.share.value = kind === 'snow' ? 0.75 : 1;
    },
    update(time: number, eye: THREE.Vector3): void {
      u.time.value = time;
      u.eye.value.copy(eye);
    },
  };
}
