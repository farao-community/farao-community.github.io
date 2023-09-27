These results contain important RAO information about voltage CNECs.  
Note that you have to use [VoltageCnec](/docs/input-data/crac/json#voltage-cnecs) objects from the CRAC in order to query the RaoResult Java API.

#### Voltage {#voltagecnec-voltage}
Access the voltage value of an VoltageCnec.

{% capture t15_java %}
*Note that this feature is not implemented in the default RAO result implementation, as voltage CNECs are not optimised
by the RAO, but monitored by a [voltage monitoring module](/docs/engine/voltage-monitoring).*
~~~java
// get the voltage value for a given voltage cnec, after optimisation of a given instant, in a given voltage unit
double getVoltage(Instant optimizedInstant, VoltageCnec voltageCnec, Unit unit);
~~~
{% endcapture %}
{% capture t15_json %}
Example:
~~~json
  "voltageCnecResults" : [ {
    "voltageCnecId" : "voltageCnecId",
    "initial" : {
      "kilovolt" : {
        "voltage" : 4146.0,
        ...
      }
    },
    "preventive" : {
      "kilovolt" : {
        "voltage" : 4246.0,
        ...
      }
    }, ...
~~~
{% endcapture %}
{% include /tabs.html id="t15" tab1name="JAVA API" tab1content=t15_java tab2name="JSON file" tab2content=t15_json %}

#### Margin {#voltagecnec-margin}
Access the voltage margin value of a VoltageCnec.

{% capture t16_java %}
*Note that this feature is not implemented in the default RAO result implementation, as voltage CNECs are not optimised
by the RAO, but monitored by a [voltage monitoring module](/docs/engine/voltage-monitoring).*
~~~java
// get the margin value for a given voltage cnec, after optimisation of a given instant, in a given voltage unit
double getMargin(Instant optimizedInstant, VoltageCnec voltageCnec, Unit unit);
~~~
{% endcapture %}
{% capture t16_json %}
Example:
~~~json
  "voltageCnecResults" : [ {
    "voltageCnecId" : "voltageCnecId",
    "initial" : {
      "kilovolt" : {
        ...
        "margin" : 4141.0
      }
    },
    "preventive" : {
      "kilovolt" : {
        ...
        "margin" : 4241.0
      }
    }, ...
~~~
{% endcapture %}
{% include /tabs.html id="t16" tab1name="JAVA API" tab1content=t16_java tab2name="JSON file" tab2content=t16_json %}

#### Complete JSON example {#voltagecnec-json-example}
~~~json
  "voltageCnecResults" : [ {
    "voltageCnecId" : "voltageCnecId",
    "initial" : {
      "kilovolt" : {
        "voltage" : 4146.0,
        "margin" : 4141.0
      }
    },
    "preventive" : {
      "kilovolt" : {
        "voltage" : 4246.0,
        "margin" : 4241.0
      }
    }, ...
~~~