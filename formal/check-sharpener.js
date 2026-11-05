#!/usr/bin/env node
import m from '../machines/sharpener.js';
import { validate, mainPath, isFinal } from '../src/engine.js';
import assert from 'node:assert/strict';
const TLA = { empty:{INSERT:'loaded'}, loaded:{CRANK:'shaving',FORCE:'broken'}, shaving:{FINISH:'sharp'}, sharp:{}, broken:{} };
assert.deepEqual(validate(m), []);
for (const [s,on] of Object.entries(TLA)) assert.deepEqual(m.states[s].on||{}, on, s);
assert.deepEqual(mainPath(m), ['empty','loaded','shaving','sharp']);
assert.ok(isFinal(m,'sharp') && isFinal(m,'broken'));
console.log('formal/check-sharpener.js OK');
