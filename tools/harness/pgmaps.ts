// Replay the same frozen PGMaps file in either engine, then resize and reload it. Uses the real loader and camera.
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Page } from 'playwright-core';
import { at } from './status.ts';

/** Match the fixture's pathname, not a page whose `scene` query ends in the fixture filename. */
export function isPgmapsReplayFixture(url: URL): boolean {
  return url.pathname === '/pgmaps-replay-fixture.json';
}

export async function runPgmapsReplay(page: Page, url: string, file: string, query: string, outDir: string): Promise<void> {
  const pkg = JSON.parse(readFileSync(file, 'utf8'));
  assert.equal(pkg.camera.projection?.kind, 'perspective', 'Replay fixture needs saved perspective metadata');
  assert.ok(pkg.environment?.utc, 'Replay fixture needs a resolved environment');
  const target = new URL(url);
  for (const [key, value] of new URLSearchParams(query)) target.searchParams.set(key, value);
  target.searchParams.set('scene', '/pgmaps-replay-fixture.json');
  await page.route(isPgmapsReplayFixture, (route) => route.fulfill({ json: pkg }));
  const tag = `pgmaps-${target.port || 'replay'}`;
  const ready = async (): Promise<void> => {
    await page.waitForFunction(() => {
      const state = (window as unknown as { pgmaps?: { ready?: boolean; error?: string } }).pgmaps;
      return state?.error || state?.ready;
    }, undefined, { timeout: 60000 });
  };
  const read = async () => page.evaluate(() => {
    const state = (window as unknown as { pgmaps: {
      error?: string;
      camera: { position: { x: number; y: number; z: number }; fov: number; aspect: number; projectionMatrix: { elements: number[] } };
      environment: Record<string, unknown> & { state?: Record<string, unknown> };
    } }).pgmaps;
    if (state.error) throw new Error(state.error);
    const camera = state.camera;
    const rect = document.querySelector('canvas')!.getBoundingClientRect();
    return {
      position: [camera.position.x, camera.position.y, camera.position.z],
      fov: camera.fov, aspect: camera.aspect, projection: [...camera.projectionMatrix.elements],
      environment: state.environment?.state ?? state.environment,
      canvas: { width: rect.width, height: rect.height, left: rect.left, top: rect.top },
      window: { width: innerWidth, height: innerHeight },
    };
  });
  const records: Array<Awaited<ReturnType<typeof read>>> = [];
  const check = async (step: string): Promise<void> => {
    at(`PGMaps replay ${step}`);
    // Let a resize reach the drawing loop as well as the projection matrix.
    await page.evaluate(() => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
    const r = await read();
    const [x, y, z] = pkg.camera.position;
    const close = (actual: number, expected: number, label: string, tolerance = 1e-7): void => {
      assert.ok(Math.abs(actual - expected) <= tolerance, `${step}: ${label}: ${actual} != ${expected}`);
    };
    [x, z, -y].forEach((v, i) => close(r.position[i], v, `eye ${i}`));
    close(r.fov, pkg.camera.verticalFovDegrees, 'vertical lens');
    close(r.aspect, pkg.camera.projection.aspectRatio, 'aspect');
    close(r.canvas.width / r.canvas.height, r.aspect, 'canvas aspect', 0.0001);
    assert.ok(r.canvas.left >= -0.1 && r.canvas.top >= -0.1, `${step}: canvas inside window`);
    assert.ok(r.canvas.width <= r.window.width + 0.1 && r.canvas.height <= r.window.height + 0.1, `${step}: canvas fits`);
    assert.equal(r.environment.utc, pkg.environment.utc, `${step}: frozen UTC instant`);
    assert.equal(r.environment.sun, pkg.environment.sun, `${step}: sun mode`);
    if (records.length) r.projection.forEach((v, i) => close(v, records[0].projection[i], `projection ${i}`));
    records.push(r);
    writeFileSync(join(outDir, `${tag}-${step}.png`), await page.screenshot());
  };
  await page.goto(target.href);
  await ready();
  await check('initial');
  await page.setViewportSize({ width: 600, height: 1000 });
  await check('portrait');
  await page.setViewportSize({ width: 1800, height: 600 });
  await check('wide');
  await page.reload();
  await ready();
  await check('reopened');
  writeFileSync(join(outDir, `${tag}-replay.json`), JSON.stringify(records, null, 2));
  console.log(`PGMaps replay passed: exact eye, lens, projection and UTC across ${records.length} captures (${tag}).`);
}
