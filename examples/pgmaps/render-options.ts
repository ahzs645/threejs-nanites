/** PGMaps-only controls. Unknown or malformed fields retain their previous value. */
export interface RenderOptions {
  resolutionScale: number; maxFps: number; maxInFlight: number;
  dissolveMode: 'pixels' | 'relative'; dissolvePixels: number; dissolveReferenceHeight: number;
  frustumCulling: boolean;
}
export const DEFAULT_RENDER_OPTIONS: Readonly<RenderOptions> = Object.freeze({
  resolutionScale: 1, maxFps: 0, maxInFlight: 2, dissolveMode: 'pixels',
  dissolvePixels: 4, dissolveReferenceHeight: 1080, frustumCulling: true,
});
export function readRenderOptions(value: unknown, previous: Readonly<RenderOptions> = DEFAULT_RENDER_OPTIONS): RenderOptions {
  const out = { ...previous };
  if (!value || typeof value !== 'object' || Array.isArray(value)) return out;
  const v = value as Record<string, unknown>;
  const number = (key: keyof RenderOptions, lo: number, hi: number, integer = false) => {
    const n = v[key];
    if (typeof n === 'number' && Number.isFinite(n)) Object.assign(out, { [key]: integer ? Math.round(Math.min(hi, Math.max(lo, n))) : Math.min(hi, Math.max(lo, n)) });
  };
  number('resolutionScale', .5, 1); number('maxInFlight', 1, 3, true);
  number('dissolvePixels', .5, 16); number('dissolveReferenceHeight', 240, 4320, true);
  if (v.maxFps === 0) out.maxFps = 0; else number('maxFps', 15, 120, true);
  if (v.dissolveMode === 'pixels' || v.dissolveMode === 'relative') out.dissolveMode = v.dissolveMode;
  if (typeof v.frustumCulling === 'boolean') out.frustumCulling = v.frustumCulling;
  return out;
}
export function renderOptionsFromUrl(params: URLSearchParams): RenderOptions {
  const v: Record<string, unknown> = {};
  for (const [url, key] of [['renderScale','resolutionScale'],['maxfps','maxFps'],['gpuqueue','maxInFlight'],['cutoffpx','dissolvePixels'],['referenceheight','dissolveReferenceHeight']] as const)
    if (params.has(url)) v[key] = params.get(url)?.trim() ? Number(params.get(url)) : NaN;
  if (params.has('dissolve')) v.dissolveMode = params.get('dissolve');
  if (params.get('culling') === '0' || params.get('culling') === '1') v.frustumCulling = params.get('culling') === '1';
  return readRenderOptions(v);
}
export function dissolvePixels(options: Readonly<RenderOptions>, height: number, requested = options.dissolvePixels): number {
  return requested * (options.dissolveMode === 'relative' ? height / options.dissolveReferenceHeight : 1);
}
/** Keep the complete transition inside both the patch circle and its rectangular source grid. */
export function coverageCutoff(requested: number, reach: number, offset: number, edge: number, guard = 90): number {
  return Math.max(0, Math.min(requested, Math.max(0, Math.min(reach - offset, edge) - guard) / 1.2));
}
