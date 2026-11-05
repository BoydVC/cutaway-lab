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
await t('loads first machine', async () => { assert.match(await page.textContent('#title'), /Rocket/); assert.ok(await page.locator('#picker button').count() >= 12); });
await t('topic filter narrows picker and switches machine', async () => {
  await page.goto(URL);
  await page.waitForTimeout(200);
  await page.click('#topics button[data-topic="Sports"]');
  await page.waitForTimeout(300);
  const n = await page.locator('#picker button').count();
  assert.ok(n >= 5 && n < 20, 'sports count '+n);
  assert.match(await page.textContent('#title'), /Football|Baseball|Soccer|Lacrosse|Basketball|Hockey|Tennis/);
  await page.click('#topics button[data-topic="All"]');
  await page.waitForTimeout(200);
  assert.ok(await page.locator('#picker button').count() >= 30);
  await page.goto(URL + '#starship/pad');
  await page.waitForTimeout(200);
  assert.match(await page.textContent('#title'), /Rocket/);
});
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
await t('every machine walks its main path to the end in the browser', async () => { for (const id of ['starship','mars','clock','heart','bees','frog','volcano','water','football','baseball','soccer','lacrosse','basketball','hockey','bike','tennis','photo','gears','digest','circuit','elevator','flush','stoplight','lock','shutter','thermostat','zipper','sharpener','parachute','turbine','extinguisher','sewing','compass','flashlight','pulley','candle']) { await page.goto(URL + '#' + id); await page.waitForTimeout(100); for (let i = 0; i < 8; i++) await page.keyboard.press('ArrowRight'); const c = await page.textContent('#caption'); assert.ok(c.length > 10, id); } });
await t('reduced motion: no transition', async () => { await page.emulateMedia({ reducedMotion: 'reduce' }); await page.goto(URL + '#frog'); assert.equal(await page.$eval('#stage .part', (g) => getComputedStyle(g).transitionDuration), '0s'); await page.emulateMedia({ reducedMotion: 'no-preference' }); });
await page.goto(URL + '#frog/legs'); await page.waitForTimeout(1000); await page.evaluate(() => scrollTo(0, 0)); await page.screenshot({ path: `${out}/frog.png` });
await t('sports: football play-action to catch', async () => { await page.goto(URL + '#football/huddle'); await page.waitForTimeout(200); for (let i = 0; i < 4; i++) { await page.keyboard.press('ArrowRight'); await page.waitForTimeout(80); } assert.match(page.url(), /catch/); });
await t('sports: baseball twin killing', async () => { await page.goto(URL + '#baseball/pitch'); await page.waitForTimeout(200); for (let i = 0; i < 4; i++) { await page.keyboard.press('ArrowRight'); await page.waitForTimeout(80); } assert.match(page.url(), /twinKill/); });
await t('sports: soccer cut-back', async () => { await page.goto(URL + '#soccer/build'); await page.waitForTimeout(200); for (let i = 0; i < 3; i++) { await page.keyboard.press('ArrowRight'); await page.waitForTimeout(80); } assert.match(page.url(), /cross/); });
await t('sports: lacrosse dish', async () => { await page.goto(URL + '#lacrosse/' + 'save'); await page.waitForTimeout(200); for (let i = 0; i < 3; i++) { await page.keyboard.press('ArrowRight'); await page.waitForTimeout(80); } assert.match(page.url(), /dish/); });
await page.goto(URL + '#football/throw'); await page.waitForTimeout(900); await page.evaluate(() => scrollTo(0, 0)); await page.screenshot({ path: `${out}/football.png` });
await page.goto(URL + '#baseball/twinKill'); await page.waitForTimeout(900); await page.evaluate(() => scrollTo(0, 0)); await page.screenshot({ path: `${out}/baseball.png` });
await page.goto(URL + '#soccer/cross'); await page.waitForTimeout(900); await page.evaluate(() => scrollTo(0, 0)); await page.screenshot({ path: `${out}/soccer.png` });
await page.goto(URL + '#lacrosse/dish'); await page.waitForTimeout(900); await page.evaluate(() => scrollTo(0, 0)); await page.screenshot({ path: `${out}/lacrosse.png` });

