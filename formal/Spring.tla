---------------------------- MODULE Spring ----------------------------
EXTENDS Integers
VARIABLE state
States == {"rest", "compress", "launch", "held"}
Init == state = "rest"
Next ==
  \/ /\ state = "rest"     /\ state' = "compress"
  \/ /\ state = "compress" /\ state' = "launch"
  \/ /\ state = "compress" /\ state' = "held"
  \/ /\ state \in {"launch", "held"} /\ UNCHANGED state
Inv == state \in States
FinalSticky == [][(state \in {"launch", "held"} => UNCHANGED state)]_state
Spec == Init /\ [][Next]_state
THEOREM Spec => []Inv /\ FinalSticky
=============================================================================
