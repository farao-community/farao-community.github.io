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
summary-hmax: 0
---

# Run a RAO without importing a CRAC file

In this tutorial, we will see how to run a simple RAO from a network file and a CRAC. The CRAC will be created from
scratch using the Java API so there is no need to import a CRAC file.

## Set-up

For this tutorial, we'll need Java 17 and we'll create a new project called `org.example` and work on its `Main` class.
For everything to work properly, you also need to install the latest versions
of [PowSyBl core](https://github.com/powsybl/powsybl-core)
and [PowSyBl Open Rao](https://github.com/powsybl/powsybl-open-rao).

## Import network file

The first step is to import a network for the simulation. As an example, we will consider the following 12-nodes UCTE
network that is made of 16 lines including 1 PST spread over 4 countries.

```
##C 2007.05.01
##N
##ZBE
BBE1AA1  BE1          0 2 400.00 2500.00 0.00000 -1500.0 0.00000 9000.00 -9000.0 9000.00 -9000.0
BBE2AA1  BE2          0 2 400.00 1000.00 0.00000 -3000.0 0.00000 9000.00 -9000.0 9000.00 -9000.0
BBE3AA1  BE3          0 2 400.00 1500.00 0.00000 -2500.0 0.00000 9000.00 -9000.0 9000.00 -9000.0
##ZDE
DDE1AA1  DE1          0 2 400.00 3500.00 0.00000 -2500.0 0.00000 9000.00 -9000.0 9000.00 -9000.0
DDE2AA1  DE2          0 2 400.00 3000.00 0.00000 -2000.0 0.00000 9000.00 -9000.0 9000.00 -9000.0
DDE3AA1  DE3          0 2 400.00 2000.00 0.00000 -1500.0 0.00000 9000.00 -9000.0 9000.00 -9000.0
##ZFR
FFR1AA1  FR1          0 2 400.00 1000.00 0.00000 -2000.0 0.00000 9000.00 -9000.0 9000.00 -9000.0
FFR2AA1  FR2          0 2 400.00 3500.00 0.00000 -2000.0 0.00000 9000.00 -9000.0 9000.00 -9000.0
FFR3AA1  FR3          0 2 400.00 1500.00 0.00000 -3000.0 0.00000 9000.00 -9000.0 9000.00 -9000.0
##ZNL
NNL1AA1  NL1          0 2 400.00 1000.00 0.00000 -1500.0 0.00000 9000.00 -9000.0 9000.00 -9000.0
NNL2AA1  NL2          0 2 400.00 1000.00 0.00000 -500.00 0.00000 9000.00 -9000.0 9000.00 -9000.0
NNL3AA1  NL3          0 2 400.00 2500.00 0.00000 -2000.0 0.00000 9000.00 -9000.0 9000.00 -9000.0
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
NNL2AA1  BBE3AA1  1 0 0.0000 10.000 0.000000   5000
BBE2AA1  FFR3AA1  1 0 0.0000 10.000 0.000000   5000
##T
BBE2AA1  BBE3AA1  1 0 400.0 400.0 1000. 0.0000 10.000 0.000000 0.0	     5000 PST
##R
BBE2AA1  BBE3AA1  1                    -0.68 90.00 16 0         SYMM

```

Copy and paste the network data in a file named `12Nodes.uct` that you shall store in the resources directory of the
project. The network can be imported using [PowSyBl](https://www.powsybl.org/index.html):

```
String networkFilename = "12Nodes.uct";
Network network = Network.read(networkFilename, Main.class.getResourceAsStream("/%s".formatted(networkFilename)));
```

## Create CRAC

The [CRAC](/docs/input-data/crac/crac) is the data object that contains all the key information for the RAO, i.e. the
contingencies to simulate, the CNECs to optimise and the remedial actions to apply. The RAO's Java API allows users to
manually fill the CRAC with all the required and desired data.

The first step is to instantiate the CRAC using a `CracImpl` object:

```
CracImpl crac = new CracImpl("crac");
```

Once created, the CRAC can be filled sequentially (some data must be provided before others for logical reasons).

### Create contingencies

The first data to provide are the [contingencies](/docs/input-data/crac/json#contingencies), i.e. the incidents that can
occur on the network. Each contingency will be simulated during the optimisation to ensure that there is a set of
remedial actions that can solve constraints introduced by the contingency.

A contingency can be added to the CRAC using the `newContingency` adder method. The identifier of the contingency must
be provided alongside the impacted network element(s).

> For our example, we only create one contingency corresponding to an outage on the line _FFR1AA1 FFR2AA1_.

```
crac.newContingency()
        .withId("contingency")
        .withNetworkElement("FFR1AA1  FFR2AA1")
        .add();
```

### Add instants

Once the contingencies are added, we can now create the different [instants](/docs/input-data/crac/json#instants-states)
of the optimisation process. An instant is added thanks to the `newInstant` method. Both an identifier and
an `InstantKind` (`PREVENTIVE`, `OUTAGE`, `AUTO` or `CURATIVE`) must be provided. The instants must also be declared in
**chronological order**.

> For our example, we will create 4 instants (one of each kind).

```
crac.newInstant("preventive", InstantKind.PREVENTIVE)
        .newInstant("outage", InstantKind.OUTAGE)
        .newInstant("auto", InstantKind.AUTO)
        .newInstant("curative", InstantKind.CURATIVE);
```

Now that contingencies and instants are all set, we can start adding CNECs and remedial actions to the CRAC.

### Create FlowCNECs

The next step is to create the [CNECs](/docs/input-data/crac/json#cnecs). For our example and given the simple network
we are using, we will only consider [FlowCNECs](/docs/input-data/crac/json#flow-cnecs) that correspond to lines in the
network that will have to be optimised flow-wise after contingencies (and in the base case).

The `newFlowCnec` method needs to be called to create a FlowCNEC in the CRAC. Different information must be provided
including the CNEC's identifier, network element, instant and thresholds. For non-preventive CNECs, an associated
contingency must also be provided.

> In our example, we define 3 FlowCNECs:
> - one at the preventive instant on line _FFR1AA1 FFR2AA1 1_
> - one at the auto instant on line _BBE2AA1 BBE3AA1 1_
> - one at the curative instant on line _BBE2AA1 BBE3AA1 1_

```
crac.newFlowCnec()
    .withId("FFR1AA1  FFR2AA1  1 - preventive")
    .withInstant("preventive")
    .withNetworkElement("FFR1AA1  FFR2AA1  1")
    .newThreshold()
        .withMin(-5000d)
        .withMax(+5000d)
        .withUnit(Unit.MEGAWATT)
        .withSide(Side.RIGHT)
        .add()
    .newThreshold()
        .withMin(-5000d)
        .withMax(+5000d)
        .withUnit(Unit.MEGAWATT)
        .withSide(Side.LEFT)
        .add()
    .add();

crac.newFlowCnec()
    .withId("BBE2AA1  BBE3AA1  1 - auto")
    .withInstant("auto")
    .withContingency("contingency")
    .withNetworkElement("BBE2AA1  BBE3AA1  1")
    .newThreshold()
        .withMin(-5000d)
        .withMax(+5000d)
        .withUnit(Unit.MEGAWATT)
        .withSide(Side.RIGHT)
        .add()
    .newThreshold()
        .withMin(-7500d)
        .withMax(+7500d)
        .withUnit(Unit.MEGAWATT)
        .withSide(Side.LEFT)
        .add()
    .add();

crac.newFlowCnec()
    .withId("BBE2AA1  BBE3AA1  1 - curative")
    .withInstant("curative")
    .withContingency("contingency")
    .withNetworkElement("BBE2AA1  BBE3AA1  1")
    .newThreshold()
        .withMin(-5000d)
        .withMax(+5000d)
        .withUnit(Unit.MEGAWATT)
        .withSide(Side.RIGHT)
        .add()
    .newThreshold()
        .withMin(-5000d)
        .withMax(+5000d)
        .withUnit(Unit.MEGAWATT)
        .withSide(Side.LEFT)
        .add()
    .add();
```

Finally, we can add remedial actions in the CRAC.

### Create a preventive and a curative PST range action

Let's start with [PST range actions](/docs/input-data/crac/json#range-actions). The network has one PST (_BBE2AA1
BBE3AA1 1_) that we can use to define these range actions. A PST range action can be added to the CRAC with
the `newPstRangeAction` method. The identifier of the remedial action, the network element it is acting on and the tap
range can be provided directly. For the initial tap and the tap-to-angle conversion map, it is easier to rely on
an `IidmPstHelper` which fetches the information in the network.

The usage rules must also be added to tell the RAO in which context the remedial can or must be applied.

> For our example, let us create two usage rules:
> - one _onInstant_ usage rule at the preventive instant making the PST range action available in the preventive instant
> - one _onContingencyState_ usage rule for the already defined contingency to make the PST range action available after
    said contingency occurred on the network

```java
IidmPstHelper iidmPstHelper = new IidmPstHelper("BBE2AA1  BBE3AA1  1", network);

crac.newPstRangeAction()
    .withId("pst-range-action")
    .withNetworkElement("BBE2AA1  BBE3AA1  1")
    .withInitialTap(iidmPstHelper.getInitialTap())
    .withTapToAngleConversionMap(iidmPstHelper.getTapToAngleConversionMap())
    .newTapRange()
        .withMinTap(-5)
        .withMaxTap(10)
        .withRangeType(RangeType.ABSOLUTE)
        .add()
    .newOnInstantUsageRule()
        .withInstant("preventive")
        .withUsageMethod(UsageMethod.AVAILABLE)
        .add()
    .newOnContingencyStateUsageRule()
        .withInstant("curative")
        .withContingency("contingency")
        .withUsageMethod(UsageMethod.AVAILABLE)
        .add()
    .add();
```

### Create an auto topological action

We can finish by adding a topological action to the CRAC, using the `newNetworkAction` method and
the `newTopologicalAction` adder, and providing an action type (i.e. open or close) and a line on which apply this
action. For illustrative purposes, let us make an auto remedial action from this remedial action. To do so, an
_onContingencyState_ usage rule at the _auto_ instant must be defined with a _FORCED_ usage method.

```
crac.newNetworkAction()
        .withId("topological-action")
        .newTopologicalAction()
            .withNetworkElement("FFR1AA1  FFR2AA1  1")
            .withActionType(ActionType.OPEN)
            .add()
        .newOnContingencyStateUsageRule()
            .withInstant("auto")
            .withContingency("contingency")
            .withUsageMethod(UsageMethod.FORCED)
            .add()
        .add();
```

We are almost there! The CRAC is complete and the RAO is almost ready to run. Let us see how to do this in the following
section.

## Run the RAO

A last pre-processing step is required to run the RAO. The network and the CRAC must be processed together as
a `RaoInput`. This is achieved through a `RaoInputBuilder`.

```
RaoInput.RaoInputBuilder raoInputBuilder = RaoInput.build(network,crac);
```

To run, the RAO also requires `RaoParameters` to properly set its desired behaviour. For our example, the default
parameters will be fully sufficient.

Thus, using both our `RaoInputBuilder` and the default parameters, we can run the RAO and store the optimisation results
in a [`RaoResult`](/docs/output-data/rao-result-json) object for further use or data export.

```java
RaoResult raoResult = Rao.find().run(raoInputBuilder.build(), new RaoParameters());
```

## Full example

This entire tutorial is condensed into the following Java code snippet so that you can simply copy and paste it.

```java
package org.example;

import com.powsybl.iidm.network.Network;
import com.powsybl.openrao.commons.Unit;
import com.powsybl.openrao.data.cracapi.InstantKind;
import com.powsybl.openrao.data.cracapi.cnec.Side;
import com.powsybl.openrao.data.cracapi.networkaction.ActionType;
import com.powsybl.openrao.data.cracapi.range.RangeType;
import com.powsybl.openrao.data.cracapi.usagerule.UsageMethod;
import com.powsybl.openrao.data.craccreation.util.iidm.IidmPstHelper;
import com.powsybl.openrao.data.cracimpl.CracImpl;
import com.powsybl.openrao.data.raoresultapi.RaoResult;
import com.powsybl.openrao.raoapi.Rao;
import com.powsybl.openrao.raoapi.RaoInput;
import com.powsybl.openrao.raoapi.parameters.RaoParameters;

public class Main {
    public static void main(String[] args) {
        // Import network from UCTE file
        String networkFilename = "12Nodes.uct";
        Network network = Network.read(networkFilename, Main.class.getResourceAsStream("/%s".formatted(networkFilename)));

        // Initialise CRAC
        CracImpl crac = new CracImpl("crac");

        // Create instants
        crac.newInstant("preventive", InstantKind.PREVENTIVE)
                .newInstant("outage", InstantKind.OUTAGE)
                .newInstant("auto", InstantKind.AUTO)
                .newInstant("curative", InstantKind.CURATIVE);

        // Add contingency
        crac.newContingency()
                .withId("contingency")
                .withNetworkElement("FFR1AA1  FFR2AA1  1")
                .add();

        // Add FlowCNECs
        crac.newFlowCnec()
                .withId("FFR1AA1  FFR2AA1  1 - preventive")
                .withInstant("preventive")
                .withNetworkElement("FFR1AA1  FFR2AA1  1")
                .newThreshold()
                .withMin(-5000d)
                .withMax(+5000d)
                .withUnit(Unit.MEGAWATT)
                .withSide(Side.RIGHT)
                .add()
                .newThreshold()
                .withMin(-5000d)
                .withMax(+5000d)
                .withUnit(Unit.MEGAWATT)
                .withSide(Side.LEFT)
                .add()
                .add();

        crac.newFlowCnec()
                .withId("BBE2AA1  BBE3AA1  1 - auto")
                .withInstant("auto")
                .withContingency("contingency")
                .withNetworkElement("BBE2AA1  BBE3AA1  1")
                .newThreshold()
                .withMin(-5000d)
                .withMax(+5000d)
                .withUnit(Unit.MEGAWATT)
                .withSide(Side.RIGHT)
                .add()
                .newThreshold()
                .withMin(-5000d)
                .withMax(+5000d)
                .withUnit(Unit.MEGAWATT)
                .withSide(Side.LEFT)
                .add()
                .add();

        crac.newFlowCnec()
                .withId("BBE2AA1  BBE3AA1  1 - curative")
                .withInstant("curative")
                .withContingency("contingency")
                .withNetworkElement("BBE2AA1  BBE3AA1  1")
                .newThreshold()
                .withMin(-5000d)
                .withMax(+5000d)
                .withUnit(Unit.MEGAWATT)
                .withSide(Side.RIGHT)
                .add()
                .newThreshold()
                .withMin(-5000d)
                .withMax(+5000d)
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
                .withMinTap(-5)
                .withMaxTap(10)
                .withRangeType(RangeType.ABSOLUTE)
                .add()
                .newOnInstantUsageRule()
                .withInstant("preventive")
                .withUsageMethod(UsageMethod.AVAILABLE)
                .add()
                .newOnContingencyStateUsageRule()
                .withInstant("curative")
                .withContingency("contingency")
                .withUsageMethod(UsageMethod.AVAILABLE)
                .add()
                .add();

        // Add auto topological action
        crac.newNetworkAction()
                .withId("topological-action")
                .newTopologicalAction()
                .withNetworkElement("FFR1AA1  FFR2AA1  1")
                .withActionType(ActionType.OPEN)
                .add()
                .newOnContingencyStateUsageRule()
                .withInstant("auto")
                .withContingency("contingency")
                .withUsageMethod(UsageMethod.FORCED)
                .add()
                .add();

        // Run RAO and retrieve raoResult
        RaoInput.RaoInputBuilder raoInputBuilder = RaoInput.build(network, crac);
        RaoResult raoResult = Rao.find("SearchTreeRao").run(raoInputBuilder.build(), new RaoParameters());
    }
}
```

## Conclusion

Congratulations! You now know how to run a simple RAO.