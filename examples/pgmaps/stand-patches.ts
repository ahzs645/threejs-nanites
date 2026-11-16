// Stand impostors: the far forest as one camera-facing slab per 60 m cell (far-forest.ts standPatches), each slab's
// picture a 60 × 60 m patch of real-density forest baked here from a few elevations. Narrow real crowns at their
// real spacing keep the spires, the dark gaps between them and the stand's closure that the package's widened far
// stems (one per 400–1,000 trees) drew as squat blobs.
//
// The bake: per species and per closure level (PATCH_CLOSURES), trees planted on a jittered grid at the Boolean
// model's density for that closure (far-forest.ts stemsPerHectare), each one of the species' real-ratio tree types
// drawn as its own impostor tile (the types' atlas, impostors/atlas.ts) seen from each of PATCH_ELEVATIONS, into an
// albedo atlas (unlit colour × a per-tree tint × occlusion lower in the crown; alpha = drawn) and a normal atlas
// (the trees' normals). The patch repeats left to right (trees over an edge are drawn on both sides), so a slab can
// be as wide as its cell looks from any side without stretching a tree.
//
// The slab (InstancedBufferGeometry, one quad a cell): through the cell's front edge, on its ground plane, facing the
// camera; its height the frame's at the elevation the eye sees the cell's ground from (relative to its slope),
// stretched vertically by the cell's stand height. Lit as the impostors are (Lambert, the sun and sky, the average
// self-shadow past the shadow map), its colour graded by the look (far-forest.ts gradeColour). Past the canopy
// cut-off it gives way to the canopy surface, pixel by pixel with the same dither (complementary). In a flat pass it
// is its ground's class colour (`setClasses`), cut at alpha 0.5 with no dither.
import * as THREE from 'three/webgpu';
import {
  Fn, If, Discard, attribute, cameraPosition, cameraViewMatrix, cross, float, vec2, vec3, vec4, normalize, positionGeometry,
  select, texture, uniform, uniformArray, varying, clamp, asin, abs, dot, mix, max, min, fract, floor, length, smoothstep, uint, atan, screenCoordinate,
} from 'three/tsl';
import { atlasLayout, dither, ditherAlt, setEmissive, type ImpostorAtlas, type NaniteType, type Float, type Vec3 } from '../../src/nanite-lib/index.ts';
import { PATCH_CLOSURES, PATCH_METERS, stemsPerHectare, type Patches } from './far-forest.ts';

/** The bake's elevations (degrees above the cell's ground plane). */
export const PATCH_ELEVATIONS = [0, 5, 11, 20, 35];
/** A tile's texels (the patch's 60 m across). */
const PW = 384, PH = 256;
/** The trees' reference height in the bake (m): a slab is stretched vertically by its cell's height over this. */
export const BAKE_HEIGHT = 22;
/** Ground below the front edge kept in the tile (m), for crowns that hang lower than their base's projection. */
const BELOW = 3;
/** Albedo is stored × this in 8 bits (a forest's albedo is under 0.25). */
const ALBEDO_GAIN = 4;
const DEG = Math.PI / 180;
/** The slabs' alpha cut (their tiles' coverage-preserving mip average). */
const PATCH_CUT = Number(new URLSearchParams(location.search).get('patchcut') ?? 0.42);
/** The tiles' filter footprint across, as a share of the pixel's. */
const ACROSS = Number(new URLSearchParams(location.search).get('patchacross') ?? 0.35);
/**
 * And up and down, as a share of the pixel's: wider than the pixel, so a spire's mip keeps its height and loses its
 * crown's horizontal tiers (the library measured the slabs' far texture at 0.7–0.9 vertical-edge ratio against the
 * renders' 1.1–1.8).
 */
const UPDOWN = Number(new URLSearchParams(location.search).get('patchupdown') ?? 1.4);

