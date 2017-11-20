---
layout: post
title: "Moving Nutanix to a New Data Center"
introduction: "Generally, I dread moving Data Centers. This time, it was so simple and so fast I honestly wouldn’t mind doing it again."
color: "link"
name: "Moving Nutanix to a New Data Center"
categories: [nutanix]
read_time: true
---

I recently went through the process of moving our Nutanix cluster to a new Data Center. Usually this sort of activity is what people dread given that traditional 3-tier infrastructure is so large and complex, however seeing as that this is a Nutanix cluster I’m talking about, it was a piece of cake!

There is a couple of things I had to be aware of before beginning the move and there was a few things I ran into post move that I wanted to document for myself and for anyone else that might be undertaking the same activity that runs into similar issues


#### The Shutdown
Prior to moving the Nutanix cluster I obviously had to shut down all the VM’s currently on the cluster so I made sure that was done and also made sure the CVM’s weren’t touched (left on).

I now needed to stop the cluster cleanly before the nodes were shutdown. With the guest VM’s now off I fired up PUTTY and ssh’d into one of my CVM’s. Gracefully stopping the cluster was as easy as `cluster stop`.

Now the cluster was stopped it was time to shutdown the CVM’s. It’s apparently okay to shutdown the CVM’s normally through your Hypervisor (in our case ESX) by going to Power –> Shutdown Guest. However I preferred to use the `cvm_shutdown -P now`. I know it’s essentially the same thing, but that’s the way I decided to do it. Because we have 7 Nodes in our cluster I went on to SSH into the remaining CVM’s and shut them down gracefully.

The next step in the Shutdown process was to power down the hosts. I could have done this one of two ways:

* ESXi
* IPMI (or iDRAC, or whatever your out of band management is)

Because I was already logged in to each host via vSphere I decided to use vSphere to shut the nodes down.

Now that the hosts were off the shutdown sequence was complete and I could move on to pulling the power and network cables, pulling the nodes out of the rack and moving them to the new DC.

  <figure class="image">
    <img src="{{ site.url }}/images/moving-nutanix-kit-lq.jpg" data-src="{{ site.url }}/images/moving-nutanix-kit.jpg" alt="ready to move" class="lazyload blur-up" width="384" height="512"/>
    <figcaption class="has-text-centered">Ready for the new home!</figcaption>
  </figure>


#### The Startup
After racking the cluster in the new DC, cabling done and IPMI accessible it was time to start the hosts.
I logged in to each host over IPMI and started them up, Waited for vSphere to be accessible and made sure the CVM’s were started.

Once all 7 VCM’s were started I could move on to starting the cluster. Thankfully, again, this is a Nutanix cluster so starting the cluster was as simple as `cluster start`. Once all of the CVM services were started I now had a functioning cluster. Just to be sure I kicked off a NCC on the cluster to verify all was okay. I opened up a PUTTy terminal to a CVM and ran `ncc health_checks run_all`.

With my cluster now back in an operational state it was time to start my vCenter controller (and External PSC) and make sure the cluster was communicating with vCenter correctly. Once vCenter and the Nutanix CVM’s were talking I began starting my guest VM’s.


#### The Minor Issue
At the beginning of this article I mentioned that I ran into a minor issue post cluster move. I say minor because my cluster was functioning correctly however I didn’t want the issue to go unnoticed. The issue was that the Curator Service hadn’t run in the past 24 hours (cluster was offline for 24 hours while the networking guys fixed an issue with cross connects…) so it was generating some critical alerts. I won’t go into that issue and what I did to fix it here as I wanted this to be a post about the cluster move. So if you’re interested in how I fixed that Curator alert, check [this post]({{ site.url }}/nutanix/2017/11/01/curator-scans-failing/).


#### The End
Usually, I dread moving Data Centers. This time, it was so simple and so fast I honestly wouldn’t mind doing it again. Nutanix made the whole process super streamlined and had there not been Networking issues between the Data Centers, I would have had the cluster moved and back online within 6 hours. As with anything a little bit of pre-planning goes a long way. Because I knew the process to shutdown and startup the Nutanix cluster cleanly prior to undertaking the work I was prepared and was able to do this move in a very short amount of time (network permitting…). If you are undertaking a Data Center move and have a Nutanix cluster that you need to move, familiarize yourself with the process. It’ll save you time as well as ensure you understand what needs to be done.

At the end of it all, Nutanix made my life easier.
