---
layout: documentation
title: CRAC import & creation
permalink: /docs/input-data/crac/import
hide: true
root-page: Documentation
docu-section: Input Data
docu-parent: CRAC
order: 0
tags: [Docs, Data, CRAC]
see-also: |
    [CRAC creation parameters](creation-parameters), [CRAC object](json), [CRAC creation context](creation-context)
---

## CRAC import/export {#import-export}


The [FARAO CRAC object model](json) can be directly imported and exported using the farao-crac-io-api.  

The JSON format - also called FARAO internal format - is a raw image of the CRAC object model of FARAO. It is particularly suited to exchange a CRAC java object through files, for instance to exchange CRAC data between microservices or Kubernetes pods of an application. It has an importer and an exporter. The complete round-trip (java object → export → json file → import → java object) has been designed so that the CRAC at the beginning of the chain is exactly the same as the one at the end of the chain.  

Examples of JSON formats are given on this [page](json).  
Examples of uses of the farao-crac-io-api are given below:  
~~~java
// import a CRAC from a PATH
Crac crac = CracImporters.importCrac(Paths.get("/tmp/crac.json"));

// import a CRAC from an input stream
Crac crac = CracImporters.importCrac("crac.json", new FileInputStream(new File("/tmp/crac.json")));

// export a CRAC in JSON in a file
CracExporters.exportCrac(crac, "Json", Paths.get("/tmp/crac.json"));

// export a CRAC in security limit format in an output stream
// (a network is required for this exporter)
CracExporters.exportCrac(crac, network, "SecurityLimit", outputStream);
~~~

## Versioning of internal JSON CRAC files {#versions}
Json files and json importer/exporter are versioned.  
The version number does not correspond to the version number of farao-core. The version only increase when a modification is made within the JSON importer / exporter.  
- The number version of the json files corresponds to the number of version of the exporter by which it has been exported.
- A Json file can be imported by farao-core only if the versions of the file and the importer are compatible (see below)  


| File version (example) | Importer version (example) | Is compatible? | Explanation |
|------------------------|----------------------------|----------------|-------------|
| 1.0                    | 1.0                        | YES            |             |
| 1.0                    | 1.1                        | YES            | The importer is compatible with all the previous versions of the json file, **given that the first number of the version does not change**! |
| 1.1                    | 1.0                        | NO[^1]         | The importer is *a priori* not compatible with newer versions of the file.  <br> For instance, if a json CRAC is generated with farao-core 3.5.0 (importer version = 1.1) and read with farao-core 3.4.3 (importer version = 1.0), the importer should not work. <br> However, the import is not systematically rejected. It might even work in some situation. <br> For instance, in the example above, if a 1.1 crac does not contain the feature specific to its version, the newly introduced switchPair elementary action, it will still be importable by the 1.0 importer. |
| 1.0                    | 2.0                        | NO             | compatibility is not ensured anymore when first version number change |
| 2.0                    | 1.0                        | NO             | compatibility is not ensured anymore when first version number change |

[^1]: might work in some situations


## NativeCrac, CracCreators and CracCreationContext {#crac-creator}

The FARAO CRAC object model is not a bijection of all existing formats. To handle more complex formats, which do not have a one-to-one mapping with the FARAO CRAC object model, an overlay has been designed.  

![NativeCrac](/assets/img/NativeCrac.png)

- The **NativeCrac** is a java object which is a raw representation of the initial CRAC "complex" format. The NativeCrac contains all the information present in the initial file. For instance, for xml CRAC formats, their NativeCrac contains classes which are automatically generated from the XSD of the format.

- The NativeCrac can be imported from a file with a **NativeCracImporter**.

- The NativeCrac can be converted in a CRAC with a **CracCreator**, the CracCreator needs a network to interpret the data 
of the NativeCrac. Moreover, the creators of formats which contain more than one timestamp also need a timestamp in the 
form of a java OffsetDateTime as the created CRAC object only contains one timestamp. [CracCreationParameters](creation-parameters) 
can also be provided to the CracCreator, with some configurations which set the behaviour of the Creator.

