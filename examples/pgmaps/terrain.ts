// The package's ground as a mesh (its grid, gaps filled from their nearest known neighbours, and an apron out to the
// fog so the grid's edge never shows), and the ground's masks near the stand: canopy cover from the stems' crowns, the
// openings (cut blocks) and the road's cut and fill slopes, rasterized into one texture the floor reads (floor.ts).
import * as THREE from 'three/webgpu';
import type { Ring, ScenePackage } from './package.ts';

/** How far the apron reaches past the grid (m), in rings of these distances from its edge. */
const APRON = [250, 700, 1600, 3500, 8000, 16000];

export interface Terrain {
  mesh: THREE.Mesh;
  /** The ground's height at three's x, z (north is -z). */
  heightAt: (x: number, z: number) => number;
  /** The package grid's extent (package metres). */
  bounds: { west: number; south: number; east: number; north: number };
  /** Each of the package's water bodies' surface (m), in the package's order (the ground under them is lowered). */
  waterLevels: number[];
}

export function buildTerrain(scene: ScenePackage): Terrain {
  const { west, south, spacing, columns, rows } = scene.terrain;
  const h = scene.terrain.heights.slice();
  const fill = (index: (i: number, j: number) => number, outer: number, inner: number): void => {
    for (let i = 0; i < outer; i++) {
      let last: number | null = null;
      for (let j = 0; j < inner; j++) last = h[index(i, j)] ?? last;
      for (let j = inner - 1; j >= 0; j--) {
        const k = index(i, j);
        if (h[k] === null) h[k] = last;
        else last = h[k];
      }
    }
  };
  fill((r, c) => r * columns + c, rows, columns);
  fill((c, r) => r * columns + c, columns, rows);
  const known = h.filter((v): v is number => v !== null);
  const mean = known.reduce((s, v) => s + v, 0) / Math.max(1, known.length);
  const at = (c: number, r: number): number => h[r * columns + c] ?? mean;
  /** Package x (east), y (north). Past the grid: its edge's height, easing to the grid's mean far out. */
  const heightNE = (x: number, y: number): number => {
    const gx = (x - west) / spacing, gy = (y - south) / spacing;
    const cx = Math.min(columns - 1.0001, Math.max(0, gx)), cy = Math.min(rows - 1.0001, Math.max(0, gy));
    const x0 = Math.floor(cx), y0 = Math.floor(cy), fx = cx - x0, fy = cy - y0;
    const v = at(x0, y0) * (1 - fx) * (1 - fy) + at(x0 + 1, y0) * fx * (1 - fy) + at(x0, y0 + 1) * (1 - fx) * fy + at(x0 + 1, y0 + 1) * fx * fy;
    const out = Math.max(Math.abs(gx - cx), Math.abs(gy - cy)) * spacing;
    return out > 0 ? v + (mean - v) * Math.min(1, out / 9000) : v;
  };
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
  const east = west + (columns - 1) * spacing, north = south + (rows - 1) * spacing;
  // the grid's own vertices, then the apron's rings on each side
  const xs = [...APRON.slice().reverse().map((d) => west - d), ...Array.from({ length: columns }, (_, i) => west + i * spacing), ...APRON.map((d) => east + d)];
  const ys = [...APRON.slice().reverse().map((d) => south - d), ...Array.from({ length: rows }, (_, i) => south + i * spacing), ...APRON.map((d) => north + d)];
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
  return { mesh, heightAt: (x, z) => heightNE(x, -z), bounds: { west, south, east, north }, waterLevels };
}

/** Whether package (x, y) is inside a ring (even-odd). */
function inRing(x: number, y: number, ring: Ring): boolean {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i], [xj, yj] = ring[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

export interface GroundMasks {
  /** r canopy cover, g opening, b road cut, a road fill (0..1), north at the top row. */
  texture: THREE.DataTexture;
  /** The square it covers (package metres): its west and north edges and side. */
  west: number;
  north: number;
  side: number;
}

/**
 * The masks over the stems, openings and road scars (a square, at most 2048 texels a side, 0.5 m texels or coarser).
 * The crowns' cover is each stem's crown as a disc.
 */
export function buildMasks(scene: ScenePackage, bounds: Terrain['bounds']): GroundMasks {
  let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
  const add = (x: number, y: number, r = 0): void => {
    (x0 = Math.min(x0, x - r)), (x1 = Math.max(x1, x + r)), (y0 = Math.min(y0, y - r)), (y1 = Math.max(y1, y + r));
  };
  const { fields, data, count } = scene.trees;
  const st = fields.length, fx = fields.indexOf('x'), fy = fields.indexOf('y'), fw = fields.indexOf('crownWidth'), fh = fields.indexOf('height');
  for (let i = 0; i < count; i++) add(data[i * st + fx], data[i * st + fy], 20);
  const rings: Ring[] = [];
  for (const o of scene.openings ?? []) rings.push(...o.rings);
  for (const s of scene.roadScars ?? []) rings.push(s.ring);
  for (const r of rings) for (const [x, y] of r) add(x, y, 10);
  if (!Number.isFinite(x0)) add(0, 0, 100);
  (x0 = Math.max(x0, bounds.west)), (x1 = Math.min(x1, bounds.east)), (y0 = Math.max(y0, bounds.south)), (y1 = Math.min(y1, bounds.north));
  const side = Math.max(x1 - x0, y1 - y0, 50);
  const N = Math.min(2048, Math.max(64, Math.ceil(side / 0.5)));
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
  const polygon = (g: OffscreenCanvasRenderingContext2D, rs: Ring[]): void => {
    g.beginPath();
    for (const r of rs) r.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y)));
    g.fill('evenodd');
  };
  const cover = canvas((g) => {
    for (let i = 0; i < count; i++) {
      const o = i * st, w = fw >= 0 ? data[o + fw] : (fh >= 0 ? data[o + fh] * 0.25 : 4);
      g.beginPath();
      g.arc(data[o + fx], data[o + fy], Math.max(0.8, w * 0.55), 0, Math.PI * 2);
      g.fill();
    }
  });
  const open = canvas((g) => (scene.openings ?? []).forEach((o) => polygon(g, o.rings)));
  const cut = canvas((g) => (scene.roadScars ?? []).filter((s) => s.kind === 'cut').forEach((s) => polygon(g, [s.ring])));
  const fillMask = canvas((g) => (scene.roadScars ?? []).filter((s) => s.kind !== 'cut').forEach((s) => polygon(g, [s.ring])));
  const px = new Uint8Array(N * N * 4);
  for (let i = 0; i < N * N; i++) {
    px[i * 4] = cover[i * 4];
    px[i * 4 + 1] = open[i * 4];
    px[i * 4 + 2] = cut[i * 4];
    px[i * 4 + 3] = fillMask[i * 4];
  }
  const texture = new THREE.DataTexture(px, N, N);
  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.generateMipmaps = true;
  texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.needsUpdate = true;
  return { texture, west: x0, north: y0 + side, side };
}
