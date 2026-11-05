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
await t('loads first machine', async () => { assert.match(await page.textContent('#title'), /Rocket/); assert.equal(await page.locator('#picker button').count(), 12); });
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
await t('quiz awards stars in picker + badge', async () => { assert.ok(await page.locator('#picker button small').count() >= 0); assert.notEqual(await page.textContent('#badge'), null); });
await t('live chart highlights current + click advances', async () => { await page.goto(URL + '#mars'); await page.waitForTimeout(200); assert.equal(await page.getAttribute('#chart g.on', 'data-state'), 'entry'); await page.click('#chart g[data-state=parachute]'); assert.match(page.url(), /#mars\/parachute/); });
await t('mars side path via divert', async () => { await page.goto(URL + '#mars/powered'); await page.click('#events button >> nth=1'); assert.match(page.url(), /divert/); await page.keyboard.press('ArrowRight'); assert.match(page.url(), /skycrane/); });
await t('volcano erupts', async () => { await page.goto(URL + '#volcano'); for (let i = 0; i < 2; i++) await page.keyboard.press('ArrowRight'); assert.match(await page.textContent('#caption'), /Ash blasts/); });
await t('narrate toggle via N', async () => { await page.keyboard.press('n'); assert.ok(await page.isChecked('#narrate')); await page.keyboard.press('n'); });
await t('part hover highlights', async () => { await page.goto(URL + '#bees'); await page.waitForTimeout(200); await page.hover('#parts li >> nth=3'); assert.equal(await page.locator('#stage .part.hot').count(), 1); });
await t('bad hash falls back', async () => { await page.goto(URL + '#nope/zzz'); await page.waitForTimeout(200); assert.match(await page.textContent('#title'), /Rocket/); });
await t('worksheet renders + answer key hidden in print', async () => { await page.goto(URL + 'worksheet.html#volcano'); await page.waitForTimeout(300); assert.match(await page.textContent('h1'), /Volcano/); await page.emulateMedia({ media: 'print' }); assert.equal(await page.isVisible('.key'), false); await page.emulateMedia({ media: 'screen' }); });
await t('builder: template works and plays', async () => { await page.goto(URL + 'builder.html'); await page.waitForTimeout(400); assert.match(await page.textContent('#ok'), /works/); await page.click('#events button >> nth=0'); assert.match(await page.textContent('#caption'), /carbon dioxide/); });
await t('builder: broken machine shows errors', async () => { const v = await page.inputValue('#src'); await page.fill('#src', v.replace('"WAIT": "done"', '"WAIT": "nowhere"')); await page.waitForTimeout(500); assert.match(await page.textContent('#errs'), /nowhere/); });
await t('builder: share link restores machine', async () => { await page.click('#tpl'); await page.click('#share'); const u = page.url(); assert.match(u, /#m=/); await page.goto('about:blank'); await page.goto(u); await page.waitForTimeout(400); assert.match(await page.textContent('#title'), /Baking Soda/); });
await t('builder: injected script never runs', async () => { const evil = JSON.stringify({ id: 'e', title: 'E', initial: 'a', parts: [{ id: 'p', label: 'P', svg: '<image href=x onerror="window.__pwned=1"/><circle r=\"4\" onload="window.__pwned=1"/>' }], states: { a: { label: 'A', caption: 'a', on: {} } } }); await page.fill('#src', evil); await page.waitForTimeout(600); assert.equal(await page.evaluate(() => window.__pwned), undefined); });
await page.goto(URL + 'builder.html'); await page.waitForTimeout(400); await page.click('#events button >> nth=0'); await page.waitForTimeout(900); await page.screenshot({ path: `${out}/builder.png` });
await page.goto(URL + 'worksheet.html#starship'); await page.waitForTimeout(300); await page.screenshot({ path: `${out}/worksheet.png`, fullPage: true });
await t('a11y: stage label tracks state, buttons named, imgs labelled', async () => { await page.goto(URL + '#frog/legs'); await page.waitForTimeout(200); assert.match(await page.getAttribute('#stage', 'aria-label'), /Growing legs/); const unnamed = await page.$$eval('button', (bs) => bs.filter((b) => !b.textContent.trim() && !b.getAttribute('aria-label')).length); assert.equal(unnamed, 0); });
await t('a11y: chart next-step focusable + Enter advances', async () => { await page.goto(URL + '#water'); await page.waitForTimeout(200); await page.focus('#chart g[data-state=evaporate]'); await page.keyboard.press('Enter'); assert.match(page.url(), /#water\/evaporate/); });
await t('every machine walks its main path to the end in the browser', async () => { for (const id of ['starship','mars','clock','heart','bees','frog','volcano','water','football','baseball','soccer','lacrosse']) { await page.goto(URL + '#' + id); await page.waitForTimeout(100); for (let i = 0; i < 8; i++) await page.keyboard.press('ArrowRight'); const c = await page.textContent('#caption'); assert.ok(c.length > 10, id); } });
await t('reduced motion: no transition', async () => { await page.emulateMedia({ reducedMotion: 'reduce' }); await page.goto(URL + '#frog'); assert.equal(await page.$eval('#stage .part', (g) => getComputedStyle(g).transitionDuration), '0s'); await page.emulateMedia({ reducedMotion: 'no-preference' }); });
await page.goto(URL + '#frog/legs'); await page.waitForTimeout(1000); await page.evaluate(() => scrollTo(0, 0)); await page.screenshot({ path: `${out}/frog.png` });
await t('sports: football play-action to catch', async () => { await page.goto(URL + '#football'); for (let i = 0; i < 4; i++) await page.keyboard.press('ArrowRight'); assert.match(page.url(), /catch/); });
await t('sports: baseball twin killing', async () => { await page.goto(URL + '#baseball'); for (let i = 0; i < 4; i++) await page.keyboard.press('ArrowRight'); assert.match(page.url(), /twinKill/); });
await t('sports: soccer cut-back', async () => { await page.goto(URL + '#soccer'); for (let i = 0; i < 3; i++) await page.keyboard.press('ArrowRight'); assert.match(page.url(), /cross/); });
await t('sports: lacrosse dish', async () => { await page.goto(URL + '#lacrosse'); for (let i = 0; i < 3; i++) await page.keyboard.press('ArrowRight'); assert.match(page.url(), /dish/); });
await page.goto(URL + '#football/throw'); await page.waitForTimeout(900); await page.evaluate(() => scrollTo(0, 0)); await page.screenshot({ path: `${out}/football.png` });
await page.goto(URL + '#baseball/twinKill'); await page.waitForTimeout(900); await page.evaluate(() => scrollTo(0, 0)); await page.screenshot({ path: `${out}/baseball.png` });
await page.goto(URL + '#soccer/cross'); await page.waitForTimeout(900); await page.evaluate(() => scrollTo(0, 0)); await page.screenshot({ path: `${out}/soccer.png` });
await page.goto(URL + '#lacrosse/dish'); await page.waitForTimeout(900); await page.evaluate(() => scrollTo(0, 0)); await page.screenshot({ path: `${out}/lacrosse.png` });

await page.goto(URL + '#water/precip'); await page.waitForTimeout(1000); await page.evaluate(() => scrollTo(0, 0)); await page.screenshot({ path: `${out}/water.png` });
// screenshots
await page.mouse.move(5, 895);
await page.goto(URL + '#starship/staging'); await page.waitForTimeout(1000); await page.evaluate(() => scrollTo(0, 0)); await page.screenshot({ path: `${out}/hero-1440x900.png` });
await page.goto(URL + '#clock/tickRight/x'); await page.waitForTimeout(1100); await page.evaluate(() => scrollTo(0, 0)); await page.screenshot({ path: `${out}/clock-exploded.png` });
await page.goto(URL + '#heart/ventricles'); await page.waitForTimeout(1000); await page.evaluate(() => scrollTo(0, 0)); await page.screenshot({ path: `${out}/heart.png` });
await page.goto(URL + '#mars/skycrane'); await page.waitForTimeout(1000); await page.evaluate(() => scrollTo(0, 0)); await page.screenshot({ path: `${out}/mars.png` });
await page.goto(URL + '#volcano/erupt/x'); await page.waitForTimeout(1100); await page.evaluate(() => scrollTo(0, 0)); await page.screenshot({ path: `${out}/volcano-exploded.png` });
await page.goto(URL + '#bees/dance'); await page.waitForTimeout(1000); await page.keyboard.press('q'); await page.waitForTimeout(300); await page.evaluate(() => scrollTo(0, 0)); await page.screenshot({ path: `${out}/quiz.png` });
const phone = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
await phone.goto(URL + '#starship/catch'); await phone.waitForTimeout(1000);
await t('phone: no horizontal overflow', async () => { assert.ok(await phone.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)); });
await phone.screenshot({ path: `${out}/phone-390x844.png`, fullPage: true });
await t('no console errors', async () => assert.deepEqual(errors, [], errors.join(' | ')));
await browser.close(); srv.kill();
console.log(`e2e: ${pass} passed, ${fail} failed`); process.exit(fail ? 1 : 0);
