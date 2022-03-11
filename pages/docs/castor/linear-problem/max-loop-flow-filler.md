---
layout: documentation
title: Modelling loop-flows and their virtual cost
permalink: /docs/castor/linear-optimisation-problem/max-loop-flow-filler
hide: true
root-page: Documentation
docu-section: CASTOR
docu-parent: Linear Remedial Actions Optimisation
order: 4
feature-img: "assets/img/farao3.jpg"
tags: [Docs, Search Tree RAO, CASTOR]
---

## Used input data {#input-data}

| Name | Symbol | Details |
|---|---|---|
| LoopFlowCnecs | $$c \in \mathcal{C} ^{lf}$$ | Set of FlowCnecs with a loop-flow threshold. (for example, in CORE CC, loop-flows are monitored on cross-border CNECs). LoopFlowCnecs is a subset of [FlowCnecs](core-problem-filler#input-data): $$\mathcal{C} ^{lf} \subset \mathcal{C}$$ |
| Reference commercial flow | $$f^{commercial}_{n} (c)$$ | Commercial flow[^1], of LoopFlowCnec c, at the beginning of the optimization, in MW. |
| initial loop-flow | $$f^{loop} _ {0} (c)$$ | loop flow before RAO of LoopFlowCnec c, in MW |
| loop-flow threshold | $$lf^{threshold} (c)$$ | loop flow threshold of the LoopFlowCnec c, in MW, as defined in the CRAC. |

[^1]: The commercial flow is computed oustide the MILP, as follows: <br> $$f^{commercial}_{n} (c) = \sum_{z \in LFC} PTDF(c,z) * NP^{ref}(z)$$ <br> With: <br> - LFC, the set of countries for whose we compute the commercial flows, set in the configuration under the parameter 'loop-flow-countries' <br> - NP, the net position of country z, read from the ReferenceProgram given as input of the RAO <br> - PTDF, the PTDF of country z on the FlowCnec c, eventually recomputed within the RAO depending on the value of the configuration parameter 'loop-flow-approximation'

## Used parameters {#parameters}

| Name | Symbol | Details |
|---|---|---|
| [rao-with-loop-flow-limitation](/docs/parameters/json-parameters#rao-with-loop-flow-limitation) |  | This filler is only used if this parameter is activated |
| [loop-flow-acceptable-augmentation](/docs/parameters/json-parameters#loop-flow-acceptable-augmentation) | $$c^{acc-augm}_{lf}$$ | The increase of the initial loop-flow that is allowed by the optimisation. |
| [loop-flow-constraint-adjustment-coefficient](/docs/parameters/json-parameters#loop-flow-constraint-adjustment-coefficient) | $$c^{adj-coeff}_{lf}$$ | This parameter acts as a margin which tighten, in the linear optimisation problem of RAO, the bounds of the loop-flow constraints. It conceptually behaves as the coefficient c-adjustment from the constraint below: <br> abs(loop-flow[cnec]) <= loop-flow-threshold - c-adjustment <br> This parameter is a safety margin which can absorb some of the approximations which are made in the linear optimization problem of the RAO (non integer PSTs taps, flows approximated by sensi coefficient, etc.), and therefore increase the probability that the loop-flow constraints which are respected in the linear optimisation problem, remain respected once the loop-flows are re-computed without the linear approximations. |
| [loop-flow-violation-cost](/docs/parameters/json-parameters#loop-flow-violation-cost) | $$c^{penalty}_{lf}$$ | penalisation, in the objective function, of the excess of 1 MW of loop-flow |

## Defined optimization variables {#defined-variables}

| Name | Symbol | Details | Type | Index | Unit | Lower bound | Upper bound |
|---|---|---|---|---|---|---|---|
| loop-flow excess | $$S^{lf} (c)$$ | Slack variable for loop-flow constraint of FlowCnec c. <br> Defines the amount of MW by which a loop-flow constraint has been violated. <br> This makes the loop-flow constraints soft. | Real value | One variable for every element of (LoopFlowFlowCnecs) | MW | 0 | $$+\infty$$ |

## Used optimization variables {#used-variables}

| Name | Symbol | Defined in |
|---|---|---|
| Flow | $$F(c)$$ | [CoreProblemFiller](core-problem-filler#defined-variables) |

## Defined constraints {#defined-constraints}

### Keeping the loop-flows within their bounds

<br>

$$
\begin{equation}
F(c) - f^{commercial}_{n} (c) <= \overline{f^{loop} (c)} + S^{lf} (c), \forall c \in \mathcal{C} ^{lf}
\end{equation}
$$  

$$
\begin{equation}
F(c) - f^{commercial}_{n} (c) >= - \overline{f^{loop} (c)} - S^{lf} (c), \forall c \in \mathcal{C} ^{lf}
\end{equation}
$$  

<br>

With $$\overline{f^{loop} (c)}$$ the loop flow threshold, constant defined as below:  

$$
\begin{matrix}
\overline{f^{loop} (c)} = \max(lf^{threshold} (c) - c^{adj-coeff}_{lf} \:, \: \: |f^{loop} _ {0} (c)| + c^{acc-augm}_{lf} - c^{adj-coeff}_{lf} \:, \: \: |f^{loop} _ {0} (c)|)
\end{matrix}
$$

The two first terms of the max define the actual loop-flow upper bound: 
- either as the threshold defined in the CRAC,
- or as the initial loop-flow value of the FlowCnec, added to the acceptable augmentation coefficient  

The last terms ensure that the initial situation is always feasible, whatever the configuration parameters.

<br>

## Contribution to the objective function {#objective-function}

Penalisation of the loop-flow excess in the objective function:  

$$
\begin{equation}
\min (c^{penalty}_{lf} \sum_{c \in \mathcal{C} ^{lf}} S^{lf} (c))
\end{equation}
$$

<br>

---
Code reference: [MaxLoopFlowFiller](https://github.com/farao-community/farao-core/blob/master/ra-optimisation/search-tree-rao/src/main/java/com/farao_community/farao/search_tree_rao/linear_optimisation/algorithms/fillers/MaxLoopFlowFiller.java)

---