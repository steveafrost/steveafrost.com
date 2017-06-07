---
layout: post
path: building-a-ruby-gem-the-experience
title: "Building a Ruby Gem: The Experience"
author: Steve Frost
date: 2016-06-25 18:24:00 -04:00
categories: blog
tags: flatiron-school learning-to-code
description: "The tale of persistence behind building my first CLI gem."
comments: true
---

_(Day 50)_

Over the last couple weeks I've been working my final project for Ruby at [Flatiron School](http://flatironschool.com) and have brought it to a close today by publishing it on [RubyGems.org](https://rubygems.org). The feeling is hard to describe... I believe it is excitement, fulfillment, relief, and confidence that I can indeed do this. At some points in the project, I couldn't see the end of the tunnel but now what was just an idea is a Ruby gem available to anybody in the world.

### Requirements for the Project ###
1. Package as a gem
2. Provide a CLI on gem installation
3. CLI must provide data from an external source, whether scraped or via a public API
4. Data provided must go at least a level deep, generally by showing the user a list of available data and then being able to drill into a specific item

### Project Idea ###
Build a CLI gem that scrapes MLB.com's scoreboard and display a list of all matchups from the previous day. The user is then prompted to enter a number that corresponds with a matchup to see the full boxscore of the respective matchup.

### Planning the Gem ###
Before I started coding the gem, I thought it would be a good idea to thoroughly think it out.

* Which classes need to be created, what do they need to represent?
  * Initially I planned to have a Scoreboard class, a Score class, and a Scraper class. Later these condensed into a CLI class which handled all CLI activity and a Matchups class which handles scraping and assigning the scraped info to matchups and box score details.
* Do they need to communicate with each other?
  * The classes do not need to have relationships with each other but they will be used within each other. In example, the CLI class will need to know about the data being scraped and assembled in the Matchups class so that it can display it.
* How can I leave the gem open to being extended later?
  * If the URL/API to be scraped has a variable string then I can inject dates into it to display scores from any day. If that functionality exists the gem can be extended further to calculate boxscores from multiple days.

### Coding the Gem ###
The hardest part of this project (careful, I will use this phrase multiple times) was starting. Staring at a blank canvas is intimidating. What helped the most is to take things one step at a time. Consider what the very first task that needs to be done is and do it. Then, move onto the next task. In a short time, the program starts to take shape and the outline will emerge ready for filling in with all the details.

I had to stop every few tasks to think about the path that was being set and that helped to see the path forward. Once during this reflection I realized that I was letting the scope of the project get too large. I had branched into providing standings and access to several dates of scores instead of just sticking with my original idea. Setting the goals early on in the project and frequently checking on them helped with keeping the scope in check.

Along the way, the speed of development varied drastically. I would take two steps forward and one step back, then five steps back and one forward, then ten steps forward, typing as fast as my brain could spit out the right answers that were destined to save my gem. Overall, I found that most of the stumbling was in the start when I didn't know what direction to take and at the finish as things were polished up.

That leads me to my last point, publish your gem. Just do it. After hours, days, weeks of working on the gem you will become attached and want it to be just a little bit better, just a little bit better, just a little bit better... publish it.

### Final Product ###
If you have a minute, give it a try and let me know what you think: [MLB Scoreboard Gem](https://rubygems.org/gems/mlb_scoreboard)
