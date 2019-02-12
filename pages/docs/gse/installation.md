---
layout: page
title: GSE installation guide
permalink: /docs/gse/installation
hide: true
feature-img: "assets/img/Hans_Otto_Theater_Potsdam_-_fake_colors_cut.jpg"
tags: [Docs]
---

Below is the installation guide of FARAO GSE from its sources.

FARAO GSE is is currently only available on Linux, because there is no load-flow engine that runs on Windows
currently integrated in PowSyBl framework.

## Requirements
In order to build **farao-gse**, you need the following environment available:
  - Install JDK *(1.8 or greater)*
  - Install Java FX
  - Install Maven latest version

## Install
To build farao-gse, just do the following:

```
$> git clone https://github.com/farao-community/farao-gse.git
$> cd farao-gse
$> ./install.sh
```

FARAO also needs a load-flow engine and a sensitivity calculation engine.

Hades2 tool from RTE is available as a freeware for demonstration purpose.
Fir more information about how to get and install Hades2 lodflow, please refer to the
[dedicated documentation](https://rte-france.github.io/hades2/index.html)

## Configure your itools platform
In order for FARAO to run without error, you will need to configure your itools platform.

Two options are available:
1.  First, you can use the one provided by FARAO. It is saved in the *etc* directory of the installation, and is called *config.yml*.
You just have to copy-paste it in **$HOME/.itools** directory. 

2.  Expert users can also adapt it to their own needs.

## Launching FARAO GSE application
```bash
cd <install-prefix>/bin
./farao-gse-launcher
```
