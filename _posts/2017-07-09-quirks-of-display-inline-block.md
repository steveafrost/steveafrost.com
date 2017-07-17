---
layout: post
title: "Quirks of 'Display: Inline-Block'"
author: Steve Frost
date: 2017-07-09 21:30:00 -04:00
categories: blog
tags: css
description: "The display property in CSS comes with several supported values like inline, block, flex, list-item, and the anti-hero, table. The list goes on to include combinations of those such as inline-flex, inline-table, and inline-block. The default value of the display property is set by the browser and typically does the job. Luckily, like many things in web development, we can change the value if we want a HTML element to behave differently. One of the most common values I find myself using is display: inline-block. Most of the time it's a godsend but it does come have a few quirks."
comments: true
---

![quirky-octopus](/assets/img/blogs/inlineblock0.jpg)

The display property in CSS comes with several supported values like inline, block, flex, list-item, and [the anti-hero, table](https://colintoh.com/blog/display-table-anti-hero). The list goes on to include combinations of those such as inline-flex, inline-table, and inline-block. The default value of the display property is [set by the browser](https://github.com/sw4/revert.css) and typically does the job. Luckily, like many things in web development, we can change the value if we want a HTML element to behave differently. One of the most common values I find myself using is display: inline-block. Most of the time it's a godsend but it does come have a few quirks.

### What Exactly is Inline-Block?
The `display: inline-block` property & value allows an element to share in both the inline & block behaviors. While the inside of the element will be treated as a block-level element, the element itself is formatted as an inline. For example, take an paragraph element with it's default `block` display value. Block elements take up their entire line and do not sit next to another item. If we were to override that setting with `display: inline` then the paragraphs can ride up and sit right next to each other making the two separate paragraphs appear as one. Here is an example of inline & inline-block. As you can see, the inline element does what I've described while the inline-block appears as a block-level element.

![inline-paragraphs](/assets/img/blogs/inlineblock1.jpg)

Wait, so what is the difference between block and inline-block? Well, now that our element has both the traits of an inline element & a block element, we can assign widths – something that's not possible for inline elements. Now that each element has a width, they'll appear next to each other, or inline, if the screen is wide enough to fit both. If the screen is smaller than our set width, each paragraph will assume block-level traits and occupy their own line. Check out what it looks like:

![inline-block-paragraphs](/assets/img/blogs/inlineblock2.gif)

### What's the Catch?
At first pass, it looks like we get the best of both worlds - inline & block – with the aptly named, inline-block value. After using it on several projects, I can say that's an accurate assessment but if you're going to use it, it can be helpful to know some of the snags to save headaches & time.

### Whitespace Quirk
Often when I'm using display-inline, it's to have responsive images. For example, I'll set two images to 50% of the width to achieve a full width side-by-side. If you try this out, you'll notice they appear on separate lines – but why?! Checking the page structure more closely we see there's no margin, padding, or border causing the issue. I'm not sure there's any indicator at all in the source code or Chrome inspector (or similar browser inspector) that shows points out the actual cause. The behavior we see when two images are set to 50% but don't sit next to each other is caused by whitespace in the HTML. Yes, whitespace... in the HTML. If there are image tags on separate lines, or even a space inbetween them in the HTML, then that space will take up visual space on the page.

Code such as this:
```html
<style>
  img {
    display: inline-block;
    width: 50%;
  }
</style>

<img src="http://lorempixel.com/630/420/">
<img src="http://lorempixel.com/630/420/">
```

This snippet will not appear as expected when viewing the webpage – see below. Notice the images _don't_ take up 100% width together but instead assume block-level behavior with each on it's own line because together they make up more than 100% due to us putting each img element on it's own line (or remember, even a space in-between) in the HTML.

![inline-block-images](/assets/img/blogs/inlineblock3.jpg)

It's really a quite unique behavior that the browser would read into the spaces you put in the HTML. I can't think of another case where the whitespace in the code is evaluated – if you know of one, I'm interested!

So how do we get the browser to ignore the whitespace? Well, we can start by taking it out. If you have spaces or line-breaks, remove those. Actually, there is a common task with Gulp and Grunt to remove the whitespace in HTML once in a production setting called [minifying](https://blog.stackpath.com/glossary/minification/). 

This would solve the woes, but what about development or what about if we don't want to minify the code? In that case, there are two options that I'm aware of:
    1. Give each inline-block element a negative margin-right value of 4px like so: `margin-right: -4px`. This will pull the picture further left to account for the whitespace. While this approach works nicely, it is a cover-up or patch in my opinion which I'm always afraid might snowball into a more troublesome alignment issue later which is why I'm a fan of the second approach.
    2. Set the parent container of any inline-block element to have `font-size: 0px;`. This is effectively telling the browser that the whitespace it sees in the HTML file for the selected parent container should take up no space visually. If we need our font-size to be a certain size later in the same parent container, for instance on a `<span>` element, then we can set the font-size back to the original setting. Awesome! This is my favorite personal approach.

Trying either of these approaches out will result in our 50% width images taking up 100% of the width together and a wonderful responsive design.

![inline-block-images-fixed](/assets/img/blogs/inlineblock4.jpg)

### Alignment Quirk

By default, inline-block will align elements based on the bottom edge. Taking a look at an example we can see how that starts to look awkward.

![inline-block-images-aligned-bottom](/assets/img/blogs/inlineblock5.jpg)

If this isn't the desired behavior, inline-block elements can be changed to align middle, top, or other values using the `vertical-align` property as such: `vertical-align: middle;`. If you'd like the pictures to be the same size on the page regardless of what they look like originally, consider adding an image wrapper that is set to those dimensions and then have the image itself take up 100% of the wrapper. When taking that approach, the image wrapper would be the inline-block element.

```css
.img-wrapper {
  display: inline-block;
  font-size: 0px;
  height: 420px;
}

img {
  height: 100%; // or auto w/ max-height matching smallest picture to keep proportion
  width: 50%;
}
```

### Support
Great news about the support, it's around 98% without any kind of prefixes or adjustments needed. To see the exact support across browsers for any code, a great site to check out is CanIUse – [here](https://caniuse.com/#feat=inline-block) is what they say about inline-block. It is a useful property that I've grown accustomed to utilizing and one that should help us all get to the hopeful day when [CSS Grid](http://jensimmons.com/post/feb-27-2017/learn-css-grid) is fully supported and we no longer have to fake columns & rows in web design. Until then, long live inline-block!
