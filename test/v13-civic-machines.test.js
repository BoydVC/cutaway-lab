import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { machines } from '../machines/index.js';
import { validate, mainPath, isFinal } from '../src/engine.js';
import { makeQuiz } from '../src/quiz.js';
import elevator from '../machines/elevator.js';
import flush from '../machines/flush.js';
import stoplight from '../machines/stoplight.js';

describe('v13 elevator + flush + stoplight', () => {
  for (const m of [elevator, flush, stoplight]) {
    it(`${m.id} validates + path + quiz`, () => {
      assert.deepEqual(validate(m), []);
      assert.ok(mainPath(m).length >= 3);
      assert.ok(Object.keys(m.states).filter((s) => isFinal(m, s)).length >= 2);
      assert.ok(m.parts.filter((p) => p.job).length >= 3);
      assert.ok(makeQuiz(m).length >= 3);
      assert.doesNotMatch(JSON.stringify(m), /Charlotte|Victor|Miranda|Boyd|Spalding|\bChar\b|\bVic\b/i);
    });
  }
  it('fleet ≥23', () => assert.ok(machines.length >= 23));
  it('ids present', () => {
    const ids = new Set(machines.map((m) => m.id));
    for (const id of ['elevator', 'flush', 'stoplight']) assert.ok(ids.has(id), id);
  });
});
