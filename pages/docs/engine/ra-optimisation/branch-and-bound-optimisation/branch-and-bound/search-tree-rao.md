---
layout: page
title: Search tree RAO
permalink: /docs/engine/ra-optimisation/branch-and-bound/search-tree-rao
hide: true
feature-img: "assets/img/Hans_Otto_Theater_Potsdam_-_fake_colors_cut.jpg"
tags: [Docs, Branch & Bound RAO]
---

### Overview

The search tree RAO module optimizes the Range Actions and topological actions according to a configurable objective function. The solving algorithm deals consecutively with the N state and N-1 states. For each of them, it looks for a good combination of Remedial Actions through:
- a heuristic search which tests iteratively the impact of the topological actions,
- linear optimisation steps operated by the [linear RAO module](/docs/engine/ra-optimisation/branch-and-bound/linear-rao), which optimises the use of PSTs and HVDC lines.

### Inputs

This algorithm acts on sets of states that share common remedial actions, also called **perimeters**.

The main inputs of the algorithm are:
- the network at the root of the perimeter,
- an extract of the original [Crac](/docs/data/crac), containing only the remedial actions that are available in the given perimeter (filtering on usage rules). 

### Stop criterion

Technical documentation: Configuration

Considering that the objective function is the minimum margin (meaning the minimum of all flow margins of every CNEC), there are currently two stop criteria, so to say two ways to stop the search tree algorithm:
- when the minimum margin is positive, meaning that the network is secured (all the CNEC flows are under line thresholds): **positive margin** stop criterion,
- when the the minimal margin on every CNEC cannot be increased anymore: **maximum margin** stop criterion.

These stop criteria only make sense for a minimum margin objective function (may it be absolute or relative).


On both stop criteria, additional constraints can be added, for example:
- the maximal number of consecutive chosen network actions, also called **search tree depth**,
- the minimal relative gain of objective function between two consecutive network actions (i.e. between two search tree depths).

These two additional criteria can be applied without considering the actual objective function.

### Algorithm

![Search tree RAO algorithm](/assets/img/search-tree-rao-algo.png)

