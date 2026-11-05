#!/usr/bin/env node
import m from '../machines/seesaw.js';
import { validate, mainPath, isFinal } from '../src/engine.js';
import assert from 'node:assert/strict';
const TLA={level:{TIP_LEFT:'leftDown',TIP_RIGHT:'rightDown'},leftDown:{TIP_RIGHT:'rightDown',STAND:'level2'},rightDown:{},level2:{}};
assert.deepEqual(validate(m),[]);
for (const [s,on] of Object.entries(TLA)) assert.deepEqual(m.states[s].on||{},on,s);
assert.deepEqual(mainPath(m),['level','leftDown','rightDown']);
assert.ok(isFinal(m,'rightDown')&&isFinal(m,'level2'));
console.log('formal/check-seesaw.js OK');