export interface PatchAtlas {
  albedo: THREE.RenderTarget;
  normals: THREE.RenderTarget;
  cols: number;
  rows: number;
  /** Each tile's frame height (m) at BAKE_HEIGHT, per elevation. */
  frameH: number[];
  /** Per package species index, its first tile block (variant) in the atlas; species without one take the first. */
  slotOf: number[];
  variants: number;
  /** Per package species index: the bake's mean albedo where trees are (linear) and the share of the tile they cover, at the middle closure from 5°. */
  meanAlbedo: Array<[number, number, number] | null>;
  dispose(): void;
}

export interface PatchSpecies {
  /** The package's species index. */
  species: number;
  /** Its real-ratio tree types (indices into the renderer's types). */
  types: number[];
  /** A typical crown width (m) at BAKE_HEIGHT. */
  crownWidth: number;
}

/** A seeded random (mulberry32). */
const rng = (seed: number) => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

/** The patches baked from the types' impostor atlas (already baked): per species, per closure level, per elevation. */
export async function bakePatches(renderer: THREE.WebGPURenderer, typeAtlas: ImpostorAtlas, types: NaniteType[], species: PatchSpecies[], speciesCount: number): Promise<PatchAtlas> {
  const variants = Math.max(1, species.length) * PATCH_CLOSURES.length;
  const tiles = variants * PATCH_ELEVATIONS.length;
  const cols = Math.max(1, Math.min(tiles, Math.floor(8192 / PW))), rows = Math.ceil(tiles / cols);
  const make = () => new THREE.RenderTarget(cols * PW, rows * PH, {
    type: THREE.UnsignedByteType, generateMipmaps: true, minFilter: THREE.LinearMipmapLinearFilter, magFilter: THREE.LinearFilter, depthBuffer: true,
  });
  const albedo = make(), normals = make();
  const frameH = PATCH_ELEVATIONS.map((e) => BELOW + PATCH_METERS * Math.sin(e * DEG) + BAKE_HEIGHT * 1.35 * Math.cos(e * DEG) + 2);
  const slotOf = Array.from({ length: speciesCount }, () => 0);
  species.forEach((s, k) => (slotOf[s.species] = k));

  // the types' tiles: where tile (elevation block kt, type i) is in the types' atlas
  const tn = typeAtlas.views, tl = atlasLayout(tn);
  const tileUv = (i: number, kt: number) => {
    const t = kt * tn + (typeAtlas.viewBase.array as number[])[i], row = Math.floor(t / tl.cols), col = t - row * tl.cols;
    return { u0: col / tl.cols, v0: row / tl.rows, du: 1 / tl.cols, dv: 1 / tl.rows };
  };
  const albedoMat = new THREE.MeshBasicNodeMaterial();
  const normalMat = new THREE.MeshBasicNodeMaterial();
  const uvA = attribute('uv', 'vec2'), shadeA = attribute('shade', 'vec2');
  const cut = (out: ReturnType<typeof vec4>) => Fn(() => {
    const t = texture(typeAtlas.texture, uvA);
    If(t.a.lessThan(0.5), () => Discard());
    return out;
  })();
  {
    const t = texture(typeAtlas.texture, uvA);
    // (occlusion: lower in a crown and nearer the ground darker; the tint per tree)
    const ao = mix(float(0.86), float(1), smoothstep(0.05, 0.9, shadeA.y));
    albedoMat.colorNode = cut(vec4(clamp(t.rgb.div(max(t.a, 1e-3)).mul(shadeA.x).mul(ao).mul(ALBEDO_GAIN), 0, 1), 1));
    const n = texture(typeAtlas.normals, uvA);
    normalMat.colorNode = cut(vec4(normalize(n.xyz.add(vec3(0, 0, 1e-4))).mul(0.5).add(0.5), 1));
  }

  const prev = { target: renderer.getRenderTarget(), clear: renderer.getClearColor(new THREE.Color()), alpha: renderer.getClearAlpha(), auto: renderer.autoClear, tone: renderer.toneMapping };
  renderer.toneMapping = THREE.NoToneMapping;
  renderer.setClearColor(0x000000, 0);
  for (const t of [albedo, normals]) {
    renderer.setRenderTarget(t);
    renderer.clear();
  }
  renderer.autoClear = false;
  const scene = new THREE.Scene();
  species.forEach((sp, si) => {
    PATCH_CLOSURES.forEach((closure, di) => {
      // the patch's trees: a jittered grid at the density, each a type of the species, its height, tint and yaw
      const perHa = stemsPerHectare(closure, sp.crownWidth);
      const n = Math.max(1, Math.round((perHa * PATCH_METERS * PATCH_METERS) / 10000));
      const side = Math.ceil(Math.sqrt(n)), step = PATCH_METERS / side;
      const rnd = rng(1000 + sp.species * 31 + di * 7);
      const trees: Array<{ x: number; d: number; s: number; type: number; tint: number }> = [];
      const cells = Array.from({ length: side * side }, (_, k) => k).sort(() => rnd() - 0.5).slice(0, n);
      for (const k of cells) {
        const x = ((k % side) + 0.15 + 0.7 * rnd()) * step, d = (Math.floor(k / side) + 0.15 + 0.7 * rnd()) * step;
        const type = sp.types[Math.floor(rnd() * sp.types.length)] ?? 0;
        const h = BAKE_HEIGHT * (0.72 + 0.5 * rnd());
        trees.push({ x, d, s: h / types[type].height, type, tint: 0.62 + 0.7 * rnd() });
      }
      PATCH_ELEVATIONS.forEach((e, ke) => {
        const ce = Math.cos(e * DEG), se = Math.sin(e * DEG);
        const kt = e >= 15 ? 1 : 0; // (the types' 30° tile above 15°, else their side view)
        const pos: number[] = [], uv: number[] = [], shade: number[] = [], idx: number[] = [];
        // (back to front is not needed: depth-tested; each tree once more past each side edge it overlaps)
        for (const tr of trees) {
          const f = typeAtlas.frames[tr.type];
          const fw = f.w * tr.s, fh = f.h * tr.s;
          const cy = (fh / 2) * ce + tr.d * se;
          for (const shift of [0, -PATCH_METERS, PATCH_METERS]) {
            const cx = tr.x + shift;
            if (cx + fw / 2 < 0 || cx - fw / 2 > PATCH_METERS) continue;
            const { u0, v0, du, dv } = tileUv(tr.type, kt);
            const base = pos.length / 3;
            const z = -tr.d; // (nearer the camera: in front)
            for (const [qx, qy] of [[0, 0], [1, 0], [1, 1], [0, 1]]) {
              pos.push(cx + (qx - 0.5) * fw, cy + (qy - 0.5) * fh, z);
              uv.push(u0 + qx * du, v0 + (1 - qy) * dv);
              shade.push(tr.tint, qy * 0.9 + (tr.d / PATCH_METERS) * 0.1);
            }
            idx.push(base, base + 1, base + 2, base, base + 2, base + 3);
          }
        }
        const g = new THREE.BufferGeometry();
        g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
        g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
        g.setAttribute('shade', new THREE.Float32BufferAttribute(shade, 2));
        g.setIndex(idx);
        const cam = new THREE.OrthographicCamera(0, PATCH_METERS, frameH[ke] - BELOW, -BELOW, -1, PATCH_METERS + 10);
        cam.position.set(0, 0, 1);
        cam.updateMatrixWorld();
        const t = (si * PATCH_CLOSURES.length + di) * PATCH_ELEVATIONS.length + ke, col = t % cols, row = Math.floor(t / cols);
        for (const [target, mat] of [[albedo, albedoMat], [normals, normalMat]] as const) {
          const mesh = new THREE.Mesh(g, mat);
          mesh.frustumCulled = false;
          scene.add(mesh);
          renderer.setRenderTarget(target);
          target.viewport.set(col * PW, row * PH, PW, PH);
          target.scissor.set(col * PW, row * PH, PW, PH);
          target.scissorTest = true;
          renderer.clearDepth();
          renderer.render(scene, cam);
          scene.remove(mesh);
        }
        g.dispose();
      });
    });
  });
  for (const t of [albedo, normals]) {
    t.scissorTest = false;
    t.viewport.set(0, 0, cols * PW, rows * PH);
  }
  renderer.autoClear = prev.auto;
  renderer.toneMapping = prev.tone;
  renderer.setRenderTarget(prev.target);
  renderer.setClearColor(prev.clear, prev.alpha);
  albedoMat.dispose();
  normalMat.dispose();

  // the mean albedo where trees are, per species (the canopy surface's colour: no step at the switch)
  const meanAlbedo: PatchAtlas['meanAlbedo'] = Array.from({ length: speciesCount }, () => null);
  try {
    const px = (await renderer.readRenderTargetPixelsAsync(albedo, 0, 0, cols * PW, rows * PH)) as Uint8Array;
    const stride = cols * PW * 4;
    species.forEach((sp, si) => {
      const t = (si * PATCH_CLOSURES.length + 1) * PATCH_ELEVATIONS.length + 1, col = t % cols, row = Math.floor(t / cols);
      let r = 0, g = 0, b = 0, n = 0;
      for (let y = row * PH; y < (row + 1) * PH; y++)
        for (let x = col * PW; x < (col + 1) * PW; x++) {
          const o = y * stride + x * 4;
          if (px[o + 3] < 128) continue;
          (r += px[o]), (g += px[o + 1]), (b += px[o + 2]), n++;
        }
      if (n) meanAlbedo[sp.species] = [r / n / 255 / ALBEDO_GAIN, g / n / 255 / ALBEDO_GAIN, b / n / 255 / ALBEDO_GAIN];
    });
  } catch {
    // (a readback refused: the canopy keeps its own palette)
  }
  return {
    albedo, normals, cols, rows, frameH, slotOf, variants, meanAlbedo,
    dispose: () => (albedo.dispose(), normals.dispose()),
  };
}

