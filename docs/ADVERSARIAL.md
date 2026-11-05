# Adversarial review + blast radius (Cutaway Lab)

Review date: 2026-11-05. Scope: whole app (engine, quiz, builder sanitize, sports machines, narrate).

## Findings

### F1 — HIGH — Builder share links can grow past browser URL limits
Kid machines with large SVG parts encode to a `#m=` share URL via base64. A machine near the 4KB SVG cap × N parts can exceed ~32KB URLs, which some browsers truncate silently → decode falls back to template and the kid thinks their machine vanished.
**Fix:** Cap encoded share payload; show a friendly error instead of writing an overlong hash. Test included.

### F2 — MED — `speechSynthesis.speak` on every render (incl. step-back)
`speak(st.caption)` runs inside `render()`, so stepping back or re-picking the same state re-speaks. With Narrate checked this stacks utterances and overlaps.
**Fix:** Only auto-speak when the state *changes* to a new caption, not on exploded-toggle / re-render. Test via export hook.

### F3 — MED — Quiz can repeat the same "what happens next?" stem
`makeQuiz` builds from transitions; for tiny machines (builder template has 2 transitions) a 5-question quiz repeats stems. Kids see the same question twice.
**Fix:** Deduplicate prompts; if fewer unique questions than requested, return what we have (≥3).

### F4 — MED — Chart node width clips long sports labels
"Play-action fake", "Flip to second", "Dish and finish" get sliced at 28 chars but the rect is only 200px — at 13px font some labels still feel tight on phone.
**Fix:** Widen chart nodes to 220 and allow 32-char labels; phone CSS already stacks.

### F5 — LOW — `localStorage` progress key is global and unversioned
`cutaway-lab:stars` will collide if a future schema change adds fields; garbage already returns `{}` (good).
**Fix:** Bump key to `cutaway-lab:stars:v2` and migrate.

### F6 — LOW — Narrate export shells out to piper with `echo JSON.stringify`
Safe today (no user input), but if we ever pass kid captions from the builder into narrate, shell injection becomes a concern.
**Fix:** Pass text on stdin without shell interpolation (already mostly — verify no shell=true with unsanitized).

### F7 — LOW — Exploded labels can overlap on dense machines (heart)
Heart exploded view puts pulmonary/aortic labels near atria labels.
**Fix:** Nudge explode offsets; accept residual overlap on purpose-built dense cutaways.

### F8 — INFO — Sports machines use generic colors; trademark test locks it
Regression test rejects Ravens/Orioles/NFL/etc. in machine JSON. Keep it.

## Blast radius of v0.5–v0.6 changes
| Change | Engine | Quiz | Builder | Worksheet | e2e | Sports |
|---|---|---|---|---|---|---|
| Heart redraw | — | captions feed quiz | — | jobs trimmed | heart walk | — |
| Chart font/layout rowH | layout consumers | — | — | — | chart click | denser sports charts |
| Foam TEMPLATE | — | — | template | worksheet(TEMPLATE) | builder e2e | — |
| +4 sports | validate all | +4 quizzes | — | +4 worksheets | picker=12 | new |
| narrate.js | reads mainPath | — | — | — | — | frames all |

## Fixes applied in v0.8
See commit / PR body. Each finding above maps to a test in `test/v8-adversarial.test.js`.


## v0.10 additions
- +3 machines: basketball pick-and-roll, hockey breakout, bicycle drivetrain
- Foam plant tightened (fizz y:-6)
- Formal: BasketballPlay, HockeyBreakout, BikeDrive TLC-green
- Blast: picker count assertions relaxed (≥12); sports ≥4; every-machine walk includes new ids

## Round 2 — v0.11 (tennis, photosynthesis, fleet 17)

### F9 — MED — Picker wraps to 3 rows on desktop; phone nowrap scrolls
17 machines → 3 nav rows on 1440px. Fine visually, but keyboard tab order is long.
**Fix (partial):** phone already `flex-wrap:nowrap` + horizontal scroll. Desktop keeps wrap for discoverability.

### F10 — MED — Worksheet alphabet overflow on dense machines
Heart parts A–J already trimmed; photosynthesis + tennis add more jobs. Worksheet lettering must not overflow past Z.
**Fix:** assert worksheet letters ≤ 26 in test; trim jobs.

### F11 — LOW — Narrate TTS shells `echo JSON.stringify` (F6 follow-up)
Still shelling piper. Captions are from our machines only (not builder). Keep stdin-only path.
**Fix:** leave as-is; document that builder captions never enter narrate.

### F12 — INFO — Chart back-edge from tennis "Fault toss" label
Side-path label "Fault toss" vs event FAULT_TOSS — layout truncates fine at 32 chars.

## Blast radius v0.10–v0.11
| Change | Engine | Quiz | e2e | Formal | Narrate |
|---|---|---|---|---|---|
| +basketball/hockey/bike | validate | +3 quizzes | walk+shots | +3 TLA | +3 mp4 |
| +tennis/photo | validate | +2 quizzes | walk+shots | +2 TLA | pending |
| Foam y:-6 | — | — | builder | — | — |

## Round 3 — fleet 23 blast-radius (2026-11-05)

### Method
- Re-validated all 23 machines (engine.validate + mainPath + makeQuiz + PII deny-list).
- Traced every import of `machines/index.js` and hard-coded machine id lists (e2e walk, formal checks, narrate, demos).
- Re-checked share payload limit, quiz uniqueness, narrate-once, chart label ≥12px.

### Findings

| ID | Severity | Finding | Fix |
|----|----------|---------|-----|
| R3-1 | med | e2e walk list is a hard-coded id array — new machines silently skipped if forgotten | add test that e2e/run.js walk includes every `machines[].id` |
| R3-2 | med | `narrate.js --only` overwrites `narrations/report.json` with a 1-row report | merge into existing report by id |
| R3-3 | low | Elevator floor highlight stayed on "1" while car was at floor 3 | floor markers are now separate parts; open state lights "3" |
| R3-4 | low | Stoplight `red` is terminal (teaching one cycle) — autoplay stops; OK for kids, document it | documented in machine blurb; no code change |
| R3-5 | low | Worksheet letter jobs capped at 26; fleet 23 × ~4 jobs still fine | existing cap test covers this |
| R3-6 | info | Heart aorta label was 10px | bumped to 12px in v0.12 |

### Tests added
- `test/v13-civic-machines.test.js` (elevator/flush/stoplight)
- `test/v14-blast.test.js` — e2e walk covers fleet; narrate report merge; chart fonts

