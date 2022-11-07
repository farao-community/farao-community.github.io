---
layout: documentation
title: JSON CRAC format
permalink: /docs/input-data/crac/json
hide: true
root-page: Documentation
docu-section: Input Data
docu-parent: CRAC
order: 1
feature-img: "assets/img/farao3.jpg"
tags: [Docs, Data]
---

The name CRAC is a standard denomination defined by the ENTSO-E which means: Contingency list, Remedial Actions, and Additional constraints.

More concretely, it is an object which gathers data on:
- critical outages,
- critical network elements,
- and remedial actions.

It is typically used in European coordinated processes. It enables, for a given geographical region, to define the network elements that might be critical after which outages, and the remedial actions that might help to manage those critical elements.

**A CRAC object model has been designed in FARAO** in order to store all the aforementioned information. This page aims at presenting: 

- the content and the organization of the data present in the FARAO CRAC object model,
- how a FARAO CRAC object can be built,
  - either by using the java API,
  - or by using the FARAO internal Json CRAC format.

Note that other pages of this documentation describe how the FARAO CRAC object model can be built with other standard CRAC formats, such as the CORE Merged-CB CRAC format, the security limit format, or the CRAC CSE Format.


### Full CRAC examples
Example of complete CRACs are given below

{% capture t1_java %}
The creation of a small CRAC is for instance made in this test class of farao-core repository:
<a href="
https://github.com/farao-community/farao-core/blob/master/data/crac/crac-impl/src/test/java/com/farao_community/farao/data/crac_impl/utils/CommonCracCreation.java"> 
example on github
</a>
{% endcapture %}
{% capture t1_json %}
An example of a small CRAC in the json internal format of FARAO is given below:
<a href="
https://github.com/farao-community/farao-core/blob/master/ra-optimisation/search-tree-rao/src/test/resources/crac/small-crac-with-network-actions.json"> 
example on github
</a>
{% endcapture %}
{% include /tabs.html id="t1" tab1name="JAVA creation API" tab1content=t1_java tab2name="JSON file" tab2content=t1_json %}

The following paragraphs of this page explain, step by step, the content of those examples.

> **KEY**  
> 🔴 marks a mandatory field  
> ⚪ marks an optional field  
> 🔵 marks a field that can be mandatory in some cases  
> ⭐ marks a field that must be unique in the CRAC  

