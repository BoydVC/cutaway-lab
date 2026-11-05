#!/usr/bin/env node
import m from '../machines/stoplight.js';
import { validate, mainPath, isFinal } from '../src/engine.js';
import assert from 'node:assert/strict';
const TLA = { green:{TIMER:'yellow',EMPTY:'skip'}, yellow:{TIMER:'red'}, red:{}, skip:{} };
assert.deepEqual(validate(m), []);
for (const [s,on] of Object.entries(TLA)) assert.deepEqual(m.states[s].on||{}, on, s);
assert.deepEqual(mainPath(m), ['green','yellow','red']);
assert.ok(isFinal(m,'red') && isFinal(m,'skip'));
console.log('formal/check-stoplight.js OK');
