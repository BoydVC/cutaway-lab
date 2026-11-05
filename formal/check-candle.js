#!/usr/bin/env node
import m from '../machines/candle.js';
import { validate, mainPath, isFinal } from '../src/engine.js';
import assert from 'node:assert/strict';
const TLA={unlit:{LIGHT:'lighting'},lighting:{BURN:'burning'},burning:{SNUFF:'out',DROWN:'drown'},out:{},drown:{}};
assert.deepEqual(validate(m),[]);
for (const [s,on] of Object.entries(TLA)) assert.deepEqual(m.states[s].on||{},on,s);
assert.deepEqual(mainPath(m),['unlit','lighting','burning','out']);
assert.ok(isFinal(m,'out')&&isFinal(m,'drown'));
console.log('formal/check-candle.js OK');
