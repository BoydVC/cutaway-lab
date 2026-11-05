export default {
  id: 'starship', title: 'Rocket Launch & Tower Catch', emoji: '🚀', topic: 'Space',
  blurb: 'How a giant two-stage rocket lifts off, splits in two, and the booster flies home to be caught by the tower arms.',
  initial: 'pad',
  parts: [
    { id: 'sea', label: 'Ground', svg: '<rect x="-300" y="270" width="1000" height="30" fill="#2b3a2a"/>' },
    { id: 'tower', label: 'Launch tower', job: 'holds the rocket and catches the booster', svg: '<rect x="250" y="60" width="18" height="210" fill="#6b7280"/><path d="M250 60 l18 20 M268 60 l-18 20 M250 120 l18 20 M268 120 l-18 20 M250 180 l18 20 M268 180 l-18 20" stroke="#9ca3af" stroke-width="2"/>', explode: [40, 0] },
    { id: 'arms', label: 'Catch arms', job: 'grab the booster out of the air', svg: '<rect x="215" y="100" width="40" height="6" fill="#f59e0b"/><rect x="215" y="112" width="40" height="6" fill="#f59e0b"/>', explode: [40, -20] },
    { id: 'booster', label: 'Booster (stage 1)', job: 'does the hard lifting off the ground', svg: '<rect x="190" y="150" width="26" height="110" rx="4" fill="#cbd5e1"/><rect x="190" y="250" width="26" height="10" fill="#475569"/>', explode: [-50, 30] },
    { id: 'ship', label: 'Ship (stage 2)', job: 'carries the cargo into orbit', svg: '<rect x="190" y="80" width="26" height="70" rx="4" fill="#e5e7eb"/><path d="M190 80 q13 -30 26 0z" fill="#e5e7eb"/>', explode: [-50, -40] },
    { id: 'flame', label: 'Engine flame', job: 'pushes the rocket up by blasting gas down', svg: '<path d="M192 260 q11 40 22 0z" fill="#fb923c"/><path d="M197 260 q6 22 12 0z" fill="#fde047"/>', pose: { opacity: 0 }, explode: [-50, 60] },
  ],
  states: {
    pad: { label: 'On the pad', caption: 'The rocket stands next to the tower, full of super-cold fuel.', on: { IGNITE: 'ignition', SCRUB: 'scrubbed' } },
    ignition: { label: 'Engines light', caption: 'Dozens of engines light. Clamps hold the rocket down for a moment.', on: { RELEASE: 'liftoff' }, parts: { flame: { opacity: 1 } } },
    liftoff: { label: 'Liftoff', caption: 'The clamps let go and the rocket climbs. It gets lighter as fuel burns.', on: { CLIMB: 'staging' }, parts: { flame: { opacity: 1, y: -60 }, booster: { y: -60 }, ship: { y: -60 } } },
    staging: { label: 'Hot staging', caption: 'High up, the ship lights its own engines and pushes off the booster.', on: { SEPARATE: 'boostback' }, parts: { booster: { y: -70, x: -30, rot: -10 }, ship: { y: -60, x: 45, rot: 8 }, flame: { opacity: 1, y: -70, x: -30, rot: -10, scale: 0.6 } } },
    boostback: { label: 'Boostback', caption: 'The booster flips around and burns its engines to fly back to the tower.', on: { DESCEND: 'catch' }, parts: { booster: { y: -90, x: 0, rot: 180 }, ship: { y: -200, x: 120, opacity: 0.3, scale: 0.5 }, flame: { opacity: 0 } } },
    catch: { label: 'Tower catch', caption: 'The arms close and catch the booster in mid-air, so it can fly again.', on: {}, parts: { booster: { y: -40, x: 20 }, arms: { y: 50 }, ship: { opacity: 0 } } },
    scrubbed: { label: 'Launch scrubbed', caption: 'Something looked wrong, so the team stops safely and tries another day.', on: {} },
  },
};
