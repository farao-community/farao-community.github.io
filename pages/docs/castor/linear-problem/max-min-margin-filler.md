---
layout: documentation
title: Modelling the maximum minimum margin objective
permalink: /docs/castor/linear-optimisation-problem/max-min-margin-filler
hide: true
root-page: Documentation
docu-section: CASTOR
docu-parent: Linear Remedial Actions Optimisation
order: 2
feature-img: "assets/img/farao3.jpg"
tags: [Docs, Search Tree RAO, CASTOR]
see-also: |
    [MaxMinMarginFiller](https://github.com/farao-community/farao-core/blob/master/ra-optimisation/search-tree-rao/src/main/java/com/farao_community/farao/search_tree_rao/linear_optimisation/algorithms/fillers/MaxMinMarginFiller.java)
---

## Used input data {#input-data}

| Name | Symbol | Details |
|---|---|---|
| OptimisedFlowCnecs | $$c \in \mathcal{C} ^{o}$$ | Set of FlowCnecs which are ['optimised'](/docs/input-data/crac/json#optimised-vs-monitored). OptimisedFlowCnecs is a subset of [FlowCnecs](core-problem-filler#input-data): $$\mathcal{C} ^{o} \subset \mathcal{C}$$ |
| upper threshold | $$f^{+}_{threshold} (c)$$ | Upper threshold of FlowCnec $$c$$, in MW, as defined in the CRAC |
| lower threshold | $$f^{-}_{threshold} (c)$$ | Lower threshold of FlowCnec $$c$$, in MW, defined in the CRAC |
| nominal voltage | $$U_{nom}(c)$$ | Nominal voltage of OptimizedFlowCnec $$c$$ |

## Used parameters {#parameters}

| Name | Details |
|---|---|
| [objective-function](/docs/parameters#objective-function) | Used to set the unit (AMPERE/MW) of the objective function |

## Defined optimization variables {#defined-variables}

| Name | Symbol | Details | Type | Index | Unit | Lower bound | Upper bound |
|---|---|---|---|---|---|---|---|
| Minimum margin | $$MM$$ | the minimum margin over all OptimizedFlowCnecs | Real value | one scalar variable for the whole problem | MW or AMPERE (depending on [objective-function](/docs/parameters#objective-function) unit) | $$-\infty$$ | $$+\infty$$ |

## Used optimization variables {#used-variables}

| Name | Symbol | Defined in |
|---|---|---|
| Flow | $$F(c)$$ | [CoreProblemFiller](core-problem-filler#defined-variables) |

## Defined constraints {#defined-constraints}

### Define the minimum margin variable

#### If [objective-function](/docs/parameters#objective-function) is in MW

$$
\begin{equation}
MM \leq f^{+}_{threshold} (c) - F(c), \forall c \in \mathcal{C} ^{o}
\end{equation}
$$  

$$
\begin{equation}
MM \leq F(c) - f^{-}_{threshold} (c), \forall c \in \mathcal{C} ^{o}
\end{equation}
$$  

Note that OptimizedFlowCnec might have only one threshold (upper or lower), in that case, only one of the two above constraints is defined.
<br>

#### If [objective-function](/docs/parameters#objective-function) is in AMPERE

$$
\begin{equation}
MM \leq \frac{f^{+}_{threshold} (c) - F(c)}{c^{A->MW}(c)}, \forall c \in \mathcal{C} ^{o}
\end{equation}
$$  

$$
\begin{equation}
MM \leq \frac{F(c) - f^{-}_{threshold} (c)}{c^{A->MW}(c)}, \forall c \in \mathcal{C} ^{o}
\end{equation}
$$  

where $$c^{A->MW}(c)$$ is the conversion factor from AMPERE to MW of the FlowCnec c, calculated as below:  

$$
\begin{equation}
c^{A->MW}(c) = \frac{U_{nom}(c) \sqrt{3}}{1000}
\end{equation}
$$

There is a real difference between the two objective functions, as the most limiting OptimizedFlowCnec (i.e. the one which defines the minimum margin), can be different in MW and in A, depending on the nominal voltages Unom.
<br>


## Contribution to the objective function {#objective-function}

The minimum margin should be maximised:  

$$
\begin{equation}
\min (-MM)
\end{equation}
$$