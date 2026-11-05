---------------------------- MODULE Elevator ----------------------------
EXTENDS Integers
VARIABLE state
States == {"idle", "closing", "moving", "open", "reopen"}
Init == state = "idle"
Next ==
  \/ /\ state = "idle"    /\ state' = "closing"
  \/ /\ state = "closing" /\ state' = "moving"
  \/ /\ state = "closing" /\ state' = "reopen"
  \/ /\ state = "moving"  /\ state' = "open"
  \/ /\ state \in {"open", "reopen"} /\ UNCHANGED state
Inv == state \in States
FinalSticky == [][(state \in {"open", "reopen"} => UNCHANGED state)]_state
Spec == Init /\ [][Next]_state
THEOREM Spec => []Inv /\ FinalSticky
=============================================================================
