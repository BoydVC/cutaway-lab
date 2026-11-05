---------------------------- MODULE FootballPlay ----------------------------
\* Cutaway Lab — Football play-action pass statechart, formalized.
\* Spec mirrors machines/football.js. Model-check with TLC if available;
\* the Node mirror in formal/check.js is the CI gate on the box.
EXTENDS Integers, FiniteSets, Sequences

States == {"huddle", "snap", "fake", "throw", "catch", "checkdown"}
Events == {"SNAP", "FAKE", "THROW", "CATCH", "AUDIBLE"}

VARIABLE state

TypeOK == state \in States

Init == state = "huddle"

Next ==
  \/ /\ state = "huddle" /\ state' = "snap"
  \/ /\ state = "snap"   /\ state' = "fake"
  \/ /\ state = "snap"   /\ state' = "checkdown"
  \/ /\ state = "fake"   /\ state' = "throw"
  \/ /\ state = "throw"  /\ state' = "catch"
  \/ /\ state \in {"catch", "checkdown"} /\ UNCHANGED state

\* Main path reaches a scoring final.
MainPathOK == <>(state = "catch")

\* Side path is reachable and terminal.
SidePathOK == <>(state = "checkdown")

\* No mystery states.
Inv == TypeOK

\* Once finished, stay finished.
FinalSticky == [][(state \in {"catch", "checkdown"} => UNCHANGED state)]_state

Spec == Init /\ [][Next]_state

THEOREM Spec => []Inv /\ FinalSticky
=============================================================================