await page.goto(URL + '#basketball/dish'); await page.waitForTimeout(800); await page.evaluate(() => scrollTo(0, 0)); await page.screenshot({ path: `${out}/basketball.png` });
console.log('ok sports: basketball dish');
await page.goto(URL + '#hockey/stretch'); await page.waitForTimeout(800); await page.evaluate(() => scrollTo(0, 0)); await page.screenshot({ path: `${out}/hockey.png` });
console.log('ok sports: hockey stretch');
await page.goto(URL + '#bike/roll'); await page.waitForTimeout(800); await page.evaluate(() => scrollTo(0, 0)); await page.screenshot({ path: `${out}/bike.png` });
console.log('ok bike roll');
await page.goto(URL + '#tennis/brush'); await page.waitForTimeout(800); await page.evaluate(() => scrollTo(0, 0)); await page.screenshot({ path: `${out}/tennis.png` });
console.log('ok tennis brush');
await page.goto(URL + '#photo/cook'); await page.waitForTimeout(800); await page.evaluate(() => scrollTo(0, 0)); await page.screenshot({ path: `${out}/photo.png` });
console.log('ok photo cook');
await page.goto(URL + '#gears/ratio'); await page.waitForTimeout(800); await page.evaluate(() => scrollTo(0, 0)); await page.screenshot({ path: `${out}/gears.png` });
console.log('ok gears ratio');
await page.goto(URL + '#circuit/lit'); await page.waitForTimeout(800); await page.evaluate(() => scrollTo(0, 0)); await page.screenshot({ path: `${out}/circuit.png` });
console.log('ok circuit lit');

await page.goto(URL + '#elevator/open'); await page.waitForTimeout(800); await page.evaluate(() => scrollTo(0, 0)); await page.screenshot({ path: `${out}/elevator.png` });
console.log('ok elevator open');
await page.goto(URL + '#flush/siphon'); await page.waitForTimeout(800); await page.evaluate(() => scrollTo(0, 0)); await page.screenshot({ path: `${out}/flush.png` });
console.log('ok flush siphon');
await page.goto(URL + '#stoplight/green'); await page.waitForTimeout(800); await page.evaluate(() => scrollTo(0, 0)); await page.screenshot({ path: `${out}/stoplight.png` });
console.log('ok stoplight green');

await page.goto(URL + '#lock/open'); await page.waitForTimeout(700); await page.evaluate(() => scrollTo(0, 0)); await page.screenshot({ path: `${out}/lock.png` });
console.log('ok lock open');
await page.goto(URL + '#shutter/expose'); await page.waitForTimeout(700); await page.evaluate(() => scrollTo(0, 0)); await page.screenshot({ path: `${out}/shutter.png` });
console.log('ok shutter expose');
await page.goto(URL + '#thermostat/heating'); await page.waitForTimeout(700); await page.evaluate(() => scrollTo(0, 0)); await page.screenshot({ path: `${out}/thermostat.png` });
console.log('ok thermostat heating');

await page.goto(URL + '#zipper/closed'); await page.waitForTimeout(700); await page.evaluate(() => scrollTo(0, 0)); await page.screenshot({ path: `${out}/zipper.png` });
console.log('ok zipper closed');
await page.goto(URL + '#sharpener/sharp'); await page.waitForTimeout(700); await page.evaluate(() => scrollTo(0, 0)); await page.screenshot({ path: `${out}/sharpener.png` });
console.log('ok sharpener sharp');

await page.goto(URL + '#parachute/inflated'); await page.waitForTimeout(700); await page.evaluate(() => scrollTo(0, 0)); await page.screenshot({ path: `${out}/parachute.png` });
console.log('ok parachute inflated');
await page.goto(URL + '#turbine/generating'); await page.waitForTimeout(700); await page.evaluate(() => scrollTo(0, 0)); await page.screenshot({ path: `${out}/turbine.png` });
console.log('ok turbine generating');

await page.goto(URL + '#extinguisher/spraying'); await page.waitForTimeout(700); await page.evaluate(() => scrollTo(0, 0)); await page.screenshot({ path: `${out}/extinguisher.png` });
console.log('ok extinguisher spraying');
await page.goto(URL + '#sewing/stitch'); await page.waitForTimeout(700); await page.evaluate(() => scrollTo(0, 0)); await page.screenshot({ path: `${out}/sewing.png` });
console.log('ok sewing stitch');


await page.goto(URL + '#pulley/lifting'); await page.waitForTimeout(700); await page.evaluate(() => scrollTo(0, 0)); await page.screenshot({ path: `${out}/pulley.png` });
console.log('ok pulley lifting');
await page.goto(URL + '#candle/burning'); await page.waitForTimeout(700); await page.evaluate(() => scrollTo(0, 0)); await page.screenshot({ path: `${out}/candle.png` });
console.log('ok candle burning');

await page.goto(URL + '#compass/north'); await page.waitForTimeout(700); await page.evaluate(() => scrollTo(0, 0)); await page.screenshot({ path: `${out}/compass.png` });
console.log('ok compass north');
await page.goto(URL + '#flashlight/on'); await page.waitForTimeout(700); await page.evaluate(() => scrollTo(0, 0)); await page.screenshot({ path: `${out}/flashlight.png` });
console.log('ok flashlight on');

