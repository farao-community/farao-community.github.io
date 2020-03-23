---
layout: page
title: Branch and bound optimisation
permalink: /docs/engine/ra-optimisation/branch-and-bound/
hide: true
feature-img: "assets/img/Hans_Otto_Theater_Potsdam_-_fake_colors_cut.jpg"
tags: [Docs, Branch & Bound RAO]
---

### Overview

The RAO optimisation problem is of such complexity that its overall optimum cannot be found, on real size data sets, in a reasonnable computation time. Therefore, FARAO does not offer only one RAO algorithm, but several, each one having its pros and cons in terms of:

- handling of remedial actions (Are topological actions optimized? Are costly remedial actions such as redispatching and counter-trading taken into account?),

- optimality measurement and optimality criterion (In the scope of its problem, can the quality (i.e. proximity to the optimum) of the solution computed by the RAO be measured? If yes, is it the optimal solution or a close, « good enough » solution?),

- computation time.

### Linear RAO

The [linear RAO module](/docs/engine/ra-optimisation/branch-and-bound/linear-rao) optimizes the PST taps and HVDC setpoints (called Range Actions) according to a configurable objective function (e.g. maximization of the minimum margin). The solving algorithm approximates the impact of the Remedial Actions on the network flows with linear sensitivity coefficients. It therefore solves linear optimisation problems to find the optimal application of the Remedial Actions. Moreover, it can iterate over several reference points in order to mitigate the linear approximation inherent to its optimisation problems.

### Search Tree RAO

The [Search Tree RAO module](/docs/engine/ra-optimisation/branch-and-bound/search-tree-rao) optimizes the Range Actions and topological actions according to a configurable objective function. The solving algorithm deals consecutively with the N state and N-1 states. For each of them, it looks for a good combination of Remedial Actions through:
- a heuristic search which tests iteratively the impact of the topological actions,
- linear optimisation steps operated by the linear RAO module, which optimises the use of PSTs and HVDC lines.
