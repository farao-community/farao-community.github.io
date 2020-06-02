---
layout: page
title: Exchange formats
permalink: /docs/format/
hide: true
docu: true
docu-parent: none
feature-img: "assets/img/Hans_Otto_Theater_Potsdam_-_fake_colors_cut.jpg"
tags: [Docs]
---

# Independent from I/O format

Based on our experience on different capacity calculation regions, the format for IGM/CGM (either UCTE/CGMES) 
or CRAC/CBCORA (Critical Branch/Critical Outages/Remedial Actions) are not yet harmonized over Europe. 
To limit dependencies with input/output format, FARAO uses its own CRAC format in order to be
easily adaptable for any projects. 

The internal CRAC format is in Json. It can import, by an API, fixed network data from CGM such as Imax. 
This synchronization with CGM can be configured, activated/deactivated, depending, for instance, 
on which values shall prevail (those from CRAC or from CGM).

The limitations on critical network elements supported by the internal CRAC format are the ones listed here below.

| Physical parameter |    Unit(s)  |
|--------------------|-------------|
|   Angle (soon...)  |Degree or Rad|
|        Flow        |  MW or A    |
|  Voltage (soon...) |     kV      |

By implementing these types of limitations, FARAO is able to manage most of the operational security limits 
defined in the network codes (Article 2, Regulation 2015/1222 CACM).

#### Network exchange formats supported:

- CGMES
- UCTE
- IIDM

#### GLSK exchange formats supported:

- CIM GLSK
- JSON GLSK
- UCT GLSK

#### CRAC exchange formats supported:

- JSON CRAC

#### CNE exchange formats supported:

Coming soon...
