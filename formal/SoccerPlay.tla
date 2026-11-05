---------------------------- MODULE SoccerPlay ----------------------------
\* Mirrors machines/soccer.js — overlap run
EXTENDS Integers
VARIABLE state
States == {"build", "overlap", "pass", "cross", "cutInside"}
Init == state = "build"
Next ==
  \/ /\ state = "build"    /\ state' = "overlap"
  \/ /\ state = "overlap"  /\ state' = "pass"
  \/ /\ state = "overlap"  /\ state' = "cutInside"
  \/ /\ state = "pass"     /\ state' = "cross"
  \/ /\ state \in {"cross", "cutInside"} /\ UNCHANGED state
Inv == state \in States
FinalSticky == [][(state \in {"cross", "cutInside"} => UNCHANGED state)]_state
Spec == Init /\ [][Next]_state
THEOREM Spec => []Inv /\ FinalSticky
=============================================================================
