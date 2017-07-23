---
layout: post
title: "Responsive CSS with REMs & EMs"
author: Steve Frost
date: 2017-06-25 23:30:00 -04:00
categories: blog
tags: html css responsive
description: "Amongst several extremely useful features, CSS3 brought us REMs & EMs - two responsive-minded measurement units. In my experience, these units tend to be more predictable and adaptable than the usual style of pixels and percents though those are still good for things such as border-widths and the like. Today I'll outline exactly what REMs & EMs are, their journey to cross-browser support, and the benefits in using them."
comments: true
path: "/articles/responsive-css-with-rems-and-ems"
---

Amongst several extremely useful features, CSS3 brought us REMs & EMs - two responsive-minded measurement units. In my experience, these units tend to be more predictable and adaptable than the usual style of pixels and percents though those are still good for things such as border-widths and the like. Today I'll outline exactly what REMs & EMs are, their journey to cross-browser support, and the benefits in using them.

### What are REMs & EMs
In this instance, the dictionary definition does a lot of good to know and rounds out a ground floor to come in on.

* REM: stands for the text size of the root element on the webpage.

* EM: historically, em was a measurement based on the width of the capital M letter. In modern web design, it is more commonly equated to roughly 16 pixels.

Now, in layman's terms: a REM is based on whatever root text size you're using in your HTML selector. On the other hand, an EM inherits from what comes before it. Consider the following:

```html
html { font-size: 100%;} // FYI: in most browsers 100% = 16px;
body { font-size: 20px;}

.first { font-size: 1rem; }
.second { font-size: 1em; }

<html>
  <body>
    <div class="first">
      <p>I'm using REMs here which rely on the root element</p> 
    </div>
    <div class="second">
      <p>I'm using EMs here which inherit from the parent element
    </div>
  </body>
</html>
```

In my `<div class="first">`, my font size will be 16px because REMs are based on the root element, or the 100% font size within my HTML. While it's only on letter difference, the EMs are doing their own thing. Over in the `<div class="second">`, the font size would be 20px because it inherits from it's parent, or `<body>` in this case where the font size is set to 20px.

### How Did REMs & EMs Get Here?

CSS3 had a long, tattered road to walk/crawl before any spec was fully published. From what [I've read](https://1stwebdesigner.com/css3-in-a-nutshell/), it was about 12 years in-between CSS2 & CSS3 and the implementation of CSS3 wasn't even the full spec but rather the code was modularized and published as single purpose entities. The latest module to come out was in 2012 and is something we hold dearly – media queries!

### Benefits of REMs & EMs

The main benefit I've noticed of basing a site off REMs & EMs is ease of responsiveness. If the content, structure, etc is based off the root font-size then the only media queries needed are on the HTML font-size. When that is scaled up, the entire page scales up. To have this work, it's best to have the containers based on REMs and the font based on EMs. That is because we want the containers to scale up relative to the HTML root font size and the contents inside of them to be relative to their containers.

If this is how you do decide to use REMs & EMs, there is one catch that I've noticed. When scaling, scale *up to* 100%. That means your HTML font-size on mobile should be 80% or so and then step it up 5% - 10% at each breakpoint. If this 80% font is too small in your opinion, then use a `:root` selector to increase the font in pixels.

```css
:root {
  font-size: 20px;  // most browsers are 16px by default -->
}

html {
  font-size: 80%;  // then scale up as the screen grows using media queries
}
```

The reason we want to scale up to 100% max is because if there are images on the page that rely on that root size, once it goes beyond 100% they'll become distorted.

Hopefully that quick outline of how I've learned to create responsive designs using purely REMs & EMs, and one percent rule, will be helpful in your next project. If you find any other tricks when trying it out, leave them in the comments below!