/** The far forest's shared uniforms (the slabs' and the canopy surface's). */
export interface FarUniforms {
  /** Where trees give way to the canopy surface (m from the eye), and the cross-fade's width as a share of it. */
  cutoff: THREE.UniformNode<'float', number>;
  band: THREE.UniformNode<'float', number>;
  /** The look's grade: chroma kept and a colour multiplier (far-forest.ts LOOK_GRADE). */
  chroma: THREE.UniformNode<'float', number>;
  tint: THREE.UniformNode<'vec3', THREE.Vector3>;
  /** 1: a flat pass (class colours, no dither, cut at 0.5). */
  flat: THREE.UniformNode<'float', number>;
  /** A final stand's reach (package metres: eye x, y, radius; bearing from, span in degrees); radius 0: none. */
  hide: THREE.UniformNode<'vec4', THREE.Vector4>;
  hideSpan: THREE.UniformNode<'vec2', THREE.Vector2>;
  snow: THREE.UniformNode<'float', number>;
}

/** The look's grade, shared by the far forest and the stand's own trees (graded with distance: standLook). */
export interface LookGrade { chroma: THREE.UniformNode<'float', number>; tint: THREE.UniformNode<'vec3', THREE.Vector3> }
export const lookGrade = (): LookGrade => ({ chroma: uniform(0.4), tint: uniform(new THREE.Vector3(1, 1, 1)) });

