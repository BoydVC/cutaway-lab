---------------------------- MODULE DoorLock ----------------------------
EXTENDS Integers
VARIABLE state
States == {"locked", "keyed", "turning", "open", "jammed"}
Init == state = "locked"
Next ==
  \/ /\ state = "locked"  /\ state' = "keyed"
  \/ /\ state = "keyed"   /\ state' = "turning"
  \/ /\ state = "keyed"   /\ state' = "jammed"
  \/ /\ state = "turning" /\ state' = "open"
  \/ /\ state \in {"open", "jammed"} /\ UNCHANGED state
Inv == state \in States
FinalSticky == [][(state \in {"open", "jammed"} => UNCHANGED state)]_state
Spec == Init /\ [][Next]_state
THEOREM Spec => []Inv /\ FinalSticky
=============================================================================
