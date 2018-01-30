---
title: "Nutanix Software Only"
layout: post
introduction: "Nutanix has been speaking openly about a 'Software Only' offering for a while now but no one has been able to elaborate on it, until now."
name: "Nutanix Software n"
date: 2018-01-25 08:00:00 +1000
last_modified_at:
permalink: /2018/01/ntnx-software-only
categories: [nutanix]
comments: true
comments_locked: false
read_time: true
---

Nutanix has been speaking openly about a 'Software Only' offering for a while now however no one has been able to divulge any information on what the offering will be, how it'll work with support/maintenance or what hardware could be used with the software only solution. That is, until now.

Today we had our [NTC](/2018/01/NTC-2018) briefing where Nutanix was able to fill in some of the blanks for us so we can finally have some of those questions answered.

#### What does Software Only look like?
The Nutanix Software Only solution will work much the same as any other software only based product (think VMWare vSphere) where all of the smarts is in the software and the hardware, so long as it is on the compatibility list, is completely up to the customer. This differes quite a bit to the current Nutanix bundle/appliance approach as it gives the customer more choice not only over the specific hardware but where the purchase their hardware form as well. 

Here's a bit of a breakdown.

##### Procurement and Install
1. Customer purchases the hardware of their choice from their preferred hardware vendor/channel (providing it's a supported configuration)
2. Customer purchases Nutanix software licenses via one of the new pre-defined SKU's (SKU's are based on License Edition, Support Level, Length of Term)
3. Nutanix Services or Partner installs the Firmware and Nutanix Software on the customer purchased Hardware

##### Support
When it comes to support, it's a sort of 'Meet in the Channel' agreement between the hardware vendor and Nutanix. The customer must call the Hardware vendor for hardware related issues and Nutanix support for Nutanix software related issues. Nutanix will however take the first call if there is a bit of grey area around the issue and triage the call. Hardware issue will be handed off to the Hardware vendor via TSAnet.

##### Supported Hardware
Nutanix maintain the Hardware Compatibility List for the Software Only offering and will update it as needed. The current compatibility list can be found [here](https://portal.nutanix.com/#/page/docs/list?filterKey=software&filterVal=Third-Party%20Platforms). Some additional hardware configurations have been announced as well (see below).

<figure>
    <img source="/images/dell.png-lq" data-src="/images/dell.png" alt="Dell Poweredge" class="lazyload blur-up">
</figure>

<figure>
    <img source="/images/cisco.png-lq" data-src="/images/cisco.png" alt="Cisco USC" class="lazyload blur-up">
</figure>

<figure>
    <img source="/images/hpe.png-lq" data-src="/images/hpe.png" alt="HPE Proliant" class="lazyload blur-up">
</figure>

##### Software Editions Supported
Acropolis Pro and Ultimate editions are supported in this offerning. You'll notice that the starter and xpress editions are not available here. One thing to note though is that the entitlements are transferrable accross qualivied HPE, Cisco and Dell server platforms.

Prism is sold separately in this offering and treated as a separate product altogether. The prism license is transacted as a fixed term license on a per node basis.

