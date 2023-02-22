### Angle CNECs results {#angle-cnecs-results}
These results contain important RAO information about angle CNECs.  
Note that you have to use [AngleCnec](/docs/input-data/crac/json#angle-cnecs) objects from the CRAC in order to query the RaoResult Java API.

#### Angle {#anglecnec-angle}
Access the angle value of an AngleCnec.

{% capture t13_java %}
*Note that this feature is not implemented in the default RAO result implementation, as angle CNECs are not optimised
by the RAO, but monitored by an [angle monitoring module](/docs/engine/angle-monitoring).*
~~~java
// get the angle value for a given angle cnec, at a given state, in a given angle unit
double getAngle(OptimizationState optimizationState, AngleCnec angleCnec, Unit unit);
~~~
{% endcapture %}
{% capture t13_json %}
Example:
~~~json
  "angleCnecResults" : [ {
    "angleCnecId" : "angleCnecId",
    "initial" : {
      "degree" : {
        "angle" : 3135.0,
        ...
      }
    },
    "afterPRA" : {
      "degree" : {
        "angle" : 3235.0,
        ...
      }
    },
    ...
~~~
{% endcapture %}
{% include /tabs.html id="t13" tab1name="JAVA API" tab1content=t13_java tab2name="JSON file" tab2content=t13_json %}

#### Margin {#anglecnec-margin}
Access the angle margin value of an AngleCnec.

{% capture t14_java %}
*Note that this feature is not implemented in the default RAO result implementation, as angle CNECs are not optimised
by the RAO, but monitored by an [angle monitoring module](/docs/engine/angle-monitoring).*
~~~java
// get the margin value for a given angle cnec, at a given state, in a given angle unit
double getMargin(OptimizationState optimizationState, AngleCnec angleCnec, Unit unit);
~~~
{% endcapture %}
{% capture t14_json %}
Example:
~~~json
  "angleCnecResults" : [ {
    "angleCnecId" : "angleCnecId",
    "initial" : {
      "degree" : {
        "margin" : 3135.0,
        ...
      }
    },
    "afterPRA" : {
      "degree" : {
        "margin" : 3235.0,
        ...
      }
    },
    ...
~~~
{% endcapture %}
{% include /tabs.html id="t14" tab1name="JAVA API" tab1content=t14_java tab2name="JSON file" tab2content=t14_json %}

#### Full JSON example {#anglecnec-json-example}
~~~json
  "angleCnecResults" : [ {
    "angleCnecId" : "angleCnecId",
    "initial" : {
      "degree" : {
        "angle" : 3135.0,
        "margin" : 3131.0
      }
    },
    "afterPRA" : {
      "degree" : {
        "angle" : 3235.0,
        "margin" : 3231.0
      }
    }, ...
~~~