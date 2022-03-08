---
layout: documentation
title: Input Data
permalink: /docs/input-data/
hide: true
root-page: Documentation
docu-section: none
docu-parent: none
order: 2
feature-img: "assets/img/farao3.jpg"
tags: [Docs, Data]
---

# Independent from I/O format

Based on our experience on different capacity calculation regions, the format for IGM/CGM (either UCTE/CGMES) 
or CRAC/CBCORA (Critical Branch/Critical Outages/Remedial Actions) are not yet harmonized over Europe. 
To limit dependencies with input/output format, FARAO uses its own CRAC format in order to be
easily adaptable for any projects. 

The internal CRAC format is in Json. It is generic and can handle specificities of different regions.
Creating a Json CRAC is easy through the usage of our API, and multiple native CRAC files can already be converted into Json format (FbConstraint, CSE-CRAC, CIM-CRAC).

The limitations on critical network elements supported by the internal CRAC format are the ones listed here below.

| Physical parameter |    Unit(s)  |
|--------------------|-------------|
|   Angle (soon...)  |Degree or Rad|
|        Flow        |  MW or A    |
|  Voltage (soon...) |     kV      |

By implementing these types of limitations, FARAO is able to manage most of the operational security limits 
defined in the network codes (Article 2, Regulation 2015/1222 CACM).

### Network

The network data model used by FARAO toolbox is the PowSyBl IIDM format.
To get detailed information about the network model, please refer to [dedicated documentation](https://powsybl.github.io/docs/iidm/model)
on PowSyBl website.

#### Network exchange formats supported (as part of PowSyBl project):

- CGMES
- UCTE
- IIDM

### CRAC

CRAC (for "***C**ontingency list, **R**emedial **A**ctions and additional **C**onstraints*") are objects dedicated to define security
domain of the network object. They define contingencies to take into account in business
process, constraint to monitor and remedial actions available to get rid of potential
active constraints.

Please refer to the [dedicated documentation page](/docs/data/crac) to get more information about FARAO CRAC data model.

#### CRAC exchange formats supported:

- [JSON CRAC](/docs/data/crac/json) (FARAO-specific)
- [FlowBasedConstraint CRAC](/docs/data/crac/fbconstraint) (used in CORE region)
- [CSE CRAC](/docs/data/crac/cse) (used in CSE region)
- [CIM CRAC](/docs/data/crac/cim) (used in SWE region)

### GLSK

GLSK (for "*Generation and Load Shift Keys*") are objects dedicated to define scaling strategies
to simulate injections modification on network model.

#### GLSK exchange formats supported:

- CIM GLSK
- JSON GLSK
- UCT GLSK