- The CracCreator returns a [CracCreationContext](creation-context). It contains:  
-- the created CRAC object  
-- additional information which explains how the initial format has been mapped into the FARAO format. This mapping is often not straightforward (see below). The CracCreationContext enables to keep in memory a link between the NativeCrac and the CRAC objects.


> 💡  **NOTE**  
> The flow-based constraint document contains two types of CNECs: base-case CNECs and post-contingency CNECs. Each post-contingency CNECs corresponds to two FlowCnecs in FARAO: one Instant.OUTAGE FlowCnec and one Instant.CURATIVE FlowCnec. The initial id of the CNEC cannot be kept, as it would be duplicated into the FARAO format, and new ids are therefore created by the CracCreator on the fly.  
> 
> As a consequence, the interpretation of the created CRAC is not straightforward as it contains more Cnecs than the initial format, and with different ids.  
> 
> The CracCreationContext is here to ease the interpretation of the CRAC, and for instance store the information on how each CNEC of the initial format has been mapped - in one or two FlowCnecs - and for a given CNEC of the initial format, what are the id(s) of the created FlowCnec(s).
> 
> This is an example, but the CracCreationContext of the fb-constraint-document is also used for other reasons, such as:
> - keep track of the data which hasn't been imported in FARAO due to quality issue
> - keep track of the branch which has been inverted because the initial format was not consistent with the iidm network (the Network is needed for that operation, that is an example of the reason why it is required by the CracCreator)
> - keep some information of the initial format which are not imported in the FARAO CRAC.
> 
> In the CORE CC process, this CracCreationContext is re-used when results are exported at the end of the RAO, in order to roll-back the modifications which has been made during the creation, and export at the end of the process a CNE file which is consistent with the initial CRAC file.

