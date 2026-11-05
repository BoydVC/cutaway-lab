#!/usr/bin/env node
import m from '../machines/soccer.js';
import { validate, mainPath, isFinal } from '../src/engine.js';
import assert from 'node:assert/strict';
const TLA = {
  build: { OVERLAP: 'overlap' },
  overlap: { PASS: 'pass', HOLD: 'cutInside' },
  pass: { CROSS: 'cross' },
  cross: {},
  cutInside: {},
};
assert.deepEqual(validate(m), []);
for (const [s, on] of Object.entries(TLA)) {
  assert.deepEqual(m.states[s].on || {}, on, s);
}
assert.deepEqual(mainPath(m), ['build', 'overlap', 'pass', 'cross']);
assert.ok(isFinal(m, 'cross') && isFinal(m, 'cutInside'));
console.log('formal/check-soccer.js OK');
