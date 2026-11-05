---------------------------- MODULE Candle ----------------------------
EXTENDS Integers
VARIABLE state
States == {"unlit", "lighting", "burning", "out", "drown"}
Init == state = "unlit"
Next ==
  \/ /\ state = "unlit"    /\ state' = "lighting"
  \/ /\ state = "lighting" /\ state' = "burning"
  \/ /\ state = "burning"  /\ state' = "out"
  \/ /\ state = "burning"  /\ state' = "drown"
  \/ /\ state \in {"out", "drown"} /\ UNCHANGED state
Inv == state \in States
FinalSticky == [][(state \in {"out", "drown"} => UNCHANGED state)]_state
Spec == Init /\ [][Next]_state
THEOREM Spec => []Inv /\ FinalSticky
=============================================================================
