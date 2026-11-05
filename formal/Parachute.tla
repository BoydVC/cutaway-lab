---------------------------- MODULE Parachute ----------------------------
EXTENDS Integers
VARIABLE state
States == {"freefall", "deploy", "inflated", "landed", "tangle"}
Init == state = "freefall"
Next ==
  \/ /\ state = "freefall"  /\ state' = "deploy"
  \/ /\ state = "deploy"    /\ state' = "inflated"
  \/ /\ state = "deploy"    /\ state' = "tangle"
  \/ /\ state = "inflated"  /\ state' = "landed"
  \/ /\ state \in {"landed", "tangle"} /\ UNCHANGED state
Inv == state \in States
FinalSticky == [][(state \in {"landed", "tangle"} => UNCHANGED state)]_state
Spec == Init /\ [][Next]_state
THEOREM Spec => []Inv /\ FinalSticky
=============================================================================
