---
layout: documentation
title: UCTE GLSK format
permalink: /docs/input-data/glsk/ucte
hide: true
root-page: Documentation
docu-section: Input Data
docu-parent: GLSK
order: 1
feature-img: "assets/img/farao3.jpg"
tags: [Docs, Data]
---

GLSK in UCTE format are defined within XML files. The main tag of the document is **&lt;GSKDocument&gt;**.

### Header overview {#header}

~~~xml
<GSKDocument xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" DtdVersion="1" DtdRelease="0" xsi:noNamespaceSchemaLocation="gsk-document.xsd">
    <DocumentIdentification v="NAME"/>
    <DocumentVersion v="1"/>
    <DocumentType v="Z02"/>
    <ProcessType v="Z02"/>
    <SenderIdentification v="SENDER_EIC" codingScheme="A01"/>
    <SenderRole v="A36"/>
    <ReceiverIdentification v="RECEIVER_EIC" codingScheme="A01"/>
    <ReceiverRole v="A04"/>
    <CreationDateTime v="2017-10-30T09:27:21Z"/>
    <GSKTimeInterval v="2016-07-28T22:00Z/2016-07-29T22:00Z"/>
    <Domain v="REGION_EIC" codingScheme="A01"/>
    ...
</GSKDocument>
~~~

### GLSK Definition {#glsk-definition}

Proper GLSK are defined within the tag **&lt;GSKSeries&gt;**

~~~xml
<GSKSeries>
    <TimeSeriesIdentification v="1"/>
    <BusinessType v="Z02" share="50"/>
    <Area v="10YFR-RTE------C" codingScheme="A01"/>
    ...
</GSKSeries>
~~~

- The **&lt;Area&gt;** tag defines the geographical zone handled by the GLSK. codingScheme value at A01 declares that is an EIC code, it will be the case most of the time but other types of code could be used to describe the area.
- The **&lt;BusinessType&gt;** tag can have two values here: **Z02** means it is a GSK and **Z05** means it is an LSK. The share value represents the proportion of this series for the whole area. For example if the RTE area is defined in two different series – one with Z02 share=0.3 and one with Z05 share=0.7 – and that we want to apply a shift of 1000MW in RTE zone, we will apply a shift of 300MW on the generators and a shift of 700MW on the loads.  

So according to this format to embrace all the elements of an area we have to **combine potentially 2 series so that GSK and LSK can be gathered**.

There are several ways to define the set of generators and loads available in the GLSK. As we will se all the blocks of GLSK definition have a common tag **&lt;GSK_Name&gt;** that gives a human readable name to the GLSK.

#### Automatic GLSK {#auto-glsk}
GLSK in UCTE format can be defined with a list of UCTE nodes to consider in a **&lt;AutoGSK_Block&gt;**. With this tag there is no need to define a factor associated to the node, it will be done as a proportional to target power GLSK as defined in [GLSK](/docs/input-data/glsk)

~~~xml
<AutoGSK_Block>
   <GSK_Name v="FR"/>
   <TimeInterval v="2016-07-28T22:00Z/2016-07-29T22:00Z"/>
   <AutoNodes>
      <NodeName v="FFR1AA1 "/>
   </AutoNodes>
   <AutoNodes>
      <NodeName v="FFR2AA1 "/>
   </AutoNodes>
</AutoGSK_Block>
~~~

#### Country GLSK {#country-glsk}
The **&lt;CountryGSK_Block&gt;** tag can be used to defined a GLSK without even defining an explicit list of nodes. It will be a proportional to target power GLSK as defined in [GLSK](/docs/input-data/glsk) defined on all the nodes of the area. The matching is done through the network meaning all the nodes in the network that belongs to the specified area are added to the GLSK.

`
⚠️ As it is currently implemented, this only works for areas that are countries. If the area is not a country the matching would not be done properly.
`

~~~xml
<CountryGSK_Block>
   <GSK_Name v="FR"/>
   <TimeInterval v="2016-07-28T22:00Z/2016-07-29T22:00Z"/>
</CountryGSK_Block>
~~~

#### Manual GLSK {#manual-glsk}
The **&lt;ManualGSK_Block&gt;** tag can be used to define manually all the UCTE nodes associated with their weight within the GLSK.

~~~xml
<ManualGSK_Block>
    <GSK_Name v="FR"/>
    <TimeInterval v="2016-07-28T22:00Z/2016-07-29T22:00Z"/>
    <ManualNodes>
        <NodeName v="FFR2AA1 "/>
        <Factor v="0.3"/>
    </ManualNodes>
    <ManualNodes>
        <NodeName v="FFR1AA1 "/>
        <Factor v="0.7"/>
    </ManualNodes>
</ManualGSK_Block>
~~~