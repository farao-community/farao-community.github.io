---
layout: documentation
title: Do not optimize specific CNECs
permalink: /docs/engine/ra-optimisation/do-not-optimize-specific-cnecs
hide: true
root-page: Documentation
docu-section: CASTOR
docu-parent: Special features
order: 3
feature-img: "assets/img/farao3.jpg"
tags: [Docs, Search Tree RAO, CASTOR]
see-also: | 
    [Not optimized CNECs](/docs/parameters#do-not-optimize-specific-cnecs)
---

### Definition
Some FlowCnecs $$\mathcal{C} ^{specific}$$ can be omitted from the optimization for two reasons:
- Curative cnecs from TSOs not sharing any curative remedial actions are not taken into account when looking for the minimum margin in the objective function,
as long as the applied curative remedial actions decrease these cnecs' margins (compared to their margins before
applying any curative action).  In other words, other TSOs' curative remedial actions will not be used to relieve
cnecs from TSOs not sharing curative remedial actions, except when the former TSOs' remedial actions have a negative impact on the latter TSOs' cnecs. (see [do-not-optimize-curative-cnecs-for-tsos-without-cras](/docs/parameters#do-not-optimize-curative-cnecs-for-tsos-without-cras))
- Cnecs defined as in series with a PST (see [do-not-optimize-cnec-secured-by-its-pst](/docs/parameters#do-not-optimize-cnec-secured-by-its-pst))
are not taken into account when looking for the minimum margin in the objective function, as long as these CNEC have a positive margin or a margin 
that could be secured by the action of the PST they are in series with. In other words, they will only be
    taken into account if the PST has too few tap positions left to reduce the flow constraints on these CNECs.

### Implementation
Both these situations can be modelled with constraints activating a binary variable when it becomes necessary to loosen the following constraint:
- Cnecs in $$\mathcal{C} ^{specific}$$ must not see their margins' worsened
- Cnecs in $$\mathcal{C} ^{specific}$$ are secure or can be secured if their associated PST is shifted

This binary variable forces cnecs in $$\mathcal{C} ^{specific}$$  to be taken into account in the minimum margin objective.
These constraints are modelled in the RAO under the linear problem as:
- [Modelling un-optimized CNECs (CRAs)](/docs/castor/linear-optimisation-problem/unoptimized-cnec-filler-cra)
- [Modelling un-optimized CNECs (PSTs)](/docs/castor/linear-optimisation-problem/unoptimized-cnec-filler-pst)