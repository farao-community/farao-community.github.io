---
layout: documentation
title: Platform configuration
permalink: /docs/parameters/itools-configuration
hide: true
root-page: Documentation
docu-section: Parameters
docu-parent: Parameters
order: 1
feature-img: "assets/img/farao3.jpg"
tags: [Docs, Parameters]
---

## Platform configuration

FARAO platform configuration is based on PowSyBl [configuration mechanism](https://www.powsybl.org/pages/documentation/user/configuration/).

Some PowSyBl modules are directly provided "as is"; their documentation is available on the PowSyBl
website. For convenience purpose, they will still be listed here, with a direct link to their documentation

FARAO modules will have same configuration basis, but will be documented here.

## Standard modules list

Below are listed platform configuration modules for plugins provided with FARAO standard bundle.

- [closed-optimisation-rao-parameters](closed-optimisation-rao-parameters.md): Parameters for closed optimisation
implementation of RAO interface. 
- [componentDefaultConfig](component-default-config.md): Configuration of components to be used as implementation
plugin for computation engines.
- [computation-local](https://www.powsybl.org/pages/documentation/user/configuration/computation-local.html): Configuration of
local computation manager, for running computation engines locally.
- [default-computation-manager](https://www.powsybl.org/pages/documentation/user/configuration/default-computation-manager.html):
Configuration of computation managers to be used by default.
- [load-flow-default-parameters](https://www.powsybl.org/pages/documentation/simulation/powerflow/#available-parameters): Common
parameters for LoadFlow computation services.
- [local-app-file-system](https://www.powsybl.org/pages/documentation/user/configuration/local-app-file-system.html): Configuration
of local filesytem implementation for local file usage in FARAO-GSE. 
- [mapdb-app-file-system](https://www.powsybl.org/pages/documentation/user/configuration/mapdb-app-file-system.html): Configuration
of MapDB filesytem implementation for file storage in FARAO-GSE.
- [proxy](proxy.md): Proxy settings configuration
- [sensitivity-default-parameters]():
Common parameters for sensitivity calculation interface.

## Hades2 related modules

Below are listed platform configuration modules for plugins related to [Hades2 loadflow engine](https://rte-france.github.io/hades2/index.html),
available as freeware.

- [hades2](https://rte-france.github.io/hades2/features/loadflow.html): Hades2 software general configuration
- [hades2-default-parameters](https://www.powsybl.org/pages/documentation/simulation/powerflow/hades2.html#specific-parameters): Parameters for Hades2 implementation of LoadFlow interface.
- [hades2-defaut-sensitivity-parameters](): Parameters for Hades2 implementation of sensitivity calculation interface.
