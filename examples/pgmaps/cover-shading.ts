// The package's natural ground cover (ground-cover.ts) on the GPU: every grid's cover posts in one atlas (r sparse
// forest, g shrub, b herb, a rock; one-hot at the posts, so filtering blends the classes across a post's spacing;
// then the skyline grid's water), the weights at a package point with the finest grid first (faded in over its outer
// posts, so a grid's edge does not show), the skyline's sea, and the look's grade of the ground's colours. The floor (floor.ts) draws the classes from these weights;
// the canopy surface (canopy-surface.ts) reads them so it never raises rock, herb or shrub ground.
import * as THREE from 'three/webgpu';
import { float, vec2, vec4, texture, smoothstep, min, max, mix, dot, vec3, uniform, clamp } from 'three/tsl';
import type { Float, Vec2, Vec3, Vec4 } from '../../src/nanite-lib/index.ts';
import { COVER_GRADE, coverAtlas as packAtlas, coverTexels, waterTexels, type CoverRaster, type Look } from './ground-cover.ts';
import { FIRE_YEAR_BASE, FIRE_YEAR_SPAN, burnTexels, hasStandGround } from './burnt.ts';

type Bounds = { west: number; south: number; east: number; north: number };

/** A grid's section of the atlas: where its posts lie (package metres) and its first row in the atlas. */
export interface CoverSection { west: number; south: number; spacing: number; columns: number; rows: number; row: number }

/**
 * The grids' cover in one texture (ground-cover.ts coverAtlas: one sampler, where three textures took the floor past
 * WebGPU's 16 a stage): `grids` finest first, and `sea` the skyline grid's water posts with the grids inside it (whose
 * water the package draws as polygons). Filtered linearly, no mips: each grid is only drawn nearer than its posts
 * shrink under a pixel.
 */
export interface CoverAtlas {
  texture: THREE.DataTexture;
  width: number;
  height: number;
  grids: CoverSection[];
  sea: (CoverSection & { inner: Bounds }) | null;
  /**
   * Each grid's ground under its stand (burnt.ts burnTexels: r burnt, g its fire year premultiplied, b rock under a
   * standing stand), finest first; null: neither on any grid.
   */
  burn: CoverSection[] | null;
}

/**
 * `fallbackFireYear`: the fire year of a burnt post that carries none (the view's year less burnt.ts DEFAULT_BURN_AGE).
 */
export function buildCoverAtlas(rasters: readonly CoverRaster[], skyline: CoverRaster | null, inner: Bounds, fallbackFireYear = 2022): CoverAtlas | null {
  if (!rasters.length) return null;
  const parts = rasters.map((raster) => ({ raster, texels: coverTexels }));
  if (skyline) parts.push({ raster: skyline, texels: waterTexels });
  const burnt = hasStandGround(rasters);
  if (burnt) for (const raster of rasters) parts.push({ raster, texels: (c: CoverRaster) => burnTexels(c, fallbackFireYear) });
  const a = packAtlas(parts);
  const t = new THREE.DataTexture(a.data, a.width, a.height);
  t.magFilter = THREE.LinearFilter;
  t.minFilter = THREE.LinearFilter;
  t.generateMipmaps = false;
  t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;
  t.needsUpdate = true;
  const section = (c: CoverRaster, i: number): CoverSection => ({ west: c.west, south: c.south, spacing: c.spacing, columns: c.columns, rows: c.rows, row: a.sections[i].row });
  const firstBurn = rasters.length + (skyline ? 1 : 0);
  return {
    texture: t, width: a.width, height: a.height, grids: rasters.map(section),
    sea: skyline ? { ...section(skyline, rasters.length), inner } : null,
    burn: burnt ? rasters.map((c, i) => section(c, firstBurn + i)) : null,
  };
}

/** A section's texels at package point `pkg`: the atlas sample (clamped half a texel inside) and how far inside the grid (posts). */
function sample(atlas: CoverAtlas, c: CoverSection, pkg: Vec2, vertex: boolean): { t: Vec4; posts: Float } {
  const gx = pkg.x.sub(c.west).div(c.spacing), gy = pkg.y.sub(c.south).div(c.spacing);
  const posts = min(min(gx.add(0.5), float(c.columns - 0.5).sub(gx)), min(gy.add(0.5), float(c.rows - 0.5).sub(gy)));
  const u = clamp(gx.add(0.5), 0.5, c.columns - 0.5).div(atlas.width);
  const v = clamp(gy.add(0.5), 0.5, c.rows - 0.5).add(c.row).div(atlas.height);
  const node = texture(atlas.texture, vec2(u, v));
  return { t: (vertex ? node.level(float(0)) : node) as unknown as Vec4, posts: posts as Float };
}

