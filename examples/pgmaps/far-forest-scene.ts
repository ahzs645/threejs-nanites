// The far forest in the scene (far-forest.ts's plan, stand-patches.ts's slabs, canopy-surface.ts's surface): built
// once a package from its stems, its canopy posts and the stand's real-crown types, then per frame only uniforms
// (the cut-off from the camera's lens and the drawing's height, the look's grade, a final stand's reach).
//   ?farforest=0   the package's aggregate stems drawn as trees again (the old far forest), for comparison
//   ?cutoffpx=     the canopy surface's cut-off in pixels of tree height (4)
import * as THREE from 'three/webgpu';
import { float, length, select, vec3 } from 'three/tsl';
import type { Float, ImpostorAtlas, NaniteType, Vec3 } from '../../src/nanite-lib/index.ts';
import {
  LOOK_GRADE, REAL_RATIO_MAX, SPECIES_CANOPY, canopyField, closureSampler, cutoffMeters, focalPixels, isAggregate, standCells, standPatches,
  type Look, type Patches, type Rgb, type StandCells, type StemTable,
} from './far-forest.ts';
import { bakePatches, buildPatchMesh, farUniforms, type FarUniforms, type LookGrade, type PatchMesh, type PatchSpecies } from './stand-patches.ts';
import { buildCanopySurface, type CanopySurface } from './canopy-surface.ts';
import { canopyFromGrid } from './ground-look.ts';
import { CANOPY_KEEP, TREE_KEEP, coverRasters, coverShareSampler } from './ground-cover.ts';
import type { CoverAtlas } from './cover-shading.ts';
import { SNAG_DENSITY_RATIO, SNAG_SPECIES, burntShareSampler, hasBurn, withSnagClosure } from './burnt.ts';
import { stemClasses, type CaptureLayer, type ClassTexture, type Rgb as CaptureRgb } from './capture-math.ts';
import type { ExtraRung } from './trees.ts';
import type { ScenePackage } from './package.ts';
import { standSampler } from './stand-palette.ts';
import { coverageCutoff } from './render-options.ts';
import type { Terrain } from './terrain.ts';

const params = new URLSearchParams(location.search);
export const FAR_FOREST = params.get('farforest') !== '0';
const CUTOFF_PX = Number(params.get('cutoffpx') ?? 4);
/** Patches reach this far from the package's eye (m): the canopy surface draws past it whatever the cut-off. */
export const PATCH_REACH = 15000;
/** The cut-off is held within these (m). */
const CUTOFF_MIN = 600;

/** The plan before the stand is grown: which stems stay trees, which real-crown rungs to grow for the patches. */
export interface FarPlan {
  cells: StandCells | null;
  /** The package's stems without the aggregates (what the Nanite stand draws). */
  trees: ScenePackage['trees'];
  extra: ExtraRung[];
  speciesRatio: (name: string) => number | undefined;
}

/** Sets the look's grade (far-forest.ts LOOK_GRADE). */
export function setGrade(g: LookGrade, look: Look): void {
  g.chroma.value = LOOK_GRADE[look].chroma;
  g.tint.value.set(...LOOK_GRADE[look].tint);
}

export function planFarForest(scene: ScenePackage): FarPlan | null {
  if (!FAR_FOREST) return null;
  const speciesRatio = (name: string) => scene.species?.[name]?.crownRatio;
  const t = scene.trees as StemTable;
  const g = scene.farTerrain ?? scene.terrain;
  const extent = { west: g.west, south: g.south, east: g.west + (g.columns - 1) * g.spacing, north: g.south + (g.rows - 1) * g.spacing };
  // (snags are never the stand drawn where no stem reaches: burnt.ts)
  const cells = standCells(t, { extent, eye: [scene.camera.position[0], scene.camera.position[1]], speciesRatio, notCommon: (name) => name === SNAG_SPECIES });
  if (!cells) return null;
  const stride = scene.trees.fields.length;
  const keep: number[] = [];
  for (let i = 0; i < scene.trees.count; i++) if (!isAggregate(t, i, speciesRatio)) keep.push(i);
  const data = new Array<number>(keep.length * stride);
  keep.forEach((i, k) => {
    for (let j = 0; j < stride; j++) data[k * stride + j] = scene.trees.data[i * stride + j];
  });
  // every species the patches may draw, at its real crown ratio (at most REAL_RATIO_MAX)
  const extra: ExtraRung[] = scene.trees.species.map((name, species) => ({ species, ratio: Math.min(REAL_RATIO_MAX, speciesRatio(name) ?? 0.17) }));
  return { cells, trees: { ...scene.trees, count: keep.length, data, ...(scene.trees.ids?{ids:keep.map(i=>scene.trees.ids![i])}:{}) }, extra, speciesRatio };
}

