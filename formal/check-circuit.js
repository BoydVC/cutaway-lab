#!/usr/bin/env node
import m from '../machines/circuit.js';
import { validate, mainPath, isFinal } from '../src/engine.js';
import assert from 'node:assert/strict';
const TLA = { open:{CLOSE:'closed'}, closed:{FLOW:'flow',SHORT:'short'}, flow:{GLOW:'lit'}, lit:{}, short:{} };
assert.deepEqual(validate(m), []);
for (const [s,on] of Object.entries(TLA)) assert.deepEqual(m.states[s].on||{}, on, s);
assert.deepEqual(mainPath(m), ['open','closed','flow','lit']);
assert.ok(isFinal(m,'lit') && isFinal(m,'short'));
console.log('formal/check-circuit.js OK');
