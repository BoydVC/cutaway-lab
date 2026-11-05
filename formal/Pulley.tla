---------------------------- MODULE Pulley ----------------------------
EXTENDS Integers
VARIABLE state
States == {"ready", "lifting", "high", "slip"}
Init == state = "ready"
Next ==
  \/ /\ state = "ready"   /\ state' = "lifting"
  \/ /\ state = "lifting" /\ state' = "high"
  \/ /\ state = "lifting" /\ state' = "slip"
  \/ /\ state \in {"high", "slip"} /\ UNCHANGED state
Inv == state \in States
FinalSticky == [][(state \in {"high", "slip"} => UNCHANGED state)]_state
Spec == Init /\ [][Next]_state
THEOREM Spec => []Inv /\ FinalSticky
=============================================================================
