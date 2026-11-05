---------------------------- MODULE BaseballPlay ----------------------------
\* Mirrors machines/baseball.js — 6-4-3 double play
EXTENDS Integers
VARIABLE state
States == {"pitch", "grounder", "toSecond", "toFirst", "twinKill", "safe"}
Init == state = "pitch"
Next ==
  \/ /\ state = "pitch"    /\ state' = "grounder"
  \/ /\ state = "grounder" /\ state' = "toSecond"
  \/ /\ state = "grounder" /\ state' = "safe"
  \/ /\ state = "toSecond" /\ state' = "toFirst"
  \/ /\ state = "toFirst"  /\ state' = "twinKill"
  \/ /\ state \in {"twinKill", "safe"} /\ UNCHANGED state
Inv == state \in States
FinalSticky == [][(state \in {"twinKill", "safe"} => UNCHANGED state)]_state
Spec == Init /\ [][Next]_state
THEOREM Spec => []Inv /\ FinalSticky
=============================================================================
