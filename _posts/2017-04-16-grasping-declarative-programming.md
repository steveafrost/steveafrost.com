---
layout: post
title: "Grasping Declarative Programming"
author: Steve Frost
date: 2017-04-16 16:00:00 -04:00
categories: blog javascript
tags: glossary declarative imperative
description: "I spend as much time, if not more, learning than I do building at this point. That is one of the perks of the profession, continuous learning. In that spirit, I recently came across a term that is emphasized in React that I had to read into to truly understand what it meant – Declarative Programming."
comments: true
---

![researching](/assets/img/blogs/imperativevsdeclarative1.jpg)

Over the past two weeks I've been learning React to add to my skill set as a developer and have come to adopt a motto that encompasses every day I am programming – React or otherwise.

> Research is what I'm doing when I don't know what I'm doing. - Wernher Von Braun, German rocket scientist

What could be more true about the act of programming? I spend as much time, if not more, learning than I do building at this point. That is one of the perks of the profession, continuous learning. In that spirit, I recently came across a term that is emphasized in React that I had to read into to truly understand what it meant – Declarative Programming.

### Defining Declarative Programming

When I approach new terms, I like to grasp the English meaning first then move onto the programming tech metaphors & implementation. So what do we mean when we say [declarative](https://www.thoughtco.com/declarative-sentence-grammar-1690420) and what is it's [counterpart](https://www.thoughtco.com/imperative-sentence-grammar-1691152)?

> Declarative: makes a statement or argument about what is, was, or will be the case.

> Imperative: gives advice, instructions, or expresses a request or command.

In pseudo-code, this can be represented by the age-old 'make a sandwich' metaphor.

```html
<!-- Declarative -->
1. Can you make me a peanut butter and jelly sandwich?

<!-- Imperative -->
1. Go to the kitchen
2. Open the cabinet by grasping and pulling toward yourself
3. Grab toaster and move to counter
4. etc, etc
```

### Another Way to Look At It

The definition made sense to me, but what provided a breakthrough was a line from [Tyle McGinnis' article](https://tylermcginnis.com/imperative-vs-declarative-programming/) on Imperative vs Declarative. In his article, Tyler notes that another way to look at declarative programming is to see it as an abstraction of imperative programming. Even though in declarative programming we're only telling the code *what* to do rather than *how*, that *how* is still being executed at some point by the language but it is hidden from us or abstracted away.

### What Uses Declarative Programming?

This is somewhat of a loaded, tricky question. Some languages use explicitly imperative styles, some declarative, and some are a mix. Take Javascript for example. We can iterate over a `collection` and imperatively tell each element what to do and return the `collection` or we can abstract the idea of returning the `collection` to more advanced functions like `map`.

### Declarative Trends

As it stands right now, most modern Javascript frameworks including React operate in this declarative programming fashion. We tell React *what* we want to be in our component and the framework abstracts away all of the *how*. This allows us to focus more on the UI than we could previously and leave the dirty work to React. It is important to note here that even though this is abstracted away, we should still understand *how* React is doing these things on a basic level so that we can debug when needed.

As I continue to learn React, I think this knowledge will be necessary to develop a thorough understanding of why React is crafted the way it is. Judging by the [popularity of Javascript & Javascript frameworks](https://trends.google.com/trends/explore?q=react,angular), I am guessing it is a style that we'll be seeing often.  