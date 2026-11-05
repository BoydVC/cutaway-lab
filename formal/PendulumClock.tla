---------------------------- MODULE PendulumClock ----------------------------
EXTENDS Integers
VARIABLE state
States == {"wound", "tickLeft", "tickRight", "stopped"}
Init == state = "wound"
Next ==
  \/ /\ state = "wound" /\ state' = "tickLeft"
  \/ /\ state = "wound" /\ state' = "stopped"
  \/ /\ state = "tickLeft" /\ state' = "tickRight"
  \/ /\ state = "tickRight" /\ state' = "stopped"
  \/ /\ state = "tickRight" /\ state' = "tickLeft"
  \/ /\ state \in {"stopped"} /\ UNCHANGED state
Inv == state \in States
FinalSticky == [][(state \in {"stopped"} => UNCHANGED state)]_state
Spec == Init /\ [][Next]_state
THEOREM Spec => []Inv /\ FinalSticky
=============================================================================
