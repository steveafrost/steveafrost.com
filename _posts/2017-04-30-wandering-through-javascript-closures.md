---
layout: post
title: "Wandering Through Javascript Closures"
author: Steve Frost
date: 2017-04-30 13:00:00 -04:00
categories: blog javascript
tags: glossary closure
description: "Closures one of several terms I realized I glossed over when first learning the language. It is one of the topics that when you see it it's an 'okay that makes sense' reaction but to actually explain what is happening is the grander part of the understanding, at least with Closures."
comments: true
---

Closures one of several terms I realized I glossed over when first learning the language. It is one of the topics that when you see it it's an "okay that makes sense" reaction but to actually explain what is happening is the grander part of the understanding, at least with Closures. One inspiration for relearning the term came from the wonderful synopsis provided in ["You Don't Know JS"](https://github.com/getify/You-Dont-Know-JS) which is an incredible collection of books for those who haven't read it yet. Heck, there's even an entire book titled ["Scopes & Closures"](https://github.com/getify/You-Dont-Know-JS/blob/master/scope%20&%20closures/README.md#you-dont-know-js-scope--closures) which covers purely scopes & closures! 

### What is a Closure?
The core of understanding closures is understanding scope. Before trying to understand closures, try to read and have somewhat of a grasp on scope as far as what variables, functions, etc are available at different levels. For example, being comfortable with the following example is critical to understanding closure:

```javascript
var fruitList = ['apples', 'oranges', 'tangerines']; // Level 1 Scope

function collectFruit(fruitList) {

    // we're able to access the arguments passed into the function and assign them to variables
    var fruits = fruitList.join(', ') // Level 2 Scope

    function makeShake() {
        // we can access variables from outer scope - this is a closure!
        var currentFruit = fruits; // Level 3 Scope
        return currentFruit // => "apples, oranges, tangerines"
    }

    return currentFruit; // => Uncaught Reference Error: currentFruit is not defined. We *can't* access variables from inner scope

    return makeShake;
}

shakeTime = collectFruit(fruitList) // => "apples, oranges, tangerines"
shakeTime() // => "apples, oranges, tangerines"
```

By working through a few instances of this situation by yourself, you'll get a firm grasp on both scope and in turn, closure. A closure is simply our inner function in this example and the idea that the inner function has access to the outer functions scope which includes all variables, arguments, etc. 

Closures, including our example, have access to three levels of scope: the inner function scope, outer function scope, and global scope. These are denoted by comments in the example to provide clarity.

If metaphors are helpful to you, FreeCodeCamp did a [Medium article](https://medium.freecodecamp.com/whats-a-javascript-closure-in-plain-english-please-6a1fc1d2ff1c) on how closures are similar to components in a car which provides a different way of thinking about the topic.

### Using Closures

Now that we've grasped what closures are, you'll start to see them everywhere. They are a common and powerful feature of Javascript. They are also found in many modern frameworks like Angular. While they're incredibly useful, it can be helpful to know [when to avoid closures](https://www.sitepoint.com/javascript-closures-demystified/) and use quicker, leaner parts of Javascript – for example, using the Prototype system over building your own with closures.

### Glossary Series

The Glossary Series is a collection of terms I've previously never fully understood across all programming languages. Keeping this running glossary is useful to lay out what I know about a topic as well as provide a place to come back and update later as I learn more about the term. If you'd like to contribute an example or clarification, please leave it in the comments below.
