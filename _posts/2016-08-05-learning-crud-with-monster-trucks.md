---
layout: post
title: "Learning CRUD with Monster Trucks"
author: Steve Frost
date: 2016-08-05 16:00:00 -04:00
categories: blog
tags: flatiron-school learning-to-code
description: "We try to have some nostalgic monster truck fun while learning CRUD routes in Sinatra"
comments: true
---

*(Day 96)*

CRUD is a handy acronym that stands for Create, Read, Update, and Delete — each word representing a particular controller action within Sinatra. Think of these controller actions like this: each time you type a URL into the address bar of the browser, a controller at that site watches for that URL and will go into the website or program and grab the relevant information that you have requested. Controller actions direct the traffic into the proper lanes much like a traffic cop would at a busy intersection, or in our case, a website.
Let’s do a quick example. If I were building an app that cataloged books… or let’s say MONSTER TRUCKS, then here’s how each action of CRUD would direct the “traffic” into the lanes — see the analogy worked out, traffic cops and monster trucks.

* **C**reate would be responsible for fielding requests for the URL, /truck/new and when that happens, this action shows the user the “view” called “new.” This view is an HTML page quite like the one you’re reading now. Within the “new” view, there is a form to create a new truck. Give your truck a cool name, Grave Digger is the best, a flashy color, mandatory coolness score, and then submit the form. Here is where the Create action pulls double duty. This action also handles creating the truck from the information submitted in the form and saving that information to a database so that we can see the details of that truck at any later time.

![Create Screenshot]({{site-url}}/assets/learningcrud1.jpeg)

* **R**ead then provides access to seeing each trucks details. If a user visits /truck/grave-digger then the Read controller will grab the details about that truck, the best truck of all, and display it on a HTML page.

![Read Screenshot]({{site-url}}/assets/learningcrud2.jpeg)

* **U**pdate is there for whenever we need to edit the trucks already saved into the database by a Create action. To update a truck, the user visits /truck/grave-digger/edit and is shown a form pre-filled with the information that we already know about that truck which was saved in the database when we Created it. Each field can be updated with new information then the Update controller handles applying those changes to the truck within the database. In this way it is similar to Create in that it will both display a form on a page and take the information entered into that form to the database.

![Update Screenshot]({{site-url}}/assets/learningcrud3.jpeg)

* **D**elete is the simplest controller. The sole purpose for the Delete controller is to wait for a user to click “Delete” on the /truck/grave-digger/edit page and when that happens, Delete the truck within the database. Be careful with this controller as it’s permanent and Grave Digger knows where you live.

![Delete Screenshot]({{site-url}}/assets/learningcrud4.jpeg)

This pattern helps immensely with organizing a web app and creating consistent structure among the developers who do choose to use it. As a beginning Rubyist (if I can use that word) it has helped me tackle the common hurdle of staring at a blank text document when starting a new project because now I know I can start off with Create and move through the following CRUD actions to form the base of my app.
Hopefully that provides a general understanding of CRUD apps and inspires a few project ideas. If there’s any clarification I can offer, let me know in the comments and I’ll do what I can to help! In no time you’ll be doing CRUD apps which is basically the equivalent of…

![Monster Truck Doing Circles]({{site-url}}/assets/learningcrud5.gif)

