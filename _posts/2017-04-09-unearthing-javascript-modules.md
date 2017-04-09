---
layout: post
title: "Unearthing Javascript Modules"
author: Steve Frost
date: 2017-04-09 14:05:00 -04:00
categories: blog javascript
tags: modules es6 organization node
description: "One of many joys of coding for me has always been organization. No, honestly. I'm the person who spends sunny Sunday afternoons re-alphabetizing the file cabinet or sorting the clothes in the closet by color... alphabetic color. All this considered, you can imagine how happy I was to find that the latest spec of Javascript, or the ES6/ES2015 specification, brought modules to the language as a way to organize and departmentalize code."
comments: true
---

![containers-representing-modules](/assets/img/blogs/javascriptmodule1.jpg)

One of many joys of coding for me has always been organization. No, honestly. I'm the person who spends sunny Sunday afternoons re-alphabetizing the file cabinet or sorting the clothes in the closet by color... alphabetic color. One birthday, my fiancé even bought me the book <a target="_blank" href="http://amzn.to/2oPdkfv">The Life-Changing Magic of Tidying Up: The Japanese Art of Decluttering and Organizing</a> which I recommend especially if you're smiling thinking of my file cabinet alphabetized. All this considered, you can imagine how happy I was to find that the latest spec of Javascript, or the [ES6/ES2015 specification](http://2ality.com/2014/09/es6-modules-final.html), brought modules to the language as a way to organize and departmentalize code.

### What is a Module

Modules are Javascript's way of separating the concerns of a program into individual, sometimes reusable, pieces. The most accessible synopsis of modules comes from [FreeCodeCamp](https://www.freecodecamp.com/)'s Medium article, [Javascript Modules: A Beginner's Guide](https://medium.freecodecamp.com/javascript-modules-a-beginner-s-guide-783f7d7a5fcc). In this article they beautiful encapsulate the reasoning behind using modules and in turn, roughly define a module.

> Good authors divide their books into chapters and sections; good programmers divide their programs into modules.

This works on a literal level and when looking into it deeper, it holds true throughout thinking of modules. Not only do we separate books & programs in sections but each section also contains similar content. In a book, each chapter is usually grouped by scene, characters, or plot point. This is a practical way to envision using modules. Each module should contain code that is for a single purpose. How you determine what to separate your code by – scene, characters, or plot – is up to you. There are [several approaches](https://dzone.com/articles/how-to-split-into-modules) to this which are entirely personal preference.

### Benefits of Modules
1. Reusability - this is a common theme with many emerging frameworks & libraries and it's no surprise many of them use some kind of module system. Instead of copying over code we'd like to use in a different section of the website, we can simply create a module, make it available to the entire app by exporting that code, and import it into the section we need.
2. Maintainability - however we choose to separate the code, it will be easier to find and debug. For example, if I have a store that sells sunflower seeds and have separated my modules by feature then when I have an issue with the product listing page, I can look in my listing module. Contrived example, but effective.
3. Namespacing - one of the common missteps in Javascript is polluting the global namespace. It is easy to do and quickly cause confusion on a large scale project. Javascript is different from most languages in that it has no scope level between global & local scopes. This leads to code that needs to be accessible from everywhere sharing the same global variable with unrelated code amongst other issues. Using modules we can 

### Using Modules

Almost three years later, many of the new features in ES6 are supported by major browsers with the exception of importing and exporting modules. There are compilers such as Babel that will help convert ES6 code into ES5 code that is more widely supported – more on that in a later blog. For now, know that using a compiler is a good idea if you're going to be using ES6.

**Exporting Modules**: To export, we can either export using a _named export_ or a _default export_. These both use the `export` keyword but with slightly different syntax as you can see below.

```javascript
// in a file named activities.js

// Named Export
function biking() {
    console.log("Airing up the tires");
}

function running() {
    console.log("Putting on shoes");
}

export {biking, running}

// Default Export
var aerobics = {
    biking: function() {
        console.log("Airing up the tires");
    },
    running: function() {
        console.log("Putting on shoes");
    }
};

export default aerobics
```


**Importing Modules**: Once there is a module exported, we can import it into another file using the `import` keyword. If the module was named when it was exported, we'll need to reference that name. If it was imported using `export default` then we can name it anything we'd like upon import.

```javascript
// in a file named sundayAfternoon.js

// Named Import
import {biking, running} from 'activities'

// Default Import
import aerobics from 'activities' // aerobics could be anything here
```

### Further Reading
To further understanding exactly what these `export` and `import` compile down to, I suggest reading through the [CommonJS module system](http://requirejs.org/docs/commonjs.html) which was inspiration for the ES6 spec. Basically, both ways of exporting and importing rely on an exports object with keys pertaining to either the full file or keys for each function, depending on which type of export being used. SitePoint also has a [great guide](https://www.sitepoint.com/understanding-es6-modules/) to ES6 Modules which goes over much of what is here as well as setup info for a simple compiler. Last, but not least, EloquentJS has an [exhaustive guide about modules](http://eloquentjavascript.net/10_modules.html) that was immensely helpful for understanding this topic.

Hopefully you will enjoy modules as much as I have. It may be my organizational lust, or obsession, but I really appreciate this feature. It seems like Javascript is ahead of other languages as far as speed & flexibility and had lagged behind without some type of import/export feature – even CSS beat JS to it with SASS's `@include`! Now our Javascript code can live by one of my favorite proverbs, "a place for everything and everything in it's place."