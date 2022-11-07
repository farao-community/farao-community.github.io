---
layout: documentation
title: The CRAC Creation Utility Methods
permalink: /docs/input-data/crac/creation-methods
hide: true
root-page: Documentation
docu-section: Input Data
docu-parent: CRAC
order: 6
feature-img: "assets/img/farao3.jpg"
tags: [Docs, Data]
---

The package [farao-crac-creation-util](https://github.com/farao-community/farao-core/tree/master/data/crac-creation/crac-creation-util) offers some utility classes which looks in a PowSyBl Network for information which are required for the CRAC creation.  
Depending on the CRAC object that is created, one could use one of the following utility class  

| network element to be added in the CRAC   |	utility class                                                 |
|-------------------------------------------|-----------------------------------------------------------------|
| network element of a Contingency      	| UcteContingencyElementHelper                                    |
| network element of a Cnec             	| UcteCnecElementHelper and IidmCnecElementHelper                 |
| network element of a PstRangeAction or of a PstSetPoint elementary action	| UctePstHelper and IidmPstHelper |
| network element of a HvdcRangeAction   	| UcteHvdcElementHelper                                           |
| network element of a TopologicalAction	| UcteTopologicalElementHelper                                    |

### CnecElementHelper {#cnec-element-helper}

The CnecElementHelper is a utility class which search in the network an element that can be a CNEC: an internal branch, a tie-line, a dangling line or a transformer.  

It currently has two implementations, one suited for the UCTE network format, and one for the IIDM format. As each network format relies on a different paradigms in the identification of the network elements, each implementation take different input. This input is referred to as "initial element definition" in the following table.  

The IidmCnecElementHelper takes as input the iidm ID of the element that is looked for.  

The UcteCnecElementHelper takes as input some UCTE information on the element that is looked for.  
- the from/to node ids of the branch, its order code and/or element name, OR
- the from/to node ids of the branch, and a suffix which could be either the order code or the element name, OR
- the UCTE id of the branch, on the form "FROMNODE TO__NODE SUFFIX"  

The CnecElementHelper have the following utility methods. Further explanation on the purpose of each method is given in the javadoc.

| method | additional information |
|--------|-----------|
| boolean isValid() | return a boolean indicating whether or not the element is considered valid in the Network. Typically, if the element was not found in the Network, it is invalid. |
| String getInvalidReason() | if the element is not valid, return a string with the reason why it is not valid (ideal for log management of the CracCreator) |
| String getIdInNetwork() | if the element is valid, return the id of the PowSyBl identifiable designated by the Branch. <br>Note that the id can be different from the one given in input. For instance, the following UCTE id "WBJEL45  XBI_LE51 1" could designate the following iidm tie-line : "JLESNI5  XBI_LE51 1 + WBJEL45  XBI_LE51 1" |
| boolean isInvertedInNetwork() | indicate whether the element is inverted between its initial definition and the network. |
| boolean isHalfLine() | indicate whether the initial definition of the element was a half-line or not. If it was a half-line, the element returned by getIdInNetwork() is the id of the associated tie-line. |
| Branch.Side getHalfLineSide() | if the element is a half-line, return the side of the tie-line designated by the initial definition of the element. <br>For instance, the UCTE branch "WBJEL45  XBI_LE51 1" is the second size of the iidm tie-line "JLESNI5  XBI_LE51 1 + WBJEL45  XBI_LE51 1" |
| double getNominalVoltage(Branch.Side side) | useful for FlowCnecAdder |
| double getCurrentLimit(Branch.Side side) | useful for FlowCnecAdder |

### PstHelper {#pst-helper}
The PstHelper is a utility class which search in the network a PST, that could be used either in a RangeAction, or in a PstSetPoint ElementaryAction.  

As for the CnecElementHelper, the PstHelper has two implementations, which take different inputs, depending on the considered description of the network element (UCTE vs. IIDM, see paragraph above).  

The PstHelper have the following utility methods:  

| method | additional information |
|--|--|
| boolean isValid() | return a boolean indicating whether the PST is considered valid in the Network. Typically, if the identifiable designated by the id is not a PST, it is invalid. |
| String getInvalidReason() | if the PST is not valid, return a string with the reason why it is not valid (ideal for log management of the CracCreator) |
| String getIdInNetwork() | if the element is valid, return the id of the PowSyBl identifiable designated by initial definition of the PST |
| boolean isInvertedInNetwork() | indicate whether the element is inverted between its initial definition and the network. |
| int getLowTapPosition() | - |
| int getHighTapPosition() | - |
| int getInitialTap() | useful for PstRangeActionAdder |
| Map<Integer, Double> getTapToAngleConversionMap() | useful for PstRangeActionAdder |
| int normalizeTap(int originalTap, TapConvention originalTapConvention) | convert the tap from another convention (ex: STARTS_AT_ONE) to the PowSyBl convention. Useful for some formats such as the security limit |

### UcteHvdcElementHelper {#ucte-hvdc-element-helper}
The UcteHvdcElementHelper is a utility class which search in the network an HVDC, that could be used in a HvdcRangeAction.  

As the other UCTE helpers, The UcteHvdcElementHelper takes as input some UCTE information on the element that is looked for.  
- the from/to node ids of the branch, its order code and/or element name, OR
- the from/to node ids of the branch, and a suffix which could be either the order code or the element name, OR
- the UCTE id of the branch, on the form "FROMNODE TO__NODE SUFFIX"

| method | additional information |
|--|--|
| boolean isValid() | return a boolean indicating whether the HVDC is considered valid in the Network. |
| String getInvalidReason() | if the HVDC is not valid, return a string with the reason why it is not valid (ideal for log management of the CracCreator) |
| String getIdInNetwork() | if the element is valid, return the id of the PowSyBl identifiable designated by initial definition of the HVDC |
| boolean isInvertedInNetwork() | indicate whether the element is inverted between its initial definition and the network. |

### UcteContingencyElementHelper and UcteTopologicalElementHelper {#ucte-other-helpers}

UcteContingencyElementHelper and UcteTopologicalElementHelper works as the other UCTE helpers, except that:

- the UcteContingencyElementHelper looks for any network element which could be a contingency: an internal line, a tie-line, a dangling-line, a transformer, a PST, or an HVDC
- the UcteTopologicalElementHelper looks for any network element which could be OPEN or CLOSE within a topological action: an internal line, a tie-line, a dangling-line, a transformer, a PST, or a Switch

Both those classes have the three utility methods: isValid(), getInvalidReason(), and getIdInNetwork()