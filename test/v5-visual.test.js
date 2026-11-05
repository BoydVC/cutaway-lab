import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { machines } from '../machines/index.js';
import { TEMPLATE, parseMachine } from '../src/custom.js';
import { validate, mainPath } from '../src/engine.js';

const css = fs.readFileSync(new URL('../src/style.css', import.meta.url), 'utf8');
const app = fs.readFileSync(new URL('../src/app.js', import.meta.url), 'utf8');

test('chart node labels are at least 12px (css + svg attr)', () => {
  assert.match(css, /#chart text\{[^}]*font-size:1[2-9]px/);
  assert.match(app, /font-size="1[2-9]"/);
});
test('chart event labels are at least 12px', () => {
  assert.match(css, /#chart text\.ev\{[^}]*font-size:1[2-9]px/);
  assert.match(app, /class="ev"[^>]*font-size="1[2-9]"/);
});
test('exploded stage labels are at least 12px', () => {
  assert.match(css, /#stage text\.lbl\{font-size:1[2-9]px/);
});
test('heart has chambers, valves and flow parts', () => {
  const h = machines.find((m) => m.id === 'heart');
  const ids = new Set(h.parts.map((p) => p.id));
  for (const id of ['ra', 'la', 'rv', 'lv', 'tricuspid', 'mitral', 'pulm', 'aortic', 'lungs', 'flowOut', 'septum', 'outline']) {
    assert.ok(ids.has(id), id);
  }
  assert.equal(validate(h).length, 0);
  assert.ok(mainPath(h).includes('ventricles'));
});
test('heart valves are yellow flaps (not just strokes)', () => {
  const h = machines.find((m) => m.id === 'heart');
  const tri = h.parts.find((p) => p.id === 'tricuspid').svg;
  assert.match(tri, /fill="#fde68a"/);
  assert.match(tri, /L\d+ \d+ L\d+/); // triangular flap path
});
test('builder foam sits near the cup rim and overflows on fizz', () => {
  const foam = TEMPLATE.parts.find((p) => p.id === 'foam');
  assert.match(foam.svg, /cy="15[5-9]"/); // planted on rim ~155
  assert.ok(TEMPLATE.states.fizz.parts.foam.y < 0); // overflows upward
  assert.equal(parseMachine(JSON.stringify(TEMPLATE)).errors.length, 0);
});
test('every machine still validates after polish', () => {
  for (const m of machines) assert.deepEqual(validate(m), [], m.id);
});
