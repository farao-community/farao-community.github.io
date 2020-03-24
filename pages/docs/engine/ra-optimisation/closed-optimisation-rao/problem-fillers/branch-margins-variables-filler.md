---
layout: documentation
title: Branches margin variables filler
hide: true
permalink: /docs/engine/ra-optimisation/closed-optimisation-rao/problem-fillers/branch-margin-variables-filler
feature-img: "assets/img/Hans_Otto_Theater_Potsdam_-_fake_colors_cut.jpg"
tags: [Docs]
category: Computation engines
---

This optimisation problem filler plugin is responsible for adding variables and associated constraints regarding actual
margin computation (in MW) based on pre-contingency and post contingency data from input CRAC file.

## Expected elements

### Data

This optimisation problem filler expect as external data the reference flows for each of the monitored
branches (preventive, outage or curative).

The expected data is labelled **referenceFlows** of type *Map\<String, Double\>*.

## Modified elements

This optimisation problem filler does not modify any external element.

## Provided elements

### Variables

For each monitored branch of the CRAC file (preventive, outage or curative), two unbounded numerical variables standing for the margins on
each direction of the branch are added:

- **\<monitoredBranchId\>_margin_dir_1**
- **\<monitoredBranchId\>_margin_dir_2**

### Constraints

For each monitored branch of the CRAC file (preventive, outage or curative), two equality constraints
standing for margins calculation on each direction of the branch are added:

- fmax - fref < **\<monitoredBranchId\>_margin_dir_1** < fmax - fref
- fmax + fref < **\<monitoredBranchId\>_margin_dir_2** < fmax + fref

where fmax of each monitored branch is provided in the CRAC file and fref is read from the provided
input map.

## Example

## Adding to RAO configuration

For adding *Branches margin variables filler* to your optimisation problem, add the following element in your
RAO configuration parameters:

```yaml
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