import { machines } from '../machines/index.js';
import { pose, events, step, mainPath, isFinal, toMermaid, validate } from './engine.js';
import { makeQuiz, grade } from './quiz.js';
const $ = (s) => document.querySelector(s);
const S = { m: null, state: null, history: [], exploded: false, timer: null, hot: null };
const NS = 'http://www.w3.org/2000/svg';
function pick(id, stateName) {
  const m = machines.find((x) => x.id === id) || machines[0];
  const errs = validate(m); if (errs.length) { $('#caption').textContent = 'Broken machine: ' + errs.join('; '); return; }
  S.m = m; S.state = m.states[stateName] ? stateName : m.initial; S.history = []; stop();
  document.querySelectorAll('#picker button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.id === m.id)));
  $('#title').textContent = `${m.emoji} ${m.title}`; $('#blurb').textContent = m.blurb; $('#mermaid').textContent = toMermaid(m);
  const svg = $('#stage'); svg.innerHTML = '';
  for (const p of m.parts) {
    const g = document.createElementNS(NS, 'g'); g.classList.add('part'); if (p.origin === 'top' || p.id === 'pendulum') g.classList.add('origin-top');
    g.dataset.part = p.id; g.innerHTML = p.svg + `<title>${p.label}</title>`; svg.appendChild(g);
  }
  $('#parts').innerHTML = m.parts.map((p) => `<li data-part="${p.id}"><b>${p.label}</b>${p.job ? ' ' + p.job : ''}</li>`).join('');
  document.querySelectorAll('#parts li').forEach((li) => { li.onmouseenter = () => hot(li.dataset.part); li.onmouseleave = () => hot(null); });
  render();
}
function hot(id) { S.hot = id; document.querySelectorAll('#stage .part').forEach((g) => g.classList.toggle('hot', g.dataset.part === id)); }
function render() {
  const { m, state } = S, st = m.states[state];
  for (const g of document.querySelectorAll('#stage .part')) {
    const p = pose(m, state, g.dataset.part, S.exploded);
    g.style.transform = `translate(${p.x}px,${p.y}px) rotate(${p.rot}deg) scale(${p.scale})`; g.style.opacity = p.opacity;
  }
  document.querySelectorAll('#stage text.lbl').forEach((t) => t.remove());
  if (S.exploded) setTimeout(labels, 820);
  $('#caption').textContent = st.caption;
  const path = mainPath(m), extra = Object.keys(m.states).filter((k) => !path.includes(k)), seen = new Set([...S.history, state]);
  $('#states').innerHTML = [...path, ...extra].map((k) => `<li data-state="${k}" class="${k === state ? 'on' : S.history.includes(k) ? 'done' : ''}">${m.states[k].label}${extra.includes(k) ? ' <small>(side path)</small>' : ''}</li>`).join('');
  const evs = events(m, state);
  $('#events').innerHTML = evs.length ? evs.map((e) => `<button data-ev="${e}">${nice(e)} → ${m.states[m.states[state].on[e]].label}</button>`).join('') : '<b>🏁 The end. Try Quiz me!</b>';
  document.querySelectorAll('#events button').forEach((b) => (b.onclick = () => fire(b.dataset.ev)));
  $('#back').disabled = !S.history.length; void seen;
  history.replaceState(null, '', `#${m.id}/${state}${S.exploded ? '/x' : ''}${location.search}`);
}
function labels() {
  const svg = $('#stage');
  for (const g of svg.querySelectorAll('.part')) {
    const part = S.m.parts.find((p) => p.id === g.dataset.part); if (!part.explode) continue;
    const b = g.getBBox(), p = pose(S.m, S.state, part.id, true);
    const t = document.createElementNS(NS, 'text'); t.classList.add('lbl'); t.setAttribute('text-anchor', 'middle');
    t.setAttribute('x', Math.max(30, Math.min(370, b.x + b.width / 2 + p.x))); t.setAttribute('y', Math.max(12, Math.min(296, b.y + p.y - 4))); t.textContent = part.label; svg.appendChild(t);
  }
}
const nice = (e) => e.toLowerCase().replace(/_/g, ' ').replace(/^./, (c) => c.toUpperCase());
function fire(ev) { S.history.push(S.state); S.state = step(S.m, S.state, ev); render(); }
function back() { if (S.history.length) { S.state = S.history.pop(); render(); } }
function play() {
  if (S.timer) return stop();
  if (isFinal(S.m, S.state)) pick(S.m.id);
  $('#play').textContent = '⏸ Pause'; let n = 0;
  S.timer = setInterval(() => { const e = events(S.m, S.state); if (!e.length || n++ > 12) return stop(); fire(e[0]); }, 1600);
}
function stop() { clearInterval(S.timer); S.timer = null; $('#play').textContent = '▶ Play (Space)'; }
function quiz() {
  const q = makeQuiz(S.m, Date.now() % 1000 + 1, 5), picks = []; let i = 0; const d = $('#quiz');
  const show = () => {
    if (i >= q.length) { const g = grade(q, picks); $('#qprompt').textContent = `${'⭐'.repeat(g.stars) || '🙂'} ${g.correct} of ${g.total} right!`; $('#qchoices').innerHTML = ''; $('#qfeedback').textContent = g.stars === 3 ? 'Perfect. You could teach this!' : 'Press Play and watch again, then retry.'; return; }
    $('#qprompt').textContent = `Q${i + 1}. ${q[i].prompt}`; $('#qfeedback').textContent = '';
    $('#qchoices').innerHTML = q[i].choices.map((c, j) => `<button type="button" data-j="${j}">${c}</button>`).join('');
    document.querySelectorAll('#qchoices button').forEach((b) => (b.onclick = () => {
      const j = +b.dataset.j; picks[i] = j; b.classList.add(j === q[i].answer ? 'right' : 'wrong');
      document.querySelectorAll('#qchoices button')[q[i].answer].classList.add('right');
      $('#qfeedback').textContent = j === q[i].answer ? '✅ Yes!' : '❌ Not quite.'; i++; setTimeout(show, 900);
    }));
  };
  show(); d.showModal();
}
$('#picker').innerHTML = machines.map((m) => `<button data-id="${m.id}">${m.emoji} ${m.title}</button>`).join('');
document.querySelectorAll('#picker button').forEach((b) => (b.onclick = () => pick(b.dataset.id)));
$('#back').onclick = back; $('#play').onclick = play; $('#reset').onclick = () => pick(S.m.id); $('#quizbtn').onclick = quiz;
$('#explode').onchange = (e) => { S.exploded = e.target.checked; render(); };
addEventListener('keydown', (e) => {
  if ($('#quiz').open) return;
  if (e.code === 'Space') { e.preventDefault(); play(); } else if (e.key === 'e') { $('#explode').click(); } else if (e.key === 'q') quiz();
  else if (e.key === 'ArrowRight') { const ev = events(S.m, S.state); if (ev.length) fire(ev[0]); } else if (e.key === 'ArrowLeft') back();
});
function fromHash() {
  const [id, st, x] = location.hash.slice(1).split('/');
  S.exploded = x === 'x'; $('#explode').checked = S.exploded;
  pick(id, st);
}
addEventListener('hashchange', fromHash); fromHash();
window.__cutaway = S;
