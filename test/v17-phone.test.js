import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

describe('v17 phone polish', () => {
  it('phone screenshots exist for heart + football + starship', () => {
    for (const f of ['phone-390x844.png', 'phone-heart-390x844.png', 'phone-football-390x844.png']) {
      assert.ok(fs.existsSync(new URL('../screenshots/' + f, import.meta.url)), f);
    }
  });
  it('e2e covers phone overflow on heart + football', () => {
    const src = fs.readFileSync(new URL('../e2e/run.js', import.meta.url), 'utf8');
    assert.match(src, /phone: heart no overflow/);
    assert.match(src, /phone: football no overflow/);
  });
});
