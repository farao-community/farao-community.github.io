---
layout: documentation
title: Modelling un-optimised CNECs
permalink: /docs/castor/linear-optimisation-problem/unoptimized-cnec-filler
hide: true
root-page: Documentation
docu-section: CASTOR
docu-parent: Linear Remedial Actions Optimisation
order: 9
feature-img: "assets/img/farao3.jpg"
tags: [Docs, Search Tree RAO, CASTOR]
---

## Used input data {#input-data}

| Name | Symbol | Details |
|---|---|---|
| FlowCnecs | $$c \in \mathcal{C}$$ | Set of optimised FlowCnecs |
| Upper threshold | $$f^{+}_{threshold} (c)$$ | Upper threshold of FlowCnec $$c$$, in MW, defined in the CRAC |
| Lower threshold | $$f^{-}_{threshold} (c)$$ | Lower threshold of FlowCnec $$c$$, in MW, defined in the CRAC |
| PrePerimeterMargin | $$RAM_{preperim}(c)$$ | Pre-perimeter margin, for FlowCnec $$c$$. <br> The pre-perimeter margin is the margin before optimising (topo + range) RAs, which constitutes a threshold for the constraints of this filler. <br> Always used in absolute MW in this filler |
| operatorsNotToOptimize | $$o\in \mathcal{UO}$$ | These are the operators for which CNECs should not be "optimized". It means that those of these CNECs for which the margin improves (compared to the pre-perimeter margin) are not taken into account in the minimum margin maximization, and those for which the margin decreases are taken into account in the minimum margin maximization. <br> Note that this set is computed by FARAO for curative RAO only, by detecting operators that do not share any curative RA. <br> FlowCnecs belonging to these operators constitute a subset of FlowCnecs: $$\mathcal{C} ^{uo} \subset \mathcal{C}$$ |
| higestThresholdValue | $$MaxRAM$$ | A "bigM" which is computed (by FARAO) as the greatest absolute possible value of the CNEC threshold, among all CNECs in the CRAC. <br> It represents the common greatest possible value for a given CNEC's margin (exception made of CNECs only constrained in one direction, but this value should be high enough not to have any effect on those). |

## Used parameters {#parameters}

| Name | Details |
|---|---|---|
| [curative-rao-optimize-operators-not-sharing-cras](/docs/parameters/json-parameters#curative-rao-optimize-operators-not-sharing-cras) | This filler is only used if this parameter is activated, and only for curative RAO. |

## Defined optimization variables {#defined-variables}

| Name | Symbol | Details | Type | Index | Unit | Lower bound | Upper bound |
|---|---|---|---|---|---|---|---|
| MarginDecrease | $$MD(c)$$ | Margin has decreased on FlowCnec $$c$$. Equal to 1 if the margin is decreased compared to the pre-perimeter value (PrePerimeterMargin), 0 otherwise. | Binary | One variable for every element of (FlowCnecs) whose operator is in (operatorsNotToOptimize) <br> $$\forall c \in \mathcal{C} ^{uo}$$ | no unit | 0 | 1 |

## Used optimization variables {#used-variables}

| Name | Symbol | Defined in |
|---|---|---|
| Flow | $$F(c)$$ | [CoreProblemFiller](core-problem-filler#defined-variables) |
| Minimum margin | $$MM$$ | [MaxMinMarginFiller](max-min-margin-filler#defined-variables) |
| Minimum relative margin | $$MRM$$ | [MaxMinRelativeMarginFiller](max-min-relative-margin-filler#defined-variables) |


## Defined constraints {#defined-constraints}

### Defining the margin decrease variable

It should be equal to 1 if the optimizer wants to degrade the margin of a given CNEC.  

$$
\begin{equation}
F(c) - f^{-}_{threshold} (c) \geq RAM_{preperim}(c) - worstMarginDecrease \times MD(c), \forall c \in \mathcal{C} ^{uo}
\end{equation}
$$  

$$
\begin{equation}
f^{+}_{threshold} (c) - F(c) \geq RAM_{preperim}(c) - worstMarginDecrease \times MD(c), \forall c \in \mathcal{C} ^{uo}
\end{equation}
$$  

Where $$worstMarginDecrease$$ represents the worst possible margin decrease, estimated as follows:  

$$
\begin{equation}
worstMarginDecrease = 20 \times MaxRAM
\end{equation}
$$  

*Note that no margin should be smaller than the worst margin computed above, otherwise it means the linear optimizer or the search tree rao is degrading the situation. So we can safely use this to estimate the worst decrease possible of the margins on cnecs.*  

*Note that OptimizedFlowCnec might have only one threshold (upper or lower), in that case, only one of the two above constraints is defined.*

<br>

### Updating the minimum margin constraints

(These are originally defined in [MaxMinMarginFiller](max-min-margin-filler#defined-constraints) and [MaxMinRelativeMarginFiller](max-min-relative-margin-filler#defined-constraints))  

For CNECs which should not be optimized, their RAM should not be taken into account in the minimum margin variable unless their margin is decreased.  

So we can release the minimum margin constraints if MarginDecrease is equal to 0. In order to do this, we just need to add the following term to these constraints' right side:  

$$
\begin{equation}
(1 - MD(c)) \times 2 \times MaxRAM, \forall c \in \mathcal{C} ^{uo}
\end{equation}
$$  

*Note that this term should be divided by the absolute PTDF sum for relative margins, but it is not done explicitly in the code because this coefficient is brought to the left-side of the constraint.*

<br>


## Contribution to the objective function {#objective-function}

Given the updated constraints above, the "un-optimised CNECs" will no longer count in the minimum margin (thus in the objective function) unless their margin is decreased.

<br>

---
Code reference: [UnoptimizedCnecFiller](https://github.com/farao-community/farao-core/blob/master/ra-optimisation/search-tree-rao/src/main/java/com/farao_community/farao/search_tree_rao/linear_optimisation/algorithms/fillers/UnoptimizedCnecFiller.java)

---