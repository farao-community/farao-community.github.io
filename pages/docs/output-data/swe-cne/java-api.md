After completing the RAO, the user can export the SWE CNE file using this method of [SweCneExporter](https://github.com/farao-community/farao-core/blob/master/data/result-exporter/swe-cne-exporter/src/main/java/com/farao_community/farao/data/swe_cne_exporter/SweCneExporter.java):
~~~java
public void exportCne(Crac crac,Network network,
        CimCracCreationContext cracCreationContext,
        RaoResult raoResult, AngleMonitoringResult angleMonitoringResult,
        RaoParameters raoParameters,CneExporterParameters exporterParameters,OutputStream outputStream)
~~~
With:
- **crac**: the [CRAC object](/docs/input-data/crac/json) used for the RAO.
- **network**: the network used in the RAO (not modified with any remedial action).
- **cracCreationContext**: the [CimCracCreationContext object](/docs/input-data/crac/creation-context#cim) generated during
  [CRAC creation](/docs/input-data/crac/import) from a native [CIM CRAC file](/docs/input-data/crac/cim).
- **raoResult**: the [RaoResult](/docs/output-data/rao-result-json) object containing selected remedial actions and flow
  results.
- **angleMonitoringResult**: the [angle monitoring result object](/docs/engine/angle-monitoring#result).
- **raoParameters**: the [RaoParameters](/docs/parameters) used in the RAO.
- **exporterParameters**: a specific object that the user should define, containing meta-information that will be written
  in the header of the CNE file:
  - **documentId**: document ID to be written in "mRID" field
  - **revisionNumber**: integer to be written in "revisionNumber" field
  - **domainId**: domain ID to be written in "domain.mRID" field (usually an [ENTSO-E EICode](https://www.entsoe.eu/data/energy-identification-codes-eic/))
  - **processType**: the ENTSO-E code of the process type, to be written in "process.processType" field:
    - ~~**A48**~~: Day-ahead capacity determination, used for CORE region (so don't use it here)
    - **Z01**: Day-ahead capacity determination, used for SWE  region
  - **senderId**: ID of the sender of the CNE document, to be written in "sender_MarketParticipant.mRID" field
    (usually an [ENTSO-E EICode](https://www.entsoe.eu/data/energy-identification-codes-eic/))
  - **senderRole**: ENTSO-E code defining the role of the sender of the CNE document, to be written in
    "sender_MarketParticipant.marketRole.type" field:
    - **A04**: system operator
    - **A36**: capacity coordinator
    - **A44**: regional security coordinator
  - **receiverId**: ID of the receiver of the CNE document, to be written in "receiver_MarketParticipant.mRID" field
    (usually an [ENTSO-E EICode](https://www.entsoe.eu/data/energy-identification-codes-eic/))
  - **receiverRole**: ENTSO-E code defining the role of the receiver of the CNE document, to be written in
    "receiver_MarketParticipant.marketRole.type" field. Same value options as senderRole.
  - **timeInterval**: time interval of document applicability, to be written in "time_Period.timeInterval" field. It should
    be formatted as follows: "YYYY-MM-DDTHH:MMZ/YYYY-MM-DDTHH:MMZ" (start date / end date).

Here is a complete example:
~~~java
// Fetch input data (network, glsk) and parameters
Network network = ...
CimGlskDocument glsk = ...
OffsetDateTime glskOffsetDateTime = ...
LoadFlowParameters loadFlowParameters = ...
RaoParameters raoParameters = ...
// Create CRAC
CimCracCreationContext cracCreationContext = new CimCracCreator().createCrac(...);
Crac crac = cracCreationContext.getCrac();
// Run RAO
RaoResult raoResult = Rao.find(...).run(...)
// Run angle monitoring
AngleMonitoringResult angleMonitoringResult = new AngleMonitoring(crac, network, raoResult, glsk).run("OpenLoadFlow", loadFlowParameters, 2, glskOffsetDateTime);
// Set CNE header parameters
CneExporterParameters exporterParameters = new CneExporterParameters("DOCUMENT_ID", 1, "DOMAIN_ID",
                                            CneExporterParameters.ProcessType.DAY_AHEAD_CC, "SENDER_ID",
                                            CneExporterParameters.RoleType.REGIONAL_SECURITY_COORDINATOR, "RECEIVER_ID",
                                            CneExporterParameters.RoleType.CAPACITY_COORDINATOR,
                                            "2021-10-30T22:00Z/2021-10-31T23:00Z");
// Export CNE to output stream
OutputStream os = ...
new SweCneExporter().exportCne(crac, network, cracCreationContext, raoResult, angleMonitoringResult, raoParameters, exporterParameters, os); 
~~~
