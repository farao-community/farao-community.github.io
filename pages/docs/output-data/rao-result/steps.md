This field contains macro information about which steps the [CASTOR RAO](/docs/engine/ra-optimisation/search-tree-rao) executed.  
(See also: [Forbidding cost increase](/docs/parameters#forbid-cost-increase), [Second preventive RAO parameters](/docs/parameters#second-preventive-rao))

| Value                                                    | Did CASTOR run a 1st preventive RAO? | Did CASTOR run a 2nd preventive RAO? | Did the RAO fall back to initial situation? | Did the RAO fall back to 1st preventive RAO result even though a 2nd was run? |  
|----------------------------------------------------------|--------------------------------------|--------------------------------------|---------------------------------------------|-------------------------------------------------------------------------------|
| FIRST_PREVENTIVE_ONLY                                    | ✔️                                   |                                      |                                             |                                                                               |
| FIRST_PREVENTIVE_FELLBACK_TO_INITIAL_SITUATION           | ✔️                                   |                                      | ✔️                                          |                                                                               |
| SECOND_PREVENTIVE_IMPROVED_FIRST                         | ✔️                                   | ✔️                                   |                                             |                                                                               |
| SECOND_PREVENTIVE_FELLBACK_TO_INITIAL_SITUATION          | ✔️                                   | ✔️                                   | ✔️                                          |                                                                               |
| SECOND_PREVENTIVE_FELLBACK_TO_FIRST_PREVENTIVE_SITUATION | ✔️                                   | ✔️                                   |                                             | ✔️                                                                            |

{% capture t17_java %}
~~~java
OptimizationStepsExecuted getOptimizationStepsExecuted();
~~~
{% endcapture %}
{% capture t17_json %}
Example:
~~~json
{
  "optimizationStepsExecuted": "Second preventive improved first preventive results",
  ...
}
~~~
{% endcapture %}
{% include /tabs.html id="t17" tab1name="JAVA API" tab1content=t17_java tab2name="JSON file" tab2content=t17_json %}