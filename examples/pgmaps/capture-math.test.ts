import assert from 'node:assert/strict'
import { test } from 'node:test'
import { PerspectiveCamera, Vector3 } from 'three'
import {
  captureMissing, classRasterKey, framePoints, stemClasses, classPixels, halfToFloat, linearDepth, paddedRow, pinholePose, rasterizeClassLayers, readCaptureRequest, unpadRows,
  type CaptureFrame, type CaptureLayer, type GridBounds, type Rgb,
} from './capture-math.ts'

const DEG = Math.PI / 180

/**
 * PGMaps' projectToFrame (src/pages/dev-forestry/figureFraming.ts), in package metres: the projection the sheet's
 * outlines are drawn with. Copied as it is there; the engine's camera must put every point at the same pixel.
 */
function projectToFrame(frame: CaptureFrame, eye: [number, number, number], point: [number, number, number]): [number, number] | null {
  const b = frame.bearingDegrees * DEG, p = frame.pitchDegrees * DEG
  const forward = [Math.sin(b) * Math.cos(p), Math.cos(b) * Math.cos(p), Math.sin(p)]
  const right = [Math.cos(b), -Math.sin(b), 0]
  const up = [-Math.sin(b) * Math.sin(p), -Math.cos(b) * Math.sin(p), Math.cos(p)]
  const tanH = Math.tan((frame.horizontalFovDegrees * DEG) / 2), tanV = Math.tan((frame.verticalFovDegrees * DEG) / 2)
  const d = [point[0] - eye[0], point[1] - eye[1], point[2] - eye[2]]
  const dot = (v: number[]) => v[0] * d[0] + v[1] * d[1] + v[2] * d[2]
  const z = dot(forward)
  if (z <= 1e-6) return null
  const x = frame.width / 2 + (dot(right) / z / tanH) * (frame.width / 2)
  const y = frame.height / 2 - (dot(up) / z / tanV) * (frame.height / 2)
  return x >= 0 && y >= 0 && x <= frame.width && y <= frame.height ? [x, y] : null
}

/** The page's camera for a frame (pgmaps-scene.ts applies the pose exactly so), and a package point's pixel through it. */
function threePixel(frame: CaptureFrame, eye: [number, number, number], point: [number, number, number]): [number, number] {
  const pose = pinholePose(eye, frame)
  const camera = new PerspectiveCamera(pose.fov, pose.aspect, 0.3, 30000)
  camera.position.set(...pose.position)
  camera.up.set(...pose.up)
  camera.lookAt(...pose.target)
  camera.updateProjectionMatrix()
  camera.updateMatrixWorld()
  const ndc = new Vector3(point[0], point[2], -point[1]).project(camera)
  return [((ndc.x + 1) / 2) * frame.width, ((1 - ndc.y) / 2) * frame.height]
}

/** The sheet's frames: a field and pixel size such that width / height is tan(h/2) / tan(v/2), as PGMaps sends them. */
function frameOf(bearingDegrees: number, pitchDegrees: number, hfov: number, height: number): CaptureFrame {
  const vfov = 2 * Math.atan(Math.tan((hfov * DEG) / 2) * (height / Math.round(height * 1.4))) / DEG
  const width = Math.round(height * Math.tan((hfov * DEG) / 2) / Math.tan((vfov * DEG) / 2))
  return { bearingDegrees, pitchDegrees, horizontalFovDegrees: hfov, verticalFovDegrees: vfov, width, height }
}

test('a point lands at the same pixel through the three camera as through projectToFrame, to 0.5 px', () => {
  let worst = 0, checked = 0
  const eye: [number, number, number] = [123.4, -56.7, 712.3]
  for (const bearing of [0, 37.5, 90, 181, 270, 344])
    for (const pitch of [-12, -3, 0, 4.5, 20])
      for (const [hfov, height] of [[60, 540], [72.3, 900], [38, 1200]] as const) {
        const frame = frameOf(bearing, pitch, hfov, height)
        for (let k = 0; k < 40; k++) {
          // points scattered in front of the eye, 30 m to 9 km out, above and below it
          const az = (bearing + (((k * 37) % 61) - 30) * (hfov / 70)) * DEG, dist = 30 + ((k * 211) % 9000)
          const el = (pitch + (((k * 13) % 31) - 15) * 0.8) * DEG
          const point: [number, number, number] = [eye[0] + Math.sin(az) * Math.cos(el) * dist, eye[1] + Math.cos(az) * Math.cos(el) * dist, eye[2] + Math.sin(el) * dist]
          const want = projectToFrame(frame, eye, point)
          if (!want) continue
          const got = threePixel(frame, eye, point)
          worst = Math.max(worst, Math.hypot(got[0] - want[0], got[1] - want[1]))
          checked++
        }
      }
  assert.ok(checked > 1000, `${checked} points checked`)
  assert.ok(worst < 0.5, `worst ${worst.toFixed(4)} px`)
  assert.ok(worst < 1e-3, `worst ${worst.toFixed(6)} px (the same pinhole: only float error)`)
})

