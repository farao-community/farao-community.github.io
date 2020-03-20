---
layout: page
title: Remedial Actions Optimization interface
permalink: /docs/engine/ra-optimisation
hide: true
feature-img: "assets/img/Hans_Otto_Theater_Potsdam_-_fake_colors_cut.jpg"
tags: [Docs]
---

FARAO provides a common interface for remedial actions optimisation features. This way, it may be possible to
use transparently multiple implementation of RAO functionality without changing the client code.

Current version of this interface is in alpha version. It may change during development process (especially
the RAO result interface).

## Available implementations

Two implementations of RAO functionality are currently part of FARAO roadmap.

### Closed optimisation

Closed optimisation implementation of RAO feature is the conversion of RAO problem in a single
[Mixed-Integer Linear Programming](https://en.wikipedia.org/wiki/Integer_programming) (MILP) problem. This problem can then be solved using different solvers.

For more information regarding closed optimisation engine, and available optimisation problem converters,
please refer to the [dedicated documentation](closed-optimisation-rao/index.md).  

### Branch & Bound optimisation

[Branch & Bound algorithm](https://en.wikipedia.org/wiki/Branch_and_bound) is an efficient implementation of RAO interface for dealing with combinatorial
and non linear problem of remedial actions optimisation mixing topological actions, and combined
preventive/curative optimisation.

This module is not yet available in FARAO toolbox. Please refer to [FARAO roadmap](./roadmap.md) for
information about current implementation plan.

## Using RAO function

### Configuration

To run a remedial actions optimisation, one have to configure the
[componentDefaultConfig](https://powsybl.github.io/docs/configuration/modules/componentDefaultConfig.html)
module to indicate the implementations to use for the `com.farao_community.farao.ra_optimisation.RaoComputationFactory`,
by setting the `RaoComputationFactory` property.

#### YAML version

```yaml
componentDefaultConfig:
    RaoComputationFactory: com.farao_community.farao.closed_optimisation_rao.ClosedOptimisationRaoFactory
```

#### XML version

```xml
<componentDefaultConfig>
    <RaoComputationFactory>com.farao_community.farao.closed_optimisation_rao.ClosedOptimisationRaoFactory</RaoComputationFactory>
</componentDefaultConfig>
```
*Note*: different remedial actions optimisation implementations might require specific configurations, in additional
config file's sections.

### Via iTools: `ra-optimisation` tool

The `ra-optimisation` command in [iTools](https://powsybl.github.io/docs/tools/) is used to run a remedial action optimisation on a given network, with given
CRAC file.

#### Usage

```shell
$> itools ra-optimisation --help
usage: itools [OPTIONS] ra-optimisation --case-file <FILE> --crac-file <FILE>
       [--help] [--output-file <FILE>] [--output-format <FORMAT>]
       [--parameters-file <FILE>] [--skip-postproc]

Available options are:
    --config-name <CONFIG_NAME>   Override configuration file name
    --parallel                    Run command in parallel mode

Available arguments are:
    --case-file <FILE>         the case path
    --crac-file <FILE>         the CRAC file path
    --help                     display the help and quit
    --output-file <FILE>       the RAO results output path
    --output-format <FORMAT>   the RAO results output format [CSV, JSON]
    --parameters-file <FILE>   the RAO parameters as JSON file
    --skip-postproc            skip network importer post processors (when
                               configured)
```

#### Required parameters

##### case-file
Use the `--case-file` parameter to specify the path of the network case file.

##### crac-file 
Use the `--crac-file` parameter to specify the path of the CRAC file.

#### Optional parameters

##### output-file
Use the `--output-file` parameter to export the result of the computation to the specified path. If
this parameter is not used, the results are printed to the console.

##### output-format
Use the `--output-format` parameter to specify the format of the result file. Currently, CSV and JSON
formats are supported. This parameter is required if the `output-file` parameter is used.

##### parameters-file
Use the `--parameters-file` parameter to specify the path of the configuration file.

##### skip-postproc
Use the `--skip-postproc` parameter to skip the network importer's post processors. Read the
[post processor](https://powsybl.github.io/docs/iidm/importer/post-processor/)
documentation page to learn more about network importer's post processors.

#### Example

The following example shows how to run a remedial actions optimisation, using the default configuration:
```shell
$> itools ra-optimisation --case-file case.uct --crac-file crac.json
```

### Via direct code usage:

#### Maven configuration

To use the RAO computation feature, add the following dependency to your `pom.xml` file:
```xml
<dependency>
    <groupId>com.farao-community.farao</groupId>
    <artifactId>farao-ra-optimisation-api</artifactId>
    <version>${farao.version}</version>
</dependency>
```

#### Launching default RAO computation implementation

```java
// Get RAO inputs
Network network = ...
CracFile cracFile = ...

// Create RAO engine
ComputationManager computationManager = LocalComputationManager.getDefault();
RaoComputationFactory factory = ComponentDefaultConfig.load().newFactoryImpl(RaoComputationFactory.class);
RaoComputation computation = factory.create(network, cracFile, computationManager, 0);
RaoComputationParameters parameters = RaoComputationParameters.load();

// Run RAO computation job
RaoComputationResult result = computation.run(network.getStateManager().getWorkingStateId(), parameters).join();
```
