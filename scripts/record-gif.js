// Records screenshots/demo.gif: autoplay rocket, exploded clock, quiz. Needs ffmpeg.
import { chromium } from 'playwright'; import { spawn, execSync } from 'node:child_process'; import fs from 'node:fs';
const PORT = 4412, URL = `http://127.0.0.1:${PORT}/`;
const srv = spawn('node', ['scripts/serve.js'], { env: { ...process.env, PORT: String(PORT) } }); await new Promise((r) => srv.stdout.once('data', r));
fs.rmSync('.shots/video', { recursive: true, force: true });
const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 1280, height: 800 }, recordVideo: { dir: '.shots/video', size: { width: 1280, height: 800 } } });
const p = await ctx.newPage(); await p.goto(URL + '#starship'); await p.waitForTimeout(800);
await p.keyboard.press('Space'); await p.waitForTimeout(9000);
await p.click('#topics button[data-topic="Sports"]'); await p.waitForTimeout(500);
await p.click('#picker button >> nth=0'); await p.waitForTimeout(800);
for (let i = 0; i < 2; i++) { await p.keyboard.press('ArrowRight'); await p.waitForTimeout(900); }
await p.click('#topics button[data-topic="All"]'); await p.waitForTimeout(400);
await p.click('#picker button >> nth=1'); await p.waitForTimeout(600); await p.keyboard.press('e'); await p.waitForTimeout(1500);
for (let i = 0; i < 3; i++) { await p.keyboard.press('ArrowRight'); await p.waitForTimeout(1000); }
await p.click('#picker button >> nth=3'); await p.waitForTimeout(600); await p.keyboard.press('q'); await p.waitForTimeout(1200);
for (let i = 0; i < 3; i++) { await p.click('#qchoices button >> nth=0'); await p.waitForTimeout(1300); }
await ctx.close(); await b.close(); srv.kill();
const v = fs.readdirSync('.shots/video')[0];
execSync(`ffmpeg -y -loglevel error -i .shots/video/${v} -vf "fps=10,scale=900:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=96[p];[b][p]paletteuse=dither=bayer" screenshots/demo.gif`);
execSync(`ffmpeg -y -loglevel error -i .shots/video/${v} -c:v libx264 -pix_fmt yuv420p .shots/demo.mp4`);
console.log('wrote screenshots/demo.gif', (fs.statSync('screenshots/demo.gif').size / 1e6).toFixed(1), 'MB');
