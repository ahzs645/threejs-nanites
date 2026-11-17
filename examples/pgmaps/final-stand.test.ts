import assert from 'node:assert/strict'
import { test } from 'node:test'
import { inBearings, mergeStems, readFinalOptions, standReaches, syntheticStand, withPlaceholderStem, DEFAULT_SAMPLES, DEFAULT_CUTOFF_PX, type FinalStand } from './final-stand.ts'
import { readCaptureRequest } from './capture-math.ts'

const base = {
  type: 'pgmaps-capture', id: 'x', position: [0, 0, 100],
  frames: [{ bearingDegrees: 0, pitchDegrees: 0, horizontalFovDegrees: 40, verticalFovDegrees: 20, width: 100, height: 50 }],
  classes: { terrain: [1, 2, 3], layers: [], vegetation: [4, 5, 6], water: [7, 8, 9] },
}

test('an active request (or none said) has no final options', () => {
  assert.equal(readCaptureRequest(base).final, null)
  assert.equal(readCaptureRequest({ ...base, quality: 'active' }).final, null)
})

test('a final request: defaults, clamps and the stand as sent', () => {
  const f = readCaptureRequest({ ...base, quality: 'final' }).final!
  assert.deepEqual(f, { samples: DEFAULT_SAMPLES, stand: null, canopyCutoffPx: DEFAULT_CUTOFF_PX })
  const data = new Float32Array([10, 20, 0, 22, 4, 0.5])
  const g = readFinalOptions({ quality: 'final', samples: 9999, canopyCutoffPx: 6, stand: { fields: ['x', 'y', 'species', 'height', 'crownWidth', 'tone'], species: ['pine'], count: 1, data, radiusMeters: 500, bearings: [350, 20] } })!
  assert.equal(g.samples, 256)
  assert.equal(g.canopyCutoffPx, 6)
  assert.equal(g.stand!.data, data, 'the transferred array is kept, not copied')
  assert.deepEqual(g.stand!.bearings, [350, 20])
})

test('a stand that is short of its count or lacks a field is refused', () => {
  const stand = { fields: ['x', 'y', 'species', 'height'], species: [], count: 2, data: new Float32Array(4), radiusMeters: 1, bearings: [0, 360] }
  assert.throws(() => readFinalOptions({ quality: 'final', stand }), /shorter/)
  assert.throws(() => readFinalOptions({ quality: 'final', stand: { ...stand, fields: ['x', 'y'] } }), /lacks/)
})

test('bearing spans wrap past north', () => {
  assert.ok(inBearings(5, [350, 20]))
  assert.ok(inBearings(355, [350, 380]))
  assert.ok(!inBearings(30, [350, 20]))
  assert.ok(inBearings(200, [0, 360]))
  assert.ok(inBearings(-10, [340, 360]))
  assert.ok(!inBearings(90, [100, 120]))
})

test('the stand reaches by radius and bearing from the eye', () => {
  const s = { radiusMeters: 1000, bearings: [-30, 30] as [number, number] }
  assert.ok(standReaches(s, [0, 0], 0, 900))
  assert.ok(!standReaches(s, [0, 0], 0, 1100))
  assert.ok(!standReaches(s, [0, 0], 900, 0))
  assert.ok(standReaches(s, [100, 100], 100, 1000))
})

test('merging: the package\'s stems past the stand kept, the stand\'s added with species renamed and z filled', () => {
  const fields = ['x', 'y', 'z', 'species', 'height', 'crownWidth', 'tone']
  const pkg = { fields, species: ['pine', 'spruce'], count: 3, data: [0, 500, 10, 0, 22, 40, 0.5, 0, 2000, 11, 1, 22, 50, 0.5, 2000, 0, 12, 1, 22, 50, 0.5] }
  const stand: FinalStand = { fields: ['x', 'y', 'species', 'height', 'crownWidth'], species: ['aspen', 'pine'], count: 2, data: new Float32Array([1, 600, 0, 20, 4, 2, 700, 1, 21, 3.5]), radiusMeters: 1000, bearings: [-45, 45] }
  const m = mergeStems(pkg, stand, [0, 0], (f, x) => (f === 'z' ? x * 100 : f === 'tone' ? 0.5 : NaN))
  assert.equal(m.kept, 2)
  assert.equal(m.fromStand, 2)
  assert.deepEqual(m.species, ['pine', 'spruce', 'aspen'])
  const row = (i: number) => Array.from(m.data.slice(i * 7, i * 7 + 7))
  assert.deepEqual(row(0), [0, 2000, 11, 1, 22, 50, 0.5])
  assert.deepEqual(row(1), [2000, 0, 12, 1, 22, 50, 0.5])
  assert.deepEqual(row(2), [1, 600, 100, 2, 20, 4, 0.5])
  assert.deepEqual(row(3).map((v) => Math.round(v * 10) / 10), [2, 700, 200, 0, 21, 3.5, 0.5])
})

