The SWE CNE file is the standard RAO output file for the SWE CC process.  
The [FARAO toolbox](https://github.com/powsybl/powsybl-open-rao/tree/main/data/result-exporter/swe-cne-exporter)
allows exporting RAO results in a SWE CNE file using an [internal CRAC](/docs/input-data/crac/json), a network, an internal [RAO result](/docs/output-data/rao-result-json) 
(containing [angle results](/docs/engine/monitoring/angle-monitoring) if the CRAC contains [angle CNECs](/docs/input-data/crac/json#angle-cnecs)), 
a [CimCracCreationContext](/docs/input-data/crac/creation-context#cim), and a [RAO parameters](/docs/parameters).

![SWE CNE](/assets/img/swe-cne.png)