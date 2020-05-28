---
layout: page
title: Search tree RAO
permalink: /docs/engine/ra-optimisation/search-tree-rao
hide: true
feature-img: "assets/img/Hans_Otto_Theater_Potsdam_-_fake_colors_cut.jpg"
tags: [Docs, Search Tree RAO]
---
FARAO search-tree is initially designed to optimize non-costly remedial actions (including generation unit trip 
where applicable).

Unlike purely linear optimization, a search-tree algorithm does not neglect the non-linearity of efficient remedial 
actions such as curative and preventive topological actions. Incorrect modeling of remedial actions such as topological 
remedial actions could lead to over or underestimate their impact and then result in a biased network situation that 
could endanger the system security.

So far, the search-tree algorithm has proved for many years its relevance and efficiency on current daily 
operational process on CWE, Northern Italy and SWE Capacity calculation. 

For each topological remedial action applied, the search-tree will systematically optimize PST taps/HVDC
by applying a linear optimization. By optimizing topological remedial actions and linear remedial actions at
the same time, this ensures better optimality of the results.

The optimization problem is a non-convex and non-linear one, dealing with topology changes on the network, which 
represent discrete actions by definition. The problem treated by the optimizer is a combinatorial problem.
Search-tree algorithms are commonly used for high complexity mathematical problems, containing combinatorial and 
discrete aspects. One of the main interest of such an approach is that it avoids combinatorial explosion of computation 
time and memory usage, without adding any approximation to the grid behaviour.

Some remedial actions such as PSTs/HVDC are treated via a linear optimization. It has to be noticed that approximation 
of discrete PST taps treated as linear variable can be valid in DC but a security analysis is performed by FARAO after 
their optimization to ensure security of the grid despite of the approximation.


### Higher grid security

A search-tree algorithm will optimize all couples of critical branches and critical outages to define a set of remedial 
actions covering all these network states. This limits the dependency to net position forecast of which the accuracy is 
highly uncertain due to deviations of generation from renewable sources or unforeseen events (crisis,…).

For example, let’s assume there is no existing PRA for simplicity reasons and focus on the CNEC with the minimum 
relative margin (CNE1C1). The optimizer will search for CRA increasing margin of CNE1C1. However, considering only 
CNE1C1 could be relevant if and only if there is a high reliability and accuracy of net position forecast.
As stated before, this could not be acceptable for the security of the system. That is why the search tree will 
also identify optimized remedial actions for CNE1C2, CNE1C3…

### Remedial actions considered

For Capacity calculation process, FARAO search-tree considers the following remedial actions :
- Preventive remedial actions (fully shared) hereafter “PRA” 
- Curative remedial actions (shared after critical outage) hereafter “CRA”

### Linear Remedial actions

The impact of some types of remedial actions on flows could be considered to be linear: optimization of HVDC setpoints 
and optimization of generation unit setpoints. In addition to these, FARAO search-tree also considers phase shifter 
transformers as linear remedial actions.

A phase shifter transformer (PST) is defined by its range of acceptable tap settings.
This acceptable tap setting can be defined by three different ways:
- a range of tap positions relatively to the neutral tap position of the PST (e-g +6/-6 around the neutral tap position)
- a range of tap positions relatively to the tap position of the PST as described in the grid model
- in curative: a range of tap positions relatively to the optimised tap position of the PST in preventive (e-g +4/-4 
around the tap position selected in preventive)

### Non-linear remedial action

Topological and other discrete remedial actions are considered without any approximation, and can be optimized in both 
instants (preventive or curative). This is a non-exhaustive list of discrete remedial actions considered by FARAO 
search-tree :
- Change of circuit breaker position (open/close): line opening or busbar coupler opening/closing
- Change of switch position

As a matter of clarification, connecting/disconnecting a generation unit can also be considered by FARAO search-tree 
for Capacity calculation (without element of costs).

### Objective function

#### For Flow-based Capacity calculation – minimum margin

Mathematically speaking, the objective function covered by FARAO search-tree for Flow based Capacity calculation

The active flow $$F_i$$ on a CNEC $$i$$ is:

$$\begin{equation}
F_i = F_{ref_{0,i}} + ( \sum_{j \in J} \Delta\alpha_j * PSDF_{j,i}) + \Delta F_i
\end{equation}$$

With:
- $$F_{ref_{0,i}}$$ the initial active transit on CNEC $$i$$
- $$J$$ the set of all PSTs
- $$PSDF_{j,i}$$ the sensitivity of PST $$j$$ on CNEC $$i$$

And:
- $$\Delta\alpha_j$$ variation angle value of PST $$j$$ (between initial situation and final situation)
- $$\Delta F_i$$ impact of a set of applied non-PST RAs on CNEC $$i$$

Optimization will try to maximize the objective function value, formulated as such:

$$\begin{equation}
OF = min_i(\rho_i * F_{max_i}-F_i)
\end{equation}$$

With :
- For the sake of readability, we consider in the rest of the explanation that the FRM value is already considered in 
F_{max_i}.
- and $$\rho_i = 1 \ \ \forall i\quad$$ if at least one CNEC is in overload  
$$\rho_i = \frac{1}{\sum_{ma}|PTDF_{ma,i}|}\ \ \forall i\quad$$ if all margins are positive, with $$PTDF_{ma,i}$$ the PTDF
of CNEC $$i$$ relatively to a commercial border (zone-to-zone) of the capacity calculation region
 = one commercial border in the capacity calculation region (e-g FR-BE)

The objective function of FARAO search-tree is also configurable. The constraints taken into account within the 
optimization are also configurable in order to comply with process specificities (i.e limitation of loop flows 
required for Flow based CORE Capacity Calculation).


#### For NTC Capacity calculation/CEP Validation

The objective function is ….


For the NTC Capacity calculation, only the positive margin stop criterion is activated. This is equivalent to an 
iterative security analysis at different values of commercial exchanges. It is also valid for the CEP Validation 
performed at national or regional level.

### Inputs

This algorithm acts on sets of states that share common remedial actions, also called **perimeters**.

The main inputs of the algorithm are:
- the network at the root of the perimeter,
- an extract of the original [Crac](/docs/data/crac), containing only the remedial actions that are available in the given perimeter (filtered on usage rules). 

### Stop criterion

For Flow based Capacity calculation, considering that the objective function is the minimum margin (meaning the minimum 
of all flow margins of every CNEC), there are currently two stop criteria, ie two ways to stop the search tree algorithm:
- when the minimum margin is positive, meaning that the network is secured (all the CNEC flows are under line thresholds): **positive margin** stop criterion. 
As mentioned above, for NTC Capacity calculation/ CEP Validation, this stop criterion is applied.
- when the the minimal margin on every CNEC cannot be increased anymore: **maximum margin** stop criterion.


These stop criteria only make sense for a minimum margin objective function (may it be absolute or relative).


On both stop criteria, additional constraints can be added, for example:
- the maximal number of consecutive chosen network actions, also called **search tree depth**,
- the minimal relative gain of objective function between two consecutive network actions (i.e. between two search tree depths).

### Algorithm

![Search tree RAO algorithm](/assets/img/search-tree-rao-algo.png)

