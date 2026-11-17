// The PGMaps forest scene package (PGMaps' src/pages/dev-forestry/scenePackage.ts) as this adapter reads it, and the
// parent's environment message: the date, place, ground and weather, with the sun placed from them.
//
// The package is local metres: x east, y north, z up (heights absolute). In three, y is up and north is -z.
import type { CameraProjection } from './camera.ts';

export type Ring = Array<[number, number]>;

export interface SpeciesInfo {
  label?: string;
  /** Mean crown width / height of the species (PGMaps' figure; the stems carry their own). */
  crownRatio?: number;
  /** Where the live crown starts, as a share of the height. */
  crownBase?: number;
  broadleaf?: boolean;
}

/** A grid of heights: its south-west post (package metres), spacing, size, row-major from the south row, west to east. */
export interface TerrainGrid {
  west: number; south: number; spacing: number; columns: number; rows: number; heights: Array<number | null>;
  /**
   * Crown closure at each post, 0..1, the same layout as `heights`: the share of the ground under tree crowns (VRI
   * crown closure, else PGMaps' regional stand), 0 on cut, non-treed and water ground, null unknown. Absent from
   * older packages (the adapter then reads the stems' crowns).
   */
  canopy?: Array<number | null>;
  stand?: { cells: number[]; records: Array<{ heightMeters: number; species: Array<{ species: string; share: number; heightMeters?: number }>; source: 'regional' | 'inventory' | 'imported' }> };
  /**
   * Natural ground cover at each post, the same layout (PGMaps' `SCENE_COVER`, ground-cover.ts COVER): 0 forest,
   * 1 sparse forest, 2 shrub, 3 herb/grass, 4 rock or exposed soil, 5 water, 6 cut ground, 7 burnt (a recent wildfire:
   * its stems drawn as snags, burnt.ts); null unknown. Absent from older packages (the ground then drawn as before).
   */
  cover?: Array<number | null>;
  /**
   * The fire season at each burnt post (cover 7), the same layout (PGMaps' `coverOnGrid` `burntYear`: the latest
   * recent BC Wildfire Service perimeter holding the post); null elsewhere or unknown (drawn DEFAULT_BURN_AGE years
   * after the fire). Absent: every burn of unknown year. `fireYear` is read the same where `burntYear` is absent.
   */
  burntYear?: Array<number | null>;
  fireYear?: Array<number | null>;
}

/** Cleared ground: rings in local metres (outer ring first, then holes). */
export interface Opening {
  kind?: string;
  rings: Ring[];
  /** Years from harvest to the view's date (0: just cut); null or absent: unknown (drawn as about a year). */
  ageYears?: number | null;
  /** The share of the stand left standing in it as dispersed trees, 0..1 (those stems are in `trees`). */
  retainedShare?: number | null;
}

export interface ScenePackage {
  format: 'pgmaps-forest-scene';
  version: 1;
  /** When PGMaps wrote it (ISO). */
  createdAt?: string;
  origin?: { lng: number; lat: number; elevationMeters: number };
  terrain: TerrainGrid;
  /** Coarser ground past `terrain` (a capture's package, to about 15 km), the same layout; null posts unknown. */
  farTerrain?: TerrainGrid;
  /**
   * The coarsest ground past `farTerrain`, out to the frames' real skyline (a capture's package), the same layout.
   * Its heights are already lowered for the earth's curvature and refraction (`earthCurvature`): drawn as given, and
   * only where neither grid inside it has posts.
   */
  skylineTerrain?: TerrainGrid & { earthCurvature?: { earthRadiusMeters: number; refraction: number } };
  /** fields: x, y, z, species (index into `species`), height, crownWidth, tone (0..1). */
  trees: { fields: string[]; species: string[]; count: number; data: number[]; ids?: string[] };
  species?: Record<string, SpeciesInfo>;
  models?: Record<string, { positions: number[]; normals: number[]; bark: number[] }>;
  /** Cut blocks and other cleared ground. */
  openings?: Opening[];
  /** Slash piles and logs: fields x, y, z, footprint (m across). */
  debris?: { fields: string[]; count: number; data: number[] };
  treated?: { fields: readonly string[]; kinds: readonly string[]; count: number; data: ArrayLike<number> };
  /** Road cut and fill slopes: exposed soil and rock. */
  roadScars?: Array<{ kind: 'cut' | 'fill'; ring: Ring }>;
  /** Lakes and ponds (optional): outer ring then holes; the surface's elevation, or null for the lowest ground on the shore. */
  water?: Array<{ rings: Ring[]; elevationMeters: number | null }>;
  camera: { position: [number, number, number]; bearingDegrees: number; pitchDegrees: number; verticalFovDegrees: number; projection?: CameraProjection };
  environment?: Environment;
  treeRadiusMeters?: number;
}

export type Ground = 'bare' | 'snow';
export type Weather = 'clear' | 'overcast' | 'rain' | 'snow';

/** The parent's `pgmaps-environment` message (without its type). */
export type SunMode = 'true' | 'daylight';

