export default {
  id: 'water', title: 'The Water Cycle', emoji: '💧', topic: 'Earth Science',
  blurb: 'How the same water goes from the ocean to the sky to the mountains and back again.',
  initial: 'ocean',
  parts: [
    { id: 'sun', label: 'Sun', job: 'heats the water so it rises', svg: '<circle cx="50" cy="40" r="22" fill="#fde047"/><g stroke="#fde047" stroke-width="3" stroke-linecap="round"><path d="M50 8 v8 M50 64 v8 M12 40 h8 M80 40 h8 M22 14 l6 6 M72 60 l6 6 M22 66 l6 -6 M72 14 l6 -6"/></g>' },
    { id: 'sea', label: 'Ocean', job: 'holds most of Earth\u2019s water', svg: '<rect x="-300" y="230" width="640" height="70" fill="#0369a1"/>' },
    { id: 'seaLbl', label: 'Ocean label',
      svg: '<text x="200" y="285" text-anchor="middle" fill="#7dd3fc" font-size="13" font-weight="700">ocean</text>' },
    { id: 'hill', label: 'Mountain', svg: '<path d="M240 300 L330 150 L460 300Z" fill="#57534e"/><path d="M315 175 L330 150 L345 175Z" fill="#f8fafc"/>' },
    { id: 'vapor', label: 'Water vapor', job: 'is invisible water gas in the air', svg: '<g stroke="#bae6fd" stroke-width="2" fill="none" stroke-dasharray="3 4"><path d="M100 225 q6 -20 0 -40 q-6 -20 0 -40"/><path d="M140 225 q6 -20 0 -40 q-6 -20 0 -40"/><path d="M180 225 q6 -20 0 -40 q-6 -20 0 -40"/></g>', pose: { opacity: 0 } },
    { id: 'cloud', label: 'Cloud', job: 'is made of tiny water drops', svg: '<g fill="#e2e8f0"><circle cx="150" cy="70" r="20"/><circle cx="175" cy="62" r="24"/><circle cx="200" cy="72" r="18"/></g>', pose: { opacity: 0, scale: 0.5 }, explode: [0, -20] },
    { id: 'rain', label: 'Rain', job: 'falls when drops get too heavy', svg: '<g stroke="#7dd3fc" stroke-width="2"><path d="M160 95 l-4 12 M175 100 l-4 12 M190 95 l-4 12 M205 100 l-4 12 M168 115 l-4 12 M196 115 l-4 12"/></g>', pose: { opacity: 0 } },
    { id: 'river', label: 'River', job: 'carries water back to the ocean', svg: '<path d="M330 200 Q300 230 260 236 L250 240" stroke="#38bdf8" stroke-width="6" fill="none"/>', pose: { opacity: 0.25 } },
  ],
  states: {
    ocean: { label: 'In the ocean', caption: 'Water sits in the ocean, warmed by the sun.', on: { EVAPORATE: 'evaporate' } },
    evaporate: { label: 'Evaporation', caption: 'Sunlight heats the water. Some turns into invisible vapor and floats up.', on: { COOL: 'condense' }, parts: { vapor: { opacity: 1 } } },
    condense: { label: 'Condensation', caption: 'High up it is cold, so the vapor turns into tiny drops. Lots of drops make a cloud.', on: { BLOW: 'precip', HOT_DAY: 'evaporate' }, parts: { cloud: { opacity: 1, scale: 1 }, vapor: { opacity: 0.4 } } },
    precip: { label: 'Precipitation', caption: 'Wind blows the cloud to the mountain. Drops join, get heavy, and fall as rain or snow.', on: { FLOW: 'collect' }, parts: { cloud: { opacity: 1, scale: 1.1, x: 140, y: 40 }, rain: { opacity: 1, x: 140, y: 40 } } },
    collect: { label: 'Collection', caption: 'Rain runs into rivers that flow back to the ocean. Then it all starts again!', on: {}, parts: { river: { opacity: 1 }, cloud: { opacity: 0.3, x: 140, y: 40 } } },
  },
};