export function farUniforms(snow: THREE.UniformNode<'float', number>, grade: LookGrade = lookGrade()): FarUniforms {
  return {
    cutoff: uniform(4000), band: uniform(0.2), chroma: grade.chroma, tint: grade.tint, flat: uniform(0),
    hide: uniform(new THREE.Vector4(0, 0, 0, 0)), hideSpan: uniform(new THREE.Vector2(0, 360)), snow,
  };
}

/** The look's grade of a linear colour. */
export const graded = (c: Vec3, u: FarUniforms): Vec3 => {
  const y = dot(c, vec3(0.2126, 0.7152, 0.0722));
  return mix(vec3(y, y, y), c, u.chroma).mul(u.tint);
};
/** The share of the canopy surface's at this distance (0 trees, 1 canopy). */
export const canopyShare = (dist: Float, u: FarUniforms): Float => smoothstep(u.cutoff, u.cutoff.mul(u.band.add(1)), dist);
/** The dither the slabs and the canopy surface split a pixel by (the same pattern: one or the other, never both). */
export const splitDither = (u: FarUniforms): Float => select(u.flat.greaterThan(0.5), float(0.5), dither());
/** Whether a final stand covers a package point (x, y). */
export const hiddenByStand = (x: Float, y: Float, u: FarUniforms): ReturnType<Float['greaterThan']> => {
  const dx = x.sub(u.hide.x), dy = y.sub(u.hide.y);
  const bearing = atan(dx, dy).div(DEG);
  const rel = fract(bearing.sub(u.hideSpan.x).div(360)).mul(360);
  return u.hide.z.greaterThan(0).and(dx.mul(dx).add(dy.mul(dy)).lessThan(u.hide.z.mul(u.hide.z))).and(rel.lessThanEqual(u.hideSpan.y));
};

