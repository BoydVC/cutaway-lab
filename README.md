# 🔧 Cutaway Lab

Step inside a rocket launch, a Mars sky-crane landing, a pendulum clock, a beating heart, a honeybee waggle dance and a volcano. Every animated cutaway is driven by a small **state machine**, so kids can step through how a thing works and the app can check that every machine is sound (every step reachable, nothing gets stuck).

![demo](screenshots/demo.gif)

## Quickstart (2 minutes)

```bash
git clone https://github.com/BoydVC/cutaway-lab && cd cutaway-lab
npm start            # http://127.0.0.1:4410  (no install needed: zero runtime deps)
npm test             # unit tests (node:test)
npm i && npx playwright install chromium && npm run e2e   # headless browser tests + screenshots
```

Keys: **Space** play/pause · **→ / ←** step forward/back · **E** exploded view with labels · **Q** quiz · **N** read aloud.

The sidebar draws the live statechart: the current step glows, loops are dashed, and you can click the next step to go there. Quiz stars are saved in the browser and earn a badge (Apprentice → Lab Scientist → Master Engineer).

`npm run check` validates every machine and `npm run check -- --mermaid` prints each one as a Mermaid statechart.
Deep links: `#starship/staging`, `#clock/tickLeft/x` (x = exploded).

## Build your own + print a worksheet

- **`builder.html`**: kids write a machine as JSON and the checker flags stuck or unreachable steps as they type. Share links put the whole machine in the URL (`#m=…`). Unsafe SVG (scripts, event handlers, links, images) is removed before it renders.
- **`worksheet.html#<machine>`**: a printable sheet with put-the-steps-in-order, match-the-part and a 4-question quiz. The answer key is hidden when printed.

| | |
|---|---|
| ![builder](screenshots/builder.png) | ![worksheet](screenshots/worksheet.png) |

## What's inside

| Machine | Main path | Side path |
|---|---|---|
| 🚀 Rocket Launch & Tower Catch | pad → engines light → liftoff → hot staging → boostback → tower catch | launch scrubbed |
| 🔴 Mars Rover Sky-Crane Landing | entry → parachute → rocket descent → sky crane → touchdown | pick a safer spot |
| 🕰️ Pendulum Clock | wound → tick ⇄ tock (loop) | run down |
| ❤️ Heartbeat | fill → top squeeze → big squeeze (loop) | rest |
| 🐝 Honeybee Waggle Dance | search → find flowers → dance → everyone goes | back home |
| 🌋 Volcano Eruption | asleep → magma rises → eruption → new land | goes quiet |

- `src/engine.js`: the statechart engine: `validate` (unknown targets, unreachable states, livelocks, bad part refs), `step`, `mainPath`, `pose`, `toMermaid`.
- `src/layout.js`: lays out the live statechart (main path in a column, skips and loops as nested arcs).
- `src/progress.js`: best quiz stars per machine and badges.
- `src/quiz.js`: seeded quizzes built from the machine itself ("what happens next?", "which part does…?").
- `machines/*.js`: one plain-data file per machine. Add one, `npm test` tells you if it is broken.

## Add a machine

```js
export default { id: 'volcano', title: 'Volcano', emoji: '🌋', initial: 'sleep',
  parts: [{ id: 'magma', label: 'Magma', job: 'pushes up from deep below', svg: '<circle cx="200" cy="250" r="30" fill="#f97316"/>', explode: [0, 30] }],
  states: { sleep: { label: 'Asleep', caption: '…', on: { RUMBLE: 'erupt' } }, erupt: { label: 'Eruption', caption: '…', on: {}, parts: { magma: { y: -150 } } } } };
```

Register it in `machines/index.js`, then run `npm run check`.

## Screenshots

| | |
|---|---|
| ![hero](screenshots/hero-1440x900.png) | ![clock](screenshots/clock-exploded.png) |
| ![heart](screenshots/heart.png) | ![quiz](screenshots/quiz.png) |
| ![mars](screenshots/mars.png) | ![volcano](screenshots/volcano-exploded.png) |

Phone: ![phone](screenshots/phone-390x844.png)

Regenerate the GIF: `node scripts/record-gif.js` (needs ffmpeg).

MIT licensed. Diagrams are simplified for kids; not engineering or medical references.
