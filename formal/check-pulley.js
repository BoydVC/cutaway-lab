#!/usr/bin/env node
import m from '../machines/pulley.js';
import { validate, mainPath, isFinal } from '../src/engine.js';
import assert from 'node:assert/strict';
const TLA={ready:{PULL:'lifting'},lifting:{PULL:'high',SLIP:'slip'},high:{},slip:{}};
assert.deepEqual(validate(m),[]);
for (const [s,on] of Object.entries(TLA)) assert.deepEqual(m.states[s].on||{},on,s);
assert.deepEqual(mainPath(m),['ready','lifting','high']);
assert.ok(isFinal(m,'high')&&isFinal(m,'slip'));
console.log('formal/check-pulley.js OK');
