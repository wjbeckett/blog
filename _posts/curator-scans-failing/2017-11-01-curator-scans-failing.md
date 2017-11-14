---
layout: post
title: "Curator Scan Status Failing in Prism"
introduction: "Curator service scan errors? I found out how to check and manually start the scan job."
color: "link"
name: "Curator Scan Status Failing in Prism"
icon: "tag"
categories: [nutanix]
---

I recently moved our Nutanix Cluster to a new Data Center. After I completed the move and brought the Nutanix cluster back online Prism was generating a Critical alert basically telling me that the Curator Scan hadn’t run in the last 24 hours. Here’s the exact alert:

![Curator Service Error]({{ site.url }}/images/curator_error.png)