---
layout: documentation
title: CRAC file model
permalink: /docs/data/crac
hide: true
feature-img: "assets/img/Hans_Otto_Theater_Potsdam_-_fake_colors_cut.jpg"
tags: [Docs]
category: Business data
---

### CNEC

CNEC means *Critical Network Element & Contingency* as defined in the literature. It associates a **network element** with a **state**: it represents a network element at a specific instant in preventive state or after a contingency.

A CNEC corresponds to a constraint in the optimization problem, so it is associated to **thresholds**. These thresholds can be of different types according to the considered network element, so that flows, voltage levels and angles can be monitored on these CNECs. Flow thresholds would rather be associated to lines and voltage and angle thresholds would rather be associated to nodes.


### Range action

Range actions are actions on the network with a degree of freedom, also called **setpoint**. These actions can be optimized linearly, with some approximations. For more information related to the linear optimization of range actions in FARAO, please refer to the [dedicated documentation page](/docs/engine/ra-optimisation/branch-and-bound/linear-rao).

They can be defined an some categories of network elements:
- Phase Shift Transformer (PST)
- HVDC line
- Production group

The determination optimal setpoint improving a network situation requires some data:
- the current value in a specified network,
- the minimal reachable value according to the specified network – or the maximal authorized variation for a decreasing variation,
- the maximal reachable value according to the specified network – or the maximal authorized variation for an increasing variation,
- the sensitivity of a setpoint variation on every cnec for the specified nework.
