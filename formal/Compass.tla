---------------------------- MODULE Compass ----------------------------
EXTENDS Integers
VARIABLE state
States == {"rest", "north", "bearing", "skew"}
Init == state = "rest"
Next ==
  \/ /\ state = "rest"  /\ state' = "north"
  \/ /\ state = "north" /\ state' = "bearing"
  \/ /\ state = "north" /\ state' = "skew"
  \/ /\ state \in {"bearing", "skew"} /\ UNCHANGED state
Inv == state \in States
FinalSticky == [][(state \in {"bearing", "skew"} => UNCHANGED state)]_state
Spec == Init /\ [][Next]_state
THEOREM Spec => []Inv /\ FinalSticky
=============================================================================
