#!/usr/bin/env node
import m from '../machines/photo.js';
import { validate, mainPath, isFinal } from '../src/engine.js';
import assert from 'node:assert/strict';
const TLA = { idle:{LIGHT:'light'}, light:{SIP:'sip'}, sip:{COOK:'cook',CLOSE:'wilt'}, cook:{}, wilt:{} };
assert.deepEqual(validate(m), []);
for (const [s,on] of Object.entries(TLA)) assert.deepEqual(m.states[s].on||{}, on, s);
assert.deepEqual(mainPath(m), ['idle','light','sip','cook']);
assert.ok(isFinal(m,'cook') && isFinal(m,'wilt'));
console.log('formal/check-photo.js OK');
