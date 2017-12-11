---
title: "Skype Room System and Surface Hub Accounts in a Hybrid Setup"
layout: post
introduction: "At my workplace, we recently purchased a couple of Surface Hubs and a Crestron RL2 Skype Room System to play with and integrate into the business. One issue I came across that took a while to figure out was how to correctly set up a hybrid account for these devices to use"
name: "Skype Room System and Surface Hub Accounts in a Hybrid Setup"
date: 2017-08-14
last_modified_at: 2017-12-06
permalink: /2017/08/skype-room-systems
categories: [skype, microsoft]
comments: true
read_time: true
---

At my workplace, we recently purchased a couple of Surface Hubs and a Crestron RL2 Skype Room System to play with and integrate into the business. One issue I came across that took a while to figure out was how to correctly set up a hybrid account for these devices to use. After fiddling with the accounts and trying various setups I finally managed to get the configuration correct so thought I should document that process for my own benefit more than anything but also in case someone else is struggling to get accounts configured for these types of devices.


This post will cover creating new Room Mailboxes both on premise and in O365 (Hybrid) as well as setting up Skype for Business accounts on prem (Lync 2013 Server) and on prem Active Directory accounts. Of course if you are 100% online then this could still be adapted to suit your needs.


# **Using an existing Room Mailbox (on-Premise)**
## Set Calendaring Options for existing Room Mailbox
First of all we need to set the calendaring options for your existing Room Mailbox.


1. Open an Exchange Management Shell from a machine with the Exchange Management Tools installed.The first command below is just to ensure auto-accept is turned on plus disabling a few properties as well as adding an auto response. This is typically already configured for existing Room account but this just makes sure.Replace roommailbox@domain.com with the UPN of the account you want to update.

    `Set-CalendarProcessing -Identity RoomMailbox@domain.com -AutomateProcessing AutoAccept -AddOrganizerToSubject $false -RemovePrivateProperty $false -DeleteComments $false -DeleteSubject $false –AddAdditionalResponse $true –AdditionalResponse "Your meeting is now scheduled and if it was enabled as a Skype Meeting will provide a seamless click-to-join experience from the conference room"`

<br/>
2. Optional – We can also set a Tooltip so that when users book this room as a regular room (IE. not as a Skype Meeting) it will remind them that this particular room is Skype Meeting Enabled.

    `Set-Mailbox -Identity BNETSTRL10@sunwater.com.au -MailTip "This room is equipped to support Skype for Business Meetings"`


## Enable Lync (or Skype for Business) account for the Room Mailbox
Now that the Room Mailbox is setup to auto-process calendar invites we need to Lync (or Skype) enable the account. We aren’t going to enable the account as a user though, we will enablet his account as a CsMeetingRoom which will enable Skype Meeting functionality.


1. Switch over to your Lync Management Shell. Again, replace RoomMailbox@domain.com with the UPN of the Room Mailbox you specified earlier

    `Enable-CsMeetingRoom -Identity RoomMailbox@domain.com -RegistrarPool pool@domain.com -SipAddressType EmailAddress`

    *Note: The RegistrarPool is the Lync server you want to home your user account on.*


## Enable Active Directory Account and Set Password
By default, a Meeting Room mailbox has an AD account but it is disabled. So we need to reset the password, ensure it never expires and enable the account. This can all be done from ADUC.


# **Create a new Room Mailbox – Exchange Online with AD and Lync on prem**
## Create the Exchange online Meeting Room account


1. Connect to Exchange Online to provision a new Room Mailbox.
    Ensure you have the [MSOL connector](https://www.microsoft.com/en-us/download/details.aspx?id=41950) installed and open Powershell as an Admin.

2. The below commands will connect you to O365 via Powershell to be able to execute the remainder of the Mailbox setup. Execute one per line.
    ```
    Import-Module MsOnline

    Connect-MsolService -credential $credential

    $exchSession = New-PSSession -ConfigurationName Microsoft.Exchange -ConnectionUri https://ps.outlook.com/powershell -Credential $credential -Authentication Basic -AllowRedirection

    Import-PSSession $exchSession -DisableNameChecking -AllowClobber
    ```

3. Once you are connected to O365 run the below command to create a new Room Mailbox.

    `$newUser=RoomMailbox@domain.com`

    `New-Mailbox –Room -Name "Skype Meeting Room" -RoomMailboxPassword (ConvertTo-SecureString –String "P@ssw0rd1" -AsPlainText -Force) -EnableRoomMailboxAccount $true`



4. Now that the room mailbox is created we can apply the same calendar processing rules as before.

    `Set-CalendarProcessing -Identity RoomMailbox@domain.com -AutomateProcessing AutoAccept -AddOrganizerToSubject $false -RemovePrivateProperty $false -DeleteComments $false -DeleteSubject $false –AddAdditionalResponse $true –AdditionalResponse "Your meeting is now scheduled and if it was enabled as a Skype Meeting will provide a seamless click-to-join experience from the conference room"`



5. Log into the Office 365 Portal. Click on Active Users and find the new account you just created above.

6. Change the accounts Email Address/UPN to be MeetingRoom@domain.com (by default this account will have been created with a domain.onmicrosoft.com address)

7. Assign a licence to this account for both Exchange and Skype for Business


## Create the Remote Mailbox in Exchange on prem
1. Open your Exchange MMC and click on Recipient Configuration –> Mail Contact

2. From the right hand side select “New Remote Mailbox”

3. Select Room Mailbox and click Next

4. Specify the on premise OU as:

    `YourDomain.com/Exchange/Mailboxes`

5. Fill in the Name (ignoring the Firstname, Initials, Lastname fields)

6. Enter the UPN as the same as what you created in the O365 Room Mailbox – In this example it would be meetingroom@domain.com, and click Next.

7. Do not add an archive mailbox – just click Next.

8. Review the details and click ‘New’ to create the Remote Mailbox

9. Open the new account in AD Users and Computers and verify that the UPN and the primary E-mail values match the address in O365 that was created above.

10. Force or wait for a directory sync to run

11. Verify that the account in the Office 365 Portal shows as “Synced” versus “Cloud” – You can also try to edit the account on the 365 portal and if you get an error stating it’s a locally synced account then it’s all okay.


## Enable Skype Room account on the on prem Lync (or Skype) Server
In my current environment we are running in Hybrid so it’s easier to Lync enable the mailbox on-prem and move the account to Skype for Business online at a later stage.
1. Logon to your Lync (or Skype) server and access the Lync Management Shell

2. Execute the below command replacing the Identity with the Meeting Room UPN you created above. The Registrar Pool is the Lync front-end server that you want your users to be homed on.

`Enable-CsMeetingRoom -Identity meetingroom@domain.com -RegistrarPool pool.domain.com -SipAddressType EmailAddress`
<br/>
## Enable Active Directory Account and Set Password
By default, a Meeting Room mailbox has an AD account but it is disabled. So we need to reset the password, ensure it never expires and enable the account. This can all be done from ADUC.