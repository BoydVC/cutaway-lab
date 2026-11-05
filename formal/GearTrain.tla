---------------------------- MODULE GearTrain ----------------------------
EXTENDS Integers
VARIABLE state
States == {"rest", "turn", "mesh", "ratio", "slip"}
Init == state = "rest"
Next ==
  \/ /\ state = "rest"  /\ state' = "turn"
  \/ /\ state = "turn"  /\ state' = "mesh"
  \/ /\ state = "turn"  /\ state' = "slip"
  \/ /\ state = "mesh"  /\ state' = "ratio"
  \/ /\ state \in {"ratio", "slip"} /\ UNCHANGED state
Inv == state \in States
FinalSticky == [][(state \in {"ratio", "slip"} => UNCHANGED state)]_state
Spec == Init /\ [][Next]_state
THEOREM Spec => []Inv /\ FinalSticky
=============================================================================