export interface PatchMesh {
  mesh: THREE.Mesh;
  /** Each patch's flat-pass colour (straight RGB bytes, three a patch in the patches' order); null: none. */
  setClasses(rgb: Uint8Array | null): void;
  count: number;
}

/** The slabs, one a patch (layer 0: drawn with the stand's first phase, and into the water's reflection). */
export function buildPatchMesh(patches: Patches, atlas: PatchAtlas, u: FarUniforms, receivedShadow: unknown): PatchMesh {
  const g = new THREE.InstancedBufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0], 3));
  g.setIndex([0, 1, 2, 0, 2, 3]);
  g.setAttribute('pA', new THREE.InstancedBufferAttribute(patches.a, 4));
  g.setAttribute('pB', new THREE.InstancedBufferAttribute(patches.b, 4));
  g.setAttribute('pC', new THREE.InstancedBufferAttribute(patches.c, 4));
  const classes = new THREE.InstancedBufferAttribute(new Float32Array(patches.count * 4), 4);
  g.setAttribute('pClass', classes);
  g.instanceCount = patches.count;
  const A = attribute('pA', 'vec4'), B = attribute('pB', 'vec4'), C = attribute('pC', 'vec4'), K = attribute('pClass', 'vec4');
  const frameH = uniformArray<'float'>(atlas.frameH, 'float');
  const slotOf = uniformArray<'float'>(atlas.slotOf.length ? atlas.slotOf : [0], 'float');
  const NE = PATCH_ELEVATIONS.length, ND = PATCH_CLOSURES.length;

  const vU = varying(float(0), 'vPatchU'), vV = varying(float(0), 'vPatchV');
  const vInfo = varying(vec4(0), 'vPatchInfo').setInterpolation('flat'); // (elevation degrees, closure, species slot, height scale)
  const vSeed = varying(vec4(0), 'vPatchSeed').setInterpolation('flat'); // (seed, centre distance, on, 0)
  const vRight = varying(vec3(0), 'vPatchRight').setInterpolation('flat'), vUp = varying(vec3(0), 'vPatchUp').setInterpolation('flat');
  const vClass = varying(vec3(0), 'vPatchClass').setInterpolation('flat');
  const material = new THREE.MeshLambertNodeMaterial({ side: THREE.DoubleSide, alphaTest: 0.5 });
  material.positionNode = Fn(() => {
    const corner = positionGeometry.xy;
    const centre = vec3(A.x, A.z, A.y.negate());
    const toC = centre.sub(cameraPosition);
    const dh = normalize(vec2(toC.x, toC.z).add(vec2(1e-4, 0)));
    // through the cell's front edge (half a cell towards the eye), on its ground plane
    const off = dh.mul(-PATCH_METERS / 2);
    const zF = A.z.add(B.x.mul(off.x)).add(B.y.mul(off.y.negate()));
    const front = vec3(A.x.add(off.x), zF, A.y.negate().add(off.y));
    const f = normalize(front.sub(cameraPosition));
    const right = normalize(cross(f, vec3(0, 1, 0)));
    const up = cross(right, f);
    const n = normalize(vec3(B.x.negate(), 1, B.y));
    const elev = asin(clamp(dot(f.negate(), n), 0, 1)).div(DEG);
    const scale = A.w.div(BAKE_HEIGHT);
    // the frame of the taller of the two tiles it blends (each tile's own height read in the fragment)
    const k = clamp(floor(elevIndex(elev)), 0, NE - 2);
    const h = max(frameH.element(uint(k)), frameH.element(uint(k.add(1)))).mul(scale);
    const width = float(PATCH_METERS).mul(abs(dh.x).add(abs(dh.y)));
    // (none past the cross-fade: the canopy surface draws there; nor a final stand's ground)
    const past = length(front.sub(cameraPosition)).greaterThan(u.cutoff.mul(u.band.add(1)).add(PATCH_METERS));
    const hidden = hiddenByStand(A.x, A.y, u).or(past);
    vU.assign(corner.x.sub(0.5).mul(width).div(PATCH_METERS));
    vV.assign(corner.y.mul(h));
    vInfo.assign(vec4(elev, B.z, slotOf.element(uint(B.w)), scale));
    vSeed.assign(vec4(C.x, length(front.sub(cameraPosition)), select(hidden, float(0), float(1)), 0));
    vRight.assign(right);
    vUp.assign(up);
    vClass.assign(K.xyz);
    const p = front.add(right.mul(corner.x.sub(0.5).mul(width))).add(up.mul(corner.y.mul(h).sub(scale.mul(BELOW))));
    return select(hidden, vec3(0, -1e6, 0), p);
  })();

  // one tile's (albedo, normal) at the patch's u (repeating) and v (m from the tile's bottom)
  const sample = (tile: Float, v: Float) => {
    const row = floor(tile.div(atlas.cols)), col = tile.sub(row.mul(atlas.cols));
    const fu = fract(vU.add(vSeed.x.mul(7.31)));
    const tv = v.div(frameH.element(uint(tile.mod(NE))).mul(vInfo.w));
    const uvOf = (x: Float) => vec2(x.add(col).div(atlas.cols), float(1).sub(tv).add(row).div(atlas.rows));
    const uv = uvOf(fu);
    // (derivatives of the unwrapped u: no mip jump at the seam)
    // (sharper across than up and down: the spires' sides are what reads as forest, VNS's crisp sprites; up and down
    // wider than the pixel, so the tiers of a crown merge into its spire)
    const dx = vec2(vU.dFdx().div(atlas.cols).mul(ACROSS), tv.dFdx().negate().div(atlas.rows).mul(UPDOWN)), dy = vec2(vU.dFdy().div(atlas.cols).mul(ACROSS), tv.dFdy().negate().div(atlas.rows).mul(UPDOWN));
    const inside = tv.greaterThanEqual(0.01).and(tv.lessThanEqual(0.99)); // (the mips bleed the next tile's rows in at the edges)
    const a = texture(atlas.albedo.texture, uv).grad(dx, dy);
    const nrm = texture(atlas.normals.texture, uv).grad(dx, dy);
    return { a: select(inside, a, vec4(0)), n: nrm };
  };
  const pick = () => {
    // the elevation's two tiles and the closure's two levels, each chosen per pixel by a dither (TAA blends them)
    const d1 = select(u.flat.greaterThan(0.5), float(0.5), ditherAlt(screenCoordinate.xy));
    const ep = clamp(elevIndex(vInfo.x), 0, NE - 1);
    const k = min(floor(ep).add(select(fract(ep).greaterThan(d1), float(1), float(0))), NE - 1);
    const cp = clamp(closureIndex(vInfo.y), 0, ND - 1);
    const dl = min(floor(cp).add(select(fract(cp).greaterThan(fract(d1.mul(5.7))), float(1), float(0))), ND - 1);
    const tile = vInfo.z.mul(ND).add(dl).mul(NE).add(k);
    return sample(tile, vV);
  };
  const s = pick();
  const cov = s.a.a;
  const keep = Fn(() => {
    // past the cut-off the canopy surface takes the pixel; a final stand's ground draws none
    const share = canopyShare(vSeed.y, u);
    const ok = vSeed.z.greaterThan(0.5).and(splitDither(u).greaterThanEqual(share));
    // (cut, not dithered: the dither's pattern stayed in the TAA-settled picture as hatching on the slabs' tops)
    const thr = select(u.flat.greaterThan(0.5), float(0.5), float(PATCH_CUT));
    return select(ok.and(cov.greaterThan(thr)), float(1), float(0));
  })();
  const albedo = s.a.rgb.div(max(cov, 1e-3)).div(ALBEDO_GAIN).mul(vSeed.x.mul(0.08).add(0.96));
  const dusted = mix(albedo, vec3(0.78, 0.81, 0.86).mul(dot(albedo, vec3(0.3, 0.59, 0.11)).mul(2).add(0.55)), u.snow.mul(0.2));
  material.colorNode = vec4(select(u.flat.greaterThan(0.5), vec3(0), graded(dusted, u)), keep);
  setEmissive(material, select(u.flat.greaterThan(0.5), vClass, vec3(0)));
  material.normalNode = Fn(() => {
    const nl = s.n.xyz.div(max(s.n.a, 1e-3)).mul(2).sub(1);
    const fwd = normalize(cross(vUp, vRight)); // (towards the viewer)
    const nw = normalize(vRight.mul(nl.x).add(vUp.mul(nl.y)).add(fwd.mul(nl.z)));
    return normalize(cameraViewMatrix.mul(vec4(nw, 0)).xyz);
  })();
  (material as THREE.NodeMaterial).receivedShadowNode = receivedShadow as () => THREE.Node;
  const mesh = new THREE.Mesh(g, material);
  mesh.frustumCulled = false;
  mesh.receiveShadow = true;
  mesh.name = 'stand-patches';
  return {
    mesh,
    count: patches.count,
    setClasses(rgb) {
      const arr = classes.array as Float32Array;
      if (!rgb) arr.fill(0);
      else for (let i = 0; i < patches.count; i++) arr.set([lin(rgb[i * 3]), lin(rgb[i * 3 + 1]), lin(rgb[i * 3 + 2]), 1], i * 4);
      classes.needsUpdate = true;
    },
  };
}

