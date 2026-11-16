import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  BURNT, BURN_PALETTE, DEFAULT_BURN_AGE, SNAG_SCREEN, SNAG_RATIO, SNAG_SPECIES, burnAge, burnTexels, burntShareSampler, decodeFireYear, encodeFireYear, fireYearAt, fireYearsFromGrid,
  fractionalYear, hasBurn, hasStandGround, syntheticBurn, withSnagClosure, SNAG_CLOSURE, regrowth, snagScene, snagStems, snagsStanding,
} from './burnt.ts'
import { COVER, coverFromGrid, coverRasters, stemDraw } from './ground-cover.ts'
import { isAggregate, type StemTable } from './far-forest.ts'
import type { ScenePackage, TerrainGrid } from './package.ts'

// a 3 x 2 grid at 10 m: forest, burnt, burnt (south row); forest, forest, burnt (north row); fire years on two posts
const grid = {
  west: 0, south: 0, spacing: 10, columns: 3, rows: 2, heights: [0, 0, 0, 0, 0, 0], cover: [0, 7, 7, 0, 0, 7],
  fireYear: [null, 2021, 2017, null, null, null],
}

test('burnt is cover 7 and keeps its stems (as snags); its fire years read from the grid', () => {
  assert.equal(COVER.burnt, BURNT)
  const c = coverFromGrid(grid)!
  assert.deepEqual([...c.code], [0, 7, 7, 0, 0, 7])
  assert.ok(hasBurn([c]))
  assert.ok(!hasBurn([coverFromGrid({ ...grid, cover: [0, 0, 0, 0, 0, 0] })!]))
  const years = fireYearsFromGrid(grid)!
  assert.equal(years[1], 2021)
  assert.ok(Number.isNaN(years[0]))
  assert.equal(fireYearsFromGrid({ ...grid, fireYear: [2021] } as never), null)
  assert.equal(fireYearsFromGrid({ ...grid, fireYear: undefined } as never), null)
  // PGMaps' name for it, preferred
  assert.equal(fireYearsFromGrid({ ...grid, fireYear: undefined, burntYear: [null, 2015, null, null, null, null] })![1], 2015)
  assert.equal(c.fireYear?.[2], 2017)
})

test('the burn ages from its fire year to the view (unknown: the default), and fire years survive a byte', () => {
  assert.equal(burnAge(null, 2025.6), DEFAULT_BURN_AGE)
  assert.ok(Math.abs(burnAge(2021, 2025.6) - 4) < 1e-9)
  assert.equal(burnAge(2026, 2025.6), 0)
  assert.ok(Math.abs(fractionalYear(new Date(Date.UTC(2025, 6, 2)))! - 2025.5) < 0.01)
  assert.equal(fractionalYear(null), null)
  for (const y of [1960, 2003, 2021, 2024]) assert.ok(Math.abs(decodeFireYear(Math.round(encodeFireYear(y) * 255) / 255) - y) < 0.25)
})

test('the ground greens with years since the fire: ash first, then herbs, shrubs and a young stand; snags fall late', () => {
  const at = (a: number) => regrowth(a)
  assert.ok(at(0).ash > 0.95 && at(0).herb < 0.05)
  assert.ok(at(3).ash < 0.05 && at(3).herb > 0.95 && at(3).shrub < 0.05)
  assert.ok(at(10).shrub > 0.4 && at(10).regen < 0.05)
  assert.ok(at(30).regen > 0.95)
  for (let a = 0; a < 40; a += 0.5) {
    const [p, q] = [at(a), at(a + 0.5)]
    assert.ok(q.ash <= p.ash && q.herb >= p.herb && q.shrub >= p.shrub && q.regen >= p.regen)
  }
  assert.equal(snagsStanding(0), 1)
  assert.equal(snagsStanding(8), 1)
  assert.ok(snagsStanding(25) > 0.45 && snagsStanding(25) < 0.65)
  assert.ok(snagsStanding(80) >= 0.1)
})

test('burnt share is bilinear over the posts, the fire year the nearest post that has one', () => {
  const r = coverRasters({ terrain: grid } as unknown as ScenePackage)
  const share = burntShareSampler(r)
  assert.equal(share(0, 0), 0)
  assert.equal(share(10, 0), 1)
  assert.equal(share(5, 0), 0.5)
  assert.equal(share(-1, 0), null)
  assert.equal(fireYearAt(r, 11, 1), 2021)
  assert.equal(fireYearAt(r, 19, 1), 2017)
  assert.equal(fireYearAt(r, 19, 9), 2017) // (the nearest post is (2, 1), which has none: the nearest that has)
  assert.equal(fireYearAt(r, 0, 10), null)
})

const stems = (rows: number[][]) => ({ fields: ['x', 'y', 'z', 'species', 'height', 'crownWidth', 'tone'], species: ['spruce', 'pine'], count: rows.length, data: rows.flat() })

