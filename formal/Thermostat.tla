---------------------------- MODULE Thermostat ----------------------------
EXTENDS Integers
VARIABLE state
States == {"idle", "call", "heating", "satisfied", "fault"}
Init == state = "idle"
Next ==
  \/ /\ state = "idle"    /\ state' = "call"
  \/ /\ state = "call"    /\ state' = "heating"
  \/ /\ state = "call"    /\ state' = "fault"
  \/ /\ state = "heating" /\ state' = "satisfied"
  \/ /\ state \in {"satisfied", "fault"} /\ UNCHANGED state
Inv == state \in States
FinalSticky == [][(state \in {"satisfied", "fault"} => UNCHANGED state)]_state
Spec == Init /\ [][Next]_state
THEOREM Spec => []Inv /\ FinalSticky
=============================================================================