export interface FarForest {
  group: THREE.Group;
  u: FarUniforms;
  patches: Patches;
  patchMesh: PatchMesh;
  canopy: CanopySurface;
  /** Per frame: the cut-off from the camera's vertical field and the drawing's height (pixels). */
  update(camera: THREE.PerspectiveCamera, heightPx: number, cutoffPx?: number): number;
  setLook(look: Look): void;
  /** The flat passes' colours: each patch its ground's class (the stems' rule); null back to normal. */
  setClasses(o: { rasters: ClassTexture[]; terrain: CaptureRgb; vegetation: CaptureRgb; layers: readonly CaptureLayer[]; onWater: (x: number, y: number) => boolean } | null): void;
  /** A final stand's reach (package metres) where neither slabs nor canopy draw; null none. */
  hide(reach: { eye: [number, number]; radius: number; bearings: [number, number] } | null): void;
  /** The cut-off (m) last set. */
  cutoff(): number;
  stats: { patches: number; bakeMs: number };
  dispose(): void;
}

export interface FarInputs {
  renderer: THREE.WebGPURenderer;
  scene: ScenePackage;
  plan: FarPlan;
  terrain: Terrain;
  types: NaniteType[];
  atlas: ImpostorAtlas;
  extraTypes: Map<number, number[]>;
  snow: THREE.UniformNode<'float', number>;
  grade: LookGrade;
  receivedShadow: () => unknown;
  /** The flat pass's class drape colour at positionWorld, the terrain's colour (unlisted ground) and the vegetation's. */
  drape: { colour: Vec3; rest: THREE.UniformNode<'vec3', THREE.Vector3>; vegetation: THREE.UniformNode<'vec3', THREE.Vector3> };
  /** The grids' natural cover (the floor's, terrain.ts buildMasks): the canopy surface stays off rock, herb and shrub. */
  cover: CoverAtlas | null;
  /** The view's year as a fraction (a burn's age: burnt.ts), a uniform the environment sets. */
  viewYear?: Float;
}

