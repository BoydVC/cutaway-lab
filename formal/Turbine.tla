---------------------------- MODULE Turbine ----------------------------
EXTENDS Integers
VARIABLE state
States == {"calm", "cutin", "spinning", "generating", "braking"}
Init == state = "calm"
Next ==
  \/ /\ state = "calm"     /\ state' = "cutin"
  \/ /\ state = "cutin"    /\ state' = "spinning"
  \/ /\ state = "spinning" /\ state' = "generating"
  \/ /\ state = "spinning" /\ state' = "braking"
  \/ /\ state \in {"generating", "braking"} /\ UNCHANGED state
Inv == state \in States
FinalSticky == [][(state \in {"generating", "braking"} => UNCHANGED state)]_state
Spec == Init /\ [][Next]_state
THEOREM Spec => []Inv /\ FinalSticky
=============================================================================
