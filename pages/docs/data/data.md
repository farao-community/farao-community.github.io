---
layout: page
title: Business data
permalink: /docs/data/
hide: true
docu: true
docu-parent: Exchange formats
feature-img: "assets/img/Hans_Otto_Theater_Potsdam_-_fake_colors_cut.jpg"
tags: [Docs, Data]
---


### Network

The network data model used by FARAO toolbox is the PowSyBl IIDM format.
To get detailed information about the network model, please refer to [dedicated documentation](https://powsybl.github.io/docs/iidm/model)
on PowSyBl website.

### CRAC

CRAC (for "*Contingency list, Remedial Actions and additional Constraints*") are objects dedicated to define security
domain of the network object. They define contingencies to take into account in business
process, constraint to monitor and remedial actions available to get rid of potential
active constraints.

Please refer to the [dedicated documentation page](/docs/data/crac) to get more information about FARAO CRAC data model.

### GLSK

GLSK (for "*Generation and Load Shift Keys*") are objects dedicated to define scaling strategies
to simulate injections modification on network model.

### CNE

CNE (for "*Critical Network Elements*") are objects dedicated to store security analysis
and computation results from all business process. It defines actual state of monitored branches,
activated remedial actions, and more generally the security state of the associated network object.

It is tightly connected to the CRAC model, as it is the result of the security assessment
by a computation engine given CRAC security domain.  

CNE objects are not yet available in FARAO toolbox. Please refer to [FARAO roadmap](/roadmap) for information
about current implementation plan.
