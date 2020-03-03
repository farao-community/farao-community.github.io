---
layout: page
title: Linear RAO engine
permalink: /docs/engine/ra-optimisation/linear-rao
hide: true
feature-img: "assets/img/Hans_Otto_Theater_Potsdam_-_fake_colors_cut.jpg"
tags: [Docs]
---

To optimize remedial actions which can take a value in a given range, we linearize their effect on the network. This allows
us to optimize them by solving a [linear program](https://en.wikipedia.org/wiki/Linear_programming).


## Linear RAO algorithm


### Linearization of the remedial actions 

We approximate the effect of the different remedial actions on the network by computing the sensitivities $$\sigma_{b,c,i,p}$$
which correspond to the variation of the flow on the monitored branch $$b$$, at instant $$i$$, after contingency c, when we add a unit 
to the value we control for the remedial action $$p$$.
 
For instance $$\sigma_{l,none,preventive,pst}$$ is the approximation of the change of the flow on the line $$l$$ in the preventive state, 
with no contingency, when we increase the angle of the PST $$pst$$ by 1°. This sensitivity would therefore be in MW/degree. 

These sensitivities are computed through derivation of the network equations.



### LP solved

The LP solved is the following:


* **Sets:**

$$\mathcal{B}$$ the set of monitored network branches.

$$\mathcal{C}$$ the set of contingencies.

$$\mathcal{I}$$ the set of instants.

$$CNEC$$ the set of Critical Network Element and Contingency. $$CNEC \subset \mathcal{B} \times \mathcal{C} \times \mathcal{I}$$


* **Constants:**

$$f^{ref}_{b,c,i}$$ : reference flows, defined $$\forall (b,c,i) \in CNEC$$.

$$f^{max}_{b,c,i}$$ and $$f^{min}_{b,c,i}$$ : maximum and minimum flow thresholds, defined $$\forall (b,c,i) \in CNEC$$.

$$\sigma_{b,c,i,p}$$ : sensitivity of remedial action $$p$$ on the flow of $$(b,c,i) \in CNEC$$.

$$\alpha^{init}_{p}$$ : initial value of remedial actions $$p$$.

$$\overline{\alpha_{p}}$$ and $$\underline{\alpha_{p}}$$ : extrema values of the range of remedial action $$p$$.

$$c^{RA}$$ : the cost of changing the value of a remedial action by one unit.


* **Variables:**

$$F_{b,c,i}$$ : flow on CNEC $$(b,c,i)$$, defined for all CNECs.

$$MM$$ : minimal margin, ie the smallest margin we have for the set $$\mathcal{C}$$ of CNECs.

$$\Delta^+_p$$ and $$\Delta^-_p$$ : positive and negative variations for all remedial action $$p \in \mathcal{P}$$ (positive variable).


* **Constraints:**

The variations of the remedial actions should respect the extrema values of their range:

$$\underline{x_p} <= \alpha^{init}_p + \Delta^+_p - \Delta^-_p <= \overline{x_p}, \forall p \in \mathcal{P}$$

The variations of the flows depend on the variations of the remedial actions:

$$F_{b,c,i} = f^{ref}_{b,c,i} + \sum_{p \in \mathcal{P}} \sigma_{b,c,i,p} * (\Delta^+_p - \Delta^-_p) , \forall (b,c,i) \in CNEC$$

The minimal margin is smaller than all the margins:

$$MM <= f^{max}_{b,c,i} - F_{b,c,i}, \forall (b,c,i) \in CNEC$$

$$MM <= F_{b,c,i} - f^{min}_{b,c,i}, \forall (b,c,i) \in CNEC$$

* **Objective function:**

By default the goal of the LP is to maximize the minimal margin, while using the most effective remedial actions.
Therefore we want to maximize:
  
$$MM - \sum_{p \in \mathcal{P}} ( \Delta^{+}_{p} + \Delta^{-}_{p}) c^{RA}$$


### Verification and loop

The linearization of the effects of the remedial actions on the network is only an approximation and is not exact.
Therefore we have to apply the calculated remedial actions to the network and recompute the load flow to check that we have 
indeed improved the solution. Also the sensitivities will have change so we recompute them and solve a new LP.

We repeat this process until we either compute the same optimal remedial actions twice in a row, we degrade the solution,
or we reach the maximal number of iterations defined by the user. 

## Configuration

If one wishes to only optimize remedial actions that can vary in a given range, then one can define LinearRao as the default RAO provider. 

**YAML version**

```yaml
rao:
    default: LinearRao
```


