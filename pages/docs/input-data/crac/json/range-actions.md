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
    .newFreeToUseUsageRule().withUsageMethod(UsageMethod.AVAILABLE).withInstant("preventive").add()
    .withSpeed(1)
    .add();
~~~
In that case, the validity domain of the PST (intersection of its ranges and feasible taps) is [1; 3]
Note that the [PstHelper utility class](https://github.com/farao-community/farao-core/blob/master/data/crac-creation/crac-creation-util/src/main/java/com/powsybl/openrao/data/craccreation/util/PstHelper.java) can ease the creation of the TapToAngleConversionMap.
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
⚪ **groupId**: if you want to align this range action with others, set the same groupId for all. You can use any 
group ID you like, as long as you use the same for all the range actions you want to align.  
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
        .newFreeToUseUsageRule().withInstant("preventive").withUsageMethod(UsageMethod.AVAILABLE).add()
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
        .newFreeToUseUsageRule().withInstant("preventive").withUsageMethod(UsageMethod.AVAILABLE).add()
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
