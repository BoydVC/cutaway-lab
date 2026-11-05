import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { machines } from '../machines/index.js';
import { validate, mainPath, isFinal } from '../src/engine.js';
import { makeQuiz } from '../src/quiz.js';
import parachute from '../machines/parachute.js';
import turbine from '../machines/turbine.js';

describe('v17 parachute + turbine', () => {
  for (const m of [parachute, turbine]) {
    it(`${m.id} validates + path + quiz`, () => {
      assert.deepEqual(validate(m), []);
      assert.ok(mainPath(m).length >= 4);
      assert.ok(Object.keys(m.states).filter((s) => isFinal(m, s)).length >= 2);
      assert.ok(makeQuiz(m).length >= 3);
      assert.doesNotMatch(JSON.stringify(m), /Charlotte|Victor|Miranda|Boyd|Spalding|\bChar\b|\bVic\b/i);
    });
  }
  it('fleet ≥30', () => assert.ok(machines.length >= 30));
});
