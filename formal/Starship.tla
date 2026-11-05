---------------------------- MODULE Starship ----------------------------
EXTENDS Integers
VARIABLE state
States == {"pad", "ignition", "liftoff", "staging", "boostback", "catch", "scrubbed"}
Init == state = "pad"
Next ==
  \/ /\ state = "pad" /\ state' = "ignition"
  \/ /\ state = "pad" /\ state' = "scrubbed"
  \/ /\ state = "ignition" /\ state' = "liftoff"
  \/ /\ state = "liftoff" /\ state' = "staging"
  \/ /\ state = "staging" /\ state' = "boostback"
  \/ /\ state = "boostback" /\ state' = "catch"
  \/ /\ state \in {"catch", "scrubbed"} /\ UNCHANGED state
Inv == state \in States
FinalSticky == [][(state \in {"catch", "scrubbed"} => UNCHANGED state)]_state
Spec == Init /\ [][Next]_state
THEOREM Spec => []Inv /\ FinalSticky
=============================================================================
