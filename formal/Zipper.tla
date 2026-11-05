---------------------------- MODULE Zipper ----------------------------
EXTENDS Integers
VARIABLE state
States == {"open", "meshing", "half", "closed", "snag"}
Init == state = "open"
Next ==
  \/ /\ state = "open"    /\ state' = "meshing"
  \/ /\ state = "meshing" /\ state' = "half"
  \/ /\ state = "meshing" /\ state' = "snag"
  \/ /\ state = "half"    /\ state' = "closed"
  \/ /\ state \in {"closed", "snag"} /\ UNCHANGED state
Inv == state \in States
FinalSticky == [][(state \in {"closed", "snag"} => UNCHANGED state)]_state
Spec == Init /\ [][Next]_state
THEOREM Spec => []Inv /\ FinalSticky
=============================================================================
