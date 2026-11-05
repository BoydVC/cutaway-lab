#!/usr/bin/env node
import m from '../machines/compass.js';
import { validate, mainPath, isFinal } from '../src/engine.js';
import assert from 'node:assert/strict';
const TLA={rest:{SETTLE:'north'},north:{TURN:'bearing',INTERFERE:'skew'},bearing:{},skew:{}};
assert.deepEqual(validate(m),[]);
for (const [s,on] of Object.entries(TLA)) assert.deepEqual(m.states[s].on||{},on,s);
assert.deepEqual(mainPath(m),['rest','north','bearing']);
assert.ok(isFinal(m,'bearing')&&isFinal(m,'skew'));
console.log('formal/check-compass.js OK');
