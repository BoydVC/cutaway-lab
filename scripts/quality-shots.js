// Render every fleet machine at 1440x900 and 390x844 for visual QA.
// Usage: node scripts/quality-shots.js [outdir]
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import { machines } from '../machines/index.js';
import { mainPath } from '../src/engine.js';

const OUT = process.argv[2] || 'screenshots/quality';
const PORT = 4417;
fs.mkdirSync(`${OUT}/desk`, { recursive: true });
fs.mkdirSync(`${OUT}/phone`, { recursive: true });
const srv = spawn('node', ['scripts/serve.js'], { env: { ...process.env, PORT: String(PORT) }, stdio: 'pipe' });
await new Promise((r) => srv.stdout.once('data', r));
const browser = await chromium.launch();
const desk = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const phone = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });

async function shot(page, hash, path) {
  await page.goto(`http://127.0.0.1:${PORT}/#${hash}`);
  await page.waitForTimeout(900);
  await page.evaluate(() => scrollTo(0, 0));
  await page.screenshot({ path });
}

const manifest = [];
for (const m of machines) {
  const path = mainPath(m);
  const mid = path[Math.min(path.length - 2, Math.floor(path.length / 2))] || path[0];
  const hash = `${m.id}/${mid}`;
  await shot(desk, hash, `${OUT}/desk/${m.id}.png`);
  await shot(phone, hash, `${OUT}/phone/${m.id}.png`);
  // also exploded desktop for machines with explode data
  const hasExplode = m.parts.some((p) => p.explode);
  if (hasExplode) {
    await shot(desk, `${m.id}/${mid}/x`, `${OUT}/desk/${m.id}-x.png`);
  }
  manifest.push({ id: m.id, mid, title: m.title });
  console.log('ok', m.id, mid);
}

// hero + phone samples
await shot(desk, 'starship/staging', `${OUT}/desk/_hero.png`);
await shot(phone, 'heart/ventricles', `${OUT}/phone/_heart.png`);
await shot(phone, 'flashlight/on', `${OUT}/phone/_flashlight.png`);

fs.writeFileSync(`${OUT}/manifest.json`, JSON.stringify(manifest, null, 2));
await browser.close(); srv.kill();
console.log('wrote', OUT, 'machines', manifest.length);
