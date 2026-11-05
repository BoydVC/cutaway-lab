#!/usr/bin/env node
import m from '../machines/baseball.js';
import { validate, mainPath, isFinal } from '../src/engine.js';
import assert from 'node:assert/strict';
const TLA = {
  pitch: { HIT: 'grounder' },
  grounder: { FIELD: 'toSecond', BOBBLE: 'safe' },
  toSecond: { FORCE: 'toFirst' },
  toFirst: { OUT: 'twinKill' },
  twinKill: {},
  safe: {},
};
assert.deepEqual(validate(m), []);
for (const [s, on] of Object.entries(TLA)) {
  assert.ok(m.states[s], s);
  assert.deepEqual(m.states[s].on || {}, on, s);
}
assert.deepEqual(mainPath(m), ['pitch', 'grounder', 'toSecond', 'toFirst', 'twinKill']);
assert.ok(isFinal(m, 'twinKill') && isFinal(m, 'safe'));
console.log('formal/check-baseball.js OK');
