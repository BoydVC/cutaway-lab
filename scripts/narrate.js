#!/usr/bin/env node
// Narrated MP4 export: walk each machine's main path, capture frames, TTS captions with Piper, mux with ffmpeg + soft/burned captions.
// Usage: node scripts/narrate.js [--only id] [--out dir]
// Env: PIPER_BIN, PIPER_MODEL, PORT
import { chromium } from 'playwright';
import { spawn, execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { machines } from '../machines/index.js';
import { mainPath, events, step, isFinal } from '../src/engine.js';

const args = process.argv.slice(2);
const only = args.includes('--only') ? args[args.indexOf('--only') + 1] : null;
const OUT = args.includes('--out') ? args[args.indexOf('--out') + 1] : 'narrations';
const PORT = process.env.PORT || '4420';
const PIPER = process.env.PIPER_BIN || '/workspace/tokenmax/project-nov5/tts/piper/piper';
const MODEL = process.env.PIPER_MODEL || '/workspace/tokenmax/project-nov5/tts/en_US-lessac-medium.onnx';
const HOLD = 1.6; // seconds of silence after each caption so kids can look
const MIN_DUR = 30;

fs.mkdirSync(OUT, { recursive: true });
if (!fs.existsSync(PIPER)) { console.error('piper not found at', PIPER); process.exit(1); }
if (!fs.existsSync(MODEL)) { console.error('model not found at', MODEL); process.exit(1); }

const srv = spawn('node', ['scripts/serve.js'], { env: { ...process.env, PORT: String(PORT) }, stdio: 'pipe' });
await new Promise((r) => srv.stdout.once('data', r));
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });

function tts(text, wav) {
  execSync(`echo ${JSON.stringify(text)} | ${PIPER} -m ${MODEL} -f ${wav}`, { stdio: ['pipe', 'pipe', 'pipe'] });
}
function wavDur(wav) {
  const out = execSync(`ffprobe -v error -show_entries format=duration -of csv=p=0 ${wav}`, { encoding: 'utf8' }).trim();
  return parseFloat(out);
}
function padWav(src, dest, totalSec) {
  // Pad (or trim) to totalSec with silence so frame hold matches audio
  execSync(`ffmpeg -y -loglevel error -i ${src} -af "apad=whole_dur=${totalSec}" -t ${totalSec} ${dest}`);
}

const targets = machines.filter((m) => !only || m.id === only);
// merge by id: preserve prior rows when --only regenerates a subset (R3-2)
const reportPath = path.join(OUT, 'report.json');
const prior = fs.existsSync(reportPath) ? JSON.parse(fs.readFileSync(reportPath, 'utf8')) : [];
const report = [];

