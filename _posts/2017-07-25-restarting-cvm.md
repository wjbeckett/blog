---
title: "Restarting a CVM"
layout: post
introduction: "quick info on restarting a Nutanix CVM"
name: "Restarting a CVM"
date: 2017-07-25
last_modified_at: 
permalink: /2017/07/restarting-cvm
categories: [nutanix]
read_time: true
---

In the world of Nutanix, Controller VMs (CVMs) are king. They are key to the whole solution. So when the comes in which you need to restart a node or a CVM you should probably take a little care and don’t properly. You don’t want to have it all go all banana on you and then leave you with a broken CVM.


Its probably best to point out here that before you do ANYTHING, call Support. They are there for a reason and are very good at their job.


However, if you want to do this yourself, read on.


Before you reboot the CVM you need to stop it gracefully. Stopping the CVM gracefully allows for all services to stop and, in the event this CVM is the leader, have the cluster elect a new leader. This will ensure you have no issues with your cluster when you reboot the CVM.


So, go ahead and SSH (or open a console) to your CVM. Login and get to the ncli.


Now all you need to do is: `cvm_shutdown -P now`


That’s it.

The `cvm_shutdown -P now` command will gracefully stop all services on the CVM allowing you to reboot the CVM (or the node if you need) cleanly.


Once your CVM is back up you can initiate NCC to run some checks across your cluster to ensure everything is okay.


Again, if it’s all too much, or you want to play it on the safe side, call Support. 🙂