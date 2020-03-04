---
layout: page
title: Search Tree engine
permalink: /docs/engine/ra-optimisation/search-tree-rao
hide: true
feature-img: "assets/img/Hans_Otto_Theater_Potsdam_-_fake_colors_cut.jpg"
tags: [Docs]
---

To solve the combinatorial problem of optimizing topological remedial actions, FARAO uses a greedy search tree heuristic.

## Greedy search tree heuristic

### Constructing the tree

Each node of the tree corresponds to a set of topological remedial actions, which are applied to the original network.

The node at the root of the tree has an empty set of remedial actions. We then construct all the possible children of the 
root node by adding a single remedial action to the set. We evaluate all these nodes and keep the one with the best
cost.

Afterwards, we construct all the possible children of that best node by adding another remedial action to the set, evaluate them,
and keep the best one.

We continue until one of the stop criteria is met, or until we have reached the end of the tree (every topological remedial 
action applied to a single network variant).

### Evaluating the nodes

To evaluate the nodes, the user may specify what range action RAO computation provider they wish to use.

For instance they may use the [default linear RAO provider](linear-rao). This will optimize the remedial actions 
which can take a value in a given range (like a PST), for the given network situation. (If the user does not wish
to optimize the range actions, he can configure the default linear RAO provider to only do a network analysis.)

Once this computation is done, the node is assigned a cost which depends on the objective function which was chosen.
(By default the cost is the opposite of the minimal margin, eg if the minimal margin is -20MW then the cost will be 20.)

**Configuration YAML**

```yaml
search-tree-rao-parameters:
    range-action-rao: LinearRao
```

**Configuration XML**

```xml
<search-tree-rao-parameters>
    <range-action-rao>LinearRao</range-action-rao>
</search-tree-rao-parameters>
```

### Stop criteria

Several criteria can be defined for the same search tree.

* **Positive min margin :**
The heuristic ends as soon as every constraint is satisfied (ie we have a positive margin on every monitored network element).

* **Maximum depth :**
The heuristic ends as soon as we reach a depth defined by the user.
For instance if we set a maximum depth of 5 then a node with 5 topological remedial actions will not have any children and 
the heuristic will end there.

* **Minimal improvement :** 
The heuristic will continue as long as we improve the cost by a margin defined by the user.
If this is set to 0, then the heuristic will continue until no child node improves the solution, or until another criterion
is met.

By default the stop criteria are a positive margin and a minimal improvement of 0.

**Configuration**

not yet implemented

## Configuration

To run the RAO search tree heuristic, one has to specify it as the default rao.

**YAML version**

```yaml
rao:
    default: SearchTreeRao
```

**XML version** 
```xml
<rao>
    <default>SearchTreeRao</default>
</rao>
```
