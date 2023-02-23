These results contain information about the selection of standard range actions by the RAO.  
Standard range actions are range actions that have a continuous set-point that can be optimised in a given range.  
Actually, standard range actions handled by FARAO are: **HVDC range actions** and **Injection range actions**.  
*Note that you will need to use [RangeAction](/docs/input-data/crac/json#range-actions) objects from the CRAC for querying the Java API.*

{% capture t10_java %}
~~~java
// get a range action's set-point before the optimization of a given state
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
"rangeActionResults" : [ {
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
These results contain information about the application of PST range actions by the RAO.  
PSTs are not standard range actions, because they have integer tap positions; a few extra methods in the API allow
querying the tap positions. All "set-point" methods of standard range actions also can also be used.    
*Note that you will need to use [PstRangeAction or RangeAction](/docs/input-data/crac/json#pst-range-action) objects from the CRAC for querying the Java API.*

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
  "rangeActionResults" : [ {
    "rangeActionId" : "pstRange1Id",
    "initialSetpoint" : 0.0,
    "initialTap" : -3,
    "activatedStates" : [ {
      "instant" : "preventive",
      "tap" : 3,
      "setpoint" : 3.0
    } ]
  }, {
    "rangeActionId" : "pstRange2Id",
    "initialSetpoint" : 1.5,
    "initialTap" : 0,
    "activatedStates" : [ ]
  }, {
    "rangeActionId" : "pstRange3Id",
    "initialSetpoint" : 1.0,
    "initialTap" : -1,
    "activatedStates" : [ ]
  } ]
~~~
{% endcapture %}
{% include /tabs.html id="t11" tab1name="JAVA API" tab1content=t11_java tab2name="JSON file" tab2content=t11_json %}

