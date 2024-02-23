A FARAO "ra-usage-limits-per-instant" consists in limits on the usage of remedial actions for given instants.  
The given instant IDs should match an ID of an instant in the CRAC. Otherwise, its limits will be ignored.  
See [here]((/docs/input-data/crac/creation-parameters#ra-usage-limits-per-instant)) for further explanation on each field described in the following example.

{% capture t8_java %}
~~~java
crac.newRaUsageLimits("preventive")
    .withMaxRa(44)
    .withMaxTso(12)
    .withMaxRaPerTso(new HashMap<>(Map.of("FR", 41, "BE", 12)))
    .withMaxPstPerTso(new HashMap<>(Map.of("BE", 7)))
    .withMaxTopoPerTso(new HashMap<>(Map.of("DE", 5)))
    .add();
crac.newRaUsageLimits("curative")
    .withMaxRa(3)
    .add();
~~~
{% endcapture %}
{% capture t8_json %}
~~~json
"ra-usage-limits-per-instant" : [ {
  "instant": "preventive",
  "max-ra" : 44,
  "max-tso" : 12,
  "max-ra-per-tso" : {"FR": 41, "BE": 12},
  "max-topo-per-tso" : {"DE": 5},
  "max-pst-per-tso" : {"BE": 7}
}, {
  "instant": "curative",
  "max-ra" : 3,
  "max-tso" : 2147483647,
  "max-ra-per-tso" : { },
  "max-topo-per-tso" : { },
  "max-pst-per-tso" : { }
} ]
~~~
{% endcapture %}
{% include /tabs.html id="t8" tab1name="JAVA creation API" tab1content=t8_java tab2name="JSON file" tab2content=t8_json %}
