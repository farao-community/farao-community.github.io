---
layout: documentation
title: Computation engines
permalink: /docs/engine
hide: true
feature-img: "assets/img/Hans_Otto_Theater_Potsdam_-_fake_colors_cut.jpg"
tags: [Docs]
---

### Remedial action optimiser

[Remedial actions optimisation](/docs/engine/ra-optimisation) aims at selecting the best remedial actions
for operating the network the most efficiently, ensuring security of supply.

The RAO optimisation problem is of such complexity that its overall optimum cannot be found, on real size data sets, in a reasonnable computation time. Therefore, FARAO does not offer only one RAO algorithm, but several, each one having its pros and cons in terms of:

- handling of remedial actions (Are topological actions optimized? Are costly remedial actions such as redispatching and counter-trading taken into account?),

- optimality measurement and optimality criterion (In the scope of its problem, can the quality (i.e. proximity to the optimum) of the solution computed by the RAO be measured? If yes, is it the optimal solution or a close, « good enough » solution?),

- computation time.

FARAO provides a standard interface for remedial actions optimisation modules.
Moreover, it plans to provide two implementations of RAO interface, that will provide two complementary ways of solving,
this difficult problem:
- ***Closed optimisation RAO*** engine: a modular approach of building mixed-integer optimisation problems based on network
and CRAC objects. A first prototype is currently available in FARAO. Please refer to the
[dedicated documentation page](/docs/engine/ra-optimisation/closed-optimisation-rao) to get more information
about closed optimisation RAO module.
- ***Search tree RAO*** engine: an efficient implementation of RAO interface for dealing with combinatorial problem of remedial actions optimisation mixing topological actions, and combined preventive/curative optimisation. This module - called CASTOR, for CAlculation with Scalable and Transparent OptimizeR - is being developed in FARAO toolbox. Please refer to the [dedicated documentation page](/docs/engine/ra-optimisation/search-tree-rao) to get more information about the module, and to the [FARAO roadmap](/roadmap) for information about current implementation plan.

### Flowbased

Flowbased calculation is the official target for all capacity calculation in Europe.

FARAO toolbox will provide a standard interface for Flowbased calculation feature.
It aims at providing a full CGMES compliant Flowbased calculation implementation.

### Embedded engines from PowSyBl

FARAO standard distribution comes with multiple computation engines embedded. Some directly come from [PowSyBl](http://www.powsybl.org)
framework, as [load flow](https://powsybl.github.io/docs/tools/loadflow.html) engine and
[sensitivity computation](https://powsybl.github.io/docs/tools/sensitivity-computation.html) engine.



