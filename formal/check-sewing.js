#!/usr/bin/env node
import m from '../machines/sewing.js';
import { validate, mainPath, isFinal } from '../src/engine.js';
import assert from 'node:assert/strict';
const TLA={threaded:{START:'down'},down:{LOOP:'loop',JAM:'jam'},loop:{UP:'stitch'},stitch:{},jam:{}};
assert.deepEqual(validate(m),[]);
for (const [s,on] of Object.entries(TLA)) assert.deepEqual(m.states[s].on||{},on,s);
assert.deepEqual(mainPath(m),['threaded','down','loop','stitch']);
assert.ok(isFinal(m,'stitch')&&isFinal(m,'jam'));
console.log('formal/check-sewing.js OK');
