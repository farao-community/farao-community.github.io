## The angle monitoring result {#result}

### JSON import & export {#import-export}
The [AngleMonitoringResult](https://github.com/farao-community/farao-core/blob/master/monitoring/angle-monitoring/src/main/java/com/farao_community/farao/monitoring/angle_monitoring/AngleMonitoringResult.java) 
can be written to and read from a JSON file.  
Example: 
~~~java
// Export
AngleMonitoringResult angleMonitoringResult = ...
OutputStream os = ...
new AngleMonitoringResultExporter().export(angleMonitoringResult, os);

// Import
InputStream is = ...
Crac crac = ...
AngleMonitoringResult angleMonitoringResult2 =new AngleMonitoringResultImporter().importAngleMonitoringResult(is, crac);
~~~
### Contents {#result-contents}
The AngleMonitoringResult object contains the results of the angle monitoring algorithm.

#### Status {#result-status}
The AngleMonitoringResult has methods describing the security status of the network in regard to the angle constraints 
defined in the CRAC:
- **SECURE**: the network is secure; no angle thresholds are violated
- **UNSECURE**: the network is not secure; at least one angle CNEC has an angle constraint
- **DIVERGENT**: the load-flow computation diverged; angle monitoring could not be run normally
- **UNKNOWN**: the angle monitoring failed for any other reason

{% capture t1_java %}
~~~java
// get the overall status (one of 4 values above)
public Status getStatus()

// know which value it has
public boolean isSecure()
public boolean isUnsecure()
public boolean isDivergent()
public boolean isUnknown()
~~~
{% endcapture %}
{% capture t1_json %}
Example:
~~~json
{
  "type": "ANGLE_MONITORING_RESULT",
  "status": "SECURE",
  ...
}
~~~
{% endcapture %}
{% include /tabs.html id="t1" tab1name="JAVA API" tab1content=t1_java tab2name="JSON file" tab2content=t1_json %}

#### Applied CRAs {#result-applied-cras}
Since the angle monitoring [algorithm]{#algorithm} can apply CRAs, these methods detail which ones were selected.

{% capture t2_java %}
(see [states](/docs/input-data/crac/json#instants-states), [network actions](/docs/input-data/crac/json#network-actions), [re-dispatch network actions](#redispatch))
~~~java
// get activated network actions for each state
public Map<State, Set<NetworkAction>> getAppliedCras()

// get activated network actions for a given state
public Set<NetworkAction> getAppliedCras(State state)

// get activated network action IDs for a given state ID
public Set<String> getAppliedCras(String stateId)
~~~
{% endcapture %}
{% capture t2_json %}
Example:
~~~json
"applied-cras": [
    {
      "instant": "curative",
      "contingency": "co1",
      "remedial-actions": [
        "na2"
      ]
    },
    {
      "instant": "preventive",
      "remedial-actions": [
        "na1"
      ]
    }
  ]
~~~
{% endcapture %}
{% include /tabs.html id="t2" tab1name="JAVA API" tab1content=t2_java tab2name="JSON file" tab2content=t2_json %}

#### Angle values {#result-angle-values}
The following methods return the angle values for angle CNECs **after** applying angle CRAs.

{% capture t3_java %}
~~~java
// get the angle value for a given CNEC, and a given angle unit
public double getAngle(AngleCnec angleCnec, Unit unit)

// get all angle results (an AngleResult contains an AngleCnec and its angle value)
public Set<AngleResult> getAngleCnecsWithAngle()
~~~
{% endcapture %}
{% capture t3_json %}
Example:
~~~json
  "angle-cnec-quantities-in-degrees": [
    {
      "instant": "preventive",
      "cnec-id": "ac1",
      "quantity": 2.3
    },
    {
      "instant": "curative",
      "contingency": "co1",
      "cnec-id": "ac2",
      "quantity": 4.6
    }
  ]
~~~
{% endcapture %}
{% include /tabs.html id="t3" tab1name="JAVA API" tab1content=t3_java tab2name="JSON file" tab2content=t3_json %}

### Printing the result {#result-print}
You can get a human-readable report of the angle monitoring algorithm, using the following method of the 
AngleMonitoringResult object:
~~~java
public List<String> printConstraints()
~~~

### Full JSON example {#result-json-example}
~~~json
{
  "type": "ANGLE_MONITORING_RESULT",
  "status": "SECURE",
  "angle-cnec-quantities-in-degrees": [
    {
      "instant": "preventive",
      "cnec-id": "ac1",
      "quantity": 2.3
    },
    {
      "instant": "curative",
      "contingency": "co1",
      "cnec-id": "ac2",
      "quantity": 4.6
    }
  ],
  "applied-cras": [
    {
      "instant": "curative",
      "contingency": "co1",
      "remedial-actions": [
        "na2"
      ]
    },
    {
      "instant": "preventive",
      "remedial-actions": [
        "na1"
      ]
    }
  ]
}
~~~