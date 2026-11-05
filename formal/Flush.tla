---------------------------- MODULE Flush ----------------------------
EXTENDS Integers
VARIABLE state
States == {"ready", "lift", "siphon", "refill", "stuck"}
Init == state = "ready"
Next ==
  \/ /\ state = "ready"  /\ state' = "lift"
  \/ /\ state = "lift"   /\ state' = "siphon"
  \/ /\ state = "lift"   /\ state' = "stuck"
  \/ /\ state = "siphon" /\ state' = "refill"
  \/ /\ state \in {"refill", "stuck"} /\ UNCHANGED state
Inv == state \in States
FinalSticky == [][(state \in {"refill", "stuck"} => UNCHANGED state)]_state
Spec == Init /\ [][Next]_state
THEOREM Spec => []Inv /\ FinalSticky
=============================================================================
