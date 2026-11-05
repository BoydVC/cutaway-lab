---------------------------- MODULE Volcano ----------------------------
EXTENDS Integers
VARIABLE state
States == {"sleep", "rise", "erupt", "newRock", "sleep_again"}
Init == state = "sleep"
Next ==
  \/ /\ state = "sleep" /\ state' = "rise"
  \/ /\ state = "rise" /\ state' = "erupt"
  \/ /\ state = "rise" /\ state' = "sleep_again"
  \/ /\ state = "erupt" /\ state' = "newRock"
  \/ /\ state \in {"newRock", "sleep_again"} /\ UNCHANGED state
Inv == state \in States
FinalSticky == [][(state \in {"newRock", "sleep_again"} => UNCHANGED state)]_state
Spec == Init /\ [][Next]_state
THEOREM Spec => []Inv /\ FinalSticky
=============================================================================
