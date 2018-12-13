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

Internal network model is based on [PowSyBl](http://www.powsybl.com)  IIDM format.
For a detailed description of IIDM network model, please refer to the IIDM format
[JavaDoc](http://javadoc.io/doc/com.powsybl/powsybl-iidm-api/2.1.0)  and [documentation](www.powsybl.com).

Moreover, some [importers](https://powsybl.github.io/docs/iidm/importer/) from standard source
formats are provided by PowSyBl framework.

### CRAC files

The second important input is the CRAC file. It defines the security domain of the network, and the available
flexibilities to deal with potential constraints.

Internal model of CRAC files is provided by FARAO and described in detailed [documentation](../../../data/crac/index.md).

## Optimization problem

### Mathematical description

We want to ensure that flows on the monitored elements of the network respects the given
maximum admissible flows.

In case security analysis report some overloads in preventive or after contingency, the
remedial actions optimisation is called to find the cheaper solution for solving the constraints.

Let's note $$RAM_i$$ the estimated available margin on monitored element $$i$$.

$$
\begin{align*}
    & RAM_i = F_{max,i} - \widehat{F_{i}}
\end{align*}
$$

$$\widehat{F_{i}}$$ is the estimated flow for each monitored element $$i$$.
$$F_{max,i}$$ is the maximum admissible flow for each monitored element $$i$$.

Let's note $$g$$ a given generation redispatch remedial action. we note $$C_{act,g}$$
the activation cost of the redispatch offer. We also note $$C_{var,g}$$ the relative cost
of a variation (in MW) of the generation.

Each redispatch remedial action is also constrained in terms of quantity delivered $$\Delta_{P,g}$$.
Though, we note $$\underline{\Delta_{P,g}}$$ the minimum available variation and $$\overline{\Delta_{P,g}}$$
the maximum available variation.

The cost related to the use of the remedial action $$C_g$$ is though defined as:

$$
\begin{align*}
    & C_g = \delta_g.C_{act,g} + \Delta_{P,g}.C_{var,g} \quad\textrm{with}\quad
    \delta_{g}.\underline{\Delta_{P,g}} \leq \Delta_{P,g} \leq \delta_{g}.\overline{\Delta_{P,g}}
\end{align*}
$$

with $$\delta_g$$ a binary variable representing actual activation of the redispatch remedial action

Let's note $$t$$ a given PST remedial action. PST remedial actions are supposed to have no cost.

Each PST remedial action is also linearized, and constrained in terms of angle variation available
$$\Delta_{\alpha,t}$$.
Though, we note $$\underline{\Delta_{\alpha,t}}$$ the minimum available variation and $$\overline{\Delta_{\alpha,t}}$$
the maximum available variation.

Now, let's estimate the actual flow on each monitored element $$\widehat{F_{i}}$$.
We note $$\sigma_{i,g}$$ the sensitivity of the flow on monitored branch $$i$$ to the variation of
generation $$g$$. We also note $$\sigma_{i,t}$$ the sensitivity of the flow on monitored branch $$i$$
to the variation of PST angle $$t$$.

These sensitivities are computed through derivation of the network equations.

With $$F_{ref,i}$$ the calculated flow for each monitored element $$i$$ obtained as
a security analysis result, we can get a linear estimation of the flow on each
monitored branch $$i$$.

$$
\begin{align*}
    & \widehat{F_{i}}=F_{ref,i}+\sum_{g}\Delta_{P,g}.\sigma_{i,g}+\sum_{t}\Delta_{\alpha,t}.\sigma_{i,t}
\end{align*}
$$

Associated cost of the remedial actiion can then be calculated as:

$$
\begin{align*}
    & \widehat{C}=\sum_{g}.C_g
\end{align*}
$$

The variable of the system are remedial actions activation variables $$\delta_{j}$$, continous remedial
actions quantity variables $$q_j$$ and extra linearization variables $$p_j$$.

Some other constraints must be fulfilled. First, for each remedial action $$i$$, $$RAM_i$$ must be positive.

$$
\begin{align*}
    & RAM_i \geq 0
\end{align*}
$$

For keeping an equilibrium between generation and consumption on the network, another constraint enforces
the sum of all generators redispatch to be 0.

$$
\begin{align*}
    & \sum_{g}.\Delta_{P,g} = 0
\end{align*}
$$

#### Summary

$$
\begin{align*}
    & C_{opt} = \min \widehat{C} \\
    & \widehat{C}=\sum_{g}.C_g \\
    & \sum_{g}.\Delta_{P,g} = 0 \\
    & \forall g \quad C_g = \delta_g.C_{act,g} + \Delta_{P,g}.C_{var,g} \\
    & \forall g \quad \delta_{g}.\underline{\Delta_{P,g}} \leq \Delta_{P,g} \leq \delta_{g}.\overline{\Delta_{P,g}} \\
    & \forall i \quad RAM_i \geq 0 \\
    & \forall i \quad RAM_i =  F_{max,i} - \widehat{F_{i}} \\
    & \forall i \quad \widehat{F_{i}}=F_{ref,i}+\sum_{g}\Delta_{P,g}.\sigma_{i,g}+\sum_{t}\Delta_{\alpha,t}.\sigma_{i,t} \\
    & \forall t \quad \underline{\Delta_{\alpha,t}} \leq \Delta_{\alpha,t} \leq \overline{\Delta_{\alpha,t}}
\end{align*}
$$

### Optimizer implementation

#### Pre-processors

##### Reference flows calculation pre-processor

##### Sensitivity calculation pre-processor

#### Problem fillers


#### Post-processors

##### PST tap discretization post-processor

As the impact of PST taps is linearized, for improving computation performance, a post-processor is needed
to discretize the PST taps for the optimiser output.

##### Security analysis post-processor

To take into account discretization of PST taps, and validate the results found in AC calculation, a
security analysis post-processor is run before filling the final results.

#### Solver

As it is a mixed-integer linear problem, the recommended solver is [CBC](https://projects.coin-or.org/Cbc). 

#### Recap: final configuration

The final associated configuration for closed optimisation module is the following one.

```yaml
closed-optimisation-rao-parameters:
    solver-type: CBC_MIXED_INTEGER_PROGRAMMING
    problem-fillers:
        - com.farao_community.farao.closed_optimisation_rao.fillers.BranchMarginsPositivityConstraintFiller
        - com.farao_community.farao.closed_optimisation_rao.fillers.BranchMarginsVariablesFiller
        - com.farao_community.farao.closed_optimisation_rao.fillers.GeneratorRedispatchCostsFiller
        - com.farao_community.farao.closed_optimisation_rao.fillers.GeneratorRedispatchVariablesFiller
        - com.farao_community.farao.closed_optimisation_rao.fillers.PstAngleImpactOnBranchFlowFiller
        - com.farao_community.farao.closed_optimisation_rao.fillers.PstAngleVariablesFiller
        - com.farao_community.farao.closed_optimisation_rao.fillers.RedispatchEquilibriumConstraintFiller
        - com.farao_community.farao.closed_optimisation_rao.fillers.RedispatchImpactOnBranchFlowFiller
        - com.farao_community.farao.closed_optimisation_rao.fillers.RedispathCostMinimizationObjectiveFiller
    pre-processors:
        - com.farao_community.farao.closed_optimisation_rao.pre_processors.ReferenceFlowsPreProcessor
        - com.farao_community.farao.closed_optimisation_rao.pre_processors.SensitivityPreProcessor
```
