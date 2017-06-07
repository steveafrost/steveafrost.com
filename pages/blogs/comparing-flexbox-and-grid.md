---
layout: post
path: comparing-flexbox-and-grid
title: "Comparing Flexbox and Grid"
author: Steve Frost
date: 2017-04-02 21:30:00 -04:00
categories: blog css
tags: flexbox grid bootstrap skeleton milligram 
description: "There's no limit to the choices of CSS frameworks and libraries. For years it was a personal preference between ones like Bootstrap and Foundation but recently there has been emerging support for FlexBox which is currently supported by a few frameworks."
comments: true
---

![flexbox-and-grid-picture](/img/blogs/flexboxandgrid1.jpg)

There's no limit to the choices of [CSS frameworks and libraries](http://cssdb.co/). For years it was a personal preference between ones like [Bootstrap](https://getbootstrap.com/) and [Foundation](http://foundation.zurb.com/) but recently there has been emerging support for FlexBox which is currently supported by a few frameworks. There hasn't been a surge of popularity purely because of Flexbox for these options but it has started to make ones that don't support Flexbox as old-school and outdated.

### What is Flexbox?

[Flexbox](https://www.w3schools.com/css/css3_flexbox.asp) is a way to organize elements on a web page using several techniques and generally concerning equal distribution across the page regardless of screen size. At it's base, it is a CSS value of the property `display`. Flexbox also offers alternate, supporting properties such as `flex-flow` and `flex-direction` to dictate what direction your content will condense into as the screen size shrinks. It was created to be an iteration on the common grid system made popular by Bootstrap that is meant to be more straightforward while also being more accommodating to different layouts.

### Flexbox vs Grid

1. Grid system elements are only concerned with positioning from left-to-right. Once a breakpoint is reached, the components collapse into a single column. Flexbox on the other hand is aware of both the left-to-right as well as the top-to-bottom of it's parent container.
2. There are several sub-properties that assist the flex property compared to grid systems which are based on breakpoints.
3. Flexbox can 'flex' in size to fit the overall size of their parent div whereas grid systems resize the div itself and cannot adjust children.

### Continuous Post

Since Flexbox is new, this post will be evolving as specifications are rolled out and frameworks accept the new standard. Bootstrap v4 should be out soon and will [move from the grid system to this new Flexbox spec](https://v4-alpha.getbootstrap.com/utilities/flexbox/). If you're curious about the Flexbox feature, [CSS Tricks has great information](https://css-tricks.com/snippets/css/a-guide-to-flexbox/).