test('a synthetic stand fills aggregate crowns at the density asked, keeps real stems, the same every time', () => {
  const fields = ['x', 'y', 'z', 'species', 'height', 'crownWidth', 'tone']
  const pkg = { fields, species: ['pine'], count: 2, data: [0, 1000, 0, 0, 22, 56.4, 0.5, 0, 100, 0, 0, 22, 3.8, 0.4] }
  const s = syntheticStand(pkg, [0, 0], 5000, [-90, 90], 800)
  // the clump's disk is 0.25 ha: about 200 trees, plus the real stem
  assert.ok(s.count > 180 && s.count < 220, `count ${s.count}`)
  const again = syntheticStand(pkg, [0, 0], 5000, [-90, 90], 800)
  assert.deepEqual(again.data, s.data)
  for (let i = 0; i < s.count; i++) assert.ok(s.data[i * 6 + 4] / s.data[i * 6 + 3] < 0.35)
})

test('stand stems without a place or height are left out; a missing z is filled', () => {
  const fields = ['x', 'y', 'z', 'species', 'height', 'crownWidth', 'tone']
  const pkg = { fields, species: ['pine'], count: 0, data: [] }
  const stand: FinalStand = { fields, species: ['pine'], count: 3, data: new Float32Array([1, 1, NaN, 0, 20, 3, 0.5, NaN, 2, 5, 0, 20, 3, 0.5, 3, 3, 5, 0, NaN, 3, 0.5]), radiusMeters: 100, bearings: [0, 360] }
  const m = mergeStems(pkg, stand, [0, 0], (f) => (f === 'z' ? 42 : 0.5))
  assert.equal(m.count, 1)
  assert.equal(m.data[2], 42)
  assert.ok(Array.from(m.data).every(Number.isFinite))
})

test('a table with no stems gets one placeholder far under the ground; a table with stems is unchanged', () => {
  const fields = ['x', 'y', 'z', 'species', 'height', 'crownWidth', 'tone']
  const empty = { fields, species: ['spruce'], count: 0, data: [] as number[] }
  const one = withPlaceholderStem(empty, 10, 20, 100)
  assert.equal(one.count, 1)
  assert.deepEqual(one.data, [10, 20, -400, 0, 1, 0.3, 0.5])
  assert.ok(withPlaceholderStem({ ...empty, data: new Float32Array(0) }, 0, 0, 0).data instanceof Float32Array)
  const some = { ...empty, count: 1, data: [1, 2, 3, 0, 20, 4, 0.5] }
  assert.equal(withPlaceholderStem(some, 0, 0, 0), some)
})

test('a richer final stand adds fields to a legacy package without losing ids or typed view offsets',()=>{
  const fields=['x','y','species','height'];
  const pkg={fields,species:['pine'],count:1,data:[2000,0,0,20],ids:['kept']};
  const all=new Float64Array([999,1,2,0,10,0,40,1,2,999]);
  const data=all.subarray(1,9);
  const final=readFinalOptions({quality:'final',stand:{fields:[...fields,'crownBase','dbhCm','expansion','source'],species:['cottonwood'],count:1,data,ids:['source-17'],radiusMeters:100,bearings:[0,360]}})!;
  const merged=mergeStems(pkg,final.stand!,[0,0],field=>field==='crownBase'?-1:0);
  assert.deepEqual(merged.ids,['kept','source-17']);
  assert.deepEqual(merged.fields,[...fields,'crownBase','dbhCm','expansion','source']);
  assert.equal(merged.data[merged.fields.indexOf('crownBase')],-1);
  assert.deepEqual(Array.from(merged.data.slice(8)),[1,2,1,10,0,40,1,2]);
});

test('a valid sub-metre shrub survives final merging; an empty final stand removes covered package stems',()=>{
  const pkg={fields:['x','y','z','species','height'],species:['pine'],count:1,data:[0,0,10,0,20]};
  const empty:FinalStand={fields:pkg.fields,species:['pine'],count:0,data:new Float32Array(),radiusMeters:100,bearings:[0,360]};
  assert.equal(mergeStems(pkg,empty,[0,0],()=>0).count,0);
  const shrub:FinalStand={...empty,fields:[...pkg.fields,'form'],count:1,data:new Float32Array([1,1,10,0,.3,2])};
  const merged=mergeStems(pkg,shrub,[0,0],()=>0);assert.equal(merged.count,1);assert.equal(merged.data[5],2);assert.ok(Math.abs(merged.data[4]-.3)<1e-6);
});
