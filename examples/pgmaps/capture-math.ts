// The pure parts of PGMaps' capture request (`pgmaps-capture`, PGMaps' src/pages/dev-forestry/engineCapture.ts): the
// request read and checked, each frame's pinhole as a three.js camera pose, the class layers rasterized over the
// terrain grid, and the GPU's readbacks (padded rows, half floats, the depth buffer) turned into the reply's straight
// RGBA class pass and linear depth. No DOM, no three.js: the node tests run it (capture-math.test.ts).
import { readFinalOptions, type FinalOptions } from './final-stand.ts';
import { contentHash } from './content-hash.ts';
//
// The package is local metres: x east, y north, z up (heights absolute). three.js here is y up with north at -z, so a
// package point (x, y, z) is three's (x, z, -y).

export type Rgb = [number, number, number];
/** Package metres, x east and y north: polygons of rings of points (outer ring first, then holes). */
export type LocalMultiPolygon = Array<Array<Array<[number, number]>>>;

export interface CaptureFrame {
  bearingDegrees: number;
  pitchDegrees: number;
  horizontalFovDegrees: number;
  verticalFovDegrees: number;
  width: number;
  height: number;
}

export interface CaptureLayer { id: string; rgb: Rgb; polygons: LocalMultiPolygon }

export interface CaptureRequest {
  type: 'pgmaps-capture';
  id: string;
  position: [number, number, number];
  frames: CaptureFrame[];
  classes: { terrain: Rgb; layers: CaptureLayer[]; vegetation: Rgb; water: Rgb };
  /** A second flat pass, when asked: these polygons on the bare terrain (no trees, water or debris), the rest `terrain`. */
  zones?: { terrain: Rgb; layers: CaptureLayer[] };
  /** `quality: 'final'`: the report's still (final-stand.ts); null: active, as the road view draws. */
  final: FinalOptions | null;
}

/** Frames bigger than this a side are refused (WebGPU's guaranteed texture size). */
export const MAX_FRAME_SIDE = 8192;

const isRecord = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object';
const finite = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);
const rgbOf = (v: unknown, what: string): Rgb => {
  if (!Array.isArray(v) || v.length !== 3 || !v.every((c) => finite(c) && c >= 0 && c <= 255)) throw new Error(`The capture's ${what} colour is not [r, g, b] in 0-255.`);
  return [Math.round(v[0]), Math.round(v[1]), Math.round(v[2])];
};

/** The request, checked: a reason the engine can send back otherwise. */
export function readCaptureRequest(data: unknown): CaptureRequest {
  if (!isRecord(data) || data.type !== 'pgmaps-capture') throw new Error('Not a capture request.');
  if (typeof data.id !== 'string' || !data.id) throw new Error('The capture request has no id.');
  const p = data.position;
  if (!Array.isArray(p) || p.length !== 3 || !p.every(finite)) throw new Error('The capture position is not [x, y, z] in metres.');
  if (!Array.isArray(data.frames) || !data.frames.length) throw new Error('The capture asks for no frames.');
  const frames = data.frames.map((f, i): CaptureFrame => {
    if (!isRecord(f)) throw new Error(`Frame ${i + 1} is not a frame.`);
    const { bearingDegrees: b, pitchDegrees: pt, horizontalFovDegrees: h, verticalFovDegrees: v, width: w, height: ht } = f;
    if (![b, pt, h, v, w, ht].every(finite)) throw new Error(`Frame ${i + 1} lacks a bearing, pitch, fields or size.`);
    const n = (x: unknown) => x as number;
    if (!(n(h) > 0 && n(h) < 179 && n(v) > 0 && n(v) < 179)) throw new Error(`Frame ${i + 1}'s fields must be between 0 and 179 degrees.`);
    if (Math.abs(n(pt)) >= 90) throw new Error(`Frame ${i + 1}'s pitch must be under 90 degrees.`);
    if (!Number.isInteger(w) || !Number.isInteger(ht) || n(w) < 1 || n(ht) < 1 || n(w) > MAX_FRAME_SIDE || n(ht) > MAX_FRAME_SIDE)
      throw new Error(`Frame ${i + 1}'s size must be whole pixels, 1 to ${MAX_FRAME_SIDE} a side.`);
    return { bearingDegrees: n(b), pitchDegrees: n(pt), horizontalFovDegrees: n(h), verticalFovDegrees: n(v), width: n(w), height: n(ht) };
  });
  const c = isRecord(data.classes) ? data.classes : null;
  if (!c) throw new Error('The capture request has no classes.');
  const layersOf = (list: unknown, what: string) => (Array.isArray(list) ? list : []).map((l, i): CaptureLayer => {
    if (!isRecord(l) || !Array.isArray(l.polygons)) throw new Error(`${what} layer ${i + 1} has no polygons.`);
    return { id: typeof l.id === 'string' ? l.id : `layer-${i + 1}`, rgb: rgbOf(l.rgb, `${what.toLowerCase()} layer ${String(l.id ?? i + 1)}`), polygons: l.polygons as LocalMultiPolygon };
  });
  const layers = layersOf(c.layers, 'Class');
  const z = isRecord(data.zones) ? data.zones : null;
  return {
    type: 'pgmaps-capture', id: data.id, position: [p[0], p[1], p[2]], frames,
    classes: { terrain: rgbOf(c.terrain, 'terrain'), layers, vegetation: rgbOf(c.vegetation, 'vegetation'), water: rgbOf(c.water, 'water') },
    ...(z ? { zones: { terrain: rgbOf(z.terrain, 'zone terrain'), layers: layersOf(z.layers, 'Zone') } } : {}),
    final: readFinalOptions(data),
  };
}

