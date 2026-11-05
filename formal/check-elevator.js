#!/usr/bin/env node
import m from '../machines/elevator.js';
import { validate, mainPath, isFinal } from '../src/engine.js';
import assert from 'node:assert/strict';
const TLA = { idle:{CALL:'closing'}, closing:{CLOSED:'moving',OBSTRUCT:'reopen'}, moving:{ARRIVE:'open'}, open:{}, reopen:{} };
assert.deepEqual(validate(m), []);
for (const [s,on] of Object.entries(TLA)) assert.deepEqual(m.states[s].on||{}, on, s);
assert.deepEqual(mainPath(m), ['idle','closing','moving','open']);
assert.ok(isFinal(m,'open') && isFinal(m,'reopen'));
console.log('formal/check-elevator.js OK');
