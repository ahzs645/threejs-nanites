// How much cloud three's SkyMesh draws for its `cloudCoverage`, and the coverage that draws a given share of the sky:
// the parent's `cloudCover` is the share of the sky under cloud, and SkyMesh's coverage is a noise threshold, not a
// share (0.2 drew far less than a fifth of the sky). Its cloud field is replicated here from three's
// examples/jsm/objects/SkyMesh.js (r186: the sinless gradient hash, quintic 2D gradient noise, 4 octaves, the
// region modulation, Beer's-law opacity and the horizon fade) and averaged over the sky by solid angle. No DOM, no
// three: `node --test examples/pgmaps/sky-cover.test.ts`.
//
// Also Koschmieder's law for the haze: extinction 3.912 / visibility (2% contrast at the visibility).

const fract = (v: number) => v - Math.floor(v);

function gradient(ix: number, iy: number): [number, number] {
  // p = fract(i.xyx * (0.1031, 0.1030, 0.0973)); p += dot(p, p.yzx + 33.33); fract((p.xx + p.yz) * p.zy) * 2 - 1
  let px = fract(ix * 0.1031), py = fract(iy * 0.103), pz = fract(ix * 0.0973);
  const d = px * (py + 33.33) + py * (pz + 33.33) + pz * (px + 33.33);
  px += d; py += d; pz += d;
  return [fract((px + py) * pz) * 2 - 1, fract((px + pz) * py) * 2 - 1];
}

function noise(x: number, y: number): number {
  const ix = Math.floor(x), iy = Math.floor(y), fx = x - ix, fy = y - iy;
  const q = (f: number) => f * f * f * (f * (f * 6 - 15) + 10);
  const ux = q(fx), uy = q(fy);
  const dot = (cx: number, cy: number) => {
    const [gx, gy] = gradient(ix + cx, iy + cy);
    return gx * (fx - cx) + gy * (fy - cy);
  };
  const a = dot(0, 0), b = dot(1, 0), c = dot(0, 1), d = dot(1, 1);
  return ((a + (b - a) * ux) * (1 - uy) + (c + (d - c) * ux) * uy) * 1.6;
}

function fbm(x: number, y: number): number {
  let r = 0, amp = 1;
  for (let k = 0; k < 4; k++) {
    r += amp * noise(x, y);
    amp *= 0.5;
    x *= 2;
    y *= 2;
  }
  return r;
}

const smooth = (e0: number, e1: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};

export interface SkyCloudParams { scale: number; density: number; elevation: number }
/** SkyMesh's defaults, as the adapter leaves them. */
export const SKY_CLOUD_DEFAULTS: SkyCloudParams = { scale: 0.0002, density: 0.4, elevation: 0.5 };

/** The sky's directions, evenly spread over the upper hemisphere by solid angle (a Fibonacci lattice). */
const DIRECTIONS: Array<[number, number, number]> = (() => {
  const n = 6000, out: Array<[number, number, number]> = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = (i + 0.5) / n; // (uniform in height: uniform in solid angle)
    const r = Math.sqrt(1 - y * y), a = i * golden;
    out.push([Math.cos(a) * r, y, Math.sin(a) * r]);
  }
  return out;
})();

/** The cloud's opacity SkyMesh draws in direction `d` (unit, y up) at a coverage. */
export function cloudAlpha(d: readonly [number, number, number], coverage: number, o: SkyCloudParams = SKY_CLOUD_DEFAULTS): number {
  if (!(d[1] > 0) || !(coverage > 0)) return 0;
  const elevation = 1 + (0.1 - 1) * o.elevation;
  const u = (d[0] / (d[1] * elevation)) * o.scale, v = (d[2] / (d[1] * elevation)) * o.scale;
  const cloudNoise = Math.min(1, Math.max(0, fbm(u * 1000, v * 1000) * 0.7 + 0.5));
  const region = noise(u * 300, v * 300) * 0.37 + 0.5;
  const cov = Math.min(1, Math.max(0, coverage + (region - 0.5) * 0.6));
  const threshold = 1 - cov;
  const horizonFade = smooth(0, 0.03 + 0.06 * o.elevation, d[1]);
  const depth = Math.max(0, cloudNoise - threshold);
  return (1 - Math.exp(-depth * o.density * 12)) * horizonFade;
}

/** The share of the sky SkyMesh's clouds cover at a coverage: their mean opacity over the sky by solid angle. */
export function skyCloudShare(coverage: number, o: SkyCloudParams = SKY_CLOUD_DEFAULTS): number {
  if (!(coverage > 0)) return 0;
  let sum = 0;
  for (const d of DIRECTIONS) sum += cloudAlpha(d, coverage, o);
  return sum / DIRECTIONS.length;
}

/** The most of the sky SkyMesh's clouds cover at its default density (its opacity never reaches 1). */
export const MAX_SKY_SHARE = skyCloudShare(1);

const memo = new Map<number, { coverage: number; density: number }>();
/**
 * The SkyMesh coverage and density that draw `share` of the sky under cloud: bisection on `skyCloudShare`, the
 * coverage at the default density, and past what that can draw (about 0.73) full coverage and a denser cloud. 0: none.
 */
export function cloudParamsForShare(share: number): { coverage: number; density: number } {
  const density0 = SKY_CLOUD_DEFAULTS.density;
  if (!(share > 0)) return { coverage: 0, density: density0 };
  const key = Math.round(Math.min(1, share) * 1000);
  const hit = memo.get(key);
  if (hit) return hit;
  const solve = (f: (t: number) => number, lo: number, hi: number): number => {
    for (let k = 0; k < 18; k++) {
      const mid = (lo + hi) / 2;
      if (f(mid) < share) lo = mid;
      else hi = mid;
    }
    return (lo + hi) / 2;
  };
  const out = share < MAX_SKY_SHARE
    ? { coverage: solve((c) => skyCloudShare(c), 0, 1), density: density0 }
    : { coverage: 1, density: solve((d) => skyCloudShare(1, { ...SKY_CLOUD_DEFAULTS, density: d }), density0, 40) };
  memo.set(key, out);
  return out;
}

/** Koschmieder's extinction per metre for a meteorological visibility (km): 3.912 / V. */
export const extinctionPerMeter = (visibilityKm: number): number => 3.912 / (Math.max(0.01, visibilityKm) * 1000);
/** The share of the way to the horizon sky a surface `d` metres off is drawn: 1 − exp(−σ d). */
export const hazeShare = (visibilityKm: number, d: number): number => 1 - Math.exp(-extinctionPerMeter(visibilityKm) * d);
