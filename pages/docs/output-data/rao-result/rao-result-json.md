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

A **R**emedial **A**ction **O**ptimisation process provides an optimal list of remedial actions to be applied in basecase and after contingencies listed in the [CRAC](/docs/input-data/crac/crac). The decisions are based upon the impact of these remedial actions on the CRAC's [CNECs](/docs/input-data/crac/crac#cnec).

A **RaoResult object model** has been designed in FARAO in order to hold all the important results of optimisation.
In this page, we present:
- where to find the RaoResult instance,
- how to save a RaoResult java object to a JSON file,
- how to import a RaoResult java object from a JSON file,
- how to access information in the RaoResult, using either the RaoResult java object or the JSON file.

## Accessing the RAO result {#rao-result}
The [RaoResult](https://github.com/powsybl/powsybl-open-rao/blob/main/data/rao-result/rao-result-api/src/main/java/com/powsybl/openrao/data/raoresultapi/RaoResult.java) java object is actually an interface that is implemented by many FARAO classes. However, one only needs to use the interface's functions.
A RaoResult object is returned by FARAO's main optimisation method:
~~~java
CompletableFuture<RaoResult> RaoProvider::run(RaoInput raoInput, RaoParameters parameters, Instant targetEndInstant)
~~~
Where RaoProvider is the chosen implementation of the RAO, such as [CASTOR](https://github.com/powsybl/powsybl-open-rao/blob/main/ra-optimisation/search-tree-rao/src/main/java/com/powsybl/openrao/searchtreerao/castor/algorithm/Castor.java).

## Exporting and importing a JSON file {#export-import}

A RaoResult object can be saved into a JSON file (no matter what implementation it is).
A RaoResult JSON file can be imported into a [RaoResultImpl](https://github.com/powsybl/powsybl-open-rao/blob/main/data/rao-result/rao-result-impl/src/main/java/com/powsybl/openrao/data/raoresultimpl/RaoResultImpl.java), and used as a RaoResult java object.

### Export {#export}
Example:
~~~java
new RaoResultExporter().export(raoResult, crac, flowUnits, outputStream);
~~~
Where:
- **`raoResult`** is the RaoResult object you obtained from the RaoProvider;
- **`crac`** is the CRAC object you used in the RAO;
- **`flowUnits`** is the set of units in which the flow measurements should be exported (either `AMPERE` or `MEGAWATT`, or both);
- **`outputStream`** is the `java.io.OutputStream` you want to write the JSON file into.

### Import {#import}
Example:
~~~java
RaoResult importedRaoResult = new RaoResultImporter().importRaoResult(inputStream, crac);
~~~
Where:
- **`crac`** is the CRAC object you used in the RAO
- **`inputStream`** is the `java.io.InputStream` you read the JSON file into

## Contents of the RAO result {#contents}
The RAO result object generally contains information about post-optimisation results.  
However, in some cases, it may be interesting to get some information about the initial state (e.g. power flows before 
optimisation), or about the situation after preventive optimisation (e.g. optimal PST tap positions in preventive). 
This is why **most of the information in the RAO results are stored by optimized instant**:  
- **INITIAL** (json) or **null** (Java API): values before remedial action optimisation (initial state)
- Instant of kind **PREVENTIVE** or **OUTAGE**: values after optimizing preventive instant, i.e. after applying optimal preventive remedial actions
- Instant of kind **AUTO**: values after simulating auto instant, i.e. after applying automatic remedial actions
- Instant of kind **CURATIVE**: values after optimizing curative instant, i.e. after applying optimal curative remedial actions
  
_See also: [RAO steps](/docs/engine/ra-optimisation/rao-steps)_

### Computation status {#computation-status}
{% include_relative computation-status.md %}  

### Security status {#security-status}
{% include_relative security-status.md %}  

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
