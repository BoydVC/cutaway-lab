import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { machines } from '../machines/index.js';
import { validate, mainPath, isFinal, reachable } from '../src/engine.js';
import { makeQuiz } from '../src/quiz.js';
import basketball from '../machines/basketball.js';
import hockey from '../machines/hockey.js';
import bike from '../machines/bike.js';
import { readFileSync } from 'node:fs';

describe('v10 new machines', () => {
  for (const m of [basketball, hockey, bike]) {
    it(`${m.id} validates + main path + side final`, () => {
      assert.deepEqual(validate(m), []);
      const path = mainPath(m);
      assert.ok(path.length >= 3, path.join('→'));
      const finals = Object.keys(m.states).filter((s) => isFinal(m, s));
      assert.ok(finals.length >= 2, finals.join(','));
      assert.ok(reachable(m).size === Object.keys(m.states).length);
    });
    it(`${m.id} builds a quiz`, () => {
      const q = makeQuiz(m);
      assert.ok(q.length >= 3, q.length);
    });
    it(`${m.id} has no family names`, () => {
      const blob = JSON.stringify(m);
      assert.doesNotMatch(blob, /Charlotte|Victor|Miranda|Boyd|Spalding|\bChar\b|\bVic\b/i);
    });
  }
  it('fleet is at least 15 machines', () => {
    assert.ok(machines.length >= 15);
  });
  it('sports topic ≥ 6', () => {
    assert.ok(machines.filter((m) => m.topic === 'Sports').length >= 6);
  });
  it('foam stays near rim in fizz', () => {
    const src = readFileSync('src/custom.js', 'utf8');
    assert.match(src, /foam: \{ opacity: 1, scale: 1\.35, y: -6 \}/);
  });
});
