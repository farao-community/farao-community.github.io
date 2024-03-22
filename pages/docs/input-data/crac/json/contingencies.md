A CRAC object must define "critical contingencies" (or "critical outages", or "CO", or "N-k"...).  
The denomination chosen within the FARAO internal format is **"Contingency"**.

A contingency is the representation of an incident on the network (i.e. a cut line or a group/transformer failure, etc.).
In FARAO, it is modelled by the loss of one or several network elements. Usually we have either a one-network-element-loss
called "N-1", or a two-network-element-loss called "N-2".

Examples:
- N-1: The loss of one generator
- N-2: The loss of two parallel power lines

A contingency is a probable event that can put the grid at risk. Therefore, contingencies must
be considered when operating the electrical transmission / distribution system.

In FARAO, contingencies come from PowSyBl Contingency, where a contingency element has the id of the impacted network element, and its type is linked to the network elements type.
They are represented in the following way:

{% capture t3_java %}
~~~java
crac.newContingency()
    .withId("CO_0001")
    .withContingencyElement("powsybl_generator_id", ContingencyElementType.GENERATOR)
    .add();

crac.newContingency()
    .withId("CO_0002")
    .withName("N-2 on electrical lines")
    .withContingencyElement("powsybl_electrical_line_1_id", ContingencyElementType.LINE)
    .withContingencyElement("powsybl_electrical_line_2_id", ContingencyElementType.LINE)
    .add();
~~~
{% endcapture %}
{% capture t3_json %}
~~~json
"contingencies" : [{
    "id" : "CO_0001",
    "name" : "N-1 on generator",
    "networkElementsIds" : [ "powsybl_generator_id" ]
}, {
    "id" : "CO_0002",
    "name" : "N-1 electrical lines",
    "networkElementsIds" : [ "powsybl_electrical_line_1_id", "powsybl_electrical_line_2_id" ]
}],
~~~
{% endcapture %}
{% capture t3_objects %}
The object used is the PowSyBl Contingency, please refer to the [dedicated documentation](https://www.powsybl.org/pages/documentation/index.html#grid-model) on PowSyBl website.
{% endcapture %}
{% include /tabs.html id="t3" tab1name="JAVA creation API" tab1content=t3_java tab2name="JSON file" tab2content=t3_json tab3name="Object fields" tab3content=t3_objects %}

> 💡  **NOTE**  
> The contingency elements type can be retrieve from the PowSyBl Network using the network element id, with:
> `ContingencyElement.of(network.getIdentifiable(id)).getType()`  
> The network elements currently handled by FARAO's contingencies are: internal lines, interconnections, transformers,
> PSTs, generators, HVDCs, bus-bar sections, and dangling lines.  