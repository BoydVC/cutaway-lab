#!/usr/bin/env node
import m from '../machines/basketball.js';
import { validate, mainPath, isFinal } from '../src/engine.js';
import assert from 'node:assert/strict';
const TLA = { iso:{SCREEN:'screen'}, screen:{TURN:'turn',SWITCH:'switch'}, turn:{DISH:'dish'}, dish:{}, switch:{} };
assert.deepEqual(validate(m), []);
for (const [s,on] of Object.entries(TLA)) assert.deepEqual(m.states[s].on||{}, on, s);
assert.deepEqual(mainPath(m), ['iso','screen','turn','dish']);
assert.ok(isFinal(m,'dish') && isFinal(m,'switch'));
console.log('formal/check-basketball.js OK');
