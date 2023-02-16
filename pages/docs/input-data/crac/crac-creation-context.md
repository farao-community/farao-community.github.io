---
layout: documentation
title: CRAC creation context
permalink: /docs/input-data/crac/crac-creation-parameters
hide: true
root-page: Documentation
docu-section: Input Data
docu-parent: CRAC
order: 8
tags: [Docs, Data, CRAC]
---

## Introduction {#introduction}
When FARAO tries to import a native CRAC file ([FlowBasedConstraint](crac-fbconstraint.md), [CSE](crac-cse.md), [CIM](crac-cim.md), ...) 
into an [internal CRAC format](crac-json.md), some data transformation can happen, and data present in the final CRAC object 
will not be a "one-to-one" exact representation of the data in the original file.  
This can be an issue for the final user, as [querying the RAO result file or object](/docs/output-data/rao-result-json#contents) 
needs knowledge of the artefacts FARAO created during CRAC creation.  
The [CracCreationContext](https://github.com/farao-community/farao-core/blob/master/data/crac-creation/crac-creator-api/src/main/java/com/farao_community/farao/data/crac_creation/creator/api/CracCreationContext.java) 
classes produced by the different CRAC creators allow the user to access meta-information 
about the CRAC creation process, and to map the original file to the created artifacts in the FARAO object, or to 
error messages if some objects could not be imported.  
This is particularly useful is the user needs to export the RAO result in a format different from [FARAO's internal format](/docs/output-data/rao-result-json), 
referencing CNECs and remedial actions as they were defined in the original (native) CRAC file.  
Many implementations of CracCreationContext exist, depending on the original format. Every implementation has its own 
specific API.  

## Non-specific information {#non-specific}
All CracCreationContext implementations present the following information.

### CRAC creation success {#success}
A simple boolean set to true if a FARAO CRAC could be created from the native CRAC file.
```java
boolean success = cracCreationContext.isCreationSuccessful();
```

### CRAC object {#crac}
The created CRAC object, to be used in the RAO.
```java
Crac crac = cracCreationContext.getCrac();
```

### CRAC creation report {#report}
A textual report that can usefully be logged. It contains information about elements that were ignored or modified in the 
original CRAC.  
The report's lines all begin with one of these tags:
- **[ERROR]**: happens when a CRAC could not be created (e.g. if the user tried to import a [FlowBasedConstraint](crac-fbconstraint.md) 
file without defining a timestamp, or a [CSE](crac-cse.md) file with a non-UCTE network file, etc.)
- **[REMOVED]**: happens when RAO ignores elements of the CRAC because they cannot be imported, or because they are not relevant 
for the RAO (e.g. if a contingency is defined on an element that doesn't exist in the network, or if a CNEC is neither 
optimized nor monitored, etc.)
- **[ADDED]**: happens if FARAO decides to add elements that were not explicitly defined in the original file (e.g. if the 
CRAC contains AUTO CNECs without any remedial action associated, FARAO will automatically duplicate them in the OUTAGE 
instant in order to secure them during the preventive RAO)
- **[ALTERED]**: happens if FARAO imports an element after altering it or ignoring some of its components (e.g. if a monitored 
element shall be so after multiple contingencies, among which some were not imported for any reason, then only valid 
contingencies will be used for the created CNECs)
- **[WARN]**: non-critical warnings (e.g. if the user defined a timestamp for a CRAC format tht doesn't require one, the 
timestamp is ignored and a warning is logged)
- **[INFO]**: non-critical information

The final user shall check these messages to ensure that their CRAC file is well-defined.  
```java
cracCreationContext.getCreationReport().foreach(LOGGER::info);
```

---
See also: [RAO result object](/docs/output-data/rao-result-json)

---