---
layout: page
title: Branch and bound optimisation
permalink: /docs/engine/ra-optimisation/branch-and-bound
hide: true
feature-img: "assets/img/Hans_Otto_Theater_Potsdam_-_fake_colors_cut.jpg"
tags: [Docs]
---

### Overview

The RAO optimisation problem is of such complexity that its overall optimum cannot be found, on real size data sets, in a reasonnable computation time. Therefore, Farao does not offer only one RAO algorithm, but severals, each one having its pros and cons in terms of :

- remedial actions handled : are topological actions optimized ? Are costly remedial actions such as redispatching and counter-trading taken into account ?

- optimality measurement and optimality criterion : in the scope of its problem, can the quality (i.e. proximity to the optimum) of the solution computed by the RAO be measured ? If yes, is it the optimal « solution » ? or a close, « good enough » solution ?

- computation time 

### Linear RAO

The LinearRao optimizes the PST’s taps and HVDC’s setpoints (called Range Actions) according to a configurable objective function (e.g. maximizes the minimum margin). The solving algorithm approximates the impact of the Remedial Actions on the network flows with linear sensitivity coefficients and therefore solves linear optimisation problems to find the optimal application of the Remedial Actions. Moreover, it can iterates over several reference points in order to mitigate the linear approximation inherent to its optimisation problems.

### Search Tree RAO

The SearchTreeRao optimizes the Range Actions and topological actions according to a configurable objective function. The solving algorithm deals consecutively with the N state and N-1 states. For each of them it looks for a good combination of Remedial Actions through :
- a heuristic search which tests iteratively the impact of the topological actions
- linear optimisation steps operated by the LinearRao which optimises the use of PST and HVDC.
