---
layout: documentation
title: Modelling aligned PSTs with integer taps
permalink: /docs/castor/linear-optimisation-problem/discrete-pst-group-filler
hide: true
root-page: Documentation
docu-section: CASTOR
docu-parent: Linear Remedial Actions Optimisation
order: 8
feature-img: "assets/img/farao3.jpg"
tags: [Docs, Search Tree RAO, CASTOR]
see-also: |
    [DiscretePstGroupFiller](https://github.com/powsybl/powsybl-open-rao/blob/main/ra-optimisation/search-tree-rao/src/main/java/com/powsybl/openrao/searchtreerao/linearoptimisation/algorithms/fillers/DiscretePstGroupFiller.java)
---

## Used input data {#input-data}

| Name | Symbol | Details |
|---|---|---|
| DiscretePstGroups | $$g \in \mathcal{G}^{pst}_{RA}$$ | Set of discrete PstRangeAction groups. <br> Each RangeActionGroup contains a set of PstRangeActions, the PstRangeActions of the group have to be "aligned" between each other. <br> $$r \in \mathcal{RA}(g)$$ <br> with: <br> $$\mathcal{RA}(g) \subset \mathcal{RA} ^{PST}$$ |
| Reference tap | $$t_{n}(r)$$ | Tap of PstRangeAction $$r$$ at the beginning of the current iteration of the MILP |

## Used parameters {#parameters}

| Name | Details |
|---|---|
| [pst-model](/docs/parameters#pst-model) | This filler is used only if this parameters is set to *APPROXIMATED_INTEGERS* |

## Defined optimization variables {#defined-variables}

| Name | Symbol | Details | Type | Index | Unit | Lower bound | Upper bound |
|---|---|---|---|---|---|---|---|
| Group tap | $$T^{group}(g)$$ | The tap of the group $$g$$ | Defined as real value, but implicitely acts as an integer variables (see [constraints](#defined-constraints)) | One variable for every element of (DiscretePstGroups) | no unit | $$-\infty$$ | $$+\infty$$ |

## Used optimization variables {#used-variables}

| Name | Symbol | Defined in |
|---|---|---|
| PstRangeAction tap upward variation | $$\Delta t^{+} (r)$$ | [DiscretePstTapFiller](discrete-pst-tap-filler#defined-variables) |
| PstRangeAction tap downward variation | $$\Delta t^{-} (r)$$ | [DiscretePstTapFiller](discrete-pst-tap-filler#defined-variables) |

## Defined constraints {#defined-constraints}

### Equality of the taps of the PSTs of the same group

$$
\begin{equation}
T^{group}(g) = t_{n}(r) + \Delta t^{+} (r) - \Delta t^{-} (r), \forall r \in \mathcal{RA}(g), \forall g \in \mathcal{G}^{pst}_{RA}
\end{equation}
$$