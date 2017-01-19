---
layout: post
title: "Learning a Second (Programming) Language"
author: Steve Frost
date: 2016-11-30 19:00:00 -04:00
categories: blog
tags: flatiron-school learning-to-code javascript jQuery project
description: "There will never be such a special programming language as your first. The quicker you realize that, the quicker you can move on and make yourself a more robust developer."
comments: true
---

![javascript please work](/assets/img/blogs/jspleasework.jpg)Over the past month if I wasn't eating, sleeping, or working, I was nose-deep in material about Javascript & jQuery for class at [Flatiron](https://flatironschool.com). As with the lessons & labs involving Ruby, this was my first time with Javascript. Overall, it was tough. I was more discouraged, more often with Javascript. I found myself comparing it to Ruby - longing for the days of simplicity, no semi-colons, and [better error messages](https://www.sitepoint.com/ruby-error-handling-beyond-basics/) than `undefined`. Finally, luckily, I realized that my frustration and discouragement was mainly two factors.



### My First Love
Ruby was the first real programming language I had learned and I was being biased. My brain had been programming a long time in Ruby and it was the way I thought about code so any change to this was going to be met with resistance. It's like [learning a second language](https://www.babbel.com/en/magazine/10-stages-of-language-learning) in addition to your native tongue. At first, you'll convert everything to that native tongue and make sense of it. Then, as you mature in the language, you are able to think in both languages and there is less inner translation that occurs. As I had less quarrels with myself about how this JS looked in Ruby and adjusted my mind to think in a Javascript way, I had more successful moments.

### Each Language is Seperate
There are shared patterns and logic between Ruby and JS but it was helpful for me to keep in mind that each language has their own constructs and behavior. This undoubtably sounds like an "of course!" point to those who have been programming for awhile. Personally, it was a hard point that was the source of many of my struggles with Javascript. When moving through this new language, I brought a lot of *how* Ruby worked along and was frustrated when JS didn't work that way. Eventually, I learned that JS did things the JS way and approached problems in a different manner than what I knew. Once I disconnected from previous conventions, I was able to learn.

As soon as I got semi-comfortable, [our final project](https://learn.co/lessons/rails-js-assessment) for the section! The requirements were to dismantle (ok, maybe not that harsh) your beautiful (true) Rails app and use JS/jQuery to power front-end functionality. Noooooo! Piece-by-piece I found JS equivalents to my Rails code learning Javascript more with each substitution.

### If You Can't Rails, Kinda Rails
[Handlebars](http://handlebarsjs.com/). First, I had to learn not to call it Handlebar Mustache because Mustache is a different templating language. As far as installation and getting started, Handlebars homepage and documentation is straight forward and easy to use. It was especially useful for replacing the [Rails partials](https://richonrails.com/articles/partials-in-ruby-on-rails) in my app. Handlebar templates are very similar to partials, at least in the way I used them. They can hold all your HTML so that JS isn't concerned with any HTML. This is one of the main benefits because up to this point I had been concatenating long strings in Javascript like this:

```javascript
  html = '';
  html += 'my first line of text';
  html += 'some more text';
  html += 'now this is getting kinda messy';
  html += 'yup, need handlebars';
  return html;
```

With Handlebars the HTML can be included in natural form & syntax as long as it is wrapped with the `<script id="entry-template" type="text/x-handlebars-template"` tag. It will then appear hidden on the page, ready for use by the Javascript. The second useful feature of Handlebars is that it has expressions that are wrapped in {% raw %}{{ }}{% endraw %} which work like variables that can be injected from the Javascript. This works great for grabbing JSON from the Rails API and displaying it on the front-end. There are also loops/conditionals that can be used in conjunction with these expressions. Those familiar with Ruby or Javascript will recognize options like `each` and `if/else`.

Another practice I found helpful was attempting to do my Javascript/jQuery in the console within the web browser before using it within the app. In the console, you can make changes with greater speed and try different approaches all while seeing the results in realtime with your app appearing within the browser as well. This is priceless! If I had to make all my changes in the code and then load the app, navigate to the particular section, and mock the user behavior, that would take much longer! If you're more used to Terminal, and have [node.js](https://nodejs.org/en/) installed, you can use `node` in the Terminal to drop into a Javascript console. This is kinda like an IRB session in Ruby. It is useful for quick tinkering where the console in the web browser is useful for interacting directly with your application.

### Acceptance
After getting more acclimated to Javascript and letting my brain settle into a different way of thinking, I found enjoyment in the immediateness of Javascript - especially the jQuery library. There is an excitement to being able to interact with an app instantly to move, toggle, slide, fade, and hundreds of other actions. Using the knowledge gained so far of Javascript, I was able to reproduce effects and techniques I'd seen around the web for years like overlays, loading pages without hefty refreshing, and posting data to the server and having that same data appear on the screen. The last of which I considered honest-to-god magic before going through these Javascript lessons.

Looking down the barrel at the upcoming Angular lessons, there is some deja vu I feel when starting a new section. Each section of learning code at Flatiron has forced me outside of my shortly enjoyed comfort zone. Each one has been challenging, aggravating, and that much more rewarding at the end. I hate programming. I love programming. I can't wait to start learning Angular.