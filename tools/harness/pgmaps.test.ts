import assert from 'node:assert/strict';
import { test } from 'node:test';
import { isPgmapsReplayFixture } from './pgmaps.ts';

test('a replay intercepts the fixture fetch without replacing the engine page with JSON', () => {
  assert.equal(isPgmapsReplayFixture(new URL('http://localhost:5199/pgmaps-replay-fixture.json')), true);
  assert.equal(isPgmapsReplayFixture(new URL('http://localhost:5199/pgmaps-replay-fixture.json?v=1')), true);
  assert.equal(isPgmapsReplayFixture(new URL('http://localhost:5199/examples/pgmaps-scene.html?scene=/pgmaps-replay-fixture.json')), false);
  assert.equal(isPgmapsReplayFixture(new URL('http://localhost:5199/assets/pgmaps-scene.js')), false);
});
