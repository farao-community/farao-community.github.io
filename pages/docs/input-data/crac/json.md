---
layout: documentation
title: Internal json CRAC format
permalink: /docs/input-data/crac/json
hide: true
root-page: Documentation
docu-section: Input Data
docu-parent: CRAC
order: 3
tags: [Docs, Data, CRAC]
summary-hmax: 3
---

## Introduction {#introduction}
The name CRAC is a standard denomination defined by the ENTSO-E which means: **C**ontingency list, **R**emedial 
**A**ctions, and additional **C**onstraints.

In other words, it gathers the following information:
- critical outages,
- critical network elements,
- and remedial actions.

It is typically used in European coordinated processes. It enables, for a given geographical region, to define the 
network elements that might be critical after specific outages, and the remedial actions that might help to manage them.  

**A CRAC object model has been designed in FARAO** in order to store all the aforementioned information. This page aims to present:
- the content and the organization of the data present in the FARAO CRAC object model,
- how a FARAO CRAC object can be built,
  - using the java API,
  - or using the FARAO internal Json CRAC format.

Note that other pages of this documentation describe how the FARAO CRAC object model can be built with other standard 
CRAC formats, such as the [FlowBasedConstraint](fbconstraint) format, the [CSE](cse) Format, and the [CIM](cim) format.


## Full CRAC examples {#full-crac-examples}
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
  
The following paragraphs of this page explain, step by step, the content of these examples.

> **KEY**  
> 🔴 marks a **mandatory** field  
> ⚪ marks an **optional** field  
> 🔵 marks a field that can be **mandatory in some cases**  
> ⭐ marks a field that must be **unique** in the CRAC  

