---------------------------- MODULE Sharpener ----------------------------
EXTENDS Integers
VARIABLE state
States == {"empty", "loaded", "shaving", "sharp", "broken"}
Init == state = "empty"
Next ==
  \/ /\ state = "empty"   /\ state' = "loaded"
  \/ /\ state = "loaded"  /\ state' = "shaving"
  \/ /\ state = "loaded"  /\ state' = "broken"
  \/ /\ state = "shaving" /\ state' = "sharp"
  \/ /\ state \in {"sharp", "broken"} /\ UNCHANGED state
Inv == state \in States
FinalSticky == [][(state \in {"sharp", "broken"} => UNCHANGED state)]_state
Spec == Init /\ [][Next]_state
THEOREM Spec => []Inv /\ FinalSticky
=============================================================================
