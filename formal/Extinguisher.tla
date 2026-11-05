---------------------------- MODULE Extinguisher ----------------------------
EXTENDS Integers
VARIABLE state
States == {"ready", "armed", "aimed", "spraying", "empty"}
Init == state = "ready"
Next ==
  \/ /\ state = "ready"  /\ state' = "armed"
  \/ /\ state = "armed"  /\ state' = "aimed"
  \/ /\ state = "armed"  /\ state' = "empty"
  \/ /\ state = "aimed"  /\ state' = "spraying"
  \/ /\ state \in {"spraying", "empty"} /\ UNCHANGED state
Inv == state \in States
FinalSticky == [][(state \in {"spraying", "empty"} => UNCHANGED state)]_state
Spec == Init /\ [][Next]_state
THEOREM Spec => []Inv /\ FinalSticky
=============================================================================
