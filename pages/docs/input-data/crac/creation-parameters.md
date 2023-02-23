---
layout: documentation
title: CRAC creation parameters
permalink: /docs/input-data/crac/creation-parameters
hide: true
root-page: Documentation
docu-section: Input Data
docu-parent: CRAC
order: 2
tags: [Docs, Data, CRAC]
see-also: |
    [CSE CRAC format](cse), [CIM CRAC format](cim)
---

## Introduction {#introduction}
Native CRAC formats do not always hold all the information needed in order to conduct a precise remedial action optimisation.  
For instance, when monitoring current flows (vs their limits) on lines, one can wonder if they shall monitor 
the current on both sides of the line, on the left side only, or on the right side only.  
In DC convention, it doesn't matter: it is enough for the RAO to monitor the left side, allowing it to have a smaller optimisation problem.  
In AC convention, it is generally preferred to monitor both sides, as flows on both sides can be different because of losses.  
  
In FARAO's [internal CRAC format](json), it is possible which side(s) to monitor, and this is needed in the RAO.  
However, no CRAC format actually defines this configuration, thus is necessary to add an extra configuration object when creating a CRAC 
object to be used in the RAO.  
This is the purpose of FARAO's "CRAC creation parameters".

## Creating a CracCreationParameters object {#create}
(and reading/writing it to a file).  
Some examples:  
```java
// Creating the object
CracCreationParameters parameters = new CracCreationParameters();

// Writing it to an output stream
OutputStream outputStreeam = ...
JsonCracCreationParameters.write(parameters, outputStream);

// Reading an object from a file
Path jsonFilePath = ...
parameters = JsonCracCreationParameters.read(jsonFilePath);
```
  
  
## Non-specific parameters {#non-specific-parameters}
FARAO's [CracCreationParameters](https://github.com/farao-community/farao-core/blob/master/data/crac-creation/crac-creator-api/src/main/java/com/farao_community/farao/data/crac_creation/creator/api/parameters/CracCreationParameters.java) 
defines a few parameters needed for all native CRAC formats.

