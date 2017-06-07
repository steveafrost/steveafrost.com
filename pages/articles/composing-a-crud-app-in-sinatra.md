---
layout: post
title: "Composing a CRUD App in Sinatra"
author: Steve Frost
date: 2016-08-06 16:00:00 -04:00
image: '/img/blogs/composingcrudapp2.jpeg'
categories: blog
tags: flatiron-school learning-to-code
description: "What I learned about CRUD from creating a few apps in Sinatra"
comments: true
---

*(Day 97)*

Composing a what in a who? If you would have read that title to me a month ago, that would be my response. Now, I’m somewhat… er, let’s say fairly sure I can explain what that means and through building my first one, I’ve made worthwhile realizations to keep in your back pocket.

If you have never heard of CRUD before, take a minute to read my previous article which covers CRUD more thoroughly.

As part of our second assessment at Flatiron School, we are asked to build a CRUD App in Sinatra. There were 7 basic requirements: implement a MVC software pattern, use ActiveRecord, include multiple models, use at least one has_many relationship, include user accounts that are only able to modify the content they create, validate user input to ensure bad data isn’t created, and any validation failures must be shown to the user with an error message.

![Frustrated Guy](/img/blogs/composingcrudapp1.jpeg)

After reading all that, you probably look a little bit like this guy. No worries, I looked the same way. Actually, I look exactly like this every time I start a new exercise at Flatiron. It is typically 10–15 minutes of this expression followed by a sigh then I start to code.

The patterns of MVC and CRUD are particularly helpful in regards to this initial… “brain says, ‘no’” look. Part of it is that CRUD is fun to say, but mostly it is because both provide an imagined structure to the app before even one line of code has been written. MVC outlines how the folders and files will be structured so if you’re completely stuck at the start, begin to create your MVC structure. Create your prospective models in their own .rb files then .erb files for each view that might exist, and then controllers to deliver the information between the two. Once this is complete, then continue on with creating the CRUD actions in each controller. Some controllers may not require all four actions included in CRUD so that may require some thought, but the overall benefit is still there — you are writing the base to your program. You’ve started!

![Success Kid](/img/blogs/composingcrudapp2.jpeg)

After creating the MVC structure and CRUD actions, I’m motivated. I let this momentum build and it carried me through to the end of the… ugh, another dilemma. To understand this one, take a quick read at the summary of my web app from [GitHub](https://github.com/steveafrost/much-free-very-wow).

> Much Free, Very Wow is a CRUD Sinatra app where users can signup, login, and contribute free activities to do in NYC.

> Both users and activities are saved into a SQLite3 database upon creation.
Activity details can be viewed at the their RESTful URL. For example, if an activity named “Free Comedy Show” is created, the details can be viewed at /activities/free-comedy-show.

> Activities can also be edited or deleted but only by the user who created the activity.

Onto my dilemma. When creating activities, I wanted to include a category so that users would know if they were viewing an activity concerning music, food, art, etc. For a couple hours I weighed on whether this category should be part of the Activities table & model or if it should be it’s own table & model. I asked instructors, I asked other students, and I argued with myself in a frustrating fashion. In the end, it made the most sense to go with categories as part of the existing Activities table & model for a few reasons. First, if the category was on it’s own, I would have to query a whole additional table each time I wanted to display those categories which I predicted would be a frequent action. If the category was out on it’s own for each of these queries, I would be increasing the load times by 33%, theoretically. The benefit to having categories on it’s own would be that I could have attributes and methods specific to categories, but I didn’t need that! The choice was practically made for me.

![Achievement](/img/blogs/composingcrudapp3.jpeg)

One of the choices that had countless options was the selection of a gem for displaying messages to the user when they ran into failures. These failures happen when a user is not logged in and they try to modify activity, they’re logged in and they’re trying to modify an activity that’s not theirs, when fields are left blank during signup or login, and when the user successfully logs out. Two of the standout options for this behavior were rack-flash and sinatra-flash. From what I’ve read, sinatra-flash is an extension of rack-flash including the ability to use *<%= styled_flash %>* which will rotate through flash messages depending on what is active at the time. It also enables styling flash messages by using only one CSS rule — incredibly easy.

Once I read through the above guide and implemented flash messages for all failures, I only had a few typos and tweaks to apply and my very first CRUD app was built! Each project it becomes clearer that starting is the hardest part and each time that a roadblock comes up in the project, keep pushing and eventually it will fall. Sometimes… frequently… most often it can feel like I’m stuck at each checkpoint and cannot progress any further but then I do. I think that is the principal lesson I have learned at this point.