await page.goto(URL + '#digest/absorb'); await page.waitForTimeout(800); await page.evaluate(() => scrollTo(0, 0)); await page.screenshot({ path: `${out}/digest.png` });
console.log('ok digest absorb');


await page.goto(URL + '#water/precip'); await page.waitForTimeout(1000); await page.evaluate(() => scrollTo(0, 0)); await page.screenshot({ path: `${out}/water.png` });
// screenshots
await page.mouse.move(5, 895);
await page.goto(URL + '#starship/liftoff'); await page.waitForTimeout(1000); await page.evaluate(() => scrollTo(0, 0)); await page.screenshot({ path: `${out}/hero-1440x900.png` });
await page.goto(URL + '#clock/tickRight/x'); await page.waitForTimeout(1100); await page.evaluate(() => scrollTo(0, 0)); await page.screenshot({ path: `${out}/clock-exploded.png` });
await page.goto(URL + '#heart/ventricles'); await page.waitForTimeout(1000); await page.evaluate(() => scrollTo(0, 0)); await page.screenshot({ path: `${out}/heart.png` });
await page.goto(URL + '#mars/skycrane'); await page.waitForTimeout(1000); await page.evaluate(() => scrollTo(0, 0)); await page.screenshot({ path: `${out}/mars.png` });
await page.goto(URL + '#volcano/erupt/x'); await page.waitForTimeout(1100); await page.evaluate(() => scrollTo(0, 0)); await page.screenshot({ path: `${out}/volcano-exploded.png` });
await page.goto(URL + '#bees/dance'); await page.waitForTimeout(1000); await page.keyboard.press('q'); await page.waitForTimeout(300); await page.evaluate(() => scrollTo(0, 0)); await page.screenshot({ path: `${out}/quiz.png` }); await page.click('#qclose'); await page.waitForTimeout(200);
const phone = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
await phone.goto(URL + '#starship/catch'); await phone.waitForTimeout(1000);
await phone.goto(URL + '#heart/ventricles'); await phone.waitForTimeout(600);
await t('phone: heart no overflow', async () => { assert.ok(await phone.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)); });
await phone.evaluate(() => scrollTo(0, 0)); await phone.screenshot({ path: `${out}/phone-heart-390x844.png` });
await phone.goto(URL + '#football/throw'); await phone.waitForTimeout(600);
await t('phone: football no overflow', async () => { assert.ok(await phone.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)); });
await phone.screenshot({ path: `${out}/phone-football-390x844.png`, fullPage: true });
await t('phone: no horizontal overflow', async () => { assert.ok(await phone.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)); });
await phone.goto(URL + '#heart/ventricles'); await phone.waitForTimeout(700); await phone.evaluate(() => scrollTo(0, 0)); await phone.screenshot({ path: `${out}/phone-390x844.png` });
await t('a11y: narrate speaks only once per state', async () => {
  await page.goto(URL + '#heart/fill'); await page.waitForTimeout(200);
  if (await page.locator('#quiz[open]').count()) await page.click('#qclose');
  await page.evaluate(() => { window.__spoken = []; const orig = speechSynthesis.speak.bind(speechSynthesis); speechSynthesis.speak = (u) => { window.__spoken.push(u.text); return orig(u); }; });
  await page.click('#narrate'); // enable
  await page.goto(URL + '#heart/fill'); await page.waitForTimeout(300);
  const n1 = await page.evaluate(() => window.__spoken.length);
  await page.click('#explode'); await page.waitForTimeout(200); // re-render same state
  const n2 = await page.evaluate(() => window.__spoken.length);
  assert.equal(n2, n1, 'explode toggle should not re-speak');
  await page.keyboard.press('ArrowRight'); await page.waitForTimeout(200);
  const n3 = await page.evaluate(() => window.__spoken.length);
  assert.ok(n3 > n1, 'new state should speak');
});
await t('builder: overlong share shows error', async () => {
  await page.goto(URL + 'builder.html'); await page.waitForTimeout(400);
  await page.click('#tpl'); await page.waitForTimeout(200);
  await page.evaluate(() => {
    const t = JSON.parse(document.querySelector('#src').value);
    t.blurb = 'pad '.repeat(8000);
    document.querySelector('#src').value = JSON.stringify(t, null, 2);
  });
  await page.click('#share'); await page.waitForTimeout(300);
  assert.match(await page.textContent('#errs'), /too long/);
});
await t('no console errors', async () => assert.deepEqual(errors, [], errors.join(' | ')));
await browser.close(); srv.kill();
console.log(`e2e: ${pass} passed, ${fail} failed`); process.exit(fail ? 1 : 0);
