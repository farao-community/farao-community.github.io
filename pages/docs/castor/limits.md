---
layout: documentation
title: CASTOR limits
permalink: /docs/engine/ra-optimisation/limits
hide: true
root-page: Documentation
docu-section: CASTOR
docu-parent: CASTOR
order: 7
feature-img: "assets/img/farao3.jpg"
tags: [Docs, CASTOR]
summary-hmax: 0
---

The RAO has the following limit -this is a non exhaustive list:

⮕ Optimization is performed on perimeters, not on the whole problem. By definition, the results will be non optimal as a result of the missing extra-perimeter information.  <br>
⮕ Non linear behaviors can be encountered especially in AC mode, for instance with non linear sensitivity computations on PSTs leading to convergence issues during search tree computation. <br>
⮕ The RAO does not handle inter-temporal constraints. <br>
⮕ The RAO only handles non costly remedial actions. <br>
