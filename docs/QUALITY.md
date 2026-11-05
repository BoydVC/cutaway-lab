# Cutaway Lab v1.0 quality pass

Fleet locked at **36** machines (no new machines after `v0.20-pulley-candle`). Every machine rendered at desk **1440×900** and phone **390×844**; OCR privacy clean (deny-list, word-boundary for Char/Vic).

## Layout / chrome
- Compact picker (`max-height`) + topic filter chips (All · Space · Machines · Animals & Bodies · Earth Science · Sports)
- Topics never wrap — horizontal scroll on narrow screens; phone hides tagline for stage room
- Selected machine scrolls into view; topic filter auto-picks first in topic
- Chart row height 40px; decorative `lbl*` / `* label` stage captions hidden from parts list and quiz

## Science / copy / label fixes
- **Pulley**: fixed pulley changes *direction*, not mechanical advantage
- Flush siphon *pulls* (not “sucks”) the bowl empty
- Compass dial fits viewBox; sewing shows top-thread / bobbin lockstitch
- Heart valve labels outboard so phone atria squeeze stays readable
- Mars sky-crane + rover; extinguisher fire base + “aim at base”
- Bees: waggle line + hive/flowers captions
- Frog eggs/tadpole/frog; water sun/cloud/rain/ocean; volcano magma/lava/ash
- Stage captions across sharpener, tennis, lock, clock, starship, gears, bike, shutter, zipper, turbine, parachute, candle, flashlight, stoplight

## Media
- `screenshots/demo.gif` (~3.9 MB) · `demo-director.gif` / `.mp4`
- Hero `screenshots/hero-1440x900.png` · phone `screenshots/phone-390x844.png`
- Narrations: **36** `narrations/*-captions.mp4`

## Tests (last green)
- unit **602** · e2e **36** · TLC/formal **28** configs · OCR clean
