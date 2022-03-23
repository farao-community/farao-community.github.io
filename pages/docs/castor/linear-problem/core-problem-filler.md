---
layout: documentation
title: Modelling CNECs and range actions
permalink: /docs/castor/linear-optimisation-problem/core-problem-filler
hide: true
root-page: Documentation
docu-section: CASTOR
docu-parent: Linear Remedial Actions Optimisation
order: 1
feature-img: "assets/img/farao3.jpg"
tags: [Docs, Search Tree RAO, CASTOR]
---

## Used input data {#input-data}

| Name | Symbol | Details |
|---|---|---|
| FlowCnecs | $$c \in \mathcal{C}$$ | set of FlowCnecs. Note that FlowCnecs are all the CBCO for which we compute the flow in the MILP, either: <br> - because we are optimizing their flow (optimized flowCnec = CNEC) <br> - because we are monitoring their flow, and ensuring it does not exceed its threshold (monitored flowCnec = MNEC) <br> - or both |
| RangeActions | $$r \in \mathcal{RA}$$ | set of RangeActions, could be PSTs, HVDCs, or injection range actions |
| ReferenceFlow | $$f_{n}(c)$$ | reference flow, for FlowCnec c. <br>The reference flow is the flow at the beginning of the current iteration of the MILP, around which the sensitivities are computed |
| PrePerimeterSetpoints | $$\alpha _0(r)$$ | setpoint of RangeAction r at the beginning of the optimization |
| ReferenceSetpoints | $$\alpha _n(r)$$ | setpoint of RangeAction r at the beginning of the current iteration of the MILP, around which the sensitivities are computed |
| Sensitivities | $$\sigma _{n}(r,c)$$ | sensitivity of RangeAction r on FlowCnec c |

## Used parameters {#parameters}

| Name | Symbol | Details | Source |
|---|---|---|---|
| sensitivityThreshold |  | Set to zero the sensitivities of RangeActions below this threshold; thus avoiding the activation of RangeActions which have too small an impact on the flows (can also be achieved with penaltyCost). This simplifies & speeds up the resolution of the optimization problem (can be necessary when the problem contains integer variables). However, it also adds an approximation in the computation of the flows within the MILP, which can be tricky to handle when the MILP contains hard constraints on loop-flows or monitored FlowCnecs. | Equal to [pst-sensitivity-threshold](/docs/parameters/json-parameters#pst-sensitivity-threshold) for PSTs, [hvdc-sensitivity-threshold](/docs/parameters/json-parameters#hvdc-sensitivity-threshold) for HVDCs, and [injection-ra-sensitivity-threshold](/docs/parameters/json-parameters#injection-ra-sensitivity-threshold) for injection range actions |
| penaltyCost | $$c^{penalty}_{ra}$$ | Supposedly a small penalization, in the use of the RangeActions. When several solutions are equivalent, this favours the one with the least change in the RangeActions' setpoints (compared to the initial situation). It also avoids the activation of RangeActions which have to small an impact on the objective function. | Equal to [pst-penalty-cost](/docs/parameters/json-parameters#pst-penalty-cost) for PSTs, [hvdc-penalty-cost](/docs/parameters/json-parameters#hvdc-penalty-cost) for HVDCs, and [injection-ra-penalty-cost](/docs/parameters/json-parameters#injection-ra-penalty-cost) for injection range actions |

## Defined optimization variables {#defined-variables}

| Name | Symbol | Details | Type | Index | Unit | Lower bound | Upper bound |
|---|---|---|---|---|---|---|---|
| Flow | $$F(c)$$ | flow of FlowCnec c | Real value | One variable for every element of (FlowCnecs) | MW | $$-\infty$$ | $$+\infty$$ |
| RA setpoint | $$A(r)$$ | setpoint of RangeAction r | Real value | One variable for every element of (RangeActions) | Degrees for PST range actions; MW for other range actions | Range lower bound[^1] | Range upper bound[^1] |
| RA setpoint absolute variation | $$\Delta A(r)$$ | The absolute setpoint variation of RangeAction r, from "PrePerimeterSetpoint" to "RA setpoint" | Real positive value | One variable for every element of (RangeActions) | Degrees for PST range actions; MW for other range actions | 0 | $$+\infty$$ |

[^1]: Range actions' lower & upper bounds are computed using CRAC + network + previous RAO results, depending on the types of their ranges: ABSOLUTE, PREVIOUS_TO_INITIAL_NETWORK, PREVIOUS_TO_INITIAL_INSTANT (more information [here](/docs/input-data/crac/json#range-actions))

## Defined constraints {#defined-constraints}

### Impact of rangeActions on FlowCnecs flows

$$
\begin{equation}
F(c) = f_{n}(c) + \sum_{r \in \mathcal{RA}} \sigma (r,c) * [A(r) - \alpha_{n}(r)] , \forall (c) \in \mathcal{C}
\end{equation}
$$  

<br>

### Definition of the absolute setpoint variations of the RangeActions

$$
\begin{equation}
\Delta A(r) \geq A(r) - \alpha_{0}(r) , \forall (r) \in \mathcal{RA}
\end{equation}
$$  

$$
\begin{equation}
\Delta A(r) \geq - A(r) + \alpha_{0}(r) , \forall (r) \in \mathcal{RA}
\end{equation}
$$  

<br>


## Contribution to the objective function {#objective-function}

Small penalisation for the use of RangeActions:  

$$
\begin{equation}
\min \sum_{r \in \mathcal{RA}} (c^{penalty}_{ra}(r) \Delta A(r))
\end{equation}
$$

---
Code reference: [CoreProblemFiller](https://github.com/farao-community/farao-core/blob/master/ra-optimisation/search-tree-rao/src/main/java/com/farao_community/farao/search_tree_rao/linear_optimisation/algorithms/fillers/CoreProblemFiller.java)

---