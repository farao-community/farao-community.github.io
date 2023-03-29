---
layout: documentation
title: SWE CNE File
permalink: /docs/output-data/swe-cne
hide: true
root-page: Documentation
docu-section: Output Data
docu-parent: Output Data
order: 4
feature-img: "assets/img/farao3.jpg"
tags: [Docs, Data]
summary-hmax: 2
see-also: |
    [SWE CNE export package](https://github.com/farao-community/farao-core/tree/master/data/result-exporter/swe-cne-exporter)
---

# Introduction {#introduction}
{% include_relative introduction.md %}  

# The Java API {#java-api}
{% include_relative java-api.md %}  

# Contents of the SWE CNE file {#contents}
Here is an overview of the general structure of the SWE CNE document, detailed in the following sections:
![SWE CNE general structure](/assets/img/swe-cne-structure.png)

## Header {#header}
{% include_relative header.md %}  

## Remedial action results {#ra-results}
{% include_relative ra-results.md %}  

## CNEC results {#cnec-results}
{% include_relative cnec-results.md %}  

## Overall status {#status}
{% include_relative status.md %}