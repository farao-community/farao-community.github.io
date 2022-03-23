---
layout: documentation
title: RAO Business Warnings
permalink: /docs/output-data/rao-business-warns
hide: true
root-page: Documentation
docu-section: Output Data
docu-parent: RAO Logs
order: 2
feature-img: "assets/img/farao3.jpg"
tags: [Docs, Data]
---

## Overview

These logs contain warnings that may occur during the search-tree algorithm. Activate them if you want to know when unordinary situations are met.  
Possible warnings are listed below.  

Package name:  
~~~java
com.farao_community.farao.commons.logs.RaoBusinessWarns
~~~

## Possible warnings

| Module | Name | Label | Description | Consequence |
|--------|------|-------|-------------|-------------|
| ra-optimisation | Available network action automaton | "CRAC has network action automatons with usage method AVAILABLE. These are not supported." | An automatic network action has an "available" usage method. The RAO only knows how to interpret "forced" and "to be evaluated" usage methods for automatons. | The given RA is not used in AUTO instant simulation. |
| ra-optimisation | Wrong initial setpoint | "Range action {name} has an initial setpoint of {setpoint} that does not respect its allowed range [{min} {max}]. It will be filtered out of the linear problem." | The range action's initial setpoint does not respect its allowed range. This makes the initial situation infeasible, renders the problem hard to optimize, and the results harder to interpret. | The given RA is ignored in the RAO, and kept at its initial setpoint. |
| ra-optimisation | Unaligned range actions in same group | "Range actions of group {group name} do not have the same initial setpoint. They will be filtered out of the linear problem." | Two or more range actions belonging to the same group have different initial setpoints. <br> This makes the initial situation infeasible, renders the problem hard to optimize, and the results harder to interpret. <br> The given RAs are ignored in the RAO, and kept at their initial setpoints. |
| ra-optimisation | Excluded range actions from 2P | "Range action {name} will not be considered in 2nd preventive RAO as it is also curative (or its network element has an associated CRA)" | Range actions that are both preventive and curative cannot be re-optimized in the 2nd preventive optimization, because this would risk making their curative optimal setpoints infeasible (eg because of "relative to previous instant" ranges). | These range actions are ignored in 2nd preventive optimization. <br> They are kept at their 1st preventive optimization optimal setpoint for the preventive instant, and post-curative optimal setpoints for the curative instant. |
| ra-optimisation | Network action application error | "Cannot apply remedial action combination {name}: {reason}" <br> or <br> "Could not create child leaf with network action combination {name}, the combination will be skipped: {reason}" | In the search tree, it may happen that a network action combination cannot be applied (for example a SwitchPair) | The search tree ignores the NA combination and moves on to the next one |
| ra-optimisation | Range action abnormal iteration | "The new iteration found a worse result (abnormal). The leaf will be optimized again with the previous list of range actions." | When applying a limitation on the number of different remedial actions to use, the list of available remedial actions can change, thus multiple iterations of optimization are necessary. Although it should theoretically not happen, the possibility that the result worsens between two iterations is caught. | The RAO falls back to the list of available range actions from the previous iteration. |
| ra-optimisation | Leaf evaluation failure | "Failed to evaluate leaf: {error message}" <br> or <br> "Impossible to optimize leaf: {description} because evaluation failed" <br> or <br> "Impossible to optimize leaf: {leaf description} because evaluation has not been performed" | The RAO may fail to evaluate & optimize a leaf (a network actions combination). | The RAO will ignore the leaf and move to the next one. |
| ra-optimisation | Moduleconfig map error | "ModuleConfig cannot read maps. The parameter {parameter name} you set will not be read. Set it in a json file instead." | If the module config has a property defined which is supposed to be a map, then it cannot be read (technical limitation). | The parameter is not read and default value is used. |
| data/refprog | Refprog build error | "LoadFlow could not be computed. The ReferenceProgram will be built without a prior LoadFlow computation: {eventual error message}" | In case no reference program was input by the user, FARAO can build one using a loadflow computation. But loadflow computation can fail. | The Reference program is built without using a prior loadflow computation. |
| ra-optimisation | MIP sensitivity failure | "Systematic sensitivity computation failed at iteration {iterating linear optimization iteration number}" | The sensitivity computation in a iteration of the MIP failed. | The best known result by the iterator will be returned and used in the rest of the process. |
| ra-optimisation | No reference program | "No ReferenceProgram provided. A ReferenceProgram will be generated using information in the network file." | The user did not provide a reference program. | FARAO will compute a reference program using the network file. |
| ra-optimisation | Wrong value | "The value {value} provided for relative network action minimum impact threshold is smaller than 0. It will be set to 0." | Self-explanatory | Self-explanatory |
| ra-optimisation | Wrong value | "The value {value} provided for relative network action minimum impact threshold is greater than 1. It will be set to 1." | Self-explanatory | Self-explanatory |
| ra-optimisation | Wrong value | "The value {value} provided for max number of boundaries for skipping network actions is smaller than 0. It will be set to 0." | Self-explanatory | Self-explanatory |
| ra-optimisation | Wrong value | "The value {value} provided for curative RAO minimum objective improvement is smaller than 0. It will be set to + {default value}" | Self-explanatory | Self-explanatory |
| ra-optimisation | Wrong value | "The value {value} provided for max number of curative RAs is smaller than 0. It will be set to 0 instead." | Self-explanatory | Self-explanatory |
| ra-optimisation | Wrong value | "The value {value} provided for max number of curative TSOs is smaller than 0. It will be set to 0 instead." | Self-explanatory | Self-explanatory |
| ra-optimisation | Small network action combination | "A network-action-combination should at least contains 2 NetworkAction ids" | Happens if the user provided a network action combination with less than 2 network actions. | The combination is ignored. |
| ra-optimisation | Wrong network action combination | "Unknown network action id in network-action-combinations parameter: {}" | Happens if FARAO cannot recognize a network action in the given combination by the user. | The combination is ignored |
| sensitivity-analysis | Sensitivity failure and fallback | "Error while running the sensitivity analysis with default parameters, fallback sensitivity parameters are now used." | Self-explanatory | FARAO falls back on fallback parameters and eventually applies a virtual cost |
| data/crac-creator-api | CRAC creation warnings | * | Any warning happening during CRAC creation | The CRAC can be altered |
| data/crac | Adding a remedial action with no usage rule | "{Remedial action type} {remedial action} does not contain any usage rule, by default it will never be available" | Self-explanatory (happens in adders) | Self-explanatory |
| data/crac | Wrong preventive PST range | "RELATIVE_TO_PREVIOUS_INSTANT range has been filtered from PstRangeAction {PST id}, as it is a preventive RA" | Self-explanatory (happens in adder) | Self-explanatory |
| data/crac | No PST range in CRAC | "PstRangeAction {PST id} does not contain any valid range, by default the range of the network will be used" | Self-explanatory (happens in adder) | Self-explanatory |
| data/glsk | Wrong GLSK limits | "Generator '{generatorId}' has initial target P that is above GLSK max P. Extending GLSK max P from {incomingMaxP} to {generatorTargetP}." <br> or <br> "Generator '{generatorId}' has initial target P that is above GLSK min P. Extending GLSK min P from {incomingMinP} to {generatorTargetP}." | Self-explanatory | Self-explanatory |
| flowbased-computation | OnFlowConstraint RA in FB computation | "Network action {RA id} with usage method TO_BE_EVALUATED will not be applied, as we don't have access to the flow results." | I flowbased computation, we don't have access to flow results. So we cannot evaluate the applicability of remedial actions with usage method "to be evaluated" (on-flow-constraint usage rule) | These RAs are not applied |
| data/glsk | GLSK creation error | "Could not create linear data for zone {zone}: {error message}" | Cannot instantiate linear data ( for example if several glsk points match the given instant) | The zone is skipped |
| data/glsk | GLSK import error | "An exception occurred trying to read GLSK document. It could not be imported." | Self-explanatory | GLSK is not imported, it may make the RAO fail |
| data/glsk | Virtual hub load missing | "No load found for virtual hub {EICode}" | Self-explanatory | PTDF is considered 0 |
| data/refprog | Entry missing in refprog | "Flow value between {outArea} and {inArea} is not found for this date {date}" | The RefProg importer did not find the flow between two given areas at a given date | The import and RAO are not interrupted but the missing flow is replaced by 0 |
| loopflow-computation | GLSK missing for specific area | "No GLSK found for reference area {area code}" | Self-explanatory | PTDF is considered 0 |