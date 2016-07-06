---
layout: post
title: "Exploring Active Record"
author: Steve Frost
date: 2016-07-06 18:00:00 -04:00
categories: blog
tags: flatiron-school learning-to-code
description: Exploring Active Record: What We've Learned and What We've Found.
comments: true
---

_(Day 66)_

## Active Record Overview ##
Active Record is a Ruby gem (an incredible Ruby gem) that provides the ability to communicate with a database through object relational mapping. All this really means is that we can use similar object oriented conventions on our database through Active Record. Through this, we unlock several benefits:
  1. We can write to the database with Ruby strings and not rely strictly SQL inject code
  2. Since we can write with Ruby, we can make methods that do certain things to the database
  3. It allows your code to be easily portable to other database platforms

## Starting Off with Active Record ##
There are three prerequisites for using Active Record out-of-the-box: Active Record has to know where to find your database, that your tables are plural whereas your models are singular, and your table has a primary index that is named ID. Once these prerequisites are met, the environment file is responsible for creating the database as a whole and individual classes represent each table within that database.

## Some Useful Things You Can Do With Active Record ##
* Save your database items so that they have a similar scheme as your other program's objects
  * This means that the database object can interact with similar methods as your non-database objects. They live by a similar set of rules which makes writing and reading from everything in your program similar.
* The database becomes part of the program and lives within it rather so that rather than communicating out and back in, all communication is internal. This is a great feature as long as the program doesn't need an external, isolated database.
* Cut down on repetitive code
* Implement conventional patterns that are organized and sensical

## Things I Learned Outside of Flatiron's Coursework ##
Although there was plenty of material about Active Record in my coursework, there is 100 times that amount out in the wild. While exploring the plethora of content, I discovered that there are two main approaches to an ORM (object relational mapping) pattern: Active Record and Data Mapper. Active Record is in complete control of the program and very internal. We have created the objects, the attributes, and the methods to interact with the database. Data Mapper on the other hand makes the database like a "crazy aunt - shut her up in the addict you don't ever want to deal with her" and that the database is being ignored, as the creator of Active Record, Martin Fowler, [puts it](https://thoughtworks.wistia.com/medias/uxjb0lwrcz). PressUp also does a [really great job of describing](https://pressupinc.com/blog/2014/11/orm-patterns-active-record-data-mapper/) the differences between the two patterns by noting, "where active record seeks to invisibly bridge the gaps between the two as seamlessly as possible, the role of the data mapper is to allow you to consider the two more independently."

It seems that the community is divided between are ORMs good or are they bad and if you think they're good, which one makes more sense - Active Record or Data Mapper. Each have their own use cases and are reliant on how the developer wants their program to communicate with the database. As of now, Active Record has many more downloads on RubyGems outpacing Data Mapper 7-to-1 although they do have the convenient advantage of being the ORM within Rails.
