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
---

## Overview {#overview}

**TODO : mettre à jour reason per perimeter etc**

A **R**emedial **A**ction **O**ptimisation process provides an optimal list of remedial actions to be applied in basecase and after contingencies listed in the [CRAC](/docs/iput-data/crac). The decisions are based upon the impact of these remedial actions on the CRAC's [CNECs](/docs/iput-data/crac#cnec).

A **RaoResult object model** has been designed in FARAO in order to hold all the important results of optimisation.
In this page, we present:
- where to find the RaoResult instance,
- how to save a RaoResult java object to a JSON file,
- how to import a RaoResult java object from a JSON file,
- how to access information in the RaoResult, using either the RaoResult java object or the JSON file

**Jump to:**
* [Accessing the RAO result](#rao-result)
* [Exporting and importing a JSON file](#export-import)
  - [Export](#export)
  - [Import](#import)
* [Contents of the RAO result](#contents)
  - [Computation status](#computation-status)
  - [Objective function cost results](#cost-results)
  - [Flow CNECs results](#flow-cnecs-results)
    - [Flow](#flowcnec-flow)
    - [Margin](#flowcnec-margin)
    - [Relative margin](#flowcnec-rel-margin)
    - [Loop-Flow](#flowcnec-loopflow)
    - [Commercial flow](#flowcnec-commercial-flow)
    - [Zonal PTDF absolute sum](#flowcnec-ptdf-sum)
    - [Full JSON example](#flowcnec-json-example)
  - [Network actions results](#network-actions-results)
  - [Standard range actions results](#standard-range-action-results)
  - [PST range actions results](#pst-results)
    


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
new RaoResultExporter().export(raoResult, crac, outputStream);
~~~
Where:
- raoResult is the RaoResult object you obtained from the RaoProvider
- crac is the CRAC object you used in the RAO
- outputStream is the java.io.OutputStream you want to write the JSON file into

### Import {#import}
Example:
~~~java
RaoResult importedRaoResult = new RaoResultImporter().importRaoResult(inputStream, crac);
~~~
Where:
- crac is the CRAC object you used in the RAO
- inputStream is the java.io.InputStream you read the JSON file into

## Contents of the RAO result {#contents}
The RAO result object generally holds information about post-optimisation results. 
However, in some cases, it may be interesting to get some information about the initial state (eq power flows before optimisation), or about the situation after preventive optimisation (eq optimal PST tap positions in preventive). This is why **most of the information in the RAO results can have up to 4 values**, for these values of [OptimizationState](https://github.com/farao-community/farao-core/blob/master/data/rao-result/rao-result-api/src/main/java/com/farao_community/farao/data/rao_result_api/OptimizationState.java):
- **INITIAL**: values before remedial action optimisation (initial state)
- **AFTER_PRA**: values after applying optimal **P**reventive **R**emedial **A**ctions
- **AFTER_ARA**: values after applying **A**utomatic **R**emedial **A**ctions
- **AFTER_CRA**: values after applying optimal **C**urative **R**emedial **A**ctions

### Computation status {#computation-status}
This field contains the status of the RAO computation. It can have one of the following values:
- **DEFAULT**: the RAO was computed normally
- **FALLBACK**: fallback parameters have been used for sensitivity computation at least once, because default parameters resulted in error
- **FAILURE**: the RAO computation failed

{% capture t1_java %}
~~~java
ComputationStatus getComputationStatus();
~~~
{% endcapture %}
{% capture t1_json %}
~~~json
{
  "computationStatus" : "default",
  ...
~~~
{% endcapture %}
{% include /tabs.html id="t1" tab1name="JAVA API" tab1content=t1_java tab2name="JSON file" tab2content=t1_json %}

### Objective function cost results {#cost-results}
Contains information about the atteined objective function value, divided into functional and virtual costs:
- the **functional** cost reflects the business value of the objective (eg the cost associated to the minimum margin and the business penalties on usage of remedial actions)
- the **virtual** cost reflects the violation of certain constraints (eg MNEC & LoopFlow constraints)

{% capture t2_java %}
~~~java
// get the functional cost at a given state
double getFunctionalCost(OptimizationState optimizationState);

// get the total virtual cost at a given state
double getVirtualCost(OptimizationState optimizationState);

// get a specific virtual cost at a given state
double getVirtualCost(OptimizationState optimizationState, String virtualCostName);

// get all the virtual cost names in the RAO
Set<String> getVirtualCostNames();

// get the overall cost (functional + total virtual) at a given state
double getCost(OptimizationState optimizationState);
~~~
{% endcapture %}
{% capture t2_json %}
Example: 
~~~json
"costResults" : {
    "initial" : {
      "functionalCost" : 100.0,
      "virtualCost" : {
        "loopFlow" : 0.0,
        "MNEC" : 0.0
      }
    },
    "afterPRA" : {
      "functionalCost" : 80.0,
      "virtualCost" : {
        "loopFlow" : 0.0,
        "MNEC" : 0.0
      }
    },
    "afterARA" : {
      "functionalCost" : -20.0,
      "virtualCost" : {
        "loopFlow" : 15.0,
        "MNEC" : 20.0
      }
    },
    "afterCRA" : {
      "functionalCost" : -50.0,
      "virtualCost" : {
        "loopFlow" : 10.0,
        "MNEC" : 2.0
      }
    }
  },
~~~
{% endcapture %}
{% include /tabs.html id="t2" tab1name="JAVA API" tab1content=t2_java tab2name="JSON file" tab2content=t2_json %}

### Flow CNECs results {#flow-cnecs-results}

These results contain important RAO information about flow CNECs.  
Note that you have to use *FlowCnec* objects from the CRAC in order to query the RaoResult Java API.
Most results are power flow results (like flows & margins), and can be queried in two [units](https://github.com/farao-community/farao-core/blob/master/commons/src/main/java/com/farao_community/farao/commons/Unit.java):
- **AMPERE**
- **MEGAWATT**

#### Flow {#flowcnec-flow}
The actual power flow on the branch.

{% capture t3_java %}
~~~java
// get the flow on a given flow cnec, in a given unit, at a given state
double getFlow(OptimizationState optimizationState, FlowCnec flowCnec, Unit unit);
~~~
{% endcapture %}
{% capture t3_json %}
Example: 
~~~json
"flowCnecResults" : [ {
    "flowCnecId" : "cnec1outageId",
    "initial" : {
      "megawatt" : {
        "flow" : 1110.0,
        ...
      },
      "ampere" : {
        "flow" : 1120.0,
        ...
      },
      ...
    },
    "afterPRA" : {
      "megawatt" : {
        "flow" : 1210.0,
        ...
      },
      "ampere" : {
        "flow" : 1220.0,
        ...
      },
      ...
    }
  }, {
    "flowCnecId" : "cnec1prevId",
    "initial" : {
        ...
~~~
{% endcapture %}
{% include /tabs.html id="t3" tab1name="JAVA API" tab1content=t3_java tab2name="JSON file" tab2content=t3_json %}

#### Margin {#flowcnec-margin}
The flow margin to the closest threshold of the CNEC.

{% capture t4_java %}
~~~java
// get the margin of a given flow cnec, in a given unit, at a given state
double getMargin(OptimizationState optimizationState, FlowCnec flowCnec, Unit unit);
~~~
{% endcapture %}
{% capture t4_json %}
Example: 
~~~json
"flowCnecResults" : [ {
    "flowCnecId" : "cnec1outageId",
    "initial" : {
      "megawatt" : {
        ...
        "margin" : 1111.0,
        ...
      },
      "ampere" : {
        ...
        "margin" : 1121.0,
        ...
      },
      ...
    },
    "afterPRA" : {
      "megawatt" : {
        ...
        "margin" : 1211.0,
        ...
      },
      "ampere" : {
        ...
        "margin" : 1221.0,
        ...
      },
      ...
    }
  }, {
    "flowCnecId" : "cnec1prevId",
    "initial" : {
        ...
~~~
{% endcapture %}
{% include /tabs.html id="t4" tab1name="JAVA API" tab1content=t4_java tab2name="JSON file" tab2content=t4_json %}

#### Relative margin {#flowcnec-rel-margin}
The flow margin to the closest threshold of the CNEC. It is equal to the margin, divided by the zonal PTDF absolute sum.
It is used to artificially increase the margin on flow cnecs that are less impacted by changes in power exchanges between commercial zones.

{% capture t5_java %}
~~~java
// get the relative margin of a given flow cnec, in a given unit, at a given state
double getRelativeMargin(OptimizationState optimizationState, FlowCnec flowCnec, Unit unit);
~~~
{% endcapture %}
{% capture t5_json %}
Example: 
~~~json
"flowCnecResults" : [ {
    "flowCnecId" : "cnec1outageId",
    "initial" : {
      "megawatt" : {
        ...
        "relativeMargin" : 1112.0,
        ...
      },
      "ampere" : {
        ...
        "relativeMargin" : 1122.0,
        ...
      },
      ...
    },
    "afterPRA" : {
      "megawatt" : {
        ...
        "relativeMargin" : 1212.0,
        ...
      },
      "ampere" : {
        ...
        "relativeMargin" : 1222.0,
        ...
      },
      ...
    }
  }, {
    "flowCnecId" : "cnec1prevId",
    "initial" : {
        ...
~~~
{% endcapture %}
{% include /tabs.html id="t5" tab1name="JAVA API" tab1content=t5_java tab2name="JSON file" tab2content=t5_json %}

#### Loop-Flow {#flowcnec-loopflow}
The loop-flow value on a CNEC.  
*Can only be queried for flow CNECs limited by loop-flow thresholds (info in the CRAC).*

{% capture t6_java %}
~~~java
// get the loop-flow on a given flow cnec, in a given unit, at a given state
double getLoopFlow(OptimizationState optimizationState, FlowCnec flowCnec, Unit unit);
~~~
{% endcapture %}
{% capture t6_json %}
Example: 
~~~json
"flowCnecResults" : [ {
    "flowCnecId" : "cnec1outageId",
    "initial" : {
      "megawatt" : {
        ...
        "loopFlow" : 1113.0,
        ...
      },
      "ampere" : {
        ...
        "loopFlow" : 1123.0,
        ...
      },
      ...
    },
    "afterPRA" : {
      "megawatt" : {
        ...
        "loopFlow" : 1213.0,
        ...
      },
      "ampere" : {
        ...
        "loopFlow" : 1223.0,
        ...
      },
      ...
    }
  }, {
    "flowCnecId" : "cnec1prevId",
    "initial" : {
        ...
~~~
{% endcapture %}
{% include /tabs.html id="t6" tab1name="JAVA API" tab1content=t6_java tab2name="JSON file" tab2content=t6_json %}

#### Commercial flow {#flowcnec-commercial-flow}
The commercial flow on a CNEC.  
*Can only be queried for flow CNECs limited by loop-flow thresholds (info in the CRAC).*

{% capture t7_java %}
~~~java
// get the commercial flow on a given flow cnec, in a given unit, at a given state
double getLoopFlow(OptimizationState optimizationState, FlowCnec flowCnec, Unit unit);
~~~
{% endcapture %}
{% capture t7_json %}
Example: 
~~~json
"flowCnecResults" : [ {
    "flowCnecId" : "cnec1outageId",
    "initial" : {
      "megawatt" : {
        ...
        "commercialFlow" : 1114.0
      },
      "ampere" : {
        ...
        "commercialFlow" : 1124.0
      },
      ...
    },
    "afterPRA" : {
      "megawatt" : {
        ...
        "commercialFlow" : 1214.0
      },
      "ampere" : {
        ...
        "commercialFlow" : 1224.0
      },
      ...
    }
  }, {
    "flowCnecId" : "cnec1prevId",
    "initial" : {
        ...
~~~
{% endcapture %}
{% include /tabs.html id="t7" tab1name="JAVA API" tab1content=t7_java tab2name="JSON file" tab2content=t7_json %}

#### Zonal PTDF absolute sum {#flowcnec-ptdf-sum}
The absolute sum of zonal PTDFs (influence factors) on a given CNEC. Reflects the influence of power exchanges between commercial zones on the CNEC.  
*Note that this value does not have a unit*

{% capture t8_java %}
~~~java
// get the absolute sum of zonal PTDFs for a given flow cnec, at a given state
double getPtdfZonalSum(OptimizationState optimizationState, FlowCnec flowCnec);
~~~
{% endcapture %}
{% capture t8_json %}
Example: 
~~~json
"flowCnecResults" : [ {
    "flowCnecId" : "cnec1outageId",
    "initial" : {
      ...
      "zonalPtdfSum" : 0.1
    },
    "afterPRA" : {
      ...
      "zonalPtdfSum" : 0.1
    }
  }, {
    "flowCnecId" : "cnec1prevId",
    "initial" : {
        ...
~~~
{% endcapture %}
{% include /tabs.html id="t8" tab1name="JAVA API" tab1content=t8_java tab2name="JSON file" tab2content=t8_json %}


#### Full JSON example {#flowcnec-json-example}
{% capture t12_json %}
~~~json
"flowCnecResults" : [ {
    "flowCnecId" : "cnec1outageId",
    "initial" : {
      "megawatt" : {
        "flow" : 1110.0,
        "margin" : 1111.0,
        "relativeMargin" : 1112.0,
        "loopFlow" : 1113.0,
        "commercialFlow" : 1114.0
      },
      "ampere" : {
        "flow" : 1120.0,
        "margin" : 1121.0,
        "relativeMargin" : 1122.0,
        "loopFlow" : 1123.0,
        "commercialFlow" : 1124.0
      },
      "zonalPtdfSum" : 0.1
    },
    "afterPRA" : {
      "megawatt" : {
        "flow" : 1210.0,
        "margin" : 1211.0,
        "relativeMargin" : 1212.0,
        "loopFlow" : 1213.0,
        "commercialFlow" : 1214.0
      },
      "ampere" : {
        "flow" : 1220.0,
        "margin" : 1221.0,
        "relativeMargin" : 1222.0,
        "loopFlow" : 1223.0,
        "commercialFlow" : 1224.0
      },
      "zonalPtdfSum" : 0.1
    }
  }, {
    "flowCnecId" : "cnec3curId",
    "initial" : {
      "megawatt" : {
        "flow" : 3110.0,
        "margin" : 3111.0
      },
      "ampere" : {
        "flow" : 3120.0,
        "margin" : 3121.0
      }
    },
    "afterPRA" : {
      "megawatt" : {
        "flow" : 3210.0,
        "margin" : 3211.0
      },
      "ampere" : {
        "flow" : 3220.0,
        "margin" : 3221.0
      }
    },
    "afterARA" : {
      "megawatt" : {
        "flow" : 3310.0,
        "margin" : 3311.0
      },
      "ampere" : {
        "flow" : 3320.0,
        "margin" : 3321.0
      }
    },
    "afterCRA" : {
      "megawatt" : {
        "flow" : 3410.0,
        "margin" : 3411.0
      },
      "ampere" : {
        "flow" : 3420.0,
        "margin" : 3421.0
      }
    }
  }, ...
~~~
{% endcapture %}
{% include /tabs.html id="t12" tab1name="JSON file" tab1content=t12_json %}

### Network actions results {#network-actions-results}
These results hold information about the application of network actions by the RAO.
*Note that you will need to use NetworkAction objects from the CRAC for querying the Java API.*


{% capture t9_java %}
~~~java
// query if a network action was already activated before a given state was studied
boolean wasActivatedBeforeState(State state, NetworkAction networkAction);

// query if a network action was chosen during the optimization of a given state
boolean isActivatedDuringState(State state, NetworkAction networkAction);

// get the list of all network actions chosen during the optimization of a given state
Set<NetworkAction> getActivatedNetworkActionsDuringState(State state);

// query if a network action was during or before a given state
boolean isActivated(State state, NetworkAction networkAction);
~~~
{% endcapture %}
{% capture t9_json %}
Example: 
~~~json
"networkActionResults" : [ {
    "networkActionId" : "complexNetworkActionId",
    "activatedStates" : [ {
      "instant" : "preventive"
    } ]
  }, {
    "networkActionId" : "injectionSetpointRaId",
    "activatedStates" : [ {
      "instant" : "auto",
      "contingency" : "contingency2Id"
    } ]
  }
  ...
~~~
{% endcapture %}
{% include /tabs.html id="t9" tab1name="JAVA API" tab1content=t9_java tab2name="JSON file" tab2content=t9_json %}

### Standard range actions results {#standard-range-action-results}
These results hold information about the application of standard range actions by the RAO.  
Standard range actions are range actions that have a continuous setpoint that can be optimised in a given range.  
Actually, standard range actions handled by FARAO are: **HVDC range actions** and **Injection range actions**.  
*Note that you will need to use RangeAction objects from the CRAC for querying the Java API.*


{% capture t10_java %}
~~~java
/* --- Standard RangeAction methods only: --- */

// get a range action's setpoint before the optimization of a given state
double getPreOptimizationSetPointOnState(State state, RangeAction<?> rangeAction);

// query if a range action was activated (ie setpoint changed) during the optimization of a given state
boolean isActivatedDuringState(State state, RangeAction<?> rangeAction);

// get all range actions that were activated by the RAO in a given state
Set<RangeAction<?>> getActivatedRangeActionsDuringState(State state);

// get a range action's optimal setpoint, that was chosen by the RAO in a given state
double getOptimizedSetPointOnState(State state, RangeAction<?> rangeAction);

// get all range actions' optimal setpoints, that were chosen by the RAO in a given state
Map<RangeAction<?>, Double> getOptimizedSetPointsOnState(State state);
~~~
{% endcapture %}
{% capture t10_json %}
Example: 
~~~json
"standardRangeActionResults" : [ {
    "rangeActionId" : "hvdcRange1Id",
    "initialSetpoint" : 0.0,
    "activatedStates" : [ {
      "instant" : "preventive",
      "setpoint" : -1000.0
    } ]
  }, {
    "rangeActionId" : "hvdcRange2Id",
    "initialSetpoint" : -100.0,
    "activatedStates" : [ {
      "instant" : "curative",
      "contingency" : "contingency1Id",
      "setpoint" : 100.0
    }, {
      "instant" : "curative",
      "contingency" : "contingency2Id",
      "setpoint" : 400.0
    } ]
  }, {
    "rangeActionId" : "injectionRange1Id",
    "initialSetpoint" : 100.0,
    "activatedStates" : [ {
      "instant" : "curative",
      "contingency" : "contingency1Id",
      "setpoint" : -300.0
    } ]
  } ]
~~~
{% endcapture %}
{% include /tabs.html id="t10" tab1name="JAVA API" tab1content=t10_java tab2name="JSON file" tab2content=t10_json %}

### PST range actions results {#pst-results}
These results hold information about the application of PST range actions by the RAO.  
PSTs are not standard range actions, because they have integer tap positions; a few extra methods in the API allow querying the tap positions.  
*Note that you will need to use PstRangeAction or RangeAction objects from the CRAC for querying the Java API.*


{% capture t11_java %}
~~~java
/* --- Standard RangeAction methods: --- */

// get a range action's setpoint before the optimization of a given state
double getPreOptimizationSetPointOnState(State state, RangeAction<?> rangeAction);

// query if a range action was activated (ie setpoint changed) during the optimization of a given state
boolean isActivatedDuringState(State state, RangeAction<?> rangeAction);

// get all range actions that were activated by the RAO in a given state
Set<RangeAction<?>> getActivatedRangeActionsDuringState(State state);

// get a range action's optimal setpoint, that was chosen by the RAO in a given state
double getOptimizedSetPointOnState(State state, RangeAction<?> rangeAction);

// get all range actions' optimal setpoints, that were chosen by the RAO in a given state
Map<RangeAction<?>, Double> getOptimizedSetPointsOnState(State state);

/* --- PST-specific methods: --- */

// get a PST range action's tap position before the optimization of a given state
int getPreOptimizationTapOnState(State state, PstRangeAction pstRangeAction);

// get a PST range action's optimal tap position, that was chosen by the RAO in a given state
int getOptimizedTapOnState(State state, PstRangeAction pstRangeAction);

// get all PST range actions' optimal tap positions, that were chosen by the RAO in a given state
Map<PstRangeAction, Integer> getOptimizedTapsOnState(State state);
~~~
{% endcapture %}
{% capture t11_json %}
Example: 
~~~json
  "pstRangeActionResults" : [ {
    "pstRangeActionId" : "pstRange1Id",
    "initialTap" : 0,
    "initialSetpoint" : 0.0,
    "activatedStates" : [ {
      "instant" : "preventive",
      "tap" : -7,
      "setpoint" : -3.2
    } ]
  }, {
    "pstRangeActionId" : "pstRange2Id",
    "initialTap" : 3,
    "initialSetpoint" : 1.7,
    "activatedStates" : [ ]
  } ],
~~~
{% endcapture %}
{% include /tabs.html id="t11" tab1name="JAVA API" tab1content=t11_java tab2name="JSON file" tab2content=t11_json %}

