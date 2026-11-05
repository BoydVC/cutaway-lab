---------------------------- MODULE WaterCycle ----------------------------
EXTENDS Integers
VARIABLE state
States == {"ocean", "evaporate", "condense", "precip", "collect"}
Init == state = "ocean"
Next ==
  \/ /\ state = "ocean" /\ state' = "evaporate"
  \/ /\ state = "evaporate" /\ state' = "condense"
  \/ /\ state = "condense" /\ state' = "precip"
  \/ /\ state = "condense" /\ state' = "evaporate"
  \/ /\ state = "precip" /\ state' = "collect"
  \/ /\ state \in {"collect"} /\ UNCHANGED state
Inv == state \in States
FinalSticky == [][(state \in {"collect"} => UNCHANGED state)]_state
Spec == Init /\ [][Next]_state
THEOREM Spec => []Inv /\ FinalSticky
=============================================================================
