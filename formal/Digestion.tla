---------------------------- MODULE Digestion ----------------------------
EXTENDS Integers
VARIABLE state
States == {"bite", "swallow", "churn", "absorb", "choke"}
Init == state = "bite"
Next ==
  \/ /\ state = "bite"    /\ state' = "swallow"
  \/ /\ state = "swallow" /\ state' = "churn"
  \/ /\ state = "swallow" /\ state' = "choke"
  \/ /\ state = "churn"   /\ state' = "absorb"
  \/ /\ state \in {"absorb", "choke"} /\ UNCHANGED state
Inv == state \in States
FinalSticky == [][(state \in {"absorb", "choke"} => UNCHANGED state)]_state
Spec == Init /\ [][Next]_state
THEOREM Spec => []Inv /\ FinalSticky
=============================================================================
