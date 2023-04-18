---
layout: documentation
title: JSON RAO Result File
permalink: /docs/output-data/rao-result-json
hide: true
root-page: Documentation
docu-section: Output Data
docu-parent: Output Data
order: 2
feature-img: "assets/img/farao3.jpg"
tags: [Docs, Data]
summary-hmax: 3
see-also: |
    [Internal json CRAC format](/docs/input-data/crac/json), [CASTOR](/docs/engine/ra-optimisation/search-tree-rao)
---

## Introduction {#introduction}

A **R**emedial **A**ction **O**ptimisation process provides an optimal list of remedial actions to be applied in basecase and after contingencies listed in the [CRAC](/docs/iput-data/crac). The decisions are based upon the impact of these remedial actions on the CRAC's [CNECs](/docs/iput-data/crac#cnec).

A **RaoResult object model** has been designed in FARAO in order to hold all the important results of optimisation.
In this page, we present:
- where to find the RaoResult instance,
- how to save a RaoResult java object to a JSON file,
- how to import a RaoResult java object from a JSON file,
- how to access information in the RaoResult, using either the RaoResult java object or the JSON file.

## Accessing the RAO result {#rao-result}
The [RaoResult](https://github.com/farao-community/farao-core/blob/master/data/rao-result/rao-result-api/src/main/java/com/farao_community/farao/data/rao_result_api/RaoResult.java) java object is actually an interface that is implemented by many FARAO classes. However, one only needs to use the interface's functions.
A RaoResult object is returned by FARAO's main optimisation method:
~~~java
CompletableFuture<RaoResult> RaoProvider::run(RaoInput raoInput, RaoParameters parameters, Instant targetEndInstant)
~~~
Where RaoProvider is the chosen implementation of the RAO, such as [CASTOR](https://github.com/farao-community/farao-core/blob/master/ra-optimisation/search-tree-rao/src/main/java/com/farao_community/farao/search_tree_rao/castor/algorithm/Castor.java).

## Exporting and importing a JSON file {#export-import}

A RaoResult object can be saved into a JSON file (no matter what implementation it is).
A RaoResult JSON file can be imported into a [RaoResultImpl](https://github.com/farao-community/farao-core/blob/master/data/rao-result/rao-result-impl/src/main/java/com/farao_community/farao/data/rao_result_impl/RaoResultImpl.java), and used as a RaoResult java object.

### Export {#export}
Example:
~~~java
new RaoResultExporter().export(RaoResult raoResult, Crac crac, Set<Unit> flowUnits, OutputStream outputStream);
~~~
Where:
- **`raoResult`** is the RaoResult object you obtained from the RaoProvider;
- **`crac`** is the CRAC object you used in the RAO;
- **`flowUnits`** is the set of units in which the flow measurements should be exported (either `AMPERE` or `MEGAWATT`, or both);
- **`outputStream`** is the `java.io.OutputStream` you want to write the JSON file into.

### Import {#import}
Example:
~~~java
RaoResult importedRaoResult = new RaoResultImporter().importRaoResult(InputStream inputStream, Crac crac);
~~~
Where:
- **`crac`** is the CRAC object you used in the RAO
- **`inputStream`** is the `java.io.InputStream` you read the JSON file into

## Contents of the RAO result {#contents}
The RAO result object generally contains information about post-optimisation results.  
However, in some cases, it may be interesting to get some information about the initial state (e.g. power flows before 
optimisation), or about the situation after preventive optimisation (e.g. optimal PST tap positions in preventive). 
This is why **most of the information in the RAO results can have up to 4 values**, for these values of [OptimizationState](https://github.com/farao-community/farao-core/blob/master/data/rao-result/rao-result-api/src/main/java/com/farao_community/farao/data/rao_result_api/OptimizationState.java):
- **INITIAL**: values before remedial action optimisation (initial state)
- **AFTER_PRA**: values after applying optimal **P**reventive **R**emedial **A**ctions
- **AFTER_ARA**: values after applying **A**utomatic **R**emedial **A**ctions
- **AFTER_CRA**: values after applying optimal **C**urative **R**emedial **A**ctions
_See also: [RAO steps](/docs/engine/ra-optimisation/rao-steps)_

### Computation status {#computation-status}
{% include_relative computation-status.md %}  

### Executed optimisation steps {#executed-optimisation-steps}
{% include_relative steps.md %}

### Objective function cost results {#cost-results}
{% include_relative obj-function.md %}

### Flow CNECs results {#flow-cnecs-results}
{% include_relative flow-cnecs.md %}  

### Angle CNECs results {#angle-cnecs-results}
{% include_relative angle-cnecs.md %}  

### Voltage CNECs results {#voltage-cnecs-results}
{% include_relative voltage-cnecs.md %}  

### Network actions results {#network-actions-results}
{% include_relative network-actions.md %}  

### Standard range actions results {#standard-range-action-results}
{% include_relative range-actions.md %}  
