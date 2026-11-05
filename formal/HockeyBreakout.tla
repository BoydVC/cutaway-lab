---------------------------- MODULE HockeyBreakout ----------------------------
EXTENDS Integers
VARIABLE state
States == {"retrieve", "outlet", "zoneExit", "stretch", "chip"}
Init == state = "retrieve"
Next ==
  \/ /\ state = "retrieve" /\ state' = "outlet"
  \/ /\ state = "retrieve" /\ state' = "chip"
  \/ /\ state = "outlet"   /\ state' = "zoneExit"
  \/ /\ state = "zoneExit" /\ state' = "stretch"
  \/ /\ state \in {"stretch", "chip"} /\ UNCHANGED state
Inv == state \in States
FinalSticky == [][(state \in {"stretch", "chip"} => UNCHANGED state)]_state
Spec == Init /\ [][Next]_state
THEOREM Spec => []Inv /\ FinalSticky
=============================================================================
