---
layout: documentation
title: Tutorial
permalink: /docs/tutorials/
hide: true
root-page: Documentation
docu-section: none
docu-parent: none
order: 5
tags: [ Docs, Tutorial ]
summary-hmax: 2
---

In this tutorial, we will see how to run a simple RAO from a network file and a CRAC. The CRAC will be created from
scratch using the Java API so there is no need to import a CRAC file.

# Set-up

For this tutorial, we'll need Java 17 and we'll create a new project called `org.example` and work on its `Main` class.
For everything to work properly, you also need to install the latest versions
of [PowSyBl core](https://github.com/powsybl/powsybl-core),
[PowSyBl Open Rao](https://github.com/powsybl/powsybl-open-rao) and
[PowSyBl Open Load Flow (OLF)](https://github.com/powsybl/powsybl-open-loadflow).

You can create a Maven `pom.xml` file to manage all the dependencies at once. Simply copy and paste the following code
snippet in an XML file.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>org.example</groupId>
    <artifactId>farao-core-csa</artifactId>
    <version>1.0-SNAPSHOT</version>

    <properties>
        <!-- Project properties -->
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <java.version>17</java.version>

        <!-- Dependencies version -->
        <powsybl.open-rao.version>5.1.0-SNAPSHOT</powsybl.open-rao.version>
        <cucumber.version>6.6.1</cucumber.version>
        <jackson.version>2.15.2</jackson.version>
        <junit.version>4.12</junit.version>
        <logback.version>1.2.3</logback.version>
        <httpcomponents.version>4.5.12</httpcomponents.version>
        <maven.checkstyle.version>3.1.1</maven.checkstyle.version>
        <maven.compiler.version>3.8.1</maven.compiler.version>
        <maven.jvnet.jaxb2-basics.version>1.11.1</maven.jvnet.jaxb2-basics.version>
        <org.everit.json.version>1.5.1</org.everit.json.version>
        <org.xmlunit.version>2.8.1</org.xmlunit.version>
        <powsybl.core.version>6.1.0</powsybl.core.version>
        <powsybl.entsoe.version>2.7.0</powsybl.entsoe.version>
        <open-load-flow.version>1.5.0</open-load-flow.version>
    </properties>

    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>${maven.compiler.version}</version>
                <configuration>
                    <forceJavacCompilerUse>true</forceJavacCompilerUse>
                    <encoding>UTF-8</encoding>
                    <release>${java.version}</release>
                </configuration>
            </plugin>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-assembly-plugin</artifactId>
                <version>3.3.0</version>
                <executions>
                    <execution>
                        <id>package-jar-with-dependencies</id>
                        <phase>package</phase>
                        <goals>
                            <goal>single</goal>
                        </goals>
                        <configuration>
                            <descriptors>
                                <descriptor>jar-with-dependencies.xml</descriptor>
                            </descriptors>
                            <archive>
                                <manifest>
                                    <mainClass>com.rte_france.faraocucumber.RunCucumberTest</mainClass>
                                </manifest>
                            </archive>
                        </configuration>
                    </execution>
                </executions>
            </plugin>
        </plugins>
    </build>

    <profiles>
        <profile>
            <id>checks</id>
            <activation>
                <activeByDefault>true</activeByDefault>
            </activation>
            <build>
                <plugins>
                    <plugin>
                        <groupId>org.apache.maven.plugins</groupId>
                        <artifactId>maven-checkstyle-plugin</artifactId>
                        <version>${maven.checkstyle.version}</version>
                        <executions>
                            <execution>
                                <phase>validate</phase>
                                <goals>
                                    <goal>check</goal>
                                </goals>
                                <configuration>
                                    <configLocation>checkstyle.xml</configLocation>
                                    <consoleOutput>true</consoleOutput>
                                    <failsOnError>true</failsOnError>
                                    <includeTestSourceDirectory>true</includeTestSourceDirectory>
                                </configuration>
                            </execution>
                        </executions>
                    </plugin>
                </plugins>
            </build>
        </profile>
    </profiles>

    <dependencies>
        <!-- Compile dependencies -->
        <dependency>
            <groupId>com.powsybl</groupId>
            <artifactId>open-rao-angle-monitoring</artifactId>
            <version>${powsybl.open-rao.version}</version>
        </dependency>
        <dependency>
            <groupId>com.powsybl</groupId>
            <artifactId>open-rao-core-cne-exporter</artifactId>
            <version>${powsybl.open-rao.version}</version>
        </dependency>
        <dependency>
            <groupId>com.powsybl</groupId>
            <artifactId>open-rao-cne-exporter-commons</artifactId>
            <version>${powsybl.open-rao.version}</version>
        </dependency>
        <dependency>
            <groupId>com.powsybl</groupId>
            <artifactId>open-rao-crac-api</artifactId>
            <version>${powsybl.open-rao.version}</version>
        </dependency>
        <dependency>
            <groupId>com.powsybl</groupId>
            <artifactId>open-rao-crac-creator-api</artifactId>
            <version>${powsybl.open-rao.version}</version>
        </dependency>
        <dependency>
            <groupId>com.powsybl</groupId>
            <artifactId>open-rao-crac-creator-cse</artifactId>
            <version>${powsybl.open-rao.version}</version>
        </dependency>
        <dependency>
            <groupId>com.powsybl</groupId>
            <artifactId>open-rao-crac-creator-fb-constraint</artifactId>
            <version>${powsybl.open-rao.version}</version>
        </dependency>
        <dependency>
            <groupId>com.powsybl</groupId>
            <artifactId>open-rao-crac-creator-cim</artifactId>
            <version>${powsybl.open-rao.version}</version>
        </dependency>
        <dependency>
            <groupId>com.powsybl</groupId>
            <artifactId>open-rao-crac-creator-csa-profiles</artifactId>
            <version>${powsybl.open-rao.version}</version>
        </dependency>
        <dependency>
            <groupId>com.powsybl</groupId>
            <artifactId>open-rao-crac-impl</artifactId>
            <version>${powsybl.open-rao.version}</version>
        </dependency>
        <dependency>
            <groupId>com.powsybl</groupId>
            <artifactId>open-rao-crac-io-api</artifactId>
            <version>${powsybl.open-rao.version}</version>
        </dependency>
        <dependency>
            <groupId>com.powsybl</groupId>
            <artifactId>open-rao-crac-loopflow-extension</artifactId>
            <version>${powsybl.open-rao.version}</version>
        </dependency>
        <dependency>
            <groupId>com.powsybl</groupId>
            <artifactId>open-rao-flowbased-computation-api</artifactId>
            <version>${powsybl.open-rao.version}</version>
        </dependency>
        <dependency>
            <groupId>com.powsybl</groupId>
            <artifactId>open-rao-flowbased-computation-impl</artifactId>
            <version>${powsybl.open-rao.version}</version>
        </dependency>
        <dependency>
            <groupId>com.powsybl</groupId>
            <artifactId>open-rao-flowbased-domain</artifactId>
            <version>${powsybl.open-rao.version}</version>
        </dependency>
        <dependency>
            <groupId>com.powsybl</groupId>
            <artifactId>open-rao-glsk-virtual-hubs</artifactId>
            <version>${powsybl.open-rao.version}</version>
        </dependency>
        <dependency>
            <groupId>com.powsybl</groupId>
            <artifactId>open-rao-virtual-hubs-xml</artifactId>
            <version>${powsybl.open-rao.version}</version>
        </dependency>
        <dependency>
            <groupId>com.powsybl</groupId>
            <artifactId>open-rao-loopflow-computation</artifactId>
            <version>${powsybl.open-rao.version}</version>
        </dependency>
        <dependency>
            <groupId>com.powsybl</groupId>
            <artifactId>open-rao-rao-api</artifactId>
            <version>${powsybl.open-rao.version}</version>
        </dependency>
        <dependency>
            <groupId>com.powsybl</groupId>
            <artifactId>open-rao-rao-result-api</artifactId>
            <version>${powsybl.open-rao.version}</version>
        </dependency>
        <dependency>
            <groupId>com.powsybl</groupId>
            <artifactId>open-rao-rao-result-json</artifactId>
            <version>${powsybl.open-rao.version}</version>
        </dependency>
        <dependency>
            <groupId>com.powsybl</groupId>
            <artifactId>open-rao-reference-program</artifactId>
            <version>${powsybl.open-rao.version}</version>
        </dependency>
        <dependency>
            <groupId>com.powsybl</groupId>
            <artifactId>open-rao-refprog-xml-importer</artifactId>
            <version>${powsybl.open-rao.version}</version>
        </dependency>
        <dependency>
            <groupId>com.powsybl</groupId>
            <artifactId>open-rao-search-tree-rao</artifactId>
            <version>${powsybl.open-rao.version}</version>
        </dependency>
        <dependency>
            <groupId>com.powsybl</groupId>
            <artifactId>open-rao-swe-cne-exporter</artifactId>
            <version>${powsybl.open-rao.version}</version>
        </dependency>
        <dependency>
            <groupId>com.powsybl</groupId>
            <artifactId>open-rao-util</artifactId>
            <version>${powsybl.open-rao.version}</version>
        </dependency>
        <dependency>
            <groupId>com.fasterxml.jackson.module</groupId>
            <artifactId>jackson-module-jsonSchema</artifactId>
            <version>${jackson.version}</version>
        </dependency>
        <dependency>
            <groupId>com.powsybl</groupId>
            <artifactId>powsybl-config-classic</artifactId>
            <version>${powsybl.core.version}</version>
        </dependency>
        <dependency>
            <groupId>com.powsybl</groupId>
            <artifactId>powsybl-glsk-document-cim</artifactId>
            <version>${powsybl.entsoe.version}</version>
        </dependency>
        <dependency>
            <groupId>com.powsybl</groupId>
            <artifactId>powsybl-glsk-document-ucte</artifactId>
            <version>${powsybl.entsoe.version}</version>
        </dependency>
        <dependency>
            <groupId>com.powsybl</groupId>
            <artifactId>powsybl-iidm-impl</artifactId>
            <version>${powsybl.core.version}</version>
        </dependency>
        <dependency>
            <groupId>com.powsybl</groupId>
            <artifactId>powsybl-iidm-scripting</artifactId>
            <version>${powsybl.core.version}</version>
        </dependency>
        <dependency>
            <groupId>com.powsybl</groupId>
            <artifactId>powsybl-iidm-serde</artifactId>
            <version>${powsybl.core.version}</version>
        </dependency>
        <dependency>
            <groupId>com.powsybl</groupId>
            <artifactId>powsybl-open-loadflow</artifactId>
            <version>${open-load-flow.version}</version>
        </dependency>
        <dependency>
            <groupId>ch.qos.logback</groupId>
            <artifactId>logback-classic</artifactId>
            <version>${logback.version}</version>
        </dependency>
        <dependency>
            <groupId>io.cucumber</groupId>
            <artifactId>cucumber-java</artifactId>
            <version>${cucumber.version}</version>
        </dependency>
        <dependency>
            <groupId>io.cucumber</groupId>
            <artifactId>cucumber-junit</artifactId>
            <version>${cucumber.version}</version>
        </dependency>
        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>${junit.version}</version>
        </dependency>
        <dependency>
            <groupId>org.everit.json</groupId>
            <artifactId>org.everit.json.schema</artifactId>
            <version>${org.everit.json.version}</version>
        </dependency>
        <dependency>
            <groupId>org.jvnet.jaxb2_commons</groupId>
            <artifactId>jaxb2-basics</artifactId>
            <version>${maven.jvnet.jaxb2-basics.version}</version>
        </dependency>
        <dependency>
            <groupId>org.xmlunit</groupId>
            <artifactId>xmlunit-core</artifactId>
            <version>${org.xmlunit.version}</version>
        </dependency>

        <!-- Runtime dependencies -->
        <dependency>
            <groupId>com.powsybl</groupId>
            <artifactId>powsybl-cgmes-conversion</artifactId>
            <version>${powsybl.core.version}</version>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>com.powsybl</groupId>
            <artifactId>powsybl-triple-store-impl-rdf4j</artifactId>
            <version>${powsybl.core.version}</version>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>com.powsybl</groupId>
            <artifactId>powsybl-ucte-converter</artifactId>
            <version>${powsybl.core.version}</version>
            <scope>runtime</scope>
        </dependency>
    </dependencies>

</project>
```

# Import network file

The first step is to import a network for the simulation. As an example, we will consider the following 12-nodes UCTE
network that is made of 18 lines including 1 PST spread over 4 countries. All the production (1000 MW) is located in the
Netherlands (node _NNL1AA1_) and the consumption (1000 MW) is in France (node _FFR1AA1_).

![](/assets/img/tutorial/basecase.svg)

We will create an UCTE file to model this network, so it can be processed and imported for the RAO. Copy and paste the
network data in a file named `12Nodes.uct` that you shall store in the resources directory of the project.

```
##C 2007.05.01
##N
##ZBE
BBE1AA1  BE1          0 2 400.00 0.00000 0.00000 0.00000 0.00000 9000.00 -9000.0 9000.00 -9000.0
BBE2AA1  BE2          0 2 400.00 0.00000 0.00000 0.00000 0.00000 9000.00 -9000.0 9000.00 -9000.0
BBE3AA1  BE3          0 2 400.00 0.00000 0.00000 0.00000 0.00000 9000.00 -9000.0 9000.00 -9000.0
##ZDE
DDE1AA1  DE1          0 2 400.00 0.00000 0.00000 0.00000 0.00000 9000.00 -9000.0 9000.00 -9000.0
DDE2AA1  DE2          0 2 400.00 0.00000 0.00000 0.00000 0.00000 9000.00 -9000.0 9000.00 -9000.0
DDE3AA1  DE3          0 2 400.00 0.00000 0.00000 0.00000 0.00000 9000.00 -9000.0 9000.00 -9000.0
##ZFR
FFR1AA1  FR1          0 2 400.00 1000.00 0.00000 00000.0 0.00000 9000.00 -9000.0 9000.00 -9000.0
FFR2AA1  FR2          0 2 400.00 0.00000 0.00000 0.00000 0.00000 9000.00 -9000.0 9000.00 -9000.0
FFR3AA1  FR3          0 2 400.00 0.00000 0.00000 0.00000 0.00000 9000.00 -9000.0 9000.00 -9000.0
##ZNL
NNL1AA1  NL1          0 2 400.00 0000.00 0.00000 -1000.0 0.00000 9000.00 -9000.0 9000.00 -9000.0
NNL2AA1  NL2          0 2 400.00 0.00000 0.00000 0.00000 0.00000 9000.00 -9000.0 9000.00 -9000.0
NNL3AA1  NL3          0 2 400.00 0.00000 0.00000 0.00000 0.00000 9000.00 -9000.0 9000.00 -9000.0
##L
BBE1AA1  BBE2AA1  1 0 0.0000 10.000 0.000000   5000
BBE1AA1  BBE3AA1  1 0 0.0000 10.000 0.000000   5000
FFR1AA1  FFR2AA1  1 0 0.0000 10.000 0.000000   5000
FFR1AA1  FFR3AA1  1 0 0.0000 10.000 0.000000   5000
FFR2AA1  FFR3AA1  1 0 0.0000 10.000 0.000000   5000
DDE1AA1  DDE2AA1  1 0 0.0000 10.000 0.000000   5000
DDE1AA1  DDE3AA1  1 0 0.0000 10.000 0.000000   5000
DDE2AA1  DDE3AA1  1 0 0.0000 10.000 0.000000   5000
NNL1AA1  NNL2AA1  1 0 0.0000 10.000 0.000000   5000
NNL1AA1  NNL3AA1  1 0 0.0000 10.000 0.000000   5000
NNL2AA1  NNL3AA1  1 0 0.0000 10.000 0.000000   5000
FFR2AA1  DDE3AA1  1 0 0.0000 10.000 0.000000   5000
DDE2AA1  NNL3AA1  1 0 0.0000 10.000 0.000000   5000
NNL2AA1  BBE3AA1  1 0 0.0000 10.000 0.000000   410
NNL2AA1  BBE3AA1  2 8 0.0000 10.000 0.000000   410
NNL2AA1  BBE3AA1  3 8 0.0000 10.000 0.000000   410
BBE2AA1  FFR3AA1  1 0 0.0000 10.000 0.000000   5000
##T
BBE2AA1  BBE3AA1  1 0 400.0 400.0 1000. 0.0000 10.000 0.000000 0.0	     5000 PST
##R
BBE2AA1  BBE3AA1  1                    -0.68 90.00 16 0         SYMM

```

The network can be imported using [PowSyBl](https://www.powsybl.org/index.html):

```
String networkFilename = "12Nodes.uct";
Network network = Network.read(networkFilename, Main.class.getResourceAsStream("/%s".formatted(networkFilename)));
```

For this tutorial, we will simulate the loss of line _NNL3AA1 DDE2AA1 1_. This loss will divert the power and increase
the flow in line _NNL3AA1 DDE2AA1 1_ over its admissible power limit. We will study how the RAO can help us solve the
resulting problems on the network thanks to remedial actions.

# Create CRAC

The [CRAC](/docs/input-data/crac/crac) is the data object that contains all the key information for the RAO, i.e. the
contingencies to simulate, the CNECs to optimise and the remedial actions to apply. The RAO's Java API allows users to
manually fill the CRAC with all the required and desired data.

The first step is to instantiate an empty CRAC using the CracFactory:

```java
Crac crac = CracFactory.findDefault().create();

Once created, the CRAC can be filled sequentially (some data must be provided before others for logical reasons) with
the information required to model our scenario.

## Create contingencies

Start by defining a [contingency](/docs/input-data/crac/json#contingencies) called "contingency", on line _NNL3AA1 DDE2AA1 1_, with the following code:

```
crac.newContingency()
    .withId("contingency")
    .withNetworkElement("NNL3AA1  DDE2AA1  1")
    .add();
```

## Add instants

Once the contingencies are added, we can now create the different [instants](/docs/input-data/crac/json#instants-states)
of the optimisation process. An instant is added thanks to the `newInstant` method. Both an identifier and
an `InstantKind` (`PREVENTIVE`, `OUTAGE`, `AUTO` or `CURATIVE`) must be provided. The instants must also be declared in
**chronological order**.

For our example, we only need 3 instants:

1. one **preventive** instant that represents the base case
2. one **outage** instant that account for the state of the network right after the contingency (loss of line _NNL3AA1
   DDE2AA1 1_) occurred
3. one **curative** instant during which curative remedial actions can be applied to solve the problems resulting from
   the outage

```
crac.newInstant("preventive", InstantKind.PREVENTIVE)
        .newInstant("outage", InstantKind.OUTAGE)
        .newInstant("curative", InstantKind.CURATIVE);
```

Now that contingencies and instants are all set, we can start adding CNECs and remedial actions to the CRAC.

## Create FlowCNECs

The next step is to create the [CNECs](/docs/input-data/crac/json#cnecs). For our example and given the simple network
we are using, we will only consider [FlowCNECs](/docs/input-data/crac/json#flow-cnecs) that correspond to lines in the
network that will have to be optimised flow-wise after contingencies (and in the base case). The FlowCNECs also have
thresholds that indicate the maximum admissible flow on the line for a given instant.

The `newFlowCnec` method needs to be called to create a FlowCNEC in the CRAC. Different information must be provided
including the CNEC's identifier, network element, instant and thresholds. For non-preventive CNECs, an associated
contingency must also be provided.

For our example, we want to monitor the flow on line _NNL2AA1 BBE3AA1 1_ in the base case, after the loss of line
_NNL3AA1 DDE2AA1 1_ as well as after the application of curative remedial actions. They respectively correspond to the
preventive, outage and curative instants. Fot both the preventive and curative instants, the operation limit is the PATL
that we set to 410 MW. For the outage instant, the limit is temporary (TATL) and its threshold is higher to allow an
overflow on the line which is restricted in time. For this example, we will consider that the TATL is 1000 MW. Thus, we
need to define 3 FlowCNECS to monitor line _DDE2AA1 NNL3AA1 1_ at each instant.

```
crac.newFlowCnec()
    .withId("NNL2AA1  BBE3AA1  1 - preventive")
    .withInstant("preventive")
    .withOptimized()
    .withNetworkElement("NNL2AA1  BBE3AA1  1")
    .newThreshold()
        .withMin(-410d)
        .withMax(+410d)
        .withUnit(Unit.MEGAWATT)
        .withSide(Side.LEFT)
        .add()
    .add();

crac.newFlowCnec()
    .withId("NNL2AA1  BBE3AA1  1 - outage")
    .withInstant("outage")
    .withOptimized()
    .withContingency("contingency")
    .withNetworkElement("NNL2AA1  BBE3AA1  1")
    .newThreshold()
        .withMin(-1000d)
        .withMax(+1000d)
        .withUnit(Unit.MEGAWATT)
        .withSide(Side.LEFT)
        .add()
    .add();

crac.newFlowCnec()
    .withId("NNL2AA1  BBE3AA1  1 - curative")
    .withInstant("curative")
    .withOptimized()
    .withContingency("contingency")
    .withNetworkElement("NNL2AA1  BBE3AA1  1")
    .newThreshold()
        .withMin(-410d)
        .withMax(+410d)
        .withUnit(Unit.MEGAWATT)
        .withSide(Side.LEFT)
        .add()
    .add();
```

Finally, we can add remedial actions in the CRAC.

## Add remedial actions

### Add a preventive PST range action

Let's start with a [PST range action](/docs/input-data/crac/json#range-actions). The network has one PST (_BBE2AA1
BBE3AA1 1_) that we can use to define such a range actions. A PST range action can be added to the CRAC with
the `newPstRangeAction` method. The identifier of the remedial action, the network element it is acting on and the tap
range can be provided directly. For the initial tap and the tap-to-angle conversion map, it is easier to rely on
an `IidmPstHelper` which fetches the information in the network.

The usage rules must also be added to tell the RAO in which context the remedial can or must be applied.

For our example, the PST range action can be used at the preventive instant to change the impedance of line _NNL2AA1
BBE3AA1 1_ and reduce its flow to go under the PATL and anticipate the loss of line _NNL3AA1 DDE2AA1 1_.

```
IidmPstHelper iidmPstHelper = new IidmPstHelper("BBE2AA1  BBE3AA1  1", network);

crac.newPstRangeAction()
   .withId("pst-range-action")
   .withNetworkElement("BBE2AA1  BBE3AA1  1")
   .withInitialTap(iidmPstHelper.getInitialTap())
   .withTapToAngleConversionMap(iidmPstHelper.getTapToAngleConversionMap())
   .newTapRange()
      .withMinTap(-16)
      .withMaxTap(16)
      .withRangeType(RangeType.ABSOLUTE)
      .add()
   .newOnInstantUsageRule()
      .withInstant("preventive")
      .withUsageMethod(UsageMethod.AVAILABLE)
      .add()
   .add();
```

### Add a curative topological action

We can finish by adding a topological action to the CRAC, using the `newNetworkAction` method and
the `newTopologicalAction` adder, and providing an action type (i.e. open or close) and a line on which apply this
action.

In our example, this topological action consists in connecting lines _NNL2AA1 BBE3AA1 2_ and _NNL2AA1 BBE3AA1 3_ (both
parallel to _NNL2AA1 BBE3AA1 1_) to the rest of the network so the flow is divided among the three parallel lines, which
can make the flow on line _NNL2AA1 BBE3AA1 1_ go back under the PATL.

```
crac.newNetworkAction()
      .withId("topological-action")
      .newTopologicalAction()
         .withNetworkElement("NNL2AA1  BBE3AA1  2")
         .withActionType(ActionType.CLOSE)
         .add()
      .newTopologicalAction()
         .withNetworkElement("NNL2AA1  BBE3AA1  3")
         .withActionType(ActionType.CLOSE)
         .add()
      .newOnContingencyStateUsageRule()
         .withInstant("curative")
         .withContingency("contingency")
         .withUsageMethod(UsageMethod.AVAILABLE)
         .add()
      .add();
```

We are almost there! The CRAC is complete and the RAO is almost ready to run. Let us see how to do this in the following
section.

# RAO Parameters

To run, the RAO also requires `RaoParameters` to properly set its desired behaviour. For our example, the default
parameters will not be fully sufficient so we. See how you can tune the RAO using the parameters
[here](/docs/parameters).

The following code snippet helps set some parameters to specific values. In a nutshell, we impose the loadflow
computations to be carried out in DC mode and set the margins unit to megawatt. We also indicate that we want to use
discretised ranges for PSTS instead of continuous ones.

```
LoadFlowParameters loadFlowParameters = new LoadFlowParameters();
loadFlowParameters.setDc(true);
loadFlowParameters.setBalanceType(LoadFlowParameters.BalanceType.PROPORTIONAL_TO_LOAD);

SensitivityAnalysisParameters sensitivityAnalysisParameters = new SensitivityAnalysisParameters();
sensitivityAnalysisParameters.setLoadFlowParameters(loadFlowParameters);

LoadFlowAndSensitivityParameters loadFlowAndSensitivityParameters = new LoadFlowAndSensitivityParameters();
loadFlowAndSensitivityParameters.setLoadFlowProvider("OpenLoadFlow");
loadFlowAndSensitivityParameters.setSensitivityWithLoadFlowParameters(sensitivityAnalysisParameters);

ObjectiveFunctionParameters objectiveFunctionParameters = new ObjectiveFunctionParameters();
objectiveFunctionParameters.setType(ObjectiveFunctionParameters.ObjectiveFunctionType.MAX_MIN_MARGIN_IN_MEGAWATT);
objectiveFunctionParameters.setPreventiveStopCriterion(ObjectiveFunctionParameters.PreventiveStopCriterion.SECURE);
objectiveFunctionParameters.setCurativeStopCriterion(ObjectiveFunctionParameters.CurativeStopCriterion.SECURE);

RaoParameters raoParameters = new RaoParameters();
raoParameters.setLoadFlowAndSensitivityParameters(loadFlowAndSensitivityParameters);
raoParameters.setObjectiveFunctionParameters(objectiveFunctionParameters);
raoParameters.getRangeActionsOptimizationParameters().setPstModel(RangeActionsOptimizationParameters.PstModel.APPROXIMATED_INTEGERS);
```

# Run the RAO

A last pre-processing step is required to run the RAO. The network and the CRAC must be processed together as
a `RaoInput`. This is achieved through a `RaoInputBuilder`.

```
RaoInput.RaoInputBuilder raoInputBuilder = RaoInput.build(network,crac);
```

Thus, using both our `RaoInputBuilder` and the default parameters, we can run the RAO and store the optimisation results
in a [`RaoResult`](/docs/output-data/rao-result-json) object for further use or data export.

```java
RaoResult raoResult=Rao.find().run(raoInputBuilder.build(),new RaoParameters());
```

# Step-by-step results

We will go through the results of the RAO, instant by instant, to analyse the different optimisation steps and study the
RAO's behaviour.

## Base case and preventive optimisation

As presented earlier, the whole electricity production (1000 MW) in the network is located at node _NNL1AA1_. The flow
is divided among evenly among lines _NNL2AA1 BBE3AA1 1_ and _DDE2AA1 NNL3AA1 1_.

![](/assets/img/tutorial/basecase.svg)

However, the PATL of line _NNL2AA1 BBE3AA1 1_ is set to 410 MW which is below the current 500 MW flow on the line. Thus,
remedial actions must be applied to solve this base case issue. In The CRAC, we only defined one preventive remedial
action which is the PST range action. By changing, the PST's tap, we can change the line's impedance and thus modify the
flow.

```
[main] INFO  c.p.o.commons.logs.RaoBusinessLogs - ----- Preventive perimeter optimization [start]
[main] DEBUG c.p.o.commons.logs.TechnicalLogs - Evaluating root leaf
[main] DEBUG c.p.o.commons.logs.TechnicalLogs - Leaf has already been evaluated
[main] INFO  c.p.o.commons.logs.TechnicalLogs - Root leaf, cost: 90.00 (functional: 90.00, virtual: 0.00)
[main] INFO  c.p.o.commons.logs.TechnicalLogs - Limiting element #01: margin = -90.00 MW, element NNL2AA1  BBE3AA1  1 at state preventive, CNEC ID = "NNL2AA1  BBE3AA1  1 - preventive"
[main] INFO  c.p.o.commons.logs.TechnicalLogs - Limiting element #02: margin = 0.00 MW, element NNL2AA1  BBE3AA1  1 at state contingency - outage, CNEC ID = "NNL2AA1  BBE3AA1  1 - outage"
[main] INFO  c.p.o.commons.logs.TechnicalLogs - Linear optimization on root leaf
[main] DEBUG c.p.o.commons.logs.TechnicalLogs - Optimizing leaf...
[main] INFO  c.p.o.commons.logs.TechnicalLogs - Loading library 'jniortools'
[main] DEBUG c.p.o.commons.logs.TechnicalLogs - Iteration 1: linear optimization [start]
[main] DEBUG c.p.o.commons.logs.TechnicalLogs - Iteration 1: linear optimization [end]
[main] DEBUG c.p.o.commons.logs.TechnicalLogs - Iteration 1: linear optimization [start]
[main] DEBUG c.p.o.commons.logs.TechnicalLogs - Iteration 1: linear optimization [end]
[main] DEBUG c.p.o.commons.logs.TechnicalLogs - Systematic sensitivity analysis [start]
[main] DEBUG c.p.o.commons.logs.TechnicalLogs - Systematic sensitivity analysis [end]
[main] INFO  c.p.o.commons.logs.TechnicalLogs - Iteration 1: better solution found with a cost of -0.00 (functional: -0.00)
[main] DEBUG c.p.o.commons.logs.TechnicalLogs - Iteration 2: linear optimization [start]
[main] DEBUG c.p.o.commons.logs.TechnicalLogs - Iteration 2: linear optimization [end]
[main] DEBUG c.p.o.commons.logs.TechnicalLogs - Iteration 2: linear optimization [start]
[main] DEBUG c.p.o.commons.logs.TechnicalLogs - Iteration 2: linear optimization [end]
[main] INFO  c.p.o.commons.logs.TechnicalLogs - Iteration 2: same results as previous iterations, optimal solution found
[main] INFO  c.p.o.commons.logs.RaoBusinessLogs - Root leaf, 1 range action(s) activated, cost: -0.00 (functional: -0.00, virtual: 0.00)
[main] INFO  c.p.o.commons.logs.TechnicalLogs - range action(s): pst-range-action: -10
[main] INFO  c.p.o.commons.logs.RaoBusinessLogs - Limiting element #01: margin = 0.00 MW, element NNL2AA1  BBE3AA1  1 at state contingency - outage, CNEC ID = "NNL2AA1  BBE3AA1  1 - outage"
[main] INFO  c.p.o.commons.logs.RaoBusinessLogs - Limiting element #02: margin = 8.15 MW, element NNL2AA1  BBE3AA1  1 at state preventive, CNEC ID = "NNL2AA1  BBE3AA1  1 - preventive"
[main] INFO  c.p.o.commons.logs.RaoBusinessLogs - Scenario "preventive": initial cost = 90.00 (functional: 90.00, virtual: 0.00), 1 range action(s) activated : pst-range-action: -10, cost after preventive optimization = -0.00 (functional: -0.00, virtual: 0.00)
[main] INFO  c.p.o.commons.logs.RaoBusinessLogs - ----- Preventive perimeter optimization [end]
```

When reading the preventive perimeter's logs above, we notice that the RAO set the new tap of the PST to -10 which
increases the flow margin on line _NNL2AA1 BBE3AA1 1_ up to 8.15 MW (i.e. reduces the flow to 402 MW). The preventive
perimeter is thus secured. The network with the preventive remedial action applied is displayed below.

![](/assets/img/tutorial/preventive.svg)

## Loss of line

The outage is then simulated: line _NNL3AA1 DDE2AA1 1_ is lost. The network's topology is modified and the new flow is
now of 1000 MW (the whole production power) on line _NNL2AA1 BBE3AA1 1_.

![](/assets/img/tutorial/outage.svg)

However, the line's TATL is exactly 1000 MW so the network is temporarily secure. Note that this result is coherent with
the most limiting element displayed at the end of the preventive perimeter logs:

```
Limiting element #01: margin = 0.00 MW, element NNL2AA1  BBE3AA1  1 at state contingency - outage, CNEC ID = "NNL2AA1  BBE3AA1  1 - outage"
```

Indeed, the flow on line _NNL2AA1 BBE3AA1 1_ is equal to the TATL which is equivalent to a null margin. As the TATL can
only hold for a limited period of time, curative remedial actions must be applied to bring back the flow under the PATL.

## Curative optimisation

The RAO will now try applying the curative remedial action we defined in the CRAC, to bring the flow on line
_NNL2AA1 BBE3AA1 1_ back under the 410 MW PATL. As a reminder, this curative remedial action is a topological action
that closes lines _NNL2AA1 BBE3AA1 2_ and _NNL2AA1 BBE3AA1 3_, which are both parallel to _NNL2AA1 BBE3AA1 1_,
thus dividing the flow in three. It is expected that the remedial action can solve the current problem.

```
[main] INFO  c.p.o.commons.logs.RaoBusinessLogs - ----- Post-contingency perimeters optimization [start]
[main] INFO  c.p.o.commons.logs.TechnicalLogs - Using base network '12Nodes' on variant 'ContingencyScenario3b0ea217-ed17-4122-9bf1-7d8ceebf4267'
[ForkJoinPool-1-worker-1] INFO  c.p.o.commons.logs.TechnicalLogs - Optimizing scenario post-contingency contingency.
[ForkJoinPool-1-worker-1] INFO  c.p.o.commons.logs.TechnicalLogs - Optimizing curative state contingency - curative.
[ForkJoinPool-1-worker-1] DEBUG c.p.o.commons.logs.TechnicalLogs - Evaluating root leaf
[ForkJoinPool-1-worker-1] DEBUG c.p.o.commons.logs.TechnicalLogs - Leaf has already been evaluated
[ForkJoinPool-1-worker-1] INFO  c.p.o.commons.logs.TechnicalLogs - Root leaf, cost: 590.00 (functional: 590.00, virtual: 0.00)
[ForkJoinPool-1-worker-1] INFO  c.p.o.commons.logs.TechnicalLogs - Limiting element #01: margin = -590.00 MW, element NNL2AA1  BBE3AA1  1 at state contingency - curative, CNEC ID = "NNL2AA1  BBE3AA1  1 - curative"
[ForkJoinPool-1-worker-1] INFO  c.p.o.commons.logs.TechnicalLogs - Linear optimization on root leaf
[ForkJoinPool-1-worker-1] INFO  c.p.o.commons.logs.TechnicalLogs - No range actions to optimize
[ForkJoinPool-1-worker-1] INFO  c.p.o.commons.logs.TechnicalLogs - Root leaf, cost: 590.00 (functional: 590.00, virtual: 0.00)
[ForkJoinPool-1-worker-1] INFO  c.p.o.commons.logs.TechnicalLogs - No range actions activated
[ForkJoinPool-1-worker-1] INFO  c.p.o.commons.logs.TechnicalLogs - Limiting element #01: margin = -590.00 MW, element NNL2AA1  BBE3AA1  1 at state contingency - curative, CNEC ID = "NNL2AA1  BBE3AA1  1 - curative"
[ForkJoinPool-1-worker-1] DEBUG c.p.o.commons.logs.TechnicalLogs - Evaluating 1 leaves in parallel
[ForkJoinPool-1-worker-1] INFO  c.p.o.commons.logs.TechnicalLogs - Using base network '12NodesProdNL' on variant 'OpenRaoNetworkPool working variant e2cc75b1-3886-4172-85ae-5fac9232431d'
[ForkJoinPool-1-worker-1] INFO  c.p.o.commons.logs.TechnicalLogs - Search depth 1 [start]
[ForkJoinPool-1-worker-1] INFO  c.p.o.commons.logs.TechnicalLogs - Leaves to evaluate: 1
[ForkJoinPool-2-worker-1] DEBUG c.p.o.commons.logs.TechnicalLogs - Evaluating network action(s): topological-action
[ForkJoinPool-2-worker-1] DEBUG c.p.o.commons.logs.TechnicalLogs - Systematic sensitivity analysis [start]
[ForkJoinPool-2-worker-1] DEBUG c.p.o.commons.logs.TechnicalLogs - Systematic sensitivity analysis [end]
[ForkJoinPool-2-worker-1] INFO  c.p.o.commons.logs.TechnicalLogs - Evaluated network action(s): topological-action, cost: -76.67 (functional: -76.67, virtual: 0.00)
[ForkJoinPool-2-worker-1] INFO  c.p.o.commons.logs.TechnicalLogs - Optimized network action(s): topological-action, cost: -76.67 (functional: -76.67, virtual: 0.00)
[ForkJoinPool-2-worker-1] INFO  c.p.o.commons.logs.TechnicalLogs - Stop criterion reached, other threads may skip optimization.
[ForkJoinPool-2-worker-1] INFO  c.p.o.commons.logs.TechnicalLogs - Remaining leaves to evaluate: 0
[ForkJoinPool-1-worker-1] INFO  c.p.o.commons.logs.TechnicalLogs - Search depth 1 [end]
[ForkJoinPool-1-worker-1] INFO  c.p.o.commons.logs.TechnicalLogs - Search depth 1 best leaf: network action(s): topological-action, cost: -76.67 (functional: -76.67, virtual: 0.00)
[ForkJoinPool-1-worker-1] INFO  c.p.o.commons.logs.TechnicalLogs - Search depth 1 best leaf: No range actions activated
[ForkJoinPool-1-worker-1] INFO  c.p.o.commons.logs.TechnicalLogs - Limiting element #01: margin = 76.67 MW, element NNL2AA1  BBE3AA1  1 at state contingency - curative, CNEC ID = "NNL2AA1  BBE3AA1  1 - curative"
[ForkJoinPool-1-worker-1] INFO  c.p.o.commons.logs.TechnicalLogs - Search-tree RAO completed with status DEFAULT
[ForkJoinPool-1-worker-1] INFO  c.p.o.commons.logs.TechnicalLogs - Best leaf: network action(s): topological-action, cost: -76.67 (functional: -76.67, virtual: 0.00)
[ForkJoinPool-1-worker-1] INFO  c.p.o.commons.logs.TechnicalLogs - Best leaf: No range actions activated
[ForkJoinPool-1-worker-1] INFO  c.p.o.commons.logs.TechnicalLogs - Limiting element #01: margin = 76.67 MW, element NNL2AA1  BBE3AA1  1 at state contingency - curative, CNEC ID = "NNL2AA1  BBE3AA1  1 - curative"
[ForkJoinPool-1-worker-1] INFO  c.p.o.commons.logs.RaoBusinessLogs - Scenario "contingency": initial cost = 590.00 (functional: 590.00, virtual: 0.00), 1 network action(s) activated : topological-action, cost after curative optimization = -76.67 (functional: -76.67, virtual: 0.00)
[ForkJoinPool-1-worker-1] INFO  c.p.o.commons.logs.TechnicalLogs - Curative state contingency - curative has been optimized.
[ForkJoinPool-1-worker-1] DEBUG c.p.o.commons.logs.TechnicalLogs - Remaining post-contingency scenarios to optimize: 0
[main] INFO  c.p.o.commons.logs.RaoBusinessLogs - ----- Post-contingency perimeters optimization [end]
```

We can see in the logs that the remedial action was indeed applied, increasing the margin on line _NNL2AA1 BBE3AA1 1_ to
76.67 MW (i.e. decreasing the flow to 333 MW which is below the PATL). At the end of the curative perimeter, the network
is still secure and the three parallel lines are all connected.

![](/assets/img/tutorial/curative.svg)

## Final results

```
[main] INFO  c.p.o.commons.logs.RaoBusinessLogs - Merging preventive and post-contingency RAO results:
[main] INFO  c.p.o.commons.logs.RaoBusinessLogs - Limiting element #01: margin = 0.00 MW, element NNL2AA1  BBE3AA1  1 at state contingency - outage, CNEC ID = "NNL2AA1  BBE3AA1  1 - outage"
[main] INFO  c.p.o.commons.logs.RaoBusinessLogs - Limiting element #02: margin = 8.15 MW, element NNL2AA1  BBE3AA1  1 at state preventive, CNEC ID = "NNL2AA1  BBE3AA1  1 - preventive"
[main] INFO  c.p.o.commons.logs.RaoBusinessLogs - Limiting element #03: margin = 76.67 MW, element NNL2AA1  BBE3AA1  1 at state contingency - curative, CNEC ID = "NNL2AA1  BBE3AA1  1 - curative"
[main] INFO  c.p.o.commons.logs.RaoBusinessLogs - Cost before RAO = 590.00 (functional: 590.00, virtual: 0.00), cost after RAO = -0.00 (functional: -0.00, virtual: 0.00)
```

The final cost of the RAO is 0 which represents the worst margin on all CNECs (here it is the CNEC at the outage
instant). Because this cost is non-positive, it ensures that the network is indeed secure.

# Full example

This entire tutorial is condensed into the following Java code snippet so that you can simply copy and paste it.

```java
package org.example;

import com.powsybl.iidm.network.Network;
import com.powsybl.loadflow.LoadFlowParameters;
import com.powsybl.openrao.commons.Unit;
import com.powsybl.openrao.data.cracapi.Crac;
import com.powsybl.openrao.data.cracapi.CracFactory;
import com.powsybl.openrao.data.cracapi.InstantKind;
import com.powsybl.openrao.data.cracapi.cnec.Side;
import com.powsybl.openrao.data.cracapi.networkaction.ActionType;
import com.powsybl.openrao.data.cracapi.range.RangeType;
import com.powsybl.openrao.data.cracapi.usagerule.UsageMethod;
import com.powsybl.openrao.data.craccreation.util.iidm.IidmPstHelper;
import com.powsybl.openrao.data.raoresultapi.RaoResult;
import com.powsybl.openrao.raoapi.Rao;
import com.powsybl.openrao.raoapi.RaoInput;
import com.powsybl.openrao.raoapi.parameters.LoadFlowAndSensitivityParameters;
import com.powsybl.openrao.raoapi.parameters.ObjectiveFunctionParameters;
import com.powsybl.openrao.raoapi.parameters.RangeActionsOptimizationParameters;
import com.powsybl.openrao.raoapi.parameters.RaoParameters;
import com.powsybl.sensitivity.SensitivityAnalysisParameters;

public class Main {

    public static void main(String[] args) {
        // Import network from UCTE file
        String networkFilename = "12NodesProdNL.uct";
        Network network = Network.read(networkFilename, Main.class.getResourceAsStream("/%s".formatted(networkFilename)));

        // Initialise CRAC
        Crac crac = CracFactory.findDefault().create("crac");

        // Create instants
        crac.newInstant("preventive", InstantKind.PREVENTIVE)
            .newInstant("outage", InstantKind.OUTAGE)
            .newInstant("curative", InstantKind.CURATIVE);

        // Add contingency
        crac.newContingency()
            .withId("contingency")
            .withNetworkElement("DDE2AA1  NNL3AA1  1")
            .add();

        // Add FlowCNECs
        crac.newFlowCnec()
            .withId("NNL2AA1  BBE3AA1  1 - preventive")
            .withInstant("preventive")
            .withOptimized()
            .withNetworkElement("NNL2AA1  BBE3AA1  1")
            .newThreshold()
            .withMin(-410d)
            .withMax(+410d)
            .withUnit(Unit.MEGAWATT)
            .withSide(Side.LEFT)
            .add()
            .add();

        crac.newFlowCnec()
            .withId("NNL2AA1  BBE3AA1  1 - outage")
            .withInstant("outage")
            .withOptimized()
            .withContingency("contingency")
            .withNetworkElement("NNL2AA1  BBE3AA1  1")
            .newThreshold()
            .withMin(-1000d)
            .withMax(+1000d)
            .withUnit(Unit.MEGAWATT)
            .withSide(Side.LEFT)
            .add()
            .add();

        crac.newFlowCnec()
            .withId("NNL2AA1  BBE3AA1  1 - curative")
            .withInstant("curative")
            .withOptimized()
            .withContingency("contingency")
            .withNetworkElement("NNL2AA1  BBE3AA1  1")
            .newThreshold()
            .withMin(-410d)
            .withMax(+410d)
            .withUnit(Unit.MEGAWATT)
            .withSide(Side.LEFT)
            .add()
            .add();

        // Add PST range action (PRA + CRA)
        IidmPstHelper iidmPstHelper = new IidmPstHelper("BBE2AA1  BBE3AA1  1", network);

        crac.newPstRangeAction()
            .withId("pst-range-action")
            .withNetworkElement("BBE2AA1  BBE3AA1  1")
            .withInitialTap(iidmPstHelper.getInitialTap())
            .withTapToAngleConversionMap(iidmPstHelper.getTapToAngleConversionMap())
            .newTapRange()
            .withMinTap(-16)
            .withMaxTap(16)
            .withRangeType(RangeType.ABSOLUTE)
            .add()
            .newOnInstantUsageRule()
            .withInstant("preventive")
            .withUsageMethod(UsageMethod.AVAILABLE)
            .add()
            .add();

        // Add auto topological action
        crac.newNetworkAction()
            .withId("topological-action")
            .newTopologicalAction()
            .withNetworkElement("NNL2AA1  BBE3AA1  2")
            .withActionType(ActionType.CLOSE)
            .add()
            .newTopologicalAction()
            .withNetworkElement("NNL2AA1  BBE3AA1  3")
            .withActionType(ActionType.CLOSE)
            .add()
            .newOnContingencyStateUsageRule()
            .withInstant("curative")
            .withContingency("contingency")
            .withUsageMethod(UsageMethod.AVAILABLE)
            .add()
            .add();

        // Parameters

        LoadFlowParameters loadFlowParameters = new LoadFlowParameters();
        loadFlowParameters.setDc(true);
        loadFlowParameters.setBalanceType(LoadFlowParameters.BalanceType.PROPORTIONAL_TO_LOAD);

        SensitivityAnalysisParameters sensitivityAnalysisParameters = new SensitivityAnalysisParameters();
        sensitivityAnalysisParameters.setLoadFlowParameters(loadFlowParameters);

        LoadFlowAndSensitivityParameters loadFlowAndSensitivityParameters = new LoadFlowAndSensitivityParameters();
        loadFlowAndSensitivityParameters.setLoadFlowProvider("OpenLoadFlow");
        loadFlowAndSensitivityParameters.setSensitivityWithLoadFlowParameters(sensitivityAnalysisParameters);

        ObjectiveFunctionParameters objectiveFunctionParameters = new ObjectiveFunctionParameters();
        objectiveFunctionParameters.setType(ObjectiveFunctionParameters.ObjectiveFunctionType.MAX_MIN_MARGIN_IN_MEGAWATT);
        objectiveFunctionParameters.setPreventiveStopCriterion(ObjectiveFunctionParameters.PreventiveStopCriterion.SECURE);
        objectiveFunctionParameters.setCurativeStopCriterion(ObjectiveFunctionParameters.CurativeStopCriterion.SECURE);

        RaoParameters raoParameters = new RaoParameters();
        raoParameters.setLoadFlowAndSensitivityParameters(loadFlowAndSensitivityParameters);
        raoParameters.setObjectiveFunctionParameters(objectiveFunctionParameters);
        raoParameters.getRangeActionsOptimizationParameters().setPstModel(RangeActionsOptimizationParameters.PstModel.APPROXIMATED_INTEGERS);

        // Run RAO

        RaoInput.RaoInputBuilder raoInputBuilder = RaoInput.build(network, crac);
        RaoResult raoResult = Rao.find().run(raoInputBuilder.build(), raoParameters);
    }
}

```

# Conclusion

Congratulations! You now know how to run a simple RAO.