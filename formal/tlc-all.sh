#!/usr/bin/env bash
set -euo pipefail
JAR="${TLA2TOOLS_JAR:-/workspace/tokenmax/project-nov5/tla/tla2tools.jar}"
ROOT="$(cd "$(dirname "$0")" && pwd)"
ok=0
for mod in FootballPlay BaseballPlay SoccerPlay LacrossePlay BasketballPlay HockeyBreakout BikeDrive TennisServe Photosynthesis GearTrain Digestion Circuit Elevator Flush Stoplight DoorLock Shutter Thermostat Zipper Sharpener Parachute Turbine Extinguisher Sewing; do
  echo "== TLC $mod =="
  java -XX:+UseParallelGC -cp "$JAR" tlc2.TLC -config "$ROOT/$mod.cfg" "$ROOT/$mod.tla" | tee "/tmp/tlc-$mod.txt" | tail -4
  grep -q "No error has been found" "/tmp/tlc-$mod.txt"
  ok=$((ok+1))
done
echo "TLC all $ok OK"
