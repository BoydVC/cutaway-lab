import { machines } from '../machines/index.js';
import { pose, events, step, mainPath, isFinal, toMermaid, validate } from './engine.js';
import { makeQuiz, grade } from './quiz.js';
import { layout } from './layout.js';
import { load, record, badge } from './progress.js';
const store = (() => { try { localStorage.setItem('_t', '1'); return localStorage; } catch { const m = new Map(); return { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => m.set(k, v) }; } })();
const $ = (s) => document.querySelector(s);
const S = { m: null, state: null, history: [], exploded: false, timer: null, hot: null, lastSpoken: null };
const NS = 'http://www.w3.org/2000/svg';
function pick(id, stateName) {
  const m = machines.find((x) => x.id === id) || machines[0];
  const errs = validate(m); if (errs.length) { $('#caption').textContent = 'Broken machine: ' + errs.join('; '); return; }
  S.m = m; S.state = m.states[stateName] ? stateName : m.initial; S.history = []; stop();
  document.querySelectorAll('#picker button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.id === m.id)));
  document.querySelector(`#picker button[data-id="${m.id}"]`)?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
  $('#wslink').href = `worksheet.html#${m.id}`; $('#title').textContent = `${m.emoji} ${m.title}`; $('#blurb').textContent = m.blurb; $('#mermaid').textContent = toMermaid(m);
  const svg = $('#stage'); svg.innerHTML = '';
  for (const p of m.parts) {
    const g = document.createElementNS(NS, 'g'); g.classList.add('part'); if (p.origin === 'top' || p.id === 'pendulum') g.classList.add('origin-top');
    g.dataset.part = p.id; g.innerHTML = p.svg + `<title>${p.label}</title>`; svg.appendChild(g);
  }
  $('#parts').innerHTML = m.parts.filter((p) => !p.id.startsWith('lbl')).map((p) => `<li data-part="${p.id}"><b>${p.label}</b>${p.job ? ' ' + p.job : ''}</li>`).join('');
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
  $('#caption').textContent = st.caption; $('#stage').setAttribute('aria-label', `${m.title}: ${st.label}. ${st.caption}`); chart(); if (S.lastSpoken !== `${m.id}/${state}`) { S.lastSpoken = `${m.id}/${state}`; speak(st.caption); }
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
    const t = document.createElementNS(NS, 'text'); t.classList.add('lbl'); t.setAttribute('text-anchor', 'middle'); t.setAttribute('font-size', '12');
    t.setAttribute('x', Math.max(30, Math.min(370, b.x + b.width / 2 + p.x))); t.setAttribute('y', Math.max(12, Math.min(296, b.y + p.y - 4))); t.textContent = part.label; svg.appendChild(t);
  }
}
function chart() {
  const { m, state } = S, L = layout(m), svg = $('#chart'), W = 320;
  svg.setAttribute('viewBox', `0 0 ${W} ${L.height}`);
  const edges = L.edges.map((e) => { const A = L.nodes[e.from], B = L.nodes[e.to];
    const d = e.straight ? `M${A.x + 40} ${A.y + A.h} L${B.x + 40} ${B.y}` : `M${A.x + A.w} ${A.y + 11} C${A.x + A.w + 14 * e.lane + 10} ${A.y + 11} ${B.x + B.w + 14 * e.lane + 10} ${B.y + 11} ${B.x + B.w + 2} ${B.y + 11}`;
    const lx = e.straight ? A.x + 46 : A.x + A.w + 7 * e.lane + 8, ly = e.straight ? A.y + A.h + 7 : (A.y + B.y) / 2 + 14;
    return `<path class="${e.back ? 'back' : ''}" d="${d}"><title>${e.ev}</title></path><text class="ev" x="${lx}" y="${ly}" font-size="12">${nice(e.ev)}</text>`; }).join('');
  const nodes = Object.entries(L.nodes).map(([n, r]) => `<g class="node ${n === state ? 'on' : S.history.includes(n) ? 'done' : ''}" data-state="${n}" role="button" tabindex="${Object.values(m.states[state].on || {}).includes(n) ? 0 : -1}" aria-label="${m.states[n].label}${n === state ? ' (you are here)' : ''}"><rect x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}"/><text x="${r.x + 8}" y="${r.y + 18}" font-size="13">${m.states[n].label.slice(0, 32)}</text></g>`).join('');
  svg.innerHTML = '<defs><marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" fill="#64748b" stroke="none"/></marker></defs>' + edges + nodes;
  svg.querySelectorAll('g.node').forEach((g) => (g.onkeydown = (e) => { if (e.key === 'Enter') { e.stopPropagation(); g.onclick(); } }, g.onclick = () => { const ev = Object.entries(m.states[S.state].on || {}).find(([, t]) => t === g.dataset.state); if (ev) fire(ev[0]); }));
}
function speak(text) { if (!$('#narrate').checked || !window.speechSynthesis) return; speechSynthesis.cancel(); speechSynthesis.speak(new SpeechSynthesisUtterance(text)); }
function stars() {
  const s = load(store); $('#badge').textContent = badge(s, machines.length);
  document.querySelectorAll('#picker button').forEach((b) => { const n = s[b.dataset.id] || 0; b.querySelector('small')?.remove(); if (n) b.insertAdjacentHTML('beforeend', ` <small>${'★'.repeat(n)}</small>`); });
}
const nice = (e) => e.toLowerCase().replace(/_/g, ' ').replace(/^./, (c) => c.toUpperCase());
function fire(ev) { S.history.push(S.state); S.state = step(S.m, S.state, ev); render(); }
function back() { if (S.history.length) { S.state = S.history.pop(); render(); } }
function play() {
  if (S.timer) return stop();
  if (isFinal(S.m, S.state)) pick(S.m.id);
  $('#play').textContent = '⏸ Pause'; let n = 0;
  const slow = matchMedia('(prefers-reduced-motion: reduce)').matches;
  S.timer = setInterval(() => { const e = events(S.m, S.state); if (!e.length || n++ > 12) return stop(); fire(e[0]); }, slow ? 2600 : 1600);
}
function stop() { clearInterval(S.timer); S.timer = null; $('#play').textContent = '▶ Play (Space)'; }
function quiz() {
  const q = makeQuiz(S.m, Date.now() % 1000 + 1, 5), picks = []; let i = 0; const d = $('#quiz');
  const show = () => {
    if (i >= q.length) { const g = grade(q, picks); record(store, S.m.id, g.stars); stars(); $('#qprompt').textContent = `${'⭐'.repeat(g.stars) || '🙂'} ${g.correct} of ${g.total} right!`; $('#qchoices').innerHTML = ''; $('#qfeedback').textContent = g.stars === 3 ? 'Perfect. You could teach this!' : 'Press Play and watch again, then retry.'; return; }
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
let topicFilter = 'All';
function fillPicker() {
  const list = topicFilter === 'All' ? machines : machines.filter((m) => m.topic === topicFilter);
  $('#picker').innerHTML = list.map((m) => `<button data-id="${m.id}">${m.emoji} ${m.title}</button>`).join('');
  document.querySelectorAll('#picker button').forEach((b) => (b.onclick = () => pick(b.dataset.id)));
  if (S.m) document.querySelectorAll('#picker button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.id === S.m.id)));
  stars();
}
const topics = ['All', ...new Set(machines.map((m) => m.topic))];
$('#topics').innerHTML = topics.map((t) => `<button type="button" data-topic="${t}" aria-pressed="${t==='All'}">${t}</button>`).join('');
document.querySelectorAll('#topics button').forEach((b) => (b.onclick = () => {
  topicFilter = b.dataset.topic;
  document.querySelectorAll('#topics button').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
  fillPicker();
  const list = topicFilter === 'All' ? machines : machines.filter((m) => m.topic === topicFilter);
  if (list.length && (!S.m || !list.some((m) => m.id === S.m.id))) pick(list[0].id);
}));
fillPicker();
$('#back').onclick = back; $('#play').onclick = play; $('#reset').onclick = () => pick(S.m.id); $('#quizbtn').onclick = quiz;
$('#explode').onchange = (e) => { S.exploded = e.target.checked; render(); };
addEventListener('keydown', (e) => {
  if ($('#quiz').open) return;
  if (e.code === 'Space') { e.preventDefault(); play(); } else if (e.key === 'e') { $('#explode').click(); } else if (e.key === 'q') quiz(); else if (e.key === 'n') $('#narrate').click();
  else if (e.key === 'ArrowRight') { const ev = events(S.m, S.state); if (ev.length) fire(ev[0]); } else if (e.key === 'ArrowLeft') back();
});
function fromHash() {
  const [id, st, x] = location.hash.slice(1).split('/');
  S.exploded = x === 'x'; $('#explode').checked = S.exploded;
  pick(id, st);
}
addEventListener('hashchange', fromHash); fromHash(); stars();
window.__cutaway = S;
