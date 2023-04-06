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
see-also: |
    [MaxLoopFlowFiller](https://github.com/farao-community/farao-core/blob/master/ra-optimisation/search-tree-rao/src/main/java/com/farao_community/farao/search_tree_rao/linear_optimisation/algorithms/fillers/MaxLoopFlowFiller.java)
---

## Used input data {#input-data}

| Name | Symbol | Details                                                                                                                                                                                                                                     |
|---|---|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| LoopFlowCnecs | $$c \in \mathcal{C} ^{lf}$$ | Set of FlowCnecs with a loop-flow threshold. (for example, in CORE CC, loop-flows are monitored on cross-border CNECs). LoopFlowCnecs is a subset of [FlowCnecs](core-problem-filler#input-data): $$\mathcal{C} ^{lf} \subset \mathcal{C}$$ |
| Reference commercial flow | $$f^{commercial} (c)$$ | Commercial flow[^1], of LoopFlowCnec $$c$$, at the beginning of the optimization, in MW.                                                                                                                                                    |
| initial loop-flow | $$f^{loop} _ {0} (c)$$ | loop-flow before RAO of LoopFlowCnec $$c$$, in MW                                                                                                                                                                                           |
| loop-flow threshold | $$lf^{threshold} (c)$$ | loop-flow threshold of the LoopFlowCnec $$c$$, in MW, as defined in the CRAC.                                                                                                                                                               |

[^1]: The commercial flow is computed oustide the MILP, see [loop-flow computation](/docs/engine/ra-optimisation/loop-flows#loop-flow-computation)

## Used parameters {#parameters}

| Name                                                                                                      | Symbol                    | Details                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
|-----------------------------------------------------------------------------------------------------------|---------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [rao-loop-flow-parameters](/docs/parameters##loop-flow-parameters)                                        |                           | This filler is only used if [this](/docs/parameters#loop-flow-parameters) extension is added.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| [acceptable-increase](/docs/parameters#loop-flow-acceptable-increase)                            | $$c^{acc-increase}_{lf}$$ | The increase of the initial loop-flow that is allowed by the optimisation, see [loop-flow-acceptable-increase](/docs/parameters#loop-flow-acceptable-increase).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| [constraint-adjustment-coefficient](/docs/parameters#loop-flow-constraint-adjustment-coefficient) | $$c^{adj-coeff}_{lf}$$    | This parameter acts as a margin that tightens the loop-flow constraints bounds in the linear problem. It conceptually behaves as the coefficient $$c^{adjustment}$$ from the constraint below: <br> $$abs(F_{loop-flow}(c)) <= lf^{threshold} (c) - c^{adjustment}$$ <br> This parameter is a safety margin which can absorb some of the approximations  made in the linear optimization problem such as non integer PST taps, flows approximated by sensitivity coefficients, etc. It therefore increases the probability that the loop-flow constraints respected in the linear optimisation problem, remain respected once the loop-flows are re-computed without the linear approximations. |
| [violation-cost](/docs/parameters#loop-flow-violation-cost)                                      | $$c^{penalty}_{lf}$$      | penalisation, in the objective function, of the excess of 1 MW of loop-flow                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |

## Defined optimization variables {#defined-variables}

| Name | Symbol | Details | Type | Index                                                    | Unit | Lower bound | Upper bound |
|---|---|---|---|----------------------------------------------------------|---|---|---|
| loop-flow excess | $$S^{lf} (c)$$ | Slack variable for loop-flow constraint of FlowCnec c. <br> Defines the amount of MW by which a loop-flow constraint has been violated. <br> This makes the loop-flow constraints soft. | Real value | One variable for every element of  $$\mathcal{C} ^{lf}$$ | MW | 0 | $$+\infty$$ |

## Used optimization variables {#used-variables}

| Name | Symbol | Defined in |
|---|---|---|
| Flow | $$F(c)$$ | [CoreProblemFiller](core-problem-filler#defined-variables) |

## Defined constraints {#defined-constraints}

### Keeping the loop-flows within their bounds

<br>

$$
\begin{equation}
F(c) - f^{commercial} (c) \leq \overline{f^{loop} (c)} + S^{lf} (c), \forall c \in \mathcal{C} ^{lf}
\end{equation}
$$  

$$
\begin{equation}
F(c) - f^{commercial} (c) \geq - \overline{f^{loop} (c)} - S^{lf} (c), \forall c \in \mathcal{C} ^{lf}
\end{equation}
$$  

<br>

With $$\overline{f^{loop} (c)}$$ the loop-flow threshold, constant defined as:  

$$
\begin{matrix}
\overline{f^{loop} (c)} = \max(lf^{threshold} (c) - c^{adj-coeff}_{lf} \:, \: \: |f^{loop} _ {0} (c)| + c^{acc-increase}_{lf} - c^{adj-coeff}_{lf} \:, \: \: |f^{loop} _ {0} (c)|)
\end{matrix}
$$

The two first terms of the max define the actual loop-flow upper bound: 
- either as the threshold defined in the CRAC,
- or as the initial loop-flow value of the FlowCnec, on which the acceptable increase coefficient is added 

The last term ensures that the initial situation is always feasible, whatever the configuration parameters.


## Contribution to the objective function {#objective-function}

Penalisation of the loop-flow excess in the objective function:  

$$
\begin{equation}
\min (c^{penalty}_{lf} \sum_{c \in \mathcal{C} ^{lf}} S^{lf} (c))
\end{equation}
$$

This penalisation is part of the virtual cost.