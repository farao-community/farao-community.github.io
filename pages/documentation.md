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

- [Business data](/docs/data/data.md) modelisation - providing a java modelisation of all the business objects
for power systems coordinated capacity calculation and security analysis projects.
- [Computation engines](/docs/engine/index.md) - providing open interface and efficient implementation of standard
tools for supporting capacity calculation projects.
- Exchange standards interface - providing importers and exporters to support ENTSOE exchange
data interface in projects implementation.    

By extending the [PowSyBl](http://www.powsybl.org) framework, FARAO aims at providing an open, transparent,
and extandable implementation of the tools used for an efficient usage of the electricity transport
and distribution system.

FARAO toolbox also includes a study tool named [FARAO-GSE](https://github.com/farao-community/farao-gse)
for tools demonstration purpose.


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
