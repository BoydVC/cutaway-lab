import { mainPath } from './engine.js';
// Live statechart layout: one column in BFS order; next-row edges go straight down,
// skips and loops arc on the right, nested by span so they do not overlap.
export function layout(m, w = 300, rowH = 30) {
  const depth = { [m.initial]: 0 }, q = [m.initial];
  while (q.length) { const n = q.shift(); for (const t of Object.values(m.states[n].on || {})) if (!(t in depth)) { depth[t] = depth[n] + 1; q.push(t); } }
  const main = mainPath(m), order = [...main, ...Object.keys(m.states).filter((k) => !main.includes(k)).sort((a, b) => depth[a] - depth[b])];
  const row = Object.fromEntries(order.map((n, i) => [n, i]));
  const nodes = {}; order.forEach((n, i) => { nodes[n] = { x: 8, y: 8 + i * rowH, w: 190, h: 22 }; });
  const edges = [];
  for (const [n, s] of Object.entries(m.states)) for (const [ev, t] of Object.entries(s.on || {})) {
    const span = row[t] - row[n];
    edges.push({ from: n, to: t, ev, back: span <= 0, straight: span === 1, lane: Math.abs(span) });
  }
  return { nodes, edges, height: 16 + order.length * rowH, depth, row };
}
