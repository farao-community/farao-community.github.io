---
layout: documentation
title: Closed optimisation RAO parameters configuration
permalink: /docs/configuration/closed-optimisation-rao-parameters
hide: true
feature-img: "assets/img/Hans_Otto_Theater_Potsdam_-_fake_colors_cut.jpg"
tags: [Docs]
category: Configuration
---

The ```closed-optimisation-rao-parameters``` module is used everytime a closed optimisation RAO job is run.
It defines the default values for the parameters needed by 
```com.farao_community.farao.closed_optimisation_rao.ClosedOptimisationRao``` implementation of RAO
computation interface.

## Properties

### Required properties

#### problem-fillers

List of optimisation problem fillers to be used to generate closed optimisation problem. The fillers are
named by the complete name of the class which extends
```com.farao_community.farao.closed_optimisation_rao.AbstractOptimisationProblemFiller``` abstract class.

The list of FARAO embedded problem fillers is available [here](../engine/ra-optimisation/closed-optimisation-rao/problem-fillers/index.md).             

### Optional properties

#### solver-type

Optimisation solver to be used for computation. The available solvers are the one interfaced with [OR-Tools library](https://developers.google.com/optimization/).

The recommended solvers are **```GLOP_LINEAR_PROGRAMMING```** for purely linear optimisation problems, and **```CBC_MIXED_INTEGER_PROGRAMMING```**
for mixed-integer linear ones. These solver are open-source and embedded with OR-tools.

It may be possible to use different solvers by using a custom install of OR-tools (a list of extra available
solvers is available on [OR-Tools website](https://developers.google.com/optimization/mip/integer_opt))

The default value is **```GLOP_LINEAR_PROGRAMMING```**.

#### pre-processors

List of pre-processors to be used to generate closed optimisation problem data. The pre-processors are
named by the complete name of the class which implements
```com.farao_community.farao.closed_optimisation_rao.OptimisationPreProcessor``` interface.

The list of FARAO embedded pre-processors is available [here](../engine/ra-optimisation/closed-optimisation-rao/pre-processors/index.md).             

The default value is an empty list.
 
#### post-processors

List of post-processors to be used at the end of the computation. The post-processors are
named by the complete name of the class which implements
```com.farao_community.farao.closed_optimisation_rao.OptimisationPostProcessor``` interface.

The list of FARAO embedded post-processors is available [here](../engine/ra-optimisation/closed-optimisation-rao/post-processors/index.md).             

The default value is an empty list.

## Examples

### YAML

```yaml
closed-optimisation-rao-parameters:
    solverType: CBC_MIXED_INTEGER_PROGRAMMING
    problemFillers:
        - com.farao_community.farao.closed_optimisation_rao.fillers.BranchMarginsVariablesFiller
        - com.farao_community.farao.closed_optimisation_rao.fillers.GeneratorRedispatchVariablesFiller
        - com.farao_community.farao.closed_optimisation_rao.fillers.GeneratorRedispatchCostsFiller
        - com.farao_community.farao.closed_optimisation_rao.fillers.CostlyRaoObjectiveFiller
        - com.farao_community.farao.closed_optimisation_rao.fillers.PhaseShiftVariablesFiller
        - com.farao_community.farao.closed_optimisation_rao.fillers.RedispatchEquilibriumConstraintFiller
    preProcessors:
        - com.farao_community.farao.closed_optimisation_rao.pre_processors.SensitivityPreProcessor
```

### XML

```xml
<closed-optimisation-rao-parameters>
    <solverType>CBC_MIXED_INTEGER_PROGRAMMING</solverType>
    <problemFillers>
        com.farao_community.farao.closed_optimisation_rao.fillers.BranchMarginsVariablesFiller,
        com.farao_community.farao.closed_optimisation_rao.fillers.GeneratorRedispatchVariablesFiller,
        com.farao_community.farao.closed_optimisation_rao.fillers.GeneratorRedispatchCostsFiller,
        com.farao_community.farao.closed_optimisation_rao.fillers.CostlyRaoObjectiveFiller,
        com.farao_community.farao.closed_optimisation_rao.fillers.PhaseShiftVariablesFiller,
        com.farao_community.farao.closed_optimisation_rao.fillers.RedispatchEquilibriumConstraintFiller
    </problemFillers>
    <preProcessors>
        com.farao_community.farao.closed_optimisation_rao.pre_processors.SensitivityPreProcessor
    </preProcessors>
</closed-optimisation-rao-parameters>
```