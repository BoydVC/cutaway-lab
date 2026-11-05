# Cutaway Lab v1.0 quality pass

Fleet locked at **36** machines (no new machines after `v0.20-pulley-candle`). Every machine rendered at desk **1440×900** and phone **390×844**; OCR privacy clean (deny-list word-boundary).

## Layout / chrome
- Compact picker (`max-height`) + topic filter chips (All · Space · Machines · Animals & Bodies · Earth Science · Sports)
- Selected machine scrolls into view; topic filter auto-picks first in topic
- Chart row height 40px; header/caption tightened for stage room
- Decorative `lbl*` stage captions hidden from parts list and quiz distractors

## Science / copy / label fixes
- **Pulley**: fixed pulley changes *direction*, not mechanical advantage
- Compass dial fits viewBox; sewing shows top-thread path
- Heart valve labels ≥12px; turbine grid label inside stage
- Mars sky-crane labeled; extinguisher fire base + “aim at base”
- Bees: visible waggle line during dance
- Frog: eggs / tadpole / frog stage captions
- Water: ocean label; volcano: magma / lava / ash
- Parachute canopy/jumper; candle flame/wax; flashlight beam/batteries
- Stoplight GO/SLOW/STOP; clock pendulum/escape; starship tower/booster/ship
- Gears driver/driven; bike chain/wheel; shutter blades/sensor; zipper slider/teeth

## Media
- Demo GIF caption path: `screenshots/demo.gif` (~3.9 MB)
- Demo Director: `screenshots/demo-director.gif` + `.mp4`
- Hero: `screenshots/hero-1440x900.png`
- Narrations: 36+ `narrations/*-captions.mp4`

## Tests (last green)
- unit **602** · e2e **36** · TLC/formal **28** configs · OCR clean
