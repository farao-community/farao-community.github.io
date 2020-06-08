---
layout: page
title: Curative and Second Preventive
permalink: /docs/engine/ra-optimisation/curative
hide: true
docu: true
docu-parent: Search tree RAO
order: 1
feature-img: "assets/img/Hans_Otto_Theater_Potsdam_-_fake_colors_cut.jpg"
tags: [Docs, Search Tree RAO]
---

## Preventive and curative parameters (Coming later on...)

To be able to face the combinatorial complexity of the problem, without having to simplify / linearize the impact of 
the available remedial actions available, the problem is divided into preventive and curative perimeters.
The definition of CNEC and associated usage rules allows to distinguish three temporal situations or instants in the problem:

- “Before outage situation”: immediately before the occurrence of a fault. 
- “After outage situation”: immediately after the occurrence of a fault and prior to the potential application 
of post-fault/curative actions (if applicable).
- “After curative situations”: grid situations which follow the application of post-fault/curative actions 
(if applicable) in the case of a particular contingency.

This leads to the consideration of different optimisation perimeters. Each perimeter calls for the application of one 
set of remedial actions. The preventive perimeter is the first computed. Optimisation will try to maximise the objective 
function value on this first perimeter. Then, each contingency in curative defines one perimeter of curative optimisation. 
Optimisation will try to maximize the objective function value of each of these perimeters.

The preventive perimeter is formed by:

- CNE of the “before outage situation” defined with a limit of type PATL. This correspond to the so called “N state” situation. 
- CNECs of the “after outage situation” defined with a limit of type TATL.

Overloads potentially reached on this perimeter are to be solved with preventive actions.

A curative perimeter is defined for each defined contingency. Each curative perimeter is formed by:
- CNECs of the “after curative situation” defined with a limit of type PATL. All CNECs are “linked” with the same contingency.

Overloads potentially reached on this perimeter are to be solved with curative actions. Preventive action already applied 
in the “after outage situation” have to be considered in this situation (from the starting point of the curative perimeter).

Note that different post-fault temporal situations could be defined. For example: the special protection schemes (SPS) 
are post-fault actions generally triggered a very short time after the occurrence of a fault (a few seconds). Curative 
actions are generally applied after a longer time (operator decision).

This separation between the perimeters is justified by the fact that curative remedial actions are sufficient to solve 
the constraints which may appear in the curative situation (but were not already treated at preventive stage due to higher 
admissible limit).

Only TSOs owning curative actions allow CNECs to have a TATL which exceeds the PATL value. Operating the system with 
curative actions allows to temporarily overload a line. This allows more flexibility on grid operations.

Operationally, curative actions are sized in order to overcome the difference between these two limits (TATL-PATL). 
While during preventive action, only TATL has to be respected (active flow should remain below this value), curative 
actions if properly sized, should be able to reduce the active flow in order to respect the PATL value. 
Where curative actions are not sized properly and not sufficient to respect the two limits, FARAO will then investigate 
additional preventive remedial actions.

Therefore, preventive optimisation is more permissive with CNEC defined with a TATL larger than the PATL: this allows 
preventive optimisation to focus preferably on CNECs with low TATL (in particular where TSOs do not define curative 
actions). When switching to the curative problem, the PATL now applies, the potential negative impact of previously 
found preventive actions (limited by the consideration of TATL) should be overcome by the available curative actions.

In the example below, preventive action applied might have a negative impact on a particular CNEC (if the objective function 
value can be increased through the application of this action) when compared with the initial situation: 

- The flow in “1- initial situation” is lower than in “2- after outage”, the margin is positive in both situations 
(PATL for 1, TATL for 2). But flow in situation 2 is higher than in situation 1 on this particular CNEC.
- When studying the flow in curative (“3- After curative”), PATL applies, and the CNEC is initially seen in overload 
against this limit due to applied preventive actions. Curative actions should then normally make the flow go below the PATL value.

![Different thresholds for different instants](/assets/img/curative1.png)

## Extension of the preventive perimeter to the curative situation when no curative actions are available

The availability of curative actions is first assessed prior to the preventive optimisation:
In the case where no curative action is available for one particular CNEC which is to be described in the curative 
problem, the curative CNEC will be treated directly within the preventive optimisation perimeter (outage 2 in figure below).
As a result, the current limit considered in the preventive optimisation of this particular CNEC will correspond 
to the PATL and not the TATL.

This ensures that the optimisation avoids finding a preventive solution where the flow of this CNEC would lie between 
the PATL and TATL value. If such preventive solution were selected, due to the unavailability of curative action, the 
flow in curative would remain higher than the PATL value, which would correspond to an overload on the grid element 
(situation for Outage 2 in the figure below).

![Curative CNEC in preventive example](/assets/img/curative2.png)