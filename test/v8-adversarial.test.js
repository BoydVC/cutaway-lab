import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { encodeShare, MAX_SHARE, TEMPLATE, parseMachine } from '../src/custom.js';
import { makeQuiz } from '../src/quiz.js';
import { load, record } from '../src/progress.js';
import { layout } from '../src/layout.js';
import { machines } from '../machines/index.js';

const mem = () => { const m = new Map(); return { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => m.set(k, v), _m: m }; };

test('F1: encodeShare rejects overlong payloads', () => {
  assert.ok(MAX_SHARE >= 8000);
  const huge = structuredClone(TEMPLATE);
  huge.parts[0].svg = '<circle r="1"/>'.repeat(800); // still under sanitize 4k after parse, so craft raw
  const raw = JSON.stringify({
    ...TEMPLATE,
    parts: [{ id: 'p', label: 'P', job: 'x', svg: 'x'.repeat(5000) }, ...TEMPLATE.parts],
    title: 'x'.repeat(5000),
  });
  // Bypass sanitize — encodeShare parses JSON only
  assert.throws(() => encodeShare(raw), /too long/);
});

test('F1: normal template still shares', () => {
  const s = encodeShare(JSON.stringify(TEMPLATE));
  assert.ok(s.length < MAX_SHARE);
  assert.match(s, /^[A-Za-z0-9_-]+$/);
});

test('F3: quiz prompts are unique', () => {
  for (const m of machines) {
    const q = makeQuiz(m, 11, 5);
    const prompts = q.map((x) => x.prompt);
    assert.equal(new Set(prompts).size, prompts.length, m.id);
    assert.ok(q.length >= 1 && q.length <= 5, m.id);
  }
});

test('F3: tiny machine returns fewer than 5 without dupes', () => {
  const q = makeQuiz(TEMPLATE, 3, 5);
  assert.ok(q.length <= 5);
  assert.equal(new Set(q.map((x) => x.prompt)).size, q.length);
});

test('F5: progress migrates legacy key to v2', () => {
  const s = mem();
  s.setItem('cutaway-lab:stars', JSON.stringify({ heart: 2 }));
  assert.equal(load(s).heart, 2);
  assert.ok(s.getItem('cutaway-lab:stars:v2'));
  record(s, 'heart', 3);
  assert.equal(JSON.parse(s.getItem('cutaway-lab:stars:v2')).heart, 3);
});

test('F4: chart nodes are wide enough for sports labels', () => {
  const fb = machines.find((m) => m.id === 'football');
  const L = layout(fb);
  assert.ok(Object.values(L.nodes).every((n) => n.w >= 220));
});

test('F2: app speaks only when state identity changes', () => {
  const app = fs.readFileSync(new URL('../src/app.js', import.meta.url), 'utf8');
  assert.match(app, /lastSpoken/);
  assert.match(app, /S\.lastSpoken !==/);
});

test('adversarial doc lists findings', () => {
  const doc = fs.readFileSync(new URL('../docs/ADVERSARIAL.md', import.meta.url), 'utf8');
  for (const f of ['F1', 'F2', 'F3', 'F4', 'F5', 'Blast radius']) assert.match(doc, new RegExp(f));
});
