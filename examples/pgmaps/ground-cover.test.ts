import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  ATLAS_GAP, CANOPY_KEEP, COVER, COVER_GRADE, ROCKY_STAND_CLOSURE, TREE_KEEP, coverAt, coverAtlas, coverCounts, coverFromGrid, coverRasters, coverShareSampler, coverTexels, gradeCover,
  keptStems, skylineSea, stemDraw, syntheticCover, thinSceneByCover, thinStems, waterTexels,
} from './ground-cover.ts'
import type { ScenePackage } from './package.ts'

// a 3 x 2 grid at 10 m: forest, rock, herb (south row); shrub, sparse, unknown (north row)
const grid = { west: 0, south: 0, spacing: 10, columns: 3, rows: 2, heights: [0, 0, 0, 0, 0, 0], cover: [0, 4, 3, 2, 1, null] }

test("a grid's cover posts become a raster (-1 unknown); none, a bad length or no known post give none", () => {
  const c = coverFromGrid(grid)!
  assert.deepEqual([...c.code], [0, 4, 3, 2, 1, -1])
  assert.equal(coverFromGrid({ ...grid, cover: undefined }), null)
  assert.equal(coverFromGrid({ ...grid, cover: [0] }), null)
  assert.equal(coverFromGrid({ ...grid, cover: [null, null, null, 9, null, null] }), null)
  assert.deepEqual(coverCounts([c]), { forest: 1, sparse: 1, shrub: 1, herb: 1, rock: 1, water: 0, cut: 0, burnt: 0, rockyStand: 0, unknown: 1 })
  assert.equal(coverCounts([]), null)
})

test('rock and water keep no trees and no canopy; herb, shrub and sparse are thinned; forest, cut and unknown keep all', () => {
  assert.equal(TREE_KEEP[COVER.rock], 0)
  assert.equal(TREE_KEEP[COVER.water], 0)
  assert.equal(TREE_KEEP[COVER.forest], 1)
  assert.equal(TREE_KEEP[COVER.cut], 1)
  for (const k of [COVER.sparse, COVER.shrub, COVER.herb]) assert.ok(TREE_KEEP[k] > 0 && TREE_KEEP[k] < 1)
  assert.ok(TREE_KEEP[COVER.herb] < TREE_KEEP[COVER.shrub] && TREE_KEEP[COVER.shrub] < TREE_KEEP[COVER.sparse])
  // the canopy surface never raises rock, herb or shrub ground
  for (const k of [COVER.rock, COVER.water, COVER.herb, COVER.shrub]) assert.equal(CANOPY_KEEP[k], 0)
  assert.ok(CANOPY_KEEP[COVER.sparse] > 0 && CANOPY_KEEP[COVER.sparse] < 1)
})

test('the keep share is the post value at a post, bilinear between, unknown posts taking the default, null outside', () => {
  const keep = coverShareSampler([coverFromGrid(grid)!], TREE_KEEP)
  assert.equal(keep(0, 0), 1)
  assert.equal(keep(10, 0), 0)
  assert.equal(keep(5, 0), 0.5)
  assert.equal(keep(20, 10), 1) // (unknown)
  assert.equal(keep(-1, 0), null)
  assert.equal(keep(0, 11), null)
  assert.equal(coverAt([coverFromGrid(grid)!], 9, 1), COVER.rock)
  assert.equal(coverAt([coverFromGrid(grid)!], 20, 10), null)
})

test('the finest grid that holds a point answers; a coarser one only past it', () => {
  const fine = coverFromGrid({ ...grid, cover: [4, 4, 4, 4, 4, 4] })!
  const coarse = coverFromGrid({ west: -100, south: -100, spacing: 100, columns: 3, rows: 3, heights: Array(9).fill(0), cover: Array(9).fill(0) })!
  const keep = coverShareSampler([fine, coarse], TREE_KEEP)
  assert.equal(keep(5, 5), 0)
  assert.equal(keep(50, 50), 1)
  assert.deepEqual(coverRasters({ terrain: { ...grid, cover: undefined }, farTerrain: { ...grid } } as unknown as ScenePackage).length, 1)
})

test("a stem's draw is its place's: the same every time, spread evenly", () => {
  assert.equal(stemDraw(12.34, -56.7), stemDraw(12.34, -56.7))
  let under = 0
  for (let i = 0; i < 4000; i++) if (stemDraw(i * 3.1, (i % 37) * 7.3) < 0.3) under++
  assert.ok(Math.abs(under / 4000 - 0.3) < 0.03, `${under}`)
})

