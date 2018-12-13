---
layout: page
title: FARAO-GSE user guide
permalink: /docs/gse/user-guide
hide: true
feature-img: "assets/img/Hans_Otto_Theater_Potsdam_-_fake_colors_cut.jpg"
tags: [Docs]
---

{::options toc_levels="2..3" /}

## Table of contents
{: .no_toc}

- Table of Contents
{:toc}

## FARAO Grid Study Environment

### Overview

At FARAO-GSE startup, the main window appears.

[//]: # (image)

The application bar contains three main buttons:

- ***Create***: Allows to create a new project in the database
- ***Open***: Opens a previously created project
- ***?***: Opens a menu that gives access to user documentation link and about pane

### Projects

The living entity of a study in FARAO-GSE is called a **project**. A project is
an instance that contains all the data needed for your study - network cases,
modification scripts, model launchers, ... A project is needed to be able to
import data in FARAO-GSE, and the data saved in a project are only available in
this project.

You can create as many projects as you want, and it is recommended to create a
different project for each study realised in FARAO-GSE.

> About filesystems
>
> Projects are stored in **filesystems**. A filesystem is an abstraction of a kind of
> database, that is structured like your computer filesystem - with folders and files.
>
> It is possible to configure different types of filesystem in FARAO-GSE (local file system,
> Cassandra database, ...)
>
> By default, the application is configured for using two filesystem:
>
> "**Local**": Your local home directory, available for read only usage (it is not possible
> to create projects in this filesystems)
> "**Database**": A MapDB directory, that is used for storing projects. Projects created
> in this filesystem are stored in a file of your computer (by default the file ***farao-gse.db***
> in your home directory). That way, your projects are saved between each FARAO-GSE execution.
> It means that if you delete this file, everything previously stored and available in FARAO GSE
> will be deleted, and the file will be created again at next launch of the application.
 
#### Project tab overview

Project tab is divided into three main areas:

- Project **Data** pane: the place where your project's data hierarchy is shown. It
allows to organize projects data in a folders hierarchy.
- Project **Tasks** pane: the place where all ongoing project tasks are listed. It
allows to visualize ongoing calculations. 
- Project **Viewing area**: the place where all projects visualization interfaces are
created (input data explorers, output results analyzers, ...). Viewing area can be rearranged,
and visualization tabs can even be deported in new window by a drag&drop outside the viewing area.

#### Creating a new project

In order to create a new project, click on the "Create" button of FARAO-GSE application bar.
A window appears for filling information about the project under creation.

- "**Folder**": the folder to save project in. *Mandatory*
- "**Name**": the name of your project. *Mandatory*
- "**Description**": A small text describing the purpose of the project. *Optional* 

[//]: # (image)

By clicking on the "**...**" button at the right side of folder selection, another popup
allows you to select the folder among the one created in the different filesystems of the platform.

[//]: # (image)

It is not possible to create projects or project folders in the ***Local*** filesystem,
available in read only mode. However, it is possible create a new project folder inside
the ***Database*** filesystem by clicking on the button at the up-right corner of the window,
choosing its name and clicking on "**OK**".

[//]: # (image)

Finally choose the created folder and click on "**OK**" again.

[//]: # (image)

Fill the name and the description of your new project, and validate its creation by clicking
on the "**OK**" button.

[//]: # (image)

The project is loaded in main FARAO-GSE interface.

[//]: # (image)

#### Opening an existing project

#### Managing project data

Project data are stored in the database, and available from the project ***Data*** pane.

As any filesystem, the project files can be organized in project folders. To create a
project folder, right-click on its parent folder (for example the root directory) and
choose "**Create folder...**".

[//]: # (image)

Then fill the name of the created folder, and click on "**OK**" button.

[//]: # (image)

The new folder has been created in the **Data** pane of your project.

[//]: # (image)

It is possible to delete the created folder and all the project file it may include by
right-clicking on it and choosing "**Delete**".

[//]: # (image)

#### Deleting a project

### About FARAO-GSE

For getting information about the software version of **PowSyBl** and **FARAO**, an about page is
provided in FARAO GSE.

For reaching it:

- Click on the **?** menu
- Choose "*About...*"

[//]: # (image)

Then, the "About page" appears as a splash screen.

[//]: # (image)

This pane presents the information needed to get information about the version used for all
the main important dependencies of FARAO-GSE.

> In case of bug report/feature report, do not forget to attach a copy of the information
> presented in this pane to be able to reproduce any observed behaviour. It is possible
> to copy-paste it directly by selecting the text in the pane.

You can close it by just clicking outside of the pane.

### Reaching this user guide page

A link to this user guide is provided in FARAO-GSE.

For reaching it:

- Click on the **?** menu
- Choose "*Documentation...*"

[//]: # (image)

> Documentation URL setting
>
> The documentation URL in FARAO-GSE is not hard-coded in the platform, but is configured in
> the platform configuration file. For more information about FARAO-GSE configuration module,
> Please refer to de [dedicated documentation](../configuration/farao-gse.md). 
> 
> If this configuration is not provided, the "*Documentation...*" menu will not be available
> in the platform.

## Dealing with network objects

### Cases

#### Importing an UCTE case

#### Importing an XIIDM case

#### Exporting an XIIDM case

#### Exploring an imported case

#### Deleting an imported case

### Modification scripts

#### Creating a modification script

#### Modification script syntax

#### Deleting a modification script

### Calculated cases

#### Creating a calculated case

#### Exporting a calculated case

#### Exploring a calculated case

#### Deleting a calculated case

## Dealing with data inputs

### CRAC files

FARAO-GSE integrates a CRAC object management feature. CRAC files (for Contingencies,
Remedial Actions and Constraints) defines the validity domain for network security.

#### Importing a CRAC file

FARAO-GSE provides an import of JSON formatted CRAC files. For a detailed description of
CRAC JSON format, please refer to the [dedicated documentation](../data/crac/json-format.md).

To import a JSON CRAC file in FARAO-GSE, right-click on a project folder and choose
"**Import CRAC file...**"

[//]: # (image)

[//]: # (image)

Then, select a JSON file in your local filesystem, and validate by clicking on the "**OK**" button.

> Only valid JSON files should be tagged as "CRAC file" in description column, all other files
> will be hidden in the explorer.

[//]: # (image)

[//]: # (image)

Then validate by clicking on the "**OK**" button.

[//]: # (image)

The imported CRAC object then appears in the project ***Data*** pane.

#### Exploring a CRAC object

To explore a CRAC object content, double-click on the CRAC object in ***Data*** pane. A tab
appears in the project pane presenting the CRAC object content.

The information contained in the CRAC file are presented in four sheets:

- ***Overview*** sheet gives general information about CRAC file object, including it's name,
source format and general statistics about the object (number of contingencies, mean number of
monitored branches per contingency, ...).

[//]: # (image)

- ***Pre-contingency*** sheet provides a list of pre-contingency monitored branches.

[//]: # (image)

- ***Post-contingency*** sheet provides both a list of contingency elements and post-contingency
monitored branches.

[//]: # (image)

- ***Remedial actions*** sheet provides a list of available remedial actions and associated
usage rules

[//]: # (image)

#### Deleting a CRAC object

For deleting a CRAC object of the project data, right-click on the CRAC object and choose "**Delete**".

[//]: # (image)

The CRAC object should have been removed from project ***Data*** hierarchy.

## Dealing with computation modules

> Computation module integration in FARAO-GSE is a bit different from what can be found on
> other tools. Computation tasks are not only functions that apply on inputs with given
> parameters, but are actual **objects** saved in the database. This way, it is ensured that your
> study parameters does not change from an execution to another.

To be able to launch a computation engine, you have to follow this general routine:

1. Create a computation instance in the database, by specifying its inputs and parameters
2. Launch the computation task, that will run on background
3. Visualize the results

Computation results are also stored in the database, and updated only when a new computation
task is launched. This way, you are not forced to re-run long computation to show results,
and may just used the version that hase been saved from previous execution.

### Flowbased computation

#### Creating a Flowbased calculation

By right-clicking on a folder, you can choose "Create new Flowbased calculation...". A window
appears for filling information about the Flowbased calculation where you have to choose a CRAC
object and a network object in the database.

- "**Name**": The name of your Flowbased calculation. *Mandatory*
- "**Case**": The network object in the database. *Mandatory*
- "**CRAC File**": The CRAC object in the database. *Mandatory*

[//]: # (image)

Then validate by clicking on the "**OK**" button. It adds an object in AFS database that is
visible in GSE interface and can be edited.

#### Deleting a Flowbased calculation

You can delete a Flowbased calculation object from database by right-clicking on the Flowbased
object in ***Data*** pane and choosing "*Delete*". Confirm by clicking on the "**OK**" button.

### Flow decomposition prototype

#### Overview

Flow decomposition calculation implementation in FARAO is based on
[Full Line Decomposition](../engine/flow-decomposition/full-line-decomposition/index.md) methodology.

#### Creating a flow decomposition calculation

By right-clicking on a folder, you can choose "Create new flow decomposition calculation...".
A window appears for filling information about the flow decomposition calculation where you
have to choose a CRAC object and a network object in the database.

- "**Name**": The name of your flow decomposition calculation. *Mandatory*
- "**Case**": The network object in the database. *Mandatory*
- "**CRAC File**": The CRAC object in the database. *Mandatory*

[//]: # (image)

Then validate by clicking on the "**OK**" button. It adds an object in AFS database that is
visible in GSE interface and can be edited.

#### Running a flow decomposition task

For launching a flow decomposition task, right-click on the flow decomposition calculation
to run in project ***Data*** hierarchy. Choose "*Open*" / "*Run flow decomposition...*".

Flow decomposition task appears in ***Task*** pane of FARAO-GSE.

[//]: # (image)

#### Visualizing flow decomposition results

You can visualize a flow decomposition's results by right-clicking on the flow decomposition
object in project ***Data*** hierarchy and choosing "*Open*" / "*Show results*".

A results visualizer appears in a new tab.

[//]: # (image)

Results are presented per monitored branch.

- Pie chart shows the decomposition of the branch flow per type of flow. A white area means
that the total sum of that flow type is relieving the branch.
- Bar chart shows the calculated loop flows on the branch per country.
- Table below gives the detail of exchanges flows between each country pairs, including internal
and loop flows.

#### Exporting flow decomposition results to XLSX file

You can export a flow decomposition's results as an XLSX file by right-clicking on the flow
decomposition object in Data pane and choosing  "*Open*" / "*Export results*"

[//]: # (image)

Choose the directory and name where you want the results to be exported and validate by
clicking on the "**OK**" button.

#### Deleting a flow decomposition calculation

You can delete a flow decomposition calculation object from database by right-clicking on the
flow decomposition object in ***Data*** pane and choosing "*Delete*". Confirm by clicking on
the "**OK**" button.

### Close optimisation RAO

#### Creating a RAO calculation
 
By right-clicking on a folder, you can choose "Create new RAO calculation...". A window appears
for filling information about the RAO calculation where you have to choose a CRAC object and
a network object in the database.

- "**Name**": The name of your RAO calculation. *Mandatory*
- "**Case**": The network object in the database. *Mandatory*
- "**CRAC File**": The CRAC object in the database. *Mandatory*

[//]: # (image)

Then validate by clicking on the "**OK**" button. It adds an object in AFS database that is
visible in GSE interface and can be edited.

#### Running a RAO task

For launching a RAO task, right-click on the RAO calculation to run in project ***Data***
hierarchy. Choose "*Open*" / "*Launch RAO calculation...*".

RAO task appears in ***Task*** pane of FARAO-GSE.

#### Visualizing RAO results

For visualizing RAO results, right-click on the RAO calculation which results are wanted in
project ***Data*** hierarchy. Choose "*Open*" / "*Show the result*".

#### Deleting a RAO calculation

You can delete a RAO calculation object from database by right-clicking on the RAO object in
***Data*** pane and choosing the "*Delete*" option. Confirm by clicking on the "**OK**" button.