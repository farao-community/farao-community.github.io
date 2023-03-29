Here is a detailed description of how the voltage monitoring algorithm operates:
- Apply optimal preventive remedial actions from RaoResult on the network
- From the CRAC, get the set of states on which VoltageCnecs exist
- For each of these states, monitor voltages:
  - Use a new copy of the network
  - If the state is not preventive,
    - apply the contingency on the network
    - from the RaoResult, apply on the network the optimal remedial actions decided by the RAO (automatic and curative)
  - Compute load-flow and fetch voltage values for all voltage CNECs
    - If the load-flow diverges move on to the next state
  - Compare the voltages to their thresholds to report security status
    - SECURE: the network is secure; no voltage thresholds are violated
    - HIGH_VOLTAGE_CONSTRAINT: the network is not secure; at least one voltage CNEC has a voltage value higher than its threshold
    - LOW_VOLTAGE_CONSTRAINT: the network is not secure; at least one voltage CNEC has a voltage value lower than its threshold
    - HIGH_AND_LOW_VOLTAGE_CONSTRAINTS: the network is not secure; at least one voltage CNEC has a voltage value higher than its threshold,
      and at least one voltage CNEC has a voltage value lower than its threshold
  - Create a [VoltageMonitoringResult]{#result} containing voltage values and security status
- Assemble all the state-specific VoltageMonitoringResult in one overall [VoltageMonitoringResult](#result)
  
![Voltage monitoring algorithm](/assets/img/voltage_monitoring_algorithm.png)