/** sRGB byte to linear (the flat pass's colours go out through a linear target read back as bytes: capture-math). */
const lin = (b: number): number => b / 255;

/** An elevation (degrees) as a fractional index into PATCH_ELEVATIONS. */
function elevIndex(e: Float): Float {
  const E = PATCH_ELEVATIONS;
  let out: Float = float(E.length - 1);
  for (let i = E.length - 2; i >= 0; i--) out = select(e.lessThan(E[i + 1]), float(i).add(clamp(e.sub(E[i]).div(E[i + 1] - E[i]), 0, 1)), out);
  return out;
}
/** A closure as a fractional index into PATCH_CLOSURES. */
function closureIndex(c: Float): Float {
  const L = PATCH_CLOSURES;
  let out: Float = float(L.length - 1);
  for (let i = L.length - 2; i >= 0; i--) out = select(c.lessThan(L[i + 1]), float(i).add(clamp(c.sub(L[i]).div(L[i + 1] - L[i]), 0, 1)), out);
  return out;
}

/** Each patch's flat-pass colour from the class at its centre (the stems' rule: a tree takes its ground's class). */
export function patchSeeds(patches: Patches): Float32Array {
  const xy = new Float32Array(patches.count * 2);
  for (let i = 0; i < patches.count; i++) (xy[i * 2] = patches.a[i * 4]), (xy[i * 2 + 1] = patches.a[i * 4 + 1]);
  return xy;
}