/**
 * The cover weights (sparse, shrub, herb, rock) at package point `pkg` (x east, y north), finest grid first: each
 * grid over the coarser ones, faded in over its outer two posts. `vertex`: at the top level (no derivatives there).
 */
export function coverWeights(atlas: CoverAtlas, pkg: Vec2, vertex = false): Vec4 {
  let w: Vec4 = vec4(0, 0, 0, 0);
  for (const c of [...atlas.grids].reverse()) {
    const { t, posts } = sample(atlas, c, pkg, vertex);
    w = mix(w, t, smoothstep(0.5, 2.5, posts)) as Vec4;
  }
  return w;
}

/**
 * The burn at package point `pkg` (x east, y north), finest grid first as coverWeights: x the burnt share, y the years
 * since the fire at the view's year `viewYear` (the posts' fire year, read back from the premultiplied texels and
 * rounded to the year, counted from its midsummer, burnt.ts burnAge); `rocky` the share of rock showing under a
 * standing stand (ground-cover.ts rockyStand). (0, 0, 0) where neither.
 */
export function burnAt(atlas: CoverAtlas, pkg: Vec2, viewYear: Float, vertex = false): { share: Float; age: Float; rocky: Float } {
  if (!atlas.burn) return { share: float(0), age: float(0), rocky: float(0) };
  let w: Vec4 = vec4(0, 0, 0, 0);
  for (const c of [...atlas.burn].reverse()) {
    const { t, posts } = sample(atlas, c, pkg, vertex);
    w = mix(w, t, smoothstep(0.5, 2.5, posts)) as Vec4;
  }
  const year = w.y.div(max(w.x, 1 / 255)).mul(FIRE_YEAR_SPAN).add(FIRE_YEAR_BASE).round();
  return { share: w.x as Float, age: max(viewYear.sub(year.add(0.6)), 0) as Float, rocky: w.z as Float };
}

/**
 * The skyline's sea at package point `pkg`: its water posts' share, faded out inside the inner grids over `fade`
 * metres (their lakes and sea are the water polygons, shore and all).
 */
export function skylineWater(atlas: CoverAtlas, pkg: Vec2, fade = 300): Float {
  const c = atlas.sea;
  if (!c) return float(0);
  const b = c.inner;
  const { t, posts } = sample(atlas, c, pkg, false);
  const inside = min(min(pkg.x.sub(b.west), float(b.east).sub(pkg.x)), min(pkg.y.sub(b.south), float(b.north).sub(pkg.y)));
  return t.x.mul(smoothstep(0.5, 1.5, posts)).mul(float(1).sub(smoothstep(-fade, 0, inside))) as Float;
}

/**
 * The look's grade of the natural ground (ground-cover.ts COVER_GRADE): chroma kept and a tint; `via` 1 under the
 * `via` look (fresh cuts painted as the renders paint them, ground-look.ts VIA_CUT), 0 under `photo`; `viewYear` the
 * environment's year as a fraction (the burns' ages, burnt.ts).
 */
export interface CoverGrade {
  chroma: THREE.UniformNode<'float', number>;
  tint: THREE.UniformNode<'vec3', THREE.Vector3>;
  via: THREE.UniformNode<'float', number>;
  viewYear: THREE.UniformNode<'float', number>;
}
export const coverGrade = (): CoverGrade => ({ chroma: uniform(1), tint: uniform(new THREE.Vector3(1, 1, 1)), via: uniform(1), viewYear: uniform(2025.5) });
export function setCoverGrade(g: CoverGrade, look: Look, viewYear?: number | null): void {
  g.chroma.value = COVER_GRADE[look].chroma;
  g.tint.value.set(...COVER_GRADE[look].tint);
  g.via.value = look === 'via' ? 1 : 0;
  if (typeof viewYear === 'number' && Number.isFinite(viewYear)) g.viewYear.value = viewYear;
}
export const gradedCover = (c: Vec3, g: CoverGrade): Vec3 => {
  const y: Float = dot(c, vec3(0.2126, 0.7152, 0.0722));
  return mix(vec3(y, y, y), c, g.chroma).mul(g.tint) as Vec3;
};
