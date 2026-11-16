// The package's ground as a mesh (its grid, gaps filled from their nearest known neighbours, and an apron out to the
// fog so the grid's edge never shows), and the ground's masks near the stand: canopy cover from the stems' crowns, the
// openings (cut blocks) and the road's cut and fill slopes, rasterized into one texture the floor reads (floor.ts).
import * as THREE from 'three/webgpu';
import type { Ring, ScenePackage } from './package.ts';
import { APRON, buildGround, type Ground, type GridBounds } from './ground-grid.ts';
import { canopyFromGrid, canopyFromStems, canopyTexels, cutAgeOf, encodeAge, retainedShareOf, type CanopyRaster } from './ground-look.ts';
import { coverFromGrid, coverRasters } from './ground-cover.ts';
import { buildCoverAtlas, type CoverAtlas } from './cover-shading.ts';
import { fallbackFireYear } from './burnt.ts';

/** The apron's reach past the outermost grid (m): ground with no data of its own. */
export const APRON_METERS = APRON[APRON.length - 1];

export interface Terrain {
  mesh: THREE.Mesh;
  /** The ground's height at three's x, z (north is -z). */
  heightAt: (x: number, z: number) => number;
  /** The package's detailed grid's extent (package metres). */
  bounds: GridBounds;
  /** The far grid's extent (`farTerrain`), when the package carries one. */
  farBounds: GridBounds | null;
  /** The skyline grid's extent (`skylineTerrain`), when the package carries one. */
  skylineBounds: GridBounds | null;
  /** The heights, their sources and the mesh's lines (ground-grid.ts). */
  ground: Ground;
  /** Each of the package's water bodies' surface (m), in the package's order (the ground under them is lowered). */
  waterLevels: number[];
}

export function buildTerrain(scene: ScenePackage): Terrain {
  const ground = buildGround(scene.terrain, scene.farTerrain, scene.skylineTerrain);
  const { west, south, spacing, columns, rows } = scene.terrain;
  const h = ground.near.h;
  const at = (c: number, r: number): number => h[r * columns + c];
  const heightNE = ground.heightAt;
  // the water's levels (none given: the lowest ground on its outer ring), then the ground under it lowered to a bed
  // below that level, so a surface on sloping ground isn't buried in it
  const water = (scene.water ?? []).filter((w) => Array.isArray(w?.rings) && w.rings[0]?.length >= 3);
  const waterLevels = water.map((w) => w.elevationMeters ?? Math.min(...w.rings[0].map(([x, y]) => heightNE(x, y))));
  water.forEach((w, k) => {
    const [outer, ...holes] = w.rings;
    const xs0 = outer.map((p) => p[0]), ys0 = outer.map((p) => p[1]);
    const c0 = Math.max(0, Math.floor((Math.min(...xs0) - west) / spacing)), c1 = Math.min(columns - 1, Math.ceil((Math.max(...xs0) - west) / spacing));
    const r0 = Math.max(0, Math.floor((Math.min(...ys0) - south) / spacing)), r1 = Math.min(rows - 1, Math.ceil((Math.max(...ys0) - south) / spacing));
    for (let r = r0; r <= r1; r++)
      for (let c = c0; c <= c1; c++) {
        const x = west + c * spacing, y = south + r * spacing;
        if (!inRing(x, y, outer) || holes.some((hole) => inRing(x, y, hole))) continue;
        h[r * columns + c] = Math.min(at(c, r), waterLevels[k] - 2);
      }
  });
  // one mesh: the grid's own vertices, the far grid's past them, then the apron's rings (one surface, no seam)
  const { xs, ys } = ground;
  const nx = xs.length, ny = ys.length;
  const pos = new Float32Array(nx * ny * 3);
  for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) pos.set([xs[i], heightNE(xs[i], ys[j]), -ys[j]], (j * nx + i) * 3);
  const idx = new Uint32Array((nx - 1) * (ny - 1) * 6);
  let k = 0;
  for (let j = 0; j < ny - 1; j++)
    for (let i = 0; i < nx - 1; i++) {
      const a = j * nx + i, b = a + 1, c = a + nx, d = c + 1;
      // (north is -z: counter-clockwise seen from above)
      idx.set([a, b, c, b, d, c], k);
      k += 6;
    }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geometry.setIndex(new THREE.BufferAttribute(idx, 1));
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
  const mesh = new THREE.Mesh(geometry);
  mesh.receiveShadow = true;
  mesh.frustumCulled = false;
  return { mesh, heightAt: (x, z) => heightNE(x, -z), bounds: ground.near.bounds, farBounds: ground.far?.bounds ?? null, skylineBounds: ground.skyline?.bounds ?? null, ground, waterLevels };
}

