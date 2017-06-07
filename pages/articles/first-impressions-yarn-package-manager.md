---
layout: post
title: "First Impressions: Yarn Package Manager"
author: Steve Frost
date: 2017-05-14 19:00:00 -04:00
categories: blog
tags: first-impressions yarn dependency-management
description: "Opening the First Impressions series is none other than the cool kid on the block: Yarn package manager. Yarn was created in collaboration and open sourced last October by Facebook, Exponent, Google, and Tilde."
comments: true
---

![ball-of-yarn](/img/blogs/firstimpressionsyarn1.jpg)

Opening the First Impressions series is none other than the cool kid on the block: Yarn package manager. Yarn was [created in collaboration and open sourced](https://code.facebook.com/posts/1840075619545360) last October by Facebook, Exponent, Google, and Tilde. I still remember the first time I heard about Yarn at BrooklynJS. It was described as the "hip" package manager and received scoffs when mentioned due to it's instability. Since then, it has snowballed in popularity after working out the initial kinks and by providing benefits over the leading, rock-solid [Node Package Manager or NPM](https://www.npmjs.com/).

After spending a few days with Yarn, here are the features I've come to appreciate.

* Predictability – Lockfile by Default
    - NPM offers this option (shrinkwrap) but it is off by default. After spending time in Bundler in Ruby, a lockfile like home to me and when using one we don't have to worry about incremental versions of packages being introduced. These incremental versions, i.e. 1.0.0 to 1.0.1, aren't supposed to have breaking changes by [community standard](https://docs.npmjs.com/getting-started/semantic-versioning) though not all developers follow this suggestion. A good practice is to not be lazy and expect them to always adhere to the standards – use a lockfile. 

* Speed & Optimization - Parallel Operations and Cache Directory
    - These two go hand-in-hand. Yarn shows a sizable improvement over NPM in regards to speed. Yarn claims to parallelize operations more efficiently to result in fetching packages at a fraction of the time. This is compounded for packages that have already been downloaded as Yarn first looks in the cache directory. If the package is found there, it doesn't have to download it again like NPM which means a tremendous speed increase [(12x in this test)](https://youtu.be/hMk_9RjX5KE) and it also means that if you're offline then Yarn will use the local cached version without needing Internet access like you'd need with NPM.

![terminal-with-yarn-add-and-npm-install](/img/blogs/firstimpressionsyarn2.jpg)

* Readability – Reduced Warnings, Condensed Trees, and Emojis
    - Ok, I *saw* you roll your eyes at emojis, but they're fun! If the cute spyglass, truck, and other emojis don't do it for you, Yarn also has managed to condense the pestering warning messages that are commonplace with NPM. Reading the output sans warning messages and with the condensed dependency tree takes managing packages from a sometimes irritating level to a more enjoyable experience. Lastly, I prefer `yarn add` to `npm install` since it better captures the essence of adding a package to a project. Keying in `yarn global` to add globally makes more sense in my head than `npm -g`. This is clearly personal preference though I want to think these commands are more comfortable and sensible to more than just me.

After spending only a few days and around ten hours on Yarn, I think I am converted. It probably helps that I hadn't used NPM for very long and that each has similar behaviors as outlined in Yarn's [migration guide](https://yarnpkg.com/lang/en/docs/migrating-from-npm/). To this point, I have only dealt with one issue and that was the `yarn global ls` not working which is fixed in the most recent `v0.24.4` release. The repository has a healthy amount of closed issues and around seven-hundred open issues which reinforces that while powerful and lean, you could run into bugs here and there. If you're thinking about making the switch, I recommend the [fantastic documentation](https://yarnpkg.com/en/docs/getting-started) as well as [this intro video](https://www.youtube.com/watch?v=7n467QmiANM).


### About First Impressions

First Impressions is an ongoing series intended to provide an overview of technology that I've had a hands-on experience with for only a few days. Each blog will cover a single topic and include my straightforward, 72-hour takeaway with any resources that I've found helpful. My intention is that these First Impressions will be both useful intros for others and a personal chronicle to process and reflect on material.
