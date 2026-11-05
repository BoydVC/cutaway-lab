export default {
  id: 'bees', title: 'Honeybee Waggle Dance', emoji: '🐝', topic: 'Animals & Bodies',
  blurb: 'How one scout bee tells the whole hive where the flowers are by dancing.',
  initial: 'search',
  parts: [
    { id: 'sun', label: 'Sun', job: 'is the compass the bees use for direction', svg: '<circle cx="350" cy="40" r="22" fill="#fde047"/>' },
    { id: 'hive', label: 'Hive', job: 'is where the dance happens', svg: '<rect x="30" y="170" width="90" height="100" rx="12" fill="#d97706"/><path d="M30 200 h90 M30 230 h90" stroke="#92400e" stroke-width="3"/>', explode: [-10, 10] },
    { id: 'flower', label: 'Flower patch', job: 'has the nectar the bees want', svg: '<g><g fill="#f472b6"><circle cx="318" cy="228" r="9"/><circle cx="342" cy="228" r="9"/><circle cx="330" cy="216" r="9"/><circle cx="330" cy="240" r="9"/></g><circle cx="330" cy="228" r="7" fill="#facc15"/><rect x="328" y="235" width="4" height="28" fill="#16a34a"/><ellipse cx="360" cy="250" rx="8" ry="6" fill="#fb7185"/><circle cx="360" cy="250" r="3" fill="#fde047"/></g>', explode: [10, 10] },
    { id: 'scout', label: 'Scout bee', job: 'finds food and dances to share it', svg: '<g transform="translate(75 160)"><ellipse rx="10" ry="7" fill="#facc15"/><path d="M-4 -7 v14 M0 -7 v14 M4 -7 v14" stroke="#111" stroke-width="1.8"/><ellipse cx="-2" cy="-9" rx="7" ry="4.5" fill="#e0f2fe" opacity=".85"/><ellipse cx="4" cy="-9" rx="6" ry="4" fill="#e0f2fe" opacity=".7"/><circle cx="8" cy="0" r="2.2" fill="#111"/></g>' },
    { id: 'foragers', label: 'Forager bees', job: 'follow the dance directions to the food', svg: '<g fill="#fbbf24"><circle cx="60" cy="190" r="5"/><circle cx="90" cy="195" r="5"/><circle cx="75" cy="210" r="5"/></g>', pose: { opacity: 0.4 } },
  ],
  states: {
    search: { label: 'Scout searches', caption: 'A scout bee flies out exploring for flowers.', on: { FIND: 'found', GIVE_UP: 'home' }, parts: { scout: { x: 120, y: -60 } } },
    found: { label: 'Finds flowers', caption: 'Jackpot! The scout sips nectar and remembers where the patch is compared to the sun.', on: { RETURN: 'dance' }, parts: { scout: { x: 250, y: 60 } } },
    dance: { label: 'Waggle dance', caption: 'Back in the hive she waggles in a line. The angle points the way; the waggle time tells how far.', on: { FOLLOW: 'harvest' }, parts: { scout: { x: 0, y: 40, rot: 35 }, foragers: { opacity: 1 } } },
    harvest: { label: 'Everyone goes', caption: 'The other bees fly straight to the flowers. Teamwork turns nectar into honey.', on: {}, parts: { foragers: { x: 250, y: 30, opacity: 1 }, scout: { x: 250, y: 60 } } },
    home: { label: 'Back home', caption: 'No flowers today, so the scout heads home to rest.', on: {} },
  },
};
