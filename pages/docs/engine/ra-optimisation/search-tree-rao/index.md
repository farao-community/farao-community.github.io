---
layout: page
title: Search Tree engine
permalink: /docs/engine/ra-optimisation/search-tree-rao
hide: true
feature-img: "assets/img/Hans_Otto_Theater_Potsdam_-_fake_colors_cut.jpg"
tags: [Docs]
---

To solve the combinatorial problem of optimizing topological remedial actions, FARAO uses a greedy search tree heuristic.

## Greedy search tree algorithm

### Constructing the tree

Each node of the tree corresponds to a set of topological remedial actions, which are applied to the original network.
The root of the tree has an empty set of remedial actions. We then construct all the possible children of the root node by adding
a single remedial action to the set. We evaluate all these nodes and keep the one with the best objective function value.

Once again we construct all the possible children of that best node by adding another remedial action to the set, 
evaluate them, and keep the best one.

We continue until one of the stop criteria is met, or until we have reached the end of the tree (every topological remedial 
action applied to a single network variant).

### Evaluating the nodes

To evaluate the nodes, the user may specify what range action RAO computation provider they wish to use.

For instance they may use the [default Linear RAO provider](linear-rao). This will optimize the remedial actions 
which can take a value in a given range (like a PST), for the given network situation.

Once this computation is done, the node is given a cost which depends on the objective function which was chosen.

**Configuration**

```yaml
search-tree-rao-parameters:
    range-action-rao: LinearRao
```

### Stop criteria

Several criteria can be defined for the same search tree.

* **Positive margin**
The heuristic ends as soon as every constraint is satisfied (ie we have a positive margin on every constrained network element).

* **Maximum depth**
The heuristic ends as soon as we reach a depth defined by the user.
For instance if we set a maximum depth of 5 then the heuristic will not try to apply more than 5 topological remedial 
actions to a single network variant.

* **Minimal improvement** 
The heuristic will continue as long as we improve the cost by a margin defined by the user.
If this is set to 0, then the heuristic will continue until no child node improves the solution, or until another criterion
is met.

By default the stop criteria are a positive margin and a minimal improvement of 0.


## Configuration

To run the RAO search tree heuristic, one has to specify it as the default rao.

**YAML version**

```yaml
rao:
    default: SearchTreeRao
```
