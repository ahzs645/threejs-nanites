import assert from 'node:assert/strict'
import { test } from 'node:test'
import { cloudParamsForShare, extinctionPerMeter, hazeShare, MAX_SKY_SHARE, SKY_CLOUD_DEFAULTS, skyCloudShare } from './sky-cover.ts'

test('no cloud at 0, and the share grows with the coverage', () => {
  assert.equal(skyCloudShare(0), 0)
  assert.deepEqual(cloudParamsForShare(0), { coverage: 0, density: SKY_CLOUD_DEFAULTS.density })
  let last = 0
  for (const c of [0.2, 0.4, 0.6, 0.8, 1]) {
    const s = skyCloudShare(c)
    assert.ok(s > last)
    last = s
  }
})

test("SkyMesh's coverage is not a share: 0.2 covers far less than a fifth of the sky", () => {
  assert.ok(skyCloudShare(0.2) < 0.1)
})

test('the parameters found draw the asked share of the sky, past the default density too', () => {
  for (const share of [0.2, 0.45, 0.75, 0.9]) {
    const p = cloudParamsForShare(share)
    const drawn = skyCloudShare(p.coverage, { ...SKY_CLOUD_DEFAULTS, density: p.density })
    assert.ok(Math.abs(drawn - share) < 0.005, `${share}: ${drawn}`)
  }
  assert.ok(MAX_SKY_SHARE < 0.75 && cloudParamsForShare(0.75).coverage === 1)
})

test("Koschmieder: 2% contrast left at the visibility, σ = 3.912 / V", () => {
  assert.ok(Math.abs(extinctionPerMeter(50) - 3.912 / 50000) < 1e-12)
  assert.ok(Math.abs(hazeShare(25, 25000) - 0.98) < 0.001)
  assert.equal(hazeShare(10, 0), 0)
})
