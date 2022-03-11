---
layout: documentation
title: JSON Parameters
permalink: /docs/parameters/json-parameters
hide: true
root-page: Documentation
docu-section: Parameters
docu-parent: Parameters
feature-img: "assets/img/farao3.jpg"
tags: [Docs, Parameters]
order: 2
---

## Overview {#overview}

The JSON parameters file allows tuning the RAO:
- to chose the **business objective function** of the RAO (maximize min margin, get a positive margin, ...)
- to activate/deactivate optional business **features**
- to fine-tune the search algorithm, improve **performance** and/or **quality** of results

The Java object used is called [RaoParameters](). It can hold extensions. The following paragraphs explain in detail the used parameters in the RAO.  
Using the RaoParameters Java object or the JSON file is pretty straight forward, thus it will not be detailed here.

**Jump to:**
* [Linear problem & solver parameters](#mip-parameters)
* [Search-tree parameters (extension)](#search-tree-parameters)
  - [End of search conditions](#stop-criterion-parameters)
  - [Number of RA limitation](#ra-usage-limits)
    - [Geographical criterion](#ra-usage-geo)
    - [Objective function impact](#ra-usage-impact)
    - [Simultaneous usage of remedial action limitations](#ra-usage-number)
  - [Computations parallelism](#parallelism)
  - [Other SearchTreeRao parameters](#other-search-tree-parameters)
* [RangeAction usage limitation](#range-action-usage-limitation)
* [Relative margin parameters](#relative-margin-parameters)
* [Mnec-related parameters](#mnec-parameters)
* [Loopflow-related parameters](#loopflow-parameters)
* [Sensitivity and Load-flow parameters](#sensi-lf-parameters)
* [Other RAO parameters](#other-rao-parameters)

## Linear problem & solver parameters {#mip-parameters}

### objective-function
- **Expected value**: one of the following:
  - "MAX_MIN_MARGIN_IN_MEGAWATT" 
  - "MAX_MIN_MARGIN_IN_AMPERE"
  - "MAX_MIN_RELATIVE_MARGIN_IN_MEGAWATT" 
  - "MAX_MIN_RELATIVE_MARGIN_IN_AMPERE"
- **Default value**: "MAX_MIN_MARGIN_IN_MEGAWATT"
- **Usage**: this parameter sets the objective function of the RAO. For now, the existing objective function are:  
  - **MAX_MIN_MARGIN_IN_MEGAWATT**: maximization of the min(margin), where min(margin) is the smallest margin of all Cnecs and the margins are considered in MW.  
  - **MAX_MIN_MARGIN_IN_AMPERE**: maximization of the min(margin), where min(margin) is the smallest margin of all Cnecs and the margins are considered in A. Note that this objective function is not just an homothecy of the previous one, as Cnecs from different voltage levels will not have the same weight in the objective function depending on the unit considered (MW or A). This objective function does not work if sensitivity computation are made in DC mode.  
  - **MAX_MIN_RELATIVE_MARGIN_IN_MEGAWATT**: same as MAX_MIN_MARGIN_IN_MEGAWATT, but the margins will be relative (divided by the absolute sum of PTDFs) when they are positive  
  - **MAX_MIN_RELATIVE_MARGIN_IN_AMPERE**: same as MAX_MIN_MARGIN_IN_AMPERE, but the margins will be relative (divided by the absolute sum of PTDFs) when they are positive

### max-number-of-iterations {#max-number-of-iterations}
- **Expected value**: integer
- **Default value**: 10
- **Usage**: defines the maximum number of iterations that will be made by the iterating linear optimiser of the RAO.  
One iteration of the iterating linear optimiser includes : the resolution of one linear problem, an update of the network with the optimal PST taps found in the linear problem, a security analysis of the updated network and an assessment of the objective function based on the results of the security analysis.  
The linear problem rely on sensitivity coefficients to estimate the flows and each Cnec, and those estimation might not be perfect when several PSTs taps are significantly changed. If the linear optimisation problem make a (n+1)th iteration, it means that it is refining its solution with new sensitivity coefficients, which better describe the neighbourhood of the solution found in iteration (n)th.  
Note that the linear optimisation problems usually "converge" in a very few iterations (1 to 4 iterations).

### optimization-solver {#optimization-solver}
- **Expected value**: one of the following:
  - "CBC"
  - "SCIP"
  - "XPRESS"
- **Default value**: "CBC"
- **Usage**: the solver called for optimising the linear problem.  
Note that theoretically all solvers supported by OR-Tools can be called, but the FARAO interface only allows CBC (open-source), SCIP (commercial) and XPRESS (commercial) for the moment.  
If needed, other solvers can be easily added.

### solver-specific-parameters {#solver-specific-parameters}
- **Expected value**: String, space-separated parameters (keys and values) understandable by OR-Tools (for example "key1 value1 key2 value2")
- **Default value**: empty
- **Usage**: this can be used to set solver-specific parameters, when the OR-Tools API and its generic parameters are not enough.  
For example, here is the value set for CORE CC when using XPRESS: "THREADS 1 MAXNODE 100000 MAXTIME 300" (it sets the number of threads XPRESS uses to solve a single linear problem to 1, the maximum number of branch-and-bound nodes ro 100000 to prevent divergence, and the maximum solve time to 300 seconds to prevent divergence as well) 

### pst-optimization-approximation {#pst-optimization-approximation}
- **Expected value**: one of the following:
  - "CONTINUOUS"
  - "APPROXIMATED_INTEGERS"
- **Default value**: "CONTINUOUS"
- **Usage**: the method to model PSTs in the linear problem:  
**CONTINUOUS**: PSTs are represented by their angle setpoints; the setpoints are continuous optimisation variables and FARAO rounds the result to the best tap (around the optimal setpoint) after optimisation. This approach is not very precise but does not create integer optimisation variables; thus it is quicker to solve, especially with open-source solvers.  
**APPROXIMATED_INTEGERS**: a PST is represented by its tap positions, and these tap positions are considered proportional to the PST's angle setpoint (hence the "approximated" adjective). Thus these tap positions can be used as a multiplier of the sensitivity values when representing the impact of the PST on CNECs. This approach is more precise and thus has the advantage of better respecting LoopFlow and MNEC constraints. But it introduces integer variables (tap positions) and can be harder to solve. (For instance, it is not possible to use it with CBC for CORE D2CC, we had to use XPRESS).

### relative-mip-gap {#relative-mip-gap}
- **Expected value**: double
- **Default value**: 0.0001
- **Usage**: the relative MILP (Mixed-Integer-Linear-Programming) target gap.  
During branch-and-bound algorithm (only in MILP case), the solver will stop branching when this relative gap is reached between the best found objective function and the estimated objective function best bound.

## Search-tree parameters (extension) {#search-tree-parameters}
The [SearchTreeRaoParameters](https://github.com/farao-community/farao-core/blob/master/ra-optimisation/search-tree-rao/src/main/java/com/farao_community/farao/search_tree_rao/castor/parameters/SearchTreeRaoParameters.java) class is a RaoParameters extension used to tune the search-tree RAO's behaviour.

### End of search conditions {#stop-criterion-parameters}

#### maximum-search-depth {#maximum-search-depth}
- **Expected value**: integer
- **Default value**: 2^32 -1 (max integer value)
- **Usage**: maximum search tree depth.  
Applies separately to the preventive RAO and to each perimeter-specific curative RAO.

#### preventive-rao-stop-criterion {#preventive-rao-stop-criterion}
- **Expected value**: one of the following:
  - "SECURE"
  - "MIN_OBJECTIVE"
- **Default value**: "SECURE"
- **Usage**: Stop criterion of the preventive RAO search tree.  
If the stop criterion is **MIN_OBJECTIVE**, the search-tree will maximize the minimum margin until it converges to a maximum value, or until another stop criterion has been reached (see also maximum-search-depth).  
If the stop criterion is **SECURE**, the search-tree will stop at the depth where it founds a solution where the minimum margin is positive. Note that the search-tree will not return the first solution with a positive margin that it finds, it will first assess the efficiency of all the topological action of its current search depth and return the one with the greatest minimum margin.  
*Note that if the optimal margin is negative, both stop criterion should return the same solution.*

#### curative-rao-stop-criterion {#curative-rao-stop-criterion}
- **Expected value**: one of the following:
  - "SECURE"
  - "MIN_OBJECTIVE"
  - "PREVENTIVE_OBJECTIVE"
  - "PREVENTIVE_OBJECTIVE_AND_SECURE"
- **Default value**: "MIN_OBJECTIVE"
- **Usage**: stop criterion for the curative RAO search tree.  
**MIN_OBJECTIVE**: minimizing objective (maximize min margin)  
**SECURE**: stop when objective is strictly negative (min margin is strictly positive)  
**PREVENTIVE_OBJECTIVE**: stop when preventive objective is reached, and improved by at least "curative-rao-min-obj-improvement"  
**PREVENTIVE_OBJECTIVE_AND_SECURE**: stop when preventive objective is reached, and improved by at least "curative-rao-min-obj-improvement", and the situation is secure  
*The values "PREVENTIVE_OBJECTIVE" and "PREVENTIVE_OBJECTIVE_AND_SECURE" allow you to speed up the curative RAO without degrading the final solution (minimum margin over all perimeters). However, using them means the flowbased domain is not maximized for all perimeters.*

#### curative-rao-min-obj-improvement {#curative-rao-min-obj-improvement}
- **Expected value**: numeric value, where the unit is that of the objective function
- **Default value**: 0
- **Usage**: used as a minimum improvement of the preventive RAO objective value for the curative RAO stop criterion, when it is set to PREVENTIVE_OBJECTIVE or PREVENTIVE_OBJECTIVE_AND_SECURE.

#### second-preventive-optimization-condition {#second-preventive-optimization-condition}
- **Expected value**: one of the following:
  - "DISABLED"
  - "COST_INCREASE"
  - "POSSIBLE_CURATIVE_IMPROVEMENT"
- **Default value**: "DISABLED"
- **Usage**: configures whether a 2nd preventive RAO should be run after the curative RAO.  
*(Note that if there are automatons, and if a 2nd preventive RAO is run, then a 2nd automaton RAO is run)*
**DISABLED**: no 2nd preventive RAO is run  
**COST_INCREASE**: a 2nd preventive RAO is run if the RAO's overall cost has increased after optimisation compared to before optimisation; for example due to a curative MNEC constraint violated in 1st preventive RAO and not solved during curative RAO  
**POSSIBLE_CURATIVE_IMPROVEMENT**: a 2nd preventive RAO is run only if it is possible to improve a curative perimeter, depending on the curative-rao-stop-criterion (ie if the curative RAO stop criterion on at least one perimeter is not reached):
  - **SECURE**: if one curative perimeter is not secure after optimisation
  - **PREVENTIVE_OBJECTIVE**: if one curative perimeter reached an objective function value after optimisation that is worse than the preventive perimeter's (eventually decreased by curative-rao-min-obj-improvement)
  - **PREVENTIVE_OBJECTIVE_AND_SECURE**: if one of the two conditions above is met
  - **MIN_OBJECTIVE**: always  

### Number of RA limitation {#ra-usage-limits}
Three families of parameters exist in order to limit the number of remedial actions used in the search-tree RAO.

### Geographical criterion {#ra-usage-geo}

#### skip-network-actions-far-from-most-limiting-element {#skip-network-actions-far-from-most-limiting-element}
- **Expected value**: true/false
- **Default value**: false
- **Usage**: whether the RAO should skip evaluating topological actions that are geographically far from the most limiting element at the time of the evaluation. This is defined by the number of country boundaries separating the element from the topological action (see [max-number-of-boundaries-for-skipping-network-actions](#max-number-of-boundaries-for-skipping-network-actions)).  
Setting this to true allows you to speed up the search tree RAO, while keeping a good precision, since topological actions that are far from the most limiting element have almost no impact upon the minimum margin.

#### max-number-of-boundaries-for-skipping-network-actions {#max-number-of-boundaries-for-skipping-network-actions}
- **Expected value**: positive integer (or 0)
- **Default value**: 2
- **Usage**: the maximum number of country boundaries between the most limiting element and the topological actions that shall be evaluated. The most limiting element is defined as the element with the minimum margin at the time of this evaluation (thus it can change afterwards!).  
If the most limiting element has nodes in two countries, the smallest distance is considered.  
If the value is set to zero, only topological actions in the same country as the most limiting element (or at least the same country as one of its nodes) will be evaluated in the search tree.  
If the value is set to 1, topological actions from direct neighbors will also be considered, etc.  
*Note that the topology of the network is automatically deducted from the network file: countries sharing tie lines are considered direct neighbors; dangling lines are not considered linked (ie BE and DE are not considered neighbors, even though they share the Alegro line)*

### Objective function impact {#ra-usage-impact}

#### absolute-network-action-minimum-impact-threshold {#absolute-network-action-minimum-impact-threshold}
- **Expected value**: numeric value, where the unit is that of the objective function
- **Default value**: 0.0
- **Usage**: if a topological action improves the objective function of x, with x < absolute-network-action-minimum-impact-threshold, the effectivness of this topological action will be considered inconsequent and this topological action will not be retained by the search-tree even if it improves the objective function.  
The absolute-network-action-minimum-impact-threshold can therefore fill two purposes:
  - do not add into the optimal solution of the RAO remedial actions whose impact is negligible
  - speed up the computation by avoiding the few final depths which would have just slighty refine the solution.

#### relative-network-action-minimum-impact-threshold {#relative-network-action-minimum-impact-threshold}
- **Expected value**: numeric value, percentage defined between 0 and 1 (1 = 100%)
- **Default value**: 0.0
- **Usage**: behaves like [absolute-network-action-minimum-impact-threshold](#absolute-network-action-minimum-impact-threshold), but where the threshold is defined as a percentage of the objective function value of the previous depth. In depth (n+1), if a topological action improves the objective function of x, with x < solution(depth(n)) x relative-network-action-minimum-impact-threshold, it will not be retained by the search-tree even if it improves the objective function.

### Simultaneous usage of remedial action limitations {#ra-usage-number}

#### max-curative-ra {#max-curative-ra}
- **Expected value**: integer
- **Default value**: 2^32 -1 (max integer value)
- **Usage**: this parameter defines the maximum number of curative remedial actions allowed in the RAO: it prevents to iterate on a leaf when too many remedial actions have already been used, and it allows to filter range actions to optimise if too many curative range actions are available compared to the total number of curative remedial actions allowed. Range actions kept are the one with the highest sensitivity on the flow of the most limiting element.  
If not specified, its value is supposed to be infinite.  
This parameter is only used during the curative RAO.

#### max-curative-tso {#max-curative-tso}
- **Expected value**: integer
- **Default value**: 2^32 -1 (max integer value)
- **Usage**: this parameter defines the maximum number of TSOs that can apply remedial actions on a given perimeter. it prevents iterating on a leaf when the maximum number of tsos has been reached and the tsos already activated have no network actions left, and it allows to filter range actions used in the optimisation if activating all the range actions would mean activating more tsos than allowed. Range actions kept are the ones belonging to the tsos who have the range actions with the highest sensitivity on the flow of the most limiting element.  
If not specified, its value is supposed to be infinite.  
This parameter is only used during the curative RAO.

#### max-curative-ra-per-tso {#max-curative-ra-per-tso}
- **Expected value**: a map with string keys and integer values. The keys should be the same as the RAs' operators as written in the CRAC file
- **Default value**: empty map
- **Usage**: this parameter defines the maximum number of curative remedial actions allowed for the different TSOs.  
The TSOs should be listed using the same names as the CRAC file. If a TSO does not appear in this map, then the number is supposed infinite.  
This parameter is only used during the curative RAO.

#### max-curative-topo-per-tso {#max-curative-topo-per-tso}
- **Expected value**: a map with string keys and integer values. The keys should be the same as the RAs' operators as written in the CRAC file
- **Default value**: empty map
- **Usage**: this parameter defines the maximum number of curative topological remedial actions allowed for the different TSOs.  
The TSOs should be listed using the same names as the CRAC file. If a TSO does not appear in this map, then the number is supposed infinite.  
This parameter is only used during the curative RAO.

#### max-curative-pst-per-tso {#max-curative-pst-per-tso}
- **Expected value**: a map with string keys and integer values. The keys should be the same as the RAs' operators as written in the CRAC file
- **Default value**: empty map
- **Usage**: this parameter defines the maximum number of curative PST remedial actions allowed for the different TSOs.  
The TSOs should be listed using the same names as the CRAC file. If a TSO does not appear in this map, then the number is supposed infinite.  
This parameter is only used during the curative RAO.

### Computations parallelism {#parallelism}

#### preventive-leaves-in-parallel {#preventive-leaves-in-parallel}
- **Expected value**: integer
- **Default value**: 1
- **Usage**: this parameter sets the number of combination of remedial action that the search tree will investigate in parallel during the **preventive RAO**.  
It should therefore not exceed the number of cores of the computer on which the computation is made. Note that the more leaves are computed in parallel, the more RAM is required by the RAO, and that the performance of the RAO might significantly decrease on a machine where the memory has been saturated.

#### curative-leaves-in-parallel {#curative-leaves-in-parallel}
- **Expected value**: integer
- **Default value**: 1
- **Usage**: this parameter sets the number of combination of remedial action that the search tree will investigate in parallel during the **curative RAO**.  
It is seperated from [preventive-leaves-in-parallel](#preventive-leaves-in-parallel) because during the curative RAO we also have the option to parallelize the curative perimeters, so a compromise should be found. It may be optimal to set this parameter to 1 and maximize [perimeters-in-parallel](#perimeters-in-parallel)

### Other SearchTreeRao parameters {#other-search-tree-parameters}

#### curative-rao-optimize-operators-not-sharing-cras {#curative-rao-optimize-operators-not-sharing-cras}
- **Expected value**: true/false
- **Default value**: true
- **Usage**: if this parameter is set to false, the RAO will detect TSOs not sharing any curative remedial actions (in the CRAC). During the curative RAO, these TSO's CNECs will not be taken into account in the minimum margin objective function, unless the applied curative remedial actions decrease their margins (relatively to the margins in the curative state without any remedial actions).  
If it is set to false, all CNECs are treated equally in the curative RAO.  
This parameter has no effect on the preventive RAO.  
This parameter should be set to true for CORE CC.

#### network-action-combinations {#network-action-combinations}
- **Expected value**: an array containing arrays of network action IDs
- **Default value**: empty
- **Usage**: this parameter contains hints for the search-tree RAO, consisting of combinations of multiple network actions that the user considers interesting to test together during the RAO.  
These combinations will be tested in the first search depth of the search-tree
![Search-tree-with-combinations](/assets/img/Search-tree-with-combinations.png)

## RangeAction usage limitation {#range-action-usage-limitation}

### pst-sensitivity-threshold {#pst-sensitivity-threshold}
- **Expected value**: numeric value, unit: MW / °
- **Default value**: 0.0
- **Usage**: the pst sensitivity coefficients which are below the pst-sensitivity-threshold will be considered equal to zero by the linear optimisation problem. Filtering some of the small sensitivity coefficients have the two following perks regarding the RAO:
  - it decreases the complexity of the optimisation problem by reducing significantly the number of non-null elements
  - it can avoid changes of PST setpoints when they only allow to earn a few MW on the margins of some Cnecs.  

When Hades2 is used, this parameter is somehow redundant with the PowSyBl resultsThreshold parameter. The resultThreshold is actually even more effective as the pst-sensitivity-threshold also speeds up the sensitivity computations and decrease the amount of RAM required by the RAO.

### pst-penalty-cost {#pst-penalty-cost}
- **Expected value**: numeric value, unit: unit of the objective function / °
- **Default value**: 0.01
- **Usage**: the pst-penalty-cost represents the cost of changing the PST setpoints, it is used within the linear optimisation problem of the RAO, where, for each PST, the following term is added to the objective function: *pst-penalty-cost x |alpha - alpha0|*, where *alpha* is the optimized angle of the PST, and *alpha0* the angle in its initial position.  
If several solutions are equivalent (e.g. with the same min margin), a strictly positive  pst penaly cost will favour the ones with the PST taps the closest to the initial situation.

### hvdc-sensitivity-threshold {#hvdc-sensitivity-threshold}
- **Expected value**: numeric value, unit: MW / MW
- **Default value**: 0.0
- **Usage**: the hvdc sensitivity coefficients which are below the hvdc-sensitivity-threshold will be considered equal to zero by the linear optimisation problem. Filtering some of the small sensitivity coefficients have the two following perks regarding the RAO:
  - it decreases the complexity of the optimisation problem by reducing significantly the number of non-null elements
  - it can avoid changes of HVDC setpoints when they only allow to earn a few MW on the margins of some Cnecs.  

When hades2 is used, this parameter is somehow redundant with the PowSyBl resultsThreshold parameter. The resultThreshold is actually even more effective as the hvdc-sensitivity-threshold also speeds up the sensitivity computations and decrease the amount of RAM required by the RAO.

### hvdc-penalty-cost {#hvdc-penalty-cost}
- **Expected value**: numeric value, unit: unit of the objective function / MW
- **Default value**: 0.001
- **Usage**: the hvdc-penalty-cost represents the cost of changing the HVDC setpoints, it is used within the linear optimisation problem of the RAO, where, for each HVDC, the following term is added to the objective function: *hvdc-penalty-cost x |P - P0|*, where *P* is the optimized target power of the HVDC, and *P0* the initial target power.  
If several solutions are equivalent (e.g. with the same min margin), a strictly positive  hvdc penaly cost will favour the ones with the HVDC setpoints the closest to the initial situation.

### injection-ra-sensitivity-threshold {#injection-ra-sensitivity-threshold}
- **Expected value**: numeric value, unit: MW / MW
- **Default value**: 0.0
- **Usage**: the injection sensitivity coefficients which are below the injection-ra-sensitivity-threshold will be considered equal to zero by the linear optimisation problem.  
The perks are the same as the two parameters above.

### injection-ra-penalty-cost {#injection-ra-penalty-cost}
- **Expected value**: numeric value, unit: unit of the objective function / MW
- **Default value**: 0.001
- **Usage**: the injection-ra-penalty-cost the cost of changing the injection setpoints, it is used within the linear optimisation problem of the RAO, in the same way as the two types of RangeAction above.

## Relative margin parameters {#relative-margin-parameters}

### relative-margin-ptdf-boundaries {#relative-margin-ptdf-boundaries}
- **Expected value**: array of zone-to-zone PTDF computation definition, expressed as an equation.  
Zones are defined by their 2-character code or their 16-character EICode, inside **{ }** characters.  
Zones are seperated by + or -.  
All combinations are allowed: country codes, EIC, a mix.
- **Default value**: empty array
- **Usage**: in case the [objective function](#objective-function) is maximizing relative margins, this parameter should be present and contain the boundaries on which the PTDF absolute sums should be computed (and added to the denominator of the relative RAM).  
For example, in the SWE case, it should be equal to [ "{FR}-{ES}", "{ES}-{PT}" ].  
For CORE, we should use all the CORE region boundaries (all countries seperated by a - sign) plus Alegro's special equation: "{BE}-{22Y201903144---9}-{DE}+{22Y201903145---4}"

### ptdf-sum-lower-bound {#ptdf-sum-lower-bound}
- **Expected value**: numeric value, no unit (homogeneous to PTDFs)
- **Default value**: 0.01
- **Usage**: in case the [objective function](#objective-function) is maximizing relative margins, PTDF absolute sums are used as a denominator in the objective function. In order to prevent the objective function from diverging to infinity (resulting in unbounded problems), the denominator should be prevented from getting close to zero. This parameter acts as a lower bound to the denominator.

## Loopflow-related parameters {#loopflow-parameters}

### rao-with-loop-flow-limitation {#rao-with-loop-flow-limitation}
- **Expected value**: true/false
- **Default value**: false
- **Usage**: if this parameter is at 'true', the RAO will monitor the loop-flows on the Cnec which contains a CnecLoopFlowExtension. The RAO will compute the loop-flows on those Cnecs, and return their value for the pre-optimisation variant, and the optimal variant. Moreover, the RAO will penalise the loop-flows which exceed their initial (pre-optimisation) value and their inputLoopFlow threshold (given in the CnecLoopFlowExtension). If this penalisation is high enough, this should result in a behaviour in which the RAO ensures that the loop-flows do not exceed the aforementioned threshold. See also loopflow-violation-cost.  
Note that, in addition to this parameter been at 'true', the CRAC in input of the RAO should contains a CracLoopFlowExtension with GLSKs and a list of countries. Without these information, the RAO will not be able to compute the loop-flows and will behave as if this parameter was set to 'false'.  
With the default value,' false', the loop-flows will not be computed and monitored during the RAO.

### loop-flow-approximation {#loop-flow-approximation}
- **Expected value**: one of the following:
  - "FIXED_PTDF"
  - "UPDATE_PTDF_WITH_TOPO"
  - "UPDATE_PTDF_WITH_TOPO_AND_PST"
- **Default value**: "FIXED_PTDF"
- **Usage**: define the level of appriximation with which the PTDFs will be considered in the loop-flow computation. This parameter enable to set the desired trade-off between the accuracy of the loop-flow computation, and the computation time of the RAO.  
**FIXED_PTDF**: the PTDFs are computed only once at the beginning of the RAO.  
**UPDATE_PTDF_WITH_TOPO**: the PTDFs are re-computed for each new configuration of selected topological actions (i.e. for each new node of the seach-tree).  
**UPDATE_PTDF_WITH_TOPO_AND_PST**: the PTDFs are re-computed for each new confiuration of topological action and for each new combination of selected PST taps (i.e. for each iteration of the linear optimisation).  
*Note that the UPDATE_PTDF_WITH_TOPO_AND_PST is not relevant in DC mode, as the UPDATE_PTDF_WITH_TOPO already enable to get the maximum possible accurate loop-flow assessment in DC.*

### loop-flow-constraint-adjustment-coefficient {#loop-flow-constraint-adjustment-coefficient}
- **Expected value**: numeric values, in MEGAWATT unit
- **Default value**: 0.0 MW
- **Usage**: this parameter acts as a margin which tighten, in the linear optimisation problem of RAO, the bounds of the loop-flow constraints. It conceptually behaves as the coefficient *c-adjustment* from the constraint below:  
*abs(loop-flow(cnec)) <= loop-flow-threshold - c-adjustment*  
This parameter is a safety margin which can absorb some of the approximations which are made in the linear optimisation problem of the RAO (non integer PSTs taps, flows approximated by sensi coefficient, etc.), and therefore increase the probability that the loop-flow constraints which are respected in the linear optimisation problem, remain respected once the loop-flows are re-computed without the linear approximations.

### loop-flow-violation-cost {#loop-flow-violation-cost}
- **Expected value**: numeric values, unit = unit of the objective function per MEGAWATT
- **Default value**: 10.0
- **Usage**: this parameter is the cost of each excess of loop-flow. That is to say, if the loop-flows on one or several Cnecs exceed the loop-flow threshold, a penalty will be added in the objective function of the RAO equal to:  *loopflow-violation-cost x sum{cnec} excess-loop-flow(cnec)*  
This parameter is used only if [rao-with-loop-flow-limitation](#rao-with-loop-flow-limitation) is set to 'true'.

### loop-flow-acceptable-augmentation {#loop-flow-acceptable-augmentation}
- **Expected value**: numeric values, in MEGAWATT unit
- **Default value**: 0.0 MW
- **Usage**: the increase of the initial loop-flow that is allowed by the optimisation. That is to say, the optimisation bounds the loop-flow on CNECs by:  
*LFcnec ≤ max(MaxLFcnec , InitLFcnec + acceptableAugmentation)*  
With *LFcnec* the loop-flow on the CNEC after optimisation, *MaxLFcnec* is the CNEC loop-flow threshold, *InitLFcnec* the initial loop-flow on the cnec, and *acceptableAugmentation* the so-called "loop-flow-acceptable-augmentation" coefficient.  
If this constraint cannot be respected and the loop-flow excess the aforementioned threshold, the objective function associated to this situation will be penalized (see also [loop-flow-violation-cost](#loop-flow-violation-cost))

### loopflow-countries {#loopflow-countries}
- **Expected value**: array of country codes "XX"
- **Default value**: all countries encountered
- **Usage**: list of countries for which loopflows should be limited accordingly to the specified constraints. If not present, all countries encountered in the input files will be considered. Note that a corss-border line will have its loopflows monitored if at least one of its two sides is in a country from this list.  
Example of this parameter : [ "BE", "NL" ] if you want to monitor loopflows in and out of Belgium and the Netherlands.

## Mnec-related parameters {#mnec-parameters}

### rao-with-mnec-limitation {#rao-with-mnec-limitation}
- **Expected value**: true/false
- **Default value**: false
- **Usage**: if this parameter is at 'true', the RAO will monitor MNECs, using the three following parameters.

### mnec-acceptable-margin-diminution {#mnec-acceptable-margin-diminution}
- **Expected value**: numeric values, in MEGAWATT unit
- **Default value**: 50 MW (required by core CC methodology)
- **Usage**: the decrease of the initial margin that is allowed by the optimisation on MNECs.  
In other words, it defines the bounds for the margins on the MNECs by  
*Mcnec ≥ max(0, m0cnec − acceptableDiminution)*  
With *Mcnec* the margin on the cnec after optimisation, *m0cnec* the initial margin on the cnec, and *acceptableDiminution* the so-called "mnec-acceptable-margin-diminution"coefficient.  
For the Core CC calculation, the ACER methodology fixes this coefficient at 50 MW.

### mnec-violation-cost {#mnec-violation-cost}
- **Expected value**: numeric values, no unit (it applies as a multiplier for the constraint violation inside the objective function)
- **Default value**: 10 (same as [loopflow violation](#loop-flow-violation-cost) cost)
- **Usage**: the penalty cost associated to the violation of a MNEC constraint.
In order to avoid optimisation infeasibility, the MNEC constraints are soft: they can be violated. These violations are penalized by a significant cost, in order to guide the optimiser towards a solution where - if possible - all MNECs' constraints are respected. The penalty injected in the objective function is equal to the violation (difference between actual margin and least acceptable margin) multiplied by this parameter.

### mnec-constraint-adjustment-coefficient {#mnec-constraint-adjustment-coefficient}
- **Expected value**: numeric values, in MEGAWATT unit
- **Default value**: 0.0
- **Usage**: this coefficient is here to mitigate the approximation made by the linear optimisation (approximation = use of sensitivities to linearize the flows, rounding of the PST taps).  
*Mcnec ≥ max(0 , m0cnec - acceptableDiminution) + constraintAdjustment*  
With *constraintAdjustment* the so-called "mnec-constraint-adjustment-coefficient".  
It tightens the MNEC constraint, in order to take some margin for that constraint to stay respected once the approximations are removed (i.e. taps have been rounded and real flow calculated)

## Sensitivity and Load-flow parameters {#sensi-lf-parameters}

### sensitivity-fallback-over-cost {#sensitivity-fallback-over-cost}
- **Expected value**: numeric value, where the unit is that of the objective 
- **Default value**: 0.0
- **Usage**: if the systematic sensitivity analysis worked on a combination of remedial action with the fallback configuration instead of the default configuration - due for instance to a divergence in the default configuration - its objective function assessment will be penalized by the sensitivity-fallback-over-cost. That is to say, the criterion for this combination of RA will be (e.g.) : minMargin - sensitivity-fallback-over-cost.  
If this parameter is strictly positive, the RAO will discriminate the combinations of RA for which the systematic analysis didn't converge with the default configuration. The RAO might therefore put aside the solution with the best objective-function if it was assessed with the fallback-sensitivity-parameters, and instead propose a solution whose objective-function is worse, but whose associated network converged with the default sensitivity-parameters.

### sensitivity-parameters {#sensitivity-parameters}
- **Expected value**: SensitivityComputationParameters (PowSyBl configuration)
- **Default value**: 
~~~json
"sensitivity-parameters" : {
    "version" : "1.0",
    "load-flow-parameters" : {
      "version" : "1.6",
      "voltageInitMode" : "UNIFORM_VALUES",
      "transformerVoltageControlOn" : false,
      "phaseShifterRegulationOn" : false,
      "noGeneratorReactiveLimits" : false,
      "twtSplitShuntAdmittance" : false,
      "shuntCompensatorVoltageControlOn" : false,
      "readSlackBus" : true,
      "writeSlackBus" : false,
      "dc" : false,
      "distributedSlack" : true,
      "balanceType" : "PROPORTIONAL_TO_GENERATION_P_MAX",
      "dcUseTransformerRatio" : true,
      "countriesToBalance" : [ ],
      "connectedComponentMode" : "MAIN"
    }
~~~
- **Usage**: sensitivity-parameters is the default configuration of the PowSyBl sensitivity engine, which is used within FARAO. The most useful settings for the RAO are:  
**dc**: true or false, define whether the network calculation are made in AC (false) or DC (true)

### fallback-sensitivity-parameters {#fallback-sensitivity-parameters}
- **Expected value**: SensitivityComputationParameters (PowSyBl configuration)
- **Default value**: empty (no fallback configuration)
- **Usage**: during the RAO, sensitivity computations will be made using the default configuration given in [sensitivity-parameters](#sensitivity-parameters). However, a fallback configuration can be defined in the case that some of the sensitivity computation fails (for instance, due to a divergence in an AC computation). In case of a failure, the sensitivity computation will be re-run using the fallback configuration.  
For example, a switch between AC and DC mode can be made for the computation which do not converge in AC.

### load-flow-provider {#load-flow-provider}
- **Expected value**: String, should refer to a [PowSyBl load flow provider implementation](https://www.powsybl.org/pages/documentation/developer/artifacts.html#power-flow)
- **Default value**: "Hades2"
- **Usage**: the name of the load flow provider to use when a load flow is needed

### sensitivity-provider {#sensitivity-provider}
- **Expected value**: String, should refer to a [PowSyBl sensitivity provider implementation](https://www.powsybl.org/pages/documentation/developer/artifacts.html)
- **Default value**: "Sensi2"
- **Usage**: the name of the sensitivity provider to use in the RAO

## Other RAO parameters {#other-rao-parameters}

### perimeters-in-parallel {#perimeters-in-parallel}
- **Expected value**: integer
- **Default value**: 1
- **Usage**: number of curative perimeters to optimise in parallel.  
"perimeters-in-parallel" should therefore not exceed the number of cores of the computer on which the computation is made.  
*Note that the more perimeters are optimised in parallel, the more RAM is required by the RAO, and that the performance of the RAO might significantly decrease on a machine where the memory has been saturated.*

### forbid-cost-increase {#forbid-cost-increase}
- **Expected value**: true/false
- **Default value**: false
- **Usage**: if this parameter is set to **true**, FARAO will post-check the results after optimisation. If the value of the objective function is worse after optimisation than before optimisation, then it will return the initial solution (ie no PRA and no CRA applied).  
This can happen for example if the preventive RAO violates an unseen curative MNEC constraint, that cannot be solved during curative RAO.  
If this parameter is set to **false**, FARAO will return the real result of optimisation, which has a worse result than the initial situation.