---------------------------- MODULE Sewing ----------------------------
EXTENDS Integers
VARIABLE state
States == {"threaded", "down", "loop", "stitch", "jam"}
Init == state = "threaded"
Next ==
  \/ /\ state = "threaded" /\ state' = "down"
  \/ /\ state = "down"     /\ state' = "loop"
  \/ /\ state = "down"     /\ state' = "jam"
  \/ /\ state = "loop"     /\ state' = "stitch"
  \/ /\ state \in {"stitch", "jam"} /\ UNCHANGED state
Inv == state \in States
FinalSticky == [][(state \in {"stitch", "jam"} => UNCHANGED state)]_state
Spec == Init /\ [][Next]_state
THEOREM Spec => []Inv /\ FinalSticky
=============================================================================
