---------------------------- MODULE Stoplight ----------------------------
EXTENDS Integers
VARIABLE state
States == {"green", "yellow", "red", "skip"}
Init == state = "green"
Next ==
  \/ /\ state = "green"  /\ state' = "yellow"
  \/ /\ state = "green"  /\ state' = "skip"
  \/ /\ state = "yellow" /\ state' = "red"
  \/ /\ state \in {"red", "skip"} /\ UNCHANGED state
Inv == state \in States
FinalSticky == [][(state \in {"red", "skip"} => UNCHANGED state)]_state
Spec == Init /\ [][Next]_state
THEOREM Spec => []Inv /\ FinalSticky
=============================================================================
