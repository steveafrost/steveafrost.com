---
layout: post
title: "Plant Nanny: Keep Your Plants Happy"
author: Steve Frost
date: 2016-10-07 17:30:00 -04:00
image: '/img/blogs/plantnanny1.jpeg'
categories: blog
tags: flatiron-school learning-to-code rails ruby
description: "An overview of my first Rails app called Plant Nanny"
comments: true
---

*(Day 159)*

Today I reached the end of my 3rd project for Flatiron School. Today I reached the end of my... if I just keep saying it maybe it will be true. That's how I felt for weeks. This project was definitely the most challenging but after a month of work, my Rails app is complete.

![Plant Nanny Homepage](/img/blogs/plantnanny1.jpeg)

[Plant Nanny](https://github.com/steveafrost/plant-nanny) is a web app built completely in Rails that helps with managing indoor plants. It includes a system for measuring difficulty, amount of light, amount of water, and frequency of watering. Combined, they can give a quick overview of if you want to try to grow that particular plant or not. As you buy new plants, you can add them to your profile on Plany Nanny to keep track of them.

Inspiration for the app came from my own personal experience with indoor plants. Some like to be completely dry before they get water while some want the complete opposite; some want bright light while others want to be in the dark for every other week. Instead of keeping this information in your head, plants can be added to a profile in PlantNanny and the needs can be tracked there.

![Plant Nanny All Plants Page](/img/blogs/plantnanny2.jpeg)

**Challenges I Faced**

* Should I allow for image upload or use a placeholder image for each plant?* I decided to use a placeholder for the plants because I wasn't aware of how to do an image upload in Rails yet and there were so many other things that were new to me. The placeholder allowed me to focus on the grander scheme of the app and prioritize image uploading for the next release.

* How do I setup the migrations? Do I have enough/too many tables?* I got stuck on this same question when doing my Sinatra project. It helps to talk your schema through with someone and see if they have any questions/suggestions. Once you've done that, move forward with the project. It's important to write code so that you can see how the program will look with your proposed schema then you can add or remove tables later. It's useful to remind yourself that the database *can* change.

**Plans for v2**

* Include a dropdown on Add Plant page to select existing plant (right now it matches the title typed in - too much error probability)

* Add "today" to the My Profile page which shows which plants need to be watered, moved, or repotted today. Can even build this out further to alert you via an extension or light mobile app

* Provide an interface for users to add images to plants

* Refactor the new plant form to be dynamic with JS. Show detail fields only if the plant isn't already in the DB.
