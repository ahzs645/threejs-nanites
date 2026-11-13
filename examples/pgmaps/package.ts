// The PGMaps forest scene package (PGMaps' src/pages/dev-forestry/scenePackage.ts) as this adapter reads it, and the
// parent's environment message: the date, place, ground and weather, with the sun placed from them.
//
// The package is local metres: x east, y north, z up (heights absolute). In three, y is up and north is -z.

export type Ring = Array<[number, number]>;

export interface SpeciesInfo {
  label?: string;
  /** Mean crown width / height of the species (PGMaps' figure; the stems carry their own). */
  crownRatio?: number;
  /** Where the live crown starts, as a share of the height. */
  crownBase?: number;
  broadleaf?: boolean;
}

export interface ScenePackage {
  format: 'pgmaps-forest-scene';
  version: 1;
  origin?: { lng: number; lat: number; elevationMeters: number };
  terrain: { west: number; south: number; spacing: number; columns: number; rows: number; heights: Array<number | null> };
  /** fields: x, y, z, species (index into `species`), height, crownWidth, tone (0..1). */
  trees: { fields: string[]; species: string[]; count: number; data: number[] };
  species?: Record<string, SpeciesInfo>;
  models?: Record<string, { positions: number[]; normals: number[]; bark: number[] }>;
  /** Cut blocks and other cleared ground: rings in local metres (outer ring first, then holes). */
  openings?: Array<{ kind?: string; rings: Ring[] }>;
  /** Slash piles and logs: fields x, y, z, footprint (m across). */
  debris?: { fields: string[]; count: number; data: number[] };
  /** Road cut and fill slopes: exposed soil and rock. */
  roadScars?: Array<{ kind: 'cut' | 'fill'; ring: Ring }>;
  /** Lakes and ponds (optional): outer ring then holes; the surface's elevation, or null for the lowest ground on the shore. */
  water?: Array<{ rings: Ring[]; elevationMeters: number | null }>;
  camera: { position: [number, number, number]; bearingDegrees: number; pitchDegrees: number; verticalFovDegrees: number };
  treeRadiusMeters?: number;
}

export type Ground = 'bare' | 'snow';
export type Weather = 'clear' | 'overcast' | 'rain' | 'snow';

/** The parent's `pgmaps-environment` message (without its type). */
export interface Environment {
  dateTime?: string;
  latitude?: number;
  longitude?: number;
  ground: Ground;
  weather: Weather;
}

/** No message: a clear summer midday, as the adapter always drew (the sun high in the south-south-west). */
export const DEFAULT_ENVIRONMENT: Environment = { ground: 'bare', weather: 'clear' };

const GROUNDS: Ground[] = ['bare', 'snow'];
const WEATHERS: Weather[] = ['clear', 'overcast', 'rain', 'snow'];

/** A message's or the URL's environment, with anything unknown dropped (null: nothing usable). */
export function parseEnvironment(data: Record<string, unknown> | null | undefined): Environment | null {
  if (!data) return null;
  const num = (v: unknown): number | undefined => (v === undefined || v === null || v === '' || !Number.isFinite(Number(v)) ? undefined : Number(v));
  const dateTime = typeof data.dateTime === 'string' && !Number.isNaN(Date.parse(data.dateTime)) ? data.dateTime : undefined;
  const ground = GROUNDS.includes(data.ground as Ground) ? (data.ground as Ground) : 'bare';
  const weather = WEATHERS.includes(data.weather as Weather) ? (data.weather as Weather) : 'clear';
  return { dateTime, latitude: num(data.latitude), longitude: num(data.longitude), ground, weather };
}

/** `?env=<json>` or `?dateTime=…&latitude=…&longitude=…&ground=snow&weather=overcast` (standalone testing). */
export function environmentFromUrl(params: URLSearchParams): Environment | null {
  const env = params.get('env');
  if (env) {
    try {
      return parseEnvironment(JSON.parse(env));
    } catch {
      return null;
    }
  }
  const keys = ['dateTime', 'latitude', 'longitude', 'ground', 'weather'];
  if (!keys.some((k) => params.has(k))) return null;
  return parseEnvironment(Object.fromEntries(keys.map((k) => [k, params.get(k) ?? undefined])));
}

/**
 * The sun's elevation and azimuth (degrees; azimuth clockwise from north) at `date` from latitude / longitude
 * (degrees, east positive): NOAA's solar position equations (Meeus), good to a fraction of a degree, no refraction.
 */
export function solarPosition(date: Date, latitude: number, longitude: number): { elevation: number; azimuth: number } {
  const rad = Math.PI / 180;
  const jd = date.getTime() / 86400000 + 2440587.5;
  const t = (jd - 2451545) / 36525;
  const L0 = (((280.46646 + t * (36000.76983 + t * 0.0003032)) % 360) + 360) % 360;
  const M = 357.52911 + t * (35999.05029 - 0.0001537 * t);
  const e = 0.016708634 - t * (0.000042037 + 0.0000001267 * t);
  const C = Math.sin(M * rad) * (1.914602 - t * (0.004817 + 0.000014 * t)) + Math.sin(2 * M * rad) * (0.019993 - 0.000101 * t) + Math.sin(3 * M * rad) * 0.000289;
  const omega = 125.04 - 1934.136 * t;
  const lambda = L0 + C - 0.00569 - 0.00478 * Math.sin(omega * rad);
  const eps0 = 23 + (26 + (21.448 - t * (46.815 + t * (0.00059 - t * 0.001813))) / 60) / 60;
  const eps = eps0 + 0.00256 * Math.cos(omega * rad);
  const decl = Math.asin(Math.sin(eps * rad) * Math.sin(lambda * rad));
  const y = Math.tan((eps * rad) / 2) ** 2;
  const eqTime = (4 / rad) * (y * Math.sin(2 * L0 * rad) - 2 * e * Math.sin(M * rad) + 4 * e * y * Math.sin(M * rad) * Math.cos(2 * L0 * rad)
    - 0.5 * y * y * Math.sin(4 * L0 * rad) - 1.25 * e * e * Math.sin(2 * M * rad)); // minutes
  const utcMinutes = date.getUTCHours() * 60 + date.getUTCMinutes() + date.getUTCSeconds() / 60;
  const solarMinutes = (((utcMinutes + eqTime + 4 * longitude) % 1440) + 1440) % 1440;
  const ha = (solarMinutes / 4 - 180) * rad;
  const lat = latitude * rad;
  const cosZenith = Math.min(1, Math.max(-1, Math.sin(lat) * Math.sin(decl) + Math.cos(lat) * Math.cos(decl) * Math.cos(ha)));
  const elevation = 90 - Math.acos(cosZenith) / rad;
  const azimuth = ((Math.atan2(Math.sin(ha), Math.cos(ha) * Math.sin(lat) - Math.tan(decl) * Math.cos(lat)) / rad + 180) % 360 + 360) % 360;
  return { elevation, azimuth };
}

/** The default sun (no date given): 50 degrees up in the south-south-west, a summer early afternoon in B.C. */
export const DEFAULT_SUN = { elevation: 50, azimuth: 200 };

/** The sun for an environment at the package's origin (the message's latitude / longitude first). */
export function sunFor(env: Environment, origin?: ScenePackage['origin']): { elevation: number; azimuth: number } {
  if (!env.dateTime) return DEFAULT_SUN;
  const lat = env.latitude ?? origin?.lat, lon = env.longitude ?? origin?.lng;
  if (lat === undefined || lon === undefined) return DEFAULT_SUN;
  return solarPosition(new Date(env.dateTime), lat, lon);
}
