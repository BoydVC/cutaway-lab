export default {
  id: 'soccer', title: 'Soccer: Overlap Run', emoji: '⚽', topic: 'Sports',
  blurb: 'How a fullback overlaps the winger, drawing a defender and opening a cut-back cross.',
  initial: 'build',
  parts: [
    { id: 'pitch', label: 'Pitch', svg: '<rect x="20" y="30" width="360" height="240" fill="#15803d"/><rect x="20" y="30" width="360" height="240" fill="none" stroke="#bbf7d0" stroke-width="3"/><path d="M200 30 V270" stroke="#bbf7d0" stroke-width="2"/><circle cx="200" cy="150" r="28" fill="none" stroke="#bbf7d0" stroke-width="2"/><rect x="20" y="95" width="40" height="110" fill="none" stroke="#bbf7d0" stroke-width="2"/><rect x="340" y="95" width="40" height="110" fill="none" stroke="#bbf7d0" stroke-width="2"/>' },
    { id: 'goal', label: 'Goal', svg: '<rect x="368" y="115" width="8" height="70" fill="#e2e8f0"/>' },
    { id: 'fb', label: 'Fullback', job: 'sprints past the winger on the overlap', svg: '<circle cx="110" cy="210" r="10" fill="#1d4ed8"/><circle cx="110" cy="210" r="3" fill="#fef08a"/>', explode: [-30, 20] },
    { id: 'winger', label: 'Winger', job: 'holds the ball, then slips it to the overlapping fullback', svg: '<circle cx="200" cy="200" r="10" fill="#2563eb"/><circle cx="200" cy="200" r="3" fill="#fef08a"/>', explode: [0, 25] },
    { id: 'striker', label: 'Striker', job: 'waits in the box for the cut-back', svg: '<circle cx="300" cy="150" r="10" fill="#1e40af"/><circle cx="300" cy="150" r="3" fill="#fef08a"/>', explode: [20, -20] },
    { id: 'defender', label: 'Defender', job: 'gets pulled wide by the overlap', svg: '<circle cx="260" cy="180" r="10" fill="#b91c1c"/><circle cx="260" cy="180" r="3" fill="#fef08a"/>' },
    { id: 'ball', label: 'Soccer ball', job: 'is passed into the overlap, then cut back', svg: '<circle cx="200" cy="190" r="6" fill="#f8fafc" stroke="#111"/><path d="M200 184 L200 196 M194 190 H206" stroke="#111" stroke-width="1"/>', explode: [0, -40] },
    { id: 'lane', label: 'Overlap lane', svg: '<path d="M120 210 Q200 230 280 160" stroke="#fbbf24" stroke-width="2" fill="none" stroke-dasharray="5 4"/>', pose: { opacity: 0 } },
  ],
  states: {
    build: { label: 'Build-up', caption: 'The winger has the ball on the wing. The fullback starts a long run from behind.', on: { OVERLAP: 'overlap' }, parts: { fb: { x: 30, y: 5 } } },
    overlap: { label: 'Overlap run', caption: 'The fullback sprints past! The defender has to choose: follow the fullback or stay with the winger.', on: { PASS: 'pass', HOLD: 'cutInside' }, parts: { fb: { x: 120, y: -30 }, lane: { opacity: 1 }, defender: { x: 20, y: -10 } } },
    pass: { label: 'Pass into space', caption: 'The winger slides the ball into the fullback\'s run. The defender is caught in between.', on: { CROSS: 'cross' }, parts: { ball: { x: 80, y: -40 }, fb: { x: 150, y: -50 }, lane: { opacity: 0.5 }, defender: { x: 30, y: -20 }, winger: { x: 20 } } },
    cross: { label: 'Cut-back cross', caption: 'Instead of a high cross, the fullback cuts the ball back to the striker. Goal!', on: {}, parts: { ball: { x: 100, y: -30 }, fb: { x: 170, y: -55 }, striker: { x: 10, y: 10 }, defender: { x: 50, y: -40 }, lane: { opacity: 0 } } },
    cutInside: { label: 'Cut inside instead', caption: 'The pass is covered, so the winger cuts inside and shoots or finds the striker another way.', on: {}, parts: { winger: { x: 40, y: -30 }, ball: { x: 40, y: -30 }, fb: { x: 100, y: -20, opacity: 0.5 } } },
  },
};
