---
layout: documentation
title: Modelling aligned range actions
permalink: /docs/castor/linear-optimisation-problem/continous-range-action-group-filler
hide: true
root-page: Documentation
docu-section: CASTOR
docu-parent: Linear Remedial Actions Optimisation
order: 6
feature-img: "assets/img/farao3.jpg"
tags: [Docs, Search Tree RAO, CASTOR]
see-also: |
    [ContinuousRangeActionGroupFiller](https://github.com/farao-community/farao-core/blob/master/ra-optimisation/search-tree-rao/src/main/java/com/powsybl/openrao/searchtreerao/linearoptimisation/algorithms/fillers/ContinuousRangeActionGroupFiller.java)
---

## Used input data {#input-data}

| Name | Symbol | Details |
|---|---|---|
| ContinuousRangeActionGroups | $$g \in \mathcal{G}^{c}_{RA}$$ | Set of continuous RangeActionGroups. <br> Each RangeActionGroup contains a set of remedial actions, the remedial actions of the group have to be "aligned" between each other. $$r \in \mathcal{RA}(g)$$ <br> with: <br> $$\mathcal{RA}(g) \subset \mathcal{RA}$$ |

## Used parameters {#parameters}

| Name                                                   | Details |
|--------------------------------------------------------|---|
| [pst-model](/docs/parameters#pst-model) | This filler is used only if this parameters is set to *CONTINUOUS* |

## Defined optimization variables {#defined-variables}

| Name | Symbol | Details | Type | Index | Unit | Lower bound | Upper bound |
|---|---|---|---|---|---|---|---|
| Group setpoint | $$A^{group}(g)$$ | The setpoint of the group $$g$$ | Real value | One variable for every element of (ContinuousRangeActionGroups) | Degrees for PST range action groups; MW for HVDC range action groups | $$-\infty$$ | $$+\infty$$ |

## Used optimization variables {#used-variables}

| Name | Symbol | Defined in |
|---|---|---|
| RA setpoint | $$A(r)$$ | [CoreProblemFiller](core-problem-filler#defined-variables) |

## Defined constraints {#defined-constraints}

### Equality of the setpoints of the RangeActions of the same group

$$
\begin{equation}
A^{group}(g) = A(r), \forall r \in \mathcal{RA}(g), \forall g \in \mathcal{G}^{c}_{RA}
\end{equation}
$$