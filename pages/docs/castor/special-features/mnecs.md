---
layout: documentation
title: MNECs
permalink: /docs/engine/ra-optimisation/mnecs
hide: true
root-page: Documentation
docu-section: CASTOR
docu-parent: Special features
order: 2
feature-img: "assets/img/farao3.jpg"
tags: [Docs, Search Tree RAO, CASTOR]
see-also: | 
    [MNEC parameters](/docs/parameters#mnec-parameters)
---

### Definition
MNECs (Monitored Network Elements) are monitored rather than optimised, see [Optimised and monitored CNECs](/docs/input-data/crac/json#optimised-vs-monitored)
Their margin must be kept positive or above its initial value.

### Implementation
MNEC constraints are modelled in the RAO under the linear problem as [MNEC constraints](/docs/castor/linear-optimisation-problem/mnec-filler).