/** Whether package (x, y) is inside a ring (even-odd). */
export function inRing(x: number, y: number, ring: Ring): boolean {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i], [xj, yj] = ring[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

export interface MaskSquare {
  /** r canopy cover, g opening, b road cut, a road fill (0..1), north at the top row. */
  texture: THREE.DataTexture;
  /**
   * The openings' age and dispersed retention, each premultiplied by the opening's own coverage (g): r the age
   * (encodeAge: divide by g), g the retained share (ground-look.ts).
   */
  cuts: THREE.DataTexture;
  /** The square it covers (package metres): its west and north edges and side. */
  west: number;
  north: number;
  side: number;
}

export interface GroundMasks extends MaskSquare {
  /**
   * The far stand's canopy cover (r) and openings (g) past the near square, coarse, over every stem (a capture's
   * package, whose stems reach kilometres out); null when the stems all lie in the near square (the live package).
   */
  far: MaskSquare | null;
  /** Crown closure past the near square, by priority: the detailed grid's `canopy`, the far grid's, the skyline
   * grid's, the stems'. */
  canopy: { near: CanopyTexture | null; far: CanopyTexture | null; skyline: CanopyTexture | null; stems: CanopyTexture | null };
  /** The grids' natural cover (ground-cover.ts) and the skyline's sea, in one atlas; null when the package carries none. */
  cover: CoverAtlas | null;
}

/** The near square holds the stems and rings within this of the eye (m): the live package's 600 m of stems and more. */
export const NEAR_MASK_METERS = 900;

/**
 * The masks over the stems, openings and road scars near the eye (a square, at most 2048 texels a side, 0.5 m texels
 * or coarser), and a coarse square over the rest of the stems and openings when they reach further. The crowns' cover
 * is each stem's crown as a disc. `viewYear`: the view's year, for burns that carry no fire year (burnt.ts).
 */
export function buildMasks(scene: ScenePackage, bounds: GridBounds, farBounds: GridBounds | null = null, viewYear = 2025.5): GroundMasks {
  const [ex, ey] = scene.camera?.position ?? [0, 0];
  const { fields, data, count } = scene.trees;
  const st = fields.length, fx = fields.indexOf('x'), fy = fields.indexOf('y'), fw = fields.indexOf('crownWidth'), fh = fields.indexOf('height');
  const rings: Ring[] = [];
  for (const o of scene.openings ?? []) rings.push(...o.rings);
  for (const s of scene.roadScars ?? []) rings.push(s.ring);
  const near = (x: number, y: number) => Math.hypot(x - ex, y - ey) <= NEAR_MASK_METERS;
  const box = () => ({ x0: Infinity, x1: -Infinity, y0: Infinity, y1: -Infinity });
  const nb = box(), all = box();
  const add = (b: ReturnType<typeof box>, x: number, y: number, r = 0): void => {
    (b.x0 = Math.min(b.x0, x - r)), (b.x1 = Math.max(b.x1, x + r)), (b.y0 = Math.min(b.y0, y - r)), (b.y1 = Math.max(b.y1, y + r));
  };
  for (let i = 0; i < count; i++) {
    const x = data[i * st + fx], y = data[i * st + fy];
    add(all, x, y, 20);
    if (near(x, y)) add(nb, x, y, 20);
  }
  for (const r of rings)
    for (const [x, y] of r) {
      add(all, x, y, 10);
      if (near(x, y)) add(nb, x, y, 10);
    }
  if (!Number.isFinite(nb.x0)) add(nb, ex, ey, 100);
  const crown = (i: number) => {
    const o = i * st, w = fw >= 0 ? data[o + fw] : (fh >= 0 ? data[o + fh] * 0.25 : 4);
    return Math.max(0.8, w * 0.55);
  };
  const polygon = (g: OffscreenCanvasRenderingContext2D, rs: Ring[]): void => {
    g.beginPath();
    for (const r of rs) r.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y)));
    g.fill('evenodd');
  };
  type Layer = (g: OffscreenCanvasRenderingContext2D) => void;
  /** A square over `b` (clipped to `clip`) of at most 2048 texels, none finer than `minTexel`. */
  const square = (b: ReturnType<typeof box>, clip: GridBounds, minTexel: number, layers: Layer[], cutLayers: Layer[]): MaskSquare => {
    const x0 = Math.max(b.x0, clip.west), x1 = Math.min(b.x1, clip.east), y0 = Math.max(b.y0, clip.south), y1 = Math.min(b.y1, clip.north);
    const side = Math.max(x1 - x0, y1 - y0, 50);
    const N = Math.min(2048, Math.max(64, Math.ceil(side / minTexel)));
    const texel = side / N;
    const canvas = (draw: (g: OffscreenCanvasRenderingContext2D) => void): Uint8ClampedArray => {
      const c = new OffscreenCanvas(N, N), g = c.getContext('2d')!;
      g.setTransform(1 / texel, 0, 0, -1 / texel, -x0 / texel, (y0 + side) / texel); // (package metres; north up)
      g.fillStyle = '#fff';
      draw(g);
      // (softened by about a metre: the floor's noise makes the edge ragged)
      const soft = new OffscreenCanvas(N, N), s = soft.getContext('2d', { willReadFrequently: true })!;
      s.filter = `blur(${Math.max(0.6, 1 / texel).toFixed(2)}px)`;
      s.drawImage(c, 0, 0);
      return s.getImageData(0, 0, N, N).data;
    };
    const raster = (ls: Layer[]): THREE.DataTexture => {
      const px = new Uint8Array(N * N * 4);
      ls.forEach((draw, k) => {
        const d = canvas(draw);
        for (let i = 0; i < N * N; i++) px[i * 4 + k] = d[i * 4];
      });
      const texture = new THREE.DataTexture(px, N, N);
      texture.magFilter = THREE.LinearFilter;
      texture.minFilter = THREE.LinearMipmapLinearFilter;
      texture.generateMipmaps = true;
      texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
      texture.needsUpdate = true;
      return texture;
    };
    return { texture: raster(layers), cuts: raster(cutLayers), west: x0, north: y0 + side, side };
  };
  /** Each opening filled with a grey of `value` (its age, its retention): premultiplied by the softened coverage. */
  const byOpening = (value: (o: NonNullable<ScenePackage['openings']>[number]) => number): Layer => (g) =>
    (scene.openings ?? []).forEach((o) => {
      const v = Math.round(Math.min(1, Math.max(0, value(o))) * 255);
      g.fillStyle = `rgb(${v},${v},${v})`;
      polygon(g, o.rings);
    });
  const cutLayers = [byOpening((o) => encodeAge(cutAgeOf(o))), byOpening(retainedShareOf)];
  const cover = (keep: (x: number, y: number) => boolean) => (g: OffscreenCanvasRenderingContext2D) => {
    for (let i = 0; i < count; i++) {
      const x = data[i * st + fx], y = data[i * st + fy];
      if (!keep(x, y)) continue;
      g.beginPath();
      g.arc(x, y, crown(i), 0, Math.PI * 2);
      g.fill();
    }
  };
  const nearSquare = square(nb, bounds, 0.5, [
    cover((x, y) => x >= nb.x0 - 20 && x <= nb.x1 + 20 && y >= nb.y0 - 20 && y <= nb.y1 + 20),
    (g) => (scene.openings ?? []).forEach((o) => polygon(g, o.rings)),
    (g) => (scene.roadScars ?? []).filter((s) => s.kind === 'cut').forEach((s) => polygon(g, [s.ring])),
    (g) => (scene.roadScars ?? []).filter((s) => s.kind !== 'cut').forEach((s) => polygon(g, [s.ring])),
  ], cutLayers);
  // the far square only when the stems or openings reach well past the near one
  const reaches = all.x0 < nb.x0 - 200 || all.x1 > nb.x1 + 200 || all.y0 < nb.y0 - 200 || all.y1 > nb.y1 + 200;
  const farClip = farBounds ?? bounds;
  const far = reaches
    ? square(all, { west: Math.min(farClip.west, bounds.west), south: Math.min(farClip.south, bounds.south), east: Math.max(farClip.east, bounds.east), north: Math.max(farClip.north, bounds.north) }, 2, [
        cover(() => true),
        (g) => (scene.openings ?? []).forEach((o) => polygon(g, o.rings)),
      ], cutLayers)
    : null;
  // crown closure: the package's own posts, else the stems' crowns over the far square (finer than its clumps)
  const skyCover = coverFromGrid(scene.skylineTerrain);
  const nearCanopy = canopyFromGrid(scene.terrain), farCanopy = canopyFromGrid(scene.farTerrain), skyCanopy = canopyFromGrid(scene.skylineTerrain);
  const stemSquare = far ?? nearSquare;
  const stemCanopy = !nearCanopy && !farCanopy && !skyCanopy
    ? canopyFromStems(scene, { west: stemSquare.west, south: stemSquare.north - stemSquare.side, east: stemSquare.west + stemSquare.side, north: stemSquare.north }, Math.max(10, stemSquare.side / 2048))
    : null;
  return {
    ...nearSquare, far, canopy: { near: canopyTexture(nearCanopy), far: canopyTexture(farCanopy), skyline: canopyTexture(skyCanopy), stems: canopyTexture(stemCanopy) },
    cover: buildCoverAtlas(coverRasters(scene), skyCover, farBounds ?? bounds, fallbackFireYear(viewYear)),
  };
}

/** A closure raster as a texture (r closure premultiplied by g known; row 0 the south row) and where it lies. */
export interface CanopyTexture { texture: THREE.DataTexture; west: number; south: number; spacing: number; columns: number; rows: number }

function canopyTexture(c: CanopyRaster | null): CanopyTexture | null {
  if (!c) return null;
  const texture = new THREE.DataTexture(canopyTexels(c), c.columns, c.rows);
  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.generateMipmaps = true;
  texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.needsUpdate = true;
  return { texture, west: c.west, south: c.south, spacing: c.spacing, columns: c.columns, rows: c.rows };
}
