---
title: "Reframing Callback Terminology"
date: 2017-08-13
tags:
  - javascript
  - callbacks
  - asynchronous
---

Since switching to Javascript full-time from Ruby several months ago, callbacks have been one of the most common patterns I use on a regular basis. I've even tried to switch it up to know how each option works - [XHR requests](https://developer.mozilla.org/en/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest) when I was trying to avoid jQuery, once I gave in then [jQuery's AJAX method](https://api.jquery.com/jquery.ajax/), and most recently  Promises which are by far the best of the three in my opinion. 

Although I've used different options with the goal of better understanding callbacks, I was never fully comfortable with my understanding with the pattern until a recent reframing of the terminology to better wrap my brain around it. Disclaimer: I'm still not fully comfortable with my understanding of how some types of callbacks work though now if I read through the code, it becomes clearer more quickly.

One transformation was the idea of asynchronous programming. My initial introduction to the topic and few projects I had done with async developed an understanding in my head that it was about doing two or more at once. Once I took the time out and read more about async vs sync, I realized it's better to think about it in two fashions.

1. Focus on the difference between async vs sync as non-blocking vs blocking. This is the actual terminology I was often reading but then instead of changing my view of async, I was adapting the terminology to my view. If you think/look/program JS while thinking _non-blocking_ then the idea of callbacks will be more apparent.
2. It's not about doing two or more things at once. It's about not holding up the line and allowing code to 'call back' once it's complete. (see point #1, non-blocking)

The other pivot in mindset that helped is thinking about callbacks as a pattern that involves [starting a task without knowing when it will finish](http://callbackhell.com/). This can loosely be traded between async and the callback convention as they're typically used together to accomplish tasks exactly of this type! 

Continuing on callbacks, I also had to shake my perception of callbacks as actions that only return data. Callbacks can really do anything they're told to do and will be called when the function they're included with is complete with it's async task.

Now that I see callbacks as a tool/pattern to use and not just a pattern to follow, I feel more comfortable in the JS world. I had a [similar revelation when digging into recursion](https://steveafrost.com/articles/discovering-the-minimax-algorithm) and am looking forward to the next deep dive into an unfamiliar topic. If there's something I'm using frequently in my code, I want to know how it works when stripped of abstraction. Learning these core, vanilla snippets of knowledge undeniably helps my understanding of modern frameworks & behaviors.
