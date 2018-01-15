---
title: "Stopping a Nutanix Cluster"
layout: post
introduction: "quick info on stopping a cluster"
name: "Stopping a Nutanix Cluster"
date: 2017-07-20
last_modified_at: 
permalink: /2017/07/stopping-nutanix-cluster
categories: [nutanix]
comments: false
read_time: true
---

Shutdown all guest VMs
Logon to a Controller VM via SSH
stop the cluster with
cluster stop
wait for the CVM to report something similar to the below
CVM: xxx.xxx.xxx.xxx Up, ZeusLeader      

     Zeus UP [3167, 3180, 3181, 3182, 3191, 3201]
     Scavenger UP [3334, 3351, 3352, 3353]
     ConnectionSplicer DOWN []
     Hyperint DOWN []
     Medusa DOWN []
     DynamicRingChanger DOWN []
     Pithos DOWN []
     Stargate DOWN []
     Cerebro DOWN []
     Chronos DOWN []
     Curator DOWN []
     Prism DOWN []
     AlertManager DOWN []
     StatsAggregator DOWN []
     SysStatCollector DOWN [][]