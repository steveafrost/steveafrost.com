---
layout: post
title: "Honeypotting: Simple Spam Prevention"
author: Steve Frost
date: 2017-03-11 12:30:00 -04:00
categories: blog
tags: html css javascript forms security captcha honeypot
description: "The idea of creating a honeypot is not new to development, and you might have even used one before without knowing it. Fundamentally, a honeypot is a hidden form field that lives amongst other, legit fields and is then hidden from the user."
comments: true
path: "/articles/honeypotting-simple-spam-prevention"
---

![honeypot-picture](/img/blogs/honeypot1.jpg)

Spam was a real problem when the World Wide Web was in it's infancy and remains equally pesky 20-some years later with some countries even [passing spam legislation](http://fightspam.gc.ca/eic/site/030.nsf/eng/home). At it's most basic, preventing spam involves [blacklisting](https://sendgrid.com/blog/email-blacklist/), or preventing, IPs that have been deemed suspicious from accessing a server. Actually, this is one technique that has stood the test of time and is still used regularly for spam, malicious ads, poor torrent seeders, etc. Along the way, we also invented a few ways to detect spam before it even reached the server or the blacklist: captchas with hard to read words, filters, speaking captchas, DNS lookup, captchas that included *math*, and newer techniques such as [greylisting](https://www.greylisting.org/).

### How I found Honeypotting

While these techniques are effective, each one has it's own drawbacks. During my most recent project, [my teammate](http://joelbitar.space) and I had to implement a form to capture user information and became curious about how best to prevent spam without clouding up the user experience. Captchas are the most common type of form spam prevention because they're effective though we had a clean design and didn't want to toss in a captcha as they don't always look the fluid with the site and can be aggravating to resolve as a user. Our users were going to be everyone from children to older adults so we decided to look at other options and stumbled onto a term called [honeypotting](https://solutionfactor.net/blog/2014/02/01/honeypot-technique-fast-easy-spam-prevention/).

### What is a Honeypot?

The idea of creating a honeypot is not new to development, and you might have even used one before without knowing it. Fundamentally, a honeypot is a hidden form field that lives amongst other, legit fields and is then hidden from the user. 

```html
<form method="POST" action="some-action">
    <input type="text" name="email" placeholder="email">
    <input type="text" name="zip" placeholder="zip">
    <input type="text" name="honeypot" placeholder="honeypot">  <!-- we hide this with CSS -->
</form>
```

The spambots that comb through sites and produce the vile spam we've come to despise typically look directly at the source code so while the user will not see this honeypot input field, the bots will and they will fill it in. Gotcha! Using JS or PHP for form validation we can now reject the entry if the field is filled in. 

```javascript
$('form').submit(function() {
  if ($("input[name='honeypot']").val() === '') {
    // send entry to server
  } else {
    // must be a bot
    // reject entry before it hits server
  }
}
```

Now we know that it's a bot trying to fill us up with the latest news of [our favorite Nigerian Prince](https://www.bbb.org/new-york-city/get-consumer-help/articles/the-nigerian-prince-old-scam-new-twist/).

### Improving Your Honeypot

While this simple, clean technique worked perfectly when it was first introduced, spambots have gotten used to seeing fields that don't make sense or have obvious names like "honeypot" so be creative. The more creative you are, the better.

* Give all form fields random names. If all fields are random, then the spambots don't have a clear indication as to which ones are honeypots and will fill them all in - exactly what we want. If the server needs uniform names then Javascript/PHP can be used to change the field names on submit. 
* Place the honeypot field randomly amongst the others rather than first or last.
* Include a form label - `<label for="name-here"></label>` – for each form field including the honeypot. This makes the honeypot look more authentic since it follows the structure of the other fields.

### Wrap-Up

Honeypots are a dead-simple technique that can be baked into each form on a website to prevent spam. Remember, I'm using prevent in a non-inclusive way. Each day spambots are getting smarter and some are bound to detect the honeypot - heck, [some can even solve captchas](https://arstechnica.com/information-technology/2013/11/how-are-robots-beating-my-captchas/). That said, when weighing the overhead against the benefit, honeypotting is an efficient technique and it provides an easier, cleaner UI experience than ([impossible](http://www.seosmarty.com/impossible-captcha-it-doesnt-really-matter-if-you-are-human-or-not/)) captchas.

