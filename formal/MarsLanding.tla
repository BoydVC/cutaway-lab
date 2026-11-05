---------------------------- MODULE MarsLanding ----------------------------
EXTENDS Integers
VARIABLE state
States == {"entry", "parachute", "powered", "skycrane", "landed", "divert"}
Init == state = "entry"
Next ==
  \/ /\ state = "entry" /\ state' = "parachute"
  \/ /\ state = "parachute" /\ state' = "powered"
  \/ /\ state = "powered" /\ state' = "skycrane"
  \/ /\ state = "powered" /\ state' = "divert"
  \/ /\ state = "skycrane" /\ state' = "landed"
  \/ /\ state = "divert" /\ state' = "skycrane"
  \/ /\ state \in {"landed"} /\ UNCHANGED state
Inv == state \in States
FinalSticky == [][(state \in {"landed"} => UNCHANGED state)]_state
Spec == Init /\ [][Next]_state
THEOREM Spec => []Inv /\ FinalSticky
=============================================================================
