#!/usr/bin/env node
import m from '../machines/hockey.js';
import { validate, mainPath, isFinal } from '../src/engine.js';
import assert from 'node:assert/strict';
const TLA = {
  retrieve: { OUTLET: 'outlet', CHIP: 'chip' },
  outlet: { EXIT: 'zoneExit' },
  zoneExit: { STRETCH: 'stretch' },
  stretch: {},
  chip: {},
};
assert.deepEqual(validate(m), []);
for (const [s, on] of Object.entries(TLA)) assert.deepEqual(m.states[s].on || {}, on, s);
assert.deepEqual(mainPath(m), ['retrieve', 'outlet', 'zoneExit', 'stretch']);
assert.ok(isFinal(m, 'stretch') && isFinal(m, 'chip'));
console.log('formal/check-hockey.js OK');
