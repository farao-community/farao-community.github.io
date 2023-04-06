---
layout: documentation
title: Virtual hubs
permalink: /docs/input-data/virtual-hubs
hide: true
root-page: Documentation
docu-section: Input Data
docu-parent: Input Data
order: 4
feature-img: "assets/img/farao3.jpg"
tags: [Docs, Data]
summary-hmax: 0
---

In FARAO, virtual hubs are used to compute loop-flows. Virtual hubs are one-node areas which should be considered as market areas when calculating loop-flows.

They are defined in a specific configuration file. For example :

~~~xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Configuration>
    <MarketAreas>
        <MarketArea Code="BE" Eic="10YBE----------2" MCParticipant="false"/>
        <MarketArea Code="ES" Eic="10YES-REE------0" MCParticipant="true"/>
        <MarketArea Code="FR" Eic="10YFR-RTE------C" MCParticipant="true"/>
    </MarketAreas>
    <VirtualHubs>
        <VirtualHub Eic="17Y000000930814J" Code="Virtual_Hub_FR_1" RelatedMA="FR" MCParticipant="true" NodeName="XFR_ES11"/>
        <VirtualHub Eic="17Y000000930814E" Code="Virtual_Hub_FR_2" RelatedMA="FR" MCParticipant="false" NodeName="XFR_BE11"/>
        <VirtualHub Eic="17Y000000930808E" Code="Virtual_Hub_ES_FR" RelatedMA="ES" MCParticipant="true" NodeName="EFR_ES11"/>
        <VirtualHub Eic="17Y0000009308082" Code="Virtual_Hub_ES_MA" RelatedMA="ES" MCParticipant="false" NodeName="XMA_ES11"/>
    </VirtualHubs>
</Configuration>

~~~

A virtual hub therefore has : 
- an EIC code (e.g. 17Y000000930814J) 
- and an associated UCTE node (e.g. XFR_ES11).

The EIC code can be also found in the RefProg file. The virtual hub is indeed referenced in the refProg file with a given associated net position.
The EIC code can however not be found in the GLSK file, the GLSK of the virtual hub is implicitly a factor of 100% on the unique UCTE node of the hub.


