---
title: "Nutanix Cluster Expansion"
layout: post
introduction: "Expanding a Nutanix cluster is a relatively easy process however there are a couple of thing to note prior to undertaking the expansion process"
name: "Nutanix Cluster Expansion"
date: 2018-01-15 11:30:00 +1000
last_modified_at:
permalink: /2018/01/expanding-nutanix-cluster
categories: [nutanix]
comments: true
comments_locked: false
read_time: true
---







Please follow the steps below to ensure that the node to be added into an existing cluster is updated appropriately:



1. Insert the new node that is not part of a cluster yet into the destination chassis. Note the destination node position (node_position) and chassis Block Serial (rackable_unit_serial).
2. Attach the appropriate network cabling, configure physical switch settings, etc., using an existing node in the chassis as reference.
NOTE: This existing node will be part of the cluster the new node is to be expanded into.



1. Power on the new node.
2. SSH to a CVM in the existing cluster and run the command below to discover the new node. Obtain its CVM's IPv6 link-local address (highlight in red below).

nutanix@cvm:~$ discover_nodes

{'foundation_version': u'foundation-3.5-7ca0fb1f', 'rackable_unit_serial': u'16SM6B12345', 'ipv6_address': 'fe80::20c:29ff:fe6d:59d6%eth0', 'node_uuid': u'4389b69d-516d-4d18-960c-5f2fe26ed142', 'current_network_interface': u'eth0', 'node_position': u'A', 'hypervisor': u'kvm', 'svm_ip': u'10.1.181.170', 'chassis_n': 4, 'nos_version': u'5.0', 'cluster_id': u'', 'current_cvm_vlan_tag': None, 'hypervisor_version': u'el6.nutanix.20160601.44', 'attributes': {u'lcm_family': u'smc_gen_10', u'default_workload': u'vdi'}, 'rackable_unit_model': u'NX-3060-G5', 'configured': False}

1. SSH into the CVM of the new node using its IPv6 address and enter the password for that CVM (default password is nutanix/4u).

nutanix@cvm:~$ ssh -6 fe80::20c:29ff:fe6d:59d6%eth0



1. Open the factory_config.json file of the new node.

nutanix@new-cvm:~$ sudo vi /etc/nutanix/factory_config.json



1. Change the rackable_unit_serial and node_position to values noted in Step 1. Type a to edit. Type ESC : wq! and press Enter to save and exit.

{"rackable_unit_serial": "16SM6B512345", "node_uuid": "4389b69d-516d-4d18-960c-5f2fe26ed142", "node_serial": "ZM16BS053956", "node_position": "A", "cluster_id": 72891, "rackable_unit_model": "USE_LAYOUT"}



1. Restart genesis on this node.

nutanix@new-cvm:~$ genesis restart

1. Go into Prism > Gear Icon > Expand Cluster to add the new node(s) into the existing cluster. For detailed pre and post expansion instructions, refer to the Prism Web Console Guide's Expanding a Cluster section.
