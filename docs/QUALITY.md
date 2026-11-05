# Cutaway Lab v1.0 quality pass

Fleet locked at **36** machines (no new machines after `v0.20-pulley-candle`). Every machine rendered at desk **1440×900** and phone **390×844**; OCR privacy clean (72 desk + 36 phone, deny-list word-boundary).

## Layout / chrome
- Compact picker + topic chips (All · Space · Machines · Animals & Bodies · Earth Science · Sports)
- Topics never wrap — horizontal scroll; phone hides tagline for stage room
- Selected machine scrolls into view; topic filter auto-picks first in topic
- Decorative `lbl*` / `* label` stage captions hidden from parts list and quiz

## Science / copy / labels
- Pulley: direction not MA · Flush siphon *pulls* · Heart valves outboard on phone
- Bees waggle + hive/flowers · Frog eggs/tadpole/frog · Water sun/cloud/rain/ocean
- Volcano magma/lava/ash · Starship tower/booster/ship · Mars atmosphere/sky crane/rover
- Sports role captions (QB/RB/WR, SS, FB/W, screen, D/W, G/A)
- Every machine ≥2 on-stage text captions

## Media
- `screenshots/demo.gif` (~4.2 MB, topics→sports→explode→quiz)
- `screenshots/demo-director.gif` / `.mp4` · hero · phone
- Narrations: **36** `narrations/*-captions.mp4`

## Tests
- unit **602** · e2e **36** · TLC/formal **28** · OCR clean
