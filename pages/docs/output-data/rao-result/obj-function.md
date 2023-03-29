Contains information about the reached objective function value, seperated into functional and virtual costs:
- the **functional** cost reflects the business value of the objective (e.g. the cost associated to the minimum margin and the business penalties on usage of remedial actions)
- the **virtual** cost reflects the violation of some constraints (e.g. MNEC & loop-flow constraints)

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