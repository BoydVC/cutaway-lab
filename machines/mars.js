export default {
  id: 'mars', title: 'Mars Rover Sky-Crane Landing', emoji: '🔴', topic: 'Space',
  blurb: 'How a car-sized rover goes from 12,000 mph to a gentle touchdown on Mars in about seven minutes.',
  initial: 'entry',
  parts: [
    { id: 'ground', label: 'Mars surface', svg: '<path d="M-300 266 Q-100 258 0 270 Q100 255 200 268 T400 262 Q550 270 700 262 V300 H-300Z" fill="#b45309"/>' },
    { id: 'shield', label: 'Heat shield', job: 'protects the rover from fiery heat', svg: '<path d="M165 60 Q200 85 235 60 Z" fill="#78350f"/>', explode: [-60, -10] },
    { id: 'shell', label: 'Back shell', job: 'holds the parachute', svg: '<path d="M170 60 L185 30 H215 L230 60Z" fill="#e5e7eb"/>', explode: [60, -10] },
    { id: 'chute', label: 'Parachute', job: 'slows the lander in the thin air', svg: '<path d="M140 20 Q200 -40 260 20 Z" fill="#f8fafc" stroke="#ef4444" stroke-width="3"/><path d="M140 20 L190 30 M260 20 L210 30" stroke="#ddd"/>', pose: { opacity: 0 } },
    { id: 'crane', label: 'Sky crane', job: 'hovers on rockets and lowers the rover on cables', svg: '<rect x="178" y="70" width="44" height="14" rx="3" fill="#94a3b8"/><path d="M178 84 l-6 10 M222 84 l6 10" stroke="#f97316" stroke-width="3"/>', pose: { opacity: 0 }, explode: [70, -30] },
    { id: 'cables', label: 'Cables', svg: '<path d="M186 84 V170 M214 84 V170" stroke="#e2e8f0" stroke-width="1.5"/>', pose: { opacity: 0 } },
    { id: 'rover', label: 'Rover', job: 'drives around doing science', svg: '<rect x="182" y="90" width="36" height="14" rx="2" fill="#f1f5f9"/><circle cx="186" cy="108" r="4" fill="#334155"/><circle cx="200" cy="108" r="4" fill="#334155"/><circle cx="214" cy="108" r="4" fill="#334155"/><rect x="208" y="80" width="3" height="10" fill="#cbd5e1"/>', explode: [-70, 30] },
  ],
  states: {
    entry: { label: 'Hit the atmosphere', caption: 'The capsule slams into the air at 12,000 mph. The heat shield glows hot.', on: { SLOW: 'parachute' } },
    parachute: { label: 'Parachute opens', caption: 'A huge parachute pops open and the heat shield drops away.', on: { CUT_LOOSE: 'powered' }, parts: { chute: { opacity: 1, y: 20 }, shield: { y: 200, opacity: 0 }, shell: { y: 20 }, rover: { y: 20 } } },
    powered: { label: 'Rocket descent', caption: 'The sky crane drops free and fires its rockets to slow down even more.', on: { HOVER: 'skycrane', ABORT_TO_SAFE: 'divert' }, parts: { chute: { opacity: 0, y: -60 }, shell: { y: -80, x: 120, opacity: 0 }, shield: { opacity: 0 }, crane: { opacity: 1, y: 70 }, rover: { y: 80 } } },
    skycrane: { label: 'Sky crane lowers rover', caption: 'Hovering, the crane lowers the rover on cables, wheels down.', on: { TOUCHDOWN: 'landed' }, parts: { shield: { opacity: 0 }, shell: { opacity: 0 }, crane: { opacity: 1, y: 70 }, cables: { opacity: 1, y: 70 }, rover: { y: 150 } } },
    landed: { label: 'Touchdown!', caption: 'Wheels touch, cables cut, and the crane flies away. The rover is on Mars!', on: {}, parts: { shield: { opacity: 0 }, shell: { opacity: 0 }, crane: { opacity: 0, y: -40, x: 150 }, rover: { y: 155 } } },
    divert: { label: 'Pick a safer spot', caption: 'The lander sees big rocks and steers to a flatter spot before landing.', on: { HOVER: 'skycrane' }, parts: { shield: { opacity: 0 }, shell: { opacity: 0 }, crane: { opacity: 1, y: 70, x: -40 }, rover: { y: 80, x: -40 } } },
  },
};
