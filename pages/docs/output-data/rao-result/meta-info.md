### Computation status {#computation-status}
This field contains the status of sensitivity / load-flow computations during the RAO, for a given [state](/docs/input-data/crac/json#instants-states),
or for the overall RAO (the status of the overall RAO is computed as the worst status among all states).  
It can have one of the following values:
- **DEFAULT**: the sensitivity / load-flow computations converged normally
- **FAILURE**: the sensitivity / load-flow computations failed

The user should be sufficiently warned when any state's sensitivity / load-flow computation fails.

{% capture t1_java %}
~~~java
ComputationStatus getComputationStatus();

ComputationStatus getComputationStatus(State state);
~~~
{% endcapture %}
{% capture t1_json %}
Example:
~~~json
{
  "computationStatus" : "default",
  "computationStatusMap": [
    {
      "computationStatus": "default",
      "instant": "preventive"
    },
    {
      "computationStatus": "failure",
      "instant": "curative",
      "contingency": "contingency1Id"
    },
    {
      "computationStatus": "default",
      "instant": "auto",
      "contingency": "contingency2Id"
    }
  ],
  ...
~~~
{% endcapture %}
{% include /tabs.html id="t1" tab1name="JAVA API" tab1content=t1_java tab2name="JSON file" tab2content=t1_json %}

### Executed optimisation steps {#executed-optimisation-steps}
This field contains macro information about which steps the [CASTOR RAO](/docs/engine/ra-optimisation/search-tree-rao) executed.  
(See also: [Forbidding cost increase](/docs/parameters#forbid-cost-increase), [Second preventive RAO parameters](/docs/parameters#second-preventive-rao))

| Value                                                    | Did CASTOR run a 1st preventive RAO? | Did CASTOR run a 2nd preventive RAO? | Did the RAO fall back to initial situation? | Did the RAO fall back to 1st preventive RAO result even though a 2nd was run? |  
|----------------------------------------------------------|--------------------------------------|--------------------------------------|---------------------------------------------|-------------------------------------------------------------------------------|
| FIRST_PREVENTIVE_ONLY                                    | ✔️                                   |                                      |                                             |                                                                               |
| FIRST_PREVENTIVE_FELLBACK_TO_INITIAL_SITUATION           | ✔️                                   |                                      | ✔️                                          |                                                                               |
| SECOND_PREVENTIVE_IMPROVED_FIRST                         | ✔️                                   | ✔️                                   |                                             |                                                                               |
| SECOND_PREVENTIVE_FELLBACK_TO_INITIAL_SITUATION          | ✔️                                   | ✔️                                   | ✔️                                          |                                                                               |
| SECOND_PREVENTIVE_FELLBACK_TO_FIRST_PREVENTIVE_SITUATION | ✔️                                   | ✔️                                   |                                             | ✔️                                                                            |

{% capture t17_java %}
~~~java
OptimizationStepsExecuted getOptimizationStepsExecuted();
~~~
{% endcapture %}
{% capture t17_json %}
Example:
~~~json
{
  "optimizationStepsExecuted": "Second preventive improved first preventive results",
  ...
}
~~~
{% endcapture %}
{% include /tabs.html id="t17" tab1name="JAVA API" tab1content=t17_java tab2name="JSON file" tab2content=t17_json %}

### Objective function cost results {#cost-results}
Contains information about the reached objective function value, seperated into functional and virtual costs:
- the **functional** cost reflects the business value of the objective (e.g. the cost associated to the minimum margin and the business penalties on usage of remedial actions)
- the **virtual** cost reflects the violation of certain constraints (e.g. MNEC & loop-flow constraints)

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