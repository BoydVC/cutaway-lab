#!/usr/bin/env node
import m from '../machines/lacrosse.js';
import { validate, mainPath, isFinal } from '../src/engine.js';
import assert from 'node:assert/strict';
const TLA = {
  save: { CLEAR: 'clear' },
  clear: { PUSH: 'push', STALL: 'reset' },
  push: { DISH: 'dish' },
  dish: {},
  reset: {},
};
assert.deepEqual(validate(m), []);
for (const [s, on] of Object.entries(TLA)) {
  assert.deepEqual(m.states[s].on || {}, on, s);
}
assert.deepEqual(mainPath(m), ['save', 'clear', 'push', 'dish']);
assert.ok(isFinal(m, 'dish') && isFinal(m, 'reset'));
console.log('formal/check-lacrosse.js OK');