export interface Environment {
  dateTime?: string;
  /** IANA zone the parent's `dateTime` is in (used for a `dateTime` with no offset). */
  timeZone?: string;
  /** The instant as an ISO UTC string: preferred over `dateTime` when both are given. */
  utc?: string;
  /** 'true': the light from the real sun, none below the horizon; 'daylight' (or absent): held a few degrees up. */
  sun?: SunMode;
  latitude?: number;
  longitude?: number;
  /** The parent's own sun for that instant and place (degrees); used as given, so every engine lights it alike. */
  sunPosition?: { elevationDegrees: number; azimuthDegrees: number };
  ground: Ground;
  weather: Weather;
  /** Share of the sky under cloud, 0..1 (1 under overcast, rain or snow); absent: the weather's own. */
  cloudCover?: number;
  /** Meteorological visibility (km): the haze over distance by Koschmieder's law; absent: the weather's own. */
  visibilityKm?: number;
  /** Wind over water (m/s): 0 a mirror, a few m/s a ripple (Cox–Munk roughness, water.ts); absent: calm. */
  windMs?: number;
  /**
   * `via`: the consultants' renders (dark olive canopy, crisp mirror lakes, haze only past 8–10 km); `photo`: a
   * photograph's (blue-grey far forest, the haze from `visibilityKm`, wind-rippled water reflecting the sky). Absent: via.
   */
  look?: EngineLook;
}

export type EngineLook = 'via' | 'photo';

/** No message: a clear summer midday, as the adapter always drew (the sun high in the south-south-west). */
export const DEFAULT_ENVIRONMENT: Environment = { ground: 'bare', weather: 'clear' };

const GROUNDS: Ground[] = ['bare', 'snow'];
const WEATHERS: Weather[] = ['clear', 'overcast', 'rain', 'snow'];

/** A message's or the URL's environment, with anything unknown dropped (null: nothing usable). */
export function parseEnvironment(data: Record<string, unknown> | null | undefined): Environment | null {
  if (!data) return null;
  const num = (v: unknown): number | undefined => (v === undefined || v === null || v === '' || !Number.isFinite(Number(v)) ? undefined : Number(v));
  const dateTime = typeof data.dateTime === 'string' && !Number.isNaN(Date.parse(data.dateTime)) ? data.dateTime : undefined;
  const utc = typeof data.utc === 'string' && !Number.isNaN(Date.parse(data.utc)) ? data.utc : undefined;
  const timeZone = typeof data.timeZone === 'string' && validZone(data.timeZone) ? data.timeZone : undefined;
  const sun: SunMode = data.sun === 'true' ? 'true' : 'daylight';
  const ground = GROUNDS.includes(data.ground as Ground) ? (data.ground as Ground) : 'bare';
  const weather = WEATHERS.includes(data.weather as Weather) ? (data.weather as Weather) : 'clear';
  const given = data.sunPosition as Record<string, unknown> | undefined;
  const elevationDegrees = num(given?.elevationDegrees), azimuthDegrees = num(given?.azimuthDegrees);
  const sunPosition = elevationDegrees !== undefined && azimuthDegrees !== undefined ? { elevationDegrees, azimuthDegrees } : undefined;
  const cover = num(data.cloudCover), visibility = num(data.visibilityKm);
  const cloudCover = cover === undefined ? undefined : Math.min(1, Math.max(0, cover));
  const visibilityKm = visibility !== undefined && visibility > 0 ? visibility : undefined;
  const wind = num(data.windMs);
  const windMs = wind === undefined ? undefined : Math.min(20, Math.max(0, wind));
  const look: EngineLook | undefined = data.look === 'photo' ? 'photo' : data.look === 'via' ? 'via' : undefined;
  return { dateTime, timeZone, utc, sun, latitude: num(data.latitude), longitude: num(data.longitude), sunPosition, ground, weather, cloudCover, visibilityKm, windMs, look };
}

function validZone(zone: string): boolean {
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: zone });
    return true;
  } catch {
    return false;
  }
}

/** A wall-clock time with no offset ("2026-07-15T14:00") read in `zone`: the instant it names there. */
function inZone(wall: string, zone: string): Date {
  const asUtc = Date.parse(`${wall}Z`);
  const offset = (t: number): number => {
    const p = Object.fromEntries(new Intl.DateTimeFormat('en-US', { timeZone: zone, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' })
      .formatToParts(new Date(t)).map((x) => [x.type, x.value]));
    return Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute, +p.second) - Math.floor(t / 1000) * 1000;
  };
  let t = asUtc - offset(asUtc);
  t = asUtc - offset(t); // (once more: across a change of offset)
  return new Date(t);
}

/** The environment's instant: `utc` when given, else `dateTime` (with no offset of its own, read in `timeZone`). */
export function instantOf(env: Environment): Date | null {
  if (env.utc) return new Date(env.utc);
  if (!env.dateTime) return null;
  const hasOffset = /(?:Z|[+-]\d{2}(?::?\d{2})?)$/i.test(env.dateTime) || !/T\d/.test(env.dateTime);
  if (!hasOffset && env.timeZone && !Number.isNaN(Date.parse(`${env.dateTime}Z`))) return inZone(env.dateTime, env.timeZone);
  return new Date(env.dateTime);
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
  const keys = ['dateTime', 'utc', 'timeZone', 'sun', 'latitude', 'longitude', 'ground', 'weather', 'cloudCover', 'visibilityKm', 'windMs', 'look'];
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

/** The sun for an environment: the parent's `sunPosition` when given, else worked out at the message's place (or the package's origin). */
export function sunFor(env: Environment, origin?: ScenePackage['origin']): { elevation: number; azimuth: number } {
  if (env.sunPosition) return { elevation: env.sunPosition.elevationDegrees, azimuth: env.sunPosition.azimuthDegrees };
  const at = instantOf(env);
  if (!at) return DEFAULT_SUN;
  const lat = env.latitude ?? origin?.lat, lon = env.longitude ?? origin?.lng;
  if (lat === undefined || lon === undefined) return DEFAULT_SUN;
  return solarPosition(at, lat, lon);
}
