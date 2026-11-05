#!/usr/bin/env node
import m from '../machines/parachute.js';
import { validate, mainPath, isFinal } from '../src/engine.js';
import assert from 'node:assert/strict';
const TLA = { freefall:{PULL:'deploy'}, deploy:{INFLATE:'inflated',TANGLE:'tangle'}, inflated:{LAND:'landed'}, landed:{}, tangle:{} };
assert.deepEqual(validate(m), []);
for (const [s,on] of Object.entries(TLA)) assert.deepEqual(m.states[s].on||{}, on, s);
assert.deepEqual(mainPath(m), ['freefall','deploy','inflated','landed']);
assert.ok(isFinal(m,'landed') && isFinal(m,'tangle'));
console.log('formal/check-parachute.js OK');