test('the pose looks along the bearing and pitch, north at -z, with no roll', () => {
  const pose = pinholePose([0, 0, 100], { bearingDegrees: 90, pitchDegrees: 0, horizontalFovDegrees: 60, verticalFovDegrees: 40 })
  assert.deepEqual(pose.position, [0, 100, -0])
  assert.ok(Math.abs(pose.forward[0] - 1) < 1e-12 && Math.abs(pose.forward[1]) < 1e-12 && Math.abs(pose.forward[2]) < 1e-12) // (east)
  const north = pinholePose([0, 0, 0], { bearingDegrees: 0, pitchDegrees: 10, horizontalFovDegrees: 60, verticalFovDegrees: 40 })
  assert.ok(north.forward[2] < 0 && north.forward[1] > 0)
  assert.ok(Math.abs(pose.aspect - Math.tan(30 * DEG) / Math.tan(20 * DEG)) < 1e-12)
})

test('class layers fill by texel centre, bottom first, holes open, cut at the grid', () => {
  const bounds = { west: 0, south: 0, east: 10, north: 10 }
  const square = (x0: number, y0: number, x1: number, y1: number): Array<[number, number]> => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
  const t = rasterizeClassLayers(bounds, [10, 20, 30], [
    { id: 'landform', rgb: [200, 0, 0], polygons: [[square(2, 2, 8, 8), square(4, 4, 6, 6)]] },
    { id: 'block', rgb: [0, 200, 0], polygons: [[square(7, 7, 14, 9)]] },
  ], 4096, 1)
  assert.equal(t.width, 10)
  assert.equal(t.height, 10)
  const at = (x: number, y: number) => { const c = Math.floor(x), r = Math.floor(10 - y); return Array.from(t.data.slice((r * 10 + c) * 4, (r * 10 + c) * 4 + 4)) }
  assert.deepEqual(at(1.5, 1.5), [10, 20, 30, 255]) // (terrain)
  assert.deepEqual(at(2.5, 2.5), [200, 0, 0, 255]) // (the landform; row 0 is the north edge)
  assert.deepEqual(at(5.5, 5.5), [10, 20, 30, 255]) // (its hole)
  assert.deepEqual(at(7.5, 7.5), [0, 200, 0, 255]) // (the block over it)
  assert.deepEqual(at(9.5, 8.5), [0, 200, 0, 255])
  assert.deepEqual(at(9.5, 9.5), [10, 20, 30, 255])
  assert.equal(t.painted.landform, 36 - 4)
  assert.equal(t.painted.block, 6)
  assert.deepEqual(t.cut, ['block'])
})

test('linear depth inverts the WebGPU perspective depth, the sky 0', () => {
  const near = 0.3, far = 30000
  const depthOf = (z: number) => (far * (z - near)) / (z * (far - near)) // (three's WebGPU projection, 0..1)
  const zs = [0.3, 2, 47.5, 500, 4000]
  const raw = new Float32Array([...zs.map(depthOf), 1, 0, 0])
  const out = linearDepth(raw, 3, 2, near, far, 4) // (rows of 4: a padded readback)
  assert.ok(Math.abs(out[0] - 0.3) < 1e-4)
  assert.ok(Math.abs(out[1] - 2) < 1e-3)
  assert.ok(Math.abs(out[2] - 47.5) < 0.05)
  assert.ok(Math.abs(out[3] - 4000) / 4000 < 0.01)
  assert.equal(out[4], 0) // (d = 1: sky)
})

