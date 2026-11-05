import { validate, pose, events, step, toMermaid } from './engine.js';
import { parseMachine, encodeShare, decodeShare, TEMPLATE } from './custom.js';
const $ = (s) => document.querySelector(s); let m = null, state = null;
function run() {
  const r = parseMachine($('#src').value); $('#errs').innerHTML = r.errors.map((e) => `<li>${e}</li>`).join('');
  $('#ok').textContent = r.errors.length ? '' : '✔ This machine works: every step is reachable and it can always finish.';
  if (r.errors.length) return;
  m = r.machine; state = m.initial; $('#title').textContent = `${m.emoji || '⚙️'} ${m.title}`; $('#mermaid').textContent = toMermaid(m);
  $('#stage').innerHTML = m.parts.map((p) => `<g class="part" data-part="${p.id}">${p.svg || ''}</g>`).join(''); draw();
}
function draw() {
  for (const g of document.querySelectorAll('#stage .part')) { const p = pose(m, state, g.dataset.part); g.style.transform = `translate(${p.x}px,${p.y}px) rotate(${p.rot}deg) scale(${p.scale})`; g.style.opacity = p.opacity; }
  $('#caption').textContent = m.states[state].caption;
  const ev = events(m, state); $('#events').innerHTML = ev.length ? ev.map((e) => `<button data-ev="${e}">${e}</button>`).join('') : '<button id="again">⟲ again</button>';
  document.querySelectorAll('#events button[data-ev]').forEach((b) => (b.onclick = () => { state = step(m, state, b.dataset.ev); draw(); }));
  const a = $('#again'); if (a) a.onclick = () => { state = m.initial; draw(); };
}
$('#tpl').onclick = () => { $('#src').value = JSON.stringify(TEMPLATE, null, 2); run(); };
$('#share').onclick = async () => { try { const url = location.href.split('#')[0] + '#m=' + encodeShare($('#src').value); history.replaceState(null, '', url); try { await navigator.clipboard.writeText(url); } catch {} $('#ok').textContent = '🔗 Link is in the address bar.'; } catch (e) { $('#ok').textContent = ''; $('#errs').innerHTML = `<li>${e.message}</li>`; } };
$('#src').oninput = () => { clearTimeout(run.t); run.t = setTimeout(run, 250); };
const h = location.hash.match(/^#m=(.+)/); $('#src').value = h ? decodeShare(h[1]) : JSON.stringify(TEMPLATE, null, 2); run();
