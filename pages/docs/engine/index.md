---
layout: page
title: Computation engines
permalink: /docs/engine
hide: true
feature-img: "assets/img/Hans_Otto_Theater_Potsdam_-_fake_colors_cut.jpg"
tags: [Docs]
---

### Remedial action optimiser

[Remedial actions optimisation](/docs/engine/ra-optimisation) aims at selecting the best remedial actions
for operating the network the most efficiently, ensuring security of supply.

FARAO provides a standard interface for remedial actions optimisation modules.
Moreover, it plans to provide two implementations of RAO interface, that will provide two complementary ways of solving,
this difficult problem:
- ***Closed optimisation RAO*** engine: a modular approach of building mixed-integer optimisation problems based on network
and CRAC objects. A first prototype is currently available in FARAO. Please refer to the
[dedicated documentation page](/docs/engine/ra-optimisation/closed-optimisation-rao) to get more information
about closed optimisation RAO module.
- ***Branch & Bound RAO*** engine: an efficient implementation of RAO interface for dealing with combinatorial problem of
remedial actions optimisation mixing topological actions, and combined preventive/curative optimisation. This module
is being developed in FARAO toolbox. Please refer to [FARAO roadmap](/roadmap) for information about current
implementation plan.

### Flowbased

Flowbased calculation is the official target for all capacity calculation in Europe.

FARAO toolbox will provide a standard interface for Flowbased calculation feature.
It aims at providing a full CGMES compliant Flowbased calculation implementation.

It is not yet available in FARAO toolbox. Please refer to [FARAO roadmap](/roadmap) for information
about current implementation plan.

### Embedded engines from PowSyBl

FARAO standard distribution comes with multiple computation engines embedded. Some directly come from [PowSyBl](http://www.powsybl.org)
framework, as [load flow](https://powsybl.github.io/docs/tools/loadflow.html) engine and
[sensitivity computation](https://powsybl.github.io/docs/tools/sensitivity-computation.html) engine.



