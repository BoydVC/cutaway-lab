#!/usr/bin/env node
import m from '../machines/flashlight.js';
import { validate, mainPath, isFinal } from '../src/engine.js';
import assert from 'node:assert/strict';
const TLA={off:{SLIDE:'closing'},closing:{FLOW:'on'},on:{SLIDE:'off2',DRAIN:'dead'},off2:{},dead:{}};
assert.deepEqual(validate(m),[]);
for (const [s,on] of Object.entries(TLA)) assert.deepEqual(m.states[s].on||{},on,s);
assert.deepEqual(mainPath(m),['off','closing','on','off2']);
assert.ok(isFinal(m,'off2')&&isFinal(m,'dead'));
console.log('formal/check-flashlight.js OK');
