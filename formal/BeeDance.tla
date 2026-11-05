---------------------------- MODULE BeeDance ----------------------------
EXTENDS Integers
VARIABLE state
States == {"search", "found", "dance", "harvest", "home"}
Init == state = "search"
Next ==
  \/ /\ state = "search" /\ state' = "found"
  \/ /\ state = "search" /\ state' = "home"
  \/ /\ state = "found" /\ state' = "dance"
  \/ /\ state = "dance" /\ state' = "harvest"
  \/ /\ state \in {"harvest", "home"} /\ UNCHANGED state
Inv == state \in States
FinalSticky == [][(state \in {"harvest", "home"} => UNCHANGED state)]_state
Spec == Init /\ [][Next]_state
THEOREM Spec => []Inv /\ FinalSticky
=============================================================================
