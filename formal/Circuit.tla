---------------------------- MODULE Circuit ----------------------------
EXTENDS Integers
VARIABLE state
States == {"open", "closed", "flow", "lit", "short"}
Init == state = "open"
Next ==
  \/ /\ state = "open"   /\ state' = "closed"
  \/ /\ state = "closed" /\ state' = "flow"
  \/ /\ state = "closed" /\ state' = "short"
  \/ /\ state = "flow"   /\ state' = "lit"
  \/ /\ state \in {"lit", "short"} /\ UNCHANGED state
Inv == state \in States
FinalSticky == [][(state \in {"lit", "short"} => UNCHANGED state)]_state
Spec == Init /\ [][Next]_state
THEOREM Spec => []Inv /\ FinalSticky
=============================================================================
