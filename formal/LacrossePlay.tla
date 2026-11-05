---------------------------- MODULE LacrossePlay ----------------------------
\* Mirrors machines/lacrosse.js — fast break
EXTENDS Integers
VARIABLE state
States == {"save", "clear", "push", "dish", "reset"}
Init == state = "save"
Next ==
  \/ /\ state = "save"  /\ state' = "clear"
  \/ /\ state = "clear" /\ state' = "push"
  \/ /\ state = "clear" /\ state' = "reset"
  \/ /\ state = "push"  /\ state' = "dish"
  \/ /\ state \in {"dish", "reset"} /\ UNCHANGED state
Inv == state \in States
FinalSticky == [][(state \in {"dish", "reset"} => UNCHANGED state)]_state
Spec == Init /\ [][Next]_state
THEOREM Spec => []Inv /\ FinalSticky
=============================================================================
