#!/usr/bin/env node
import m from '../machines/shutter.js';
import { validate, mainPath, isFinal } from '../src/engine.js';
import assert from 'node:assert/strict';
const TLA = { ready:{PRESS:'open'}, open:{EXPOSE:'expose',OVEREXPOSE:'wash'}, expose:{CLOSE:'done'}, done:{}, wash:{} };
assert.deepEqual(validate(m), []);
for (const [s,on] of Object.entries(TLA)) assert.deepEqual(m.states[s].on||{}, on, s);
assert.deepEqual(mainPath(m), ['ready','open','expose','done']);
assert.ok(isFinal(m,'done') && isFinal(m,'wash'));
console.log('formal/check-shutter.js OK');