test('class pixels from half floats round to the exact byte; the sky is transparent', () => {
  const toHalf = (v: number) => { // (enough of a float to half for 0..1)
    if (v === 0) return 0
    const e = Math.floor(Math.log2(v)), m = Math.round((v / 2 ** e - 1) * 1024)
    return ((e + 15) << 10) | m
  }
  for (let k = 0; k <= 255; k++) assert.equal(Math.round(halfToFloat(toHalf(k / 255)) * 255), k)
  const halfs = [toHalf(1), toHalf(128 / 255), toHalf(0), toHalf(1), toHalf(0.5), toHalf(0.5), toHalf(0.5), toHalf(1)]
  const px = classPixels(halfs, 2, 1, [12, 0])
  assert.deepEqual(Array.from(px), [255, 128, 0, 255, 0, 0, 0, 0])
  assert.equal(paddedRow(1200, 8, 2), 4864)
  assert.equal(paddedRow(960, 4, 1), 3840)
  const out = unpadRows([1, 2, 3, 4, 9, 9, 5, 6, 7, 8, 9, 9], 1, 2, 4, 6, new Uint8Array(8))
  assert.deepEqual(Array.from(out), [1, 2, 3, 4, 5, 6, 7, 8])
})

test('a request is checked before anything is drawn', () => {
  const ok = {
    type: 'pgmaps-capture', id: 'c1', position: [0, 0, 700],
    frames: [{ bearingDegrees: 10, pitchDegrees: 2, horizontalFovDegrees: 60, verticalFovDegrees: 36, width: 960, height: 540 }],
    classes: { terrain: [1, 2, 3], layers: [{ id: 'l', rgb: [4, 5, 6], polygons: [] }], vegetation: [255, 255, 255], water: [255, 128, 0] },
  }
  assert.equal(readCaptureRequest(ok).frames[0].width, 960)
  assert.throws(() => readCaptureRequest({ ...ok, frames: [] }), /no frames/)
  assert.throws(() => readCaptureRequest({ ...ok, position: [0, 0] }), /position/)
  assert.throws(() => readCaptureRequest({ ...ok, frames: [{ ...ok.frames[0], pitchDegrees: 90 }] }), /pitch/)
  assert.throws(() => readCaptureRequest({ ...ok, classes: { ...ok.classes, water: [0, 0, 300] } }), /water/)
})

test('a zone pass is read with its own terrain colour and layers, and is absent when not asked', () => {
  const base = { type: 'pgmaps-capture', id: 'z', position: [0, 0, 500], frames: [{ bearingDegrees: 0, pitchDegrees: 0, horizontalFovDegrees: 60, verticalFovDegrees: 34, width: 64, height: 36 }], classes: { terrain: [1, 2, 3], layers: [], vegetation: [255, 255, 255], water: [255, 128, 0] } }
  assert.equal(readCaptureRequest(base).zones, undefined)
  const r = readCaptureRequest({ ...base, zones: { terrain: [9, 9, 9], layers: [{ id: 'R', rgb: [10, 20, 30], polygons: [[[[0, 0], [1, 0], [1, 1]]]] }] } })
  assert.deepEqual(r.zones?.terrain, [9, 9, 9])
  assert.equal(r.zones?.layers[0].id, 'R')
  assert.throws(() => readCaptureRequest({ ...base, zones: { terrain: [9, 9], layers: [] } }), /zone terrain/)
})

