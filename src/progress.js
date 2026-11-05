// Stars per machine, kept in any Storage-like object (localStorage in the browser, a Map shim in tests).
const KEY = 'cutaway-lab:stars';
export function load(store) { try { return JSON.parse(store.getItem(KEY) || '{}'); } catch { return {}; } }
export function record(store, id, stars) { const s = load(store); if ((s[id] || 0) < stars) { s[id] = stars; store.setItem(KEY, JSON.stringify(s)); } return s; }
export function total(s) { return Object.values(s).reduce((a, b) => a + b, 0); }
export function badge(s, count) {
  const t = total(s), max = count * 3;
  if (t >= max) return '🏆 Master Engineer'; if (t >= max * 0.6) return '🔬 Lab Scientist'; if (t > 0) return '🧰 Apprentice'; return '';
}
