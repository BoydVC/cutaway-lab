import test from 'node:test'; import assert from 'node:assert/strict';
import { layout } from '../src/layout.js'; import { load, record, total, badge } from '../src/progress.js';
import { machines } from '../machines/index.js';
const mem = () => { const m = new Map(); return { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => m.set(k, v) }; };
for (const m of machines) {
  test(`${m.id}: layout places every state once, no overlaps`, () => {
    const L = layout(m); assert.equal(Object.keys(L.nodes).length, Object.keys(m.states).length);
    const ys = Object.values(L.nodes).map((n) => n.y); assert.equal(new Set(ys).size, ys.length);
    assert.equal(L.nodes[m.initial].y, Math.min(...ys));
  });
  test(`${m.id}: layout edges match transitions`, () => { const n = Object.values(m.states).reduce((a, s) => a + Object.keys(s.on || {}).length, 0); assert.equal(layout(m).edges.length, n); });
}
test('loop edges marked back', () => { const clock = machines.find((m) => m.id === 'clock'); assert.ok(layout(clock).edges.some((e) => e.back && e.from === 'tickRight')); });
test('progress keeps best score', () => { const s = mem(); record(s, 'a', 2); record(s, 'a', 1); assert.equal(load(s).a, 2); record(s, 'a', 3); assert.equal(load(s).a, 3); });
test('progress survives garbage', () => { const s = mem(); s.setItem('cutaway-lab:stars', '{nope'); assert.deepEqual(load(s), {}); });
test('badges', () => { assert.equal(badge({}, 6), ''); assert.match(badge({ a: 1 }, 6), /Apprentice/); assert.match(badge({ a: 3, b: 3, c: 3, d: 2 }, 6), /Lab/); assert.match(badge(Object.fromEntries('abcdef'.split('').map((k) => [k, 3])), 6), /Master/); assert.equal(total({ a: 1, b: 2 }), 3); });
test('six machines across topics', () => { assert.equal(machines.length, 6); assert.ok(new Set(machines.map((m) => m.topic)).size >= 4); });
test('adjacent forward edges are straight, skips are lanes', () => { const s = machines.find((m) => m.id === 'starship'); const L = layout(s); assert.ok(L.edges.find((e) => e.from === 'pad' && e.to === 'ignition').straight); const scrub = L.edges.find((e) => e.to === 'scrubbed'); assert.ok(!scrub.straight && scrub.lane > 1); });
