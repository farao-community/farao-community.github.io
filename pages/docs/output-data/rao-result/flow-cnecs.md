These results contain important RAO information about flow CNECs.  
Note that you have to use [FlowCnec](/docs/input-data/crac/json#flow-cnecs) objects from the CRAC in order to query the RaoResult Java API.
Most results are power flow results (like flows & margins), and can be queried in two [units](https://github.com/farao-community/farao-core/blob/master/commons/src/main/java/com/powsybl/openrao/commons/Unit.java)
(AMEPRE & MEGAWATT) and on one or two sides (LEFT & RIGHT).

#### Flow {#flowcnec-flow}
The actual power flow on the branch.

{% capture t3_java %}
~~~java
// get the flow on a given flow cnec, at a given side, in a given unit, after optimisation of a given instant
double getFlow(Instant optimizedInstant, FlowCnec flowCnec, Side side, Unit unit);
~~~
{% endcapture %}
{% capture t3_json %}
Example:
~~~json
"flowCnecResults" : [ {
    "flowCnecId" : "cnec1outageId",
    "initial" : {
      "megawatt" : {
        ...
        "rightSide" : {
            "flow": 1110.0,
            ...
        },
        "leftSide" : {
            "flow": 1105.0,
            ...
        }
      },
      "ampere" : {
        ...
        "rightSide" : {
            "flow": 2220.0,
            ...
        },
        "leftSide" : {
            "flow": 2210.0,
            ...
        }        
      },
      ...
    },
    "preventive" : {
      "megawatt" : {
        ...
        "leftSide" : {
            "flow": 1210.0,
            ...
        }
      },
      "ampere" : {
        ...
        "leftSide" : {
            "flow": 505.0,
            ...
        }
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
The flow margin of the CNEC. If two flow values exist for the CNEC (i.e. if it is monitored on both sides) and / or if
it has multiple thresholds, the smallest margin is returned.

{% capture t4_java %}
~~~java
// get the margin of a given flow cnec, in a given unit, after optimisation of a given instant
double getMargin(Instant optimizedInstant, FlowCnec flowCnec, Unit unit);
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
    "preventive" : {
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
The relative margin is the smallest flow margin of the CNEC.
- When the margin is negative, the relative margin is equal to the margin
- When the margin is positive, it is equal to the margin divided by the zonal PTDF absolute sum  
  It is used to artificially increase (in the RAO) the margin on flow cnecs that are less impacted by changes in
  power exchanges between commercial zones, in order to prioritize other CNECs in the minimum margin optimisation.  
  (See [Modelling the maximum minimum relative margin objective function](/docs/castor/linear-optimisation-problem/max-min-relative-margin-filler))

{% capture t5_java %}
~~~java
// get the relative margin of a given flow cnec, in a given unit, after optimisation of a given instant
double getRelativeMargin(Instant optimizedInstant, FlowCnec flowCnec, Unit unit);
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
    "preventive" : {
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
// get the loop-flow on a given flow cnec, at a given side, in a given unit, after optimisation of a given instant
double getLoopFlow(Instant optimizedInstant, FlowCnec flowCnec, Side side, Unit unit);
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
        "leftSide" : {
            ...
            "loopFlow": 1113.0,
            ...
        }
        ...
      },
      "ampere" : {
        ...
        "leftSide" : {
            ...
            "loopFlow": 1123.0,
            ...
        }
        ...
      },
      ...
    },
    "preventive" : {
      "megawatt" : {
        ...
        "rightSide" : {
            ...
            "loopFlow": 1213.0,
            ...
        }
        ...
      },
      "ampere" : {
        ...
        "rightSide" : {
            ...
            "loopFlow": 1223.0,
            ...
        }
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
// get the commercial flow on a given flow cnec, at a given side, in a given unit, after optimisation of a given instant
double getCommercialFlow(Instant optimizedInstant, FlowCnec flowCnec, Side side, Unit unit);
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
        "leftSide" : {
            ...
            "commercialFlow": 1114.0,
            ...
        }
        ...
      },
      "ampere" : {
        ...
        "leftSide" : {
            ...
            "commercialFlow": 1124.0,
            ...
        }
        ...
      },
      ...
    },
    "preventive" : {
      "megawatt" : {
        ...
        "rightSide" : {
            ...
            "commercialFlow": 1214.0,
            ...
        }
        ...
      },
      "ampere" : {
        ...
        "rightSide" : {
            ...
            "commercialFlow": 1224.0,
            ...
        }
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
{% include /tabs.html id="t7" tab1name="JAVA API" tab1content=t7_java tab2name="JSON file" tab2content=t7_json %}

#### Zonal PTDF absolute sum {#flowcnec-ptdf-sum}
The absolute sum of zonal PTDFs (influence factors) on a given CNEC. Reflects the influence of power exchanges between commercial zones on the CNEC.  
*Note that this value does not have a unit*

{% capture t8_java %}
~~~java
// get the absolute sum of zonal PTDFs for a given flow cnec, at a given side, after optimisation of a given instant
double getPtdfZonalSum(Instant optimizedInstant, FlowCnec flowCnec, Side side);
~~~
{% endcapture %}
{% capture t8_json %}
*For compactness, zonal PTDF sums are written in the MEGAWATTS section*
Example:
~~~json
"flowCnecResults" : [ {
    "flowCnecId" : "cnec1outageId",
    "initial" : {
        "megawatt" : {
            ...
            "rightSide" : {
                ...
                "zonalPtdfSum" : 0.1
                ...
            }
            ...
        },
        ...
    },
    "preventive" : {
      ...
~~~
{% endcapture %}
{% include /tabs.html id="t8" tab1name="JAVA API" tab1content=t8_java tab2name="JSON file" tab2content=t8_json %}

#### Complete JSON example {#flowcnec-json-example}
This complete example was also enriched with two curative instants: `curative1` and  `curative2`.
~~~json
  "flowCnecResults" : [ {
    "flowCnecId" : "cnec1outageId",
    "initial" : {
      "megawatt" : {
        "margin" : 1111.0,
        "relativeMargin" : 1112.0,
        "rightSide" : {
          "flow" : 1110.5,
          "loopFlow" : 1113.5,
          "commercialFlow" : 1114.5,
          "zonalPtdfSum" : 0.6
        }
      },
      "ampere" : {
        "margin" : 1121.0,
        "relativeMargin" : 1122.0,
        "rightSide" : {
          "flow" : 1120.5,
          "loopFlow" : 1123.5,
          "commercialFlow" : 1124.5
        }
      }
    },
    "preventive" : {
      "megawatt" : {
        "margin" : 1211.0,
        "relativeMargin" : 1212.0,
        "rightSide" : {
          "flow" : 1210.5,
          "loopFlow" : 1213.5,
          "commercialFlow" : 1214.5,
          "zonalPtdfSum" : 0.6
        }
      },
      "ampere" : {
        "margin" : 1221.0,
        "relativeMargin" : 1222.0,
        "rightSide" : {
          "flow" : 1220.5,
          "loopFlow" : 1223.5,
          "commercialFlow" : 1224.5
        }
      }
    },
    "curative1" : {
      "megawatt" : {
        "margin" : 1311.0,
        "relativeMargin" : 1312.0,
        "rightSide" : {
          "flow" : 1310.5,
          "loopFlow" : 1313.5,
          "commercialFlow" : 1314.5,
          "zonalPtdfSum" : 0.13
        }
      },
      "ampere" : {
        "margin" : 1321.0,
        "relativeMargin" : 1322.0,
        "rightSide" : {
          "flow" : 1320.5,
          "loopFlow" : 1323.5,
          "commercialFlow" : 1324.5
        }
      }
    },
    "curative2" : {
      "megawatt" : {
        "margin" : 1411.0,
        "relativeMargin" : 1412.0,
        "rightSide" : {
          "flow" : 1410.5,
          "loopFlow" : 1413.5,
          "commercialFlow" : 1414.5,
          "zonalPtdfSum" : 0.14
        }
      },
      "ampere" : {
        "margin" : 1421.0,
        "relativeMargin" : 1422.0,
        "rightSide" : {
          "flow" : 1420.5,
          "loopFlow" : 1423.5,
          "commercialFlow" : 1424.5
        }
      }
    }
  }, {
    "flowCnecId" : "cnec1prevId",
    "initial" : {
      "megawatt" : {
        "margin" : 1111.0,
        "relativeMargin" : 1112.0,
        "rightSide" : {
          "flow" : 1110.5,
          "loopFlow" : 1113.5,
          "commercialFlow" : 1114.5,
          "zonalPtdfSum" : 0.6
        }
      },
      "ampere" : {
        "margin" : 1121.0,
        "relativeMargin" : 1122.0,
        "rightSide" : {
          "flow" : 1120.5,
          "loopFlow" : 1123.5,
          "commercialFlow" : 1124.5
        }
      }
    },
    "preventive" : {
      "megawatt" : {
        "margin" : 1211.0,
        "relativeMargin" : 1212.0,
        "rightSide" : {
          "flow" : 1210.5,
          "loopFlow" : 1213.5,
          "commercialFlow" : 1214.5,
          "zonalPtdfSum" : 0.6
        }
      },
      "ampere" : {
        "margin" : 1221.0,
        "relativeMargin" : 1222.0,
        "rightSide" : {
          "flow" : 1220.5,
          "loopFlow" : 1223.5,
          "commercialFlow" : 1224.5
        }
      }
    },
    "curative1" : {
      "megawatt" : {
        "margin" : 1311.0,
        "relativeMargin" : 1312.0,
        "rightSide" : {
          "flow" : 1310.5,
          "loopFlow" : 1313.5,
          "commercialFlow" : 1314.5,
          "zonalPtdfSum" : 0.13
        }
      },
      "ampere" : {
        "margin" : 1321.0,
        "relativeMargin" : 1322.0,
        "rightSide" : {
          "flow" : 1320.5,
          "loopFlow" : 1323.5,
          "commercialFlow" : 1324.5
        }
      }
    },
    "curative2" : {
      "megawatt" : {
        "margin" : 1411.0,
        "relativeMargin" : 1412.0,
        "rightSide" : {
          "flow" : 1410.5,
          "loopFlow" : 1413.5,
          "commercialFlow" : 1414.5,
          "zonalPtdfSum" : 0.14
          }
        },
        "ampere" : {
          "margin" : 1421.0,
          "relativeMargin" : 1422.0,
          "rightSide" : {
            "flow" : 1420.5,
            "loopFlow" : 1423.5,
            "commercialFlow" : 1424.5
          }
        }
      }
    }, ...
~~~