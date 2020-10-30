---
layout: documentation
title: Loopflows
permalink: /docs/engine/ra-optimisation/loopflows
hide: true
docu: true
docu-parent: CASTOR
order: 2
feature-img: "assets/img/Hans_Otto_Theater_Potsdam_-_fake_colors_cut.jpg"
tags: [Docs, Search Tree RAO, CASTOR]
---

When the power flows from the production areas to the consumers, the current can sometimes cross borders even if the 
electricity is produced and used in the same country. These loopflows are therefore the flows remaining on cross border
lines when no commercial exchanges are present, and limit the capacity available for the market.

# ACER Methodology to limit loopflows

During the RAO, the loopflow $$F_{loopflow}$$ on each cross zonal CNEC should not exceed the maximum between:

- the initial loopflow $$F_0$$
- the loopflow threshold $$ F_{max_{loopflow}} $$, a loop flow threshold provided by TSOs for each of their cross zonal CNECs

To compute the loopflow in the initial situation and during further computation, we consider a situation with no
commercial exchange between all the bidding zones.

To do so, we use the GSK to compute, for each bidding zone $$z$$ and for each CNEC, $$PTDF_z$$ the power
transfer distribution factor of the bidding zone on the CNEC. Then we can compute the loopflow:

$$\begin{equation}
F_{loopflow} = F - \sum_{\forall z \in Z} PTDF_z * NP_z 
\end{equation}$$ 

with $$NP_z$$ the net position of the bidding zone $$z$$.
 
### Usage in the Linear Problem

To take into consideration the loopflow limitations during the RAO, we add to the linear problem a constraint for each CNEC $$i$$:

$$\begin{equation}
-LF^{max}_i - LF^{violation}_i \leq F_i - \sum_{\forall z \in Z} PTDF_{z,i} * NP_z \leq LF^{max}_i + LF^{violation}_i 
\end{equation}$$

with $$LF^{violation}_i$$ the absolute value (in MW) by which the loopflow threshold is violated on CNEC $$i$$.

The objective function also becomes :

$$\begin{equation}
\max MM - \sum_{p \in \mathcal{P}} \Delta_{p} c^{PST} - \sum_{i \in \mathcal{I}} LF^{violation}_i c^{LFviolation}_i
\end{equation}$$

where c^{LFviolation} is a configurable input, and represents what gain on the minimal margin (in MW) we need per MW of
violation on Loopflows.
