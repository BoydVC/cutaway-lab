#!/usr/bin/env node
import m from '../machines/spring.js';
import { validate, mainPath, isFinal } from '../src/engine.js';
import assert from 'node:assert/strict';
const TLA={rest:{PUSH:'compress'},compress:{RELEASE:'launch',HOLD:'held'},launch:{},held:{}};
assert.deepEqual(validate(m),[]);
for (const [s,on] of Object.entries(TLA)) assert.deepEqual(m.states[s].on||{},on,s);
assert.deepEqual(mainPath(m),['rest','compress','launch']);
assert.ok(isFinal(m,'launch')&&isFinal(m,'held'));
console.log('formal/check-spring.js OK');