## Network elements {#network-elements}
FARAO relies on the [PowSyBl framework](https://www.powsybl.org/), and FARAO's CRAC relies on some elements of 
[PowSyBl's network model](https://www.powsybl.org/pages/documentation/grid/model/): the so-called network elements.

The network elements can be:  
- the elements that are disconnected from the network by a contingency, 
- the power lines that are identified as critical network elements in the CRAC, 
- the PSTs that are identified by the CRAC as remedial actions, 
- the switches that can be used as topological remedial actions...

Network elements are referenced in the CRAC with:

🔴⭐ an id
: The id **must** match the [unique id of a PowSyBl object](https://www.powsybl.org/pages/documentation/grid/model/#introduction). 
When using a network element, the applications relying on the CRAC will look in the Network for an identifiable element 
with the very same id: if this element cannot be found, it can lead to an error in the application. When building the CRAC, 
one must therefore make sure that only the network elements whose IDs can be understood by the PowSyBl iidm Network are 
added to the CRAC. This is particularly important to keep in mind if you want to [develop your own CRAC importer](import#new-formats).  

⚪ a name
: The name shouldn't be absolutely required by the application relying on the CRAC object, but it could be useful to 
make the CRAC or some outputs of the application more readable for humans.

{% capture t2_java %}
Network elements are never built on their own in the CRAC object: they are always a component of a larger business object, 
and are added implicitly to the CRAC when the business object is added (e.g. a contingency, a CNEC, or a remedial action).
When building a business object, one of the two following methods can be used to add a network element to it (using an 
ID only, or an ID and a name).
~~~java
(...).withNetworkElement("network_element_id")
(...).withNetworkElement("network_element_id", "network_element_name")
~~~
These methods will be depicted in the following examples on this page.
{% endcapture %}
{% capture t2_json %}
Network elements' IDs are defined within the objects that contain them. Examples are given later in this page, 
for contingencies, CNECs and remedial actions. Moreover, the internal Json CRAC format contains an index of network 
element names, in which network elements that have a name are listed, with their name and their ID.
~~~json
"networkElementsNamePerId" : {
  "network_element_id_1" : "[BE-FR] Interconnection between Belgium and France",
  "network_element_id_4" : "[DE-DE] Internal PST in Germany"
},
~~~
{% endcapture %}
{% include /tabs.html id="t2" tab1name="JAVA creation API" tab1content=t2_java tab2name="JSON file" tab2content=t2_json %}

## Contingencies {#contingencies}
A CRAC object must define "critical contingencies" (or "critical outages", or "CO", or "N-k"...).  
The denomination chosen within the FARAO internal format is **"Contingency"**.  

A contingency is the representation of an incident on the network (i.e. a cut line or a group/transformer failure, etc). 
In FARAO, it is modelled by the loss of one or several network elements. Usually we have either a one-network-element-loss 
called "N-1", or a two-network-element-loss called "N-2".  
  
Examples:  
- N-1: The loss of one generator
- N-2: The loss of two parallel power lines

A contingency is a probable event, for which the consequences can put the grid at risk. Therefore, contingencies must 
be considered when operating the electrical transmission / distribution system.

In FARAO, contingencies are defined the following way:

{% capture t3_java %}
~~~java
crac.newContingency()
    .withId("CO_0001")
    .withName("N-1 on generator")
    .withNetworkElement("powsybl_generator_id", "my_generators_name")
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
"contingencies" : [{
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
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ⚪ **network element names**: names are optional, they can be used to make the CRAC 
more understandable from a business viewpoint, but applications relying on the CRAC do not necessarily need them.  
{% endcapture %}
{% include /tabs.html id="t3" tab1name="JAVA creation API" tab1content=t3_java tab2name="JSON file" tab2content=t3_json tab3name="Object fields" tab3content=t3_objects %}

> 💡  **NOTE**  
> The network elements currently handled by FARAO's contingencies are: internal lines, interconnections, transformers, 
> PSTs, generators, HVDCs, bus-bar sections, and dangling lines.  

## Instants and States {#instants-states}

The instant is a moment in the chronology of a contingency event. Four instants currently exist in FARAO:
- the **preventive** instant occurs before any contingency, and describes the "base-case" situation.
- the **outage** instant occurs just after a contingency happens, in a time too short to allow the activation of any 
curative remedial action.
- the **auto** instant occurs after a contingency happens, and spans through the activation of automatic curative remedial 
actions ("automatons") that are triggered without any human intervention. These automatons are pre-configured to reduce 
some constraints, even though they can generate constraints elsewhere in the network.
- the **curative** instant occurs after a contingency happens, after enough time that would allow the human activation 
of curative remedial actions.

> 💡  **NOTE**  
> Flow / angle / voltage limits on critical network elements are usually different in these four instants.  
> The outage and auto instants are transitory, therefore less restrictive temporary limits (TATL) can be allowed in 
> these instants.  
> On the contrary, the preventive and curative instants are supposed to be a lasting moment during which the grid 
> operation is nominal (sometimes thanks to preventive and/or curative remedial actions), so they usually come with 
> more restrictive permanent limits (PATL).  
> FARAO allows a different limit setting for different instants on critical network elements (see [CNECs](#cnecs)).
> 
> ![patl-vs-tatl](/assets/img/patl-tatl.png)
> (**PRA** = Preventive Remedial Action, 
> **ARA** = Automatic Remedial Action, 
> **CRA** = Curative Remedial Action)

The FARAO object model includes the notion of "state". A state is either:

- the preventive state: the state of the base-case network, without any contingency, at the preventive instant.
- the combination of a given contingency with instant outage, auto or curative: the state of the network after the said 
contingency, at the given instant (= with more or less delay after this contingency).  

The scheme below illustrates these notions of instant and state. It highlights the combinations of the situations which can be described in a CRAC, with a base-case situation, but also variants of this situation occurring at different moments in time after different probable and hypothetical contingencies.

![Instants & states](/assets/img/States_AUTO.png)

Instants and states are not directly added to a FARAO CRAC object model; they are implicitly created by business objects 
that are described in the following paragraphs ([CNECs](#cnecs) and [remedial actions](#remedial-actions)).

## CNECs {#cnecs}

A CRAC should define CNECs. A CNEC is a "**C**ritical **N**etwork **E**lement and **C**ontingency" (also known as "CBCO" 
or "Critical Branch and Critical Outage").

A CNEC is a **network element**, which is considered at a given **instant**, after a given **contingency** (i.e. at a 
given FARAO ["state"](#instants-states)).  
The contingency is omitted if the CNEC is defined at the preventive instant.
  
> 💡  **NOTE**  
> A FARAO CNEC is associated one instant and one contingency only. This is not the case for all native CRAC formats: 
> for instance, in the [CORE merged-CB CRAC format](fbconstraint), the post-outage CNECs are implicitly defined for the 
> two instants outage and curative.
>  
> However, we are talking here about the internal FARAO CRAC format, which has its own independent conventions, and which 
> is imported from native CRAC formats using [CRAC importers](import).
  
A CNEC has an operator, i.e. the identifier of the TSO operating its network element.  
Moreover, a CNEC can have a reliability margin: a safety buffer to cope with unplanned events or uncertainties of input 
data (i.e. an extra margin). 

**Optimised and monitored CNECs**  
CNECs can be monitored and/or optimised. This notion of monitored/optimised has been introduced by the capacity 
calculation on the CORE region, and is now also used for the CSE region:  
- maximise the margins of CNECs that are "optimised"
- ensure that the margins of "monitored" CNECs are positive and/or are not decreased by the RAO.

FARAO contains 3 families of CNECs, depending on which type of physical constraints they have: **FlowCnecs**, 
**AngleCnecs** and **VoltageCnecs**.  

### FlowCnec {#flow-cnecs}
A FlowCnec has the two following specificities:

- it contains one network element that is a **Branch**. In the PowSyBl vocabulary, a [Branch](https://www.powsybl.org/pages/documentation/grid/model/#branches) 
is an element connected to two terminals. For instance, lines, tie-lines, transformers and PSTs are all "Branches".
- the physical parameter which is monitored on the CNEC is the **power flow**.
  
A FlowCnec has **two sides**, which correspond to the two terminals of the PowSyBl network element of the FlowCnec 
(usually called terminals "one" and "two", or terminals "left" and "right"). 
The notion of **direction** is also inherent to the FlowCnec: a flow in direction "direct" is a flow from terminal 
one/left to terminal two/right, while a flow in direction "opposite" is a flow from terminal two/right to terminal 
one/left. The convention of FARAO is that a positive flow is a flow in the "direct" direction, while a negative flow is 
a flow in the "opposite" direction.

> 💡  **NOTE**  
> A FARAO FlowCnec is one implementation of the generic ["BranchCnec"](https://github.com/farao-community/farao-core/blob/master/data/crac/crac-api/src/main/java/com/farao_community/farao/data/crac_api/cnec/BranchCnec.java).
> If needed, this would allow you a fast implementation of other types of CNECs, on branches, but with a monitored 
> physical parameter other than power flow.

#### Flow limits on a FlowCnec
A FlowCnec has flow limits, called "thresholds" in FARAO. These thresholds define the limits between which the power 
flow of the FlowCnec should ideally remain.  
- They can be defined in megawatt, ampere, or in percentage of the Imax of the branch (in which case the Imax is read in 
the network file).
- A threshold is defined either on the left or on the right side of the FlowCnec.
  > 💡  **NOTE**
  > The side of the branch on which the threshold is set is particularly crucial in the following cases:
  > - when the threshold is defined in ampere or %Imax on a [**transformer**](https://www.powsybl.org/pages/documentation/grid/model/#transformers),
  > as the current values on the two sides of a transformer are different,
  > - when the threshold is defined in %Imax on a [**tie-line**](https://www.powsybl.org/pages/documentation/grid/model/#tie-line),
  > as the current limits are usually different on both sides of a tie-line,
  > - when the application uses **AC load-flow** computation, as the flow values on the two sides of a branch are
  > different (due to losses). The CracCreationParameters allows the user to [decide which side(s) should be monitored by default](creation-parameters#default-monitored-line-side).
- A threshold has a minimum and/or a maximum value. The maximum value represents the maximum value of the flow in the "direct" direction 
and the minimum value represents the inverse of the maximum value of the flow in the "opposite" direction. 
Therefore, the flow of FlowCnecs which only have one minimum value, or one maximum value is implicitly monitored in 
only one direction (see example 1 of picture below).

![FlowCnec-Threshold](/assets/img/flowcnec.png)


In the examples above, all the thresholds are defined in megawatt. If the thresholds are defined in ampere, or in %Imax, 
additional data is required in order to handle the following conversions:
- if one threshold of the FlowCnec is in ampere or in percentage of Imax, the nominal voltage on both sides of the threshold must be defined
- if one threshold of the FlowCnec is in percentage of Imax, the Imax of the FlowCnec on the side of the threshold must be defined

> 💡  **NOTE**
> A FlowCnec's reliability margin is also known as FRM for Flow Reliability Margin. 
> It can only be defined in megawatt, it is subtracted from the thresholds of the FlowCnec, adding extra an constraint.
  
#### Creating a FlowCnec
In FARAO, FlowCnecs can be created by the java API, or written in the json CRAC internal format, as shown below:

{% capture t4_java %}
~~~java
crac.newFlowCnec()
    .withId("preventive-cnec-with-one-threshold-id")
    .withNetworkElement("network-element-id")
    .withInstant(Instant.PREVENTIVE)
    .withOperator("operator1")
    .withReliabilityMargin(50.)
    .withOptimized(true)
    .newThreshold()
      .withUnit(Unit.MEGAWATT)
      .withSide(Side.LEFT)
      .withMin(-1500.)
      .withMax(1500.)
      .add()
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
      .withSide(Side.RIGHT)
      .withMax(0.95)
      .add()
    .newThreshold()
      .withUnit(Unit.AMPERE)
      .withSide(Side.LEFT)
      .withMin(-450.)
      .add()
    .withReliabilityMargin(50.)
    .withOptimized(true)
    .withMonitored(false)
    .withNominalVoltage(380., Side.LEFT)
    .withNominalVoltage(220., Side.RIGHT)
    .withIMax(500.) // this means that the value is the same on both sides, but the side could have been specified using "withImax(500., Side.RIGHT)" instead 
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
    "side" : "left"
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
    "side" : "left"
  }, {
    "unit" : "percent_imax",
    "max" : 0.95,
    "side" : "right"
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
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 🔴 **side**  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 🔵 **minValue**  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 🔵 **maxValue**: at least one of minValue/maxValue should be defined 
🔵 **nominal voltages**: mandatory if the FlowCnec has at least one threshold in %Imax or A  
🔵 **iMax**:  mandatory if the FlowCnec has at least one threshold in %Imax  
{% endcapture %}
{% include /tabs.html id="t4" tab1name="JAVA creation API" tab1content=t4_java tab2name="JSON file" tab2content=t4_json tab3name="Object fields" tab3content=t4_objects %}
  
### AngleCnec {#angle-cnecs}
An AngleCnec is a branch which may see a phase angle shift between its two ends when it's disconnected. This may induce 
insecurities in the network when it's back up. That's why we monitor angle CNECs and associate with them remedial actions 
(generally re-dispatching) that can reduce the phase angle shift between the two ends.

In terms of FARAO object model, an AngleCnec is a CNEC. Even though it is associated with a branch, it is not a 
BranchCnec, because we cannot define on which side it is monitored: it is monitored on both sides (more specifically, 
we monitor the phase shift between the two sides). 

An AngleCnec has the following specificities:

- it contains two network elements, an importing node and an exporting node, that represent the importing and exporting ends of the branch.
- the physical parameter which is monitored by the CNEC is the **angle**.
- it must contain at least one threshold, defined in degrees. A threshold has a minimum and/or a maximum value.

> 💡  **NOTE**
> AngleCnecs currently cannot be optimised by the RAO, but they are monitored by an independent 
> [AngleMonitoring](/docs/engine/angle-monitoring) module.

#### Creating an AngleCnec
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
  .newThreshold()
    .withUnit(Unit.DEGREE)
    .withMax(1000.0)
        .withMin(-1000.0)
    .add()
  .withMonitored()
  .add();

cnec2 = crac.newAngleCnec()
  .withId("angleCnecId2")
  .withInstant(Instant.PREVENTIVE)
  .withOperator("cnec2Operator")
  .withExportingNetworkElement("eneId2")
  .withImportingNetworkElement("ineId2")
  .withReliabilityMargin(5.0)
  .newThreshold()
    .withUnit(Unit.DEGREE)
    .withMax(500.0)
    .add()
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

### VoltageCnec {#voltage-cnecs}
A VoltageCnec is a CNEC on which we monitor the voltage on substations. It has the following specificities:
- it contains one network element (a [VoltageLevel](https://www.powsybl.org/pages/documentation/grid/model/#voltage-level))
- the physical parameter which is monitored by the CNEC is the **voltage**.
- it must contain at least one threshold, defined in kilovolts. A threshold has a minimum and/or a maximum value.  

> 💡  **NOTE**
> VoltageCnecs currently cannot be optimised by the RAO, but they are monitored by an independent 
> [VoltageMonitoring](/docs/engine/voltage-monitoring) module.

#### Creating a VoltageCnec
In FARAO, VoltageCnecs can be created by the java API, or written in the json CRAC internal format, as shown below:

{% capture t6_java %}
~~~java
crac.newVoltageCnec()
    .withId("voltageCnecId1")
    .withName("voltageCnecName1")
    .withInstant(Instant.OUTAGE)
    .withContingency(contingency1Id)
    .withOperator("cnec1Operator")
    .withNetworkElement("neId1", "neName1")
    .newThreshold()
      .withUnit(Unit.KILOVOLT)
      .withMax(420.0)
      .withMin(360.0)
      .add()
    .withMonitored()
    .add();
crac.newVoltageCnec()
    .withId("voltageCnecId2")
    .withInstant(Instant.PREVENTIVE)
    .withOperator("cnec2Operator")
    .withNetworkElement("neId2")
    .newThreshold()
      .withUnit(Unit.KILOVOLT)
      .withMax(440.0)
      .add()
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
      "min" : 360.0,
      "max" : 420.0
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
      "max" : 440.0
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


## Remedial actions and usages rules {#remedial-actions}

A remedial action is an action on the network that is considered capable of reducing constraints on the CNECs.

Two types of remedial action exists in FARAO:  
- **Network Actions**: they have the specificity of being binary. A Network Action is either applied on the network, or 
not applied. Topological actions are a classic example of Network Actions.
- **Range Actions**: they have the specificity of having a degree of freedom, a set-point. When a Range Action is 
activated, it is activated at a given value of its set-point. PSTs are a classic example of Range Actions.

Both Network Actions and Range Actions have usage rules which define the conditions under which they can be activated. 
The usage rules which exist in FARAO are:  
- the **FreeToUse** usage rule (defined for a specific [instant](#instants-states)): the remedial action is available in all 
the states of a given instant.
- the **OnState** usage rule (defined for a specific [state](#instants-states)): the remedial action is available in a given state.
- the **OnFlowConstraintInCountry** usage rule (defined for a specific [Country](https://github.com/powsybl/powsybl-core/blob/main/iidm/iidm-api/src/main/java/com/powsybl/iidm/network/Country.java) 
and a specific [instant](#instants-states)): the remedial action is available if any FlowCnec in the given country is 
constrained (ie has a flow greater than one of its thresholds) at the given instant.
- the **OnFlowConstraint** usage rule (defined for a specific [instant](#instants-states) and a specific [FlowCnec](#flow-cnecs)): 
the remedial action is available if the given FlowCnec is constrained at the given instant.
- the **OnAngleConstraint** usage rule (defined for a specific [instant](#instants-states) and a specific [AngleCnec](#angle-cnecs)): 
the remedial action is available if the given AngleCnec is constrained at the given instant.


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

crac.newNetworkAction()
    .newOnFlowConstraintInCountryUsageRule()
        .withInstant(Instant.PREVENTIVE)
        .withCountry(Country.FR)
        .add();

crac.newNetworkAction()
    .newOnAngleConstraintUsageRule()
        .withInstant(Instant.CURATIVE)
        .withAngleCnec("angle-cnec-id")
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
"onFlowConstraintInCountryUsageRules" : [ {
    "instant" : "preventive",
    "country" : "FR"
} ],
"onAngleConstraintUsageRules" : [ {
    "instant" : "curative",
    "angleCnecId" : "angle-cnec-id"
} ]
~~~
{% endcapture %}
{% capture t7_objects %}
<ins>**For FreeToUse usage rules**</ins>  
🔴 **instant**  
🔴 **usageMethod**  
<ins>**For OnState usage rules**</ins>  
🔴 **instant**  
🔴 **usageMethod**  
🔴 **contingency**: must be the id of a contingency that exists in the CRAC  
<ins>**For OnFlowConstraintInCountry usage rules**</ins>  
🔴 **instant**  
🔴 **country**: must be the [alpha-2 code of a country](https://github.com/powsybl/powsybl-core/blob/main/iidm/iidm-api/src/main/java/com/powsybl/iidm/network/Country.java)  
<ins>**For OnFlowConstraint usage rules**</ins>  
🔴 **instant**  
🔴 **flowCnecId**: must be the id of a [FlowCnec](#flow-cnecs) that exists in the CRAC  
<ins>**For OnAngleConstraint usage rules**</ins>  
🔴 **instant**  
🔴 **angleCnecId**: must be the id of an [AngleCnec](#angle-cnecs) that exists in the CRAC  
<ins>**Usage methods**</ins>  
FARAO handles three different types of usage methods:  
1 - **AVAILABLE**: the remedial action is available in the given state, if the RAO decides it is optimal, with no extra condition  
2 - **FORCED**: the RAO must activate the remedial action (under the condition described by the usage rule)  
3 - **TO_BE_EVALUATED**: the RAO must evaluate the applicability of the remedial action before trying to apply it (only for OnFlowConstraint and OnFlowConstraintInCountry usage rules)  
*NB*: even though OnState usage rules on the preventive state is theoretically possible, it is forbidden by FARAO as the same purpose can be achieved with a FreeToUse usage rule on the preventive instant.  
{% endcapture %}
{% include /tabs.html id="t7" tab1name="JAVA creation API" tab1content=t5_java tab2name="JSON file" tab2content=t7_json tab3name="Object fields" tab3content=t7_objects %}

## Network Actions {#network-actions}

A FARAO "Network Action" is a remedial action with a binary state: it is either active or inactive.  
One network action is a combination of one or multiple "elementary actions", among the following:  
- Topological action: opening or closing a branch or a switch in the network.
- PST set-point: setting the tap of a PST in the network to a specific position.
- Injection set-point: setting the active power set-point of an element in the network (load, generator or [dangling line](https://www.powsybl.org/pages/documentation/grid/model/#dangling-line)) 
  to a specific value.
- Switch pairs: opening a switch in the network and closing another (actually used to model [CSE bus-bar change remedial actions](cse#bus-bar)).

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
⚪ **onFlowConstraintInCountry usage rules**: list of 0 to N OnFlowConstraintInCountry usage rules (see previous paragraph on [usage rules](#remedial-actions))  
⚪ **onFlowConstraint usage rules**: list of 0 to N OnFlowConstraint usage rules (see previous paragraph on [usage rules](#remedial-actions))  
⚪ **onAngleConstraint usage rules**: list of 0 to N OnAngleConstraint usage rules (see previous paragraph on [usage rules](#remedial-actions))  
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
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 🔴 **switch to open (network element)**: id is mandatory, name is optional  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 🔴 **switch to close (network element)**: id is mandatory, name is optional, must be different from switch to open  
<br>
*NB*: A Network Action must contain at least on elementary action.
{% endcapture %}
{% include /tabs.html id="t8" tab1name="JAVA creation API" tab1content=t8_java tab2name="JSON file" tab2content=t8_json tab3name="Object fields" tab3content=t8_objects %}

## Range Actions {#range-actions}
A FARAO "Range Action" is a remedial action with a continuous or discrete set-point. If the range action is inactive, its 
set-point is equal to its value in the initial network. If it is activated, its set-point is optimized by the RAO to 
improve the objective function.  
FARAO has three types of range actions : PST range actions, HVDC range actions, and "injection" range actions.  

### PST Range Action {#pst-range-action}
A PstRangeAction contains a network element which must point to a [PST in the iidm PowSyBl network model](https://www.powsybl.org/pages/documentation/grid/model/#phase-tap-changer). 
The PstRangeAction will be able to modify the set-point of this PST.

> 💡  **NOTE** 
> - the set-point of the PstRangeAction is the angle of the PST, measured in degrees
> - all the methods of the PST which mention a set-point implicitly use angle values
> - however, they often have an equivalent that uses integer tap positions

The domain in which the PstRangeAction can modify the tap of the PST is delimited by 'TapRanges'. A PstRangeAction contains a list (which can be empty) of TapRanges.  

TapRanges can be of different types:  
- **absolute**: the mix/max admissible tap of the PST, given in the convention of the PowSyBl network model
- **relative to initial network**: the maximum variation of the tap of the PST relatively to its initial tap
- **relative to previous instant**: the maximum variation of the tap of the PST relatively to its tap in the previous instant. Note that this type of range does not make sense for PstRangeActions which are only available in the preventive instant, as there is no instant before the preventive one.  

The final validity range of the PstRangeAction is the intersection of its TapRanges, with the intersection of the min/max feasible taps of the PST.  
The PstRangeAction also requires additional data, notably to be able to interpret the TapRanges. Those additional data are: the initial tap of the PST, and a conversion map which gives for each feasible tap of the PST its corresponding angle. Utility methods have been developed in FARAO to ease the management of these additional data during the creation of a PstRangeAction.
  
Two or more [aligned PST range actions](crac#range-action) must have the same (random) group ID defined. The RAO will 
make sure their optimized set-points are always equal.  
  
If the PstRangeAction is an automaton, it has to have a speed assigned. This is an integer that defines the relative 
speed of this range action compared to other range-action automatons (smaller "speed" value = faster range action). 
No two range-action automatons can have the same speed value, unless they are aligned.  

{% capture t9_java %}
~~~java
crac.newPstRangeAction()
    .withId("pst-range-action-1-id")
    .withName("pst-range-action-1-name")
    .withOperator("operator")
    .withNetworkElement("pst-network-element-id")
    .withGroupId("pst-range-action-1 is aligned with pst-range-action-2")
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
    .withSpeed(1)
    .add();
~~~
In that case, the validity domain of the PST (intersection of its ranges and feasible taps) is [1; 3]
Note that the [PstHelper utility class](creation-methods) can ease the creation of the TapToAngleConversionMap.
{% endcapture %}
{% capture t9_json %}
~~~json
"pstRangeActions" : [ {
    "id" : "pst-range-action-1-id",
    "name" : "pst-range-action-1-name",
    "operator" : "operator",
    "freeToUseUsageRules" : [ {
      "instant" : "preventive",
      "usageMethod" : "available"
    } ],
    "networkElementId" : "pst-network-element-id",
    "groupId" : "pst-range-action-1 is aligned with pst-range-action-2",
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
    "speed" : 1,
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
⚪ **groupId**: if you want to align this range action with others, set the same groupId for all  
🔵 **speed**: mandatory if it is an automaton  
🔴 **initial tap**  
🔴 **tap to angle conversion map**  
🔴 **tap ranges**: list of 0 to N TapRange  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 🔴 **range type**  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 🔵 **min tap**  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 🔵 **max tap**: at least one value must be defined  
⚪ **freeToUse usage rules**: list of 0 to N FreeToUse usage rules (see paragraph on [usage rules](#remedial-actions))  
⚪ **onState usage rules**: list of 0 to N OnState usage rules (see paragraph on [usage rules](#remedial-actions))  
⚪ **onFlowConstraintInCountry usage rules**: list of 0 to N OnFlowConstraintInCountry usage rules (see previous paragraph on [usage rules](#remedial-actions))  
⚪ **onFlowConstraint usage rules**: list of 0 to N OnFlowConstraint usage rules (see previous paragraph on [usage rules](#remedial-actions))  
⚪ **onAngleConstraint usage rules**: list of 0 to N OnAngleConstraint usage rules (see previous paragraph on [usage rules](#remedial-actions))
{% endcapture %}
{% include /tabs.html id="t9" tab1name="JAVA creation API" tab1content=t9_java tab2name="JSON file" tab2content=t9_json tab3name="Object fields" tab3content=t9_objects %}

### HVDC Range Action {#hvdc-range-action}
An HvdcRangeAction contains a network element that must point towards an [HvdcLine of the iidm PowSyBl network model](https://www.powsybl.org/pages/documentation/grid/model/#hvdc-line).  
The HvdcRangeAction will be able to modify its active power set-point.    

The domain in which the HvdcRangeAction can modify the HvdcSetpoint is delimited by 'HvdcRanges'. 
An HvdcRangeAction contains a list of HvdcRanges. A range must be defined with a min and a max.  

Two or more [aligned HVDC range actions](crac#range-action) must have the same (random) group ID defined. The RAO will
make sure their optimized set-points are always equal.

If the HvdcRangeAction is an automaton, it has to have a speed assigned. This is an integer that defines the relative
speed of this range action compared to other range-action automatons (smaller "speed" value = faster range action).
No two range-action automatons can have the same speed value, unless they are aligned.  

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
⚪ **groupId**: if you want to align this range action with others, set the same groupId for all  
🔵 **speed**: mandatory if it is an automaton  
⚪ **hvdc ranges**: list of 0 to N HvdcRange  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 🔴 **min**  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 🔴 **max**  
⚪ **freeToUse usage rules**: list of 0 to N FreeToUse usage rules (see paragraph on [usage rules](#remedial-actions))  
⚪ **onState usage rules**: list of 0 to N OnState usage rules (see paragraph on [usage rules](#remedial-actions))  
⚪ **onFlowConstraint usage rules**: list of 0 to N OnFlowConstraint usage rules (see paragraph on [usage rules](#remedial-actions))  
{% endcapture %}
{% include /tabs.html id="t10" tab1name="JAVA creation API" tab1content=t10_java tab2name="JSON file" tab2content=t10_json tab3name="Object fields" tab3content=t10_objects %}

### Injection Range Action {#injection-range-action}

An InjectionRangeAction modifies given generators' & loads' injection set-points inside a given range.  
Each impacted generator or load has an associated "key", which is a coefficient of impact that is applied on its set-point.  

This range action is mainly used to represent an HVDC line in an AC equivalent model (where the line is disconnected and 
replaced by two injections, one on each side of the line, with opposite keys of 1 and -1).  

![HVDC AC model](/assets/img/HVDC_AC_model.png)
  
Two or more [aligned injection range actions](crac#range-action) must have the same (random) group ID defined. The RAO will
make sure their optimized set-points are always equal.

If the InjectionRangeAction is an automaton, it has to have a speed assigned. This is an integer that defines the relative
speed of this range action compared to other range-action automatons (smaller "speed" value = faster range action).
No two range-action automatons can have the same speed value, unless they are aligned.
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
⚪ **groupId**: if you want to align this range action with others, set the same groupId for all  
🔵 **speed**: mandatory if it is an automaton  
🔴 **ranges**: list of 1 to N Range  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 🔴 **min**  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 🔴 **max**  
⚪ **freeToUse usage rules**: list of 0 to N FreeToUse usage rules (see paragraph on usage rules)  
⚪ **onState usage rules**: list of 0 to N OnState usage rules (see paragraph on usage rules)  
⚪ **onFlowConstraint usage rules**: list of 0 to N OnFlowConstraint usage rules (see paragraph on usage rules)  
{% endcapture %}
{% include /tabs.html id="t11" tab1name="JAVA creation API" tab1content=t11_java tab2name="JSON file" tab2content=t11_json tab3name="Object fields" tab3content=t11_objects %}

---
See also: [CRAC import](import)

---