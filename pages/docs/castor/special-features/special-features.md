---
layout: documentation
title: Special features
permalink: /docs/engine/ra-optimisation/special-features
hide: true
root-page: Documentation
docu-section: CASTOR
docu-parent: CASTOR
order: 2
feature-img: "assets/img/farao3.jpg"
tags: [Docs, Search Tree RAO, CASTOR]
summary-hmax: 0
---

Several special features can be included in the RAO optimization :
- limiting loop-flows on cross-zonal cnecs 
- monitoring (rather than optimizing) the flow on certain FlowCnecs (MNECs)
- not taking into account certain FlowCnecs - under specific conditions - for the computation of the minimum margin in the objective function

The objective function value is separated into two categories :
- the **functional** cost reflects the business value of the objective (e.g. the cost associated to the minimum margin and the business penalties on usage of remedial actions)
- the **virtual** cost reflects the violation of some constraints. The first two special features (e.g. loop-flows & MNECs) are handled via the virtual cost.