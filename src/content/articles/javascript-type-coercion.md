---
title: "Javascript Type Coercion"
date: 2017-04-23
description: "When I made my transition from Ruby to Javascript, the various nuances of the language were frustrating and I was tempted to retreat back to Ruby. After investing time to understand them, I grew fond of Javascript and left my past love behind. At the forefront of subtle, pesky behaviors is Type Coercion."
tags:
  - glossary
  - coercion
---

![javascript-type-coercion-picture](/img/blogs/javascripttypecoercion1.jpg)

When I made my transition from Ruby to Javascript, the various nuances of the language were frustrating and I was tempted to retreat back to Ruby. After investing time to understand them, I grew fond of Javascript and left my past love behind. At the forefront of subtle, pesky behaviors is *Type Coercion*. If you break down the word, it tells you exactly what behavior is happening here: Javascript is [coercing](http://www.dictionary.com/browse/coerce), or persuading, a value to a different type as in the string '1' becomes 1.

### When Does Coercion Occur

Now that we have a definition of coercion, what does it actually occur in Javascript? The answer can be split into two sections: implicit coercion and explicit coercion. If you are unfamiliar with implicit vs explicit, the way I usually remember it is that being explicit means you're being very detailed and dictating each step while implicit describes behaviors that happen without the programmer providing all steps. Before continuing, here are two examples to represent each type of coercion.

```javascript
*Implicit Coercion*
var a = 1
var b = "1"
a == b  // returns true

*Explicit Coercion*
b = a.toString();
typeof a // number
typeof b // string
```

Hopefully this helps differentiate implicit vs explicit. In the implicit example, Javascript is coercing `b` to a `number` type so that it can compare to `a` which is a number. In the explicit example, we are providing the exact steps to coerce a value.

Since explicit coercion is fairly easy to understand and typically intentional, we'll focus on implicit coercion and the most notorious situation: comparing two values.

### Breaking Traditions and Taking Sides

It is a long-standing, popular stance to avoid coercion when comparing values by using the strict equality operator: `===` or `!==`. Numerous JS books such as ["Javascript: The Good Parts"](https://www.amazon.com/JavaScript-Good-Parts-Douglas-Crockford/dp/0596517742) recommend this approach of avoiding coercion in all situations and it specifically squares off against the loose equality (`==`) operator. There is plenty of similar debate in the community as a whole around whether coercion is a feature or a bug.

While it may be a tradition to stick to `==` instead of `===` – in fact, it was how I was taught – I am under the belief now that we should understand what is happening behind each (hint: implicit coercion) and use the proper comparison operator in each situation. If I could point to one passage that helped me wrap my head around the coercion happening behind loose and strict comparisons, it would be the community guide assembled by Kyle Simpson called, ["You Don't Know JS"](https://github.com/getify/You-Dont-Know-JS) which is an exhaustive, brilliant guide to Javascript.

> The difference between `==` and `===` is usually characterized that `==` checks for value equality and `===` checks for both value & type equality. However, this is inaccurate. The proper way to characterize them is that `==` checks for value equality *with* coercion allowed, and `===` checks for value equality *without* allowing coercion.

### Wrap-Up

While it can be intimidating that there are a sufficient number of nooks to explore in Javascript, I believe learning these core behaviors can be extremely beneficial in both creating our programs as well as debugging them – especially debugging them. As I continue to create, I hope to expand my understanding of exactly what is happening 'under the hood' such as the difference explained here regarding coercion and apply that knowledge to future programs. I'm hopeful that this post also spurred your interest in diving deep into some of the 'magic' behind-the-scenes of your latest creation.
