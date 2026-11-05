export default {
  id: 'football', title: 'Football: Play-Action Pass', emoji: '🏈', topic: 'Sports',
  blurb: 'How a play-action pass fools the defense: fake a handoff, then throw deep. Generic purple and gold colors — no team logos.',
  initial: 'huddle',
  parts: [
    { id: 'field', label: 'Field', svg: '<rect x="-20" y="40" width="440" height="220" fill="#166534"/><rect x="-20" y="40" width="440" height="18" fill="#14532d"/><rect x="-20" y="242" width="440" height="18" fill="#14532d"/><g stroke="#86efac" stroke-width="2" opacity=".75"><path d="M0 80 H400 M0 120 H400 M0 160 H400 M0 200 H400 M0 240 H400"/><path d="M200 40 V260" stroke-dasharray="6 6"/></g><text x="8" y="72" fill="#bbf7d0" font-size="12">40</text><text x="8" y="112" fill="#bbf7d0" font-size="12">30</text><text x="8" y="152" fill="#bbf7d0" font-size="12">20</text>' },
    { id: 'oline', label: 'Offensive line', job: 'blocks so the quarterback has time', svg: '<g fill="#1e1b4b"><rect x="160" y="168" width="16" height="18" rx="2"/><rect x="180" y="168" width="16" height="18" rx="2"/><rect x="200" y="168" width="16" height="18" rx="2"/><rect x="220" y="168" width="16" height="18" rx="2"/><rect x="240" y="168" width="16" height="18" rx="2"/></g>' },
    { id: 'rb', label: 'Running back', job: 'fakes taking the ball to fool the defense', svg: '<circle cx="175" cy="200" r="10" fill="#4c1d95" stroke="#fbbf24" stroke-width="1.5"/><text x="175" y="204" text-anchor="middle" fill="#fbbf24" font-size="8" font-weight="700">22</text>', explode: [-40, 20] },
    { id: 'qb', label: 'Quarterback', job: 'fakes the handoff, then throws', svg: '<circle cx="200" cy="200" r="11" fill="#312e81" stroke="#fbbf24" stroke-width="2"/><text x="200" y="204" text-anchor="middle" fill="#fbbf24" font-size="9" font-weight="700">8</text>', explode: [0, 30] },
    { id: 'wr', label: 'Wide receiver', job: 'runs a deep route and catches the ball', svg: '<circle cx="320" cy="150" r="10" fill="#4c1d95" stroke="#fbbf24" stroke-width="1.5"/><text x="320" y="154" text-anchor="middle" fill="#fbbf24" font-size="8" font-weight="700">14</text>', explode: [40, -20] },
    { id: 'lb', label: 'Linebacker', job: 'steps up for the run fake, leaving space behind', svg: '<circle cx="230" cy="140" r="10" fill="#44403c" stroke="#a8a29e" stroke-width="1.5"/><text x="230" y="144" text-anchor="middle" fill="#e7e5e4" font-size="8" font-weight="700">54</text>' },
    { id: 'ball', label: 'Football', job: 'is snapped, faked, then thrown', svg: '<ellipse cx="200" cy="188" rx="8" ry="5" fill="#9a3412"/><path d="M194 188 H206" stroke="#fef3c7" stroke-width="1"/>', explode: [0, -40] },
    { id: 'arrow', label: 'Pass path', svg: '<path d="M210 195 Q280 100 330 145" stroke="#fbbf24" stroke-width="2" fill="none" stroke-dasharray="4 3"/>', pose: { opacity: 0 } },
  ],
  states: {
    huddle: { label: 'Huddle break', caption: 'The offense lines up. Everyone knows the play: fake a run, then throw.', on: { SNAP: 'snap' } },
    snap: { label: 'Snap', caption: 'The center snaps the ball to the quarterback.', on: { FAKE: 'fake', AUDIBLE: 'checkdown' }, parts: { ball: { y: 12 } } },
    fake: { label: 'Play-action fake', caption: 'The QB sticks the ball toward the running back — but keeps it! Linebackers bite on the run.', on: { THROW: 'throw' }, parts: { ball: { x: -18, y: 14 }, rb: { x: -25, y: 5 }, lb: { y: 28, x: -10 }, oline: { y: -4 } } },
    throw: { label: 'Deep throw', caption: 'The QB pulls the ball back and throws deep downfield. The receiver is open!', on: { CATCH: 'catch' }, parts: { ball: { x: 80, y: -40 }, qb: { rot: -20, x: 6 }, wr: { x: 20, y: -20 }, arrow: { opacity: 1 }, lb: { y: 20 } } },
    catch: { label: 'Touchdown catch', caption: 'The receiver catches it in stride and scores. Play-action worked!', on: {}, parts: { ball: { x: 130, y: -55, opacity: 0.2 }, wr: { x: 50, y: -50 }, arrow: { opacity: 0.4 }, qb: { opacity: 0.7 } } },
    checkdown: { label: 'Checkdown instead', caption: 'The deep route is covered, so the QB dumps a short pass to the running back.', on: {}, parts: { ball: { x: -30, y: 20 }, rb: { x: -40, y: 10 } } },
  },
};
