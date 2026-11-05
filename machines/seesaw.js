export default {
  id: 'seesaw', title: 'Seesaw', emoji: '⚖️', topic: 'Machines',
  blurb: 'How a lever balances two weights around a fulcrum — sit farther out to lift a heavier friend.',
  initial: 'level',
  parts: [
    { id: 'fulcrum', label: 'Fulcrum', job: 'is the pivot the board turns around',
      svg: '<polygon points="200,200 170,240 230,240" fill="#64748b"/>', explode: [0, 30] },
    { id: 'board', label: 'Board', job: 'is the lever arm that tips',
      svg: '<rect x="60" y="190" width="280" height="14" rx="3" fill="#a8a29e"/>', explode: [0, -25] },
    { id: 'left', label: 'Left rider', job: 'pushes down on one side',
      svg: '<circle cx="90" cy="170" r="18" fill="#38bdf8"/><rect x="80" y="188" width="20" height="10" fill="#0ea5e9"/>', explode: [-40, -20] },
    { id: 'right', label: 'Right rider', job: 'can outweigh the left side when heavier or farther',
      svg: '<circle cx="310" cy="170" r="22" fill="#f472b6"/><rect x="298" y="192" width="24" height="10" fill="#db2777"/>', explode: [40, -20] },
    { id: 'ground', label: 'Ground',
      svg: '<rect x="40" y="240" width="320" height="10" fill="#334155"/>' },
  ],
  states: {
    level: {
      label: 'Balanced',
      caption: 'Both sides equal. Board is level. A classic first-class lever.',
      on: { TIP_LEFT: 'leftDown', TIP_RIGHT: 'rightDown' },
    },
    leftDown: {
      label: 'Left down',
      caption: 'Left rider is lower. Right side rose. Push off to tip the other way.',
      on: { TIP_RIGHT: 'rightDown', STAND: 'level2' },
      parts: { board: { rot: -18 }, left: { y: 25 }, right: { y: -25 } },
    },
    rightDown: {
      label: 'Right down',
      caption: 'Heavier or farther-out rider wins. Right side down. Left in the air!',
      on: {},
      parts: { board: { rot: 18 }, left: { y: -25 }, right: { y: 25 } },
    },
    level2: {
      label: 'Back to level',
      caption: 'Riders stood up or matched weight. Board returns to level. Ready to tip again.',
      on: {},
    },
  },
};
