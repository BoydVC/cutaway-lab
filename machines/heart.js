export default {
  id: 'heart', title: 'Heartbeat', emoji: '❤️', topic: 'Animals & Bodies',
  blurb: 'How a heart squeezes in two steps to send blood to the lungs and then all around the body.',
  initial: 'fill',
  parts: [
    { id: 'ra', label: 'Right atrium', job: 'collects blood coming back from the body', svg: '<ellipse cx="160" cy="110" rx="40" ry="34" fill="#60a5fa"/>', explode: [-40, -30] },
    { id: 'la', label: 'Left atrium', job: 'collects fresh blood from the lungs', svg: '<ellipse cx="240" cy="110" rx="40" ry="34" fill="#f87171"/>', explode: [40, -30] },
    { id: 'rv', label: 'Right ventricle', job: 'pumps blood to the lungs', svg: '<path d="M125 150 Q160 260 200 270 L200 150Z" fill="#3b82f6"/>', explode: [-40, 30] },
    { id: 'lv', label: 'Left ventricle', job: 'pumps blood out to the whole body', svg: '<path d="M275 150 Q240 260 200 270 L200 150Z" fill="#ef4444"/>', explode: [40, 30] },
    { id: 'lungs', label: 'Lungs', job: 'swap old air for fresh oxygen', svg: '<ellipse cx="60" cy="90" rx="34" ry="60" fill="#fda4af" opacity=".7"/><ellipse cx="340" cy="90" rx="34" ry="60" fill="#fda4af" opacity=".7"/>' },
    { id: 'pulse', label: 'Blood flow', svg: '<circle cx="200" cy="30" r="10" fill="#dc2626"/>', pose: { opacity: 0 } },
  ],
  states: {
    fill: { label: 'Fill up', caption: 'The heart relaxes and both top rooms (atria) fill with blood.', on: { SQUEEZE_TOP: 'atria', STOP: 'rest' }, parts: { ra: { scale: 1.05 }, la: { scale: 1.05 } } },
    atria: { label: 'Top squeeze', caption: 'The atria squeeze, pushing blood down through little doors (valves) into the ventricles.', on: { SQUEEZE_BOTTOM: 'ventricles' }, parts: { ra: { scale: 0.9, x: 16, y: 11 }, la: { scale: 0.9, x: -24, y: 11 } } },
    ventricles: { label: 'Big squeeze', caption: 'The strong bottom rooms squeeze: right side to the lungs, left side to the body. Lub-DUB!', on: { RELAX: 'fill' }, parts: { rv: { scale: 0.95, x: 10, y: 8 }, lv: { scale: 0.95, x: 10, y: 8 }, pulse: { opacity: 1, y: -10 }, lungs: { scale: 1.02 } } },
    rest: { label: 'Rest of the story', caption: 'This happens about 100,000 times every day, without you ever thinking about it.', on: {} },
  },
};
