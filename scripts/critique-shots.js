// Capture every machine at key frames for visual critique. Usage: node scripts/critique-shots.js [outdir]
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import fs from 'node:fs';

const OUT = process.argv[2] || '.shots/v05';
const PORT = 4413;
fs.mkdirSync(OUT, { recursive: true });
const srv = spawn('node', ['scripts/serve.js'], { env: { ...process.env, PORT: String(PORT) }, stdio: 'pipe' });
await new Promise((r) => srv.stdout.once('data', r));
const browser = await chromium.launch();
const desk = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const phone = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });

const frames = [
  ['starship', 'staging'],
  ['starship', 'catch'],
  ['mars', 'skycrane'],
  ['clock', 'tickLeft/x'],
  ['heart', 'fill'],
  ['heart', 'atria'],
  ['heart', 'ventricles'],
  ['heart', 'ventricles/x'],
  ['bees', 'dance'],
  ['frog', 'legs'],
  ['volcano', 'erupt/x'],
  ['water', 'precip'],
];

async function shot(page, hash, name) {
  await page.goto(`http://127.0.0.1:${PORT}/#${hash}`);
  await page.waitForTimeout(1100);
  await page.evaluate(() => scrollTo(0, 0));
  await page.screenshot({ path: `${OUT}/${name}.png` });
}

for (const [id, st] of frames) {
  const tag = `${id}-${st.replace('/', '-')}`;
  await shot(desk, `${id}/${st}`, `d-${tag}`);
  await shot(phone, `${id}/${st}`, `p-${tag}`);
  console.log('shot', tag);
}
await desk.goto(`http://127.0.0.1:${PORT}/builder.html`);
await desk.waitForTimeout(500);
await desk.click('#events button >> nth=0');
await desk.waitForTimeout(900);
await desk.screenshot({ path: `${OUT}/d-builder-fizz.png` });
console.log('shot builder-fizz');

await browser.close(); srv.kill();
console.log('wrote', OUT);
