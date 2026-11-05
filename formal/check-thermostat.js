#!/usr/bin/env node
import m from '../machines/thermostat.js';
import { validate, mainPath, isFinal } from '../src/engine.js';
import assert from 'node:assert/strict';
const TLA = { idle:{COOL:'call'}, call:{FIRE:'heating',FAULT:'fault'}, heating:{REACH:'satisfied'}, satisfied:{}, fault:{} };
assert.deepEqual(validate(m), []);
for (const [s,on] of Object.entries(TLA)) assert.deepEqual(m.states[s].on||{}, on, s);
assert.deepEqual(mainPath(m), ['idle','call','heating','satisfied']);
assert.ok(isFinal(m,'satisfied') && isFinal(m,'fault'));
console.log('formal/check-thermostat.js OK');
