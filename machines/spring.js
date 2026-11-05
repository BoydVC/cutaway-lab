export default {
  id: 'spring', title: 'Spring', emoji: '🌀', topic: 'Machines',
  blurb: 'How a coil stores energy when you squash it — and flings it back when you let go.',
  initial: 'rest',
  parts: [
    { id: 'coil', label: 'Coil', job: 'stores elastic potential energy when deformed',
      svg: '<path d="M160 80 Q200 100 160 120 Q200 140 160 160 Q200 180 160 200 Q200 220 160 240" fill="none" stroke="#94a3b8" stroke-width="6"/>', explode: [-30, 0] },
    { id: 'top', label: 'Top plate', job: 'is where you push to compress the spring',
      svg: '<rect x="140" y="60" width="80" height="12" rx="2" fill="#e2e8f0"/>', explode: [0, -30] },
    { id: 'base', label: 'Base', job: 'holds the other end still',
      svg: '<rect x="130" y="240" width="100" height="16" rx="3" fill="#475569"/>', explode: [0, 30] },
    { id: 'mass', label: 'Mass',
      svg: '<rect x="155" y="30" width="50" height="30" rx="4" fill="#f97316"/>', pose: { opacity: 0.9 } },
    { id: 'arrows', label: 'Force arrows',
      svg: '<path d="M250 100 L250 160" stroke="#f87171" stroke-width="3" marker-end="url(#m)"/><text x="260" y="135" fill="#fca5a5" font-size="12">F</text>', pose: { opacity: 0 } },
  ],
  states: {
    rest: {
      label: 'At rest',
      caption: 'Natural length. No energy stored. Ready to squash or stretch.',
      on: { PUSH: 'compress' },
    },
    compress: {
      label: 'Compressed',
      caption: 'You pushed. Coils closer. Elastic energy stored. Feel the push-back?',
      on: { RELEASE: 'launch', HOLD: 'held' },
      parts: { top: { y: 50 }, mass: { y: 50 }, coil: { scaleY: 0.55, y: 40 }, arrows: { opacity: 1 } },
    },
    launch: {
      label: 'Launch!',
      caption: 'You let go. Stored energy becomes motion. Mass flies up!',
      on: {},
      parts: { mass: { y: -80 }, top: { y: -20 }, coil: { scaleY: 1.15 } },
    },
    held: {
      label: 'Held compressed',
      caption: 'Still squashed. Energy waiting. Release whenever you want the launch.',
      on: {},
      parts: { top: { y: 50 }, mass: { y: 50 }, coil: { scaleY: 0.55, y: 40 }, arrows: { opacity: 1 } },
    },
  },
};
