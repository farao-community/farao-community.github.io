---
layout: page
title: Documentation
permalink: /docs/
feature-img: "assets/img/Hans_Otto_Theater_Potsdam_-_fake_colors_cut.jpg"
tags: [Docs]
---

## What is FARAO

FARAO stands for "*Fully Autonomous Remedial Actions Optimisation*". It is an open-source
toolbox that aims at providing a modular engine for remedial actions optimisation.

FARAO is a [PowSyBl](http://www.powsybl.org) based toolbox that provides software
solutions for power systems coordinated capacity calculation and security analysis projects.
It is published on [GitHub](https://github.com/farao-community) under the [Mozilla Public License 2.0](https://www.mozilla.org/en-US/MPL/2.0/).

## Functional overview

[FARAO toolbox](https://github.com/farao-community/farao-core) functional perimeter is declined following three main development axis:

- Business data modelisation - providing a java modelisation of all the business objects
for power systems coordinated capacity calculation and security analysis projects.
- Computation engines - providing open interface and efficient implementation of standard
tools for supporting capacity calculation projects.
- Exchange standards interface - providing importers and exporters to support ENTSOE exchange
data interface in projects implementation.    

By extending the [PowSyBl](http://www.powsybl.org) framework, FARAO aims at providing an open, transparent,
and extandable implementation of the tools used for an efficient usage of the electricity transport
and distribution system.

FARAO toolbox also includes a study tool named [FARAO-GSE](https://github.com/farao-community/farao-gse)
for tools demonstration purpose.

### Business data

#### Network

The network data model used by FARAO toolbox is the PowSyBl IIDM format.
To get detailed information about the network model, please refer to [dedicated documentation](https://powsybl.github.io/docs/iidm/model)
on PowSyBl website.

#### GLSK

GLSK (for "*Generation and Load Shift Keys*") are objects dedicated to define scaling strategies
to simulate injections modification on network model.

GLSK objects are not yet available in FARAO toolbox. Please refer to [FARAO roadmap](./roadmap.md) for information
about current implementation plan.

#### CRAC

CRAC (for "*Contingency list, Remedial Actions and additional Constraints*") are objects dedicated to define security
domain of the network object. They define contingencies to take into account in business
process, constraint to monitor and remedial actions available to get rid of potential
active constraints.

Please refer to the [dedicated documentation page](docs/data/crac/index.md) to get more information about FARAO CRAC
data model. 

#### CNE

CNE (for "*Critical Network Elements*") are objects dedicated to store security analysis
and computation results from all business process. It defines actual state of monitored branches,
activated remedial actions, and more generally the security state of the associated network object.

It is tightly connected to the CRAC model, as it is the result of the security assessment
by a computation engine given CRAC security domain.  

CNE objects are not yet available in FARAO toolbox. Please refer to [FARAO roadmap](./roadmap.md) for information
about current implementation plan.

### Computation engines

FARAO standard distribution comes with following computation engines embedded.

#### Load flow

Load flow (or power flow) calculation is provided by PowSyBl framework.

FARAO uses the load flow interface, and do not enforce any specific implementation.
However, [Hades freeware](https://rte-france.github.io/hades2/index.html) implementation of load flow interface
is recommended as it is the only one currently used in FARAO development validation.

Please refer to the Hades website for more information about how to get it.

#### Sensitivity calculation

Sensitivity calculation is also provided by PowSyBl framework.

FARAO uses the sensitivity calculation interface, and do not enforce any specific implementation.
However, as for load flow implementation, [Hades freeware](https://rte-france.github.io/hades2/index.html)
also integrate a sensitivity calculation engine, and is recommended as it is the only one currently used
in FARAO development validation.

Please refer to the Hades website for more information about how to get it.

#### Remedial action optimiser

[Remedial actions optimisation](docs/engine/ra-optimisation/index.md) aims at selecting the best remedial actions
for operating the network the most efficiently, ensuring security of supply.

FARAO provides a standard interface for remedial actions optimisation modules.
Moreover, it plans to provide two implementations of RAO interface, that will provide two complementary ways of solving,
this difficult problem:
- ***Closed optimisation RAO*** engine: a modular approach of building mixed-integer optimisation problems based on network
and CRAC objects. A first prototype is currently available in FARAO. Please refer to the
[dedicated documentation page](docs/engine/ra-optimisation/closed-optimisation-rao/index.md) to get more information
about closed optimisation RAO module.
- ***Branch & Bound RAO*** engine: an efficient implementation of RAO interface for dealing with combinatorial problem of
remedial actions optimisation mixing topological actions, and combined preventive/curative optimisation. This module
is not yet available in FARAO toolbox. Please refer to [FARAO roadmap](./roadmap.md) for information about current
implementation plan.

#### Flowbased

Flowbased calculation is the official target for all capacity calculation in Europe.

FARAO toolbox will provide a standard interface for Flowbased calculation feature.
It aims at providing a full CGMES compliant Flowbased calculation implementation.

It is not yet available in FARAO toolbox. Please refer to [FARAO roadmap](./roadmap.md) for information
about current implementation plan.

### Exchange formats

#### Network exchange formats

- CGMES
- UCTE
- IIDM

#### GLSK exchange formats

- CIM GLSK
- JSON GLSK

#### CRAC exchange formats

- CIM CRAC
- JSON CRAC
- XLSX CRAC

#### CNE exchange formats

- CIM CNE
- JSON CNE

### FARAO-GSE: demonstration user interface

A desktop interface has been created, based on PowSyBl GSE framework called FARAO-GSE.

This graphical user interface is only provided for demonstration purpose. Please refer to the
[dedicated documentation page](docs/gse/index.md) to get more information about GSE module.
