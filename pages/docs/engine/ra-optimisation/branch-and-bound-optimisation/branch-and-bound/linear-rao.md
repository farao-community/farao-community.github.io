---
layout: documentation
title: Linear RAO
permalink: /docs/engine/ra-optimisation/branch-and-bound/linear-rao
hide: true
feature-img: "assets/img/Hans_Otto_Theater_Potsdam_-_fake_colors_cut.jpg"
tags: [Docs, Branch & Bound RAO]
category: Computation engines
---

### Overview

The Linear RAO optimizes the Range Actions (for now, only PSTs) according to a configurable objective function (e.g. maximization of the minimum margin). The solving algorithm approximates the impact of the Remedial Actions on the network flows with linear sensitivity coefficients. It therefore solves [linear optimisation problems](/docs/engine/ra-optimisation/branch-and-bound/linear-optimisation-problem) to find the optimal application of the Remedial Actions. Moreover, it can iterate over several reference points in order to mitigate the linear approximation inherent to its optimisation problems.

In particular, the Linear RAO module is called in the [Search Tree RAO module](/docs/engine/ra-optimisation/branch-and-bound/search-tree-rao).

### Inputs


The main inputs of the algorithm are:
- the network of the "initial situation", where the remedial actions are supposed to be at their "standard position",
- an extract of the original [Crac](/docs/data/crac), containing only the range actions (network actions actions are removed).

### Outputs

The Crac is updated by the linear RAO, as most of the results of the RAO are stored in Crac results extensions.

### Others

If the RAO finds several equivalent solutions, it keeps the one with the setpoints that are the closest to their standard position.

### Algorithm

![Linear RAO algorithm](/assets/img/linear-rao-algo.png)

