import { mainPath, step, events } from './engine.js';
// Deterministic seeded RNG so quizzes are reproducible in tests.
export function rng(seed) { let s = seed >>> 0 || 1; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32); }
export function shuffle(arr, r) { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
// Question kinds: "next" (what happens after X?), "part" (which part does ...?)
// Prompts are de-duplicated; if the machine is tiny we return fewer than n (but at least min(3, available)).
export function makeQuiz(m, seed = 1, n = 5) {
  const r = rng(seed), path = mainPath(m), qs = [];
  const labels = Object.fromEntries(Object.entries(m.states).map(([k, s]) => [k, s.label]));
  for (let i = 0; i < path.length - 1; i++) {
    const cur = path[i], nxt = step(m, cur, events(m, cur)[0]);
    const wrong = shuffle(Object.keys(m.states).filter((k) => k !== nxt && k !== cur), r).slice(0, 3);
    while (wrong.length < 3) wrong.push(cur); // tiny machines: pad with current label as decoy
    const choices = shuffle([nxt, ...wrong.slice(0, 3)], r);
    qs.push({ kind: 'next', prompt: `After "${labels[cur]}", what happens next?`, choices: choices.map((c) => labels[c]), answer: choices.indexOf(nxt) });
  }
  for (const p of m.parts.filter((p) => p.job)) {
    const wrong = shuffle(m.parts.filter((x) => x.id !== p.id), r).slice(0, 3);
    if (wrong.length < 3) continue; // need 3 decoys
    const choices = shuffle([p, ...wrong], r);
    qs.push({ kind: 'part', prompt: `Which part ${p.job}?`, choices: choices.map((c) => c.label), answer: choices.indexOf(p) });
  }
  const seen = new Set(), unique = [];
  for (const q of shuffle(qs, r)) {
    if (seen.has(q.prompt)) continue;
    seen.add(q.prompt);
    unique.push(q);
  }
  return unique.slice(0, n);
}
export function grade(quiz, picks) {
  const correct = quiz.filter((q, i) => picks[i] === q.answer).length;
  const stars = correct === quiz.length ? 3 : correct >= Math.ceil(quiz.length * 0.6) ? 2 : correct > 0 ? 1 : 0;
  return { correct, total: quiz.length, stars };
}