test('thinning: no stems kept on rock, about the keep share on herb, all on forest; thinning twice changes nothing', () => {
  const rock = coverFromGrid({ west: 0, south: 0, spacing: 100, columns: 2, rows: 2, heights: [0, 0, 0, 0], cover: [4, 4, 4, 4] })!
  const herb = coverFromGrid({ west: 200, south: 0, spacing: 100, columns: 2, rows: 2, heights: [0, 0, 0, 0], cover: [3, 3, 3, 3] })!
  const data: number[] = []
  for (let i = 0; i < 2000; i++) data.push((i % 50) * 2 + 0.3, Math.floor(i / 50) * 2.5 + 0.1, 0, 0, 20, 4, 0.5) // (rock)
  for (let i = 0; i < 2000; i++) data.push(200 + (i % 50) * 2 + 0.3, Math.floor(i / 50) * 2.5 + 0.1, 0, 0, 20, 4, 0.5) // (herb)
  for (let i = 0; i < 500; i++) data.push(500 + i, 50, 0, 0, 20, 4, 0.5) // (outside the grids: kept)
  const t = { fields: ['x', 'y', 'z', 'species', 'height', 'crownWidth', 'tone'], species: ['spruce'], count: data.length / 7, data }
  const keepAt = coverShareSampler([rock, herb], TREE_KEEP)
  const kept = keptStems(t, keepAt)
  const onRock = kept.filter((i) => i < 2000).length, onHerb = kept.filter((i) => i >= 2000 && i < 4000).length, outside = kept.filter((i) => i >= 4000).length
  assert.equal(onRock, 0)
  assert.ok(Math.abs(onHerb / 2000 - TREE_KEEP[COVER.herb]) < 0.03, `${onHerb}`)
  assert.equal(outside, 500)
  const once = thinStems(t, keepAt)
  assert.equal(once.removed, t.count - kept.length)
  assert.equal(once.table.count, kept.length)
  assert.equal(thinStems(once.table, keepAt).removed, 0)
  // a Float32Array table stays one (the final stand's)
  const f32 = thinStems({ ...t, data: Float32Array.from(data) }, keepAt)
  assert.ok(f32.table.data instanceof Float32Array)
  assert.equal(f32.table.count, kept.length)
})

test('a package without cover is left as it is', () => {
  const scene = { terrain: { ...grid, cover: undefined }, trees: { fields: ['x', 'y'], species: [], count: 1, data: [10, 0] } } as unknown as ScenePackage
  const r = thinSceneByCover(scene)
  assert.equal(r.scene, scene)
  assert.equal(r.removed, 0)
  const withCover = { ...scene, terrain: grid } as unknown as ScenePackage
  assert.equal(thinSceneByCover(withCover).scene.trees.count, 0) // (the stem stands on a rock post)
})

test('texels: one channel per drawn class (sparse, shrub, herb, rock), forest and unknown none', () => {
  const px = coverTexels(coverFromGrid(grid)!)
  assert.deepEqual([...px.slice(0, 4)], [0, 0, 0, 0]) // forest
  assert.deepEqual([...px.slice(4, 8)], [0, 0, 0, 255]) // rock
  assert.deepEqual([...px.slice(8, 12)], [0, 0, 255, 0]) // herb
  assert.deepEqual([...px.slice(12, 16)], [0, 255, 0, 0]) // shrub
  assert.deepEqual([...px.slice(16, 20)], [255, 0, 0, 0]) // sparse
  assert.deepEqual([...px.slice(20, 24)], [0, 0, 0, 0]) // unknown
})

test("the look's grade: via keeps the renders' colours, photo mutes them and keeps their brightness", () => {
  const herb: [number, number, number] = [0.2, 0.22, 0.06]
  assert.deepEqual(gradeCover(herb, 'via'), herb)
  const p = gradeCover(herb, 'photo')
  const sat = (c: number[]) => (Math.max(...c) - Math.min(...c)) / Math.max(...c)
  assert.ok(sat(p) < sat(herb))
  const lum = (c: number[]) => 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]
  assert.ok(Math.abs(lum(p) - lum(herb)) / lum(herb) < 0.06)
  assert.equal(COVER_GRADE.via.chroma, 1)
})

