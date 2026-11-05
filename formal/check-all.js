#!/usr/bin/env node
import { machines } from '../machines/index.js';
import { validate, mainPath, isFinal, reachable } from '../src/engine.js';
import assert from 'node:assert/strict';

assert.equal(machines.length, 36, 'fleet locked at 36');
for (const m of machines) {
  assert.deepEqual(validate(m), [], m.id);
  const path = mainPath(m);
  assert.ok(path.length >= 3, `${m.id} short path ${path}`);
  const finals = Object.keys(m.states).filter((s) => isFinal(m, s));
  assert.ok(finals.length >= 1, m.id + ' needs a final');
  const reach = reachable(m);
  assert.equal(reach.size, Object.keys(m.states).length, `${m.id} unreachable ${[...Object.keys(m.states)].filter(s=>!reach.has(s))}`);
  for (const [n, st] of Object.entries(m.states)) {
    if (isFinal(m, n)) assert.equal(Object.keys(st.on || {}).length, 0, n);
    else assert.ok(Object.keys(st.on || {}).length >= 1, n);
  }
  console.log('ok', m.id, 'path', path.join('→'), 'finals', finals.join(','));
}
console.log('formal/check-all.js OK', machines.length);