const DEG = Math.PI / 180;

/**
 * A frame's pinhole as a three.js camera: set `position`, `up`, then `lookAt(target)` (roll 0), `fov` (vertical,
 * degrees) and `aspect`. The aspect is tan(h/2) / tan(v/2), the frame's own fields, which is what PGMaps' projectToFrame
 * projects with (the request's width / height is that within a pixel's rounding).
 */
export function pinholePose(position: readonly [number, number, number], frame: Pick<CaptureFrame, 'bearingDegrees' | 'pitchDegrees' | 'horizontalFovDegrees' | 'verticalFovDegrees'>) {
  const b = frame.bearingDegrees * DEG, p = frame.pitchDegrees * DEG;
  const eye: [number, number, number] = [position[0], position[2], -position[1]];
  // (package forward (sin b cos p, cos b cos p, sin p), in three's axes)
  const forward: [number, number, number] = [Math.sin(b) * Math.cos(p), Math.sin(p), -Math.cos(b) * Math.cos(p)];
  return {
    position: eye,
    forward,
    target: [eye[0] + forward[0] * 100, eye[1] + forward[1] * 100, eye[2] + forward[2] * 100] as [number, number, number],
    up: [0, 1, 0] as [number, number, number],
    fov: frame.verticalFovDegrees,
    aspect: Math.tan((frame.horizontalFovDegrees * DEG) / 2) / Math.tan((frame.verticalFovDegrees * DEG) / 2),
  };
}

export interface GridBounds { west: number; south: number; east: number; north: number }

export interface ClassTexture {
  /** RGBA, row 0 the north edge, column 0 the west edge: a texel is a layer's when its centre is inside. */
  data: Uint8Array;
  width: number;
  height: number;
  bounds: GridBounds;
  /** Metres a texel, east and north. */
  texel: [number, number];
  /** Layers with a vertex past the grid (their ground beyond it is drawn as terrain). */
  cut: string[];
  /** Texels each layer painted (before later layers painted over them). */
  painted: Record<string, number>;
}

/**
 * The class layers over the terrain grid, bottom first (a later layer paints over an earlier one), every other texel
 * `terrain`. Each polygon fills by even-odd over its own rings (holes); polygons of a layer add. At most `maxSide`
 * texels a side and none finer than `minTexel` metres.
 */
