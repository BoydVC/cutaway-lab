export default {
  id: 'frog', title: 'Frog Life Cycle', emoji: '🐸', topic: 'Animals & Bodies',
  blurb: 'How a tiny egg in a pond turns into a jumping frog, and why the cycle starts again.',
  initial: 'eggs',
  parts: [
    { id: 'pond', label: 'Pond', job: 'is home for eggs and tadpoles', svg: '<rect x="-300" y="200" width="1000" height="100" fill="#0e7490"/><rect x="-300" y="196" width="1000" height="6" fill="#67e8f9" opacity=".5"/>' },
    { id: 'lily', label: 'Lily pad', svg: '<ellipse cx="300" cy="198" rx="44" ry="9" fill="#16a34a"/>' },
    { id: 'eggs', label: 'Frogspawn', job: 'are jelly-covered eggs', svg: '<g fill="#e0f2fe" stroke="#94a3b8"><circle cx="120" cy="230" r="6"/><circle cx="132" cy="234" r="6"/><circle cx="126" cy="244" r="6"/><circle cx="140" cy="246" r="6"/></g><g fill="#111"><circle cx="120" cy="230" r="2"/><circle cx="132" cy="234" r="2"/><circle cx="126" cy="244" r="2"/><circle cx="140" cy="246" r="2"/></g>', explode: [-30, 20] },
    { id: 'tadpole', label: 'Tadpole', job: 'breathes with gills and swims with a tail', svg: '<ellipse cx="180" cy="240" rx="10" ry="7" fill="#1f2937"/><path d="M190 240 q14 -6 24 2" stroke="#1f2937" stroke-width="4" fill="none"/>', pose: { opacity: 0 } },
    { id: 'legs', label: 'Back legs', job: 'grow first so the tadpole can kick', svg: '<path d="M176 246 l-6 10 M184 246 l4 10" stroke="#365314" stroke-width="3"/>', pose: { opacity: 0 } },
    { id: 'frog', label: 'Frog', job: 'breathes air with lungs and hops on land', svg: '<ellipse cx="300" cy="186" rx="18" ry="11" fill="#22c55e"/><circle cx="292" cy="175" r="4" fill="#22c55e"/><circle cx="308" cy="175" r="4" fill="#22c55e"/><circle cx="292" cy="175" r="1.6" fill="#111"/><circle cx="308" cy="175" r="1.6" fill="#111"/>', pose: { opacity: 0 } },
  ],
  states: {
    eggs: { label: 'Eggs', caption: 'A frog lays hundreds of eggs in a jelly clump called frogspawn.', on: { HATCH: 'tadpole', EATEN: 'eaten' } },
    tadpole: { label: 'Tadpole', caption: 'A tadpole wiggles out. It breathes underwater with gills, like a fish.', on: { GROW: 'legs' }, parts: { eggs: { opacity: 0.2 }, tadpole: { opacity: 1 } } },
    legs: { label: 'Growing legs', caption: 'Back legs grow first, then front legs. The tail starts to shrink.', on: { CHANGE: 'froglet' }, parts: { eggs: { opacity: 0 }, tadpole: { opacity: 1, x: 40, y: -10 }, legs: { opacity: 1, x: 40, y: -10 } } },
    froglet: { label: 'Froglet', caption: 'Lungs replace gills. The little froglet climbs out to breathe air.', on: { GROW_UP: 'adult' }, parts: { eggs: { opacity: 0 }, frog: { opacity: 1, scale: 0.6, x: -60, y: 14 } } },
    adult: { label: 'Adult frog', caption: 'A grown frog hops and eats bugs. One day it lays eggs, and the cycle begins again.', on: {}, parts: { eggs: { opacity: 0 }, frog: { opacity: 1 } } },
    eaten: { label: 'Snack for a fish', caption: 'Most eggs get eaten. That is why frogs lay so many!', on: {}, parts: { eggs: { opacity: 0.3, scale: 0.7 } } },
  },
};
