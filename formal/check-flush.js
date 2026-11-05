#!/usr/bin/env node
import m from '../machines/flush.js';
import { validate, mainPath, isFinal } from '../src/engine.js';
import assert from 'node:assert/strict';
const TLA = { ready:{PRESS:'lift'}, lift:{RUSH:'siphon',STUCK:'stuck'}, siphon:{EMPTY:'refill'}, refill:{}, stuck:{} };
assert.deepEqual(validate(m), []);
for (const [s,on] of Object.entries(TLA)) assert.deepEqual(m.states[s].on||{}, on, s);
assert.deepEqual(mainPath(m), ['ready','lift','siphon','refill']);
assert.ok(isFinal(m,'refill') && isFinal(m,'stuck'));
console.log('formal/check-flush.js OK');