test("a pixel's depth goes back to the package point projectToFrame put there", () => {
  const frame: CaptureFrame = { bearingDegrees: 37, pitchDegrees: -4, horizontalFovDegrees: 70, verticalFovDegrees: 40, width: 200, height: 100 }
  const eye: [number, number, number] = [10, -20, 600]
  const depth = new Float32Array(frame.width * frame.height)
  const b = frame.bearingDegrees * DEG, p = frame.pitchDegrees * DEG
  const forward = [Math.sin(b) * Math.cos(p), Math.cos(b) * Math.cos(p), Math.sin(p)]
  const right = [Math.cos(b), -Math.sin(b), 0]
  const up = [-Math.sin(b) * Math.sin(p), -Math.cos(b) * Math.sin(p), Math.cos(p)]
  const along = (d: number, r: number, u: number): [number, number, number] => [0, 1, 2].map((k) => eye[k] + forward[k] * d + right[k] * r + up[k] * u) as [number, number, number]
  const points = [along(2000, 300, -100), along(500, -200, 40), along(5600, 1500, 300)]
  const at: Array<[number, number]> = []
  for (const q of points) {
    const px = projectToFrame(frame, eye, q)!
    // (the pixel whose centre the point falls nearest; its depth along the view axis)
    const ix = Math.floor(px[0]), iy = Math.floor(px[1])
    depth[iy * frame.width + ix] = (q[0] - eye[0]) * forward[0] + (q[1] - eye[1]) * forward[1] + (q[2] - eye[2]) * forward[2]
    at.push([ix, iy])
  }
  const got: number[][] = []
  framePoints(eye, frame, depth, 1, (x, y, z) => got.push([x, y, z]))
  assert.equal(got.length, 3)
  for (const q of points) {
    const near = got.find((g) => Math.hypot(g[0] - q[0], g[1] - q[1], g[2] - q[2]) < 0.02 * Math.hypot(q[0] - eye[0], q[1] - eye[1]))
    assert.ok(near, `no point near ${q}`)
  }
})

test('missing notes: short phrases for the sheet, only what the frames show, at length in the detail', () => {
  const seen = { drawn: 1000, invented: 0, filled: 0, far: 300, beyondTrees: 0 }
  const none = captureMissing({ seen, realGroundMeters: 15000, farTerrain: true, treeReachMeters: 5600, stems: 80000, cut: [] })
  assert.deepEqual(none, { missing: [], missingDetail: [] })
  const all = captureMissing({ seen: { ...seen, invented: 12, filled: 3, beyondTrees: 140 }, realGroundMeters: 15000, farTerrain: true, treeReachMeters: 5630, stems: 80000, cut: ['landform-1'], zonesCut: ['vqo-a-very-long-zone-name', 'vqo-another-long-zone-name', 'third'] })
  assert.deepEqual(all.missing, ['trees past 5.6 km not drawn', 'terrain past 15.0 km invented', 'terrain gaps filled from neighbours', 'landform-1 cut at the terrain edge', 'zone polygons cut at the terrain edge'])
  assert.ok(all.missing.every((m) => m.length <= 60))
  assert.equal(all.missingDetail.length, all.missing.length)
  assert.match(all.missingDetail[0], /80,000 stems.*5,630 m.*14\.0% of the frames/)
})

test("a stem takes the class of the ground under it: a landform's forest is the landform, unlisted ground screens", () => {
  const bounds = { west: 0, south: 0, east: 100, north: 100 }
  const landform: [number, number][] = [[0, 0], [60, 0], [60, 100], [0, 100]]
  const block: [number, number][] = [[20, 20], [40, 20], [40, 40], [20, 40]]
  const layers = [
    { id: 'landform', rgb: [200, 0, 200] as [number, number, number], polygons: [[landform]] },
    { id: 'proposedIn', rgb: [0, 200, 0] as [number, number, number], polygons: [[block]] },
  ]
  const near = rasterizeClassLayers(bounds, [96, 96, 96], layers)
  const far = rasterizeClassLayers({ west: -1000, south: -1000, east: 1000, north: 1000 }, [96, 96, 96], [...layers, { id: 'rock', rgb: [9, 9, 9], polygons: [[[[300, 300], [400, 300], [400, 400], [300, 400]]]] }], 512, 2)
  const stems = [
    10, 50, // landform
    30, 30, // the block (painted over the landform)
    80, 50, // unlisted ground
    350, 350, // far: rock
    -500, 0, // far, unlisted
    5000, 0, // past every raster
    50, 90, // landform, but standing in water
  ]
  const { rgb, counts } = stemClasses({ stems, rasters: [near, far], terrain: [96, 96, 96], vegetation: [255, 255, 255], layers: [...layers, { id: 'rock', rgb: [9, 9, 9] }], onWater: (x, y) => x >= 0 && x <= 100 && y > 85 })
  const of = (i: number) => [...rgb.subarray(i * 3, i * 3 + 3)]
  assert.deepEqual(of(0), [200, 0, 200])
  assert.deepEqual(of(1), [0, 200, 0])
  assert.deepEqual(of(2), [255, 255, 255])
  assert.deepEqual(of(3), [9, 9, 9])
  assert.deepEqual(of(4), [255, 255, 255])
  assert.deepEqual(of(5), [255, 255, 255])
  assert.deepEqual(of(6), [255, 255, 255])
  assert.deepEqual(counts, { landform: 1, proposedIn: 1, vegetation: 4, rock: 1 })
})

