---
layout: page
title: Roadmap
hide: false
permalink: /roadmap/
feature-img: "assets/img/Hans_Otto_Theater_Potsdam_-_fake_colors_cut.jpg"
---

Below is the roadmap of future major releases of FARAO, with the associated functional perimeter,
and a foreseen due date. It is important to understand that these due dates may be subject to
change due to unforeseen complexity in implementing features or priority changes. 

### First optimiser release: v*1.0.0* (December 2018)

- Simple CRAC model
- **XLSX** CRAC file importer
- Closed optimisation engine
- Closed optimisation plugins for PST taps & redispatch cost minimization
- Simple RAO results model
- JSON RAO results exporter
- **CSVs** RAO results exporter
- Study environment based on PowSyBl GSE framework

### Partial release of the search-tree RAO: v*2.0.0* (March 2020) - *FARAO Black Forest cake*

- Optimisation of **preventive** PST and **topological** remedial actions
- **Objective function** : maximize (min. margin)
- Branch monitored in both directions, with **thresholds defined in MW**
- Branch monitored in **N and N-1 states**
- **AC computations** (for load flow and sensitivity analyses)


### First operational release of the search-tree RAO: v*3.0.0* (July 2020) - *FARAO Cinnamon roll*

- Optimisation of **preventive** PST and **topological** remedial actions
- **Two possible objective functions** : maximize (min. margin) and maximize (pos. margin)
- Branch monitored in one or both directions, with **thresholds defined in MW, I or %Imax**
- Branch monitored in **N and N-1 states**
- **AC and DC computations** (for load flow and sensitivity analyses)
- Limitation of **loopflows** in the RAO, as described in the ACER methodology

### Enhancement of the search-tree RAO to fit CORE j-2 CC needs: v*4.0.0* (December 2020) - *FARAO Dobos torte*

- Optimisation of **curative** PST and topological remedial actions
- rest of the scope yet to be defined
