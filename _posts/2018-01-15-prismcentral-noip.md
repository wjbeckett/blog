---
title: "Prism Central VM has no IP address"
layout: post
introduction: "I had to upgrade my Prism Central VM RAM from 12GB to 16GB. In doing so, when the VM restarted, it had no IP address."
name: "Prism Central VM has no IP address"
date: 2018-01-15 11:30:00 +1000
last_modified_at:
permalink: /2018/01/PC-noip
categories: [Nutanix]
comments: false
read_time: true
---

Prism Central v5.5.0.2 was recently released so I grabbed the metadata file and the binary to upgrade my existing Prism Central (which was version 5.5).
Following the usual steps I take, I downloaded what I needed and uploaded the binary and the metadata file to the Prism Central VM in order to perform the upgrade. Once the required files were uploaded I clicked the Upgrade button and waited.

It was then that I was told my Prism Central VM didn't have the required minimum amout of RAM to run the new features.
<figure>
  <img src="/images/prism_central_error-lq.png" data-src="/images/prism_central_error.png" alt="Prism Central Error" class="lazyload blur-up" width="1226" height="91">
</figure>

 No biggie, I'll just shut down Prism Central and bump the RAM and I'll be done.
 I went ahead and shutdown Prism Central, bumped the RAM in the VM and started it back up agian. Waited for a while and tried to access Prism Central but got no where. 
 Ran a ping to the IP address of the Prism Central VM but again, no dice.
 Checked in vSphere and could see that the NIC was attached so it wasn't a VMware thing.

 I decided to have a look at the Prism Central VM itself to see if I could find out why I couldn't ping the IP address.
 Upon running an `ifconfg` at the command line I only got the loopback address. My eth0 nic wasn't listed at all.
 <figure>
  <img src="/images/prism_central_ifconfig_noip-lq.png" data-src="/images/prism_central_ifconfig_noip.png" alt="Prism Central ifconfig" class="lazyload blur-up" width="596" height="133">
</figure>

I tried another command to view the IP configuration `ip address` and saw that the eth0 interface was DOWN.

Right, so that'll do it. Now to have a look at the interface configuration.

I jumped into the `/etc/sysconfig/network-scripts/ifcfg-eth0` file to have a look at the config.
As soon as the file was open I saw the problem.
The ip address, gateway, netmask were all set correctly so it wasn't a case of losing the IP details. I did notice though that the `ONBOOT` option was set to `no`. This basically means that the interface will be down when then VM is started. 

I quickly edited the file and changed the `ONBOOT` option to `yes`, saved and exited that file, then ran `sudo service network restart` to restart the network service.
As soon as that service restarted my VM was pingable again and the rest of the Prism Central services started up. 
I checked `ip address` and `ifconfig` commands again and the eth0 interface was showing as up and was working correctly.

Once the services started up the Prism Central upgrade continued immediately.
<figure>
  <img src="/images/prism_central_upgrading-lq.png" data-src="/images/prism_central_upgrading.png" alt="Prism Central Upgrading" class="lazyload blur-up" width="402" height="349">
</figure>

I'm not entirely sure why this happened in the first place but I'm glad that it was a simple fix to get Prism Central up and running again so I could perform the upgrade.