export function rasterizeClassLayers(bounds: GridBounds, terrain: Rgb, layers: readonly CaptureLayer[], maxSide = 4096, minTexel = 1): ClassTexture {
  const spanX = Math.max(1e-6, bounds.east - bounds.west), spanY = Math.max(1e-6, bounds.north - bounds.south);
  const width = Math.max(1, Math.min(maxSide, Math.ceil(spanX / minTexel)));
  const height = Math.max(1, Math.min(maxSide, Math.ceil(spanY / minTexel)));
  const tx = spanX / width, ty = spanY / height;
  const data = new Uint8Array(width * height * 4);
  // (texels written a word at a time: a four-number array set a texel was most of the 0.25 s a 4096 x 4096 grid took,
  // 1.6 s a capture over its six grids; the bytes are the same)
  const words = new Uint32Array(data.buffer);
  const word = (rgb: Rgb): number => new Uint32Array(new Uint8Array([rgb[0], rgb[1], rgb[2], 255]).buffer)[0];
  words.fill(word(terrain));
  const cut: string[] = [];
  const painted: Record<string, number> = {};
  const xs: number[] = [];
  for (const layer of layers) {
    let count = 0, outside = false;
    const colour = word(layer.rgb);
    for (const polygon of layer.polygons) {
      const rings = polygon.filter((r) => Array.isArray(r) && r.length >= 3);
      if (!rings.length) continue;
      let minY = Infinity, maxY = -Infinity;
      for (const r of rings)
        for (const [x, y] of r) {
          if (x < bounds.west || x > bounds.east || y < bounds.south || y > bounds.north) outside = true;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      // rows whose centre lies in [minY, maxY] (row 0 the north edge)
      const r0 = Math.max(0, Math.ceil((bounds.north - maxY) / ty - 0.5)), r1 = Math.min(height - 1, Math.floor((bounds.north - minY) / ty - 0.5));
      for (let row = r0; row <= r1; row++) {
        const y = bounds.north - (row + 0.5) * ty;
        xs.length = 0;
        for (const r of rings)
          for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
            const [xi, yi] = r[i], [xj, yj] = r[j];
            if (yi > y !== yj > y) xs.push(xi + ((y - yi) * (xj - xi)) / (yj - yi));
          }
        xs.sort((a, b) => a - b);
        for (let k = 0; k + 1 < xs.length; k += 2) {
          // columns whose centre is in [xs[k], xs[k+1])
          const c0 = Math.max(0, Math.ceil((xs[k] - bounds.west) / tx - 0.5)), c1 = Math.min(width - 1, Math.ceil((xs[k + 1] - bounds.west) / tx - 0.5) - 1);
          if (c1 >= c0) {
            words.fill(colour, row * width + c0, row * width + c1 + 1);
            count += c1 - c0 + 1;
          }
        }
      }
    }
    painted[layer.id] = count;
    if (outside) cut.push(layer.id);
  }
  return { data, width, height, bounds, texel: [tx, ty], cut, painted };
}

/** One grid a capture's layers are rasterized over (`rasterizeClassLayers`' bounds and limits). */
export interface ClassGrid { bounds: GridBounds; maxSide?: number; minTexel?: number }

/**
 * The key of a set of class rasters: the content hash (content-hash.ts) of everything `rasterizeClassLayers` reads,
 * the grids' bounds and limits, the terrain colour and every layer's id, colour and polygons, in order. Two requests
 * with the same key get the same rasters, so the adapter keeps the last set's textures while the key stays the same.
 */
export function classRasterKey(grids: readonly ClassGrid[], terrain: Rgb, layers: readonly CaptureLayer[]): string {
  return contentHash({
    grids: grids.map((g) => [g.bounds.west, g.bounds.south, g.bounds.east, g.bounds.north, g.maxSide ?? 4096, g.minTexel ?? 1]),
    terrain,
    layers: layers.map((l) => [l.id, l.rgb, l.polygons]),
  });
}

/** Elements of a readback row: WebGPU copies rows of a multiple of 256 bytes. */
export const paddedRow = (width: number, bytesPerTexel: number, bytesPerElement: number): number => (Math.ceil((width * bytesPerTexel) / 256) * 256) / bytesPerElement;

/** An IEEE half float's value. */
export function halfToFloat(h: number): number {
  const s = h & 0x8000 ? -1 : 1, e = (h >> 10) & 0x1f, m = h & 0x3ff;
  if (e === 0) return s * m * 2 ** -24;
  if (e === 31) return m ? NaN : s * Infinity;
  return s * (1 + m / 1024) * 2 ** (e - 15);
}

/**
 * Metres along the view axis from a perspective depth buffer in WebGPU's 0..1 range (not reversed, not logarithmic):
 * near * far / (far - d (far - near)); 0 where nothing was drawn (d = 1, the cleared sky). `stride`: elements a row
 * in `raw` (a padded readback), rows from the top.
 */
export function linearDepth(raw: ArrayLike<number>, width: number, height: number, near: number, far: number, stride = width): Float32Array {
  const out = new Float32Array(width * height);
  for (let y = 0; y < height; y++)
    for (let x = 0; x < width; x++) {
      const d = raw[y * stride + x];
      out[y * width + x] = d >= 1 || !(d >= 0) ? 0 : (near * far) / (far - d * (far - near));
    }
  return out;
}

/**
 * The class pass as straight RGBA bytes from the scene target's half-float readback (`stride`: halfs a row, four a
 * texel): each channel's value x 255, rounded. A pixel with no depth (the sky) is transparent black.
 */
