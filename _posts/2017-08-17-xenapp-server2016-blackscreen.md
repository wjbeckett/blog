---
title: "XenApp and Server 2016 – Black Screen at Login"
layout: post
introduction: "Two days ago, XenDesktop 7.15 was released and yesterday the 2nd part of the fix was delivered by Microsoft as a 1GB, August 16 patch."
name: "XenApp and Server 2016 – Black Screen at Login"
date: 2017-08-17
last_modified_at:
permalink: /2017/08/xenapp-server2016-blackscreen
categories: [citrix]
comments: false
read_time: true
---

I’m currently building a new Citrix environment at my place of work and thought that seeing as we are going for a fresh start I may as well use the latest versions of Citrix and Windows. So I started building a new Citrix VDA for shared desktop use on Windows Server 2016 with Citrix XenDesktop 7.13.

I came across an issue almost immediately where at login, there was a black screen presented to the user between when logon processing finished and the users desktop was presented. This black screen would vary in length lasting sometimes up to 20 seconds before the desktop was displayed. I had tried a number of supposed fixes from around the internet (such as setting DisableStatus to 1) but nothing seemed to work for me. That was until I stumbled across an increasingly popular thread on Citrix communities eluding to an issue with Server 2016 and the latest version of Citrix (at this point it was 7.13). A lot of people were describing the exact same issue as me. A Citrix employee had commended saying that they were aware of this issue and that they are working with Microsoft on the issue and would be resolved as a 2-part fix with XenDesktop 7.15 (which will be the next LTSR) and an MS patch for Server 2016.

Two days ago, XenDesktop 7.15 was released and yesterday the 2nd part of the fix was delivered by Microsoft as a 1GB, August 16 patch.

Now that we have everything we need, On to applying the fix.

According to a Citrix employee the steps needed to implement the fixes are:

* Upgrade VDA to 7.15 (best to do the Delivery Controller at the same time but not a necessity)
* Apply the following registry key as described here: https://support.citrix.com/article/CTX225819
  `[HKEY_LOCAL_MACHINE\SOFTWARE\citrix\Citrix Virtual Desktop Agent] “DisableLogonUISuppression”=dword:00000000`

* Apply the MS patch “2017-08 Cumulative Update for Windows Server 2016 (KB4034661)”  — Takes a long time.
* Reboot the VDA

Once the VDA has registered with the DDC, login and there should be no more black screen!

Hopefully this helps others who are in a similar situation. This issue was tough to nail down and was holding up progressing to the new environment.

