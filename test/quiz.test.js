import test from 'node:test'; import assert from 'node:assert/strict';
import { makeQuiz, grade, rng, shuffle } from '../src/quiz.js';
import { machines } from '../machines/index.js';
test('rng deterministic', () => { const a = rng(7), b = rng(7); assert.equal(a(), b()); });
test('shuffle keeps items', () => assert.deepEqual(shuffle([1, 2, 3, 4], rng(3)).sort(), [1, 2, 3, 4]));
test('same seed same quiz', () => assert.deepEqual(makeQuiz(machines[0], 5), makeQuiz(machines[0], 5)));
for (const m of machines) {
  test(`${m.id}: quiz has 5 well-formed questions`, () => {
    const q = makeQuiz(m, 11, 5); assert.equal(q.length, 5);
    for (const x of q) { assert.ok(x.choices.length >= 2); assert.ok(x.answer >= 0 && x.answer < x.choices.length); assert.equal(new Set(x.choices).size, x.choices.length); }
  });
}
test('grade stars', () => {
  const q = [{ answer: 0 }, { answer: 1 }, { answer: 0 }, { answer: 0 }, { answer: 0 }];
  assert.equal(grade(q, [0, 1, 0, 0, 0]).stars, 3); assert.equal(grade(q, [0, 1, 0, 1, 1]).stars, 2);
  assert.equal(grade(q, [0, 0, 1, 1, 1]).stars, 1); assert.equal(grade(q, [1, 0, 1, 1, 1]).stars, 0);
});
