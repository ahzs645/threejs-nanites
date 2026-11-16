// A water body's shore distance (water.ts), free of three.js and the DOM (`node --test examples/pgmaps/shore-distance.test.ts`):
// texels of metres to the nearest edge of its rings, capped.
//
// Every texel against every edge was 0.7-0.8 s of a scene's build (a lake of a few thousand vertices over 512 x 512
// texels). Here the edges are put in a grid of `cap`-sized cells first, each in the cells its box, widened by `cap`,
// touches (and one more each way, so a texel on a cell's edge never misses one by rounding); a texel then tests only
// its own cell's edges, with the test and the arithmetic of before, so the texels are the same bytes.

export type ShoreRing = ReadonlyArray<ReadonlyArray<number>>;

export interface ShoreDistances {
  /** RGBA, `size` x `size`, row 0 the south row: r the distance to the nearest edge over `cap` (255 at `cap` or more), a 255. */
  px: Uint8Array;
  size: number;
  west: number;
  south: number;
  east: number;
  north: number;
}

/** The shore distances of bodies (`shapes`: each a list of rings) over their bounding box, 5 m wider each way. */
export function shoreDistances(shapes: ReadonlyArray<ReadonlyArray<ShoreRing>>, cap = 30): ShoreDistances {
  let west = Infinity, east = -Infinity, south = Infinity, north = -Infinity;
  for (const rings of shapes)
    for (const r of rings)
      for (const q of r) {
        // (Math.min and Math.max, as the spread over every point was: a NaN stays a NaN)
        (west = Math.min(west, q[0])), (east = Math.max(east, q[0])), (south = Math.min(south, q[1])), (north = Math.max(north, q[1]));
      }
  (west -= 5), (east += 5), (south -= 5), (north += 5);
  const N = Math.max(16, Math.min(512, Math.ceil(Math.max(east - west, north - south) / 2)));
  // the edges: a point's numbers then the next point's, the first four read (as the spread was)
  const segs: number[] = [];
  for (const rings of shapes)
    for (const r of rings)
      for (let i = 0; i < r.length; i++) {
        const s = [...r[i], ...r[(i + 1) % r.length]];
        segs.push(s[0], s[1], s[2], s[3]);
      }
  const count = segs.length / 4;
  // the cells: `cap` a side over the texels' box; an edge with a number that is not finite goes to every cell
  const nx = Math.max(1, Math.floor((east - west) / cap) + 1), ny = Math.max(1, Math.floor((north - south) / cap) + 1);
  const cellOf = (v: number, origin: number, n: number): number => Math.min(n - 1, Math.max(0, Math.floor((v - origin) / cap)));
  const span = (k: number): [number, number, number, number] | null => {
    const ax = segs[k * 4], ay = segs[k * 4 + 1], bx = segs[k * 4 + 2], by = segs[k * 4 + 3];
    if (!(Number.isFinite(ax) && Number.isFinite(ay) && Number.isFinite(bx) && Number.isFinite(by))) return [0, nx - 1, 0, ny - 1];
    const x0 = Math.min(ax, bx) - cap, x1 = Math.max(ax, bx) + cap, y0 = Math.min(ay, by) - cap, y1 = Math.max(ay, by) + cap;
    if (x1 < west - cap || x0 > east + cap || y1 < south - cap || y0 > north + cap) return null; // (no texel within `cap` of it)
    return [Math.max(0, cellOf(x0, west, nx) - 1), Math.min(nx - 1, cellOf(x1, west, nx) + 1), Math.max(0, cellOf(y0, south, ny) - 1), Math.min(ny - 1, cellOf(y1, south, ny) + 1)];
  };
  const start = new Uint32Array(nx * ny + 1);
  const spans: Array<[number, number, number, number] | null> = [];
  for (let k = 0; k < count; k++) {
    const s = span(k);
    spans.push(s);
    if (s) for (let cy = s[2]; cy <= s[3]; cy++) for (let cx = s[0]; cx <= s[1]; cx++) start[cy * nx + cx + 1]++;
  }
  for (let c = 0; c < nx * ny; c++) start[c + 1] += start[c];
  const list = new Uint32Array(start[nx * ny]), fill = start.slice(0, nx * ny);
  // (in the edges' own order within a cell)
  for (let k = 0; k < count; k++) {
    const s = spans[k];
    if (s) for (let cy = s[2]; cy <= s[3]; cy++) for (let cx = s[0]; cx <= s[1]; cx++) list[fill[cy * nx + cx]++] = k;
  }
  const px = new Uint8Array(N * N * 4);
  for (let j = 0; j < N; j++) {
    const y = south + ((j + 0.5) / N) * (north - south);
    const cy = cellOf(y, south, ny);
    for (let i = 0; i < N; i++) {
      const x = west + ((i + 0.5) / N) * (east - west);
      const cell = cy * nx + cellOf(x, west, nx);
      let d2 = cap * cap;
      for (let e = start[cell]; e < start[cell + 1]; e++) {
        const k = list[e] * 4, ax = segs[k], ay = segs[k + 1], bx = segs[k + 2], by = segs[k + 3];
        if (Math.min(ax, bx) - x > cap || x - Math.max(ax, bx) > cap || Math.min(ay, by) - y > cap || y - Math.max(ay, by) > cap) continue;
        const dx = bx - ax, dy = by - ay, l = dx * dx + dy * dy;
        const t = l > 0 ? Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / l)) : 0;
        d2 = Math.min(d2, (ax + t * dx - x) ** 2 + (ay + t * dy - y) ** 2);
      }
      px[(j * N + i) * 4] = Math.round((Math.sqrt(d2) / cap) * 255);
      px[(j * N + i) * 4 + 3] = 255;
    }
  }
  return { px, size: N, west, south, east, north };
}