test('stems on burnt ground stand dead, narrowed, in place; stems off it and far aggregates keep their crowns', () => {
  const r = coverRasters({ terrain: grid } as unknown as ScenePackage)
  const t = stems([
    [0, 0, 0, 0, 20, 6, 0.5], // forest
    [10, 0, 0, 1, 25, 7, 0.5], // burnt
    [20, 10, 0, 0, 22, 30, 0.5], // burnt, an aggregate (crown wider than tall)
  ])
  const { table, snags, fallen } = snagStems(t, r, 2025.6)
  assert.equal(snags, 2)
  assert.equal(fallen, 0)
  assert.deepEqual(table.species, ['spruce', 'pine', SNAG_SPECIES])
  assert.deepEqual(table.data.slice(0, 7), [0, 0, 0, 0, 20, 6, 0.5])
  assert.deepEqual(table.data.slice(7, 14), [10, 0, 0, 2, 25, 25 * SNAG_RATIO, 0.5])
  assert.deepEqual(table.data.slice(14, 21), [20, 10, 0, 2, 22, 30, 0.5])
  // idempotent: snags stay snags, nothing else changes
  const again = snagStems(table, r, 2025.6)
  assert.equal(again.table, table)
  // nothing burnt: the same table
  const none = coverRasters({ terrain: { ...grid, cover: [0, 0, 0, 0, 0, 0] } } as unknown as ScenePackage)
  assert.equal(snagStems(t, none, 2025.6).table, t)
})

test('an old burn has lost some of its snags; the scene carries the snag species info', () => {
  const r = coverRasters({ terrain: { ...grid, cover: [7, 7, 7, 7, 7, 7], fireYear: [1960, 1960, 1960, 1960, 1960, 1960] } } as unknown as ScenePackage)
  const rows: number[][] = []
  for (let i = 0; i < 400; i++) rows.push([10 + (i % 20) * 0.5, (i / 20) * 0.4, 0, 0, 20, 5, 0.5])
  const s = { trees: stems(rows), species: {} } as unknown as ScenePackage
  const out = snagScene(s, r, 2025.6)
  const standing = out.snags / 400
  assert.ok(Math.abs(standing - snagsStanding(65)) < 0.08, `standing ${standing}`)
  assert.equal(out.snags + out.fallen, 400)
  assert.equal(out.scene.species?.[SNAG_SPECIES]?.crownRatio, SNAG_RATIO)
})

test('burn texels: r at burnt posts, the fire year premultiplied in g (the fallback where a post has none)', () => {
  const c = coverFromGrid(grid)!
  const px = burnTexels(c, 2022)
  assert.deepEqual([px[0], px[1]], [0, 0])
  assert.equal(px[4], 255)
  assert.equal(px[5], Math.round(encodeFireYear(2021) * 255))
  assert.equal(px[5 * 4 + 1], Math.round(encodeFireYear(2022) * 255))
})

test('the palette: charred ash darkest, the herb flush yellow-green and light, snags dark and not green; snags screen less', () => {
  const y = (c: readonly number[]) => 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]
  const p = BURN_PALETTE
  assert.ok(y(p.ash) < y(p.ashGrey) && y(p.ash) < y(p.snag) + 0.01)
  assert.ok(p.herb[1] > p.herb[2] * 2 && p.herb[1] >= p.herb[0] && y(p.herb) > y(p.shrub) && y(p.shrub) > y(p.regen))
  assert.ok(p.snag[1] <= p.snag[0] && p.snag[1] <= p.snag[2])
  assert.ok(y(p.farStand) < y(p.shrub))
  assert.ok(SNAG_SCREEN > 0 && SNAG_SCREEN < 0.5)
})

test("a burn's snag stand takes the posted (pre-fire) closure; SNAG_CLOSURE only where the post says nothing", () => {
  const closure = (x: number) => (x < 0 ? null : x < 10 ? 0.2 : 0.7)
  const burnt = (x: number) => (x < 20 ? 1 : x < 30 ? 0.5 : 0)
  const at = withSnagClosure((x) => closure(x), (x) => burnt(x))
  assert.equal(at(-5, 0), SNAG_CLOSURE)
  assert.equal(at(5, 0), 0.2)
  assert.equal(at(15, 0), 0.7)
  assert.equal(at(35, 0), 0.7)
  assert.equal(withSnagClosure(() => null, () => 0.5)(0, 0), SNAG_CLOSURE / 2)
  assert.equal(withSnagClosure(() => null, () => 0)(0, 0), null)
})

test('the stand-in burn takes forest and sparse posts east of a line, with the fire year', () => {
  const b = syntheticBurn({ ...grid, cover: [0, 1, 3, 0, 0, 4] } as TerrainGrid, 5, 2020)
  assert.deepEqual(b.cover, [0, 7, 3, 0, 7, 4])
  assert.deepEqual(b.burntYear, [null, 2020, null, null, 2020, null])
})

