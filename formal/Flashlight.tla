---------------------------- MODULE Flashlight ----------------------------
EXTENDS Integers
VARIABLE state
States == {"off", "closing", "on", "off2", "dead"}
Init == state = "off"
Next ==
  \/ /\ state = "off"     /\ state' = "closing"
  \/ /\ state = "closing" /\ state' = "on"
  \/ /\ state = "on"      /\ state' = "off2"
  \/ /\ state = "on"      /\ state' = "dead"
  \/ /\ state \in {"off2", "dead"} /\ UNCHANGED state
Inv == state \in States
FinalSticky == [][(state \in {"off2", "dead"} => UNCHANGED state)]_state
Spec == Init /\ [][Next]_state
THEOREM Spec => []Inv /\ FinalSticky
=============================================================================