The formats handled by the CracCreator are:	
- [FlowBasedConstraint document](fbconstraint), also known as Merged-CB, CBCORA or F301 ([farao-crac-creator-fb-constraint](https://github.com/farao-community/farao-core/tree/master/data/crac-creation/crac-creator-fb-constraint))
- [CSE CRAC](cse) ([farao-crac-creator-cse](https://github.com/farao-community/farao-core/tree/master/data/crac-creation/crac-creator-cse))
- [CIM CRAC](cim) ([farao-crac-creator-cim](https://github.com/farao-community/farao-core/tree/master/data/crac-creation/crac-creator-cim))

When creating a CRAC from one of these formats, the chain presented above can be coded step by step, or utility methods can be used to make all the import in one line of code. Some examples are given below:

~~~java
// use the crac-creator-api to import a Crac in one go
Crac crac = CracCreators.importAndCreateCrac(Paths.get("/complexCrac.xml"), network, null).getCrac();


// use the crac-creator-api to import a Crac in two steps, with one timestamp
OffsetDateTime offsetDateTime = OffsetDateTime.parse("2019-01-08T00:30Z");

NativeCrac nativeCrac = NativeCracImporters.importData(Paths.get("/complexCrac.xml"));
CracCreationContext cracCreationContext = CracCreators.createCrac(nativeCrac, network, offsetDateTime);

Crac crac = cracCreationContext.getCrac();

// if the format is known, use directly the suited implementations of NativeCracImporter and CracCreator
// if no configuration is explicitly given, use the default one
// this approach is preferred as the previous one is the format is known, as it returns directly the expected implementation of the CracCreationContext
FbConstraint nativeCrac = new FbConstraintImporter().importNativeCrac(new FileInputStream(new File("fbDocument.xml")));
CracCreationParameters paramaters = CracCreationParameters.load();
FbConstraintCreationContext cracCreationContext = new FbConstraintCracCreator().createCrac(nativeCrac, network, offsetDateTime, parameters);
Crac crac = cracCreationContext.getCrac();

// alternatively, create a CRAC using a specific import configuration load from a JSON format
CracCreationParameters parameters = JsonCracCreationParameters.read(getClass().getResourceAsStream("/parameters/cse-crac-creation-parameters-nok.json"));
~~~

## NativeCrac for RDF input data
In case of input data in RDF format, the code structure stay the same, with **NativeCrac**, **CracCreator** and **CracCreationContext**, but NativeCrac is quite different from the one for JSON data format.
RDF files can't be directly exported into java object, like JSON files can.
To export RDF data into java object and use it to construct the CRAC, we need the NativeCrac includes two **PowSybl** objects :
- a **TripleStore**, in which the RDF files data will be inserted
- a **QueryCatalog**, which defines every SPARQL request useful to access to the TripleStore data 

The TripleStore interface is based on the triple RDF structure (subject, predicate, object) and RDF files can be directly converted into TripleStore objects.
If you insert several RDF files into the same TripleStore, requests used on this TripleStore will aggregate results from every input files.
If you need request a specific file or files group, or ensure the fields from one request result come from the same file or files group, you can add files data into the TripleStore with different contexts names.

Requests are made with **SPARQL**, which is a SQL-like request language for RDF triples. You can request on the whole TripleStore, or on a specific context.
Context could be a file or a files group from input data, following your needs.
Result from a TripleStore request is a **PropertyBags**.
A PropertyBags is a list of **PropertyBag**, and each result entry is a PropertyBag.
A PropertyBag is an HashMap, in which keys are fields names, as defined into SPARQL request, and values are requested datas.

Example of a SPARQL request on the whole TripleStore, without specific context :
~~~
# query: contingencyEquipment
PREFIX cim: <http://iec.ch/TC57/CIM100#>
SELECT *
WHERE {
    ?contingencyEquipment
        rdf:type cim:ContingencyEquipment ;
        cim:ContingencyEquipment.Equipment ?contingencyEquipmentId ;
}
~~~

Example of a SPARQL request on a specific context (the %s pattern will be replaced by context name to query TripleStore) :
~~~
# query: ordinaryContingency
PREFIX cim: <http://iec.ch/TC57/CIM100#>
PREFIX nc: <http://entsoe.eu/ns/nc#>
PREFIX dcat: <http://www.w3.org/ns/dcat#>
SELECT *
{
GRAPH <%s> {
    ?fullModel
        dcat:Model.startDate ?startDate ;
        dcat:Model.endDate ?endDate ;
        dcat:Model.keyword ?keyword .
    ?contingency
        rdf:type nc:OrdinaryContingency ;
        cim:IdentifiedObject.name ?name ;
}
}
~~~


To use these requests, you could do :
~~~java
//to store RDF files data
private final TripleStore tripleStoreCrac;

//to add input data without specific context
tripleStore.read(fileInputStream, "http://entsoe.eu", "");

//to add input data in a specific context
tripleStore.read(fileInputStream, "http://entsoe.eu", "contextName");

//to request data from TripleStore
private final QueryCatalog queryCatalogCrac;

//to get a request from the queries catalog
String queryKey;
String query = queryCatalogCrac.get(queryKey);

//query on the whole TripleStore
PropertyBags result = tripleStoreCrac.query(query);

//query on a specific context
String context;
String contextQuery = String.format(query, context);
PropertyBags result = tripleStoreCrac.query(query);
~~~


## Implementing new CRAC formats {#new-formats}
You are welcome to contribute to the project if you need to import a new native CRAC format to be used in FARAO.  
You can find inspiration in existing CRAC creators' code, with JSON format:
- [farao-crac-creator-fb-constraint](https://github.com/farao-community/farao-core/tree/master/data/crac-creation/crac-creator-fb-constraint)
- [farao-crac-creator-cse](https://github.com/farao-community/farao-core/tree/master/data/crac-creation/crac-creator-cse)
- [farao-crac-creator-cim](https://github.com/farao-community/farao-core/tree/master/data/crac-creation/crac-creator-cim)

with RDF format:
- [farao-crac-creator-csa-profiles](https://github.com/farao-community/farao-core/tree/master/data/crac-creation/crac-creator-csa-profiles)

To help you with that, the package [farao-crac-creation-util](https://github.com/farao-community/farao-core/tree/master/data/crac-creation/crac-creation-util)
offers utility classes that can make mapping the CRAC elements to the PowSyBl network elements much easier.
You should also get familiar with our java [CRAC creation API](json).  

## Example of application of CRAC creation / import / export {#example}

![flow-diagram](/assets/img/flow-diagram-nativeCrac.png)
