---
layout: post
title: "Templating with Solely JSON"
author: Steve Frost
date: 2017-07-02 23:00:00 -04:00
categories: blog
tags: javascript mustachejs json templating
description: ""
comments: true
---

Over the weekend, I created a simple messaging act appropriately called simple-messaging. 

### Objective
Create a functional, stable bite-sized web app that covers several criteria:
1. Loads templates, company list, and current hotel guests from local JSON files.
2. Support placeholders/variables within the template that can be replaced with values from the company & guest data.
3. Allow the user to enter a custom message.
4. Develop solution to have a greeting variable that changes based on the time of day, specifically: good morning, good afternoon, and good evening.
5. Generate a final message output after populating placeholders in the message template with the correct values from the other data collections.
