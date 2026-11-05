// Headless end-to-end check + screenshots. Usage: npm run e2e (starts its own server)
import { chromium } from 'playwright'; import { spawn } from 'node:child_process'; import assert from 'node:assert/strict'; import fs from 'node:fs';
const PORT = 4411, URL = `http://127.0.0.1:${PORT}/`, out = process.env.SHOTS || 'screenshots';
fs.mkdirSync(out, { recursive: true });
const srv = spawn('node', ['scripts/serve.js'], { env: { ...process.env, PORT: String(PORT) }, stdio: 'pipe' });
await new Promise((r) => srv.stdout.once('data', r));
const browser = await chromium.launch(); let pass = 0, fail = 0; const errors = [];
async function t(name, fn) { try { await fn(); pass++; console.log('ok', name); } catch (e) { fail++; console.log('FAIL', name, e.message); } }
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
page.on('pageerror', (e) => errors.push(e.message)); page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
await page.goto(URL);
await t('loads first machine', async () => { assert.match(await page.textContent('#title'), /Rocket/); assert.equal(await page.locator('#picker button').count(), 4); });
await t('event button advances', async () => { await page.click('#events button >> nth=0'); assert.match(await page.textContent('#caption'), /Dozens of engines/); assert.match(page.url(), /#starship\/ignition/); });
await t('back returns', async () => { await page.click('#back'); assert.match(page.url(), /#starship\/pad/); });
await t('arrow keys walk main path to the catch', async () => { for (let i = 0; i < 5; i++) await page.keyboard.press('ArrowRight'); assert.match(page.url(), /catch/); assert.match(await page.textContent('#events'), /The end/); });
await t('side path reachable', async () => { await page.click('#reset'); await page.click('#events button >> nth=1'); assert.match(page.url(), /scrubbed/); });
await t('deep link + exploded', async () => { await page.goto(URL + '#clock/tickLeft/x'); await page.waitForTimeout(1000); assert.match(await page.textContent('#title'), /Pendulum/); assert.ok(await page.isChecked('#explode')); assert.ok(await page.locator('#stage text.lbl').count() >= 3); });
await t('steps list highlights current', async () => { assert.match(await page.textContent('#states li.on'), /Swing left/); });
await t('space autoplays', async () => { await page.goto(URL + '#heart'); await page.keyboard.press('Space'); await page.waitForTimeout(1800); assert.doesNotMatch(page.url(), /#heart\/fill$/); await page.keyboard.press('Space'); });
await t('quiz runs to a score', async () => {
  await page.goto(URL + '#bees'); await page.keyboard.press('q'); assert.ok(await page.locator('#quiz[open]').count());
  for (let i = 0; i < 5; i++) { await page.click('#qchoices button >> nth=0'); await page.waitForTimeout(1000); }
  assert.match(await page.textContent('#qprompt'), /of 5 right/); await page.click('#qclose');
});
await t('part hover highlights', async () => { await page.hover('#parts li >> nth=3'); assert.equal(await page.locator('#stage .part.hot').count(), 1); });
await t('bad hash falls back', async () => { await page.goto(URL + '#nope/zzz'); await page.waitForTimeout(200); assert.match(await page.textContent('#title'), /Rocket/); });
// screenshots
await page.mouse.move(5, 895);
await page.goto(URL + '#starship/staging'); await page.waitForTimeout(1000); await page.evaluate(() => scrollTo(0, 0)); await page.screenshot({ path: `${out}/hero-1440x900.png` });
await page.goto(URL + '#clock/tickRight/x'); await page.waitForTimeout(1100); await page.evaluate(() => scrollTo(0, 0)); await page.screenshot({ path: `${out}/clock-exploded.png` });
await page.goto(URL + '#heart/ventricles'); await page.waitForTimeout(1000); await page.evaluate(() => scrollTo(0, 0)); await page.screenshot({ path: `${out}/heart.png` });
await page.goto(URL + '#bees/dance'); await page.waitForTimeout(1000); await page.keyboard.press('q'); await page.waitForTimeout(300); await page.evaluate(() => scrollTo(0, 0)); await page.screenshot({ path: `${out}/quiz.png` });
const phone = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
await phone.goto(URL + '#starship/catch'); await phone.waitForTimeout(1000);
await t('phone: no horizontal overflow', async () => { assert.ok(await phone.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)); });
await phone.screenshot({ path: `${out}/phone-390x844.png`, fullPage: true });
await t('no console errors', async () => assert.deepEqual(errors, []));
await browser.close(); srv.kill();
console.log(`e2e: ${pass} passed, ${fail} failed`); process.exit(fail ? 1 : 0);
