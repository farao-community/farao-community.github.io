---
layout: page
title: CRAC file model
permalink: /docs/data/crac
hide: true
feature-img: "assets/img/Hans_Otto_Theater_Potsdam_-_fake_colors_cut.jpg"
tags: [Docs]
---

The CRAC file model contains two main categories of objects:
- CNECs, containing the network elements to be monitored after given contingencies,
- remedial actions.

### CNEC

CNEC means *Critical Network Element & Contingency* as defined in the literature. It associates a **network element** with a **state**: it represents a network element at a specific instant in preventive state or after a contingency.

A CNEC is associated to **thresholds**. These thresholds can be of different types according to the considered network element, so that flows, voltage levels and angles can be monitored on these CNECs. Flow thresholds would rather be associated to lines and voltage and angle thresholds would rather be associated to nodes.

### Remedial action

#### Range action

Range actions are actions on the network with a degree of freedom: the choice of a **setpoint** within a given range. These actions can be optimized linearly, with some approximations. For more information related to the linear optimization of range actions in FARAO, please refer to the [dedicated documentation page](/docs/engine/ra-optimisation/linear-rao).

They can be defined on some categories of network elements:
- Phase Shift Transformer (PST),
- HVDC line,
- Production unit.

The determination of the optimal setpoint improving a network situation requires some data:
- the current value in a specified network,
- the minimal reachable value according to the specified network – or the maximal authorized variation for a decreasing variation,
- the maximal reachable value according to the specified network – or the maximal authorized variation for an increasing variation,
- the sensitivity of a setpoint variation on every cnec for the specified nework.

#### Network action

Network actions are any other kind of action on the network, such as the opening/closing of a network element, forcing the tap of a PST to a given value, etc. They are used in the [search-tree RAO](/docs/engine/ra-optimisation/search-tree-rao) only.