test('the stand-in cover: a bluff is rock, open ground herb, a closed stand forest, unknown ground unknown', () => {
  // a 4 x 3 grid at 10 m: a 20 m step between columns 1 and 2 (63°), flat elsewhere
  const heights = [0, 0, 20, 20, 0, 0, 20, 20, 0, 0, 20, 20]
  const canopy = [0.6, 0.6, 0.6, 0, 0.6, 0.6, 0.6, 0.1, 0.6, 0.6, 0.6, null]
  const out = syntheticCover({ west: 0, south: 0, spacing: 10, columns: 4, rows: 3, heights, canopy })
  assert.equal(out[1], COVER.rock)
  assert.equal(out[2], COVER.rock)
  assert.equal(out[0], COVER.forest)
  assert.equal(out[3], COVER.herb)
  assert.equal(out[7], COVER.shrub)
  assert.equal(out[11], null)
})

test("the skyline's sea: water posts with no height or under the dropped sea level are set to it; lakes and land kept", () => {
  const R = 6371000, k = 0.13
  // a row of five posts 10 km apart along x from the origin
  const g = { west: 0, south: 0, spacing: 10000, columns: 5, rows: 1, heights: [5, null, -40, 300, -3], cover: [0, 5, 5, 5, 0], earthCurvature: { earthRadiusMeters: R, refraction: k } }
  const { grid, posts } = skylineSea(g)
  const drop = (d: number) => -((d * d) / (2 * R)) * (1 - k)
  assert.equal(posts, 2)
  assert.ok(Math.abs(grid.heights[1]! - drop(10000)) < 1e-9) // (no height: the sea)
  assert.ok(Math.abs(grid.heights[2]! - drop(20000)) < 1e-9) // (under the sea level: the sea)
  assert.equal(grid.heights[3], 300) // (a lake above it)
  assert.equal(grid.heights[4], -3) // (land: not water)
  assert.equal(g.heights[1], null) // (the package's own grid untouched)
  assert.equal(skylineSea({ ...g, cover: undefined }).grid.heights, g.heights)
  const px = waterTexels(coverFromGrid(g)!)
  assert.deepEqual([px[0], px[4], px[8], px[16]], [0, 255, 255, 0])
})

test("the cover atlas: each section's texels in its own rows, gaps between, the width the widest's", () => {
  const a = coverFromGrid(grid)! // (3 x 2)
  const b = coverFromGrid({ west: 0, south: 0, spacing: 10, columns: 1, rows: 1, heights: [0], cover: [5] })!
  const atlas = coverAtlas([{ raster: a, texels: coverTexels }, { raster: b, texels: waterTexels }])
  assert.equal(atlas.width, 3)
  assert.equal(atlas.height, 2 + ATLAS_GAP + 1)
  assert.deepEqual(atlas.sections, [{ row: 0, columns: 3, rows: 2 }, { row: 2 + ATLAS_GAP, columns: 1, rows: 1 }])
  assert.deepEqual([...atlas.data.slice(4, 8)], [0, 0, 0, 255]) // (row 0, column 1: rock)
  assert.deepEqual([...atlas.data.slice(12, 16)], [0, 255, 0, 0]) // (row 1, column 0: shrub)
  assert.equal(atlas.data[(2 + ATLAS_GAP) * 3 * 4], 255) // (the water section's post)
  assert.equal(atlas.data[2 * 3 * 4 + 3], 0) // (a gap row)
})

test('rock that keeps a canopy is rock under a standing stand: its stems and closure kept; bare rock still keeps none', () => {
  const g = { ...grid, cover: [4, 4, 4, 0, 0, 0], canopy: [0, ROCKY_STAND_CLOSURE, 0.6, 0.5, 0.5, 0.5] }
  const c = coverFromGrid(g)!
  assert.deepEqual([...c.code.slice(0, 3)], [COVER.rock, COVER.rockyStand, COVER.rockyStand])
  assert.equal(TREE_KEEP[COVER.rockyStand], 1)
  assert.equal(CANOPY_KEEP[COVER.rockyStand], 1)
  const keep = coverShareSampler([c], TREE_KEEP)
  assert.equal(keep(0, 0), 0)
  assert.equal(keep(20, 0), 1)
  // (a grid with no canopy: rock is rock)
  assert.equal(coverFromGrid({ ...grid, cover: [4, 4, 4, 0, 0, 0] })!.code[2], COVER.rock)
  // its cover texels draw none of the open classes: the floor shades it as a stand, the rock between its crowns
  assert.deepEqual([...coverTexels(c).slice(8, 12)], [0, 0, 0, 0])
})
