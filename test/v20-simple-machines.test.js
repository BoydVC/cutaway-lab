import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { machines } from '../machines/index.js';
import { validate, mainPath, isFinal } from '../src/engine.js';
import { makeQuiz } from '../src/quiz.js';
import pulley from '../machines/pulley.js';
import candle from '../machines/candle.js';
describe('v20 pulley + candle', () => {
  for (const m of [pulley, candle]) {
    it(`${m.id} validates + path + quiz`, () => {
      assert.deepEqual(validate(m), []);
      assert.ok(mainPath(m).length >= 3);
      assert.ok(Object.keys(m.states).filter((s) => isFinal(m, s)).length >= 2);
      assert.ok(makeQuiz(m).length >= 3);
      assert.doesNotMatch(JSON.stringify(m), /Charlotte|Victor|Miranda|Boyd|Spalding|\bChar\b|\bVic\b/i);
    });
  }
  it('fleet ≥36', () => assert.ok(machines.length >= 36));
});
