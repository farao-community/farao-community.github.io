### JSON import & export {#import-export}
The [VoltageMonitoringResult](https://github.com/farao-community/farao-core/blob/master/monitoring/voltage-monitoring/src/main/java/com/farao_community/farao/monitoring/voltage_monitoring/VoltageMonitoringResult.java) 
can be written to and read from a JSON file.  
Example: 
~~~java
// Export
VoltageMonitoringResult voltageMonitoringResult = ...
OutputStream os = ...
new VoltageMonitoringResultExporter().export(voltageMonitoringResult, os);

// Import
InputStream is = ...
Crac crac = ...
VoltageMonitoringResult voltageMonitoringResult2 = new VoltageMonitoringResultImporter().importVoltageMonitoringResult(is, crac);
~~~
### Contents {#result-contents}
The VoltageMonitoringResult object contains the results of the voltage monitoring algorithm.

#### Status {#result-status}
The VoltageMonitoringResult has methods describing the security status of the network in regard to the voltage constraints 
defined in the CRAC:
- **SECURE**: the network is secure; no voltage thresholds are violated
- **HIGH_VOLTAGE_CONSTRAINT**: the network is not secure; at least one voltage CNEC has a voltage value higher than its threshold
- **LOW_VOLTAGE_CONSTRAINT**: the network is not secure; at least one voltage CNEC has a voltage value lower than its threshold
- **HIGH_AND_LOW_VOLTAGE_CONSTRAINTS**: the network is not secure; at least one voltage CNEC has a voltage value higher than its threshold, 
  and at least one voltage CNEC has a voltage value lower than its threshold

{% capture t1_java %}
~~~java
// get the overall status (one of 4 values above)
public Status getStatus()
~~~
{% endcapture %}
{% capture t1_json %}
This information is not directly accessible in the JSON file.
{% endcapture %}
{% include /tabs.html id="t1" tab1name="JAVA API" tab1content=t1_java tab2name="JSON file" tab2content=t1_json %}

#### Voltage values {#result-voltage-values}
The following methods return information about the voltage values for voltage CNECs.

{% capture t3_java %}
~~~java
// get VoltageCnecs that have a voltage overshoot
public Set<VoltageCnec> getConstrainedElements()

// get the minimum voltage value among all elements of a voltage CNEC, using the VoltageCnec object or its ID in the CRAC, in KILOVOLTS
public Double getMinVoltage(VoltageCnec voltageCnec)
public Double getMinVoltage(String voltageCnecId)

// get the maximum voltage value among all elements of a voltage CNEC, using the VoltageCnec object or its ID in the CRAC, in KILOVOLTS
public Double getMaxVoltage(VoltageCnec voltageCnec)
public Double getMaxVoltage(String voltageCnecId)

// get min/max voltage values for all voltage CNECs (ExtremeVoltageValues contain one min and one max value in KILOVOLTS)
public Map<VoltageCnec, ExtremeVoltageValues> getExtremeVoltageValues()
~~~
{% endcapture %}
{% capture t3_json %}
Example:
~~~json
  "extreme-voltage-values-in-kilovolts" : [ {
    "cnec-id" : "VL45",
    "min" : 144.383355903481,
    "max" : 148.4102909359121
  }, {
    "cnec-id" : "VL46",
    "min" : 143.0995761393377,
    "max" : 147.66000723838806
  } ]
~~~
{% endcapture %}
{% include /tabs.html id="t3" tab1name="JAVA API" tab1content=t3_java tab2name="JSON file" tab2content=t3_json %}

### Printing the result {#result-print}
You can get a human-readable report of the voltage monitoring algorithm, using the following method of the 
VoltageMonitoringResult object:
~~~java
public List<String> printConstraints()
~~~

### Complete JSON example {#result-json-example}
~~~json
{
  "type" : "VOLTAGE_MONITORING_RESULT",
  "extreme-voltage-values-in-kilovolts" : [ {
    "cnec-id" : "VL45",
    "min" : 144.383355903481,
    "max" : 148.4102909359121
  }, {
    "cnec-id" : "VL46",
    "min" : 143.0995761393377,
    "max" : 147.66000723838806
  } ]
}
~~~