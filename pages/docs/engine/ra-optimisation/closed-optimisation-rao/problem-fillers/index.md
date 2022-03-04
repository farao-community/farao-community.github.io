---
layout: documentation
title: Optimisation problem fillers
hide: true
root-page: Documentation
docu-section: Closed optimisation modular engine
docu-parent: Closed optimisation modular engine
order: 2
permalink: /docs/engine/ra-optimisation/closed-optimisation-rao/problem-fillers
feature-img: "assets/img/farao3.jpg"
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