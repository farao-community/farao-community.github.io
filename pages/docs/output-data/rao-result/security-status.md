This field contains the security status of the network for a given optimized instant, and for a given list of physical 
parameters among:
- FLOW
- ANGLE
- VOLTAGE

{% capture t18_java %}
~~~java
    // Indicates whether all the CNECs of a given type at a given instant are secure.
    boolean isSecure(Instant optimizedInstant, PhysicalParameter... u);

    // Indicates whether all the CNECs of a given type are secure at last instant (i.e. after RAO).
    boolean isSecure(PhysicalParameter... u);

    // Indicates whether all the CNECs are secure at last instant (i.e. after RAO).
    boolean isSecure();
~~~
{% endcapture %}
{% capture t18_json %}
This information is not written in the json file, it is deduced from the values of the CNECs' margins (see below).
{% endcapture %}
{% include /tabs.html id="t18" tab1name="JAVA API" tab1content=t18_java tab2name="JSON file" tab2content=t18_json %}