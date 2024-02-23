---
layout: documentation
title: CORE CNE File
permalink: /docs/output-data/core-cne
hide: true
root-page: Documentation
docu-section: Output Data
docu-parent: Output Data
order: 3
feature-img: "assets/img/farao3.jpg"
tags: [Docs, Data]
summary-hmax: 2
see-also: |
    [CORE CNE export package](https://github.com/powsybl/powsybl-open-rao/tree/main/data/result-exporter/core-cne-exporter)
---

# Introduction {#introduction}
{% include_relative introduction.md %}

# The Java API {#java-api}
{% include_relative java-api.md %}  

# Contents of the CORE CNE file {#contents}
Here is an overview of the general structure of the CORE CNE document, detailed in the following sections: 
![CORE CNE general structure](/assets/img/core-cne-structure.png)

## Header {#header}
{% include_relative header.md %}  

## CNEC results {#cnec-results}
{% include_relative cnec-results.md %}  

## Remedial action results {#ra-results}
{% include_relative ra-results.md %}  
