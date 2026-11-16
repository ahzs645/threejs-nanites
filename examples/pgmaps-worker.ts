// The PGMaps scene as a worker PGMaps starts itself (its road view's renderer, `src/pages/dev-forestry/engineWorker.ts`
// in PGMaps), not a page in a frame. PGMaps hands it an OffscreenCanvas laid over its map
// ({ type: 'pgmaps-worker-init', canvas, viewport }, examples/pgmaps/host.ts) and then speaks the same protocol as to
// the page (examples/pgmaps-scene.ts), over the worker's port. Built alone by `npm run build:pgmaps-worker` into
// dist-pgmaps-worker/pgmaps-engine.js, the bark and leaf images beside it in textures/.
// The host first, so its listener takes the canvas before the scene's sees any message.
import './pgmaps/host.ts';
import './pgmaps-scene.ts';