export function classPixels(halfs: ArrayLike<number>, width: number, height: number, depth: ArrayLike<number>, stride = width * 4): Uint8ClampedArray {
  const out = new Uint8ClampedArray(width * height * 4);
  for (let y = 0; y < height; y++)
    for (let x = 0; x < width; x++) {
      const i = y * width + x;
      if (!(depth[i] > 0)) continue;
      const s = y * stride + x * 4;
      for (let k = 0; k < 3; k++) out[i * 4 + k] = Math.round(halfToFloat(halfs[s + k]) * 255);
      out[i * 4 + 3] = 255;
    }
  return out;
}

/** Rows of `channels` values a texel copied out of a padded readback (`stride` elements a row). */
export function unpadRows<T extends Uint8Array | Uint8ClampedArray>(src: ArrayLike<number>, width: number, height: number, channels: number, stride: number, out: T): T {
  const row = width * channels;
  for (let y = 0; y < height; y++) for (let k = 0; k < row; k++) out[y * row + k] = src[y * stride + k];
  return out;
}

/**
 * Each sampled pixel's surface in package metres from a frame's linear depth (metres along the view axis; 0 the sky),
 * every `step` pixels across and down: `visit(x, y, z)` for each drawn one. The frame's pinhole as `projectToFrame`.
 */
export function framePoints(position: readonly [number, number, number], f: CaptureFrame, depth: ArrayLike<number>, step: number, visit: (x: number, y: number, z: number) => void): void {
  const b = f.bearingDegrees * DEG, p = f.pitchDegrees * DEG;
  const fw = [Math.sin(b) * Math.cos(p), Math.cos(b) * Math.cos(p), Math.sin(p)];
  const rt = [Math.cos(b), -Math.sin(b), 0];
  const up = [-Math.sin(b) * Math.sin(p), -Math.cos(b) * Math.sin(p), Math.cos(p)];
  const tanH = Math.tan((f.horizontalFovDegrees * DEG) / 2), tanV = Math.tan((f.verticalFovDegrees * DEG) / 2);
  for (let py = Math.floor(step / 2); py < f.height; py += step)
    for (let px = Math.floor(step / 2); px < f.width; px += step) {
      const d = depth[py * f.width + px];
      if (!(d > 0)) continue;
      const sx = (((px + 0.5) / f.width) * 2 - 1) * tanH, sy = (1 - ((py + 0.5) / f.height) * 2) * tanV;
      visit(
        position[0] + d * (fw[0] + rt[0] * sx + up[0] * sy),
        position[1] + d * (fw[1] + rt[1] * sx + up[1] * sy),
        position[2] + d * (fw[2] + rt[2] * sx + up[2] * sy),
      );
    }
}

/** What the frames' sampled surfaces stood on: counts of samples. */
export interface SeenGround {
  /** Drawn samples. */
  drawn: number;
  /** On invented ground (the apron past every grid). */
  invented: number;
  /** On a grid's gap, filled from its neighbours. */
  filled: number;
  /** On the far grid (coarse terrain). */
  far: number;
  /** Farther from the eye than the farthest stem (ground no tree stands on). */
  beyondTrees: number;
}

const km = (m: number) => `${(m / 1000).toFixed(1)} km`;
const pct = (n: number, of: number) => `${of ? ((100 * n) / of).toFixed(n && n < of / 1000 ? 2 : 1) : '0'}%`;

/**
 * The reply's `missing` (short phrases the sheet prints, at most about 60 characters) and `missingDetail` (the same at
 * length, with figures): only what the frames show.
 */
