---
layout: post
title: "Curator Scan Status Failing in Prism"
introduction: "Curator service scan errors? I found out how to check and manually start the scan job."
color: "link"
name: "Curator Scan Status Failing in Prism"
icon: "tag"
date: 2017-11-01 10:00:00 +1000
last_modified_at: 
categories: [nutanix]
permalink: /2017/11/curator-scans-failing
comments: false
read_time: true
---

I recently moved our Nutanix Cluster to a new Data Center. After I completed the move and brought the Nutanix cluster back online Prism was generating a Critical alert basically telling me that the Curator Scan hadn’t run in the last 24 hours. Here’s the exact alert:

<figure>
  <img src="/images/curator_error-lq.png" data-src="/images/curator_error.png" alt="Curator Service Error" class="lazyload blur-up" width="280" height="115">
</figure>


I wasn’t too concerned with this alert because I knew the reason this alert was triggered was because my cluster was off while we moved it. I assumed that in time, Curator would run a partial scan (or full scan) again and the alert would go away. However because I wanted to make sure everything was okay (and to get that reassuring green heart <span class="icon has-text-success"><i class="fa fa-heartbeat"></i></span>), I did a little digging into the issue.

Before doing anything I logged this as an issue with Nutanix Support. So while I waited for support to get back to me I figured I’d do some investigating.

I figured that in order to get this alert resolved immediately I’d need to start a Curator Scan manually. So began my search on how to do that.
In my search I stumbled across a post from a few years back on the Nutanix Community Forums where someone was asking exactly what I needed to know, could a manual Curator Scan be initiated from CLI. From reading through the post I found that I needed to open a browser to `http://{Curator-Master-CVM-IP}:2010/master/control`. That was all well and good but I had no idea which CVM was the Curator Master.

So I did a little more digging and found that if I open an SSH session to a CVM and enter  `links http:0:2010` it’ll bring up an ELinks page which tells me what CVM is the Curator Master. Perfect!

<figure>
  <img src="/images/eLinks-lq.png" data-src="/images/eLinks.png" alt="eLinks Page" class="lazyload blur-up" width="300" height="133">
</figure>


I now had the first piece of the puzzle, the Curator Master CVM. So now I try to open a web page to `http://{Curator-Master-CVM-IP}:2010/master/control` and… doesn’t work. I remembered reading a while ago that you could access the Stagate page of a CVM on port 2009 but in order to do that you had to either stop the service or modify iptables on the CVM to allow the connection rather than reject it. So I thought I’d give it a shot.

I SSH’d to my Curator Master CVM and tried:
`sudo su - iptables -A WORLDLIST -p tcp -m tcp --dport 2010 -j ACCEPT`
Where 2010 is the Curator port that I needed to open.

That accepted fine and when I tried to access the Curator URL again I was greeted with the below webpage.
<figure>
  <img src="/images/Curator_Control_Page-lq.png" data-src="/images/Curator_Control_Page.png" alt="Curator Control Page" class="lazyload blur-up" width="300" height="106">
</figure>

I was finally getting somewhere.
Next, I went ahead and kicked off a partial scan. Once I clicked on the link to ‘Start Partial Scan’ it went to a blank page. I assumed that worked?

I decided to try accessing the root URL of Curator (without the /master/control) and was greeted with a page similar to the ELinks page from above but this time in my browser where I could see the status of the scan I had kicked off!

<figure>
  <img src="/images/curator_running-lq.png" data-src="/images/curator_running.png" alt="Curator Active Jobs" class="lazyload blur-up" width="1024" height="116">
</figure>

I waited a while (849 seconds to be exact) and refreshed that page again and noticed that my scan had complete!

<figure>
  <img src="/images/curator_succeeded-lq.png" data-src="/images/curator_succeeded.png" alt="Curator Jobs Succeeded" class="lazyload blur-up" width="1024" height="112">
</figure>

Now that the Curator scan was complete I checked Prism again, and the alert was gone.
I updated the support ticket and Paul from Nutanix Support gave me a call to do one more health check across my cluster anyway.

Again, I know I didn’t have to do this manually but for my own learning I decided to give it a go.
