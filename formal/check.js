#!/usr/bin/env node
// Mirror-check: FootballPlay.tla transitions === machines/football.js
import football from '../machines/football.js';
import { validate, mainPath, step, isFinal, reachable } from '../src/engine.js';
import assert from 'node:assert/strict';

const TLA = {
  huddle: { SNAP: 'snap' },
  snap: { FAKE: 'fake', AUDIBLE: 'checkdown' },
  fake: { THROW: 'throw' },
  throw: { CATCH: 'catch' },
  catch: {},
  checkdown: {},
};

assert.deepEqual(validate(football), []);
for (const [s, on] of Object.entries(TLA)) {
  assert.ok(football.states[s], `missing state ${s}`);
  assert.deepEqual(football.states[s].on || {}, on, s);
}
assert.deepEqual(mainPath(football), ['huddle', 'snap', 'fake', 'throw', 'catch']);
assert.ok(isFinal(football, 'catch'));
assert.ok(isFinal(football, 'checkdown'));
assert.ok(reachable(football).has('checkdown'));
let s = 'huddle';
for (const ev of ['SNAP', 'FAKE', 'THROW', 'CATCH']) s = step(football, s, ev);
assert.equal(s, 'catch');
console.log('formal/check.js OK — TLA mirror matches football.js');
