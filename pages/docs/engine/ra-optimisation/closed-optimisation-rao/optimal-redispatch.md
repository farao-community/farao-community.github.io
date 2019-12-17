---
layout: page
title: Optimal redispatch
permalink: /docs/engine/ra-optimisation/closed-optimisation-rao/optimal-redispatch
hide: true
feature-img: "assets/img/Hans_Otto_Theater_Potsdam_-_fake_colors_cut.jpg"
tags: [Docs]
---

## Problem overview

Optimal redispatch problem aims at providing a coordinated set of generation redispatch that
ensures electricity security of supply while minimizing overall costs for the system.

FARAO closed optimisation engine can provide a tooling for solving this problem, by modelling
it as a [Mixed-Integer Linear](https://en.wikipedia.org/wiki/Integer_programming)
problem.

## Input data

### Network files

The main input of FARAO optimiser is the network model. It must be detailed enough to
simulate the actual transport system behaviour, including after contingency and after generation shift.

Internal network model is based on [PowSyBl](http://www.powsybl.org)  IIDM format.
For a detailed description of IIDM network model, please refer to the IIDM format
[JavaDoc](http://javadoc.io/doc/com.powsybl/powsybl-iidm-api/2.1.0)  and [documentation](www.powsybl.org).

Moreover, some [importers](https://powsybl.github.io/docs/iidm/importer/) from standard source
formats are provided by PowSyBl framework.

### CRAC files

The second important input is the CRAC file. It defines the security domain of the network, and the available
flexibilities to deal with potential constraints.

Internal model of CRAC files is provided by FARAO and described in detailed [documentation](../../../data/crac/index.md).

## Optimization problem 

In this section, variables of the optimisation problem are identified by capital letters, while 
constants parameters are in lower case.

### Pre and post contingencies

The optimal redispatch problem looks for a combination of network actions which relieves 
congestions:
- in normal operation conditions ("N" state, also called "preventive" state)
- after possible critical network outages ("N-1" states, also called "curative" states)

The scope of the optimisation problem therefore covers several situations. The set of monitored 
states is noted $$\mathcal{S}$$, it contains one preventive state and  multiple curative states.

### Monitored elements description

We want to ensure that flows on the monitored elements of the network respects the given
maximum admissible flows.

In case the security analysis reports some overloads in preventive or after contingency, the
remedial actions optimisation is called to find the cheaper solution for solving the congestions.

Let's note $$\widehat{F_{i,s}}$$ the estimated flow for a network element $$i$$, monitored in state $$s$$.

The estimated flow on a monitored element should ideally be within its admissible transmition
limits, $$-f^{max}_i,s$$ and $$f^{max}_i,s$$.

However, some overloads might be unavoidable. The overload on a monitored element $$(i,s)$$ 
is noted $$\widehat{O_{i,s}}$$. Overloads can be either on the upper or lower limit of a network 
elements, they are linked to the estimated flows with the two following constraints.

$$
\begin{align*}
    & \widehat{F_{i,s}} \leq f^{max}_i - \widehat{O_{i}}
    & \widehat{F_{i,s}} \geq -f^{max}_i + \widehat{O_{i}}
\end{align*}
$$

In the objective function of the RAO problem, $$\widehat{O_{i,s}}$$ is strongly penalized. 
The penalisation cost of the congestion is noted $$c^{cong}$$ and is by default equal to 
5000 €/MW. As a consequence, an overload is a last resort for the solver to find a feasable 
solution. More precisely, an overload will occur only if remedial actions cannot prevent it 
for less than 5000 €/MW.

All couples of network element and contingency are not necessarily monitored by the optimal
redispatch problem. The CRAC file allows to define specifically the set of couples $$(i,s)$$
to be monitored. A couple $$(i,s)$$ is also commonly called a CNEC, for Critical Network 
Element and Contingency. The set of monitored elements $$(i,s)$$ will be as of now noted 
$$\mathcal{C}$$.

### Redispatch remedial actions

Let's note $$g$$ a given generation redispatch remedial action. we note $$c^{act}_{g}$$
the activation cost of the redispatch offer. We also note $$c^{var}_{g}$$ the relative cost
of a variation (in MW) of the generation.

Each redispatch remedial action is also constrained in terms of quantity delivered. Thus, 
we note $$\underline{\delta^P_{g}}$$ the minimum available variation and $$\overline{\delta^P_{g}}$$
the maximum available variation.

The redispatch remedial action can moreover be activated, according to the CRAC file definition :
- in the preventive state, or
- in all the curative states, or
- in a subset of the curative states, i.e. after some pre-speficied critical outages.

We note $$\mathcal{S}_g$$ the set of states for which the redispatch remedial action $$g$$ 
is activable. And symmetrically, $$\mathcal{G}_s$$ the set of redispatch remedial action 
activable in the state $$s$$.

For a given redispatch remedial action $$g$$ and one of the state $$s$$ belonging in 
$$\mathcal{S}_g$$, the cost related to the use of the remedial action $$C_{g,s}$$ is 
though defined as:

$$
\begin{align*}
    & C_{g,s} = X_{g,s}.c^{act}_{g} + \Delta^P_{g,s}.c^{var}_{g} \quad\textrm{with}\quad
    & X_{g,s}.\underline{\delta^P_g} \leq \Delta^P_{g,s} \leq X_{g,s}.\overline{\delta^P_{g}}
\end{align*}
$$

With $$X_{g,s}$$ a binary variable representing actual activation of the redispatch remedial 
action in state $$s$$ and $$\Delta^P_{g,s}$$ representing the redispatched quantity, in MW.
 
For keeping an equilibrium between generation and consumption on the network, a constraint enforces
the sum of all generators redispatch to be 0 in a given state $$s$$.

$$
\begin{align*}
    & \sum_{g \in \mathcal{G}_s}.\Delta^P_{g,s} = 0
\end{align*}
$$

### PST remedial actions

Let's note $$p$$ a given PST remedial action. PST remedial actions are supposed to have no cost.

Each PST remedial action is linearized, and constrained in terms of angle variation available.
Thus, we note $$\underline{\delta^{\alpha}_p}$$ the minimum available variation and $$\overline{\delta^{\alpha}_p}$$
the maximum available variation.

As for the redispatch remedial actions, we note $$\mathcal{S}_g$$, subset of $$\mathcal{S}$$, the
set of states for which the PST $$p$$ is usable. And symmetrically, $$\mathcal{P}_s$$ the set of 
PST activable in the state $$s$$.

An angle variation of PST $$p$$ in a state $$s$$ is represented by the variable $$\Delta^{\alpha}_{p,s}$$, 
which is naturally bounded by the minimum and maximum angle variations of this PST. 

### impact of remedial actions on flows

Now, let's estimate the actual flow on each monitored element $$\widehat{F_{i,s}}$$.
We note $$\sigma_{i,s,g}$$ the sensitivity of the flow on the network element $$i$$ to the variation of
generation $$g$$ in state $$s$$. We also note $$\sigma_{i,s,p}$$ the sensitivity of the flow on the network element $$i$$
to the variation of PST angle $$p$$ in state $$s$$.

These sensitivities are computed through derivation of the network equations.

With $$f^{ref}_{i,s}$$ the calculated flow for each monitored element $$(i,s)$$ obtained as
a security analysis result, we can get a linear estimation of the flow on each
monitored element $$(i,s)$$ after the application of remedial actions.

$$
\begin{align*}
    & \widehat{F_{i,s}}=f^{ref}_{i,s}+\sum_{g \in \mathcal{G}_s} \Delta^P_{g,s}.\sigma_{i,s,g} + \sum_{p \in \mathcal{P}_s} \Delta^{\alpha}_{p,s}. \sigma_{i,s,p}
\end{align*}
$$

### objective function

The objective function includes :
- a primary objective which consists in the minimization of the network congestion (in MW of total congestions)
- a secondary objective which is the minimization of the redispatching costs

In the case where all congestions can be relieved by the remedial actions, the objective of the
optimisation consists in looking for the cheapest combination of redispatch remedial action
which solves all congestions.

The priority between the two objectives is handled with the congestion cost $$c^{cong}$$, which sets
the weighting coefficient between the two linear component of the objective function.

$$
\begin{align*}
    & \text{minimize}\sum_{s \in \mathcal{S}} (\sum_{g \in \mathcal{G}_s}.C_{g,s}) + c^{cong}. \sum_{(i,s) \in \mathcal{C}} \widehat{O_{i,s}}
\end{align*}
$$


### Summary

$$
\begin{align*}
    & \text{minimize}\sum_{s \in \mathcal{S}} (\sum_{g \in \mathcal{G}_s}.C_{g,s}) + c^{cong}. \sum_{(i,s) \in \mathcal{C}} \widehat{O_{i,s}} \\

    & \text{subject to}

    & \forall s \in \mathcal{S}, \forall g \in \mathcal{G}_s, \quad C_{g,s} = X_{g,s}.c^{act}_{g} + \Delta^P_{g,s}.c^{var}_{g}

    & \forall s \in \mathcal{S}, \forall g \in \mathcal{G}_s, \Delta^P_{g,s} \leq X_{g,s}.\overline{\delta^P_{g}}

    & \forall s \in \mathcal{S}, \forall g \in \mathcal{G}_s, \Delta^P_{g,s} \geq X_{g,s}.\underline{\delta^P_g} 

    & \forall s \in \mathcal{S}, \quad \sum_{g \in \mathcal{G}_s}.\Delta^P_{g,s} = 0

    & \forall s \in \mathcal{S}, \forall p \in \mathcal{P}_s, \quad \underline{\delta^{\alpha}_p} \leq \Delta^{\alpha}_{p,s} \leq \overline{\delta^{\alpha}_p} 

    & \forall (i,s) \in \mathcal{C}, \quad \widehat{F_{i,s}}=f^{ref}_{i,s}+\sum_{g \in \mathcal{G}_s} \Delta^P_{g,s}.\sigma_{i,s,g} + \sum_{p \in \mathcal{P}_s} \Delta^{\alpha}_{p,s}. \sigma_{i,s,p}

    & \forall (i,s) \in \mathcal{C}, \quad \widehat{F_{i,s}} \leq f^{max}_i - \widehat{O_{i}}

    & \forall (i,s) \in \mathcal{C}, \quad \widehat{F_{i,s}} \geq -f^{max}_i + \widehat{O_{i}}
$$


## Optimizer implementation

#### Pre-processors

##### Sensitivity calculation pre-processor

This pre-processor compute a loadflow and a sensitivity calculation on the input network situation before and after applying contingencies. 
Returns the list of monitored element Id's associated to it's reference flow on the basecase and after each contingencies.
Returns sensitivity factors of monitored element flows for each remedial action (PST and redispatch).

#### Problem fillers

##### Branch Margins Positivity Constraint Filler

Set constraints on monitored element flows which has to respect positive margin compared to the maximum flow on the basecase and after contingencies. 

##### Branch Margins Variables Filler

Set monitored element flows variables as equal to the reference flow on monitored elements on the base case and after contingencies. 

##### Branch Overload Variables Filler

Set monitored element overload variables which allows to relax the branch margins positivity constraints.

##### Generator Redispatch Costs Filler

Set the total redispatch cost variable calculated with the equation of cost related to the use of the remedial action defined bellow. 

##### Generator Redispatch Variables Filler

Set redispatch variables for each remedial action generators. 

##### Minimization Objective Filler

Set the objective function as a minimization (in opposition to a maximization)

##### Overload Penalty Cost Filler 

Add the total congestion cost to the objective function.

##### PST Angle Impact on Branch Flow Filler

Set the PST angle impact on elements flow as equal to the sensitivity factor for each monitored elements the basecase and after contingencies.

##### PST Angle Variables Filler

Set PST angle variables for each PST remedial actions.

##### Redispatch Equilibrium Constraint Filler

Set the constraint of power equilibrium for the redispatch. 

##### Redispatch Impact on Branch Flow Filler

Set the redispatch impact on elements flow as equal to the sensitivity factor for each monitored elements the basecase and after contingencies.

##### Redispatch Cost Minimization Objective Filler

Add the total redispatch cost to the objective function. 

#### Post-processors

##### Branch Results post-processor

Fills the remedial actions optimization results with the flow on monitored elements before and after optimisation.

##### PST Element Results post-processor

Fills the remedial actions optimization results with PST remedial actions results (initial angle, initial tap position, final angle, final tap position).
The post-processor check the PST taps are valid  and included in the range allowed after discretizing the PST since it is linearized for the optimisation problem. 

##### Redispatch Element Results post-processor

Fills the remedial actions optimization results with redispatch remedial actions results (Initial P and calculated P after optimization). 

#### Solver

As it is a mixed-integer linear problem, the recommended solver is [CBC](https://projects.coin-or.org/Cbc). 

Some parameters allow to set stop criteria to the resolution of the mixed-integer linear problem :
- stop criterion with a given relative MIP gap, and/or
- stop criterion in solving time. 

#### Other

The closed optimisation RAO can also filter "unsignificant" sensitivities so as to speed up the computation by
reducing the number of non-zero elements in the mixed-integer linear problem. Two thresholds can be configured, 
one for the PST (in MW/tap) and one for the redispatching (in MW/MW) to define which sensitivity coefficients will be 
filtered and so removed from the optimization problem.

#### Recap: final configuration

The final associated configuration for closed optimisation module is the following one.

```yaml
closed-optimisation-rao-parameters:
    solver-type: CBC_MIXED_INTEGER_PROGRAMMING
    relative-mip-gap: 0.001
    max-time-in-seconds: 18000
    redispatching-sensitivity-threshold: 0.05
    pst-sensitivity-threshold: 1
    problem-fillers:
        - com.farao_community.farao.closed_optimisation_rao.fillers.BranchMarginsPositivityConstraintFiller
        - com.farao_community.farao.closed_optimisation_rao.fillers.BranchMarginsVariablesFiller
        - com.farao_community.farao.closed_optimisation_rao.fillers.GeneratorRedispatchCostsFiller
        - com.farao_community.farao.closed_optimisation_rao.fillers.GeneratorRedispatchVariablesFiller
        - com.farao_community.farao.closed_optimisation_rao.fillers.PstAngleImpactOnBranchFlowFiller
        - com.farao_community.farao.closed_optimisation_rao.fillers.PstAngleVariablesFiller
        - com.farao_community.farao.closed_optimisation_rao.fillers.RedispatchEquilibriumConstraintFiller
        - com.farao_community.farao.closed_optimisation_rao.fillers.RedispatchImpactOnBranchFlowFiller
        - com.farao_community.farao.closed_optimisation_rao.fillers.RedispatchCostMinimizationObjectiveFiller
        - com.farao_community.farao.closed_optimisation_rao.fillers.BranchOverloadVariablesFiller
        - com.farao_community.farao.closed_optimisation_rao.fillers.MinimizationObjectiveFiller
        - com.farao_community.farao.closed_optimisation_rao.fillers.OverloadPenaltyCostFiller
    pre-processors:
        - com.farao_community.farao.closed_optimisation_rao.pre_processors.SensitivityPreProcessor
    post-processors:
        - com.farao_community.farao.closed_optimisation_rao.post_processors.BranchResultsPostProcessor
        - com.farao_community.farao.closed_optimisation_rao.post_processors.PstElementResultsPostProcessor
        - com.farao_community.farao.closed_optimisation_rao.post_processors.RedispatchElementResultsPostProcessor
```
