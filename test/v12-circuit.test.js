import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { machines } from '../machines/index.js';
import { validate, mainPath, isFinal, step } from '../src/engine.js';
import { makeQuiz } from '../src/quiz.js';
import circuit from '../machines/circuit.js';

describe('v12 circuit', () => {
  it('in fleet', () => assert.ok(machines.some((m) => m.id === 'circuit')));
  it('validates + path ≥4 + ≥2 finals', () => {
    assert.deepEqual(validate(circuit), []);
    assert.deepEqual(mainPath(circuit), ['open', 'closed', 'flow', 'lit']);
    assert.ok(Object.keys(circuit.states).filter((s) => isFinal(circuit, s)).length >= 2);
  });
  it('short branch reachable', () => {
    assert.equal(step(circuit, 'closed', 'SHORT'), 'short');
    assert.ok(isFinal(circuit, 'short'));
  });
  it('≥3 parts with jobs → quiz ≥3', () => {
    assert.ok(circuit.parts.filter((p) => p.job).length >= 3);
    assert.ok(makeQuiz(circuit).length >= 3);
  });
  it('no family names', () => {
    assert.doesNotMatch(JSON.stringify(circuit), /Charlotte|Victor|Miranda|Boyd|Spalding|\bChar\b|\bVic\b/i);
  });
  it('fleet ≥20', () => assert.ok(machines.length >= 20));
});
