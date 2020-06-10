---
layout: documentation
title: Linear remedial actions optimization
permalink: /docs/engine/ra-optimisation/linear-rao
hide: true
docu: true
docu-parent: Search tree RAO
order: 3
feature-img: "assets/img/Hans_Otto_Theater_Potsdam_-_fake_colors_cut.jpg"
tags: [Docs, Search Tree RAO]
---

### Overview

The Linear RAO optimizes the Range Actions (for now, only PSTs) according to a configurable objective function (e.g. maximization of the minimum margin). The solving algorithm approximates the impact of the Remedial Actions on the network flows with linear sensitivity coefficients. It therefore solves [linear optimisation problems](/docs/engine/ra-optimisation/linear-optimisation-problem) to find the optimal application of the Remedial Actions. Moreover, it can iterate over several reference points in order to mitigate the linear approximation inherent to its optimisation problem.

In particular, the Linear RAO module is called from the [Search Tree RAO module](/docs/engine/ra-optimisation/search-tree-rao).

### Inputs


The main inputs of the algorithm are:
- the network of the "initial situation", where the remedial actions are supposed to be at their "standard position",
- an extract of the original [Crac](/docs/data/crac), containing only the range actions (network actions actions are removed).

### Outputs

The Crac is updated by the linear RAO, as most of the results of the RAO are stored in Crac results extensions.

### Algorithm

Let’s focus on PST to clarify how linear remedial actions are optimized.
PST optimization relies on 3 types of computations:

- A sensitivity analysis, which answers the question: how much does each PST shift angle impact the flow on each CNEC?
These sensitivities (or Phase Shifter Distribution Factors, PSDF) are re-computed for each and every CNEC that are 
part of the studied perimeter, for each RA candidate during remedial action optimisation, and for each step of optimization.

- A linear optimization: based on those sensitivities, what is the combination of phase shift angles which maximizes 
the objective function value?

- A standard security analysis, checks that the new PST taps actually increase the objective function value. Indeed, 
the linear optimization remains an approximation (valid in DC), and transforming angles to discrete PST taps can also 
cause differences between the anticipated margins and the actual computed margin.


Hereunder, the specific workflow related to linear optimization.

![Linear RAO algorithm](/assets/img/linear-rao-algo.png)

#### Forcing tap positions of a defined set of PSTs to be equal

FARAO search-tree can be also configured to define sets of PSTs whose taps should be maintained equal during optimisation.
To see how this is done, you can check the details of the [linear optimization problem](/docs/engine/ra-optimisation/linear-optimisation-problem).

#### Minimum impact of PST in the linear optimization

In order to control the usage of PST in the optimization, it is possible to set a constraint in the PST optimization 
problem: the change in phase shifting angle value of one particular PST should not have an impact on the objective 
function smaller than a configurable value *pst-sensitivity-threshold*.

When computing the PST sensitivities, only the ones which are higher than *pst-sensitivity-threshold* are considered 
and the others are considered null. This allows us to filter out the PSTs which don't have a big enough impact on the
CNECs.


Also, while solving the linear optimisation problem, the usage of PSTs is penalised. This is done by adding a 
configurable cost *pst-penalty-cost* for moving the PSTs in the linear problem's objective function:

$$\begin{equation}
\max MM - \sum_{p \in \mathcal{P}} \Delta_{p} c^{PST}
\end{equation}$$

with $$MM$$ the minimum margin, $$\mathcal{P}$$ the set of PSTs, $$\Delta_p$$ the variation of angle of the PST $$p$$, and $$c^{PST}$$
equal to *pst-penalty-cost*.

This way, if two solutions are very close to each other, the problem will prefer the one that changes the PST taps the 
least.