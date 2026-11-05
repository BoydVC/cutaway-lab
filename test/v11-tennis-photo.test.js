import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { machines } from '../machines/index.js';
import { validate, mainPath, isFinal } from '../src/engine.js';
import { makeQuiz } from '../src/quiz.js';
import tennis from '../machines/tennis.js';
import photo from '../machines/photo.js';

describe('v11 tennis + photosynthesis', () => {
  for (const m of [tennis, photo]) {
    it(`${m.id} validates`, () => assert.deepEqual(validate(m), []));
    it(`${m.id} main path ≥4 + side final`, () => {
      assert.ok(mainPath(m).length >= 4);
      assert.ok(Object.keys(m.states).filter((s) => isFinal(m, s)).length >= 2);
    });
    it(`${m.id} quiz`, () => assert.ok(makeQuiz(m).length >= 3));
    it(`${m.id} no family names`, () => {
      assert.doesNotMatch(JSON.stringify(m), /Charlotte|Victor|Miranda|Boyd|Spalding|\bChar\b|\bVic\b/i);
    });
  }
  it('fleet ≥17', () => assert.ok(machines.length >= 17));
  it('sports ≥7', () => assert.ok(machines.filter((m) => m.topic === 'Sports').length >= 7));
});

import { worksheet } from '../src/worksheet.js';

describe('v11 worksheet alphabet (F10)', () => {
  it('every machine worksheet letters stay in A–Z', () => {
    for (const m of machines) {
      const w = worksheet(m, 2);
      assert.doesNotMatch(w.html, /undefined/);
      const jobs = m.parts.filter((p) => p.job);
      assert.ok(jobs.length <= 26 || w.html.includes('Match each part'));
      // answer match letters are single A-Z
      for (const L of w.answer.match) assert.match(L, /^[A-Z]$/);
    }
  });
});