/** The class rasters as they were filled before the words: a four-number array set for every texel. */
function texelByTexel(bounds: GridBounds, terrain: Rgb, layers: readonly CaptureLayer[], maxSide = 4096, minTexel = 1) {
  const spanX = Math.max(1e-6, bounds.east - bounds.west), spanY = Math.max(1e-6, bounds.north - bounds.south)
  const width = Math.max(1, Math.min(maxSide, Math.ceil(spanX / minTexel))), height = Math.max(1, Math.min(maxSide, Math.ceil(spanY / minTexel)))
  const tx = spanX / width, ty = spanY / height
  const data = new Uint8Array(width * height * 4)
  for (let i = 0; i < width * height; i++) data.set([terrain[0], terrain[1], terrain[2], 255], i * 4)
  const cut: string[] = [], painted: Record<string, number> = {}, xs: number[] = []
  for (const layer of layers) {
    let count = 0, outside = false
    for (const polygon of layer.polygons) {
      const rings = polygon.filter((r) => Array.isArray(r) && r.length >= 3)
      if (!rings.length) continue
      let minY = Infinity, maxY = -Infinity
      for (const r of rings)
        for (const [x, y] of r) {
          if (x < bounds.west || x > bounds.east || y < bounds.south || y > bounds.north) outside = true
          if (y < minY) minY = y
          if (y > maxY) maxY = y
        }
      const r0 = Math.max(0, Math.ceil((bounds.north - maxY) / ty - 0.5)), r1 = Math.min(height - 1, Math.floor((bounds.north - minY) / ty - 0.5))
      for (let row = r0; row <= r1; row++) {
        const y = bounds.north - (row + 0.5) * ty
        xs.length = 0
        for (const r of rings)
          for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
            const [xi, yi] = r[i], [xj, yj] = r[j]
            if (yi > y !== yj > y) xs.push(xi + ((y - yi) * (xj - xi)) / (yj - yi))
          }
        xs.sort((a, b) => a - b)
        for (let k = 0; k + 1 < xs.length; k += 2) {
          const c0 = Math.max(0, Math.ceil((xs[k] - bounds.west) / tx - 0.5)), c1 = Math.min(width - 1, Math.ceil((xs[k + 1] - bounds.west) / tx - 0.5) - 1)
          for (let col = c0; col <= c1; col++) {
            data.set([layer.rgb[0], layer.rgb[1], layer.rgb[2], 255], (row * width + col) * 4)
            count++
          }
        }
      }
    }
    painted[layer.id] = count
    if (outside) cut.push(layer.id)
  }
  return { data, width, height, cut, painted }
}

/** Class layers as a request carries them: overlapping blobs with holes, some past the grid, one degenerate. */
function someLayers(seed: number): CaptureLayer[] {
  let s = seed
  const rnd = () => ((s = (Math.imul(s, 1664525) + 1013904223) >>> 0), s / 4294967296)
  const blob = (cx: number, cy: number, radius: number, n: number): Array<[number, number]> =>
    Array.from({ length: n }, (_, k) => {
      const a = (k / n) * Math.PI * 2, r = radius * (0.5 + rnd())
      return [cx + Math.cos(a) * r, cy + Math.sin(a) * r]
    })
  const layer = (id: string, rgb: Rgb, n: number, radius: number): CaptureLayer => ({
    id, rgb,
    polygons: Array.from({ length: n }, () => {
      const cx = rnd() * 2600 - 1300, cy = rnd() * 2600 - 1300
      return rnd() < 0.5 ? [blob(cx, cy, radius, 40)] : [blob(cx, cy, radius, 25), blob(cx, cy, radius * 0.2, 7)]
    }),
  })
  return [layer('landform', [0, 160, 0], 2, 700), layer('rock', [150, 70, 210], 9, 120), { id: 'sliver', rgb: [1, 2, 3], polygons: [[[[0, 0], [1, 1]]]] }, layer('proposedIn', [255, 0, 0], 5, 60)]
}

