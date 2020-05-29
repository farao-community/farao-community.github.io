---
layout: page
title: FARAO platform configuration
permalink: /docs/configuration
hide: true
docu: true
docu-parent: none
feature-img: "assets/img/Hans_Otto_Theater_Potsdam_-_fake_colors_cut.jpg"
tags: [Docs]
---

## Platform configuration

FARAO platform configuration is based on PowSyBl [configuration mechanism](https://powsybl.github.io/docs/configuration/modules/).

Some PowSyBl modules are directly provided "as it is", and their documentation will be available on PowSyBl
website. For convenience purpose, they will still be listed here, with direct link to their documentation

FARAO modules will have same configuration basis, but will be documented here.

## Standard modules list

Below are listed platform configuration modules for plugins provided with FARAO standard bundle.

- [closed-optimisation-rao-parameters](closed-optimisation-rao-parameters.md): Parameters for closed optimisation
implementation of RAO interface. 
- [componentDefaultConfig](component-default-config.md): Configuration of components to be used as implementation
plugin for computation engines.
- [computation-local](https://powsybl.github.io/docs/configuration/modules/computation-local.html): Configuration of
local computation manager, for running computation engines locally.
- [default-computation-manager](https://powsybl.github.io/docs/configuration/modules/default-computation-manager.html):
Configuration of computation managers to be used by default.
- [load-flow-default-parameters](https://powsybl.github.io/docs/configuration/modules/load-flow-default-parameters.html): Common
parameters for LoadFlow computation services.
- [local-app-file-system](https://powsybl.github.io/docs/configuration/modules/local-app-file-system.html): Configuration
of local filesytem implementation for local file usage in FARAO-GSE. 
- [mapdb-app-file-system](https://powsybl.github.io/docs/configuration/modules/mapdb-app-file-system.html): Configuration
of MapDB filesytem implementation for file storage in FARAO-GSE.
- [proxy](proxy.md): Proxy settings configuration
- [sensitivity-default-parameters](https://powsybl.github.io/docs/configuration/modules/sensitivity-default-parameters.html):
Common parameters for sensitivity calculation interface.

## Hades2 related modules

Below are listed platform configuration modules for plugins related to [Hades2 loadflow engine](https://rte-france.github.io/hades2/index.html),
available as freeware.

- [hades2](https://rte-france.github.io/hades2/features/loadflow.html): Hades2 software general configuration
- [hades2-default-parameters](): Parameters for Hades2 implementation of LoadFlow interface.
- [hades2-defaut-sensitivity-parameters](): Parameters for Hades2 implementation of sensitivity calculation interface.
