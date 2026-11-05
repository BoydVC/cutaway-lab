---------------------------- MODULE Heartbeat ----------------------------
EXTENDS Integers
VARIABLE state
States == {"fill", "atria", "ventricles", "rest"}
Init == state = "fill"
Next ==
  \/ /\ state = "fill" /\ state' = "atria"
  \/ /\ state = "fill" /\ state' = "rest"
  \/ /\ state = "atria" /\ state' = "ventricles"
  \/ /\ state = "ventricles" /\ state' = "fill"
  \/ /\ state \in {"rest"} /\ UNCHANGED state
Inv == state \in States
FinalSticky == [][(state \in {"rest"} => UNCHANGED state)]_state
Spec == Init /\ [][Next]_state
THEOREM Spec => []Inv /\ FinalSticky
=============================================================================
