#!/usr/bin/env node
import m from '../machines/extinguisher.js';
import { validate, mainPath, isFinal } from '../src/engine.js';
import assert from 'node:assert/strict';
const TLA={ready:{PULL:'armed'},armed:{AIM:'aimed',EMPTY:'empty'},aimed:{SQUEEZE:'spraying'},spraying:{},empty:{}};
assert.deepEqual(validate(m),[]);
for (const [s,on] of Object.entries(TLA)) assert.deepEqual(m.states[s].on||{},on,s);
assert.deepEqual(mainPath(m),['ready','armed','aimed','spraying']);
assert.ok(isFinal(m,'spraying')&&isFinal(m,'empty'));
console.log('formal/check-extinguisher.js OK');
