import test from 'node:test';
import assert from 'node:assert/strict';
import { machines } from '../machines/index.js';
import { validate, mainPath, events, step, isFinal } from '../src/engine.js';
import { makeQuiz, grade } from '../src/quiz.js';
import { layout } from '../src/layout.js';

const sports = ['football', 'baseball', 'soccer', 'lacrosse'];

test('sports machines registered', () => {
  assert.ok(machines.filter((m) => m.topic === 'Sports').length >= 4);
  for (const id of sports) assert.ok(machines.find((m) => m.id === id), id);
});

for (const id of sports) {
  const m = () => machines.find((x) => x.id === id);
  test(`${id}: validates`, () => assert.deepEqual(validate(m()), []));
  test(`${id}: main path reaches a final`, () => {
    const path = mainPath(m());
    assert.ok(path.length >= 4, path.join('>'));
    assert.ok(isFinal(m(), path.at(-1)) || events(m(), path.at(-1)).length, 'ends or loops');
  });
  test(`${id}: has a side path`, () => {
    const path = new Set(mainPath(m()));
    assert.ok(Object.keys(m().states).some((s) => !path.has(s)));
  });
  test(`${id}: captions kid-length`, () => {
    for (const s of Object.values(m().states)) assert.ok(s.caption.length <= 140, s.caption);
  });
  test(`${id}: quiz well-formed`, () => {
    const q = makeQuiz(m(), 7, 5);
    assert.equal(q.length, 5);
    for (const item of q) {
      assert.ok(item.prompt.length > 5);
      assert.equal(item.choices.length, 4);
      assert.ok(item.answer >= 0 && item.answer < 4);
    }
    assert.equal(grade(q, q.map((x) => x.answer)).stars, 3);
  });
  test(`${id}: layout places every state`, () => {
    const L = layout(m());
    assert.equal(Object.keys(L.nodes).length, Object.keys(m().states).length);
  });
  test(`${id}: no trademarked names in copy`, () => {
    const blob = JSON.stringify(m());
    assert.doesNotMatch(blob, /Ravens|Orioles|Baltimore|NFL|MLB|MLS|PLL|Nike|Adidas|Under Armour/i);
  });
}

test('football play-action path: huddle→snap→fake→throw→catch', () => {
  const m = machines.find((x) => x.id === 'football');
  let s = m.initial;
  for (const ev of ['SNAP', 'FAKE', 'THROW', 'CATCH']) s = step(m, s, ev);
  assert.equal(s, 'catch');
  assert.ok(isFinal(m, s));
});
test('baseball 6-4-3 path: pitch→grounder→toSecond→toFirst→twinKill', () => {
  const m = machines.find((x) => x.id === 'baseball');
  let s = m.initial;
  for (const ev of ['HIT', 'FIELD', 'FORCE', 'OUT']) s = step(m, s, ev);
  assert.equal(s, 'twinKill');
});
test('soccer overlap path ends in cut-back cross', () => {
  const m = machines.find((x) => x.id === 'soccer');
  let s = m.initial;
  for (const ev of ['OVERLAP', 'PASS', 'CROSS']) s = step(m, s, ev);
  assert.equal(s, 'cross');
});
test('lacrosse fast break: save→clear→push→dish', () => {
  const m = machines.find((x) => x.id === 'lacrosse');
  let s = m.initial;
  for (const ev of ['CLEAR', 'PUSH', 'DISH']) s = step(m, s, ev);
  assert.equal(s, 'dish');
});
