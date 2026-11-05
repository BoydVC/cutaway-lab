export default {
  id: 'volcano', title: 'Volcano Eruption', emoji: '🌋', topic: 'Earth Science',
  blurb: 'How melted rock deep underground pushes up and bursts out of a volcano.',
  initial: 'sleep',
  parts: [
    { id: 'crust', label: 'Rock layers', svg: '<rect x="-300" y="230" width="1000" height="70" fill="#57534e"/>' },
    { id: 'chamber', label: 'Magma chamber', job: 'stores melted rock under the volcano', svg: '<ellipse cx="200" cy="265" rx="60" ry="18" fill="#ea580c"/>', explode: [0, 20] },
    { id: 'mountain', label: 'Volcano cone', job: 'is built from layers of old lava and ash', svg: '<path d="M80 230 L180 90 H220 L320 230Z" fill="#78716c"/>' },
    { id: 'vent', label: 'Vent', job: 'is the pipe magma climbs up', svg: '<rect x="194" y="92" width="12" height="160" fill="#c2410c"/>', pose: { opacity: 0.3 }, explode: [70, 0] },
    { id: 'ash', label: 'Ash cloud', job: 'shoots tiny bits of rock into the sky', svg: '<g fill="#a8a29e"><circle cx="200" cy="70" r="16"/><circle cx="188" cy="50" r="14"/><circle cx="214" cy="46" r="18"/><circle cx="196" cy="28" r="12"/><circle cx="232" cy="30" r="11"/><circle cx="174" cy="34" r="9"/><circle cx="220" cy="14" r="8"/><circle cx="160" cy="55" r="7" fill="#78716c"/><circle cx="245" cy="48" r="6" fill="#78716c"/></g>', pose: { opacity: 0, scale: 0.3 } },
    { id: 'lava', label: 'Lava', job: 'flows down the sides', svg: '<path d="M185 92 Q160 160 130 225 L150 225 Q175 160 195 100Z M215 92 Q240 160 270 225 L250 225 Q225 160 205 100Z" fill="#f97316"/><path d="M192 100 Q175 150 155 200" stroke="#fde047" stroke-width="4" fill="none" opacity=".7"/><path d="M208 100 Q225 150 245 200" stroke="#fde047" stroke-width="4" fill="none" opacity=".7"/>', pose: { opacity: 0 } },
  ],
  states: {
    sleep: { label: 'Sleeping volcano', caption: 'Deep below, hot melted rock called magma sits in a chamber.', on: { HEAT_UP: 'rise' } },
    rise: { label: 'Magma rises', caption: 'Magma is lighter than solid rock, so it creeps up the vent. Gas bubbles grow.', on: { PRESSURE: 'erupt', COOL_DOWN: 'sleep_again' }, parts: { vent: { opacity: 1 }, chamber: { scale: 1.15 } } },
    erupt: { label: 'Eruption!', caption: 'The gas bursts out! Ash blasts into the sky and lava pours down.', on: { SETTLE: 'newRock' }, parts: { vent: { opacity: 1 }, ash: { opacity: 1, scale: 1.3, y: -10 }, lava: { opacity: 1 }, chamber: { scale: 0.8 } } },
    newRock: { label: 'New land', caption: 'Lava cools into new rock. Volcanoes are one way Earth makes new land.', on: {}, parts: { lava: { opacity: 0.6 }, ash: { opacity: 0.2, scale: 2, y: -30, x: 60 } } },
    sleep_again: { label: 'Goes quiet', caption: 'Sometimes the magma cools before it gets out, and the volcano rests again.', on: {} },
  },
};
