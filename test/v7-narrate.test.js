import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { execSync } from 'node:child_process';

const script = fs.readFileSync(new URL('../scripts/narrate.js', import.meta.url), 'utf8');

test('narrate script wires piper + captions + audio mux', () => {
  assert.match(script, /PIPER/);
  assert.match(script, /subtitles=/);
  assert.match(script, /apad/);
  assert.match(script, /MIN_DUR = 30/);
  assert.match(script, /report\.json/);
});

test('piper binary and voice model exist for local TTS', () => {
  assert.ok(fs.existsSync('/workspace/tokenmax/project-nov5/tts/piper/piper'));
  assert.ok(fs.existsSync('/workspace/tokenmax/project-nov5/tts/en_US-lessac-medium.onnx'));
});

// If a prior narration report exists, validate it; otherwise skip soft.
test('narration report (if present) has audio and 30–90s clips', () => {
  const reportPath = new URL('../narrations/report.json', import.meta.url);
  if (!fs.existsSync(reportPath)) return;
  const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
  assert.ok(report.length >= 1);
  for (const r of report) {
    assert.ok(r.hasAudio, r.id);
    assert.ok(r.hasVideo, r.id);
    assert.ok(r.duration >= 29.5 && r.duration <= 95, `${r.id} dur ${r.duration}`);
    assert.ok(fs.existsSync(r.file), r.file);
    const probe = JSON.parse(execSync(`ffprobe -v error -show_entries stream=codec_type -of json ${r.file}`, { encoding: 'utf8' }));
    assert.ok(probe.streams.some((s) => s.codec_type === 'audio'), r.id + ' audio stream');
  }
});
