---------------------------- MODULE Seesaw ----------------------------
EXTENDS Integers
VARIABLE state
States == {"level", "leftDown", "rightDown", "level2"}
Init == state = "level"
Next ==
  \/ /\ state = "level"    /\ state' = "leftDown"
  \/ /\ state = "level"    /\ state' = "rightDown"
  \/ /\ state = "leftDown" /\ state' = "rightDown"
  \/ /\ state = "leftDown" /\ state' = "level2"
  \/ /\ state \in {"rightDown", "level2"} /\ UNCHANGED state
Inv == state \in States
FinalSticky == [][(state \in {"rightDown", "level2"} => UNCHANGED state)]_state
Spec == Init /\ [][Next]_state
THEOREM Spec => []Inv /\ FinalSticky
=============================================================================
