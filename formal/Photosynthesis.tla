---------------------------- MODULE Photosynthesis ----------------------------
EXTENDS Integers
VARIABLE state
States == {"idle", "light", "sip", "cook", "wilt"}
Init == state = "idle"
Next ==
  \/ /\ state = "idle"  /\ state' = "light"
  \/ /\ state = "light" /\ state' = "sip"
  \/ /\ state = "sip"   /\ state' = "cook"
  \/ /\ state = "sip"   /\ state' = "wilt"
  \/ /\ state \in {"cook", "wilt"} /\ UNCHANGED state
Inv == state \in States
FinalSticky == [][(state \in {"cook", "wilt"} => UNCHANGED state)]_state
Spec == Init /\ [][Next]_state
THEOREM Spec => []Inv /\ FinalSticky
=============================================================================
