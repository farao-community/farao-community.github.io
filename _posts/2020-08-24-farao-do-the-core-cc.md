---
layout: post
title: FARAO optimizes the remedial action for the capacity calculation of the CORE region
category: news
feature-img: "assets/img/Hans_Otto_Theater_Potsdam_-_fake_colors_cut.jpg"
tags: [RAO, FARAO, release, CORE]
excerpt_separator: <!--more-->
---

FARAO v2.1.1 has been recently released. FARAO v2.1.1 notably includes all the featues which were planned in the July's milestone of our [roadmap](/roadmap) <!--more-->, that is to say:

- Optimisation of preventive PST and topological remedial actions
- Two possible objective functions : min. margin positive or min. margin maximized
- Branch monitored in one or both directions, with thresholds defined in MW, I or %Imax
- Branch monitored in N and N-1 states
- AC and DC computations (for load flow and sensitivity analyses)
- Limitation of loopflows in the RAO

With in addition another key feature: the consideration of MNEC (Monitored Network Element) in the optimisation. The Crac importers has been also improved, with some new developpement enabling to efficiently read real data in the standard file formats used for the capacity calculation of CORE, with hundreds of contingencies and thousands of Cnec.

Moreover, before its release, the RAO has been tested on several timestamps of the CORE capacity calculation process. The results of the first remedial action optimisations are very satisfying, and allow to increase the room for power exchanges between CORE countries, while making sure that the loop-flows does not exceed a given threshold, and that the MNECs keep a positive margin.

Our efforts in designing and developping FARAO are still ongoing, and [new features](/roadmap) are yet to come in your favorite remedial action optimizer ! 

More information about FARAO v2.1.1 can be found in the [release note](https://github.com/farao-community/farao-core/releases/tag/v2.1.0)
 
For any question, don't hesitate to contact us using the [FARAO Spectrum community](https://spectrum.chat/farao-community).
