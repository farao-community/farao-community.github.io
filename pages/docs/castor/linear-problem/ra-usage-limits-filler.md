---
layout: documentation
title: Limiting the number of range actions to use
permalink: /docs/castor/linear-optimisation-problem/ra-usage-limits-filler
hide: true
root-page: Documentation
docu-section: CASTOR
docu-parent: Linear Remedial Actions Optimisation
order: 10
feature-img: "assets/img/farao3.jpg"
tags: [Docs, Search Tree RAO, CASTOR]
---

## Used input data {#input-data}

| Name | Symbol | Details |
|---|---|---|
| RangeActions | $$r \in \mathcal{RA}$$ | Set of optimised RangeActions (PSTs, HVDCs, InjectionRangeActions...) |
| PrePerimeterSetpoints | $$\alpha _0(r)$$ | Setpoint of RangeAction r at the beginning of the optimisation |
| Range upper bound | $$\underline{\alpha(r)(\alpha _0(r))}$$ | Highest allowed setpoint for a range action r, given its pre-perimeter setpoint $$\alpha _0(r)$$ |
| Range lower bound | $$\overline{\alpha(r)(\alpha _0(r))}$$ | Lowest allowed setpoint for a range action r, given its pre-perimeter setpoint $$\alpha _0(r)$$ |
| Maximum number of RAs | $$nRA^{max}$$ | Maximum number of range actions that can be used |
| Maximum number of TSOs | $$nTSO^{max}$$ | Maximum number of TSOs that can use at least one range action (those in "TSO exclusions" do not count) |
| TSO exclusions | $$tso \in \mathcal{TSO_{ex}}$$ | TSOs that do not count in the "Maximum number of TSOs" constraint (typically because they already have an activated network action outside the MILP, and that maxTso has been decremented, so using range actions for these TSOs is "free") |
| Maximum number of PSTs per TSO | $$nPST^{max}(tso)$$ | Maximum number of PSTs that can be used by a given TSO |
| Maximum number of RAs per TSO | $$nRA^{max}(tso)$$ | Maximum number of range actions to use by a given TSO |
| TSOs | $$tso \in \mathcal{TSO}$$ | Set of all TSOs operating a range action in RangeActions |

*Note that this filler is currently only used for curative RAO, and uses parameters defined [here](/docs/parameters/json-parameters#ra-usage-number). Nonetheless, they are modified to take into account applied topological actions first.*

## Defined optimization variables {#defined-variables}

| Name | Symbol | Details | Type | Index | Unit | Lower bound | Upper bound |
|---|---|---|---|---|---|---|---|
| RA usage binary | $$\delta(r)$$ | binary indicating if a range action is used | Binary | One variable for every element of (RangeActions) | no unit | 0 | 1 |
| TSO RA usage binary | $$\delta^{TSO}(tso)$$ | binary indicating for a given TSO if it has any range action used. <br> Note that it is defined as a real value to speed up resolution, but it will act as a binary given the following constraints | Real value | One variable for every element of $$\mathcal{TSO} - \mathcal{TSO_{ex}}$$ | no unit | 0 | 1 |

## Used optimization variables {#used-variables}

| Name | Symbol | Defined in |
|---|---|---|
| RA setpoint | $$A(r)$$ | [CoreProblemFiller](core-problem-filler#defined-variables) |

## Defined constraints {#defined-constraints}

Let the following symbol indicate the subset of RangeActions belonging to TSO (tso): $$\mathcal{RA}(tso)$$

### Define the binary variable

Force the binary to 1 if optimal setpoint should be different from pre-perimeter setpoint: 

$$
\begin{equation}
A(r) \geq \alpha_{0}(r) - \delta (r) * (\alpha_{0}(r) - \underline{\alpha(r)(\alpha _0(r))})  , \forall (r) \in \mathcal{RA}
\end{equation}
$$  

$$
\begin{equation}
A(r) \leq \alpha_{0}(r) + \delta (r) * (\overline{\alpha(r)(\alpha _0(r))} - \alpha_{0}(r))  , \forall (r) \in \mathcal{RA}
\end{equation}
$$  

<br>

*⚠️ In order to mitigate rounding issues, and ensure that the max and min setpoints are feasible, a small "epsilon" (1e-5) is added to max / subtracted to min setpoint.*  

*⚠️ In order to mitigate PST tap ↔ angle approximation in "[APPROXIMATED_INTEGERS](/docs/parameters/json-parameters#pst-optimization-approximation)" mode, and ensure that the initial setpoint is feasible, a correction factor is added or subtracted from the initial setpoint in the constraints above. This coefficient is coputed as 30% of the average tap to angle conversion factor:*  
*correction = 0.3 x abs((max angle - min angle) / (max tap - min tap))*

### Maximum number of remedial actions

$$
\begin{equation}
\sum_{r \in \mathcal{RA}} \delta (r) \leq nRA^{max}
\end{equation}
$$   

<br>

### Maximum number of TSOs

$$
\begin{equation}
\delta^{TSO}(tso) \geq \delta (r), \forall tso \in \mathcal{TSO - TSO_{ex}} \ and \ \forall r \in \mathcal{RA}(tso)
\end{equation}
$$  

<br>

$$
\begin{equation}
\sum_{tso \in \mathcal{TSO - TSO_{ex}}} \delta^{tso} (tso) \leq nTSO^{max}
\end{equation}
$$   

<br>

### Maximum number of PSTs per TSO

$$
\begin{equation}
\sum_{r \in \mathcal{RA}(tso), r \ is \ PST} \delta (r) \leq nPST^{max}(tso), \forall tso \in \mathcal{TSO}
\end{equation}
$$   

<br>

### Maximum number of RAs per TSO

$$
\begin{equation}
\sum_{r \in \mathcal{RA}(tso)} \delta (r) \leq nRA^{max}(tso), \forall tso \in \mathcal{TSO}
\end{equation}
$$   

<br>


---
Code reference: [RaUsageLimitsFiller](https://github.com/farao-community/farao-core/blob/master/ra-optimisation/search-tree-rao/src/main/java/com/farao_community/farao/search_tree_rao/linear_optimisation/algorithms/fillers/RaUsageLimitsFiller.java)

---