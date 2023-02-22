### Network actions results {#network-actions-results}
These results contain information about the selection of network actions by the RAO.
*Note that you will need to use [NetworkAction](/docs/input-data/crac/json#network-actions) objects from the CRAC for querying the Java API.*

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
*Network actions that are not selected by the RAO do not appear in the JSON file*
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