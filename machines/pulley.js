export default {
  id: 'pulley', title: 'Pulley', emoji: '⛓️', topic: 'Machines',
  blurb: 'How a wheel and rope trade force for distance — lift a heavy load with less effort.',
  initial: 'ready',
  parts: [
    { id: 'frame', label: 'Frame',
      svg: '<rect x="160" y="40" width="80" height="16" rx="3" fill="#475569"/><rect x="192" y="56" width="16" height="40" fill="#64748b"/>' },
    { id: 'wheel', label: 'Wheel', job: 'turns so the rope can change direction',
      svg: '<circle cx="200" cy="120" r="36" fill="#1e293b" stroke="#94a3b8" stroke-width="4"/><circle cx="200" cy="120" r="10" fill="#fbbf24"/>', explode: [50, 0] },
    { id: 'rope', label: 'Rope', job: 'carries the tension from your pull to the load',
      svg: '<path d="M200 156 V220 M164 120 H100 V200" fill="none" stroke="#e2e8f0" stroke-width="4"/>', explode: [-40, 20] },
    { id: 'load', label: 'Load', job: 'the weight you want to lift',
      svg: '<rect x="170" y="220" width="60" height="40" rx="4" fill="#334155" stroke="#f97316" stroke-width="2"/><text x="200" y="245" text-anchor="middle" fill="#fdba74" font-size="12" font-weight="700">50kg</text>', explode: [0, 40] },
    { id: 'hand', label: 'Pull',
      svg: '<circle cx="100" cy="210" r="14" fill="#f472b6"/>', pose: { opacity: 0.85 } },
  ],
  states: {
    ready: {
      label: 'Ready',
      caption: 'Load hangs. Rope over the wheel. Pull down on the free end to lift.',
      on: { PULL: 'lifting' },
    },
    lifting: {
      label: 'Lifting',
      caption: 'You pull down. The wheel turns. The load rises the same distance you pull.',
      on: { PULL: 'high', SLIP: 'slip' },
      parts: { load: { y: -40 }, hand: { y: 40 }, rope: { y: -10 } },
    },
    high: {
      label: 'Held high',
      caption: 'Load is up. Hold the rope or tie it off so the weight does not fall.',
      on: {},
      parts: { load: { y: -80 }, hand: { y: 80 } },
    },
    slip: {
      label: 'Rope slipped',
      caption: 'You let go. Friction was not enough. The load drops back down. Grip tighter next time!',
      on: {},
      parts: { load: { y: 10 }, hand: { opacity: 0.3 } },
    },
  },
};
