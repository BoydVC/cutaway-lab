import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { machines } from '../machines/index.js';
import { validate, mainPath } from '../src/engine.js';

describe('v14 blast-radius', () => {
  it('e2e walk list includes every fleet id (R3-1)', () => {
    const src = fs.readFileSync(new URL('../e2e/run.js', import.meta.url), 'utf8');
    const m = src.match(/for \(const id of \[([^\]]+)\]/);
    assert.ok(m, 'walk list not found');
    const ids = m[1].split(',').map((s) => s.replace(/['"\s]/g, '')).filter(Boolean);
    const fleet = machines.map((x) => x.id);
    for (const id of fleet) assert.ok(ids.includes(id), `e2e missing ${id}`);
  });

  it('narrate.js merges report by id (R3-2)', () => {
    const src = fs.readFileSync(new URL('../scripts/narrate.js', import.meta.url), 'utf8');
    assert.match(src, /merge by id/);
    assert.match(src, /byId\.set/);
  });

  it('every machine validates + path ≥3', () => {
    for (const m of machines) {
      assert.deepEqual(validate(m), [], m.id);
      assert.ok(mainPath(m).length >= 3, m.id);
    }
  });

  it('chart node + event labels stay ≥12px', () => {
    const app = fs.readFileSync(new URL('../src/app.js', import.meta.url), 'utf8');
    const css = fs.readFileSync(new URL('../src/style.css', import.meta.url), 'utf8');
    assert.match(app, /font-size="1[2-9]"/);
    assert.match(css, /#chart text\{[^}]*font-size:1[2-9]px/);
  });

  it('fleet ids unique', () => {
    assert.equal(new Set(machines.map((m) => m.id)).size, machines.length);
  });
});
