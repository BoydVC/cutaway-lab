#!/usr/bin/env node
import m from '../machines/gears.js';
import { validate, mainPath, isFinal } from '../src/engine.js';
import assert from 'node:assert/strict';
const TLA = { rest:{TURN:'turn'}, turn:{MESH:'mesh',SLIP:'slip'}, mesh:{RATIO:'ratio'}, ratio:{}, slip:{} };
assert.deepEqual(validate(m), []);
for (const [s,on] of Object.entries(TLA)) assert.deepEqual(m.states[s].on||{}, on, s);
assert.deepEqual(mainPath(m), ['rest','turn','mesh','ratio']);
assert.ok(isFinal(m,'ratio') && isFinal(m,'slip'));
console.log('formal/check-gears.js OK');
