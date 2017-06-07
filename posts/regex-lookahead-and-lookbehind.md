---
layout: post
title: "Applying Regex Lookarounds"
author: Steve Frost
date: 2017-05-06 16:00:00 -04:00
categories: blog
tags: regex patterns
description: "Regular Expressions, or regex, is a powerful tool available across several languages to help match patterns. As one memorable contrast explains, regex is to programming as 'okay' is to spoken language – it's recognized everywhere! It is this universal usability as well as the the common task of having to compare data against a point or pattern that makes regex so prevalent in the development community."
comments: true
---

![regex-lookarounds-picture](/assets/img/blogs/regexlookarounds1.jpg)

Regular Expressions, or regex, is a powerful tool available across several languages to help match patterns. As one [memorable contrast](http://blog.teamtreehouse.com/regular-expressions-10-languages) explains, regex is to programming as 'okay' is to spoken language – it's recognized everywhere! It is this universal usability as well as the the common task of having to compare data against a point or pattern that makes regex so prevalent in the development community.

Since it is used so often, there is plenty of documentation on it though that doesn't stop the groans from circulating through the room each time regex is mentioned. Personally, I groan because regex teases the head around a problem in a way like no other tool. Also, each time I use it, I have to refresh on exactly how the syntax works since it is unique to regex. For a syntax refresher, I usually pop over to [RegExr](http://regexr.com) where they have a cheat sheet and an environment where example data can be manipulated and tested against with custom regex statements.

Inevitably, after brushing up with the cheat-sheet, I found a novel regex approach that I've never seen before. Most recently, I was working with [pangrams](http://www.fun-with-words.com/pang_example.html), sentences that use each letter of the alphabet once, and came across regex's lookaround behaviors which fit the bill perfectly, as regex usually does. Let's take a look at what the syntax looks like for these behaviors.

### Lookarounds

```javascript
# Lookaheads examine what immediately follows the current position
Positive Lookahead: (?=abc)
Negative Lookahead: (?!abc)

# Lookbehinds examine what immediately precedes the current position
Positive Lookbehind: (?<=abc)
Negative Lookbehind: (?<!abc)
```

### In Practice

The lookarounds in the above example would help us locate text immediately following or preceding (depending on which we use) a designated string we provide. Let's use a lookahead to return true if hello if it appears before world but false if followed by any other word.

```javascript
string1 = 'hello world'
string2 = 'hello steve'

/(hello)(?=\sworld)/.test(string1) #=> true
/(hello)(?=\sworld)/.test(string2) #=> false
```

Our regex here, `/(hello)(?=\sworld)/` is explicitly testing each string to see if there is the word, 'hello' immediately followed (`?=` - positive lookahead) by a space (`\s`) then the word world. As cool as it is, let's take this newly acquired knowledge for a spin on a real-world example.

### Real-World Example

Time for a more realistic example – password validation! It is typical to see requirements for a password so how can we check against those? Our fancy new regex lookaheads should help.

* Must contain 8 letters
* Password ends in number
* No special characters allowed

```javascript
function isValidPassword(password) {
  let hasEightLettersThenNum = /\w{8}(?=[1-9])/
  let hasSpecialChars = /[^\w]/g  #=> g for global search

  if (hasEightLettersThenNum.test(password) === true) &&
    (hasSpecialChars.test(password) === false) {
    console.log("Valid Password")
  } else {
    console.log("Invalid Password, please see requirements above")
  }
}
```

As you can see, we were able to use the positive lookahead `(?=[1-9])` to determine that our password had eight letters followed by a number. This is a fairly contrived example and there are easy ways to check for trailing digits without using a lookahead though this is the general idea & an applicable use.

### Conclusion

Expanding on & exercising regex knowledge leads to greater appreciation. Personally, I've become more comfortable/daring after a few real-world implementations and I've started to recognize that the uses are substantial, varied, and powerful. If you have any go-to uses for regex lookaround, leave them in the comments!
