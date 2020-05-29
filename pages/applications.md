---
layout: page
title: Operational applications
permalink: /applications/
feature-img: "assets/img/Hans_Otto_Theater_Potsdam_-_fake_colors_cut.jpg"
tags: [Docs]
---

## FARAO search-tree –minimum margin

#### Example of use cases : 

Flow based CORE Capacity Calculation operated by RCC


Based on a simulated Market Clearing point resulting for net positions forecast, FARAO will 
maximize the available margin on all CNECs while limiting the loopflows – all critical outages will be simulated and 
solved to ensure grid security.

Where no positive available margin can be ensured the set of available remedial actions, FARAO will reduce as much as 
possible the negative margin on CNEC.


## FARAO search-tree - positive margin stop criterion

#### Exemple of use cases :
 
- For RCC - NTC Capacity calculation / Coordinated Security Analysis without costly remedial actions.

To calculate the maximum NTC, FARAO increases progressively the market exchanges (based on GLSK – Generation&Load Shift 
Key from TSOs). As long as the objective function is null, it means there is a set of remedial actions that avoid any 
violations of operational limits on CNEC.

Max NTC is the last and highest value of market exchanges where the objective function is positive.

Where required by methodologies approved, sequential optimization of non-costly remedial actions (FARAO search-tree 
« positive margin ») and costly remedial actions (FARAO closed optimization) is possible. 

- For TSOs - Local validation of 70% margin required by Regulation EU 2019/943, Article 8 (Clean Energy Package). 
This allows TSOs to perform an optimized security analysis in order to confirm the operational feasibility of 70% margin.

## FARAO closed optimization

FARAO closed optimization has been initially designed to work with open source solver (CBC). However, where a process 
requires high computation performance, it is also compatible with licensed solver.

#### Exemple of use cases :

For RCC - Coordinated Security Analysis (sequential optimization of non-costly remedial actions and costly remedial actions). 

Yearly congestion costs due to the use of costly remedial actions reach millions or even billions of euros for some 
countries. All TSOs shall share the congestion costs resulting from the remedial actions optimization of the Coordinated 
Security Analysis, in accordance with the Regulation EU 2015/1222 (Capacity Allocation and Congestion Management), 
Article 74. Given the financial amounts at stake, the implementation of the methodology shall be as transparent as 
possible to limit any potential disputes and ease the auditability of the solution by regulatory authorities or external parties.

Being open source, FARAO allows any actor to check its specifications are properly implemented within the tool and 
to perform its own calculation where needed.