---
layout: post
title: "Curator Scan Status Failing in Prism"
introduction: "Curator service scan errors? I found out how to check and manually start the scan job."
color: "link"
name: "Curator Scan Status Failing in Prism"
icon: "tag"
categories: [nutanix]
read_time: true
---

I recently moved our Nutanix Cluster to a new Data Center. After I completed the move and brought the Nutanix cluster back online Prism was generating a Critical alert basically telling me that the Curator Scan hadn’t run in the last 24 hours. Here’s the exact alert:

<figure>
  <img src="data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAABAgMAAABmjvwnAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAADFBMVEX09/n3+fr5+vr///81AiMYAAAAAWJLR0QDEQxM8gAAAAd0SU1FB+ELDxQ4MWMR9K0AAAAKSURBVAgdY5AAAAAaABmq72WiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE3LTExLTE3VDE1OjIxOjI3KzEwOjAwWhZ5fgAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxNy0xMS0xNVQxMDo1Njo0OSsxMDowMOxzK5IAAAAASUVORK5CYII=" data-src="{{ site.url }}/images/curator_error.png" alt="Curator Service Error" class="lazyload blur-up" />
</figure>


I wasn’t too concerned with this alert because I knew the reason this alert was triggered was because my cluster was off while we moved it. I assumed that in time, Curator would run a partial scan (or full scan) again and the alert would go away. However because I wanted to make sure everything was okay (and to get that reassuring green heart ), I did a little digging into the issue.

Before doing anything I logged this as an issue with Nutanix Support. So while I waited for support to get back to me I figured I’d do some investigating.

I figured that in order to get this alert resolved immediately I’d need to start a Curator Scan manually. So began my search on how to do that.
In my search I stumbled across a post from a few years back on the Nutanix Community Forums where someone was asking exactly what I needed to know, could a manual Curator Scan be initiated from CLI. From reading through the post I found that I needed to open a browser to `http://{Curator-Master-CVM-IP}:2010/master/control`. That was all well and good but I had no idea which CVM was the Curator Master.

So I did a little more digging and found that if I open an SSH session to a CVM and enter  `links http:0:2010` it’ll bring up an ELinks page which tells me what CVM is the Curator Master. Perfect!

<figure>
  <img src="data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAABAgMAAABmjvwnAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAADFBMVEWksaars6yxtLH///9beHaiAAAAAWJLR0QDEQxM8gAAAAlwSFlzAAAOwwAADsMBx2+oZAAAAAd0SU1FB+ELEgYdGQOGdOwAAAAKSURBVAgdY5AAAAAaABmq72WiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE3LTExLTE3VDIwOjI5OjI1KzEwOjAwvxC+awAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxNy0xMS0xN1QyMDoyOToyNSsxMDowMM5NBtcAAAAASUVORK5CYII=" data-src="{{ site.url }}/images/eLinks.png" alt="eLinks Page" class="lazyload blur-up" />
</figure>

I now had the first piece of the puzzle, the Curator Master CVM. So now I try to open a web page to `http://{Curator-Master-CVM-IP}:2010/master/control` and… doesn’t work. I remembered reading a while ago that you could access the Stagate page of a CVM on port 2009 but in order to do that you had to either stop the service or modify iptables on the CVM to allow the connection rather than reject it. So I thought I’d give it a shot.

I SSH’d to my Curator Master CVM and tried:
`sudo su - iptables -A WORLDLIST -p tcp -m tcp --dport 2010 -j ACCEPT`
Where 2010 is the Curator port that I needed to open.

That accepted fine and when I tried to access the Curator URL again I was greeted with the below webpage.

<figure>
  <img src="data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAABAgMAAABmjvwnAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAADFBMVEXe3+3g4uji4+P////l388dAAAAAWJLR0QDEQxM8gAAAAd0SU1FB+ELEgYdGQOGdOwAAAAKSURBVAgdY5AAAAAaABmq72WiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE3LTExLTE3VDIwOjI5OjI1KzEwOjAwvxC+awAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxNy0xMS0xN1QyMDoyOToyNSsxMDowMM5NBtcAAAAASUVORK5CYII=" data-src="{{ site.url }}/images/Curator_Control_Page.png" alt="Curator Control Page" class="lazyload blur-up" />
</figure>

I was finally getting somewhere.
Next, I went ahead and kicked off a partial scan. Once I clicked on the link to ‘Start Partial Scan’ it went to a blank page. I assumed that worked?

I decided to try accessing the root URL of Curator (without the /master/control) and was greeted with a page similar to the ELinks page from above but this time in my browser where I could see the status of the scan I had kicked off!

<figure>
  <img src="data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAABBAMAAAAV2yJNAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAIVBMVEXP1tDS2dLT29PR29HP2s/R29HW3tbY3tjX3tfX3tf///+5eJfLAAAAAWJLR0QKaND0VgAAAAlwSFlzAAAOwwAADsMBx2+oZAAAAAd0SU1FB+ELEgYdGQOGdOwAAAAOSURBVAgdY2BUdk3vBAACvQFaWs8ASQAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxNy0xMS0xN1QyMDoyOToyNSsxMDowML8QvmsAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTctMTEtMTdUMjA6Mjk6MjUrMTA6MDDOTQbXAAAAAElFTkSuQmCC" data-src="{{ site.url }}/images/curator_running.png" alt="Curator Active Jobs" class="lazyload blur-up" />
</figure>

I waited a while (849 seconds to be exact) and refreshed that page again and noticed that my scan had complete!

<figure>
  <img src="data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAABBAMAAAAV2yJNAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAIVBMVEXO1c/L2MvH2sfI2sjN2c3Q2tDU3NTV3NXW3dbW3db////U+s5YAAAAAWJLR0QKaND0VgAAAAlwSFlzAAAOwwAADsMBx2+oZAAAAAd0SU1FB+ELEgYdGQOGdOwAAAAOSURBVAgdY2BUdk3vBAACvQFaWs8ASQAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxNy0xMS0xN1QyMDoyOToyNSsxMDowML8QvmsAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTctMTEtMTdUMjA6Mjk6MjUrMTA6MDDOTQbXAAAAAElFTkSuQmCC" data-src="{{ site.url }}/images/curator_succeeded.png" alt="Curator Jobs Succeeded" class="lazyload blur-up" />
</figure>

Now that the Curator scan was complete I checked Prism again, and the alert was gone.
I updated the support ticket and Paul from Nutanix Support gave me a call to do one more health check across my cluster anyway.

Again, I know I didn’t have to do this manually but for my own learning I decided to give it a go.
