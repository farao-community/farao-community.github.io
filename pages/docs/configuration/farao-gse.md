---
layout: page
title: FARAO-GSE configuration
permalink: /docs/configuration/farao-gse
hide: true
feature-img: "assets/img/Hans_Otto_Theater_Potsdam_-_fake_colors_cut.jpg"
tags: [Docs]
---

The ```farao-gse``` module contains parameters for FARAO-GSE application configuration.

## Properties

### Required properties

There are no required properties yet.

### Optional properties

#### documentation-url

Defines the URL the integrated documentation menu will reference.

By default, no documentation menu will be created if there is no ```documentation-url```
property provided.

## Examples

### YAML

```yaml
farao-gse:
    documentation-url: https://www.farao-community.com/docs/gse/usage-guide/
```

### XML

```xml
<farao-gse>
    <documentation-url>https://www.farao-community.com/docs/gse/usage-guide/</documentation-url>
</farao-gse>
```
