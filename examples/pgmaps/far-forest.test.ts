import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  AGGREGATE_RATIO, PATCH_METERS, cutoffMeters, focalPixels, gradeColour, hsvSaturation, isAggregate, standCells, standPatches, stemsPerHectare, toSrgb,
  SPECIES_CANOPY, canopyField, closureSampler, type Rgb, type StemTable,
} from './far-forest.ts'

const fields = ['x', 'y', 'z', 'species', 'height', 'crownWidth', 'tone']
const table = (rows: number[][]): StemTable => ({ fields, species: ['pine', 'spruce'], count: rows.length, data: rows.flat() })

test('a stem is an aggregate when its crown is wider than the ratio of its height or twice its species\'', () => {
  const t = table([[0, 0, 0, 0, 22, 3.8, 0.5], [0, 0, 0, 0, 22, 45, 0.5], [0, 0, 0, 1, 20, 20 * AGGREGATE_RATIO * 0.99, 0.5]])
  assert.equal(isAggregate(t, 0), false)
  assert.equal(isAggregate(t, 1), true)
  assert.equal(isAggregate(t, 2), false)
  // a broad-crowned species' own ratio raises its threshold
  assert.equal(isAggregate(table([[0, 0, 0, 0, 20, 23, 0.5]]), 0, () => 0.3), false)
  assert.equal(isAggregate(table([[0, 0, 0, 0, 20, 23, 0.5]]), 0), true)
})

test('cells take the aggregate stems\' crowns by area, their height and species shares', () => {
  // one 60 m clump of spruce centred in a cell, and a real pine stem in the same cell
  const t = table([[30, 30, 0, 1, 24, 50, 0.5], [40, 40, 0, 0, 20, 4, 0.5]])
  const c = standCells(t, { cell: 60 })!
  assert.ok(c)
  assert.equal(c.touched[0], 1)
  assert.equal(c.cell, 60)
  assert.ok(PATCH_METERS > 0)
  const k = Math.floor((30 - c.south) / c.cell) * c.columns + Math.floor((30 - c.west) / c.cell)
  assert.equal(c.aggregate[k], 1)
  // the crown's area (π 25²) over the cell's (3600), within the 4 × 4 sampling's error
  assert.ok(Math.abs(c.crownShare[k] - Math.min(1, (Math.PI * 625 + Math.PI * 4) / 3600)) < 0.1, `share ${c.crownShare[k]}`)
  assert.ok(c.height[k] > 23.5 && c.height[k] < 24, `height ${c.height[k]}`)
  assert.ok(c.shares[k * 2 + 1] > 0.95)
})

test('no aggregate stems: no cells, unless an extent is asked for', () => {
  assert.equal(standCells(table([[0, 0, 0, 0, 22, 3.8, 0.5]])), null)
  const c = standCells(table([[0, 0, 0, 0, 22, 3.8, 0.5]]), { cell: 60, extent: { west: -600, south: -600, east: 600, north: 600 } })!
  assert.equal(c.columns, 20)
  assert.ok(c.realReach < 1)
})

test('past the farthest real stem, forest cells no stem reaches take patches; near ones do not', () => {
  const t = table([[0, 0, 0, 0, 22, 3.8, 0.5], [300, 0, 0, 1, 20, 3.5, 0.5]])
  const cells = standCells(t, { extent: { west: -1200, south: -1200, east: 1200, north: 1200 }, eye: [0, 0] })!
  const p = standPatches(cells, () => 0, () => 0.6, { eye: [0, 0], maxReach: 1000 })
  assert.ok(p.count > 0)
  for (let k = 0; k < p.count; k++) {
    const d = Math.hypot(p.a[k * 4], p.a[k * 4 + 1])
    assert.ok(d > 300 && d <= 1000, `patch at ${d} m`)
    assert.equal(p.a[k * 4 + 3], 22, 'the median height')
  }
})

test('patches: one per aggregate cell with closure, its ground plane and dominant species, the same every time', () => {
  const rows: number[][] = []
  for (let i = 0; i < 10; i++) for (let j = 0; j < 10; j++) rows.push([i * 60 + 30, j * 60 + 30, 0, (i + j) % 3 === 0 ? 0 : 1, 22, 55, 0.5])
  const t = table(rows)
  const cells = standCells(t, { cell: 60 })!
  const slope = (x: number, y: number) => 100 + 0.1 * x - 0.2 * y
  const open = (x: number) => (x < 120 ? 0 : null) // (an opening along the west edge)
  const p = standPatches(cells, slope, open)
  assert.ok(p.count > 50 && p.count <= cells.columns * cells.rows)
  for (let k = 0; k < p.count; k++) {
    assert.ok(p.a[k * 4] >= 120, 'no patch in the opening')
    assert.ok(Math.abs(p.b[k * 4] - 0.1) < 1e-6 && Math.abs(p.b[k * 4 + 1] + 0.2) < 1e-6, 'the ground plane')
    assert.ok(Math.abs(p.a[k * 4 + 2] - slope(p.a[k * 4], p.a[k * 4 + 1])) < 1e-3)
  }
  const again = standPatches(standCells(t, { cell: 60 })!, slope, open)
  assert.deepEqual(again.a, p.a)
})

test('stems a hectare follow the Boolean model and stop at the cap', () => {
  // 60% closure of 3.7 m crowns: about 860 stems / ha
  assert.ok(Math.abs(stemsPerHectare(0.6, 3.7) - 852) < 15)
  assert.equal(stemsPerHectare(0.95, 3), 1000)
  assert.equal(stemsPerHectare(0, 3), 0)
})

