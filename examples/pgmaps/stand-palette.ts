import type { TerrainGrid } from './package.ts';
export type StandRecord = NonNullable<TerrainGrid['stand']>['records'][number];
/** Nearest categorical post; finest known grid wins, unknown fine posts fall through. */
export function standSampler(grids: ReadonlyArray<TerrainGrid | undefined>): (x: number, y: number) => StandRecord | null {
  const list = grids.filter((g): g is TerrainGrid => !!g?.stand).sort((a,b) => a.spacing-b.spacing);
  return (x,y) => {
    for (const g of list) {
      const gx=(x-g.west)/g.spacing, gy=(y-g.south)/g.spacing;
      if (gx<0 || gy<0 || gx>g.columns-1 || gy>g.rows-1) continue;
      const record=g.stand!.records[g.stand!.cells[Math.round(gy)*g.columns+Math.round(gx)]];
      if (record && Number.isFinite(record.heightMeters) && record.heightMeters>0) return record;
    }
    return null;
  };
}
