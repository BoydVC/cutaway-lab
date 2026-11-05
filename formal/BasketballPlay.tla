---------------------------- MODULE BasketballPlay ----------------------------
EXTENDS Integers
VARIABLE state
States == {"iso", "screen", "turn", "dish", "switch"}
Init == state = "iso"
Next ==
  \/ /\ state = "iso"    /\ state' = "screen"
  \/ /\ state = "screen" /\ state' = "turn"
  \/ /\ state = "screen" /\ state' = "switch"
  \/ /\ state = "turn"   /\ state' = "dish"
  \/ /\ state \in {"dish", "switch"} /\ UNCHANGED state
Inv == state \in States
FinalSticky == [][(state \in {"dish", "switch"} => UNCHANGED state)]_state
Spec == Init /\ [][Next]_state
THEOREM Spec => []Inv /\ FinalSticky
=============================================================================
