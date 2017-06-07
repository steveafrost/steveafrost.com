---
layout: post
title: "Laying the Foundation for a Website"
author: Steve Frost
date: 2017-02-12 22:00:00 -04:00
categories: blog
tags: static-site-generator wordpress
description: "You've been asked to make a site for a friend, family member, or client - where do you start?"
comments: true
---

![building-a-website-featured-photo](/assets/img/blogs/buildingawebsite1.jpg)

So you've been asked to make a website for a friend, family, neighbor, and maybe even a paying client? One of the first questions to answer is what platform or framework is best to use for this particular job. For years, it was between [several great options](https://lifehacker.com/5965141/how-to-find-the-perfect-way-to-build-your-web-site-for-coders-and-non-coders-alike) which included anything from drag-and-drop to content management systems. In the past few years, we've also seen another options emerge: static site generators. Here we'll try to breakdown what are the benefits and drawbacks of each style so that you can get started on the right foot.

### Drag-and-drop - [Wix](http://www.wix.com/) / [Squarespace](https://www.squarespace.com/)

Drag-and-drop site builders have been snatching up all the commercials in the past few years and it's led them to be a really popular option. You'd think they just started the business but believe it or not, the more popular drag-and-drop site builders got their start [as early as 2004](https://www.squarespace.com/about/company/). I didn't believe it. Two of the most popular options - Wix & Squarespace - share that users have used their services to create multiple millions of websites.

* Benefits
  * Easy, quick to setup
  * Abbreviated admin dashboard UI to make updates - user friendly
  * There is usually a free option available
  * No technical maintenance required

* Drawbacks
  * Free options usually place ads on your site
  * Limited customizability, extensibility
  * High monthly fee when website grows or you want to remove ads

### Content Management Systems (CMS) - [WordPress](https://wordpress.com/) / [Joomla](https://www.joomla.org/)

Since WordPress makes up almost 60% of this category, we'll stick to talking about it. WordPress is also 27% of the total web right now which means there is a tremendous community around it. WordPress is most commonly used for a blogging system - hence content management - and I would say it fits that need perfectly. Since 2003, they've been iterating on WordPress to make it the most robust website solution around.

* Benefits
  * Can be self-hosted (you own your content)
  * Full administrator dashboard UI - user friendly
  * Massive community means support forums are filled with answers to common questions
  * Extensibility through 3rd-party plugins

* Drawbacks
  * If self-hosting, technical maintenance is required
  * Includes a database which can be a source of vulnerability
  * Some knowledge required to do initial setup

### Static Website Generators - [Jekyll](https://jekyllrb.com/) / [Middleman](https://middlemanapp.com/)

Robust is good if you need it but sometimes WordPress can be like using a sledgehammer to crack a nut. After making several sites of varying use from WordPress, I found the latest trend of static website generators very liberating. It is almost full circle from how websites were originally created - a group of HTML files, a group of CSS files, and maybe a JS file if the site was gettin' fancy. These generators take that idea one step further and usually incorporate some type of [front-matter](https://jekyllrb.com/docs/frontmatter/), loops, and other intricacies [provided by a templating language](http://tutorials.jumpstartlab.com/topics/better_views/erb_and_haml.html). As you've guessed by the last few sentences, these generators are the hardest of the three options to setup but they also provide a spectacular payoff.

* Benefits
  * Fastest page loads of all options - really, really fast
  * No database means no vulnerabilities like WordPress
  * Extremely customizable & extendable
  * Jekyll pages can be [hosted for free](https://help.github.com/articles/using-jekyll-as-a-static-site-generator-with-github-pages/) on GitHub pages

* Drawbacks
  * Intermediate knowledge of programming required to setup
  * If changes are needed, there is no user friendly dashboard like other options have
  * Depending on where it is hosted, there may be server maintenance involved

### Wrap-Up

If it isn't evident, I have grown partial to the static website generator option. It's true, I am absolutely in love with it right now and this site is actually built with one of those - Jekyll. I'm also working on another site that uses the other static option, Middleman, and will be doing a post about my experiences with it once I'm finished.

All that said, when taking on a job it is always best to think which one of these options is the right tool for the job. Taking time to craft a plan before starting can seem like procrastination or running in place but it almost always pays off in the long run. [Travis Neilson](http://travisneilson.com/) said it best in his [DevTips YouTube Series](https://www.youtube.com/watch?v=VcMjo_wczCc) when he said, "a large part of this job is thinking, and planning, and organizing."