test('the stand-in burn on a grid with no cover: its posts east of the line burnt, the rest unknown', () => {
  const b = syntheticBurn({ ...grid, cover: undefined }, 5, 2020)
  assert.deepEqual(b.cover, [null, 7, 7, null, 7, 7])
})

test('the second texel set marks rock under a standing stand in b, and is wanted for it alone', () => {
  const g = { ...grid, cover: [4, 4, 0, 0, 0, 0], canopy: [0.5, 0, 0.5, 0.5, 0.5, 0.5], fireYear: undefined }
  const c = coverFromGrid(g)!
  assert.ok(!hasBurn([c]) && hasStandGround([c]))
  const px = burnTexels(c, 2022)
  assert.deepEqual([...px.slice(0, 4)], [0, 0, 255, 0])
  assert.deepEqual([...px.slice(4, 8)], [0, 0, 0, 0])
})

test('snag stems written straight into the table are the rows the row-by-row copy gave, typed or not', () => {
  // (snagStems as it was: a row array a stem, pushed onto a list, the list turned into the input's kind)
  const byRows = (t: { fields: string[]; species: string[]; count: number; data: ArrayLike<number> }, rasters: ReturnType<typeof coverRasters>, viewYear: number) => {
    const st = t.fields.length, fx = t.fields.indexOf('x'), fy = t.fields.indexOf('y'), fs = t.fields.indexOf('species'), fw = t.fields.indexOf('crownWidth'), fh = t.fields.indexOf('height')
    const shareAt = burntShareSampler(rasters)
    const known = t.species.indexOf(SNAG_SPECIES), snagIndex = known >= 0 ? known : t.species.length
    const out: number[] = []
    let snags = 0, fallen = 0
    for (let i = 0; i < t.count; i++) {
      const o = i * st, x = t.data[o + fx], y = t.data[o + fy]
      const share = shareAt(x, y) ?? 0
      const row = Array.from({ length: st }, (_, j) => t.data[o + j])
      if (share > 0 && row[fs] !== snagIndex && stemDraw(x + 0.37, y - 0.21) < share) {
        if (stemDraw(x - 0.53, y + 0.29) >= snagsStanding(burnAge(fireYearAt(rasters, x, y), viewYear))) {
          fallen++
          continue
        }
        if (!isAggregate(t as unknown as StemTable, i)) row[fw] = Math.min(row[fw] > 0 ? row[fw] : Infinity, SNAG_RATIO * row[fh])
        row[fs] = snagIndex
        snags++
      }
      out.push(...row)
    }
    return { data: t.data instanceof Float32Array ? Float32Array.from(out) : out, count: out.length / st, snags, fallen }
  }
  // an old burn over the east of the grid (snags fallen and standing), live forest west of it
  const r = coverRasters({ terrain: { ...grid, cover: [0, 7, 7, 0, 7, 7], fireYear: [null, 1975, 1990, null, null, 2015] } } as unknown as ScenePackage)
  let seed = 12345
  const rnd = () => ((seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0), seed / 4294967296)
  const rows: number[][] = []
  for (let i = 0; i < 3000; i++) rows.push([rnd() * 24 - 2, rnd() * 14 - 2, rnd() * 900, Math.floor(rnd() * 2), 5 + rnd() * 30, rnd() < 0.1 ? 0 : rnd() * (rnd() < 0.2 ? 60 : 8), rnd()])
  const plain = stems(rows)
  const typed = { ...plain, data: Float32Array.from(plain.data) }
  for (const t of [plain, typed]) {
    const want = byRows(t, r, 2025.6), got = snagStems(t, r, 2025.6)
    assert.ok(want.snags > 100 && want.fallen > 100 && want.count < t.count, 'the reference stands and fells snags')
    assert.equal(got.snags, want.snags)
    assert.equal(got.fallen, want.fallen)
    assert.equal(got.table.count, want.count)
    assert.equal(got.table.data instanceof Float32Array, t.data instanceof Float32Array)
    assert.equal(got.table.data.length, want.data.length)
    assert.deepEqual(got.table.data, want.data)
    assert.deepEqual(got.table.species, ['spruce', 'pine', SNAG_SPECIES])
  }
  // nothing fallen (a fresh burn): the table keeps every stem
  const fresh = coverRasters({ terrain: { ...grid, cover: [0, 7, 7, 0, 7, 7], fireYear: [null, 2024, 2024, null, 2024, 2024] } } as unknown as ScenePackage)
  const want = byRows(typed, fresh, 2025.6), got = snagStems(typed, fresh, 2025.6)
  assert.equal(want.fallen, 0)
  assert.equal(got.table.count, typed.count)
  assert.deepEqual(got.table.data, want.data)
})
