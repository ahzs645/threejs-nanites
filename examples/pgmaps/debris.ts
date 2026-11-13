// The package's debris (slash left in a cut block): each point a low, ragged mat of fine slash (branches and dead
// needles) its footprint across, a few bucked logs lying over and round it and a scatter of branches. Three instanced
// meshes, shadow casters (layer 1, the sun's) and receivers; the logs and branches in the demo's pine bark image; snow
// settles on their tops.
import * as THREE from 'three/webgpu';
import { Fn, attribute, positionWorld, mx_noise_float, vec2, vec3, mix, smoothstep, texture, uv, float } from 'three/tsl';
import { snowOn } from './floor.ts';
import { barkImage } from './trees.ts';
import type { ScenePackage } from './package.ts';

/** A seeded random in 0..1. */
function random(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export async function buildDebris(scene: ScenePackage, heightAt: (x: number, z: number) => number, snow: THREE.UniformNode<'float', number>): Promise<THREE.Group | null> {
  const d = scene.debris;
  if (!d?.count) return null;
  const st = d.fields.length, fx = d.fields.indexOf('x'), fy = d.fields.indexOf('y'), fz = d.fields.indexOf('z'), ff = d.fields.indexOf('footprint');
  const rnd = random(4242);
  const piles: THREE.Matrix4[] = [], logs: THREE.Matrix4[] = [], twigs: THREE.Matrix4[] = [];
  const q = new THREE.Quaternion(), e = new THREE.Euler(), s = new THREE.Vector3(), p = new THREE.Vector3();
  /** A cylinder lying at (x, z), `lift` over the ground, turned any way, tilted a little. */
  const lying = (x: number, z: number, lift: number, r: number, len: number): THREE.Matrix4 => {
    q.setFromEuler(e.set((rnd() - 0.5) * 0.3, rnd() * Math.PI * 2, Math.PI / 2 + (rnd() - 0.5) * 0.35, 'YXZ'));
    return new THREE.Matrix4().compose(p.set(x, heightAt(x, z) + r + lift, z), q, s.set(r, len, r));
  };
  for (let i = 0; i < d.count; i++) {
    const o = i * st;
    const x = d.data[o + fx], z = -d.data[o + fy];
    const foot = Math.max(1, ff >= 0 ? d.data[o + ff] : 3);
    const ground = Number.isFinite(d.data[o + fz]) && fz >= 0 ? Math.min(d.data[o + fz], heightAt(x, z)) : heightAt(x, z);
    // the mat: a low, turned, ragged dome of fine slash
    const h = 0.12 + foot * (0.03 + rnd() * 0.05);
    q.setFromEuler(e.set(0, rnd() * Math.PI * 2, 0));
    piles.push(new THREE.Matrix4().compose(p.set(x, ground - 0.06, z), q, s.set(foot * 0.5, h, foot * (0.3 + rnd() * 0.18))));
    // logs: 1 to 4 lying over it, criss-crossed, some rolled off to the side
    const n = 1 + Math.floor(rnd() * Math.min(4, foot * 0.8));
    for (let k = 0; k < n; k++) {
      const len = foot * (0.5 + rnd() * 0.6) + 1, r = 0.07 + rnd() * 0.13;
      logs.push(lying(x + (rnd() - 0.5) * foot * 0.7, z + (rnd() - 0.5) * foot * 0.7, rnd() < 0.5 ? h * (0.3 + rnd() * 0.5) : 0, r, len));
    }
    // branches and tops strewn over and round it
    const sticks = 8 + Math.round(foot * 4);
    for (let k = 0; k < sticks; k++) {
      const a = rnd() * Math.PI * 2, at = Math.sqrt(rnd()) * foot * 0.75;
      const over = 1 - at / (foot * 0.75); // (piled up in the middle)
      twigs.push(lying(x + Math.cos(a) * at, z + Math.sin(a) * at, h * over * (0.4 + rnd() * 0.7), 0.015 + rnd() * 0.035, 0.6 + rnd() * 2.4));
    }
  }
  const group = new THREE.Group();
  group.name = 'debris';

  const pileMat = new THREE.MeshStandardNodeMaterial({ roughness: 1, metalness: 0 });
  pileMat.colorNode = Fn(() => {
    const w = positionWorld;
    // tangled branches and dead needles: grey-brown, dark gaps between them, rusty where the needles are fresh
    const sticks = mx_noise_float(vec3(w.x.mul(7), w.y.mul(3), w.z.mul(7))).mul(0.5).add(0.5);
    const gaps = smoothstep(0.35, 0.6, mx_noise_float(w.mul(14)).mul(0.5).add(0.5));
    const base = mix(vec3(0.05, 0.04, 0.03), mix(vec3(0.12, 0.095, 0.07), vec3(0.17, 0.14, 0.105), sticks), gaps.mul(0.7).add(0.3));
    const rust = mix(base, vec3(0.22, 0.1, 0.045).mul(gaps.mul(0.6).add(0.4)), smoothstep(0.5, 0.8, mx_noise_float(w.xz.mul(0.7))).mul(0.6));
    return snowOn(rust, snow);
  })();
  // (ragged in the geometry: a positionNode would replace the instancing)
  const pileGeo = new THREE.SphereGeometry(1, 20, 6, 0, Math.PI * 2, 0, Math.PI / 2);
  const pp = pileGeo.attributes.position, lump = random(77);
  const bumps = Array.from({ length: 7 }, () => [lump() * Math.PI * 2, 1 + Math.floor(lump() * 4), lump() * 0.14]);
  for (let i = 0; i < pp.count; i++) {
    const x = pp.getX(i), y = pp.getY(i), z = pp.getZ(i), a = Math.atan2(z, x);
    const k = 1 + bumps.reduce((acc, [ph, f, amp]) => acc + Math.sin(a * f + ph + y * 5) * amp, 0);
    pp.setXYZ(i, x * k, y * (0.6 + 0.6 * k * lump()), z * k);
  }
  pileGeo.computeVertexNormals();
  const pileMesh = new THREE.InstancedMesh(pileGeo, pileMat, piles.length);
  piles.forEach((m, i) => pileMesh.setMatrixAt(i, m));

  // logs and branches: the pine bark (its image: around by u, along by the cylinder's length)
  const layer = await barkImage('pine');
  const size = Math.round(Math.sqrt(layer.px.length / 4));
  const barkTex = new THREE.DataTexture(new Uint8Array(layer.px.buffer.slice(0)), size, size);
  barkTex.colorSpace = THREE.SRGBColorSpace;
  barkTex.wrapS = barkTex.wrapT = THREE.RepeatWrapping;
  barkTex.magFilter = THREE.LinearFilter;
  barkTex.minFilter = THREE.LinearMipmapLinearFilter;
  barkTex.generateMipmaps = true;
  barkTex.needsUpdate = true;
  const woodMat = (greyed: number): THREE.MeshStandardNodeMaterial => {
    const mat = new THREE.MeshStandardNodeMaterial({ roughness: 0.92, metalness: 0 });
    mat.colorNode = Fn(() => {
      const own = attribute('position', 'vec3'); // (the cylinder's own: positionLocal is the instanced one)
      const len = attribute('instanceLength', 'float');
      const bark = texture(barkTex, vec2(uv().x, own.y.mul(len).mul(0.35))).rgb.mul(vec3(0.75, 0.68, 0.62));
      const weathered = mix(bark, vec3(0.32, 0.3, 0.27), float(greyed));
      // the cut ends: pale wood (the caps, facing along the axis)
      const end = smoothstep(0.49, 0.5, own.y.abs()).mul(smoothstep(0.7, 0.9, attribute('normal', 'vec3').y.abs()));
      return snowOn(mix(weathered, vec3(0.6, 0.48, 0.32), end), snow, 0.7);
    })();
    return mat;
  };
  const cylinders = (list: THREE.Matrix4[], radial: number, greyed: number): THREE.InstancedMesh => {
    const geo = new THREE.CylinderGeometry(1, 1, 1, radial, 1);
    const lengths = new Float32Array(list.length);
    list.forEach((m, i) => (lengths[i] = new THREE.Vector3().setFromMatrixColumn(m, 1).length()));
    geo.setAttribute('instanceLength', new THREE.InstancedBufferAttribute(lengths, 1));
    const mesh = new THREE.InstancedMesh(geo, woodMat(greyed), list.length);
    list.forEach((m, i) => mesh.setMatrixAt(i, m));
    return mesh;
  };
  const logMesh = cylinders(logs, 10, 0.15), twigMesh = cylinders(twigs, 5, 0.35);

  for (const mesh of [pileMesh, logMesh, twigMesh]) {
    mesh.instanceMatrix.needsUpdate = true;
    mesh.castShadow = mesh.receiveShadow = true;
    mesh.layers.enable(1); // (the sun's shadow camera sees layer 1)
    mesh.computeBoundingSphere();
    group.add(mesh);
  }
  return group;
}
