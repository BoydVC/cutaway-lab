#!/usr/bin/env node
import m from '../machines/bike.js';
import { validate, mainPath, isFinal } from '../src/engine.js';
import assert from 'node:assert/strict';
const TLA = { ready:{PUSH:'push'}, push:{PULL:'pull',SLIP:'slip'}, pull:{ROLL:'roll'}, roll:{}, slip:{} };
assert.deepEqual(validate(m), []);
for (const [s,on] of Object.entries(TLA)) assert.deepEqual(m.states[s].on||{}, on, s);
assert.deepEqual(mainPath(m), ['ready','push','pull','roll']);
assert.ok(isFinal(m,'roll') && isFinal(m,'slip'));
console.log('formal/check-bike.js OK');