### crac-factory {#crac-factory}
FARAO's [Crac](https://github.com/farao-community/farao-core/blob/master/data/crac/crac-api/src/main/java/com/farao_community/farao/data/crac_api/Crac.java) 
object is actually just an interface, with a default implementation in [CracImpl](https://github.com/farao-community/farao-core/tree/master/data/crac/crac-impl/src/main/java/com/farao_community/farao/data/crac_impl).  
As a FARAO toolbox user, you are allowed to define your own custom Crac implementation. This implementation shall be created using a [CracFactory](https://github.com/farao-community/farao-core/blob/master/data/crac/crac-api/src/main/java/com/farao_community/farao/data/crac_api/CracFactory.java).  
FARAO's default implementation is [CracImplFactory](https://github.com/farao-community/farao-core/blob/master/data/crac/crac-impl/src/main/java/com/farao_community/farao/data/crac_impl/CracImplFactory.java).  
Parameter "crac-factory" allows the user to define which Crac implementation to use. If you do not have a custom implementation
(which should be the case of almost all users), set it to "CracImplFactory".  

### default-monitored-line-side {#default-monitored-line-side}
This parameter defines which side(s) of a line the RAO should monitor by default (side is defined as per [PowSyBl](https://www.powsybl.org/pages/documentation/) 
convention), when optimizing line's flow margin.    
Note that this parameter is ignored when the line side to monitor is defined by the native CRAC itself (e.g. when a 
cross-border tie-line is monitored by one TSO only, then the RAO will automatically detect on which side this TSO is).  
Possible values for this parameter are:  
- **monitor-lines-on-left-side** to monitor lines on left side only (typically to be used in DC-loadflow mode)
- **monitor-lines-on-right-side** to monitor lines on right side only (alternatively in DC-loadflow mode)
- **monitor-lines-on-both-sides** to monitor lines on both sides; the flow limits defined in the native CRAC file will then 
apply to both sides (typically to be used in AC-loadflow mode)
  
> 💡  **NOTE**  
> If you don't know which option to choose, it is safest to go with **monitor-lines-on-both-sides**

### complete example {#non-specific-parameters-example}
{% capture t1_java %}
```java
CracCreationParameters cracCreationParameters = new CracCreationParameters();
cracCreationParameters.setCracFactoryName("CracImplFactory");
cracCreationParameters.setDefaultMonitoredLineSide(CracCreationParameters.MonitoredLineSide.MONITOR_LINES_ON_BOTH_SIDES);
```
{% endcapture %}
{% capture t1_json %}
```json
{
  "crac-factory": "CracImplFactory",
  "default-monitored-line-side" : "monitor-lines-on-both-sides"
}
```
{% endcapture %}
{% include /tabs.html id="t1" tab1name="JAVA API" tab1content=t1_java tab2name="JSON file" tab2content=t1_json %}

## CSE-specific parameters {#cse}
The [CSE native crac format](cse) lacks important information that other formats don't.  
The user can define a [CseCracCreationParameters](https://github.com/farao-community/farao-core/blob/master/data/crac-creation/crac-creator-cse/src/main/java/com/farao_community/farao/data/crac_creation/creator/cse/parameters/CseCracCreationParameters.java) 
extension to the CracCreationParameters object in order to define them.  

### range-action-groups {#cse-range-action-groups}
The CSE native CRAC format does not allow defining [aligned range actions](crac#range-action). This extra parameter 
allows the user to do just that.  
To use it, you have to define a list of strings containing the IDs of range actions that have to be aligned seperated by a 
" + " sign; for example "range-action-1-id + range-action-17-id" and "range-action-8-id + range-action-9-id".  
See [example below](#cse-example) for a better illustration.

### bus-bar-change-switches {#bus-bar-change-switches}
As explained in the CSE native CRAC format section [here](cse#bus-bar), bus-bar-change remedial actions are defined in FARAO 
as [switch pair network actions](crac#switch-pair).  
These switches are not defined in the native CRAC not in the original network, they should be created artificially in the 
network and their IDs should be sent to the RAO.  
This parameter allows the definition of the switch(es) to open and the switch(es) to close for every bus-bar change remedial action.  
To use it, defined for every bus-bar-change remedial action ID the IDs of the pairs od switches to open/close.  
See [example below](#cse-example) for a better illustration.

### full CSE example {#cse-example}
{% capture t2_java %}
```java
// Create CracCreationParameters and set global parameters
CracCreationParameters cracCreationParameters = new CracCreationParameters();
cracCreationParameters.setCracFactoryName("CracImplFactory");
cracCreationParameters.setDefaultMonitoredLineSide(CracCreationParameters.MonitoredLineSide.MONITOR_LINES_ON_BOTH_SIDES);
// Create CSE-specific parameters
CseCracCreationParameters cseParameters = new CseCracCreationParameters();
cseParameters.setRangeActionGroupsAsString(List.of("rangeAction3 + rangeAction4", "hvdc1 + hvdc2"));
cseParameters.setBusBarChangeSwitchesSet(Set.of(
    new BusBarChangeSwitches("remedialAction1", Set.of(new SwitchPairId("switch1", "switch2"), new SwitchPairId("switch3", "switch4"))),
    new BusBarChangeSwitches("remedialAction2", Set.of(new SwitchPairId("switch5", "switch6")))
));
// Add CSE extension to CracCreationParameters
cracCreationParameters.addExtension(CseCracCreationParameters.class, cseParameters);
```
{% endcapture %}
{% capture t2_json %}
```json
{
  "crac-factory": "CracImplFactory",
  "default-monitored-line-side": "monitor-lines-on-both-sides",
  "extensions": {
    "CseCracCreatorParameters": {
      "range-action-groups": [
        "rangeAction3 + rangeAction4",
        "hvdc1 + hvdc2"
      ],
      "bus-bar-change-switches": [
        {
          "remedial-action-id": "remedialAction1",
          "switch-pairs": [
            {
              "open": "switch1",
              "close": "switch2"
            },
            {
              "open": "switch3",
              "close": "switch4"
            }
          ]
        },
        {
          "remedial-action-id": "remedialAction2",
          "switch-pairs": [
            {
              "open": "switch5",
              "close": "switch6"
            }
          ]
        }
      ]
    }
  }
}
```
{% endcapture %}
{% include /tabs.html id="t2" tab1name="JAVA API" tab1content=t2_java tab2name="JSON file" tab2content=t2_json %}

## CIM-specific parameters {#cim}
The [CIM native CRAC format](cim) lacks important information that other formats don't.  
The user can define a [CimCracCreationParameters](https://github.com/farao-community/farao-core/blob/master/data/crac-creation/crac-creator-cim/src/main/java/com/farao_community/farao/data/crac_creation/creator/cim/parameters/CimCracCreationParameters.java)
extension to the CracCreationParameters object in order to define them.

### timeseries-mrids {#timeseries-mrids}
Some processes require the RAO to split the CIM CRAC into multiple smaller CRACs, in particular in order to optimize different 
borders separately. For example, the SWE CC process requires the RAO to be split into one France-Spain RAO and one 
Spain-Portugal RAO. This is possible thanks to the CIM CRAC's TimeSeries tags, that can are each allocated to one of the 
two borders.  
The "timeseries-mrids" parameters allows the user to set which timeseries should be read from the CIM CRAC file, in order 
to define the CNECs and remedial actions of the border-specific RAO. TimeSeries are identified by their "mRID" value.  
See [example below](#cim-example) for a better illustration.

### range-action-groups {#cim-range-action-groups}
Like the CSE native CRAC format, the CIM format does not allow defining [aligned range actions](crac#range-action). 
This extra parameter allows the user to do just that.  
To use it, you have to define a list of strings containing the IDs of range actions that have to be aligned seperated by a
" + " sign; for example "range-action-1-id + range-action-17-id" and "range-action-8-id + range-action-9-id".  
See [example below](#cim-example) for a better illustration.

### range-action-speeds {#range-action-speeds}
FARAO can simulate range-action automatons, that is automatons that shift their set-points until one or many CNECs are secured.  
In order to do that, FARAO must know which automaton is quicker than the other, because activating one automaton can render 
the others useless.
As the CIM native CRAC format does not allow the definition of relative automaton speeds, this parameter allows the user to do it.  
To use it, set the speed of every range action automaton, defined by its ID. A smaller value means a speedier automaton.  
Beware that FARAO cannot optimize range-action automatons that do not have a defined speed ; also that aligned range actions 
must have the same speed.  
See [example below](#cim-example) for a better illustration.

### voltage-cnecs-creation-parameters {#voltage-cnecs-creation-parameters}
The CIM CRAC does not allow the definition of [VoltageCnecs](json#voltage-cnecs). This parameter allows the user 
to add VoltageCnecs during CRAC creation.  
To define voltage CNECs, the user has to define:
- A list of monitored network elements, identified by their unique ID in the network file. These network elements must be VoltageLevels.
- Instants for which these elements should be monitored (among PREVENTIVE, OUTAGE, AUTO, and CURATIVE)
- For instants other than PREVENTIVE that are selected, a list of contingencies after which these elements are monitored 
at defined instants (the contingences shall be identified by their CIM CRAC mRIDs as they figure in the B55 Series/Contingency_Series)
- For every instant, the minimum and maximum voltage thresholds to be applied for every nominal voltage level.  
See [example below](#cim-example) for a better illustration.


### full CIM example {#cim-example}
{% capture t3_java %}
```java
// Create CracCreationParameters and set global parameters
CracCreationParameters cracCreationParameters = new CracCreationParameters();
// Create CIM-specific parameters
CimCracCreationParameters cimParameters = new CimCracCreationParameters();
// Only read TimeSeries with mRIDs "border1-ts1" and "border1-ts2" from the CIM CRAC
cimParameters.setTimeseriesMrids(Set.of("border1-ts1", "border1-ts2"));
// Align rangeAction1 with rangeAction2 and rangeAction10 with rangeAction11
cimParameters.setRangeActionGroupsAsString(List.of("rangeAction1 + rangeAction2", "rangeAction10 + rangeAction11"));
// rangeAction1 and rangeAction2 are automatons that act faster than rangeAction3
cimParameters.setRemedialActionSpeed(Set.of(
    new RangeActionSpeed("rangeAction1", 1),
    new RangeActionSpeed("rangeAction2", 1),
    new RangeActionSpeed("rangeAction3", 2)
));
// Define voltage CNECs to be created
// Monitor these voltage levels (using their IDs in the network):
Set<String> voltageMonitoredElements = Set.of("ne1", "ne2");
// At preventive instant, constrain voltage CNECs:
// - with a nominal V of 400kV, to stay between 395 and 430kV
// - with a nominal V of 200kV, to stay above 180kV
Map<Double, VoltageThreshold> preventiveVoltageThresholds = Map.of(
    400., new VoltageThreshold(Unit.KILOVOLT, 395., 430.),
    200., new VoltageThreshold(Unit.KILOVOLT, 180., null)
);
// At curative instant, constrain voltage CNECs:
// - with a nominal V of 400kV, to stay between 380 and 430kV
// - with a nominal V of 210kV, to stay below 230kV
Map<Double, VoltageThreshold> curativeVoltageThresholds = Map.of(
    400., new VoltageThreshold(Unit.KILOVOLT, 380., 430.),
    210., new VoltageThreshold(Unit.KILOVOLT, null, 230.)
);
// Define these voltage CNECs for the following contingencies, as identified in the CIM CRAC:
Set<String> voltageContingencies = Set.of("N-1 ONE", "N-1 TWO");
// Put all this together in the CIM CRAC creation parameters
cimParameters.setVoltageCnecsCreationParameters(new VoltageCnecsCreationParameters(
    Map.of(
        Instant.PREVENTIVE, new VoltageMonitoredContingenciesAndThresholds(null, preventiveVoltageThresholds),
        Instant.CURATIVE, new VoltageMonitoredContingenciesAndThresholds(voltageContingencies, curativeVoltageThresholds)
    ),
    voltageMonitoredElements
));
// Add CIM extension to CracCreationParameters
cracCreationParameters.addExtension(CimCracCreationParameters.class, cimParameters);
```
{% endcapture %}
{% capture t3_json %}
```json
{
  "crac-factory": "CracImplFactory",
  "default-monitored-line-side": "monitor-lines-on-both-sides",
  "extensions": {
    "CimCracCreatorParameters": {
      "timeseries-mrids" : [ "border1-ts1", "border1-ts2" ],
      "range-action-groups": [
        "rangeAction1 + rangeAction2",
        "rangeAction10 + rangeAction11"
      ],
      "range-action-speeds": [
        {
          "range-action-id": "rangeAction1",
          "speed": 1
        },
        {
          "range-action-id": "rangeAction2",
          "speed": 1
        },
        {
          "range-action-id": "rangeAction3",
          "speed": 2
        }
      ],
      "voltage-cnecs-creation-parameters": {
        "monitored-states-and-thresholds": [
          {
            "instant": "PREVENTIVE",
            "thresholds-per-nominal-v": [
              {
                "nominalV": 400,
                "unit": "kilovolt",
                "min": 395,
                "max": 430
              },
              {
                "nominalV": 200,
                "unit": "kilovolt",
                "min": 180
              }
            ]
          },
          {
            "instant": "CURATIVE",
            "thresholds-per-nominal-v": [
              {
                "nominalV": 400,
                "unit": "KiloVolt",
                "min": 380,
                "max": 430
              },
              {
                "nominalV": 210,
                "unit": "KILOVOLT",
                "max": 230
              }
            ],
            "contingency-names": [
              "N-1 ONE",
              "N-1 TWO"
            ]
          }
        ],
        "monitored-network-elements": [
          "ne1",
          "ne2"
        ]
      }
    }
  }
}
```
{% endcapture %}
{% include /tabs.html id="t3" tab1name="JAVA API" tab1content=t3_java tab2name="JSON file" tab2content=t3_json %}
