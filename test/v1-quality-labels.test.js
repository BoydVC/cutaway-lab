import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { machines } from '../machines/index.js';
import { makeQuiz } from '../src/quiz.js';

describe('v1.0 quality labels', () => {
  for (const m of machines) {
    it(`${m.id} has ≥2 on-stage <text> labels`, () => {
      const texts = m.parts.flatMap((p) => [...(p.svg.matchAll(/<text[^>]*>([^<]+)<\/text>/g) || [])].map((x) => x[1]));
      assert.ok(texts.length >= 2, `${m.id} only ${texts.length}: ${texts}`);
    });
    it(`${m.id} has ≥1 decorative lbl* part`, () => {
      const n = m.parts.filter((p) => /^lbl/i.test(p.id) || /label$/i.test(p.label || '')).length;
      assert.ok(n >= 1, `${m.id} missing lbl* (have ${n})`);
    });
  }
  it('fleet locked at 36', () => assert.equal(machines.length, 36));
  for (const m of machines) {
    it(`${m.id} quiz yields 5 questions`, () => {
      assert.equal(makeQuiz(m, 1, 5).length, 5);
    });
  }

  it('photo stomata label sits on the leaf, not the roots', () => {
    const photo = machines.find((m) => m.id === 'photo');
    const lbl = photo.parts.find((p) => p.id === 'lblStomata');
    const y = Number((lbl.svg.match(/\by="(\d+(?:\.\d+)?)"/) || [])[1]);
    assert.ok(y < 200, `stomata label y=${y} looks like roots`);
  });
  it('elevator has moving floor highlight', () => {
    const elev = machines.find((m) => m.id === 'elevator');
    assert.ok(elev.parts.some((p) => p.id === 'floorHi'));
    assert.ok(elev.states.moving.parts.floorHi);
  });
  it('circuit 9V + bulb labels are high-contrast yellow', () => {
    const c = machines.find((m) => m.id === 'circuit');
    const batt = c.parts.find((p) => p.id === 'battery').svg;
    const bulb = c.parts.find((p) => p.id === 'bulb').svg;
    assert.match(batt, /fill="#fde68a"[^>]*>9V/);
    assert.match(bulb, /fill="#fde68a"[^>]*>bulb/);
  });

  it('bees dance shows sun-angle arc + flower label near patch', () => {
    const bees = machines.find((m) => m.id === 'bees');
    assert.ok(bees.parts.some((p) => p.id === 'sunArc'));
    const fl = bees.parts.find((p) => p.id === 'lblFlower');
    const y = Number((fl.svg.match(/\by="(\d+)/) || [])[1]);
    assert.ok(y > 180, `flower label y=${y} too high (far from patch)`);
    assert.ok(bees.states.dance.parts.sunArc);
  });
  it('frog growing-legs shows gills + tail + reed', () => {
    const frog = machines.find((m) => m.id === 'frog');
    for (const id of ['reed', 'lblGills', 'lblTail']) assert.ok(frog.parts.some((p) => p.id === id), id);
    assert.ok(frog.states.legs.parts.lblGills);
  });
  it('sharpener exposes crank label', () => {
    const s = machines.find((m) => m.id === 'sharpener');
    assert.ok(s.parts.some((p) => p.id === 'lblCrank'));
  });

  it('shutter aperture/blades labels do not share the same anchor', () => {
    const s = machines.find((m) => m.id === 'shutter');
    const a = s.parts.find((p) => p.id === 'lblAperture').svg;
    const b = s.parts.find((p) => p.id === 'lblBlades').svg;
    const ax = Number((a.match(/\bx="(\d+)/) || [])[1]);
    const bx = Number((b.match(/\bx="(\d+)/) || [])[1]);
    assert.ok(Math.abs(ax - bx) >= 40, `aperture x=${ax} blades x=${bx} overlap`);
  });

  it('every fleet machine has a TLC model (36)', async () => {
    const fs = await import('node:fs');
    const tlas = fs.readdirSync('formal').filter((f) => f.endsWith('.tla'));
    assert.equal(tlas.length, 36, tlas.join(','));
  });
});
