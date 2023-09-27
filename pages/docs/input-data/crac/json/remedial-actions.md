A remedial action is an action on the network that is considered capable of reducing constraints on the CNECs.

Two types of remedial action exists in FARAO:
- **Network Actions**: they have the specificity of being binary. A Network Action is either applied on the network, or
  not applied. Topological actions are a typical example of Network Actions.
- **Range Actions**: they have the specificity of having a degree of freedom, a set-point. When a Range Action is
  activated, it is activated at a given value of its set-point. PSTs are a typical example of Range Actions.

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
- the **OnVoltageConstraint** usage rule (defined for a specific [instant](#instants-states) and a specific [VoltageCnec](#voltage-cnecs)):
  the remedial action is available if the given VoltageCnec is constrained at the given instant.


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

crac.newNetworkAction()
    .newOnVoltageConstraintUsageRule()
        .withInstant(Instant.CURATIVE)
        .withVoltageCnec("voltage-cnec-id")
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
} ],
"onVoltageConstraintUsageRules" : [ {
    "instant" : "curative",
    "voltageCnecId" : "voltage-cnec-id"
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
<ins>**For OnVoltageConstraint usage rules**</ins>  
🔴 **instant**  
🔴 **voltageCnecId**: must be the id of an [VoltageCnec](#voltage-cnecs) that exists in the CRAC  
<ins>**Usage methods**</ins>  
FARAO handles three different types of usage methods:  
1 - **AVAILABLE**: the remedial action is available in the given state, if the RAO decides it is optimal, with no extra condition
2 - **FORCED**: the RAO must activate the remedial action under the condition described by the usage rule.

*NB*: even though OnState usage rules on the preventive state is theoretically possible, it is forbidden by FARAO as the same purpose can be achieved with a FreeToUse usage rule on the preventive instant.  
{% endcapture %}
{% include /tabs.html id="t7" tab1name="JAVA creation API" tab1content=t7_java tab2name="JSON file" tab2content=t7_json tab3name="Object fields" tab3content=t7_objects %}