#!/usr/bin/env node
import m from '../machines/zipper.js';
import { validate, mainPath, isFinal } from '../src/engine.js';
import assert from 'node:assert/strict';
const TLA = { open:{PULL_UP:'meshing'}, meshing:{KEEP:'half',SNAG:'snag'}, half:{PULL_UP:'closed'}, closed:{}, snag:{} };
assert.deepEqual(validate(m), []);
for (const [s,on] of Object.entries(TLA)) assert.deepEqual(m.states[s].on||{}, on, s);
assert.deepEqual(mainPath(m), ['open','meshing','half','closed']);
assert.ok(isFinal(m,'closed') && isFinal(m,'snag'));
console.log('formal/check-zipper.js OK');
