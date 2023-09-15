---
layout: documentation
title: CSA CRAC format
permalink: /docs/input-data/crac/csa
hide: true
root-page: Documentation
docu-section: Input Data
docu-parent: CRAC
order: 6
tags: [ Docs, Data, CRAC ]
---

## Presentation {#presentation}

For the CSA process, the CRAC data is split over multiple XML files called **CSA profiles**, each one with its own
specific purpose, and which were inspired by the CGM format. This format
was [introduced by ENTSO-E](https://www.entsoe.eu/data/cim/cim-for-grid-models-exchange/). The objects in the different
CSA profiles reference one another using **mRID** links (UUID format) which makes it possible to separate the
information among several distinct files.

## Header overview {#header}

```xml
<?xml version="1.0" encoding="UTF-8"?>
<rdf:RDF
        xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
        xmlns:eumd="http://entsoe.eu/ns/Metadata-European#"
        xmlns:eu="http://iec.ch/TC57/CIM100-European#"
        xmlns:nc="http://entsoe.eu/ns/nc#"
        xmlns:prov="http://www.w3.org/ns/prov#"
        xmlns:md="http://iec.ch/TC57/61970-552/ModelDescription/1#"
        xmlns:skos="http://www.w3.org/2004/02/skos/core#"
        xmlns:dcat="http://www.w3.org/ns/dcat#"
        xmlns:cim="http://iec.ch/TC57/CIM100#"
        xmlns:dcterms="http://purl.org/dc/terms/#">
    <md:FullModel rdf:about="urn:uuid:e6b94ef6-e043-4d29-a258-1718d6d2f507">
        <dcat:Model.keyword>...</dcat:Model.keyword>
        <dcat:Model.startDate>2023-01-01T00:00:00Z</dcat:Model.startDate>
        <dcat:Model.endDate>2100-01-01T00:00:00Z</dcat:Model.endDate>
        ...
    </md:FullModel>
    ...
</rdf:RDF>
```

Each CSA profile is identified by a `keyword` that states which category of features it bears. Currently, FARAO handles
6 different CSA profiles, the keyword and purpose of which are gathered in the following table:

| Keyword | Full Name                | Purpose                                  |
|---------|--------------------------|------------------------------------------|
| AE      | Assessed Element         | Definition of CNECs.                     |
| CO      | Contingency              | Definition of contingencies.             |
| ER      | Equipment Reliability    | Definition of CNECs' thresholds.         |
| RA      | Remedial Action          | Definition of remedial actions.          |
| RAS     | Remedial Action Schedule | Definition of automatic remedial action. |
| SSI     | Steady State Instruction | Overriding data for specific instants.   |

Besides, each CSA profile has a period of validity delimited by the `startDate` and `endDate` fields in the
header's `FullModel` object. If the time at which the import occurs is outside of this time interval, the profile is
ignored.

## Contingencies {#contingencies}

The [contingencies](json#contingencies) are described in the **CO** profile. They can be represented by two types of
objects: `ExceptionalContingency` and  `OutOfRangeContingency`. The contingency is linked to the network element on
which it can occur through a `ContingencyEquipment`.

{% capture case_ExceptionalContingency %}

```xml
<!-- CO Profile -->
<rdf:RDF>
    ...
    <nc:ExceptionalContingency rdf:ID="_exceptional-contingency">
        <cim:IdentifiedObject.mRID>exceptional-contingency</cim:IdentifiedObject.mRID>
        <cim:IdentifiedObject.name>Exceptional contingency</cim:IdentifiedObject.name>
        <cim:IdentifiedObject.description>Example of exceptional contingency.</cim:IdentifiedObject.description>
        <nc:Contingency.normalMustStudy>true</nc:Contingency.normalMustStudy>
        <nc:Contingency.EquipmentOperator rdf:resource="http://data.europa.eu/energy/EIC/10XFR-RTE------Q"/>
    </nc:ExceptionalContingency>
    <cim:ContingencyEquipment rdf:ID="_contingency-equipment">
        <cim:IdentifiedObject.mRID>contingency-equipment</cim:IdentifiedObject.mRID>
        <cim:IdentifiedObject.name>Contingency equipment</cim:IdentifiedObject.name>
        <cim:IdentifiedObject.description>Example of contingency equipment.</cim:IdentifiedObject.description>
        <cim:ContingencyElement.Contingency rdf:resource="#_exceptional-contingency"/>
        <cim:ContingencyEquipment.contingentStatus
                rdf:resource="http://iec.ch/TC57/CIM100#ContingencyEquipmentStatusKind.outOfService"/>
        <cim:ContingencyEquipment.Equipment rdf:resource="#_equipment"/>
    </cim:ContingencyEquipment>
    ...
</rdf:RDF>
```

{% endcapture %}
{% capture case_OutOfRangeContingency %}

```xml
<!-- CO Profile -->
<rdf:RDF>
    ...
    <nc:OutOfRangeContingency rdf:ID="_out-of-range-contingency">
        <cim:IdentifiedObject.mRID>out-of-range-contingency</cim:IdentifiedObject.mRID>
        <cim:IdentifiedObject.name>Out-of-range contingency</cim:IdentifiedObject.name>
        <cim:IdentifiedObject.description>Example of out-of-range contingency.</cim:IdentifiedObject.description>
        <nc:Contingency.normalMustStudy>true</nc:Contingency.normalMustStudy>
        <nc:Contingency.EquipmentOperator rdf:resource="http://data.europa.eu/energy/EIC/10XFR-RTE------Q"/>
    </nc:OutOfRangeContingency>
    <cim:ContingencyEquipment rdf:ID="_contingency-equipment">
        <cim:IdentifiedObject.mRID>contingency-equipment</cim:IdentifiedObject.mRID>
        <cim:IdentifiedObject.name>Contingency equipment</cim:IdentifiedObject.name>
        <cim:IdentifiedObject.description>Example of contingency equipment.</cim:IdentifiedObject.description>
        <cim:ContingencyElement.Contingency rdf:resource="#_out-of-range-contingency"/>
        <cim:ContingencyEquipment.contingentStatus
                rdf:resource="http://iec.ch/TC57/CIM100#ContingencyEquipmentStatusKind.outOfService"/>
        <cim:ContingencyEquipment.Equipment rdf:resource="#_equipment"/>
    </cim:ContingencyEquipment>
    ...
</rdf:RDF>
```

{% endcapture %}
{% include /tabs.html id="CSA_CO_tabs" tab1name="ExceptionalContingency" tab1content=case_ExceptionalContingency
tab2name="
OutOfRangeContingency" tab2content=case_OutOfRangeContingency %}

## CNECs {#cnecs}

The [CNECs](json#cnec) are described in the **AE** profile with an `AssessedElement` object which bears the identifier,
name, instant(s) and operator information.

```xml
<!-- AE Profile -->
<rdf:RDF>
    ...
    <nc:AssessedElement rdf:ID="_assessed-element">
        <cim:IdentifiedObject.mRID>assessed-element</cim:IdentifiedObject.mRID>
        <cim:IdentifiedObject.name>Assessed element</cim:IdentifiedObject.name>
        <cim:IdentifiedObject.description>Example of assessed element.</cim:IdentifiedObject.description>
        <nc:AssessedElement.inBaseCase>true</nc:AssessedElement.inBaseCase>
        <nc:AssessedElement.isCritical>true</nc:AssessedElement.isCritical>
        <nc:AssessedElement.normalEnabled>true</nc:AssessedElement.normalEnabled>
        <nc:AssessedElement.isCombinableWithRemedialAction>false</nc:AssessedElement.isCombinableWithRemedialAction>
        <nc:AssessedElement.isCombinableWithContingency>false</nc:AssessedElement.isCombinableWithContingency>
        <nc:AssessedElement.AssessedSystemOperator rdf:resource="http://data.europa.eu/energy/EIC/10XFR-RTE------Q"/>
        <nc:AssessedElement.OperationalLimit rdf:resource="#_operational-limit"/>
    </nc:AssessedElement>
    ...
</rdf:RDF>
```

A CNEC can also be made curative by linking it to a contingency through an `AssessedElementWithContingency`.

```xml
<!-- AE Profile -->
<rdf:RDF>
    ...
    <nc:AssessedElementWithContingency rdf:ID="_assessed-element-with-contingency">
        <nc:AssessedElementWithContingency.mRID>assessed-element-with-contingency
        </nc:AssessedElementWithContingency.mRID>
        <nc:AssessedElementWithContingency.Contingency rdf:resource="#_contingency"/>
        <nc:AssessedElementWithContingency.AssessedElement rdf:resource="#_assessed-element"/>
        <nc:AssessedElementWithContingency.combinationConstraintKind
                rdf:resource="http://entsoe.eu/ns/nc#ElementCombinationConstraintKind.included"/>
        <nc:AssessedElementWithContingency.normalEnabled>true</nc:AssessedElementWithContingency.normalEnabled>
    </nc:AssessedElementWithContingency>
    ...
</rdf:RDF>
```

The distinction between the types of CNEC (FlowCNEC, AngleCNEC or VoltageCNEC) comes from the type of `OperationalLimit`
of the Assessed Element.

### FlowCNEC {#flow-cnec}

The CNEC is a [FlowCNEC](json#flow-cnecs) if its associated `OperationalLimit` is a `CurrentLimit` which can be found in
the **EQ**
profile (CGMES file).

```xml
<!-- EQ (CGMES) Profile -->
<rdf:RDF>
    ...
    <cim:OperationalLimitSet rdf:ID="_operational-limit-set">
        <cim:IdentifiedObject.mRID>operational-limit-set</cim:IdentifiedObject.mRID>
        <cim:IdentifiedObject.name>Operational limit set</cim:IdentifiedObject.name>
        <cim:IdentifiedObject.description>Example of operational limit set</cim:IdentifiedObject.description>
        <cim:OperationalLimitSet.Terminal rdf:resource="#_terminal"/>
    </cim:OperationalLimitSet>
    <cim:OperationalLimitType rdf:ID="_operational-limit-type">
        <cim:IdentifiedObject.mRID>operational-limit-type</cim:IdentifiedObject.mRID>
        <cim:IdentifiedObject.name>Operational limit type</cim:IdentifiedObject.name>
        <cim:IdentifiedObject.description>Example of operational limit type</cim:IdentifiedObject.description>
        <cim:OperationalLimitType.direction rdf:resource="http://entsoe.eu/ns/nc#RelativeDirectionKind.upAndDown"/>
    </cim:OperationalLimitType>
    <nc:CurrentLimit rdf:ID="_current-limit">
        <cim:IdentifiedObject.mRID>current-limit</cim:IdentifiedObject.mRID>
        <cim:IdentifiedObject.name>Current limit</cim:IdentifiedObject.name>
        <cim:IdentifiedObject.description>Example of current limit</cim:IdentifiedObject.description>
        <cim:OperationalLimit.OperationalLimitType rdf:resource="#_operational-limit-type"/>
        <cim:OperationalLimit.OperationalLimitSet rdf:resource="#_operational-limit-set"/>
        <nc:CurrentLimit.value>100.0</nc:CurrentLimit.value>
    </nc:CurrentLimit>
    ...
</rdf:RDF>
```

### AngleCNEC {#angle-cnec}

The CNEC is an [AngleCNEC](json#angle-cnecs) if its associated `OperationalLimit` is a `VoltageAngleLimit` which can be
found in the **ER**
profile.

```xml
<!-- ER Profile -->
<rdf:RDF>
    ...
    <cim:OperationalLimitSet rdf:ID="_operational-limit-set">
        <cim:IdentifiedObject.mRID>operational-limit-set</cim:IdentifiedObject.mRID>
        <cim:IdentifiedObject.name>Operational limit set</cim:IdentifiedObject.name>
        <cim:IdentifiedObject.description>Example of operational limit set</cim:IdentifiedObject.description>
        <cim:OperationalLimitSet.Terminal rdf:resource="#_terminal-2"/>
    </cim:OperationalLimitSet>
    <cim:OperationalLimitType rdf:ID="_operational-limit-type">
        <cim:IdentifiedObject.mRID>operational-limit-type</cim:IdentifiedObject.mRID>
        <cim:IdentifiedObject.name>Operational limit type</cim:IdentifiedObject.name>
        <cim:IdentifiedObject.description>Example of operational limit type</cim:IdentifiedObject.description>
        <cim:OperationalLimitType.direction rdf:resource="http://entsoe.eu/ns/nc#RelativeDirectionKind.upAndDown"/>
    </cim:OperationalLimitType>
    <nc:VoltageAngleLimit rdf:ID="_voltage-angle-limit">
        <cim:IdentifiedObject.mRID>voltage-angle-limit</cim:IdentifiedObject.mRID>
        <cim:IdentifiedObject.name>Voltage angle limit</cim:IdentifiedObject.name>
        <cim:IdentifiedObject.description>Example of voltage angle limit</cim:IdentifiedObject.description>
        <cim:OperationalLimit.OperationalLimitType rdf:resource="#_operational-limit-type"/>
        <cim:OperationalLimit.OperationalLimitSet rdf:resource="#_operational-limit-set"/>
        <nc:VoltageAngleLimit.normalValue>100.0</nc:VoltageAngleLimit.normalValue>
        <nc:VoltageAngleLimit.isFlowToRefTerminal>true</nc:VoltageAngleLimit.isFlowToRefTerminal>
        <nc:VoltageAngleLimit.AngleReferenceTerminal rdf:resource="#_terminal-1"/>
    </nc:VoltageAngleLimit>
    ...
</rdf:RDF>
```

### VoltageCNEC {#voltage-cnec}

The CNEC is a [VoltageCNEC](json#voltage-cnecs) if its associated `OperationalLimit` is a `VoltageLimit` which can be
found in the **EQ**
profile (CGMES file).

```xml
<!-- EQ (CGMES) Profile -->
<rdf:RDF>
    ...
    <cim:OperationalLimitSet rdf:ID="_operational-limit-set">
        <cim:IdentifiedObject.mRID>operational-limit-set</cim:IdentifiedObject.mRID>
        <cim:IdentifiedObject.name>Operational limit set</cim:IdentifiedObject.name>
        <cim:IdentifiedObject.description>Example of operational limit set</cim:IdentifiedObject.description>
        <cim:OperationalLimitSet.Terminal rdf:resource="#_terminal"/>
    </cim:OperationalLimitSet>
    <cim:OperationalLimitType rdf:ID="_operational-limit-type">
        <cim:IdentifiedObject.mRID>operational-limit-type</cim:IdentifiedObject.mRID>
        <cim:IdentifiedObject.name>Operational limit type</cim:IdentifiedObject.name>
        <cim:IdentifiedObject.description>Example of operational limit type</cim:IdentifiedObject.description>
        <cim:OperationalLimitType.direction rdf:resource="http://entsoe.eu/ns/nc#RelativeDirectionKind.upAndDown"/>
    </cim:OperationalLimitType>
    <nc:VoltageLimit rdf:ID="voltage-limit">
        <cim:IdentifiedObject.mRID>voltage-limit</cim:IdentifiedObject.mRID>
        <cim:IdentifiedObject.name>Voltage limit</cim:IdentifiedObject.name>
        <cim:IdentifiedObject.description>Example of voltage limit</cim:IdentifiedObject.description>
        <cim:OperationalLimit.OperationalLimitType rdf:resource="#_operational-limit-type"/>
        <cim:OperationalLimit.OperationalLimitSet rdf:resource="#_operational-limit-set"/>
        <nc:VoltageLimit.value>100.0</nc:VoltageLimit.value>
    </nc:VoltageLimit>
    ...
</rdf:RDF>
```

## Remedial Actions {#remedial-actions}

The [remedial actions](json#remedial-actions) are described in the **RA** profile. The most general way to describe a
remedial action is with a `GridStateAlterationRemedialAction` object that bears the identifier, name, operator, speed
and instant of the remedial action.

```xml
<!-- RA Profile -->
<rdf:RDF>
    ...
    <nc:GridStateAlterationRemedialAction rdf:ID="_remedial-action">
        <cim:IdentifiedObject.mRID>remedial-action</cim:IdentifiedObject.mRID>
        <cim:IdentifiedObject.name>RA</cim:IdentifiedObject.name>
        <cim:IdentifiedObject.description>Example of RA</cim:IdentifiedObject.description>
        <nc:RemedialAction.normalAvailable>true</nc:RemedialAction.normalAvailable>
        <nc:RemedialAction.kind rdf:resource="http://entsoe.eu/ns/nc#RemedialActionKind.preventive"/>
        <nc:RemedialAction.timeToImplement>PT50S</nc:RemedialAction.timeToImplement>
    </nc:GridStateAlterationRemedialAction>
    ...
</rdf:RDF>
```

### PST Range Action {#pst-range-action}

A [PST range action](json#pst-range-action) is described by a `TapPositionAction` object which references its parent
remedial action (`GridStateAlterationRemedialAction`) and the PST affected by the action. This `TapPositionAction` is
itself referenced by one or two `StaticPropertyRange` objects which provide the numerical values for the minimum and/or
maximum reachable taps.

```xml
<!-- RA Profile -->
<rdf:RDF>
    ...
    <nc:TapPositionAction rdf:ID="_tap-position-action">
        <cim:IdentifiedObject.mRID>tap-position-action</cim:IdentifiedObject.mRID>
        <cim:IdentifiedObject.name>Tap position action</cim:IdentifiedObject.name>
        <cim:IdentifiedObject.description>Example of tap position action</cim:IdentifiedObject.description>
        <nc:GridStateAlteration.normalEnabled>true</nc:GridStateAlteration.normalEnabled>
        <nc:GridStateAlteration.GridStateAlterationRemedialAction rdf:resource="#_remedial-action"/>
        <nc:GridStateAlteration.PropertyReference
                rdf:resource="http://energy.referencedata.eu/PropertyReference/TapChanger.step"/>
        <nc:TapPositionAction.TapChanger rdf:resource="#_tap-changer"/>
    </nc:TapPositionAction>
    <nc:StaticPropertyRange rdf:ID="_static-property-range-for-tap-position-action-max">
        <cim:IdentifiedObject.mRID>static-property-range-for-tap-position-action-max</cim:IdentifiedObject.mRID>
        <cim:IdentifiedObject.name>Upper bound for tap position action</cim:IdentifiedObject.name>
        <nc:RangeConstraint.GridStateAlteration rdf:resource="#_tap-position-action"/>
        <nc:RangeConstraint.normalValue>7.0</nc:RangeConstraint.normalValue>
        <nc:RangeConstraint.direction rdf:resource="http://entsoe.eu/ns/nc#RelativeDirectionKind.up"/>
        <nc:RangeConstraint.valueKind rdf:resource="http://entsoe.eu/ns/nc#ValueOffsetKind.absolute"/>
        <nc:StaticPropertyRange.PropertyReference
                rdf:resource="http://energy.referencedata.eu/PropertyReference/TapChanger.step"/>
    </nc:StaticPropertyRange>
    <nc:StaticPropertyRange rdf:ID="_static-property-range-for-tap-position-action-min">
        <cim:IdentifiedObject.mRID>static-property-range-for-tap-position-action-min</cim:IdentifiedObject.mRID>
        <cim:IdentifiedObject.name>Lower bound for tap position action</cim:IdentifiedObject.name>
        <nc:RangeConstraint.GridStateAlteration rdf:resource="#_tap-position-action"/>
        <nc:RangeConstraint.normalValue>-7.0</nc:RangeConstraint.normalValue>
        <nc:RangeConstraint.direction rdf:resource="http://entsoe.eu/ns/nc#RelativeDirectionKind.down"/>
        <nc:RangeConstraint.valueKind rdf:resource="http://entsoe.eu/ns/nc#ValueOffsetKind.absolute"/>
        <nc:StaticPropertyRange.PropertyReference
                rdf:resource="http://energy.referencedata.eu/PropertyReference/TapChanger.step"/>
    </nc:StaticPropertyRange>
    ...
</rdf:RDF>
```

### Network Actions {#network-actions}

#### Topological Action {#topological-action}

A [topological action](json#network-actions) is described by a `TopologyAction` object which references its parent
remedial action (`GridStateAlterationRemedialAction`) and the switch affected by the action.

> ℹ️ Currently, topological actions are implemented such that they can only invert the state of the switch.

```xml
<!-- RA Profile -->
<rdf:RDF>
    ...
    <nc:TopologyAction rdf:ID="_topology-action">
        <cim:IdentifiedObject.mRID>topology-action</cim:IdentifiedObject.mRID>
        <cim:IdentifiedObject.name>Topology action</cim:IdentifiedObject.name>
        <cim:IdentifiedObject.description>Example of topology action</cim:IdentifiedObject.description>
        <nc:GridStateAlteration.normalEnabled>true</nc:GridStateAlteration.normalEnabled>
        <nc:GridStateAlteration.GridStateAlterationRemedialAction rdf:resource="#_remedial-action"/>
        <nc:GridStateAlteration.PropertyReference
                rdf:resource="http://energy.referencedata.eu/PropertyReference/Switch.open"/>
        <nc:TopologyAction.Switch rdf:resource="#_switch"/>
    </nc:TopologyAction>
    ...
</rdf:RDF>
```

#### Injection Set-point Action {#injection-set-point-action}

An [injection set-point action](json#network-actions) is described by a `SetPointAction` object which references its
parent remedial action (`GridStateAlterationRemedialAction`) and the network element affected by the action, and which
is itself referenced by a `StaticPropertyRange` object to provide the numerical value of the set-point. Currently, FARAO
handles three types of CSA set-point actions: the **rotating machine actions**, the **power electronics connection
actions** and the **shunt compensator modifications**. All three are handled similarly by FARAO but their respective
descriptions in the CSA profiles differ from one another.

{% capture case_RotatingMachineAction %}

A rotating machine action is described with a `RotatingMachineAction` object in the RA profile.

```xml
<!-- RA Profile -->
<rdf:RDF>
    ...
    <nc:RotatingMachineAction rdf:ID="_rotating-machine-action">
        <cim:IdentifiedObject.mRID>rotating-machine-action</cim:IdentifiedObject.mRID>
        <cim:IdentifiedObject.name>Rotating machine action</cim:IdentifiedObject.name>
        <cim:IdentifiedObject.description>Example of rotating machine action</cim:IdentifiedObject.description>
        <nc:GridStateAlteration.normalEnabled>true</nc:GridStateAlteration.normalEnabled>
        <nc:GridStateAlteration.GridStateAlterationRemedialAction rdf:resource="#_remedial-action"/>
        <nc:GridStateAlteration.PropertyReference
                rdf:resource="http://energy.referencedata.eu/PropertyReference/RotatingMachine.p"/>
        <nc:RotatingMachineAction.RotatingMachine rdf:resource="#_rotating-machine"/>
    </nc:RotatingMachineAction>
    <nc:StaticPropertyRange rdf:ID="_static-property-range-for-rotating-machine-action">
        <cim:IdentifiedObject.mRID>static-property-range-for-rotating-machine-action</cim:IdentifiedObject.mRID>
        <cim:IdentifiedObject.name>Set-point in MW</cim:IdentifiedObject.name>
        <nc:RangeConstraint.GridStateAlteration rdf:resource="#_rotating-machine-action"/>
        <nc:RangeConstraint.normalValue>100.0</nc:RangeConstraint.normalValue>
        <nc:RangeConstraint.direction rdf:resource="http://entsoe.eu/ns/nc#RelativeDirectionKind.none"/>
        <nc:RangeConstraint.valueKind rdf:resource="http://entsoe.eu/ns/nc#ValueOffsetKind.absolute"/>
        <nc:StaticPropertyRange.PropertyReference
                rdf:resource="http://energy.referencedata.eu/PropertyReference/RotatingMachine.p"/>
    </nc:StaticPropertyRange>
    ...
</rdf:RDF>
```

{% endcapture %}

{% capture case_PowerElectronicsConnectionAction %}

A power electronics connection action is described with a `PowerElectronicsConnectionAction` object in the RA profile.

```xml
<!-- RA Profile -->
<rdf:RDF>
    ...
    <nc:PowerElectronicsConnectionAction rdf:ID="_power-electronics-connection-action">
        <cim:IdentifiedObject.mRID>power-electronics-connection-action</cim:IdentifiedObject.mRID>
        <cim:IdentifiedObject.name>Power electronics connection action</cim:IdentifiedObject.name>
        <cim:IdentifiedObject.description>Example of power electronics connection action
        </cim:IdentifiedObject.description>
        <nc:GridStateAlteration.normalEnabled>true</nc:GridStateAlteration.normalEnabled>
        <nc:GridStateAlteration.GridStateAlterationRemedialAction rdf:resource="#_remedial-action"/>
        <nc:GridStateAlteration.PropertyReference
                rdf:resource="http://energy.referencedata.eu/PropertyReference/PowerElectronicsConnection.p"/>
        <nc:PowerElectronicsConnectionAction.PowerElectronicsConnection rdf:resource="#_power-electronics-connection"/>
    </nc:PowerElectronicsConnectionAction>
    <nc:StaticPropertyRange rdf:ID="_static-property-range-for-power-electronics-connection-action">
        <cim:IdentifiedObject.mRID>static-property-range-for-power-electronics-connection-action
        </cim:IdentifiedObject.mRID>
        <cim:IdentifiedObject.name>Set-point in MW</cim:IdentifiedObject.name>
        <nc:RangeConstraint.GridStateAlteration rdf:resource="#_power-electronics-connection-action"/>
        <nc:RangeConstraint.normalValue>75.0</nc:RangeConstraint.normalValue>
        <nc:RangeConstraint.direction rdf:resource="http://entsoe.eu/ns/nc#RelativeDirectionKind.none"/>
        <nc:RangeConstraint.valueKind rdf:resource="http://entsoe.eu/ns/nc#ValueOffsetKind.absolute"/>
        <nc:StaticPropertyRange.PropertyReference
                rdf:resource="http://energy.referencedata.eu/PropertyReference/PowerElectronicsConnection.p"/>
    </nc:StaticPropertyRange>
    ...
</rdf:RDF>
```

{% endcapture %}

{% capture case_ShuntCompensatorModification %}

A shunt compensator modification is described with a `ShuntCompensatorModification` object in the RA profile.

```xml
<!-- RA Profile -->
<rdf:RDF>
    ...
    <nc:ShuntCompensatorModification rdf:ID="_shunt-compensator-modification">
        <cim:IdentifiedObject.mRID>shunt-compensator-modification</cim:IdentifiedObject.mRID>
        <cim:IdentifiedObject.name>Shunt compensator modification</cim:IdentifiedObject.name>
        <cim:IdentifiedObject.description>Example of shunt compensator modification</cim:IdentifiedObject.description>
        <nc:GridStateAlteration.normalEnabled>true</nc:GridStateAlteration.normalEnabled>
        <nc:GridStateAlteration.GridStateAlterationRemedialAction rdf:resource="#_remedial-action"/>
        <nc:GridStateAlteration.PropertyReference
                rdf:resource="http://energy.referencedata.eu/PropertyReference/ShuntCompensator.sections"/>
        <nc:ShuntCompensatorModification.ShuntCompensator rdf:resource="#_shunt-compensator"/>
    </nc:ShuntCompensatorModification>
    <nc:StaticPropertyRange rdf:ID="_static-property-range-for-shunt-compensator-modification">
        <cim:IdentifiedObject.mRID>static-property-range-for-shunt-compensator-modification</cim:IdentifiedObject.mRID>
        <cim:IdentifiedObject.name>Set-point in SECTION_UNITS</cim:IdentifiedObject.name>
        <nc:RangeConstraint.GridStateAlteration rdf:resource="#_shunt-compensator-modification"/>
        <nc:RangeConstraint.normalValue>5.0</nc:RangeConstraint.normalValue>
        <nc:RangeConstraint.direction rdf:resource="http://entsoe.eu/ns/nc#RelativeDirectionKind.none"/>
        <nc:RangeConstraint.valueKind rdf:resource="http://entsoe.eu/ns/nc#ValueOffsetKind.absolute"/>
        <nc:StaticPropertyRange.PropertyReference
                rdf:resource="http://energy.referencedata.eu/PropertyReference/ShuntCompensator.sections"/>
    </nc:StaticPropertyRange>
    ...
</rdf:RDF>
```

{% endcapture %}

{% include /tabs.html id="CSA_Set-point_RA_tabs" tab1name="Rotating Machine Action"
tab1content=case_RotatingMachineAction tab2name="
Power Electronics Connection Action" tab2content=case_PowerElectronicsConnectionAction tab3name="
Shunt Compensator Modification" tab3content=case_ShuntCompensatorModification %}

### Usage Rules {#usage-rules}

#### OnInstant {#on-instant-usage-rule}

By default, if no additional information is included, the remedial action is imported with an **onInstant usage rule**
and an **AVAILABLE usage method**.

#### OnContingencyState {#on-contingency-state-usage-rule}

If the remedial action is linked to a contingency, its usage method is no longer onInstant and is now
**onContingencyState**. This link is created with a `ContingencyWithRemedialAction` object that bound together the
remedial action and the contingency.

```xml
<!-- RA Profile -->
<rdf:RDF>
    ...
    <nc:ContingencyWithRemedialAction rdf:ID="_contingency-with-remedial-action">
        <nc:ContingencyWithRemedialAction.mRID>contingency-with-remedial-action</nc:ContingencyWithRemedialAction.mRID>
        <nc:ContingencyWithRemedialAction.combinationConstraintKind
                rdf:resource="http://entsoe.eu/ns/nc#ElementCombinationConstraintKind.considered"/>
        <nc:ContingencyWithRemedialAction.RemedialAction rdf:resource="#_remedial-action"/>
        <nc:ContingencyWithRemedialAction.Contingency rdf:resource="#_contingency"/>
        <nc:ContingencyWithRemedialAction.normalEnabled>true</nc:ContingencyWithRemedialAction.normalEnabled>
    </nc:ContingencyWithRemedialAction>
    ...
</rdf:RDF>
```

The usage method depends on the value of the `combinationConstraintKind` field:

- if it is `considered`, the usage method is **AVAILABLE**;
- if it is `included`, the usage method is **FORCED**;
- if it is `excluded`, the usage method is **UNAVAILABLE** and an onInstant usage rule with an AVAILABLE usage method
  will be created for the remedial action

> ⚠️ **Cases with multiple `ContingencyWithRemedialActions` defined for the same remedial action**
>
> This case happens when several `ContingencyWithRemedialAction` objects link the same remedial action with different
> contingencies (with possibly different values of `combinationConstraintKind`).
>
> If there is at least one `excluded` contingency, then:
> - An **onInstant** usage rule is created for the remedial action at the curative instant with an **AVAILABLE** usage
    method
> - An **onContingencyState** usage rule is created for the remedial action with an **UNAVAILABLE** usage method for
    each `excluded` contingency
> - An **onContingencyState** usage rule is created for the remedial action with a **FORCED** usage method for
    each `included` contingency
>
> If there is no `excluded` contingency, then:
> - An **onContingencyState** usage rule is created for the remedial action with a **FORCED** usage method each
    the `included` contingency
> - An **onContingencyState** usage rule is created for the remedial action with an **AVAILABLE** usage method each
    the `considered` contingency

> ⛔ **Cases with different `combinationConstraintKind` values for the same remedial action-contingency couple**
>
> This case is illegal and will be discarded at the import.

#### OnConstraint {#on-constraint-usage-rule}

If the remedial action is linked to an assessed element (a CNEC), its usage method is no longer onInstant and is now
**onConstraint**. This link is created with a `AssessedElementWithRemedialAction` object that bound together the
assessed element and the contingency.

The type of onConstraint usage rule depends on the type of the CNEC the remedial action is bounded to:

- if it is a FlowCNEC, the usage rule is **onFlowConstraint**
- if it is an AngleCNEC, the usage rule is **onAngleConstraint**
- if it is a VoltageCNEC, the usage rule is **onVoltageConstraint**

```xml
<!-- AE Profile -->
<rdf:RDF>
    ...
    <nc:AssessedElementWithRemedialAction rdf:ID="_assessed-element-with-remedial-action">
        <nc:AssessedElementWithRemedialAction.mRID>assessed-element-with-remedial-action
        </nc:AssessedElementWithRemedialAction.mRID>
        <nc:AssessedElementWithRemedialAction.combinationConstraintKind
                rdf:resource="http://entsoe.eu/ns/nc#ElementCombinationConstraintKind.included"/>
        <nc:AssessedElementWithRemedialAction.AssessedElement rdf:resource="#_assessed-element"/>
        <nc:AssessedElementWithRemedialAction.RemedialAction rdf:resource="#_remedial-action"/>
        <nc:AssessedElementWithRemedialAction.normalEnabled>true</nc:AssessedElementWithRemedialAction.normalEnabled>
    </nc:AssessedElementWithRemedialAction>
    ...
</rdf:RDF>
```

The usage method depends on the value of the `combinationConstraintKind` field. If it is `considered`, the usage method
is **AVAILABLE** whereas the usage method is **FORCED** if the fields is `included`. Note that if
the `combinationConstraintKind` is `excluded` the remedial action cannot have an onConstraint usage rule for this very
CNEC.
