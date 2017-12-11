---
title: "Moving a Nutanix Block"
layout: post
introduction: "We recently went through an exercise to move our Nutanix blocks to a new Data center. I wanted to document this process for myself as it is very different to shutting down your regular pizza box server and moving the kit. There is a little more to think about and do prior to moving the kit when you are working with Nutanix."
name: "Moving a Nutanix Block"
date: 2017-08-01
last_modified_at: 
permalink: /2017/08/moving-nutanix-block
categories: [nutanix]
comments: true
read_time: true
---

We recently went through an exercise to move our Nutanix blocks to a new Data center. I wanted to document this process for myself as it is very different to shutting down your regular pizza box server and moving the kit. There is a little more to think about and do prior to moving the kit when you are working with Nutanix.


Here is the process I followed which worked well for me.

1. Shut down any guest VM’s on the Nodes
2. Stop the cluster ([process described here](/2017/07/stopping-nutanix-cluster))
3. Shut down all nodes in the cluster (in our case these were VMWare hypervisors)
4. Power off the blocks (IPMI or power switch)
5. Once the blocks are powered down you can safely unplug all cables and unrack/rack your blocks.
6. When you’ve got all the blocks racked and cabled power them on. The CVM’s will start automatically.
7. Once all CVMs are online again, SSH into one of them and run:
    `cluster start`


Wait for all services to report that they have started:
```
CVM: xxx.xxx.xxx.xxx UP

     Zeus UP [3704, 3727, 3728, 3729, 3807, 3821] 
     Scavenger UP [4937, 4960, 4961, 4990] 
     SSLTerminator UP [5034, 5056, 5057, 5139] 
     Hyperint UP [5059, 5082, 5083, 5086, 5099, 5108] 
     Medusa UP [5534, 5559, 5560, 5563, 5752] 
     DynamicRingChanger UP [5852, 5874, 5875, 5954] 
     Pithos UP [5877, 5899, 5900, 5962] 
     Stargate UP [5902, 5927, 5928, 6103, 6108] 
     Cerebro UP [5930, 5952, 5953, 6106]
     Chronos UP [5960, 6004, 6006, 6075] 
     Curator UP [5987, 6017, 6018, 6261] 
     Prism UP [6020, 6042, 6043, 6111, 6818] 
     CIM UP [6045, 6067, 6068, 6101] 
     AlertManager UP [6070, 6099, 6100, 6296] 
     Arithmos UP [6107, 6175, 6176, 6344] 
     SysStatCollector UP [6196, 6259, 6260, 6497] 
     Tunnel UP [6263, 6312, 6313] 
     ClusterHealth UP [6317, 6342, 6343, 6446, 6468, 6469, 6604, 6605, 6606, 6607] 
     Janus UP [6365, 6444, 6445, 6584] 
     NutanixGuestTools UP [6377, 6403, 6404]
```

Now that the Cluster is running you can go ahead and start your Guest VMs.