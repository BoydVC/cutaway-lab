import test from 'node:test'; import assert from 'node:assert/strict';
import { worksheet } from '../src/worksheet.js'; import { parseMachine, sanitizeSvg, encodeShare, decodeShare, TEMPLATE } from '../src/custom.js';
import { machines } from '../machines/index.js'; import { mainPath } from '../src/engine.js';
for (const m of machines) test(`${m.id}: worksheet has all three sections + consistent key`, () => {
  const w = worksheet(m, 3); for (const h of ['Put the steps in order', 'Match each part', 'Quick quiz', 'Answer key']) assert.ok(w.html.includes(h), h);
  assert.deepEqual(w.answer.order, mainPath(m)); assert.equal(w.answer.match.length, m.parts.filter((p) => p.job).length); assert.equal(new Set(w.answer.match).size, w.answer.match.length);
});
test('worksheet deterministic per seed', () => assert.equal(worksheet(machines[0], 9).html, worksheet(machines[0], 9).html));
test('worksheet escapes html', () => { const m = structuredClone(TEMPLATE); m.title = '<b>x</b>'; assert.ok(!worksheet(m).html.includes('<b>x</b>')); });
test('template parses clean', () => { const r = parseMachine(JSON.stringify(TEMPLATE)); assert.deepEqual(r.errors, []); assert.deepEqual(r.warnings, []); });
test('bad json gives friendly error', () => assert.match(parseMachine('{oops').errors[0], /not valid JSON/));
test('invalid machine reports validator errors', () => { const m = structuredClone(TEMPLATE); m.states.ready.on.POUR_VINEGAR = 'nowhere'; assert.ok(parseMachine(JSON.stringify(m)).errors.some((e) => e.includes('nowhere'))); });
test('sanitize drops script tags', () => { const s = sanitizeSvg('<script>alert(1)</script><circle r="3"/>'); assert.ok(!/script/i.test(s.svg)); assert.ok(s.stripped); assert.match(s.svg, /circle/); });
test('sanitize drops event handlers and hrefs', () => { const s = sanitizeSvg('<rect onclick="x()" width="3" href="javascript:alert(1)"/>'); assert.ok(!/onclick|javascript|href/i.test(s.svg)); assert.match(s.svg, /width="3"/); });
test('sanitize drops foreignObject/image', () => { const s = sanitizeSvg('<foreignObject><img src=x onerror=alert(1)></foreignObject><image href="x"/>'); assert.ok(!/foreign|img|image|onerror/i.test(s.svg)); });
test('sanitize caps length', () => assert.ok(sanitizeSvg('<g>' + 'a'.repeat(9000) + '</g>').svg.length <= 4000));
test('share link round-trips unicode', () => { const t = JSON.stringify({ ...TEMPLATE, title: 'Vulkan 🌋 ünïcode' }); assert.equal(JSON.parse(decodeShare(encodeShare(t))).title, 'Vulkan 🌋 ünïcode'); });
test('bad share link falls back to template', () => assert.equal(JSON.parse(decodeShare('!!!')).id, TEMPLATE.id));
test('share link is url-safe', () => assert.match(encodeShare(JSON.stringify(TEMPLATE)), /^[A-Za-z0-9_-]+$/));
