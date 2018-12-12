---
layout: page
title: GSE
permalink: /docs/gse/
hide: true
feature-img: "assets/img/Hans_Otto_Theater_Potsdam_-_fake_colors_cut.jpg"
tags: [Docs]
---

## What FARAO-GSE is

FARAO-GSE is an experimentation GUI dedicated to create, launch and analyze
results of FARAO computation engines. It is developed based on [PowSyBl-GSE](https://github.com/powsybl/powsybl-gse) framework,
that already provides built-in capabilities useful for experimentation purpose:

- Network importers (UCTE, CGMES, XIIDM)
- Network explorer
- Network visualizer
- Network modification by scripts

These features may be extended in the future by the contribution of many projects
in [PowSyBl](http://www.powsybl.com) environment.

Beside built-in features provided by [PowSyBl](http://www.powsybl.com) framework,
extensions are provided by FARAO team to integrate FARAO data importers and visualizers
(CRAC, GLSK, ...), and computation cores integration (Flowbased, RAO, ...).

For more information about how to use FARAO-GSE, please refer to the [installation guide](installation.md) and/or the [user guide](user-guide.md).

## What FARAO-GSE is not

FARAO-GSE is not built as a production environment. The core of FARAO project is the development of
remedial actions optimisation engines, and FARAO-GSE is only a mean to give access to the end user
to a tool allowing to easily create, launch and analyse the results of the optimisation engine.

This means that any integration of FARAO computation engine in a production process
may use other means, such as REST web-services, are module integration in a production platform.
