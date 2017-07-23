---
layout: post
title: "First Impressions: Trellis"
author: Steve Frost
date: 2017-06-11 20:45:00 -04:00
categories: blog
tags: wordpress vagrant environment devops trellis
description: "The Roots bundle is made up of three components which can be used individually or together: Trellis, Bedrock, and Sage. Briefly, Trellis is the server layer, Bedrock is the application layer, and Sage is the theme layer. Thus far, I've gone through the Trellis setup (locally & remotely, more on this soon) so this post will be exclusively about that layer."
comments: true
path: "/articles/first-impressions-trellis"
---

![trellis-logo](/assets/img/blogs/firstimpressionstrellis1.jpg)

After spending several months creating websites with static-site generators, I had my hesitations to come back to polishing up a WordPress site for a long-time client. On one hand, working in WordPress means I don't have to worry about the shortcomings involved when using flat HTML files such as not having a database or method for processing forms – [workarounds do exist though](https://steveafrost.com/building-a-website-using-middleman/). On the other hand, I was sure I'd miss my modern tool set including live reload, included sass support, templating languages, dependency management, and so on... that is, until I heard about the [tools at Roots](https://roots.io/).

### Roots - Modern WordPress Tools
The Roots bundle is made up of three components which can be used individually or together: [Trellis](https://roots.io/trellis/), [Bedrock](https://roots.io/bedrock/), and [Sage](https://roots.io/sage/). Briefly, Trellis is the server layer, Bedrock is the application layer, and Sage is the theme layer. Initially I was introduced to Sage by [Jesse Ross](https://twitter.com/jesseross) and had whole-heartedly planned on researching the documentation then trying to build it into a legacy site. As I read more about each tool, especially Trellis, I decided to give the full bundle a run. Thus far, I've gone through the Trellis setup (locally & remotely, more on this soon) so this post will be exclusively about that layer. As I progress through, I'll write an article about each.

### So, What Is Trellis?
Excuse any rookie devops inaccuracies in this section. This was my introduction to isolated containers such as Vagrant & Docker which I love so far. Previously, I wrote about setting up your WordPress environment with MAMP and mentioned it can also be done more manually w/ homebrew though I think the best way to retain consistency between development, staging, and production is with Trellis. Trellis can be configured to deliver this consistent environment using a mixture of provisioning via [Vagrant](https://www.vagrantup.com/) & [Ansible](https://www.ansible.com/how-ansible-works), Composer to manage dependencies, and aspects I'm sure I haven't discovered yet. 

### Setup & Organization
![trellis-folder-structure](/assets/img/blogs/firstimpressionstrellis2.jpg){: .align-left}
I'd be remiss if I wasn't up front about the setup part of Trellis, it can be taxing. The tool is quite massive when first diving in though as with many things development, once I settled in and started to break it down folder by folder, I quite like the organization. In the screenshot, you can see that the top level is split by the Trellis tool & the site built by Trellis. I love that! That means if I have to leave Trellis at some point, the `/site` folder is easily detachable. Drilling down further, the site folder opens up and reveals the composer file, for managing dependencies – more on that soon, while also include a `/web` folder which is where our WordPress files now live. The structure does a great job of separating the logic between Trellis, site config, and actual core WordPress files. As an organization ~~freak~~ connoisseur, Trellis feels like home.

### Portability
Speaking of home, Trellis makes a tremendous nomad. There has to be some way to justify all that setup, right? Once you've setup Trellis, the configured environment can be used to provision both a staging and production server but more importantly, another development server! That means if I forget my MacBook, or if I'm using someone elses, or if a teammate wants to work on the website, it is as easy as pulling down the repo and running `vagrant up`. By the way, that is one of the most satisfying commands. In Trellis' case, it goes through all the Ansible playbooks and YAMLs step-by-step to setup a true local Linux box via a virtual machine like [Virtual Box](https://www.virtualbox.org/wiki/VirtualBox). I even tested it out... er, actually I borked my setup about halfway through setting up the production server. Reasonably confident went to reasonably nervous real quick. Had all my work paid off? A simple `git clone` from my repo and `vagrant up` got me back up and running within ten minutes. I'm a believer.

### Remote Provisioning
I've had a Digital Ocean droplet with the new customer credits for months and never could figure out what to do with it. All my WP sites were hosted elsewhere, my web apps were on Heroku's free tier, but I knew the free credits would come in handle eventually. Enter Trellis & Digital Ocean. If you have a Droplet on Digital Ocean, Trellis provides a [super simple guide](https://roots.io/trellis/docs/remote-server-setup/) to provision your remote server. Once you have configured the YAML files necessary, it is a simple `ansible-playbook server.yml -e env=<environment>` command to provision the server. It doesn't necessarily have to be Digital Ocean either, the same command can be used for Heroku and other providers.

### Dependency Management
Long live Composer! Composer has been the [more popular option lately](https://benramsey.com/blog/2013/11/the-fall-of-pear-and-the-rise-of-composer/) for PHP dependency management so I'm glad to see the Roots team rolled it into their modern tooling. At first, I didn't understand what exactly I'd use Composer for when working inside of WordPress. Then, I read more into it and a weight was lifted off my WordPress shoulders: Composer can, and should be, used for WordPress plugins. 

```php
"require": {
    "php": ">=5.6",
    "composer/installers": "~1.2.0",
    "vlucas/phpdotenv": "^2.0.1",
    "johnpbloch/wordpress": "4.8.0",
    "oscarotero/env": "^1.0",
    "roots/wp-password-bcrypt": "1.0.0",
    "wpackagist-plugin/akismet": "3.3.2",
    "wpackagist-plugin/contact-form-7": "4.8",
    "wpackagist-plugin/genesis-responsive-slider": "0.9.5",
    "wpackagist-plugin/google-sitemap-generator": "4.0.8"
  },
```

The incredible site of [WPackagist](https://wpackagist.org/) lists all WordPress plugins and themes which can be easily added to your `composer.json` file, installed with `composer install`, and updated with `composer update` – yes, updates & version locking that easy. It reminded me of [RailsAssets](https://rails-assets.org/#/) which converts bower.json files into gems similar to how WPackagist does in mirroring WP Plugins/Themes as a Composer directory. For more info about RailsAssets, see how I used it in my Rails/Angular app [here](https://steveafrost.com/a-greenhorns-approach-to-angular/). The resources the developer community creates is amazing.

### Onto Bedrock
Now that I have a stable Trellis base, it's time to move onto Bedrock which is the boilerplate from the same Roots family. These tools are essential to bring WordPress into 2017, especially with all of the innovation going on in JS land. I'm excited to see what the Roots team comes up with in [v1.0 of Trellis](https://github.com/roots/trellis/releases/tag/1.0.0-rc.1) and am optimistic about it's growth for years beyond.

### About First Impressions
First Impressions is an ongoing series intended to provide an overview of technology that I've had a hands-on experience with for only a few days. Each blog will cover a single topic and include my straightforward, 72-hour takeaway with any resources that I've found helpful. My intention is that these First Impressions will be both useful intros for others and a personal chronicle to process and reflect on material.