export function captureMissing(o: {
  seen: SeenGround;
  /** From the eye to the nearest edge of real ground (m), and whether that ground includes a far grid, a skyline grid. */
  realGroundMeters: number;
  farTerrain: boolean;
  skylineTerrain?: boolean;
  /** The farthest stem from the eye (m); null with no stems. */
  treeReachMeters: number | null;
  stems: number;
  /** Class layers with polygons past the ground the class rasters cover; zone layers likewise. */
  cut: string[];
  zonesCut?: string[];
}): { missing: string[]; missingDetail: string[] } {
  const { seen } = o;
  const missing: string[] = [], missingDetail: string[] = [];
  if (seen.beyondTrees > 0) {
    if (o.treeReachMeters === null) {
      missing.push('no trees drawn');
      missingDetail.push(`The package carries no stems: the frames' ground is bare, screening nothing.`);
    } else {
      missing.push(`trees past ${km(o.treeReachMeters)} not drawn`);
      missingDetail.push(`Trees are drawn only as the package's ${o.stems.toLocaleString('en-CA')} stems, the farthest ${Math.round(o.treeReachMeters).toLocaleString('en-CA')} m from the eye; ground beyond them (${pct(seen.beyondTrees, seen.drawn)} of the frames' drawn pixels) is bare and screens nothing.`);
    }
  }
  if (seen.invented > 0) {
    missing.push(`terrain past ${km(o.realGroundMeters)} invented`);
    missingDetail.push(`Ground past the package's ${o.skylineTerrain ? 'skyline terrain' : o.farTerrain ? 'far terrain' : 'terrain grid'} (its nearest edge ${km(o.realGroundMeters)} from the eye) is invented: the edge's heights easing to the grid's mean, painted the terrain class (${pct(seen.invented, seen.drawn)} of the drawn pixels).`);
  }
  if (seen.filled > 0) {
    missing.push('terrain gaps filled from neighbours');
    missingDetail.push(`Posts the package's terrain leaves unknown are filled from their nearest known neighbours (${pct(seen.filled, seen.drawn)} of the drawn pixels).`);
  }
  const cutPhrase = (ids: string[], what: string) => {
    const named = `${ids.join(', ')} cut at the terrain edge`;
    return named.length <= 60 ? named : `${what} cut at the terrain edge`;
  };
  if (o.cut.length) {
    missing.push(cutPhrase(o.cut, 'class polygons'));
    missingDetail.push(`Class polygons past the package's terrain are cut at its edge (${o.cut.join(', ')}): their ground beyond it is the terrain class.`);
  }
  if (o.zonesCut?.length) {
    missing.push(cutPhrase(o.zonesCut, 'zone polygons'));
    missingDetail.push(`Zone polygons past the package's terrain are cut at its edge (${o.zonesCut.join(', ')}): beyond it, the zone pass's terrain colour.`);
  }
  return { missing, missingDetail };
}

/** The class texel under package (x, y) of a raster (`rasterizeClassLayers`), or null outside it. */
export function classAt(r: Pick<ClassTexture, 'data' | 'width' | 'height' | 'bounds' | 'texel'>, x: number, y: number): Rgb | null {
  const col = Math.floor((x - r.bounds.west) / r.texel[0]), row = Math.floor((r.bounds.north - y) / r.texel[1]);
  if (!(col >= 0 && row >= 0 && col < r.width && row < r.height)) return null;
  const k = (row * r.width + col) * 4;
  return [r.data[k], r.data[k + 1], r.data[k + 2]];
}

/**
 * Each stem's class-pass colour from the ground under its stem: a listed layer's colour where the class rasters
 * (`rasters`, finest first) put one at its base, so a landform's own forest is the landform and a block's standing
 * stems the block; `vegetation` (screening) on unlisted ground (the `terrain` colour, or past every raster) and on
 * water. `stems`: x, y a stem (package metres); `onWater(x, y)` true where the stem stands in water. Returns three
 * bytes a stem, and the stems counted by class (a layer's id, the first with that colour; 'vegetation').
 */
export function stemClasses(o: {
  stems: ArrayLike<number>;
  rasters: ReadonlyArray<Pick<ClassTexture, 'data' | 'width' | 'height' | 'bounds' | 'texel'>>;
  terrain: Rgb;
  vegetation: Rgb;
  layers: ReadonlyArray<Pick<CaptureLayer, 'id' | 'rgb'>>;
  onWater?: (x: number, y: number) => boolean;
}): { rgb: Uint8Array; counts: Record<string, number> } {
  const n = Math.floor(o.stems.length / 2);
  const rgb = new Uint8Array(n * 3);
  const key = (c: readonly number[]) => (c[0] << 16) | (c[1] << 8) | c[2];
  const terrainKey = key(o.terrain);
  const names = new Map<number, string>();
  for (const l of o.layers) if (!names.has(key(l.rgb)) && key(l.rgb) !== terrainKey) names.set(key(l.rgb), l.id);
  const counts: Record<string, number> = {};
  for (let i = 0; i < n; i++) {
    const x = o.stems[i * 2], y = o.stems[i * 2 + 1];
    let under: Rgb | null = null;
    for (const r of o.rasters) if ((under = classAt(r, x, y))) break;
    const listed = under && names.has(key(under)) && !o.onWater?.(x, y);
    const c = listed ? under! : o.vegetation;
    rgb.set(c, i * 3);
    const name = listed ? names.get(key(under!))! : 'vegetation';
    counts[name] = (counts[name] ?? 0) + 1;
  }
  return { rgb, counts };
}
