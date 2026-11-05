export default {
  id: 'candle', title: 'Candle', emoji: '🕯️', topic: 'Machines',
  blurb: 'How a wick draws melted wax up to the flame — a tiny fuel pump made of capillary action.',
  initial: 'unlit',
  parts: [
    { id: 'wax', label: 'Wax', job: 'is the fuel that melts and climbs the wick',
      svg: '<rect x="170" y="140" width="60" height="120" rx="6" fill="#fef3c7" stroke="#f59e0b" stroke-width="2"/>', explode: [-40, 0] },
    { id: 'wick', label: 'Wick', job: 'soaks up liquid wax and feeds the flame',
      svg: '<rect x="197" y="110" width="6" height="40" fill="#44403c"/>', explode: [0, -35] },
    { id: 'flame', label: 'Flame', job: 'burns wax vapor to make light and heat',
      svg: '<ellipse cx="200" cy="95" rx="14" ry="22" fill="#fbbf24"/><ellipse cx="200" cy="100" rx="7" ry="12" fill="#fef9c3"/>', pose: { opacity: 0 } },
    { id: 'pool', label: 'Melt pool',
      svg: '<ellipse cx="200" cy="145" rx="22" ry="6" fill="#fcd34d" opacity=".85"/>', pose: { opacity: 0 } },
    { id: 'smoke', label: 'Smoke',
      svg: '<path d="M200 70 Q190 50 200 30 Q210 50 200 70" fill="none" stroke="#94a3b8" stroke-width="3"/>', pose: { opacity: 0 } },
  ],
  states: {
    unlit: {
      label: 'Unlit',
      caption: 'Cold wax. Dry wick. No flame yet. Bring a match.',
      on: { LIGHT: 'lighting' },
    },
    lighting: {
      label: 'Lighting',
      caption: 'Flame catches the wick. Heat melts a little wax. Capillary action starts.',
      on: { BURN: 'burning' },
      parts: { flame: { opacity: 0.7 }, pool: { opacity: 0.4 } },
    },
    burning: {
      label: 'Burning',
      caption: 'Melted wax climbs the wick. The flame vaporizes it. Steady light!',
      on: { SNUFF: 'out', DROWN: 'drown' },
      parts: { flame: { opacity: 1 }, pool: { opacity: 1 } },
    },
    out: {
      label: 'Snuffed',
      caption: 'You pinched or blew the flame out. Smoke curls up. Wick cools. Ready to light again later.',
      on: {},
      parts: { smoke: { opacity: 1 }, pool: { opacity: 0.3 } },
    },
    drown: {
      label: 'Drowned wick',
      caption: 'Too much melt pool. Wick soaked and drowned. Tip out wax or trim the wick.',
      on: {},
      parts: { flame: { opacity: 0 }, pool: { opacity: 1, scale: 1.4 }, wick: { opacity: 0.5 } },
    },
  },
};