### Network elements {#network-elements}
FARAO relies on [PowSyBl framework](https://www.powsybl.org/), and FARAO's CRAC relies on some elements of the PowSyBl's iidm Network object: the so-called network elements.

The network elements are for instance: the elements which are disconnected from the network during a contingency, the electrical lines tagged as critical network elements in the CRAC, the PSTs which are referenced by the CRAC as remedial actions, the switches which could be used as topological remedial actions...

Network elements are referenced in the CRAC with:

🔴⭐ an id
: The id **must** match the id of a PowSyBl Identifiable object. When using a network element, the applications relying on the CRAC will look in the Network for an identifiable element with the very same id, if this element cannot be found it can cause an error of the application. When building the CRAC, one must therefore make sure that only the network elements whose id can be understood by the PowSyBl iidm Network are added to the CRAC. Note that some utility classes have been developed in order to ease the management of the network elements during the creation of a CRAC object.

⚪ a name
: The name shouldn't be absolutely required by the application relying on the CRAC object, but it could be useful to make the CRAC or some logs easier to read from a business viewpoint.

{% capture t2_java %}
Network elements are never built on their own in the CRAC object, they are always a component of a bigger object, for example the component of a Contingency, or the component of a CNEC. When building one of those bigger objects, one of the two following methods can be used to define (one of) its network elements, either with an id only, or an id and a name.
~~~java
withNetworkElement("network_element_id")
withNetworkElement("network_element_id", "network_element_name")
~~~
The first method will be depicted in the following example of this page, but note that it can always be switched to the second one to define as well a name to the network element.
{% endcapture %}
{% capture t2_json %}
Network elements ids are defined within the objects that contain them. Examples are given later in this page, for contingencies, CNECs and remedial actions.
Moreover, the internal Json CRAC format contains an index of network element names, in which network elements that have a name are listed, with their name and their id.
~~~json
  "networkElementsNamePerId" : {
    "network_element_id_1" : "[BE-FR] Interconnection between Belgium and France",
    "network_element_id_4" : "[DE-DE] Internal PST in Germany"
  },
~~~
{% endcapture %}
{% include /tabs.html id="t2" tab1name="JAVA creation API" tab1content=t2_java tab2name="JSON file" tab2content=t2_json %}

### Contingencies {#contingencies}
A CRAC contains contingencies. 'Contingency' is the denomination which has been chosen within the FARAO internal format, but contingencies are also commonly called 'outages', 'CO' for 'Critical Outages', or 'N-k'.

A contingency is the representation of an incident on the network i.e. a cut line or a group/transformer failure, etc. In FARAO, it is modelled by the loss of one or several network elements. Usually we have either a one network element loss that is called "N-1" or a two network elements loss that is called "N-2". For instance

- The loss of one generator
- The loss of two parallel electrical lines

A contingency is a probable event, whose consequences are putting the grid at risk, and which therefore must be considered when operating the system.

In FARAO, contingencies can be defined the following way:

{% capture t3_java %}
~~~java
crac.newContingency()
    .withId("CO_0001")
    .withName("N-1 on generator")
    .withNetworkElement("powsybl_generator_id")
    .add();

crac.newContingency()
    .withId("CO_0002")
    .withName("N-2 on electrical lines")
    .withNetworkElement("powsybl_electrical_line_1_id")
	  .withNetworkElement("powsybl_electrical_line_2_id")
    .add();
~~~
{% endcapture %}
{% capture t3_json %}
~~~json
"contingencies" : [ {
  "id" : "CO_0001",
  "name" : "N-1 on generator",
  "networkElementsIds" : [ "powsybl_generator_id" ]
}, {
    "id" : "CO_0002",
    "name" : "N-1 electrical lines",
    "networkElementsIds" : [ "powsybl_electrical_line_1_id", "powsybl_electrical_line_2_id" ]
  }],
~~~
{% endcapture %}
{% capture t3_objects %}
🔴⭐ **identifier**  
⚪ **name**  
⚪ **network elements**: list of 0 to N network elements  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 🔴 **network element id**: must be the id of a PowSyBl network identifiable  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ⚪ **network element names**  
Names are optional, they can be used to make the CRAC more understandable from a business viewpoint, but applications relying on the CRAC do not necessarily need them.  
(see also paragraph on [network elements](#network-elements) to see how they should be defined)
{% endcapture %}
{% include /tabs.html id="t3" tab1name="JAVA creation API" tab1content=t3_java tab2name="JSON file" tab2content=t3_json tab3name="Object fields" tab3content=t3_objects %}

The network elements currently handled by FARAO's contingencies are: internal lines, interconnections, transformers, PSTs, generators, HVDCs, BusBar sections and dangling lines.


### Instants and States {#instants-states}

The instant is a hypothetical moment in the chronology of a contingency. Three instants currently exist in Farao:

- the preventive instant, that occurs before any contingency, and describes the 'base case' situation.
- the outage instant, that occurs just after a contingency, in a time too short which does not permit the activation of curative remedial actions
- the auto instant, that occurs just after a contingency, during which automatic remedial actions are triggered by the appearance of the contingency, even if these automatic remedial actions generate constraints somewhere else in the network
- the curative instant, that occurs after a contingency, after a duration sufficient to allow the activation of curative remedial actions

> 💡  **NOTE**  
> Current limits on network elements are usually different in the outage and curative instants. The outage instant is supposed to be exceptional and shouldn't last longer than a few minutes, therefore less restrictive temporary limits (TATL) are allowed. On the contrary, the curative instant is supposed to be a lasting moment during which the grid operation goes back to normal, and usually comes with with more restrictive permanent limits (PATL).  
> Even though this PATL/TATL difference is commonly seen in the data of many processes, it is not set in stone, and the current limits can be defined freely in the CRAC of FARAO whatever the instant considered (see next section on CNECs).

Farao object model includes the notion of 'state'. A state is either:

- the preventive state, that is to say the state with the base-case network, without any contingency, which occur at the preventive instant.
- the combination of a contingency with instant outage, auto or curative, in that case it corresponds to the network situation after a contingency, with more or less delay after this contingency.


The scheme below illustrates these notions of instant and state. It highlights the combinations of the situations which can be described in a CRAC, with a base-case situation, but also variants of this situation occurring at different moments in time after different probable and hypothetical contingencies.

![Instants & states](/assets/img/States_AUTO.png)

Instants and states are not directly added to a FARAO CRAC object model, but are indirectly part of several notions which are introduced in the following paragraphs of this page.

### CNECs {#cnecs}

A CRAC contains CNECs. A CNEC stands for 'Critical Network Element and Contingency', it is also known under the name 'CBCO' for 'Critical Branch and Critical Outage'.

A CNEC is a **network element**, which is considered at a given **instant** after a **contingency**. The contingency must be defined or omitted depending on the instant of the CNEC:

- the CNEC is considered at instant preventive, after NO contingency (i.e. in the basecase network situation, at the preventive state)
- the CNEC is considered at instant auto, outage or curative, after a given contingency.

> 💡  **NOTE**  
> Note that in FARAO a CNEC is associated to only one instant and one contingency. This is not the case of all CRAC formats, for instance, in the CORE merged-CB CRAC format, the post-outage CNECs are implicitly defined for the two instants outage and curative, and in the security-limit format, a same CNEC can be defined for the preventive state and several contingencies.
> 
> (see also the pages on the [CRAC importers](import) to see how each format is mapped on FARAO internal format)


A CNEC has an operator, which is the name of the TSO which operates the network element of the CNEC.  
Moreover, a CNEC can have a reliability margin. It defines a safety buffer to cope with unplanned events or uncertainties of input data. 

**Optimised and monitored Cnecs**  
CNECs can be monitored and/or optimised. This notion of monitored/optimised has been introduced by the capacity calculation on the CORE region, and is inherent to the RAO of this region which:

- maximizes the margin of CNECs that are 'optimised'
- ensures that the margin of a 'monitored' CNEC is positive.

FARAO contains 3 types of CNECs : **FlowCnecs**, **AngleCnecs** and **VoltageCnecs**.
#### FlowCnec {#flow-cnecs}
A FlowCnec has the two following specificities:

- it contains one network element that is a **'Branch'**. In the PowSyBl vocabulary, a 'Branch' is an element which is connected to two terminals. For instance, lines, tie-lines, transformers and PSTs are 'Branches'.
- the physical parameter which is monitored by the CNEC is the **power flow**.

A FlowCnec is one version (implementation) in FARAO of a generic object: a BranchCnec object. This allows fast implementation of other types of CNECs on which other physical parameters than power flow will be monitored.

A FlowCnec has **two sides**, which correspond to the two terminals of the PowSyBl network element of the FlowCnec, usually called terminal one and two, or terminal left and right. The notion of **direction** is also inherent to the FlowCnec: a flow in direction "direct" is a flow from terminal one/left to terminal two/right, while a flow in direction "opposite" is a flow from terminal two/right to terminal one/left. The convention of FARAO is that a positive flow is a flow in the "direct" direction, while a negative flow is a flow in the "opposite" direction.

##### Flow limits on a FlowCnec
A FlowCnec contains thresholds. Those thresholds define the limits between which the power flow of the FlowCnec should ideally remain. Those limits can be defined in megawatt, ampere, or in percentage of the Imax of the branch (%Imax). A threshold has a minimum and/or a maximum value. The maximum value represents the maximum value of the flow in the "direct" direction and the minimum value represents the inverse of the maximum value of the flow in the "opposite" direction. Therefore, the flow of FlowCnecs which only have one minimum value, or one maximum value is implicitly monitored in only one direction (see example 1 of picture below).

![FlowCnec-Threshold](/assets/img/flowcnec.png)

Thresholds are defined for a given side of the FlowCnec. Several "threshold rules" enable to define the side of the FlowCnec on which the threshold applies. The side can be defined directly with one of the two first rules, or with business consideration with one of the four last following rules:
- on left side
- on right side
- on regulated side
- on non-regulated side
- on high voltage level side
- on low voltage level side

> 💡  **NOTE**  
> The side of the threshold is particularly crucial for thresholds:  
> - in ampere or %Imax of **transformers**, as the current on both sides of a transformer are different
> - in %Imax of **tie-lines**, as the current limits are usually different on both sides of a tie-line.
> - used in applications which involve **AC load-flow** computation, as the flow in one side of a branch is not equal to the flow on its other side (due to losses)

In the examples of the picture above, all the thresholds are defined in megawatt. If the thresholds are defined in ampere, or in %Imax, additional data is required in order to handle the following conversions:
- if one threshold of the FlowCnec is in ampere or in percentage of Imax, the nominal voltage on both sides of the threshold must be defined
- if one threshold of the FlowCnec is in percentage of Imax, the Imax of the FlowCnec on the side of the threshold must be defined

[Utility methods](creation-methods) have been developed in FARAO to ease the management of the Imax and nominal voltage during the creation of FlowCnecs.


A FlowCnec has a reliability margin, also known as FRM for Flow Reliability Margin. The reliability margin can only be defined in megawatt. It is subtracted from the min/max values of the FlowCnec thresholds when the limits of the FlowCnec are computed.

##### Create a CNEC
In FARAO, FlowCnecs can be created by the java API, or written in the json CRAC internal format, as shown below:

{% capture t4_java %}
~~~java
crac.newFlowCnec()
    .withId("preventive-cnec-with-one-threshold-id")
    .withNetworkElement("network-element-id")
    .withInstant(Instant.PREVENTIVE)
    .withOperator("operator1")
    .newThreshold()
        .withUnit(Unit.MEGAWATT)
        .withRule(BranchThresholdRule.ON_LEFT_SIDE)
        .withMin(-1500.)
        .withMax(1500.)
        .add()
	.withReliabilityMargin(50.)
	.withOptimized(true)
    .add();

crac.newFlowCnec()
	.withId("curative-cnec-with-two-thresholds-id")
	.withName("curative-cnec-with-two-thresholds-name")
	.withNetworkElement("network-element-id")
	.withInstant(Instant.CURATIVE)
	.withContingency("contingency-id")
	.withOperator("operator1")
	.newThreshold()
		.withUnit(Unit.PERCENT_IMAX)
		.withRule(BranchThresholdRule.ON_RIGHT_SIDE)
		.withMax(0.95)
		.add()
	.newThreshold()
		.withUnit(Unit.AMPERE)
		.withRule(BranchThresholdRule.ON_RIGHT_SIDE)
		.withMin(-450.)
		.add()
	.withReliabilityMargin(50.)
	.withOptimized(true)
	.withMonitored(false)
	.withNominalVoltage(380., Side.LEFT)
	.withNominalVoltage(220., Side.RIGHT)
	.withIMax(500.) // the value is supposed to be the same on both side, though the side could have been specified with withImax(500., Side.RIGHT) 
    .add();
~~~
{% endcapture %}
{% capture t4_json %}
~~~json
  "flowCnecs" : [ {
    "id" : "preventive-cnec-with-one-threshold-id",
    "name" : "preventive-cnec-with-one-threshold-id",
    "networkElementId" : "network-element-id",
    "operator" : "operator1",
    "instant" : "preventive",
    "optimized" : true,
    "monitored" : false,
    "frm" : 50.0,
    "thresholds" : [ {
      "unit" : "megawatt",
      "min" : -1500.0,
      "max" : 1500.0,
      "rule" : "onLeftSide"
    } ]
  },  {
    "id" : "curative-cnec-with-two-thresholds-id",
    "name" : "curative-cnec-with-two-thresholds-name",
    "networkElementId" : "network-element-id",
    "operator" : "operator1",
    "instant" : "curative",
    "contingencyId" : "contingency-id",
    "optimized" : true,
    "monitored" : false,
    "frm" : 50.0,
    "iMax" : [ 500.0 ],
    "nominalV" : [ 380.0, 220.0 ],
    "thresholds" : [ {
      "unit" : "ampere",
      "min" : -450.0,
      "rule" : "onRightSide"
    }, {
      "unit" : "percent_imax",
      "max" : 0.95,
      "rule" : "onRightSide"
    } ]
  } ]
~~~
{% endcapture %}
{% capture t4_objects %}
🔴⭐ **identifier**  
⚪ **name**  
🔴 **network element**: one network element  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 🔴 **network element id**: must be the id of a PowSyBl network identifiable  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ⚪ **network element name**  
🔴 **instant**  
🔵 **contingency**: mandatory, except if the instant is preventive. Must be the id of a contingency which exists in the CRAC  
⚪ **operator**  
⚪ **reliability margin**: default value = 0 MW  
⚪ **optimized**: default value = false  
⚪ **monitored**: default value = false  
🔴 **thresholds**: list of 1 to N thresholds, a FlowCnec must contain at least one threshold  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 🔴 **unit**  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 🔴 **rule**  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 🔵 **minValue**  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 🔵 **maxValue**: at least one of these two values (min/max) is required  
🔵 **nominal voltages**: mandatory if the FlowCnec has at least one threshold in %Imax or A  
🔵 **iMax**:  mandatory if the FlowCnec has at least one threshold in %Imax  
{% endcapture %}
{% include /tabs.html id="t4" tab1name="JAVA creation API" tab1content=t4_java tab2name="JSON file" tab2content=t4_json tab3name="Object fields" tab3content=t4_objects %}
#### AngleCnec {#angle-cnecs}
An AngleCnec is a branch which may see a phase angle shift between its two ends when it's disconnected. This may induce insecurities in the network when it's back up. That's why we monitor angle CNECs and associate with them remedial actions (generally re-dispatching) that can reduce the phase angle shift between the two ends.

In terms of FARAO object model, an AngleCnec is a CNEC. Even though it is associated with a branch, it is not a BranchCnec, because we cannot define on which side it is monitored: it is monitored on both sides (more specifically, we monitor the phase shift between the two sides). 

An AngleCnec has the following specificities:

- it contains two network elements, an importing node and an exporting node, that represent the importing and exporting ends of the branch.
- the physical parameter which is monitored by the CNEC is the **angle**.
- it must contain at least one threshold, defined in degrees. A threshold has a minimum and/or a maximum value.

> 💡  **NOTE**
> AngleCnecs currently cannot be optimised by the RAO, but they are monitored by an independent [AngleMonitoring](/docs/engine/angle-monitoring) module.

##### Create an AngleCnec
In FARAO, AngleCnecs can be created by the java API, or written in the json CRAC internal format, as shown below:

{% capture t5_java %}
~~~java
 cnec1 = crac.newAngleCnec()
  .withId("angleCnecId1")
  .withName("angleCnecName1")
  .withInstant(Instant.OUTAGE)
  .withContingency(contingency1Id)
  .withOperator("cnec1Operator")
  .withExportingNetworkElement("eneId1", "eneName1")
  .withImportingNetworkElement("ineId1", "ineName1")
  .newThreshold().withUnit(Unit.DEGREE).withMax(1000.0).withMin(-1000.0).add()
  .withMonitored()
  .add();

cnec2 = crac.newAngleCnec()
  .withId("angleCnecId2")
  .withInstant(Instant.PREVENTIVE)
  .withOperator("cnec2Operator")
  .withExportingNetworkElement("eneId2")
  .withImportingNetworkElement("ineId2")
  .withReliabilityMargin(5.0)
  .newThreshold().withUnit(Unit.DEGREE).withMax(500.0).add()
  .withMonitored()
  .add();
~~~
{% endcapture %}
{% capture t5_json %}
~~~json
    "angleCnecs" : [ {
    "id" : "angleCnecId1",
    "name" : "angleCnecName1",
    "exportingNetworkElementId" : "eneId1",
    "importingNetworkElementId" : "ineId1",
    "operator" : "cnec1Operator",
    "instant" : "outage",
    "contingencyId" : "contingency1Id",
    "optimized" : false,
    "monitored" : true,
    "reliabilityMargin" : 0.0,
    "thresholds" : [ {
      "unit" : "degree",
      "min" : -1000.0,
      "max" : 1000.0
    } ]
  } ],
    "angleCnecs" : [ {
    "id" : "angleCnecId2",
    "exportingNetworkElementId" : "eneId2",
    "importingNetworkElementId" : "ineId2",
    "operator" : "cnec2Operator",
    "instant" : "preventive",
    "optimized" : false,
    "monitored" : true,
    "reliabilityMargin" : 5.0,
    "thresholds" : [ {
      "unit" : "degree",
      "max" : 500.0
    } ]
  } ]
~~~
{% endcapture %}
{% capture t5_objects %}
🔴⭐ **identifier**  
⚪ **name**  
🔴 **importing network element**: one network element  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 🔴 **network element id**: must be the id of a PowSyBl network identifiable  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ⚪ **network element name**  
🔴 **exporting network element**: one network element  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 🔴 **network element id**: must be the id of a PowSyBl network identifiable  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ⚪ **network element name**  
🔴 **instant**  
🔵 **contingency**: mandatory, except if the instant is preventive. Must be the id of a contingency which exists in the CRAC  
⚪ **operator**  
⚪ **reliability margin**: default value = 0 °  
🔴 **thresholds**: list of 1 to N thresholds, an AngleCnec must contain at least one threshold  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 🔴 **unit**  : must be in degrees  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 🔵 **minValue**  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 🔵 **maxValue**: at least one of these two values (min/max) is required   
{% endcapture %}
{% include /tabs.html id="t5" tab1name="JAVA creation API" tab1content=t5_java tab2name="JSON file" tab2content=t5_json tab3name="Object fields" tab3content=t5_objects %}
#### VoltageCnec {#voltage-cnecs}
A VoltageCnec is a CNEC on which we monitor the voltage on substations. It has the following specificities:
- it contains one network element
- the physical parameter which is monitored by the CNEC is the **voltage**.
- it must contain at least one threshold, defined in kilovolts. A threshold has a minimum and/or a maximum value.  

> 💡  **NOTE**
> VoltageCnecs currently cannot be optimised by the RAO, but they are monitored by an independent [VoltageMonitoring](/docs/engine/voltage-monitoring) module.

##### Create a VoltageCnec
In FARAO, VoltageCnecs can be created by the java API, or written in the json CRAC internal format, as shown below:

{% capture t6_java %}
~~~java
cnec1 = crac.newVoltageCnec()
                .withId("voltageCnecId1")
                .withName("voltageCnecName1")
                .withInstant(Instant.OUTAGE)
                .withContingency(contingency1Id)
                .withOperator("cnec1Operator")
                .withNetworkElement("neId1", "neName1")
                .newThreshold().withUnit(Unit.KILOVOLT).withMax(1000.0).withMin(-1000.0).add()
                .withMonitored()
                .add();
        cnec2 = crac.newVoltageCnec()
                .withId("voltageCnecId2")
                .withInstant(Instant.PREVENTIVE)
                .withOperator("cnec2Operator")
                .withNetworkElement("neId2")
                .newThreshold().withUnit(Unit.KILOVOLT).withMax(500.0).add()
                .withMonitored()
                .add();
~~~
{% endcapture %}
{% capture t6_json %}
~~~json
    "voltageCnecs" : [ {
    "id" : "voltageCnecId1",
    "name" : "voltageCnecName1",
    "networkElementId" : "neId1",
    "operator" : "cnec1Operator",
    "instant" : "outage",
    "contingencyId" : "contingency1Id",
    "optimized" : false,
    "monitored" : true,
    "reliabilityMargin" : 0.0,
    "thresholds" : [ {
      "unit" : "kilovolt",
      "min" : -1000.0,
      "max" : 1000.0
    } ]
  } ],
    "voltageCnecs" : [ {
    "id" : "voltageCnecId2",
    "networkElementId" : "neId2",
    "operator" : "cnec2Operator",
    "instant" : "preventive",
    "optimized" : false,
    "monitored" : true,
    "reliabilityMargin" : 0.0,
    "thresholds" : [ {
      "unit" : "kilovolt",
      "max" : 500.0
    } ]
  } ]
~~~
{% endcapture %}
{% capture t6_objects %}
🔴⭐ **identifier**  
⚪ **name**  
🔴 **network element**: one network element  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 🔴 **network element id**: must be the id of a PowSyBl network identifiable  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ⚪ **network element name**  
🔴 **instant**  
🔵 **contingency**: mandatory, except if the instant is preventive. Must be the id of a contingency which exists in the CRAC  
⚪ **operator**  
⚪ **reliability margin**: default value = 0 kV  
🔴 **thresholds**: list of 1 to N thresholds, a VoltageCnec must contain at least one threshold  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 🔴 **unit**  : must be in kilovolts  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 🔵 **minValue**  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 🔵 **maxValue**: at least one of these two values (min/max) is required   
{% endcapture %}
{% include /tabs.html id="t6" tab1name="JAVA creation API" tab1content=t6_java tab2name="JSON file" tab2content=t6_json tab3name="Object fields" tab3content=t6_objects %}
### Remedial actions and usages rules {#remedial-actions}

A remedial action is an action on the network that is considered as able to reduce constraints on the CNECs.

Two types of remedial action exists in FARAO:  
- 'Network Actions', that have the specificity of being binary. A Network Action is either applied on the network, or not applied. Topological actions are a classic example of Network Actions.
- 'Range Actions', that have the specificity of having a degree of freedom - a set-point. When a Range Action is activated, it is activated with a given value of its set-point. PSTs are a classic example of Range Actions.

Both Network Actions and Range Actions have usage rules which define the condition under which they can be activated. The usage rules which exist in FARAO are:  
- the FreeToUse usage rule: a free-to-use usage rule means that the remedial action is available in all the states of a given instant.
- the OnState usage rule: an on-state usage rule means that the remedial action is available in a given state.
- the OnFlowConstraint usage rule: an on-flow-constraint usage rule means that the remedial action is available if a given FlowCnec is constrained (ie has a flow greater than one of its thresholds) in a given state.
- the OnFlowConstraintInCountry usage rule: a on-flow-constraint-in-country usage rule means that the remedial action is available if a FlowCnec in a given country is constrained (ie has a flow greater than one of its thresholds) in a given state.


A remedial action has an operator, which is the name of the TSO which operates the remedial action.

{% capture t7_java %}
The examples below are given for a Network Action, but the same methods exists for Range Actions.  
Complete examples of Network and Range Action creation are given in the following paragraphs.  
~~~java
crac.newNetworkAction()
    .newFreeToUseUsageRule()
        .withUsageMethod(UsageMethod.AVAILABLE)
        .withInstant(Instant.PREVENTIVE)
        .add();

crac.newNetworkAction()
    .newOnStateUsageRule()
        .withUsageMethod(UsageMethod.AVAILABLE)
        .withInstant(Instant.CURATIVE)
        .withContingency("contingency-id")
        .add();

crac.newNetworkAction()
    .newOnFlowConstraintUsageRule()
        .withInstant(Instant.AUTO)
        .withFlowCnec("flow-cnec-id")
        .add();
~~~
{% endcapture %}
{% capture t7_json %}
Complete examples of Network and Range Action in Json format are given in the following paragraphs
~~~json
  "freeToUseUsageRules" : [ {
      "instant" : "preventive",
      "usageMethod" : "available"
    } ],
    "onStateUsageRules" : [ {
      "instant" : "curative",
      "contingencyId" : "contingency-id",
      "usageMethod" : "available"
    } ],
	"onFlowConstraintUsageRules" : [ {
		"instant" : "auto",
		"flowCnecId" : "flow-cnec-id"
	} ],
~~~
{% endcapture %}
{% capture t7_objects %}
#### For FreeToUse usage rules
🔴 **instant**  
🔴 **usageMethod**  
#### For OnState usage rules
🔴 **instant**  
🔴 **usageMethod**  
🔴 **contingency**: must be the id of a contingency that exists in the CRAC  
#### For OnFlowConstraint usage rules
🔴 **instant**  
🔴 **flowCnecId**: must be the id of a CNEC that exists in the CRAC  
#### Usage methods
FARAO handles three different types of usage methods:  
1 - **AVAILABLE**: the remedial action is available in the given state, if the RAO decides it is optimal, with no extra condition  
2 - **FORCED**: the RAO must activate the remedial action (under the condition described by the usage rule)  
3 - **TO_BE_EVALUATED**: the RAO must evaluate the applicability of the remedial action before trying to apply it (only for OnFlowConstraint and OnFlowConstraintInCountry usage rules)  
*NB*: even though OnState usage rules on the preventive state is theoretically possible, it is forbidden by FARAO as the same purpose can be achieved with a FreeToUse usage rule on the preventive instant.  
{% endcapture %}
{% include /tabs.html id="t7" tab1name="JAVA creation API" tab1content=t5_java tab2name="JSON file" tab2content=t7_json tab3name="Object fields" tab3content=t7_objects %}

### Network Actions {#network-actions}

A Network Action is a combination of at least one elementary actions. The elementary actions in FARAO are:

- topological actions: they consist in the opening or the closing of one branch or one switch of the network.
- PST set-points: they consist in the modification of the tap of a PST to a pre-defined target tap.
- Injection set-points: they consist in the modification of an injection (load, generator or dangling line) to a pre-defined set-point.
- Switch pairs: they consist in opening a switch and closing another.

{% capture t8_java %}
~~~java
// combination of two topological actions
crac.newNetworkAction()
	.withId("topological-na-id")
    .withName("topological-na-name")
    .withOperator("operator")
    .newTopologicalAction()
		.withNetworkElement("network-element-id-1")
		.withActionType(ActionType.CLOSE)
		.add()
    .newTopologicalAction()
		.withNetworkElement("network-element-id-2")
		.withActionType(ActionType.OPEN)
		.add()
    .newFreeToUseUsageRule().withUsageMethod(UsageMethod.AVAILABLE).withInstant(Instant.PREVENTIVE).add()
    .add();

// pst set-point
crac.newNetworkAction()
	.withId("pst-setpoint-na-id")
    .withName("pst-setpoint-na-name")
    .withOperator("operator")
    .newPstSetPoint()
		.withSetpoint(15)
		.withNetworkElement("pst-network-element-id")
		.add()
    .newFreeToUseUsageRule().withUsageMethod(UsageMethod.AVAILABLE).withInstant(Instant.PREVENTIVE).add()
    .add();

// injection set-point with two usage rules
crac.newNetworkAction()
	.withId("injection-setpoint-na-id")
	.withOperator("operator")
	.newInjectionSetPoint()
		.withSetpoint(260)
		.withNetworkElement("generator-network-element-id")
		.add()
    .newFreeToUseUsageRule().withUsageMethod(UsageMethod.AVAILABLE).withInstant(Instant.PREVENTIVE).add()
    .newOnStateUsageRule().withUsageMethod(UsageMethod.AVAILABLE).withContingency("contingency-id").withInstant(Instant.CURATIVE).add()
    .add();

// switch pair
crac.newNetworkAction()
	.withId("switch-pair-na-id")
	.withOperator("operator")
	.newSwitchPair()
		.withSwitchToOpen("switch-to-open-id", "switch-to-open-name")
		.withSwitchToClose("switch-to-close-id-and-name")
		.add()
    .newFreeToUseUsageRule().withUsageMethod(UsageMethod.AVAILABLE).withInstant(Instant.PREVENTIVE).add()
    .add();
~~~
{% endcapture %}
{% capture t8_json %}
~~~json
 "networkActions" : [ {
    "id" : "topological-na-id",
    "name" : "topological-na-name",
    "operator" : "operator",
    "freeToUseUsageRules" : [ {
      "instant" : "preventive",
      "usageMethod" : "available"
    } ],
    "topologicalActions" : [ {
      "networkElementId" : "network-element-id-1",
      "actionType" : "close"
    }, {
      "networkElementId" : "network-element-id-2",
      "actionType" : "open"
    } ]
  }, {
    "id" : "pst-setpoint-na-id",
    "name" : "pst-setpoint-na-name",
    "operator" : "operator",
    "freeToUseUsageRules" : [ {
      "instant" : "preventive",
      "usageMethod" : "available"
    } ],
    "pstSetpoints" : [ {
      "networkElementId" : "pst-network-element-id",
      "setpoint" : 15
    } ]
  }, {
    "id" : "injection-setpoint-na-id",
    "name" : "injection-setpoint-na-id",
    "operator" : "operator",
    "freeToUseUsageRules" : [ {
      "instant" : "preventive",
      "usageMethod" : "available"
    } ],
    "onStateUsageRules" : [ {
      "instant" : "curative",
      "contingencyId" : "contingency-id",
      "usageMethod" : "available"
    } ],
    "injectionSetpoints" : [ {
      "networkElementId" : "generator-network-element-id",
      "setpoint" : 260.0
    } ]
  }, {
    "id" : "switch-pair-na-id",
    "name" : "switch-pair-na-id",
    "operator" : "operator",
    "freeToUseUsageRules" : [ {
      "instant" : "preventive",
      "usageMethod" : "available"
    } ],
    "switchPairs" : [ {
      "open" : "switch-to-open-id",
      "close" : "switch-to-close-id"
    } ]
  } ]
~~~
{% endcapture %}
{% capture t8_objects %}
🔴⭐ **identifier**  
⚪ **name**  
⚪ **operator**  
⚪ **freeToUse usage rules**: list of 0 to N FreeToUse usage rules (see previous paragraph on [usage rules](#remedial-actions))  
⚪ **onState usage rules**: list of 0 to N OnState usage rules (see previous paragraph on [usage rules](#remedial-actions))  
⚪ **onFlowConstraint usage rules**: list of 0 to N OnFlowConstraint usage rules (see previous paragraph on [usage rules](#remedial-actions))  
🔵 **topological actions**: list of 0 to N TopologicalAction  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 🔴 **network element**: id is mandatory, name is optional  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 🔴 **action type**  
🔵 **pst set points**: list of 0 to N PstSetPoint  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 🔴 **network element**: id is mandatory, name is optional  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 🔴 **setpoint**: integer, new tap of the PST  
🔵 **injection set points**: list of 0 to N InjectionSetPoint  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 🔴 **network element**: id is mandatory, name is optional  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 🔴 **setpoint**: double, new value of the injection in MW  
🔵 **switch pairs**: list of 0 to N SwitchPair  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 🔴 **switch to open (network element)**: id is mandatory, name is optional  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 🔴 **switch to close (network element)**: id is mandatory, name is optional, must be different from switch to open  
<br>
*NB*: A Network Action must contain at least on elementary action.
{% endcapture %}
{% include /tabs.html id="t8" tab1name="JAVA creation API" tab1content=t8_java tab2name="JSON file" tab2content=t8_json tab3name="Object fields" tab3content=t8_objects %}

### Range Actions {#range-actions}
FARAO has three types of RangeActions : PstRangeAction, HvdcRangeAction, and InjectionRangeAction.

#### PST Range Action {#pst-range-action}
A PstRangeAction contains a network element which must point toward a PST of the iidm PowSyBl network model. The PstRangeAction will be able to modify the set-point of this PST.

> 💡  **NOTE** 
> - the set-point of the PstRangeAction is the angle of the PST, given in degree
> - all the methods of the PST which mention a set-point implicitly ask for/return an angle
> - though, those methods are usually doubled with methods which ask for/return a tap

The domain in which the PstRangeAction can modify the tap of the PST is delimited by 'TapRanges'. A PstRangeAction contains a list (which can be empty) of TapRanges.  

TapRanges can be of different types:  
- **absolute**: the mix/max admissible tap of the PST, given in the convention of the PowSyBl network model
- **relative to initial network**: the maximum variation of the tap of the PST relatively to its initial tap
- **relative to previous instant**: the maximum variation of the tap of the PST relatively to its tap in the previous instant. Note that this type of range does not make sense for PstRangeActions which are only available in the preventive instant, as there is no instant before the preventive one.  

The final validity range of the PstRangeAction is the intersection of its TapRanges, with the intersection of the min/max feasible taps of the PST.  
The PstRangeAction also requires additional data, notably to be able to interpret the TapRanges. Those additional data are: the initial tap of the PST, and a conversion map which gives for each feasible tap of the PST its corresponding angle. Utility methods have been developed in FARAO to ease the management of these additional data during the creation of a PstRangeAction.

{% capture t9_java %}
~~~java
crac.newPstRangeAction()
    .withId("pst-range-action-id")
    .withName("pst-range-action-name")
    .withOperator("operator")
    .withNetworkElement("pst-network-element-id")
    .withInitialTap(3)
    .withTapToAngleConversionMap(Map.of(-3, 0., -2, .5, -1, 1., 0, 1.5, 1, 2., 2, 2.5, 3, 3.))
    .newTapRange()
        .withRangeType(RangeType.ABSOLUTE)
        .withMinTap(0)
        .withMaxTap(3)
        .add()
    .newTapRange()
        .withRangeType(RangeType.RELATIVE_TO_INITIAL_NETWORK)
        .withMinTap(-2)
        .withMaxTap(2)
        .add()
    .newFreeToUseUsageRule().withUsageMethod(UsageMethod.AVAILABLE).withInstant(Instant.PREVENTIVE).add()
    .add();
~~~
In that case, the validity domain of the PST (intersection of its ranges and feasible taps) is [1; 3]
Note that the [PstHelper utility class](creation-methods) can ease the creation of the TapToAngleConversionMap.
{% endcapture %}
{% capture t9_json %}
~~~json
"pstRangeActions" : [ {
    "id" : "pst-range-action-id",
    "name" : "pst-range-action-name",
    "operator" : "operator",
    "freeToUseUsageRules" : [ {
      "instant" : "preventive",
      "usageMethod" : "available"
    } ],
    "networkElementId" : "pst-network-element-id",
    "initialTap" : 2,
    "tapToAngleConversionMap" : {
      "-3" : 0.0,
      "-2" : 0.5,
      "-1" : 1.0,
      "0" : 1.5,
      "1" : 2.0,
      "2" : 2.5,
      "3" : 3.0
    },
    "ranges" : [ {
      "min" : 0,
      "max" : 3,
      "rangeType" : "absolute"
    }, {
      "min" : -2,
      "max" : 2,
      "rangeType" : "relativeToInitialNetwork"
    } ]
} ]
~~~
{% endcapture %}
{% capture t9_objects %}
🔴⭐ **identifier**  
⚪ **name**  
⚪ **operator**  
🔴 **network element**: id is mandatory, name is optional
🔴 **initial tap**
🔴 **tap to angle conversion map**  
🔴 **tap ranges**: list of 0 to N TapRange  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 🔴 **range type**  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 🔵 **min tap**  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 🔵 **max tap**: at least one value must be defined  
⚪ **freeToUse usage rules**: list of 0 to N FreeToUse usage rules (see paragraph on [usage rules](#remedial-actions))  
⚪ **onState usage rules**: list of 0 to N OnState usage rules (see paragraph on [usage rules](#remedial-actions))  
⚪ **onFlowConstraint usage rules**: list of 0 to N OnFlowConstraint usage rules (see paragraph on [usage rules](#remedial-actions))  
{% endcapture %}
{% include /tabs.html id="t9" tab1name="JAVA creation API" tab1content=t9_java tab2name="JSON file" tab2content=t9_json tab3name="Object fields" tab3content=t9_objects %}

#### HVDC Range Action {#hvdc-range-action}
An HvdcRangeAction contains a network element that must point towards an HvdcLine of the iidm PowSyBl network model. The HvdcRangeAction will be able to modify its set-point, in MW.  

The domain in which the HvdcRangeAction can modify the HvdcSetpoint is delimited by 'HvdcRanges'. An HvdcRangeAction contains a list of HvdcRanges. A range must be defined with a min and a max.  

HvdcRanges can only be absolute : the mix/max admissible set-point of the HVDC. ⚠️ *There isn't any check performed to verify that an applied set-point is between the ranges' min and max.*

{% capture t10_java %}
~~~java
 crac.newHvdcRangeAction()
        .withId("hvdc-range-action-id")
		.withName("hvdc-range-action-name")
   		.withOperator("operator")
        .withNetworkElement("hvec-id")
        .newHvdcRange().withMin(-5).withMax(10).add()
        .newFreeToUseUsageRule().withInstant(Instant.PREVENTIVE).withUsageMethod(UsageMethod.AVAILABLE).add()
        .add();  
~~~
In that case, the validity domain of the HVDC is [-5; 10].
{% endcapture %}
{% capture t10_json %}
~~~json
"hvdcRangeActions" : [ {
    "id" : "hvdc-range-action-id",
    "name" : "hvdc-range-action-name",
    "operator" : "operator",
    "freeToUseUsageRules" : [ {
      "instant" : "preventive",
      "usageMethod" : "available"
    } ],
    "networkElementId" : "hvdc-id",
    "ranges" : [ {
      "min" : -5.0,
      "max" : 10.0
    } ]
} ]
~~~
{% endcapture %}
{% capture t10_objects %}
🔴⭐ **identifier**  
⚪ **name**  
⚪ **operator**  
🔴 **network element**: id is mandatory, name is optional  
⚪ **hvdc ranges**: list of 0 to N HvdcRange  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 🔴 **min**  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 🔴 **max**  
⚪ **freeToUse usage rules**: list of 0 to N FreeToUse usage rules (see paragraph on [usage rules](#remedial-actions))  
⚪ **onState usage rules**: list of 0 to N OnState usage rules (see paragraph on [usage rules](#remedial-actions))  
⚪ **onFlowConstraint usage rules**: list of 0 to N OnFlowConstraint usage rules (see paragraph on [usage rules](#remedial-actions))  
{% endcapture %}
{% include /tabs.html id="t10" tab1name="JAVA creation API" tab1content=t10_java tab2name="JSON file" tab2content=t10_json tab3name="Object fields" tab3content=t10_objects %}

#### Injection Range Action {#injection-range-action}

An InjectionRangeAction modifies given generators' & loads' injection set-points in a given range of a reference set-point.

The impacted generators and loads each have a coefficient ("keys") of impact applied on this reference set-point.

This range action is mainly used to represent an HVDC line in AC equivalent model (where the line is disconnected and replaced by two injections, one on each side of the line, with opposite keys of 1 and -1).

{% capture t11_java %}
~~~java
 crac.newInjectionRangeAction()
        .withId("injection-range-action-id")
		.withName("injection-range-action-name")
   		.withOperator("operator")
        .withNetworkElementAndKey(1, "network-element-1")
        .withNetworkElementAndKey(-0.5, "network-element-2")
        .newRange().withMin(-1200).withMax(500).add()
        .newFreeToUseUsageRule().withInstant(Instant.PREVENTIVE).withUsageMethod(UsageMethod.AVAILABLE).add()
        .add();     
~~~
In that case, the validity domain of the injection range action's reference set-point is [-1200; 500].  
This means the set-point of "network-element-1" (key = 1) can be changed between -1200 and +500, while that of "network-element-2" (key = -0.5) will be changed between -250 and +600
{% endcapture %}
{% capture t11_json %}
~~~json
"injectionRangeActions" : [ {
    "id" : "injection-range-action-id",
    "name" : "injection-range-action-name",
    "operator" : "operator",
    "freeToUseUsageRules" : [ {
      "instant" : "preventive",
      "usageMethod" : "available"
    } ],
    "networkElementIdsAndKeys" : {
		"network-element-1" : 1.0,
		"network-element-2" : -0.5
	},
    "ranges" : [ {
      "min" : -1200.0,
      "max" : 500.0
    } ]
} ]
~~~
{% endcapture %}
{% capture t11_objects %}
🔴⭐ **identifier**  
⚪ **name**  
⚪ **operator**  
🔴 **network element and key** (list of 1 to N): id and key are mandatory, name is optional  
🔴 **ranges**: list of 1 to N Range  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 🔴 **min**  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 🔴 **max**  
⚪ **freeToUse usage rules**: list of 0 to N FreeToUse usage rules (see paragraph on usage rules)  
⚪ **onState usage rules**: list of 0 to N OnState usage rules (see paragraph on usage rules)  
⚪ **onFlowConstraint usage rules**: list of 0 to N OnFlowConstraint usage rules (see paragraph on usage rules)  
{% endcapture %}
{% include /tabs.html id="t11" tab1name="JAVA creation API" tab1content=t11_java tab2name="JSON file" tab2content=t11_json tab3name="Object fields" tab3content=t11_objects %}
