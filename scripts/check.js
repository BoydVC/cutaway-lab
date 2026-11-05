// npm run check: validate every machine and print its statechart (Mermaid). Exit 1 on any problem.
import { machines } from '../machines/index.js'; import { validate, toMermaid, mainPath } from '../src/engine.js';
let bad = 0;
for (const m of machines) {
  const e = validate(m); bad += e.length;
  console.log(`${e.length ? '✖' : '✔'} ${m.id}: ${Object.keys(m.states).length} states, main path ${mainPath(m).join(' → ')}`);
  e.forEach((x) => console.log('   -', x));
  if (process.argv.includes('--mermaid')) console.log(toMermaid(m) + '\n');
}
process.exit(bad ? 1 : 0);
