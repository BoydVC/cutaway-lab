import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { machines } from '../machines/index.js';
import heart from '../machines/heart.js';
import football from '../machines/football.js';
import baseball from '../machines/baseball.js';
import soccer from '../machines/soccer.js';
import lacrosse from '../machines/lacrosse.js';

describe('v9 formal artifacts', () => {
  for (const name of ['FootballPlay', 'BaseballPlay', 'SoccerPlay', 'LacrossePlay']) {
    it(`has ${name}.tla + .cfg`, () => {
      assert.ok(existsSync(`formal/${name}.tla`));
      assert.ok(existsSync(`formal/${name}.cfg`));
      const tla = readFileSync(`formal/${name}.tla`, 'utf8');
      assert.match(tla, /Spec ==/);
      assert.match(tla, /FinalSticky/);
    });
  }
  it('has tlc-all.sh and mirror checks', () => {
    assert.ok(existsSync('formal/tlc-all.sh'));
    assert.ok(existsSync('formal/check-baseball.js'));
    assert.ok(existsSync('formal/check-soccer.js'));
    assert.ok(existsSync('formal/check-lacrosse.js'));
  });
});

describe('v9 heart chamber labels + valves', () => {
  it('chambers labeled RA LA RV LV', () => {
    const svg = heart.parts.map((p) => p.svg).join('\n');
    for (const lab of ['>RA<', '>LA<', '>RV<', '>LV<']) assert.match(svg, new RegExp(lab));
  });
  it('valve abbreviations TV MV PV AV', () => {
    const svg = heart.parts.map((p) => p.svg).join('\n');
    for (const lab of ['>TV<', '>MV<', '>PV<', '>AV<']) assert.match(svg, new RegExp(lab));
  });
  it('has pulmonary artery', () => {
    assert.ok(heart.parts.some((p) => p.id === 'pulmArtery'));
  });
});

describe('v9 sports field polish', () => {
  it('football has END zone + bigger jersey fonts', () => {
    const svg = football.parts.map((p) => p.svg).join('\n');
    assert.match(svg, /END/);
    assert.match(svg, /font-size="1[12]"/);
  });
  it('baseball base labels ≥12px', () => {
    const svg = baseball.parts.find((p) => p.id === 'diamond').svg;
    assert.match(svg, /font-size="12"/);
    assert.match(svg, /Home/);
  });
  it('soccer has 6-yard boxes / arcs', () => {
    const svg = soccer.parts.find((p) => p.id === 'pitch').svg;
    assert.match(svg, /Q95 150/); // penalty arc
  });
  it('lacrosse has creases + restraining', () => {
    const svg = lacrosse.parts.find((p) => p.id === 'field').svg;
    assert.match(svg, /restraining/);
    assert.match(svg, /r="28"/); // crease
  });
  it('jersey numbers on sports ≥11px', () => {
    for (const m of [football, soccer, lacrosse]) {
      const nums = m.parts.filter((p) => /font-size="(\d+)"/.test(p.svg) && /text/.test(p.svg));
      assert.ok(nums.length >= 1, m.id);
      for (const p of nums) {
        const n = Math.max(...[...p.svg.matchAll(/font-size="(\d+)"/g)].map((x) => +x[1]));
        assert.ok(n >= 11, `${m.id}/${p.id} font ${n}`);
      }
    }
  });
});

describe('v9 css aside scroll', () => {
  it('aside and #parts scroll', () => {
    const css = readFileSync('src/style.css', 'utf8');
    assert.match(css, /aside\{[^}]*overflow-y:auto/);
    assert.match(css, /#parts\{[^}]*overflow-y:auto/);
    assert.match(css, /nav\{[^}]*flex-wrap:nowrap/);
  });
});

describe('v9 machine count', () => {
  it('has at least 12 machines', () => {
    assert.ok(machines.length >= 12);
  });
});
