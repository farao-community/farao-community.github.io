---
layout: documentation
title: Linear optimisation problem
permalink: /docs/engine/ra-optimisation/branch-and-bound/linear-optimisation-problem
hide: true
feature-img: "assets/img/Hans_Otto_Theater_Potsdam_-_fake_colors_cut.jpg"
tags: [Docs, Branch & Bound RAO]
category: Computation engines
---

# Overview

The main decision variables of the linear optimisation problem are the setpoints of the Range Remedial Action (PSTs and HVDCs). The linear optimisation aims at finding the combinaison of Range Action setpoints which maximises a given objective function.

The first objective function which will be implemented for this linear optimisation problem is the maximum margin.

During the [search tree RAO process](/docs/engine/ra-optimisation/branch-and-bound/search-tree-rao), the linear optimisation problem is solved multiple times:
- for different perimeters (e.g. before outage, after outage)
- with different activated Network Remedial Action (Network Actions are not optimized within the linear optimisation)
- with sensitivities computed around different combinaison of Range Action setpoints. During the algorithm of the [linear RAO](/docs/engine/ra-optimisation/branch-and-bound/linear-rao), the sensitivities are re-computed and the linear optimisation problem re-solved every time that a new optimal combination of PST setpoints is found.

# Problem formulation

For now, the following formulation does not include RA for after-outage instants.

A more generetic formulation will have to be built when curative RA will be integrated in the RAO.

## Sets

$$\mathcal{B}$$ : set of monitored Branches


$$\mathcal{C}$$ : set of Contingencies


$$\mathcal{I}$$ : ordered set of instants. The preventive instant, noted $i=0$, is the first element of this ordered set.


$$NEC$$ : set of "Network Element and Contingency". $$NEC \subset \mathcal{B} \times \mathcal{C} \times \mathcal{I} $$


$$CNEC$$ : set of "Critical Network Element and Contingency". $$CNEC \subset NEC$$


$$\mathcal{P}^{P}$$ : set of Preventive PST Range Actions

## Parameters


$$f^{ref}_{b,c,i}$$ : reference flows, defined $$\forall (b,c,i) \in NEC$$.


$$f^{max}_{b,c,i} and f^{min}_{b,c,i}$$ : maximum and minimum flow thresholds, defined $$\forall (b,c,i) \in NEC$$.


$$\sigma_{b,c,i,p}$$ : sensitivity of PST $p$ on the flow of NEC $$(b,c,i)$$.


$$\alpha^{0}_{0}$$ : initial angle of PST remedial actions $$p$$. As described in the input network of the linear RAO.


$$\alpha^{n}_{p}$$ : angle of the PST remedial actions $p$ around which the sensitivities $$\sigma_{b,c,i,p}$$ are computed (in the first iteration of the linear RAO $$\alpha^{n}_{p} = \alpha^{0}_{p}$$


$$\overline{\alpha_{p}}$$ and $$\underline{\alpha_{p}}$$ : maximum and minimum angle of PST remedial actions $$p$$.


## Variables

$$F_{b,c,i}$$ : Flow on CNEC $$(b,c,i)$$, defined for all CNECs.


$$A_{p}$$ : Setpoint (angle) of PST remedial action $$p$$, in the preventive state.


$$\Delta_{p}$$ : Absolute setpoint (angle) variation of PST remedial action $$p$$, compared to its initial setpoint.

	
## Objective function

The objective function can be configured among the following ones.

#### Maximise min margin

##### Function

$$\begin{equation}
\max MPM - \sum_{p \in \mathcal{P}} \Delta_{p} c^{PST}
\end{equation}$$


##### Parameters

$$c^{PST}$$ : PST penalty cost 


##### Variables

$$MM$$ : Minimum margin.


##### Constraints

$$\begin{equation}
MM \leq  f^{max}_{b,c,i} - F_{b,c,i} , \forall (b,c,i) \in CNEC
\end{equation}$$


$$\begin{equation}
MM \leq F_{b,c,i} - f^{min}_{b,c,i} , \forall (b,c,i) \in CNEC
\end{equation}$$




## Constraints

#### PST setpoints within given range

$$\begin{equation}
\underline{\alpha_{p}} \leq A_{p} \leq \overline{\alpha_{p}}, \forall p \in \mathcal{P}
\end{equation}$$


#### Impact of Range Action on CNEC flows

$$\begin{equation}
F_{b,c,i} = f^{ref}_{b,c,i} + \sum_{p \in \mathcal{P}} \sigma_{b,c,i,p} * (A_{p} - \alpha^{n}_{p}), \forall (b,c,i) \in CNEC
\end{equation}$$


#### Definition of the absolute angle variations of the PSTs

$$\begin{equation}
\Delta_{p} \geq A_{p} - \alpha^{0}_{p}
\end{equation}$$

$$\begin{equation}
\Delta_{p} \geq - A_{p} + \alpha^{0}_{p}
\end{equation}$$
