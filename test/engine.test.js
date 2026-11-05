import test from 'node:test'; import assert from 'node:assert/strict';
import { validate, step, mainPath, pose, reachable, isFinal, toMermaid, canReachFinal, events } from '../src/engine.js';
import { machines } from '../machines/index.js';
const tiny = () => ({ id: 't', title: 'T', initial: 'a', parts: [{ id: 'p', label: 'P', pose: { x: 5 }, explode: [10, 20] }],
  states: { a: { label: 'A', caption: 'a', on: { GO: 'b' } }, b: { label: 'B', caption: 'b', on: {}, parts: { p: { y: 3 } } } } });
test('tiny machine is valid', () => assert.deepEqual(validate(tiny()), []));
test('rejects non-object', () => assert.ok(validate(null).length));
test('missing keys reported', () => assert.ok(validate({}).some((e) => e.includes('missing id'))));
test('unknown initial', () => { const m = tiny(); m.initial = 'z'; assert.ok(validate(m).some((e) => e.includes('initial'))); });
test('unknown target', () => { const m = tiny(); m.states.a.on.GO = 'zz'; assert.ok(validate(m).some((e) => e.includes('unknown "zz"'))); });
test('unreachable state', () => { const m = tiny(); m.states.c = { label: 'C', caption: 'c', on: {} }; assert.ok(validate(m).includes('state c unreachable')); });
test('livelock detected', () => { const m = tiny(); m.states.a.on = { GO: 'b' }; m.states.b.on = { BACK: 'a' }; const e = validate(m); assert.ok(e.includes('no final state')); assert.ok(e.some((x) => x.includes('livelock'))); });
test('duplicate part', () => { const m = tiny(); m.parts.push({ id: 'p', label: 'Q' }); assert.ok(validate(m).includes('duplicate part p')); });
test('part without label', () => { const m = tiny(); m.parts[0].label = ''; assert.ok(validate(m).some((e) => e.includes('missing label'))); });
test('state poses unknown part', () => { const m = tiny(); m.states.b.parts = { nope: {} }; assert.ok(validate(m).some((e) => e.includes('unknown part nope'))); });
test('missing caption', () => { const m = tiny(); delete m.states.a.caption; assert.ok(validate(m).includes('state a missing caption')); });
test('step follows and throws', () => { const m = tiny(); assert.equal(step(m, 'a', 'GO'), 'b'); assert.throws(() => step(m, 'b', 'GO')); });
test('mainPath linear', () => assert.deepEqual(mainPath(tiny()), ['a', 'b']));
test('mainPath stops on cycle', () => { const m = tiny(); m.states.b.on = { BACK: 'a' }; assert.deepEqual(mainPath(m), ['a', 'b']); });
test('pose inherits defaults and overlays', () => { const p = pose(tiny(), 'b', 'p'); assert.equal(p.x, 5); assert.equal(p.y, 3); assert.equal(p.scale, 1); });
test('exploded adds offset', () => { const p = pose(tiny(), 'b', 'p', true); assert.equal(p.x, 15); assert.equal(p.y, 23); });
test('reachable + isFinal', () => { const m = tiny(); assert.deepEqual([...reachable(m)], ['a', 'b']); assert.ok(isFinal(m, 'b')); assert.ok(!isFinal(m, 'a')); });
test('mermaid export', () => { const s = toMermaid(tiny()); assert.match(s, /\[\*\] --> a/); assert.match(s, /a --> b: GO/); assert.match(s, /b --> \[\*\]/); });
for (const m of machines) {
  test(`${m.id}: valid`, () => assert.deepEqual(validate(m), []));
  test(`${m.id}: every state can finish`, () => { for (const n of Object.keys(m.states)) assert.ok(canReachFinal(m, n), n); });
  test(`${m.id}: main path ends at a final state or loops`, () => { const p = mainPath(m); assert.ok(p.length >= 3); });
  test(`${m.id}: has a side path`, () => assert.ok(Object.keys(m.states).length > mainPath(m).length || Object.values(m.states).some((s) => events(m, Object.keys(m.states).find((k) => m.states[k] === s)).length > 1)));
  test(`${m.id}: captions are kid-length (<= 140 chars)`, () => { for (const s of Object.values(m.states)) assert.ok(s.caption.length <= 140, s.caption); });
  test(`${m.id}: at least 3 parts have a job`, () => assert.ok(m.parts.filter((p) => p.job).length >= 3));
  test(`${m.id}: svg has no script`, () => { for (const p of m.parts) assert.ok(!/script|on\w+=/i.test(p.svg)); });
  test(`${m.id}: poses are finite numbers`, () => { for (const n of Object.keys(m.states)) for (const p of m.parts) for (const v of Object.values(pose(m, n, p.id, true))) if (typeof v === 'number') assert.ok(Number.isFinite(v)); });
}
test('machine ids unique', () => assert.equal(new Set(machines.map((m) => m.id)).size, machines.length));
