#!/usr/bin/env node
import m from '../machines/turbine.js';
import { validate, mainPath, isFinal } from '../src/engine.js';
import assert from 'node:assert/strict';
const TLA = { calm:{BREEZE:'cutin'}, cutin:{SPIN:'spinning'}, spinning:{POWER:'generating',STORM:'braking'}, generating:{}, braking:{} };
assert.deepEqual(validate(m), []);
for (const [s,on] of Object.entries(TLA)) assert.deepEqual(m.states[s].on||{}, on, s);
assert.deepEqual(mainPath(m), ['calm','cutin','spinning','generating']);
assert.ok(isFinal(m,'generating') && isFinal(m,'braking'));
console.log('formal/check-turbine.js OK');
