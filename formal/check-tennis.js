#!/usr/bin/env node
import m from '../machines/tennis.js';
import { validate, mainPath, isFinal } from '../src/engine.js';
import assert from 'node:assert/strict';
const TLA = { ready:{TOSS:'toss'}, toss:{TROPHY:'trophy',FAULT_TOSS:'fault'}, trophy:{DROP:'drop'}, drop:{BRUSH:'brush'}, brush:{}, fault:{} };
assert.deepEqual(validate(m), []);
for (const [s,on] of Object.entries(TLA)) assert.deepEqual(m.states[s].on||{}, on, s);
assert.deepEqual(mainPath(m), ['ready','toss','trophy','drop','brush']);
assert.ok(isFinal(m,'brush') && isFinal(m,'fault'));
console.log('formal/check-tennis.js OK');
