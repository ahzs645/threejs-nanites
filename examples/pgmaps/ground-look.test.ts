import assert from 'node:assert/strict'
import { test } from 'node:test'
import { AGE_SCALE, DEFAULT_CUT_AGE, RESIDUAL_GREEN, SHRUB_SHARE, boxBlur, canopyFromGrid, canopyFromStems, canopyTexels, cutAgeOf, decodeAge, encodeAge, greenShare, retainedShareOf, standShare, VIA_CUT, viaCutShare, visibleCover } from './ground-look.ts'

test('an opening with no age is drawn as about a year after harvest; ages round-trip through a premultiplied byte', () => {
  assert.equal(cutAgeOf({}), DEFAULT_CUT_AGE)
  assert.equal(cutAgeOf({ ageYears: null }), DEFAULT_CUT_AGE)
  assert.equal(cutAgeOf({ ageYears: 0 }), 0)
  assert.equal(cutAgeOf({ ageYears: -3 }), 0)
  assert.equal(retainedShareOf({}), 0)
  assert.equal(retainedShareOf({ retainedShare: 1.4 }), 1)
  for (const age of [0, 1, 3, 7.5, 18, 39]) {
    for (const cover of [1, 0.4]) {
      const byte = Math.round(encodeAge(age) * 255 * cover) / 255, open = Math.round(cover * 255) / 255
      assert.ok(Math.abs(decodeAge(byte, open) - age) < 0.4, `${age} at ${cover}: ${decodeAge(byte, open)}`)
    }
  }
  assert.equal(decodeAge(1, 1), AGE_SCALE)
})

test('the cut greens up by stage: bare to a year, half green by five, green by ten, a young stand by twenty', () => {
  assert.equal(greenShare(0), RESIDUAL_GREEN)
  assert.equal(greenShare(1), RESIDUAL_GREEN)
  assert.ok(greenShare(3) > 0.2 && greenShare(3) < 0.45)
  assert.ok(Math.abs(greenShare(5) - (RESIDUAL_GREEN + (1 - RESIDUAL_GREEN) * SHRUB_SHARE)) < 1e-9)
  assert.equal(greenShare(10), 1)
  assert.equal(standShare(10), 0)
  assert.equal(standShare(20), 1)
  for (let a = 0; a < 30; a += 0.5) assert.ok(greenShare(a + 0.5) >= greenShare(a) && standShare(a + 0.5) >= standShare(a))
})

test('a stand reads closed from the side at moderate crown closure, open ground open', () => {
  assert.equal(visibleCover(0), 0)
  assert.equal(visibleCover(1), 1)
  assert.ok(visibleCover(0.45) > 0.75)
  assert.ok(visibleCover(0.1) < 0.25)
})

test("a grid's canopy posts become a raster (null where unknown); a grid without them gives none", () => {
  const g = { west: 0, south: 0, spacing: 10, columns: 2, rows: 2, heights: [1, 1, 1, 1], canopy: [0.5, null, 0, 1.2] }
  const c = canopyFromGrid(g)!
  assert.deepEqual([...c.known], [1, 0, 1, 1])
  assert.deepEqual([...c.closure].map((v) => +v.toFixed(2)), [0.5, 0, 0, 1])
  const px = canopyTexels(c)
  assert.deepEqual([px[0], px[1], px[4], px[5], px[12]], [128, 255, 0, 0, 255])
  assert.equal(canopyFromGrid({ ...g, canopy: undefined }), null)
  assert.equal(canopyFromGrid({ ...g, canopy: [0.5] }), null)
})

test("without canopy posts, the stems' crowns averaged: an even stand reads even, with no clump-sized blotches", () => {
  // clumps 20 m across every 30 m (a capture's far band): crown share pi * 10^2 / 900 = 0.35
  const data: number[] = []
  for (let x = 0; x <= 1000; x += 30) for (let y = 0; y <= 1000; y += 30) data.push(x, y, 0, 0, 10, 20, 0.5)
  const scene = { trees: { fields: ['x', 'y', 'z', 'species', 'height', 'crownWidth', 'tone'], species: ['spruce'], count: data.length / 7, data }, camera: { position: [500, 500, 0] as [number, number, number], bearingDegrees: 0, pitchDegrees: 0, verticalFovDegrees: 40 } }
  const c = canopyFromStems(scene, { west: 0, south: 0, east: 1000, north: 1000 }, 10)!
  const inner: number[] = []
  for (let r = 20; r < c.rows - 20; r++) for (let col = 20; col < c.columns - 20; col++) inner.push(c.closure[r * c.columns + col])
  const mean = inner.reduce((s, v) => s + v, 0) / inner.length
  const spread = Math.max(...inner) - Math.min(...inner)
  assert.ok(Math.abs(mean - (1 - Math.exp(-Math.PI * 100 / 900))) < 0.03, `mean ${mean}`)
  assert.ok(spread < 0.12, `spread ${spread}`)
  assert.equal(c.known[0], 1) // (within the farthest stem's reach)
})

test('a box blur keeps the mean and spreads a spike', () => {
  const a = new Float32Array(25)
  a[12] = 9
  const b = boxBlur(a, 5, 5, 1)
  assert.ok(Math.abs(b.reduce((s, v) => s + v, 0) - 9) < 1e-5)
  assert.ok(Math.abs(b[12] - 1) < 1e-6)
})

test("the via look paints openings up to a year old (an undated one too) pinkish-brown, gone half a year later", () => {
  assert.equal(viaCutShare(0), 1)
  assert.equal(viaCutShare(DEFAULT_CUT_AGE), 1)
  assert.ok(viaCutShare(1.25) > 0 && viaCutShare(1.25) < 1)
  assert.equal(viaCutShare(VIA_CUT.maxAge + VIA_CUT.fade), 0)
  assert.equal(viaCutShare(5), 0)
  // pinkish-brown: red over green over blue, in its base and both flecks; its light flecks lighter than its dark
  for (const c of [VIA_CUT.base, VIA_CUT.light, VIA_CUT.dark]) assert.ok(c[0] > c[1] && c[1] > c[2])
  const y = (c: readonly number[]) => 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]
  assert.ok(y(VIA_CUT.dark) < y(VIA_CUT.base) && y(VIA_CUT.base) < y(VIA_CUT.light))
  // lit by the floor's ~1.2, the base reads near the render's block (sRGB ~#a8 8a 7a, between its shade and lit sides)
  const srgb = (v: number) => Math.round(255 * (v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055))
  const lit = VIA_CUT.base.map((v) => srgb(v * 1.2))
  assert.ok(lit[0] >= 156 && lit[0] <= 184 && lit[2] >= 114 && lit[2] <= 134, `lit ${lit}`)
})
