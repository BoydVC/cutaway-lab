// Statechart engine: a machine is { id, title, initial, states: {name: {label, caption, on: {EVENT: target}, parts: {partId: {x,y,rot,scale,opacity,fill}}}}, parts: [...] }
export function validate(m) {
  const errs = [];
  if (!m || typeof m !== 'object') return ['machine must be an object'];
  for (const k of ['id', 'title', 'initial', 'states', 'parts']) if (!(k in m)) errs.push(`missing ${k}`);
  if (errs.length) return errs;
  const names = Object.keys(m.states);
  if (!names.includes(m.initial)) errs.push(`initial state "${m.initial}" not defined`);
  const partIds = new Set();
  for (const p of m.parts) {
    if (!p.id) errs.push('part without id');
    if (partIds.has(p.id)) errs.push(`duplicate part ${p.id}`);
    partIds.add(p.id);
    if (!p.label) errs.push(`part ${p.id} missing label`);
  }
  for (const [n, s] of Object.entries(m.states)) {
    if (!s.label) errs.push(`state ${n} missing label`);
    if (!s.caption) errs.push(`state ${n} missing caption`);
    for (const [ev, t] of Object.entries(s.on || {})) if (!names.includes(t)) errs.push(`state ${n} on ${ev} -> unknown "${t}"`);
    for (const pid of Object.keys(s.parts || {})) if (!partIds.has(pid)) errs.push(`state ${n} poses unknown part ${pid}`);
  }
  if (!errs.length) {
    const r = reachable(m);
    for (const n of names) if (!r.has(n)) errs.push(`state ${n} unreachable`);
    const finals = names.filter((n) => isFinal(m, n));
    if (!finals.length) errs.push('no final state');
    for (const n of names) if (!canReachFinal(m, n)) errs.push(`state ${n} can never finish (livelock)`);
  }
  return errs;
}
export const isFinal = (m, n) => Object.keys(m.states[n].on || {}).length === 0;
export function reachable(m, from = m.initial) {
  const seen = new Set([from]), q = [from];
  while (q.length) { const n = q.shift(); for (const t of Object.values(m.states[n].on || {})) if (!seen.has(t)) { seen.add(t); q.push(t); } }
  return seen;
}
export const canReachFinal = (m, n) => [...reachable(m, n)].some((x) => isFinal(m, x));
export function events(m, n) { return Object.keys(m.states[n].on || {}); }
export function step(m, n, ev) {
  const t = m.states[n]?.on?.[ev];
  if (!t) throw new Error(`no transition ${n} --${ev}-->`);
  return t;
}
// The "main path": from initial, always take the first event, until final. Detects cycles.
export function mainPath(m) {
  const path = [m.initial], seen = new Set(path);
  let n = m.initial;
  while (!isFinal(m, n)) {
    const ev = events(m, n)[0]; n = step(m, n, ev);
    if (seen.has(n)) break;
    seen.add(n); path.push(n);
  }
  return path;
}
// Pose for a part in a state: inherit from part defaults, overlay state pose; exploded adds offset.
export function pose(m, stateName, partId, exploded = false) {
  const part = m.parts.find((p) => p.id === partId);
  const base = { x: 0, y: 0, rot: 0, scale: 1, opacity: 1, ...(part.pose || {}) };
  const st = m.states[stateName].parts?.[partId] || {};
  const out = { ...base, ...st };
  if (exploded && part.explode) { out.x += part.explode[0]; out.y += part.explode[1]; }
  return out;
}
export function transformOf(p) { return `translate(${p.x} ${p.y}) rotate(${p.rot}) scale(${p.scale})`; }
export function toMermaid(m) {
  const lines = ['stateDiagram-v2', `  [*] --> ${m.initial}`];
  for (const [n, s] of Object.entries(m.states)) {
    for (const [ev, t] of Object.entries(s.on || {})) lines.push(`  ${n} --> ${t}: ${ev}`);
    if (isFinal(m, n)) lines.push(`  ${n} --> [*]`);
  }
  return lines.join('\n');
}
