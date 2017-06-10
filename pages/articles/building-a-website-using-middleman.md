---
layout: post
title: "Building a Website using Middleman"
author: Steve Frost
date: 2017-02-26 10:00:00 -04:00
categories: blog
tags: static-site-generator middleman rails ruby
description: "Static Site Generators were all the hype in 2016 and remain an indispensable option for tech-savvy, or courageous, people looking to create a website."
comments: true
---

Static Site Generators were all the hype in 2016 and remain an indispensable option for tech-savvy, or courageous, people looking to create a website. Roughly, they sit somewhere in-between create individual HTML, CSS, and JS files and using a feature-rich solution like WordPress. After using WordPress for projects for several years, I've started to make a switch to these lighter, simpler generators for the recent sites I've created. Here we'll talk about the two options I've used, how they compare to each other, benefits over WordPress, and further insight into generators.

Over the past 2 weeks I've been working on a website for a client using [Middleman](https://middlemanapp.com/) and have completely fell in love with it. Middleman is one of several emerging static-site generators which provide a robust, modern toolset to create a website, typically without a database. My introduction into static-site generators was when I built - and rebuilt, and rebuilt - this website using Jekyll which is one of the [most popular options](https://www.staticgen.com/).

### Using Middleman Over Jekyll

My affection for Ruby led me to each of these as they're both written in the [most beautiful, artful programming language](https://www.ruby-lang.org/en/about/). After using each generator, I've noticed there are more similarities between the two than differences. 

Since they're both written in Ruby, there is a Gemfile that can be used to [extend each through gems/plugins](https://jekyllrb.com/docs/plugins/) & provide a quick way to clone the project and get started using `bundle install`. Each option also comes with a built-in way to run a local server enabling [real-time development cycle](https://middlemanapp.com/basics/development-cycle): make a change in the HTML file and see the changes instantly in your browser without ever having to deploy code to a live server. In addition, both work without the use of a database. This can be limiting in some ways as we'll see in the next section but does have perks. Instead of the typical request cycle involving a database which can be plodding, a static-site generator packages up the site into a collection of flat, static HTML files which can be served to the user lightning fast. 

As far as differences, I see Jekyll as a blog-centric solution and Middleman for everything else. Middleman uses more Rails conventions such as helper methods and [Sprockets](http://www.rubyinside.com/sprockets-a-ruby-powered-javascript-dependency-library-from-37signals-1520.html). Middleman can also be made into a blog with a [community extension](https://directory.middlemanapp.com/#/extensions/all) though if the project requires a blog, Jekyll is the perfect fit for that. These two generators also differ on templating language. [Jekyll's uses Liquid](https://jekyllrb.com/docs/templates/) which was conceived by Shopify while Middleman ships with [support for ERB & HAML](https://middlemanapp.com/basics/templating-language/). Coming from a Rails background, I find ERB & HAML to be more straight-forward than Liquid. Other people like [Liquid because is easily extendable](https://www.sitepoint.com/ditching-erb-a-guide-to-using-liquid/). As most things in programming, this one is personal preference.

### Generators vs WordPress

So why did I switch from creating websites in WordPress to using generators? The simple answer is that most projects don't require the feature-rich environment of a WordPress installation. If the project doesn't require users, forms, or ecommerce, ditch the database. Using one when it isn't needed is overkill which adds overhead to page loads and also opens up the site to [vulnerabilities](http://www.zdnet.com/article/the-top-ten-most-common-database-security-vulnerabilities/), including the [number one type of attack](https://en.wikipedia.org/wiki/SQL_injection). In contrast, one of the lacking areas of generators compared to WordPress is that they do not have an administration UI by default. That means to edit the website, the actual files need to be changed instead of having a visual editor. This is [one of the main reasons](https://www.sitepoint.com/7-reasons-not-use-static-site-generator/) for avoiding generators. As always, pick the right tool for the right job. If the site owners are technically-apt or the maintenance will only be done by the developer, the admin UI is another unnecessary overhead. If the site is going to be turned over to people who aren't so comfortable working with raw files, an admin UI can be an immense benefit for both sides.

### Shortcomings and Dealing with Them

After hours of research and tinkering with generators, I've come across some useful ways to combat a few shortcomings of generators. Sometimes one or two features of a database-driven website are needed but not enough to justify using a database – this is where creativity is useful. The most vital issue that I recently solved with the help of fellow generator-enthusiast, [Joel Bitar](http://www.joelbitar.space/), was the need for a form on a Middleman site. Typically a form requires a backend to process the form and store the user data. Both Jekyll and Middleman communities have come up with ways to circumvent this using paid options like [FormKeep](https://formkeep.com/guides/contact-form-middleman) and [SimpleForm](https://getsimpleform.com/) or free solutions like [submitting the form to Google Sheets](http://railsrescue.com/blog/2015-05-28-step-by-step-setup-to-send-form-data-to-google-sheets/). Another feature most blogs like to have that generators fall short on is comments. Currently, Jekyll has a few solutions to this including the one used here on this blog, [Disqus](http://www.perfectlyrandom.org/2014/06/29/adding-disqus-to-your-jekyll-powered-github-pages/). 

### What's Next?

After playing around with the two Ruby-based generators here, I'm looking to try out a few popular Javascript-based ones soon. Mostly, I am curious to try ones like [Gatsby](https://github.com/gatsbyjs/gatsby) that incorporate current hot topics like components once I have a project that benefits from having reusable pieces of code. Until then, I'll be building a few more Middleman & Jekyll sites to refine those skills and summarizing any insightful experiences here. If you have any questions or tips of your own, leave them in the comments below!
