---
layout: page
title: Optimisation problem fillers
hide: true
docu-parent: Closed optimisation modular engine
permalink: /docs/engine/ra-optimisation/closed-optimisation-rao/problem-fillers
feature-img: "assets/img/Hans_Otto_Theater_Potsdam_-_fake_colors_cut.jpg"
tags: [Docs]
---

## What are optimisation problem fillers?

## Available problem fillers

The following problem fillers are provided in FARAO toolbox. 

| Name | Description |Class name | 
|------|-------------|-----------|
| [Branch margins variables filler](branch-margins-variables-filler.md) | Provides monitored branches margin variables and associated equation constraints | com.farao_community.farao.closed_optimisation_rao.fillers.BranchMarginsVariablesFiller |

## Configuring which fillers to use

The list of optimisation problem fillers to use is provided as a parameter of closed optimisation RAO engine.

```json
closed-optimisation-rao-parameters:
    solverType: ...
    problemFillers:
        - com.farao_community.farao.closed_optimisation_rao.fillers.BranchMarginsVariablesFiller
        - ...
    preProcessors:
        - ...
    postProcessors:
        - ...
```