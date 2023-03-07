---
layout: home
permalink: /
feature-img: "assets/img/farao.png"
logo: "assets/img/logos/farao.png"
hide: true
---

Open-source project aiming at providing an efficient solution for electrical power systems'
Coordinated Capacity Calculation, Local Security Analysis and Coordinated Security Analysis.

# Why choose FARAO?
Because we are convinced that sharing our expertise and knowledge is the most efficient way for 
a successful energy transition and creation of a common European market. By contributing to Farao, 
all can benefit from this collaborative project amongst different national expertise on system operation, 
without neglecting national specificities due to structural differences in network development between countries.

Results of remedial actions optimisation strongly impact the social economical welfare and the congestion costs.

How remedial actions are optimised can:
- avoid TSOs the need to invest in new infrastructure
- improve market prices formation and contribute to price convergence on the long term
- ease the integration of renewable energies
- reduce the costs due to national tariff

By providing a modular and open source tool, FARAO aims to :
- increase the global social economical welfare
- reduce the redispatching/contertrading costs
- ease the monitoring by national and european regulatory authorities by offering a transparent implementation 
of the methodologies approved

Unlike tools developed as a "black box", any interested actor can ensure its specifications are properly implemented; 
this also helps operators to make this tool their own.

Due to multiple specificities between Capacity Calculation Regions and/or control area in terms of remedial actions, 
FARAO offers a highly configurable solution and a collaborative approach where any actor (TSOs, NRAs, universities...)
can contribute to improve the tool for the benefits of the European community or adapt it to their local specificities.

The application of FARAO is not limited to Regional Coordination Centers Services, namely Coordinated Capacity 
Calculation and Coordinated Security Analysis. It could also be used by TSOs for local Security Analysis (for instance, 
local validation of the 70% margin required by the Clean Energy Package) or studies related to bidding zone review.

Transparency is in the DNA of this project. Functional and technical specifications, project's roadmap, code and its 
level of quality are vailable on the website and updated frequently.

As Entso-e stated in 2020 [Annual Work Programme](https://eepublicdownloads.entsoe.eu/clean-documents/Publications/ENTSO-E%20general%20publications/200217_ENTSO-E_Annual%20Work%20Programme%202020%20(final).pdf):
> The future of regional TSO coordination and focus of the RCCs in the next years will be strongly driven by
> the integration of costly remedial actions in complex capacity calculation methodologies [...].
>
> Transparency and timely implementation of the [...] Network Codes are seen as paramount for
> achieving the optimal integration of the European market.

# Under the hood
FARAO is based on high quality open source frameworks.

{:refdef: style="text-align: center;"}
![PowSyBl logo](../assets/img/logos/logo_lfe_powsybl.svg){: width="600px"}
{: refdef}

[PowSyBl](https://www.powsybl.org/) is an open source Java library to assemble applications
for electrical power systems' simulation and analysis. This project is part of Linux Foundation
[LF Energy initiative](https://www.lfenergy.org/). Thanks to its internal IIDM format, FARAO is 
natively compatible with both UCTE and CGMES network formats.


{:refdef: style="text-align: center;"}
![OR-Tools logo](../assets/img/logos/DuoN35ZXgAAKzC_.jpg){: width="600px"}
{: refdef}

[OR-Tools](https://developers.google.com/optimization) is an open source software suite for
optimisation, tuned for tackling the world's toughest problems in vehicle routing, flows,
integer and linear programming, and constraint programming. 
The choice of Google OR-tools was driven by its large compatibility with most of existing open source/commercial solvers,
including commercial solvers such Gurobi and Xpress when high performance is required.

{:refdef: style="text-align: center;"}
![Docker logo](../assets/img/logos/horizontal-logo-monochromatic-white.png){: width="600px"}
{: refdef}

[Docker](https://www.docker.com/) is an open source container platform that packages applications as
lightweight, portable containers. 

{:refdef: style="text-align: center;"}
![Kubernetes logo](../assets/img/logos/kubernetes.png){: width="500px"}
{: refdef}

[Kubernetes](https://kubernetes.io/), also known as K8s, is an open-source system for automating deployment, scaling, and management of containerized applications.

