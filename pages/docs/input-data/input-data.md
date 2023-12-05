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

## Network
The network data model used by FARAO toolbox is the PowSyBl IIDM format.
To get detailed information about the network model, please refer to [dedicated documentation](https://www.powsybl.org/pages/documentation/index.html#grid-model)
on PowSyBl website.

Network exchange formats supported (as part of PowSyBl project):
- CGMES
- UCTE
- XIIDM
- ...

## CRAC
CRAC (for "***C**ontingency list, **R**emedial **A**ctions and additional **C**onstraints*") are objects dedicated to
define security domain of the network object. They define contingencies to take into account in business process,
constraints to monitor and remedial actions available to get rid of potential active constraints.

Based on our experience on different capacity calculation regions, the format for IGM/CGM (either UCTE/CGMES) or
CRAC/CBCORA (Critical Branch/Critical Outages/Remedial Actions) are not yet harmonized over Europe.  
To limit dependencies with input/output formats, FARAO uses its own [CRAC format](crac/json) in order to be easily
adaptable for any process.

Please refer to the [dedicated CRAC section](/docs/input-data/crac/crac) for more information.

CRAC exchange formats actually supported by FARAO:
- [JSON CRAC](/docs/input-data/crac/json) (FARAO-specific)
- [FlowBasedConstraint CRAC](/docs/input-data/crac/fbconstraint) (used in CORE region)
- [CSE CRAC](/docs/input-data/crac/cse) (used in CSE region)
- [CIM CRAC](/docs/input-data/crac/cim) (used in SWE region)

## GLSK

GLSK (for "*Generation and Load Shift Keys*") are objects dedicated to define scaling strategies to simulate injections
modification on network model.

Please refer to the [dedicated documentation page](/docs/input-data/glsk) to get more information about GLSK data model, 
as well as to the dedicated [PowSyBl repository](https://github.com/powsybl/powsybl-entsoe).

GLSK exchange formats supported (as part of PowSyBl project):
- [CIM GLSK](/docs/input-data/glsk/cim)
- [CSE GLSK](/docs/input-data/glsk/cse)
- [UCTE GLSK](/docs/input-data/glsk/ucte)



