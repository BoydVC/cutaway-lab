#!/usr/bin/env node
import m from '../machines/lock.js';
import { validate, mainPath, isFinal } from '../src/engine.js';
import assert from 'node:assert/strict';
const TLA = { locked:{INSERT:'keyed'}, keyed:{TURN:'turning',WRONG:'jammed'}, turning:{OPEN:'open'}, open:{}, jammed:{} };
assert.deepEqual(validate(m), []);
for (const [s,on] of Object.entries(TLA)) assert.deepEqual(m.states[s].on||{}, on, s);
assert.deepEqual(mainPath(m), ['locked','keyed','turning','open']);
assert.ok(isFinal(m,'open') && isFinal(m,'jammed'));
console.log('formal/check-lock.js OK');