for (const m of targets) {
  const dir = path.join(OUT, m.id);
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });

  // Build the walk: intro + main path states (one loop max for cyclic machines like heart/clock)
  const pathIds = mainPath(m);
  const walk = pathIds.slice(); // already stops before re-entering cycle
  // For looping machines (heart/clock), include one full cycle by walking first-event until we would repeat
  if (!isFinal(m, walk.at(-1))) {
    // mainPath already broke on cycle; walk is the cycle prefix — good
  }

  const segments = [];
  // Intro
  const introText = `${m.title}. ${m.blurb}`;
  segments.push({ state: null, text: introText, hash: m.id });

  let state = m.initial;
  for (const s of walk) {
    state = s;
    segments.push({ state: s, text: m.states[s].caption, hash: `${m.id}/${s}` });
  }
  segments.push({
    state,
    text: `That is how ${m.title.replace(/^[^:]+:\s*/, '')} works. Press Q to try the quiz, or play it again.`,
    hash: `${m.id}/${state}`,
  });

  const listPath = path.join(dir, 'concat.txt');
  const srtPath = path.join(dir, 'captions.srt');
  let srt = '';
  let t = 0;
  const concatLines = [];

  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    await page.goto(`http://127.0.0.1:${PORT}/#${seg.hash}`);
    await page.waitForTimeout(700);
    await page.evaluate(() => scrollTo(0, 0));
    const png = path.join(dir, `f${String(i).padStart(2, '0')}.png`);
    const wav = path.join(dir, `a${String(i).padStart(2, '0')}.wav`);
    const wavPad = path.join(dir, `p${String(i).padStart(2, '0')}.wav`);
    const mp4 = path.join(dir, `s${String(i).padStart(2, '0')}.mp4`);
    await page.screenshot({ path: png });
    tts(seg.text, wav);
    const speech = wavDur(wav);
    const total = Math.max(speech + HOLD, 2.5);
    padWav(wav, wavPad, total.toFixed(3));
    // Still image + audio → short clip
    execSync(`ffmpeg -y -loglevel error -loop 1 -i ${png} -i ${wavPad} -c:v libx264 -tune stillimage -pix_fmt yuv420p -c:a aac -b:a 128k -shortest -t ${total.toFixed(3)} ${mp4}`);
    concatLines.push(`file '${path.resolve(mp4)}'`);

    const start = t;
    const end = t + total;
    const ts = (x) => {
      const h = Math.floor(x / 3600), m = Math.floor((x % 3600) / 60), s = Math.floor(x % 60), ms = Math.floor((x % 1) * 1000);
      return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')},${String(ms).padStart(3,'0')}`;
    };
    srt += `${i + 1}\n${ts(start)} --> ${ts(end)}\n${seg.text}\n\n`;
    t = end;
    console.log(`  ${m.id} [${i + 1}/${segments.length}] ${total.toFixed(1)}s — ${seg.text.slice(0, 60)}`);
  }

  fs.writeFileSync(listPath, concatLines.join('\n'));
  fs.writeFileSync(srtPath, srt);
  const outMp4 = path.join(OUT, `${m.id}.mp4`);
  const outWithSubs = path.join(OUT, `${m.id}-captions.mp4`);
  execSync(`ffmpeg -y -loglevel error -f concat -safe 0 -i ${listPath} -c copy ${outMp4}`);
  // Burn captions for kid-friendly playback; also keep soft-sub version via mov_text
  execSync(`ffmpeg -y -loglevel error -i ${outMp4} -vf "subtitles=${srtPath}:force_style='Fontsize=22,PrimaryColour=&H00FFFF&,Outline=2'" -c:a copy ${outWithSubs}`);

  const probe = execSync(`ffprobe -v error -show_entries stream=codec_type,codec_name,duration -show_entries format=duration -of json ${outWithSubs}`, { encoding: 'utf8' });
  const info = JSON.parse(probe);
  const fmtDur = parseFloat(info.format.duration);
  const hasAudio = info.streams.some((s) => s.codec_type === 'audio');
  const hasVideo = info.streams.some((s) => s.codec_type === 'video');
  let finalFile = outWithSubs;
  if (fmtDur < MIN_DUR) {
    const pad = (MIN_DUR - fmtDur + 0.5).toFixed(2);
    const padded = path.join(OUT, `${m.id}-captions.mp4`);
    // freeze last frame + soft pad by re-encoding with -t
    const tmpPad = path.join(dir, 'pad.mp4');
    execSync(`ffmpeg -y -loglevel error -i ${outWithSubs} -vf tpad=stop_mode=clone:stop_duration=${pad} -c:a aac -b:a 128k -af apad -t ${MIN_DUR} ${tmpPad}`);
    fs.renameSync(tmpPad, padded);
    finalFile = padded;
    const probe2 = execSync(`ffprobe -v error -show_entries stream=codec_type -show_entries format=duration -of json ${finalFile}`, { encoding: 'utf8' });
    const info2 = JSON.parse(probe2);
    info.format.duration = info2.format.duration;
    info.streams = info2.streams;
  }
  const fmtDur2 = parseFloat(info.format.duration);
  const hasAudio2 = info.streams.some((s) => s.codec_type === 'audio');
  const hasVideo2 = info.streams.some((s) => s.codec_type === 'video');
  const ok = hasAudio2 && hasVideo2 && fmtDur2 >= MIN_DUR - 0.5 && fmtDur2 <= 95;
  report.push({ id: m.id, duration: +fmtDur2.toFixed(2), hasAudio: hasAudio2, hasVideo: hasVideo2, ok, file: finalFile, segments: segments.length });
  console.log(`=> ${m.id}: ${fmtDur2.toFixed(1)}s audio=${hasAudio2} ok=${ok}`);
}

// merge by id
const byId = new Map(prior.map((r) => [r.id, r]));
for (const r of report) byId.set(r.id, r);
const merged = [...byId.values()].sort((a, b) => a.id.localeCompare(b.id));
fs.writeFileSync(reportPath, JSON.stringify(merged, null, 2));
// expose merged count in summary
report.length = 0; report.push(...merged);
await browser.close(); srv.kill();
const bad = report.filter((r) => !r.ok);
console.log(JSON.stringify({ total: report.length, ok: report.length - bad.length, bad }, null, 2));
process.exit(bad.length ? 1 : 0);
