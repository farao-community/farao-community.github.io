---
layout: documentation
title: Modelling the maximum minimum relative margin objective function
permalink: /docs/castor/linear-optimisation-problem/max-min-relative-margin-filler
hide: true
root-page: Documentation
docu-section: CASTOR
docu-parent: Linear Remedial Actions Optimisation
order: 3
feature-img: "assets/img/farao3.jpg"
tags: [Docs, Search Tree RAO, CASTOR]
see-also: |
  [MaxMinRelativeMarginFiller](https://github.com/powsybl/powsybl-open-rao/blob/main/ra-optimisation/search-tree-rao/src/main/java/com/powsybl/openrao/searchtreerao/linearoptimisation/algorithms/fillers/MaxMinRelativeMarginFiller.java)
---

## Used input data {#input-data}

| Name | Symbol | Details |
|---|---|---|
| OptimisedFlowCnecs | $$c \in \mathcal{C} ^{o}$$ | Set of FlowCnecs which are ['optimised'](/docs/input-data/crac/json#optimised-vs-monitored). OptimisedFlowCnecs is a subset of [FlowCnecs](core-problem-filler#input-data): $$\mathcal{C} ^{o} \subset \mathcal{C}$$ |
| upper threshold | $$f^{+}_{threshold} (c)$$ | Upper threshold of FlowCnec $$c$$, in MW, as defined in the CRAC |
| lower threshold | $$f^{-}_{threshold} (c)$$ | Lower threshold of FlowCnec $$c$$, in MW, defined in the CRAC |
| nominal voltage | $$U_{nom}(c)$$ | Nominal voltage of OptimizedFlowCnec $$c$$ |
| Absolute PTDF sum | $$\sigma_{ptdf}(c)$$ | Absolute zone to zone PTDF sum[^1] of FlowCnec $$c$$. |
| Highest threshold value | $$MaxRAM$$ | A "bigM" which is computed (by FARAO) as the greatest absolute possible value of the CNEC threshold, among all CNECs in the CRAC. <br> It represents the common greatest possible value for a given CNEC's margin (exception made of CNECs only constrained in one direction, but this value should be high enough not to have any effect on those). |

[^1]: Computed outside the linear optimization, as below: <br> $$ \begin{equation} \sigma_{ptdf}(c) = \sum_{(z1, z2) \in zToz} \mid PTDF_{zTos}(z1, c) - PTDF_{zTos}(z2, c) \mid \end{equation}$$ <br>With $$zToz$$ the set of zone-to-zone PTDFs used for the relative margin computation, defined in the configuration parameter relative-margin-ptdf-boundaries. <br> And $$PTDF_{zTos}(z1, c)$$, the zone-to-slack PTDF of bidding zone $$z1$$ on CNEC $$c$$.

## Used parameters {#parameters}

| Name | Symbol | Details |
|---|---|---|
| [objective-function](/docs/parameters#objective-function) |  | This filler is only used if the objective function is MAX_MIN_MARGIN_IN_MEGAWATT, or MAX_MIN_MARGIN_IN_AMPERE. This parameter is also used to set the unit (AMPERE/MW) of the objective function |
| [ptdf-sum-lower-bound](/docs/parameters#relative-margins-ptdf-sum-lower-bound) | $$\varepsilon_{PTDF}$$ | zToz PTDF sum below this value are lifted to the ptdf-sum-lower-bound, to avoid a bad conditionning of the problem where the value of relative margins are very high. <br>*Its impact on the accuracy of the problem is insignificant, as high relative margins do not usually define the min. relative margin.* |

## Defined optimization variables {#defined-variables}

| Name | Symbol | Details | Type | Index | Unit | Lower bound | Upper bound |
|---|---|---|---|---|---|---|---|
| Minimum relative margin | $$MRM$$ | the minimum negative margin over all OptimizedFlowCnecs | Real value | one scalar variable for the whole problem | Relative MW or relative AMPERE (depending on [objective-function](/docs/parameters#objective-function) | 0 | $$+\infty$$ |
| Is minimum margin positive | $$P$$ | binary variable, equal to 1 if the min margin is positive, 0 otherwise | Binary | one scalar variable for the whole problem | no unit | 0 | 1 |

## Used optimization variables {#used-variables}

| Name | Symbol | Defined in |
|---|---|---|
| Flow | $$F(c)$$ | [CoreProblemFiller](core-problem-filler#defined-variables) |
| Minimum margin | $$MM$$ | [MaxMinMarginFiller](max-min-margin-filler#defined-variables) |

## Defined constraints {#defined-constraints}

### Making the absolute minimum margin $$MM$$ negative

The absolute minimum margin defined in [MaxMinMarginFiller](max-min-margin-filler#defined-variables) will now only be used for when the minimum margin is negative. So the following constraints are added:

$$
\begin{equation}
MM \leq 0
\end{equation}
$$

$$
\begin{equation}
MM \geq -(1 - P) * m_{min}^{RAM}
\end{equation}
$$

<br>

- where $$m_{min}^{RAM}$$ represents the maximum (absolute) value of the margin when it is negative. It is computed as follows:  
$$
m_{min}^{RAM} = MaxRAM * 5
$$

### Defining the minimum relative margin

The following constraints define the new $$MRM$$ variable:

<br>

$$
\begin{equation}
MRM \leq \frac{f^{+}_{threshold} (c) - F(c)}{\sigma^{\prime}_{ptdf}(c) c^{unit}(c)} + (1 - P) * m_{min}^{relRAM}, \forall c \in \mathcal{C} ^{o}
\end{equation}
$$  

<br>

$$
\begin{equation}
MRM \leq \frac{F(c) - f^{-}_{threshold} (c)}{\sigma\prime_{ptdf}(c) c^{unit}(c)} + (1 - P) * m_{min}^{relRAM}, \forall c \in \mathcal{C} ^{o}
\end{equation}
$$  

<br>

- where $$\sigma^{\prime}_{ptdf}(c)$$ is a "safe" version of the zone-to-zone absolute PTDF sum, where small values are lifted to avoid bad conditioning of the MILP:  
$$\sigma^{\prime}_{ptdf}(c) = \max{(\sigma_{ptdf}(c), \varepsilon_{PTDF})} $$  

- the max possible positive relative RAM is:  
$$m_{max}^{relRAM} = MaxRAM  / \varepsilon_{PTDF}$$

- the max possible negative relative RAM is (in absolute value):  
$$m_{min}^{relRAM} = m_{max}^{relRAM} * 5$$

- and the unit conversion coefficient is defined as follows:
  - If the [objective-function](/docs/parameters#objective-function) is in MW:  
  $$c^{unit}(c) = 1$$
  - If it is in AMPERE:  
  $$c^{unit}(c) = \frac{U_{nom}(c) \sqrt{3}}{1000}$$

Note that an OptimizedFlowCnec might have only one threshold (upper or lower). In that case, only one of the two constraints above is defined.

<br>

### Making $$MRM$$ positive

When the MM is negative, P is forced to 0 (see above). The following constraint sets the MRM to 0: 

$$
\begin{equation}
MRM \leq P * m_{max}^{relRAM}
\end{equation}
$$

<br>

## Contribution to the objective function {#objective-function}

The sum of minimum absolute & relative margins should be maximised:  

$$
\begin{equation}
\min -(MM + MRM)
\end{equation}
$$