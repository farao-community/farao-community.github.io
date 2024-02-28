---
layout: documentation
title: Internal json CRAC format
permalink: /docs/input-data/crac/json
hide: true
root-page: Documentation
docu-section: Input Data
docu-parent: CRAC
order: 3
tags: [Docs, Data, CRAC]
summary-hmax: 3
see-also: |
    [CRAC import](import)
---

## Introduction {#introduction}
The name CRAC is a standard denomination defined by the ENTSO-E which means: **C**ontingency list, **R**emedial 
**A**ctions, and additional **C**onstraints.

In other words, it gathers the following information:
- critical outages,
- critical network elements,
- and remedial actions.

It is typically used in European coordinated processes. It enables, for a given geographical region, to define the 
network elements that might be critical after specific outages, and the remedial actions that might help to manage them.  

**A CRAC object model has been designed in FARAO** in order to store all the aforementioned information. This page aims to present:
- the content and the organization of the data present in the FARAO CRAC object model,
- how a FARAO CRAC object can be built,
  - using the java API,
  - or using the FARAO internal Json CRAC format.

Note that other pages of this documentation describe how the FARAO CRAC object model can be built with other standard 
CRAC formats, such as the [FlowBasedConstraint](fbconstraint) format, the [CSE](cse) Format, and the [CIM](cim) format.

## Full CRAC examples {#full-crac-examples}
Example of complete CRACs are given below

{% capture t1_java %}
The creation of a small CRAC is for instance made in this test class of farao-core repository:
<a href="
https://github.com/powsybl/powsybl-open-rao/blob/main/data/crac/crac-impl/src/test/java/com/powsybl/openrao/data/cracimpl/utils/CommonCracCreation.java"> 
example on github
</a>
{% endcapture %}
{% capture t1_json %}
An example of a small CRAC in the json internal format of FARAO is given below:
<a href="
https://github.com/powsybl/powsybl-open-rao/blob/main/ra-optimisation/search-tree-rao/src/test/resources/crac/small-crac-with-network-actions.json"> 
example on github
</a>
{% endcapture %}
{% include /tabs.html id="t1" tab1name="JAVA creation API" tab1content=t1_java tab2name="JSON file" tab2content=t1_json %}
  
The following paragraphs of this page explain, step by step, the content of these examples.

> **KEY**  
> 🔴 marks a **mandatory** field  
> ⚪ marks an **optional** field  
> 🔵 marks a field that can be **mandatory in some cases**  
> ⭐ marks a field that must be **unique** in the CRAC  

## Network elements {#network-elements}
{% include_relative network-elements.md %}  

## Contingencies {#contingencies}
{% include_relative contingencies.md %}  

## Instants and States {#instants-states}
{% include_relative instants-states.md %}  

## RAs usage limitations {#ra-usage-limits}
{% include_relative ra-usage-limits.md %}

## CNECs {#cnecs}
{% include_relative cnecs.md %}  

## Remedial actions and usages rules {#remedial-actions}
{% include_relative remedial-actions.md %}  

## Network Actions {#network-actions}
{% include_relative network-actions.md %}  

## Range Actions {#range-actions}
{% include_relative range-actions.md %}  