test('the cut-off: a 22 m tree is 4 px tall at about 9 km through a 1200 px, 39.6° frame', () => {
  const f = focalPixels(582, 19.8)
  assert.ok(Math.abs(f - 1666) < 5, `focal ${f}`)
  const d = cutoffMeters(4, f, 22)
  assert.ok(d > 9000 && d < 9300, `cut-off ${d}`)
})

test('graded canopy colours stay at or under 0.2 saturation in both looks, the photo bluer', () => {
  for (const look of ['via', 'photo'] as const)
    for (const rgb of Object.values(SPECIES_CANOPY)) {
      const g = gradeColour(rgb, look).map(toSrgb) as [number, number, number]
      assert.ok(hsvSaturation(g) <= 0.2, `${look} ${rgb} → ${g} sat ${hsvSaturation(g)}`)
    }
  const via = gradeColour(SPECIES_CANOPY.spruce, 'via'), photo = gradeColour(SPECIES_CANOPY.spruce, 'photo')
  assert.ok(photo[2] / photo[1] > via[2] / via[1])
})

test('closure: the finest grid that knows, bilinear over its known posts', () => {
  const fine = { west: 0, south: 0, spacing: 10, columns: 3, rows: 3, closure: Float32Array.from([0, 0.2, 0.4, 0, 0.2, 0.4, 0, 0.2, 0.4]), known: Uint8Array.from([1, 1, 1, 1, 1, 1, 0, 0, 0]) }
  const coarse = { west: -100, south: -100, spacing: 100, columns: 3, rows: 3, closure: new Float32Array(9).fill(0.7), known: new Uint8Array(9).fill(1) }
  const at = closureSampler([fine, coarse])
  assert.ok(Math.abs(at(5, 0)! - 0.1) < 1e-6)
  assert.ok(Math.abs(at(15, 5)! - 0.3) < 1e-6)
  // the top row is unknown: the known posts below carry it
  assert.ok(Math.abs(at(10, 15)! - 0.2) < 1e-6)
  assert.ok(Math.abs(at(50, 50)! - 0.7) < 1e-6, 'past the fine grid: the coarse')
  assert.equal(closureSampler([fine])(500, 500), null)
})

test('the canopy field: closure from the posts, height and colour from the stems where they reach, else defaults', () => {
  const t = table([[30, 30, 0, 1, 24, 50, 0.5]])
  const cells = standCells(t, { cell: 60, extent: { west: 0, south: 0, east: 600, north: 600 } })!
  const colours: Rgb[] = [[1, 0, 0], [0, 1, 0]]
  const f = canopyField({ west: 0, south: 0, east: 600, north: 600 }, (x) => (x < 300 ? 0.8 : null), cells, (j) => colours[j], { cell: 60, unknownClosure: 0.5 })
  assert.equal(f.columns, 10)
  assert.deepEqual(Array.from(f.stand.slice(0, 4)).map((v) => Math.round(v * 100) / 100), [0.8, 24, 1, 1])
  assert.deepEqual(Array.from(f.colour.slice(0, 3)), [0, 1, 0])
  const far = (5 * 10 + 9) * 4
  assert.deepEqual(Array.from(f.stand.slice(far, far + 3)).map((v) => Math.round(v * 100) / 100), [0.5, 24, 0])
})

test('the ground keeps its share of the far stand: no patch and no canopy on rock, half the closure on sparse forest', () => {
  const rows: number[][] = []
  for (let i = 0; i < 10; i++) for (let j = 0; j < 10; j++) rows.push([i * 60 + 30, j * 60 + 30, 0, 1, 22, 55, 0.5])
  const cells = standCells(table(rows), { cell: 60 })!
  const flat = () => 100
  // rock east of x = 300, sparse (half kept) in the south-west, forest elsewhere
  const keepAt = (x: number, y: number) => (x >= 300 ? 0 : y < 300 ? 0.5 : 1)
  const p = standPatches(cells, flat, () => 0.6, { keepAt })
  assert.ok(p.count > 0)
  for (let k = 0; k < p.count; k++) {
    const x = p.a[k * 4], y = p.a[k * 4 + 1], c = p.b[k * 4 + 2]
    assert.ok(x < 300, 'no patch on rock')
    assert.ok(Math.abs(c - (y < 300 ? 0.3 : 0.6)) < 1e-6, `closure ${c} at ${y}`)
  }
  const f = canopyField({ west: 0, south: 0, east: 600, north: 600 }, () => 0.8, cells, () => [0, 1, 0], { cell: 60, keepAt })
  const at = (c: number, r: number) => +f.stand[(r * f.columns + c) * 4].toFixed(3)
  assert.equal(at(8, 8), 0) // (rock: never raised)
  assert.equal(at(1, 1), 0.4) // (sparse)
  assert.equal(at(1, 8), 0.8) // (forest)
  // an unknown closure is kept by the ground too
  const g = canopyField({ west: 0, south: 0, east: 600, north: 600 }, () => null, cells, () => [0, 1, 0], { cell: 60, unknownClosure: 0.5, keepAt })
  assert.equal(+g.stand[(8 * g.columns + 8) * 4].toFixed(3), 0)
})

test('a species flagged never common (a burn\'s snags) is not the stand drawn where no stem reaches', () => {
  const t = table([[0, 0, 0, 1, 20, 4, 0.5], [5, 0, 0, 1, 20, 4, 0.5], [10, 0, 0, 1, 20, 4, 0.5], [15, 0, 0, 0, 20, 4, 0.5]])
  const extent = { west: 0, south: 0, east: 60, north: 60 }
  assert.equal(standCells(t, { extent })!.commonSpecies, 1)
  assert.equal(standCells(t, { extent, notCommon: (name) => name === 'spruce' })!.commonSpecies, 0)
})
