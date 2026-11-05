---------------------------- MODULE FrogCycle ----------------------------
EXTENDS Integers
VARIABLE state
States == {"eggs", "tadpole", "legs", "froglet", "adult", "eaten"}
Init == state = "eggs"
Next ==
  \/ /\ state = "eggs" /\ state' = "tadpole"
  \/ /\ state = "eggs" /\ state' = "eaten"
  \/ /\ state = "tadpole" /\ state' = "legs"
  \/ /\ state = "legs" /\ state' = "froglet"
  \/ /\ state = "froglet" /\ state' = "adult"
  \/ /\ state \in {"adult", "eaten"} /\ UNCHANGED state
Inv == state \in States
FinalSticky == [][(state \in {"adult", "eaten"} => UNCHANGED state)]_state
Spec == Init /\ [][Next]_state
THEOREM Spec => []Inv /\ FinalSticky
=============================================================================
