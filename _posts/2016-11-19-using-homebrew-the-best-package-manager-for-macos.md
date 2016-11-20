---
layout: post
title: "Using Homebrew - The Best Package Manager for MacOS"
author: Steve Frost
date: 2016-11-19 12:30:00 -04:00
categories: blog
tags: tools tips-and-tricks
description: "Homebrew is an incredible resource for new and old developers alike. Homebrew saves you time by compiling code, managing package dependencies, and much more!"
comments: true
---

![HomebrewLogo]({{site-url}}/assets/homebrewlogo.png)
It is hard for me to hold back the excitement for [Homebrew](http://brew.sh/). It has saved me hundreds of hours, surely. If the feeling of frustration with juggling dependencies, root paths, compiling, repair, and updating packages is familiar, Homebrew is here to save you as well.

**What is Homebrew?**

Well, what is Homebrew you might be asking? Homebrew is a relatively new package manager - more on what "package" means later - that first saw light in 2009 and more recently reached v1.0 on Sept 21, 2016. Before Homebrew, Mac users had a similar manager called Macports which was really popular. The two share many qualities but also part in a few ways - mostly that Homebrew believes in avoiding patching whenever possible.

So what are packages? In the broad, most frequent sense, packages are [installable bundles of source code.](https://computers.tutsplus.com/tutorials/homebrew-demystified-os-xs-ultimate-package-manager--mac-44884) If you scour the internet you can find many official packages and some not so official - looking at you Jekyll-Test-Plugin-Malicious that has the tagline "I will eat all of your code." Official packages usually come with a very supportive community and lots of people who have run into common issues but even with that, there are frequently issues I encouter that are specific to my operating system version, current environment, etc - and you will/have/always run into these kind of issues while installing packages.

This exact headache is why [Max Howell](https://twitter.com/mxcl), creator of Homebrew, came up with the idea. Well that, and he wanted a package manager that was beer themed because the "puns to package manager ratio was far too low" as [Mike McQuaid](https://twitter.com/MikeMcQuaid) hilariously referenced on [Oct 4th's Ruby on Rails podcast](http://5by5.tv/rubyonrails/221).

Now that you know some of the backstory about Homebrew and what exactly it does, let's go over installing, typical use, and then some tips & tricks.


**Installing Homebrew**

To install Homebrew, open up your Terminal and enter `/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"`. If you're curious what this script does, there is a description that is printed out in the terminal that includes that information. Once Homebrew is installed, any package can be installed via the command `brew package` i.e. `brew zzz` which is a package for a [command-line MacOS sleep program](https://github.com/Orc/Zzz). This will install the package into your Cellar according to the Formula. Here is a brief list of the common Homebrew puns/terms you'll come across.
  * Formula - the package definition
  * Keg - the installation prefix of a formula
  * Cellar - the place where all Kegs are stored
  * Tap - an optional git repository of formulae and/or commands
  * Bottle - when a pre-built keg is used instead of building from source
  * Cask - an [extension of homebrew](https://github.com/caskroom/homebrew-cask) to install macOS native apps
  * Brew Bundle - an [extension of homebrew](https://github.com/Homebrew/homebrew-bundle) to describe dependencies

**Maintaining Homebrew**

Okay, so you've gone hog wild with the puns, putting kegs in your cellar, tapping casks, and bonging repositories (not a real one) - how do you keep these all updated? Enter another wonderful thing about Homebrew. To update your packages, just use `brew upgrade` and Homebrew will search through your Cellar and upgrade all packages to the most recent source available. To keep Homebrew itself updated, that is simple - enter `brew update` in the Terminal. Each time Homebrew updates, new packages are made available to install.

**Tips & Tricks**
  * `brew info kegname` displays info about that package
  * `brew cleanup` to remove older, unused Formula versions
  * `brew ls kegname` shows how the keg is arranged in your Cellar
  * `brew outdated` to see what is outdated and could use a `brew upgrade`
  * `brew pin kegname` will prevent a keg from being updated and `unpin` will undo

**Conclusion**

Give Homebrew a try and let me know how you like it. As a new Rails developer, it has been a godsend for installing things like geckodriver, imagemagick, and sqlite. While installing each of these manually, I came across issues that Homebrew easily resolved *and* I don't have to worry about keeping the packages up-to-date. Homebrew does a wonderful job of [documentation](https://github.com/Homebrew/brew/tree/master/docs) - THANK YOU - so you'll rarely be left in the dark. Even with these docs, there may be an issue or improvement to offer. If there is a way you can contribute, don't hesitate to fork, edit, and open a pull request to help out the community. Before investing your time, view the [FAQ](https://github.com/Homebrew/brew/blob/master/docs/FAQ.md) as that could answer the question or address the issue.

Enjoy!