export async function buildFarForest(i: FarInputs): Promise<FarForest> {
  const t0 = performance.now();
  const { scene, plan, terrain } = i;
  const cells = plan.cells!;
  const u = farUniforms(i.snow, i.grade);
  const heightAt = (x: number, y: number) => terrain.heightAt(x, -y);
  const rasters = coverRasters(scene);
  // (a burn's snag stand at least at its stand's density before the fire: burnt.ts)
  const posted = closureSampler([canopyFromGrid(scene.terrain), canopyFromGrid(scene.farTerrain), canopyFromGrid(scene.skylineTerrain)]);
  const closureAt = hasBurn(rasters) ? withSnagClosure(posted, burntShareSampler(rasters)) : posted;
  const eye: [number, number] = [scene.camera.position[0], scene.camera.position[1]];
  // the ground's share of the stand (ground-cover.ts): the slabs are trees, thinned as the stems are (none on rock or
  // water); the canopy surface keeps none on rock, herb and shrub, some on sparse forest
  const treeKeep = rasters.length ? coverShareSampler(rasters, TREE_KEEP) : undefined;
  const canopyKeep = rasters.length ? coverShareSampler(rasters, CANOPY_KEEP) : undefined;
  const standAt=standSampler([scene.terrain,scene.farTerrain,scene.skylineTerrain]);
  const patches = standPatches(cells, heightAt, closureAt, { eye, maxReach: PATCH_REACH, keepAt: treeKeep, standAt });
  // (a patch on burnt ground is a snag stand, whatever species its cell's stems led with: past the stems' reach the
  // cells take the commonest live species)
  const snagIndex = scene.trees.species.indexOf(SNAG_SPECIES);
  if (snagIndex >= 0 && hasBurn(rasters)) {
    const burntAt = burntShareSampler(rasters);
    for (let k = 0; k < patches.count; k++) if ((burntAt(patches.a[k * 4], patches.a[k * 4 + 1]) ?? 0) > 0.5) patches.b[k * 4 + 3] = snagIndex;
  }
  // bake every species a patch draws (the most common one's patches stand in for a species with no real-crown type)
  const used = new Set<number>();
  for (let k = 0; k < patches.count; k++) used.add(patches.b[k * 4 + 3]);
  // each species' patches mostly its own trees, a share the others' by how many patches they lead (a stand of one
  // species only drew each 60 m cell as a block of its own colour)
  const lead = new Map<number, number>();
  for (let k = 0; k < patches.count; k++) lead.set(patches.b[k * 4 + 3], (lead.get(patches.b[k * 4 + 3]) ?? 0) + 1);
  // (a snag stand, burnt.ts, is only snags and no live stand takes snags: a burn's edge is the cells' own)
  const snag = snagIndex;
  const species: PatchSpecies[] = [...used].sort((a, b) => a - b).flatMap((sp) => {
    const own = i.extraTypes.get(sp);
    if (!own?.length) return [];
    const types = Array.from({ length: 12 }, () => own).flat();
    for (const [j, n] of lead) {
      const theirs = i.extraTypes.get(j);
      if (!scene.terrain.stand && !scene.farTerrain?.stand && !scene.skylineTerrain?.stand && j !== sp && sp !== snag && j !== snag && theirs?.length) for (let r = 0; r < Math.round((8 * n) / patches.count); r++) types.push(...theirs);
    }
    const name = scene.trees.species[sp] ?? '';
    // (snags at the density of the live stand they were: its crowns, not their stubs, set the stems a hectare)
    const ratio = sp === snag ? SNAG_DENSITY_RATIO : Math.min(REAL_RATIO_MAX, plan.speciesRatio(name) ?? 0.17);
    return [{ species: sp, types, crownWidth: Math.max(2.5, ratio * 22) }];
  });
  const atlas = await bakePatches(i.renderer, i.atlas, i.types, species, scene.trees.species.length);
  const patchMesh = buildPatchMesh(patches, atlas, u, i.receivedShadow());
  // the canopy's colour per species: the patches' own mean albedo where baked (no step at the switch), else a palette
  const colourOf = (sp: number): Rgb => atlas.meanAlbedo[sp] ?? SPECIES_CANOPY[scene.trees.species[sp] ?? ''] ?? [0.045, 0.07, 0.045];
  const outer = terrain.ground.outer;
  const field = canopyField(outer, closureAt, cells, colourOf, { cell: 90, maxSide: 1024, keepAt: canopyKeep, standAt });
  const classColour = select(length(i.drape.colour.sub(i.drape.rest)).lessThan(1e-3), i.drape.vegetation, i.drape.colour) as Vec3;
  const canopy = buildCanopySurface(terrain.mesh.geometry, field, u, i.receivedShadow(), classColour, i.cover, i.viewYear);
  canopy.gain.value = Number(params.get('canopygain') ?? 1);
  const group = new THREE.Group();
  group.name = 'far-forest';
  group.add(patchMesh.mesh, canopy.mesh);
  patchMesh.mesh.visible = params.get('patches') !== '0';
  canopy.mesh.visible = params.get('canopy') !== '0';
  canopy.mesh.renderOrder = 1; // (with the terrain: after the stand and slabs)
  const sourceGrid=scene.farTerrain??scene.terrain;
  const median = cells.medianHeight || 22;
  let cut = 4000;
  void float, vec3;
  return {
    group, u, patches, patchMesh, canopy,
    update(camera, heightPx, cutoffPx = CUTOFF_PX) {
      const x=camera.position.x,y=-camera.position.z;
      const offset=Math.hypot(x-eye[0],y-eye[1]);
      const edge=Math.min(x-sourceGrid.west,sourceGrid.west+(sourceGrid.columns-1)*sourceGrid.spacing-x,y-sourceGrid.south,sourceGrid.south+(sourceGrid.rows-1)*sourceGrid.spacing-y);
      cut = coverageCutoff(Math.max(CUTOFF_MIN, cutoffMeters(cutoffPx, focalPixels(heightPx, camera.fov), median)),PATCH_REACH,offset,edge);
      u.cutoff.value = cut;
      return cut;
    },
    setLook(look) {
      setGrade(i.grade, look);
    },
    setClasses(o) {
      if (!o) {
        patchMesh.setClasses(null);
        return;
      }
      const xy = new Float32Array(patches.count * 2);
      for (let k = 0; k < patches.count; k++) (xy[k * 2] = patches.a[k * 4]), (xy[k * 2 + 1] = patches.a[k * 4 + 1]);
      const r = stemClasses({ stems: xy, rasters: o.rasters, terrain: o.terrain, vegetation: o.vegetation, layers: o.layers, onWater: o.onWater });
      patchMesh.setClasses(r.rgb);
    },
    hide(reach) {
      if (!reach) {
        u.hide.value.set(0, 0, 0, 0);
        return;
      }
      u.hide.value.set(reach.eye[0], reach.eye[1], reach.radius, 0);
      const span = reach.bearings[1] - reach.bearings[0];
      u.hideSpan.value.set(reach.bearings[0], Math.abs(span) >= 360 ? 360 : ((span % 360) + 360) % 360);
    },
    cutoff: () => cut,
    stats: { patches: patches.count, bakeMs: Math.round(performance.now() - t0) },
    dispose() {
      atlas.dispose();
      canopy.dispose();
      patchMesh.mesh.traverse(o=>{if(o instanceof THREE.Mesh)o.geometry.dispose();});
    },
  };
}
