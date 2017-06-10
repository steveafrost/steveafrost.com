---
layout: post
title: "Object Models in Ruby"
author: Steve Frost
date: 2016-05-31 15:00:00 -04:00
categories: blog
tags: flatiron-school learning-to-code
description: "What are object models in Ruby? How do they work? How do you avoid the headaches when working with object models?"
comments: true
---

_(Day 31)_

### Sanity Recap ###
Phew, it's the end of my first month at Flatiron's Full Stack program and I'm still alive. I've been using a Pomodoro app to track my time as well as keep me motivated and it's worked wonders. The total hour count for the month was just over 80 hours which means I'm at least 10% into the course now by Flatiron's estimated hour count of 600-800 hours to complete the course content. Onto the good stuff...

### Object Models in Ruby ###
This is one topic in Ruby that has resulted in many restless nights. The explanation here includes my insights into what I got stuck on and what helped me through the process of learning Object Models. If you're a beginner, jump to the end and read through some of the lengthy tutorials linked then come back and measure up your experience with mine.

### Objects are the Building Blocks ###
To understand object models, we must first understand objects. **Everything in Ruby is an object.** An object has all the data and all the logic required to complete a task. The customized actions/behaviors that these objects can use are called **methods.** Methods can be defined by the user but they also ship with several [built-in methods](http://ruby-doc.org/docs/ruby-doc-bundle/Manual/man-1.4/function.html "Ruby Docs - Built-in Methods"). These are extremely useful! The example below uses both. I'm creating a custom method #sandwich which is using a built-in method of #puts to print or log a string of text.

```ruby
class MyLunch
  def sandwich
    puts "nom nom nom"
  end
end
```

### Putting the Blocks Together ###
When working with multiple objects and methods, the most useful advice I've received is to "think about who's job the task at hand belongs to." If working with our previous example of MyLunch, suppose we want to keep track of how much lunch money I have at the start of the day and then at the end of the day, essentially computing the cost of lunch. This job sounds like a job for somebody other than the #sandwich method... how about a new method called #wallet - that would make sense. A wallet method to maintain the current status of how much money is in the wallet.

### Object Relationships ###
As you grasp the concept of object models, it starts to become clear that the power in objects is relating them to each other. This means that an instance of the MyLunch class can be related to an instance of the DoHomework class so the two can talk to each other. For example, if a MyLunch instance has a current_status variable that is set to active, then DoHomework can know about that and set it's current_status variable to inactive. As you can probably forsee, the more objects and instances, the larger bowl of spaghetti you get here. Sometimes it can be hard to see how objects are relating to each other and exactly where they are picking up their attributes. My recommendation here is to draw out a map of the relationships like the one I've included below. The other thing that _really_ worked for me was to talk about the relationships out loud - whether that was to Flatiron peers, uninterested neighbors, or a semi-interested girlfriend. Talking out loud about the code & the relationships within has helped me over a hurdle several times. More on object relationships soon!

![object-model-picture](/img/blogs/object-models-in-ruby.jpg "Object Model Picture")



### Helpful Links
[Object Oriented Concepts](http://ruby.bastardsbook.com/chapters/oops/ "Object Oriented Concepts")

[3 Steps to Understand Classes and Objects in Ruby](http://www.rubyfleebie.com/3-steps-to-understand-how-classes-and-objects-work-in-ruby/ "3 Steps to Understand Classes and Objects in Ruby")

[Seeing Metaclasses Clearly](http://viewsourcecode.org/why/hacking/seeingMetaclassesClearly.html "Seeing Metaclasses Clearly")

[Understanding self](http://blog.honeybadger.io/ruby-self-cheat-sheet/ "Understanding self")
