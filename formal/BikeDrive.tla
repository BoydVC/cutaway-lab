---------------------------- MODULE BikeDrive ----------------------------
EXTENDS Integers
VARIABLE state
States == {"ready", "push", "pull", "roll", "slip"}
Init == state = "ready"
Next ==
  \/ /\ state = "ready" /\ state' = "push"
  \/ /\ state = "push"  /\ state' = "pull"
  \/ /\ state = "push"  /\ state' = "slip"
  \/ /\ state = "pull"  /\ state' = "roll"
  \/ /\ state \in {"roll", "slip"} /\ UNCHANGED state
Inv == state \in States
FinalSticky == [][(state \in {"roll", "slip"} => UNCHANGED state)]_state
Spec == Init /\ [][Next]_state
THEOREM Spec => []Inv /\ FinalSticky
=============================================================================