test('the class rasters filled a word at a time are the bytes the texel-by-texel fill gave', () => {
  const grids: Array<[GridBounds, number, number]> = [
    [{ west: -1000, south: -1000, east: 1000, north: 1000 }, 512, 1],
    [{ west: -1500, south: -900, east: 1500, north: 1100 }, 300, 2],
    [{ west: -4000, south: -4000, east: 4000, north: 4000 }, 256, 10],
    [{ west: -50, south: -50, east: 50, north: 50 }, 4096, 1],
  ]
  for (const seed of [1, 2, 3])
    for (const [bounds, maxSide, minTexel] of grids) {
      const layers = someLayers(seed)
      const want = texelByTexel(bounds, [96, 96, 96], layers, maxSide, minTexel), got = rasterizeClassLayers(bounds, [96, 96, 96], layers, maxSide, minTexel)
      assert.deepEqual([got.width, got.height], [want.width, want.height])
      assert.ok(Buffer.from(got.data).equals(Buffer.from(want.data)), `seed ${seed}, ${maxSide} texels: the bytes`)
      assert.deepEqual(got.painted, want.painted)
      assert.deepEqual(got.cut, want.cut)
    }
  // (some of each layer painted, so the comparison is of more than the terrain)
  const t = rasterizeClassLayers(grids[0][0], [96, 96, 96], someLayers(1), 512, 1)
  assert.ok(t.painted.landform > 1000 && t.painted.rock > 100 && t.painted.proposedIn > 10 && t.painted.sliver === 0)
})

test('the class rasters key: the same layers and grids the same key, any changed value another', () => {
  const grids = [{ bounds: { west: -1000, south: -1000, east: 1000, north: 1000 } }, { bounds: { west: -4000, south: -4000, east: 4000, north: 4000 }, maxSide: 4096, minTexel: 2 }]
  const terrain: Rgb = [96, 96, 96]
  const layers = someLayers(7)
  const key = classRasterKey(grids, terrain, layers)
  assert.equal(classRasterKey(structuredClone(grids), [96, 96, 96], structuredClone(layers)), key)
  assert.equal(classRasterKey(grids, terrain, someLayers(7)), key)
  // (the limits' defaults are the rasterizer's)
  assert.equal(classRasterKey([{ ...grids[0], maxSide: 4096, minTexel: 1 }, grids[1]], terrain, layers), key)
  const keys = new Set([key])
  const differs = (k: string, what: string) => {
    assert.ok(!keys.has(k), what)
    keys.add(k)
  }
  for (const edge of ['west', 'south', 'east', 'north'] as const) differs(classRasterKey([{ bounds: { ...grids[0].bounds, [edge]: grids[0].bounds[edge] + 0.5 } }, grids[1]], terrain, layers), `the near grid's ${edge}`)
  differs(classRasterKey([grids[0], { ...grids[1], minTexel: 10 }], terrain, layers), 'a texel limit')
  differs(classRasterKey([grids[0], { ...grids[1], maxSide: 2048 }], terrain, layers), 'a size limit')
  differs(classRasterKey([grids[0]], terrain, layers), 'a grid fewer')
  differs(classRasterKey(grids, [96, 96, 97], layers), 'the terrain colour')
  differs(classRasterKey(grids, terrain, layers.slice(0, -1)), 'a layer fewer')
  differs(classRasterKey(grids, terrain, [layers[1], layers[0], ...layers.slice(2)]), 'the layers in another order')
  differs(classRasterKey(grids, terrain, layers.map((l, i) => (i === 1 ? { ...l, id: 'rocks' } : l))), 'a layer renamed')
  differs(classRasterKey(grids, terrain, layers.map((l, i) => (i === 3 ? { ...l, rgb: [255, 0, 1] as Rgb } : l))), 'a layer recoloured')
  // every vertex of every layer, moved by a millimetre
  let moved = 0
  layers.forEach((l, li) => l.polygons.forEach((polygon, pi) => polygon.forEach((ring, ri) => ring.forEach((_, vi) => {
    for (const axis of [0, 1]) {
      const copy = structuredClone(layers)
      copy[li].polygons[pi][ri][vi][axis] += 0.001
      differs(classRasterKey(grids, terrain, copy), `layer ${li} polygon ${pi} ring ${ri} vertex ${vi} axis ${axis}`)
      moved++
    }
  }))))
  assert.ok(moved > 1000)
})
