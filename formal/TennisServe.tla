---------------------------- MODULE TennisServe ----------------------------
EXTENDS Integers
VARIABLE state
States == {"ready", "toss", "trophy", "drop", "brush", "fault"}
Init == state = "ready"
Next ==
  \/ /\ state = "ready"  /\ state' = "toss"
  \/ /\ state = "toss"   /\ state' = "trophy"
  \/ /\ state = "toss"   /\ state' = "fault"
  \/ /\ state = "trophy" /\ state' = "drop"
  \/ /\ state = "drop"   /\ state' = "brush"
  \/ /\ state \in {"brush", "fault"} /\ UNCHANGED state
Inv == state \in States
FinalSticky == [][(state \in {"brush", "fault"} => UNCHANGED state)]_state
Spec == Init /\ [][Next]_state
THEOREM Spec => []Inv /\ FinalSticky
=============================================================================
