---
layout: post
title: "Templating with Solely JSON"
author: Steve Frost
date: 2017-07-16 23:00:00 -04:00
categories: blog
tags: javascript mustachejs json templating
description: "Over the weekend, I created a simple messaging act appropriately called simple-messaging. After about 6-8 hours of work, I was able to create a functional prototype that allows for users to send dynamically generated messages to a list of users. Although there are established templating languages like mustache.js, I decided to use solely JSON & JS to create the templates needed for the messages and was really impressed with how robust, yet simple, it turned out in the end."
comments: true
---

![simple-messaging-screenshot](/assets/img/blogs/templatingjson0.jpg)

Over the weekend, I created a simple messaging act appropriately called [simple-messaging](https://github.com/steveafrost/simple-messaging). After about 6-8 hours of work, I was able to create a functional prototype that allows for users to send dynamically generated messages to a list of users. Although there are established templating languages like mustache.js, I decided to use solely JSON & JS to create the templates needed for the messages and was really impressed with how robust, yet simple, it turned out in the end.

### Objective
Create a functional, stable bite-sized web app that covers several criteria:

1. Loads templates, company list, and current hotel guests from local JSON files.
2. Support placeholders/variables within the template that can be replaced with values from the company & guest data.
3. Allow the user to enter a custom message.
4. Develop solution to have a greeting variable that changes based on the time of day, specifically: good morning, good afternoon, and good evening.
5. Generate a final message output after populating placeholders in the message template with the correct values from the other data collections.

### Using Placeholders/Variables in JSON
Although there are plenty of templating languages, the challenge on this product was to do it without those & rely solely on JSON. To do that, the message within the template had to have some kind of placeholder, similar to how mustache.js has {{ thisIsAVariable }} to denote where data will be replaced.

```javascript
    "id": 2,
    "name": "Restaurant Recommendations",
    "message": "If you're looking for somewhere to enjoy a delicious meal, try out #company restaurant right downstairs in the lobby.",
    "parameters": {
      "#company": {
        "type": "string"
      }
    }
```

The important piece here is that we've included `#company` within both the message & the parameters. By including a parameters object, it allows us to loop over all placeholders in a simple, lean way later on without having to use RegEx to search the string for all occurrences of our placeholder delineators. We can also include a type for each parameter to validate proper input once the form is submitted. The current code base includes these types though checking the input data against them is not currently live – great addition for version two!

### Handling Parameters in Javascript
Now that we have a template with placeholders, or just one placeholder in the example here, we can look at loading the template message. Once we do grab the template message, we'll want to loop over the parameters and fill them in with the data retrieved from our company.json and guests.json files. Let's parse!

```javascript
      for(var parameter in template.parameters) {
        var trimmedParam = parameter.substring(1);

        if(guest[trimmedParam]) {
          template.message = template.message.replace(parameter, guest[trimmedParam]);
        } else if (company[trimmedParam]) {
          template.message = template.message.replace(parameter, company[trimmedParam]);
        } else {
          template.message = template.message.replace(parameter, greeting);
        }
      }

      this.render(template.message);
```

This code is a prime candidate for refactoring, but let's ignore that for a second. First, we grab the template that was selected & look at it's parameters. For each parameter, we trim off the `#` symbol so that it is a 1:1 match with the properties in our other data objects. 

Next, we see if it is located in the guest or company object and if it isn't, we know it is our custom greeting variable. If the parameter does match a property in the guest or company objects, then that parameter is replaced with the actual value from the data & the template.message is saved each time because `.replace` will not mutate the string in place. 

Finally, after our template.message has had all it's parameters looped over & replaced with data from either guests.json or company.json, we send along that string to the render method which places it on the page.

### Conclusion
As easy as mustache.js and other templating libraries/engines are, I kind of fell into liking this pure JSON approach. It is obviously not as efficient and although I haven't run into any issues, I imagine it is more prone to bugs. Nevertheless, it makes for a nice, quick way to prototype an idea or to keep a project lean when not all the capabilities of a templating library/engine will be utilized.
