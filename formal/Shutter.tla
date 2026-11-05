---------------------------- MODULE Shutter ----------------------------
EXTENDS Integers
VARIABLE state
States == {"ready", "open", "expose", "done", "wash"}
Init == state = "ready"
Next ==
  \/ /\ state = "ready"  /\ state' = "open"
  \/ /\ state = "open"   /\ state' = "expose"
  \/ /\ state = "open"   /\ state' = "wash"
  \/ /\ state = "expose" /\ state' = "done"
  \/ /\ state \in {"done", "wash"} /\ UNCHANGED state
Inv == state \in States
FinalSticky == [][(state \in {"done", "wash"} => UNCHANGED state)]_state
Spec == Init /\ [][Next]_state
THEOREM Spec => []Inv /\ FinalSticky
=============================================================================
