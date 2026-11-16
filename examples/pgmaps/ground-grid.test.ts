import assert from 'node:assert/strict'
import { test } from 'node:test'
import { buildGround, fillGrid } from './ground-grid.ts'
import type { TerrainGrid } from './package.ts'

/** A grid of `f(x, y)` over a square of `half` metres round the origin at `spacing`, nulls where `gap` says. */
function grid(half: number, spacing: number, f: (x: number, y: number) => number, gap: (x: number, y: number) => boolean = () => false): TerrainGrid {
  const n = Math.round((2 * half) / spacing) + 1
  const heights: Array<number | null> = []
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
    const x = -half + c * spacing, y = -half + r * spacing
    heights.push(gap(x, y) ? null : f(x, y))
  }
  return { west: -half, south: -half, spacing, columns: n, rows: n, heights }
}

const slope = (x: number, y: number) => 500 + 0.05 * x + 0.02 * y
const hills = (x: number, y: number) => 600 + 80 * Math.sin(x / 1300) * Math.cos(y / 900)

test('without far terrain, past the grid the ground eases from its edge to the mean (as the apron always did)', () => {
  const g = buildGround(grid(3000, 15, slope))
  assert.equal(g.far, null)
  assert.ok(Math.abs(g.heightAt(1000, 1000) - slope(1000, 1000)) < 1e-6)
  assert.ok(Math.abs(g.heightAt(3000 + 9000, 0) - 500) < 1e-6) // (the mean, 9 km out)
  assert.equal(g.sourceAt(5000, 0), 'invented')
  assert.equal(g.xs.length, 401 + 12)
})

test('the far grid stands wherever the detailed one has no posts, eased onto its edge with no step', () => {
  const near = grid(3000, 15, slope)
  const far = grid(15000, 60, (x, y) => slope(x, y) + 4) // (a coarser mosaic 4 m off)
  const g = buildGround(near, far)
  assert.equal(g.sourceAt(8000, 0), 'farTerrain')
  assert.equal(g.sourceAt(16000, 0), 'invented')
  // far out: the far grid's own heights
  assert.ok(Math.abs(g.heightAt(9000, -7000) - (slope(9000, -7000) + 4)) < 1e-6)
  // at the seam: continuous within a millimetre per centimetre either side, all round the edge
  for (const [x, y] of [[3000, 0], [-3000, 1234], [500, 3000], [-2200, -3000], [3000, 3000]]) {
    const dx = Math.sign(x) * 0.01 * (Math.abs(x) === 3000 ? 1 : 0), dy = Math.sign(y) * 0.01 * (Math.abs(y) === 3000 ? 1 : 0)
    const inside = g.heightAt(x - dx, y - dy), outside = g.heightAt(x + dx, y + dy)
    assert.ok(Math.abs(inside - outside) < 0.01, `step at ${x}, ${y}: ${inside} / ${outside}`)
  }
  // the mesh's lines: the detailed grid's posts, the far grid's past them, the apron; no line within 15 m of the edge
  const xs = g.xs
  assert.ok(xs.every((v, i) => i === 0 || v > xs[i - 1]))
  assert.ok(xs.includes(-3000) && xs.includes(3000) && xs.includes(-15000) && xs.includes(15000))
  assert.ok(!xs.some((v) => v > 3000 && v < 3015))
})

test('a far grid on a different surface is eased onto the edge over the seam band, then is its own', () => {
  const g = buildGround(grid(2000, 10, () => 700), grid(12000, 50, hills))
  const at = (x: number) => g.heightAt(x, 0)
  assert.ok(Math.abs(at(2000) - 700) < 1e-6)
  assert.ok(Math.abs(at(2000 + 400) - hills(2400, 0)) < 1e-6) // (past the 300 m / 3 posts band)
  // no jump between neighbouring metres across the band
  for (let x = 2000; x < 2400; x++) assert.ok(Math.abs(at(x + 1) - at(x)) < 2)
})

test("the detailed grid's gaps take the far grid's posts, the far grid's take the detailed grid's", () => {
  const nearGap = (x: number, y: number) => x > 1000 && x < 1300 && y > -200 && y < 200
  const farGap = (x: number, y: number) => x > 6000 && x < 6500
  const g = buildGround(grid(3000, 15, slope, nearGap), grid(15000, 60, slope, (x, y) => farGap(x, y) || (Math.abs(x) < 600 && Math.abs(y) < 600)))
  assert.ok(Math.abs(g.heightAt(1150, 0) - slope(1150, 0)) < 0.5)
  assert.equal(g.sourceAt(1150, 0), 'farTerrain')
  assert.equal(g.sourceAt(6200, 0), 'filled')
  assert.ok(g.farUnknown > 0)
})

test('a row with no values takes its column', () => {
  const f = fillGrid({ west: 0, south: 0, spacing: 1, columns: 3, rows: 3, heights: [1, 2, 3, null, null, null, 7, 8, 9] })
  assert.deepEqual([...f.h], [1, 2, 3, 7, 8, 9, 7, 8, 9])
})

test('the skyline grid stands only past both inner grids, as given (its curvature already dropped), eased onto their edge', () => {
  const drop = (x: number, y: number) => ((x * x + y * y) / (2 * 6371000)) * (1 - 0.13)
  const near = grid(3000, 15, slope), far = grid(15000, 60, slope)
  const sky = grid(30000, 120, (x, y) => slope(x, y) - drop(x, y))
  const g = buildGround(near, far, sky)
  assert.equal(g.sourceAt(1000, 0), 'terrain')
  assert.equal(g.sourceAt(8000, 0), 'farTerrain')
  assert.equal(g.sourceAt(22000, 0), 'skylineTerrain')
  assert.equal(g.sourceAt(31000, 0), 'invented')
  // inside the inner grids neither is dropped; past the seam band the skyline's own heights, not dropped again
  assert.ok(Math.abs(g.heightAt(14000, 0) - slope(14000, 0)) < 1e-6)
  assert.ok(Math.abs(g.heightAt(22000, 5000) - (slope(22000, 5000) - drop(22000, 5000))) < 0.01) // (bilinear over 120 m posts)
  // no step at the far grid's edge
  for (const y of [-15000, -4000, 0, 9000]) {
    const inside = g.heightAt(14999.99, y), outside = g.heightAt(15000.01, y)
    assert.ok(Math.abs(inside - outside) < 0.01, `step at 15000, ${y}: ${inside} / ${outside}`)
  }
  // the mesh's lines: each coarser grid's posts past the finer's, ascending, then the apron past the skyline grid
  assert.ok(g.xs.every((v, i) => i === 0 || v > g.xs[i - 1]))
  assert.ok(g.xs.includes(15000) && g.xs.includes(15120) && g.xs.includes(30000) && !g.xs.some((v) => v > 15000 && v < 15030))
  assert.deepEqual(g.outer, { west: -30000, south: -30000, east: 30000, north: 30000 })
})

test('a skyline grid with no far grid stands past the detailed one', () => {
  const g = buildGround(grid(3000, 15, slope), null, grid(20000, 80, slope))
  assert.equal(g.sourceAt(10000, 0), 'skylineTerrain')
  assert.ok(Math.abs(g.heightAt(3000.01, 0) - g.heightAt(2999.99, 0)) < 0.01)
})
