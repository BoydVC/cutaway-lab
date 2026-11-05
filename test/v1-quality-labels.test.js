import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { machines } from '../machines/index.js';

describe('v1.0 quality labels', () => {
  for (const m of machines) {
    it(`${m.id} has ≥2 on-stage <text> labels`, () => {
      const texts = m.parts.flatMap((p) => [...(p.svg.matchAll(/<text[^>]*>([^<]+)<\/text>/g) || [])].map((x) => x[1]));
      assert.ok(texts.length >= 2, `${m.id} only ${texts.length}: ${texts}`);
    });
  }
  it('fleet locked at 36', () => assert.equal(machines.length, 36));
});
