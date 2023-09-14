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

### Presentation {#presentation}

For the CSA process, the CRAC data is split over multiple XML files called **CSA profiles**, each one with its own
specific purpose, and which were inspired by the CGM format. The objects in the different CSA profiles reference one
another using **mRID** links (UUID format) which makes it possible to separate the information among several distinct
files.

### Header overview {#header}

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

### Contingencies {#contingencies}

The [contingencies](json#contingencies) are described in the **CO** profiles. They can be represented by two types of
objects: `ExceptionalContingency` and  `OutOfRangeContingency`. The contingency is linked to the network element on which it can occur through a `ContingencyEquipment`.

**ExceptionalContingency**

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

**OutOfRangeContingency**

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


### CNECs {#cnecs}

### Remedial Actions {#remedial-actions}