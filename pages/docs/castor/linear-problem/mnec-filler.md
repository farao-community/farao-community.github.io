---
layout: documentation
title: Modelling MNECs and their virtual cost
permalink: /docs/castor/linear-optimisation-problem/mnec-filler
hide: true
root-page: Documentation
docu-section: CASTOR
docu-parent: Linear Remedial Actions Optimisation
order: 5
feature-img: "assets/img/farao3.jpg"
tags: [Docs, Search Tree RAO, CASTOR]
---

## Used input data {#input-data}

| Name | Symbol | Details |
|---|---|---|
| MonitoredFlowCnecs | $$c \in \mathcal{C} ^{m}$$ | Set of FlowCnecs which are ['monitored'](/docs/input-data/crac/json#optimised-vs-monitored). MonitoredFlowCnecs is a subset of [FlowCnecs](core-problem-filler#input-data): $$\mathcal{C} ^{o} \subset \mathcal{C}$$ |
| Initial flow | $$f_{0} (c)$$ | flow before RAO of MonitoredFlowCnec c, in MW |
| Upper threshold | $$f^{+}_{threshold} (c)$$ | Upper threshold of FlowCnec c, in MW, defined in the CRAC |
| Lower threshold | $$f^{-}_{threshold} (c)$$ | Lower threshold of FlowCnec c, in MW, defined in the CRAC |

## Used parameters {#parameters}

| Name | Symbol | Details |
|---|---|---|
| [rao-with-mnec-limitation](/docs/parameters/json-parameters#rao-with-mnec-limitation) |  | This filler is only used if this parameter is activated |
| [mnec-acceptable-margin-diminution](/docs/parameters/json-parameters#mnec-acceptable-margin-diminution) | $$c^{acc-augm}_{m}$$ | The decrease of the initial margin that is allowed by the optimisation on MNECs.  |
| [mnec-constraint-adjustment-coefficient](/docs/parameters/json-parameters#mnec-constraint-adjustment-coefficient) | $$c^{adj-coeff}_{m}$$ | This coefficient is here to mitigate the approximation made by the linear optimization (approximation = use of sensitivities to linearize the flows, rounding of the PST taps). <br> It tightens the MNEC constraint, in order to take some margin for that constraint to stay respected once the approximations are removed (i.e. taps have been rounded and real flow calculated) |
| [mnec-violation-cost](/docs/parameters/json-parameters#mnec-violation-cost) | $$c^{penalty}_{lf}$$ | penalisation, in the objective function, of the excess of 1 MW of a MNEC flow |

## Defined optimization variables {#defined-variables}

| Name | Symbol | Details | Type | Index | Unit | Lower bound | Upper bound |
|---|---|---|---|---|---|---|---|
| MNEC excess | $$S^{m} (c)$$ | Slack variable for the MNEC constraint of FlowCnec c. <br> Defines the amount of MW by which a MNEC constraint has been violated. <br> This makes the MNEC constraints soft. | Real value | One variable for every element of (MonitoredFlowCnecs) | MW | 0 | $$+\infty$$ |

## Used optimization variables {#used-variables}

| Name | Symbol | Defined in |
|---|---|---|
| Flow | $$F(c)$$ | [CoreProblemFiller](core-problem-filler#defined-variables) |

## Defined constraints {#defined-constraints}

### Keeping the MNEC margin positive or above its initial value

$$
\begin{equation}
F(c) <= \overline{f(c)} + S^{m} (c) , \forall c \in \mathcal{C} ^{m}
\end{equation}
$$  

$$
\begin{equation}
F(c) >= \underline{f(c)} - S^{m} (c), \forall c \in \mathcal{C} ^{m}
\end{equation}
$$  

*Note that MonitoredFlowCnec might have only one threshold (upper or lower), in that case, only one of the two above constraints is defined.*

<br>

With $$\overline{f(c)}$$ and $$\underline{f(c)}$$ the bounds of the previous constraints, defined a below:  

$$
\begin{matrix}
\overline{f(c)} = \max(f^{+}_{threshold} (c) - c^{adj-coeff}_{m} \:, \: \:
f_{0} (c) + c^{acc-augm}_{m} - c^{adj-coeff}_{m} \:, \: \:
f_{0} (c))
\end{matrix}
$$  

$$
\begin{matrix}
\underline{f(c)} = \min(f^{-}_{threshold} (c) + c^{adj-coeff}_{m} \:, \: \:
f_{0} (c) - c^{acc-augm}_{m} + c^{adj-coeff}_{m} \:, \: \:
f_{0} (c))
\end{matrix}
$$  

The first terms of the bounds define the actual MNEC flow limit:  
- either equal to the threshold defined in the CRAC,
- or to the initial flow value of the FlowCnec, added to the acceptable margin diminution coefficient  

The last terms ensure that the initial situation is always feasible, whatever the configuration parameters.

<br>

## Contribution to the objective function {#objective-function}

Penalisation of the MNEC excess in the objective function:  

$$
\begin{equation}
\min (c^{penalty}_{m} \sum_{c \in \mathcal{C} ^{m}} S^{m} (c))
\end{equation}
$$

<br>

---
Code reference: [MnecFiller](https://github.com/farao-community/farao-core/blob/master/ra-optimisation/search-tree-rao/src/main/java/com/farao_community/farao/search_tree_rao/linear_optimisation/algorithms/fillers/MnecFiller.java)

---