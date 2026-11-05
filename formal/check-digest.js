#!/usr/bin/env node
import m from '../machines/digest.js';
import { validate, mainPath, isFinal } from '../src/engine.js';
import assert from 'node:assert/strict';
const TLA = { bite:{SWALLOW:'swallow'}, swallow:{CHURN:'churn',CHOKE:'choke'}, churn:{ABSORB:'absorb'}, absorb:{}, choke:{} };
assert.deepEqual(validate(m), []);
for (const [s,on] of Object.entries(TLA)) assert.deepEqual(m.states[s].on||{}, on, s);
assert.deepEqual(mainPath(m), ['bite','swallow','churn','absorb']);
assert.ok(isFinal(m,'absorb') && isFinal(m,'choke'));
console.log('formal/check-digest.js OK');
