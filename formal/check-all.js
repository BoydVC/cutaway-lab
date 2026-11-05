#!/usr/bin/env node
import { machines } from '../machines/index.js';
import { validate, mainPath, isFinal, reachable } from '../src/engine.js';
import assert from 'node:assert/strict';

const sports = machines.filter((m) => m.topic === 'Sports');
assert.ok(sports.length >= 4, "need ≥4 sports");
for (const m of sports) {
  assert.deepEqual(validate(m), [], m.id);
  const path = mainPath(m);
  assert.ok(path.length >= 4, m.id);
  const finals = Object.keys(m.states).filter((s) => isFinal(m, s));
  assert.ok(finals.length >= 2, m.id + ' needs main+side final');
  assert.ok([...reachable(m)].every((s) => reachable(m, s).size >= 1));
  // every non-final has ≥1 event; finals have 0
  for (const [n, st] of Object.entries(m.states)) {
    if (isFinal(m, n)) assert.equal(Object.keys(st.on || {}).length, 0, n);
    else assert.ok(Object.keys(st.on || {}).length >= 1, n);
  }
  console.log('ok', m.id, 'path', path.join('→'), 'finals', finals.join(','));
}
console.log('formal/check-all.js OK');
