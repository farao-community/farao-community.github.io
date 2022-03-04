---
layout: documentation
title: Closed optimisation modular engine
permalink: /docs/engine/ra-optimisation/closed-optimisation-rao
hide: true
root-page: Documentation
docu-section: none
docu-parent: none
order: 4
feature-img: "assets/img/farao3.jpg"
tags: [Docs]
---

Closed optimisation implementation of RAO functionality is built as a modular
[Mixed-Integer Linear Programming](https://en.wikipedia.org/wiki/Integer_programming) (MILP)
modeler, based on [OR-Tools]() optimisation solver wrapper.

The engine itself does not enforce any optimisation problem structure but provides building blocks that
will be used to create the actual optimisation problem that will be solved by the solver.

## Closed optimisation RAO modular structure

### Problem construction

The design principle of closed optimisation modular engine is to serve as an interface between business data - network
objects and CRAC files for example - and generic OR-Tools optimisation solver wrapper.

An important feature of closed optimisation engine is that it is built to be extended via simple plugins.
Each plugin is responsible of creating some variables, constraints or even objective function. It can even
modify some existing constraints and/or variable. We call such plugin a [problem-filler](/docs/engine/ra-optimisation/closed-optimisation-rao/problem-fillers).

These problem-fillers may need some external data to be able to define these optimisation elements. For example,
one may need the results from a sensitivity computation to define the impact on monitored branches of a generation
shift at one node. These external data are provided by plugins called [pre-processors](/docs/engine/ra-optimisation/closed-optimisation-rao/pre-processors), that
are run before the problem construction. 

### Available solver

OR-Tools provides some wrappers to external optimisation solvers. Some are available open-source and directly provided
by OR-Tools:
- [GLOP](https://developers.google.com/optimization/lp/glop) for pure linear programming problem solving.
- [CBC](https://projects.coin-or.org/Cbc) for mixed integer programming problem solving.

For a complete list of solvers for which wrappers are provided in OR-Tools, you can refer to the list of
[linear programming](https://developers.google.com/optimization/reference/linear_solver/linear_solver/) solvers or
[mixed-integer programming](https://developers.google.com/optimization/mip/integer_opt) one.

## Using closed optimisation modular RAO

### Installing OR-Tools

OR-Tools project provides some pre-compiled bundles for different platforms/operating systems. If you just need
standard open-source solvers, you can download the one provided for your platform on
[that page](https://github.com/google/or-tools/releases/). If any third party solver is expected, you may have
to build it from source. For information about how to build OR-Tools, please refer to the
[OR-Tools website](https://developers.google.com/optimization/install/java/). 

After getting OR-Tools downloaded or installed, set your environment variables.

```bash
export PATH=$PATH:<or-tools-dir>/bin
export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:<or-tools-dir>/lib
```

### Configuration

To run RAO computation using Closed optimisation engine, one have to configure the
[componentDefaultConfig](https://powsybl.github.io/docs/configuration/modules/componentDefaultConfig.html)
module to indicate the implementation to use for the `com.farao_community.farao.ra_optimisation.RaoComputationFactory`,
by setting the `RaoComputationFactory` property.

Moreover, specific configuration has to be provided via [closed-optimisation-rao-parameters](/docs/configuration/closed-optimisation-rao-parameters)
module, to indicate the plugins to be used to generate the optimisation problem, as the list of
[problem fillers](/docs/engine/ra-optimisation/closed-optimisation-rao/problem-fillers), [pre-processors](/docs/engine/ra-optimisation/closed-optimisation-rao/pre-processors) and [post-processors](/docs/engine/ra-optimisation/closed-optimisation-rao/post-processors).

#### YAML version

```yaml
componentDefaultConfig:
    RaoComputationFactory: com.farao_community.farao.closed_optimisation_rao.ClosedOptimisationRaoFactory

closed-optimisation-rao-parameters:
    solver-type: CBC_MIXED_INTEGER_PROGRAMMING
    problem-fillers:
        - com.farao_community.farao.closed_optimisation_rao.fillers.BranchMarginsVariablesFiller
        - com.farao_community.farao.closed_optimisation_rao.fillers.GeneratorRedispatchVariablesFiller
        - com.farao_community.farao.closed_optimisation_rao.fillers.GeneratorRedispatchCostsFiller
        - com.farao_community.farao.closed_optimisation_rao.fillers.PhaseShiftVariablesFiller
        - com.farao_community.farao.closed_optimisation_rao.fillers.CostlyRaoObjectiveFiller
        - com.farao_community.farao.closed_optimisation_rao.fillers.RedispatchEquilibriumConstraintFiller
    pre-processors:
        - com.farao_community.farao.closed_optimisation_rao.pre_processors.SensitivityPreProcessor
```

#### XML version

```xml
<componentDefaultConfig>
    <RaoComputationFactory>com.farao_community.farao.closed_optimisation_rao.ClosedOptimisationRaoFactory</RaoComputationFactory>
</componentDefaultConfig>

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

## Problem examples

Some examples of problem instanciation in closed optimisation engine for concrete projects are
available:
- [Optimal redispatch](/docs/engine/ra-optimisation/closed-optimisation-rao/optimal-redispatch)
