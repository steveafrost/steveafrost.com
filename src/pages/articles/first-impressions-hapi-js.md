---
layout: post
title: "First Impressions: Hapi.js"
author: Steve Frost
date: 2017-08-20 20:45:00 -04:00
categories: blog
tags: node hapi devops javascript
description: ""
comments: true
path: "/articles/first-impressions-hapi-js"
---

Over the weekend I had a project which provided my first taste of Hapi.js – a rock-solid web application framework built on Node brought to us by the folks at WalmartLabs. Walmart?! Yup. The Hapi framework is actually what keeps Walmart's site sailing so smoothly with millions of concurrent users. Hapi [grabbed the spotlight](https://changelog.com/podcast/116) on Walmart's Black Friday 2013 sale when their Analytics reported over 200 million concurrent users and Hapi was able to maintain an extremely stable server that [even sat idle under 1% load at times](https://github.com/hapijs/hapi/issues/1326). The quality of engineering involved in Hapi is mind-blowing. Anyway, enough infatuation and onto my experience with the framework.

Although I've been doing solely Javascript lately, this was also my introduction to creating a full-fledged server out of Javascript. Up until now, my back-end architecture was always Rails so it was exciting to break out of the Ruby world and explore what a full-stack Javascript app looks like. Since Rails is the only other back-end web app framework I used, I was quick to compare Hapi to the patterns & conventions I'd seen before. To my surprise, it is actually similar in some ways most of which being that Hapi & Rails both favor convention over configuration. 

By promoting this mantra, developers can use Hapi (and Rails, ok, enough about Rails!) to get up and running in no time flat. Really, it only takes about 5 minutes. Let's visit the process from `New File` to `npm start`, or `nodemon` which [auto-reloads the server](https://hackernoon.com/nodemon-example-tutorial-npm-start-script-auto-watch-47cd702fe442) if you're a fellow fan of tight feedback loops.

1. `mkdir hapi-example && cd hapi-example` & `npm init` to create a new directly with an package.json to manage dependencies
2. `npm install hapi --save` to install Hapi as a dependency
3. `touch server.js` to create a file where we're going to instantiate/setup the server
4. Setup the server using this snippet

```javascript
var Hapi = require('hapi');

var server = new Hapi.Server();

server.connection({ port: 3000 }); // or any port number

server.start(function() {
  console.log('Listening on ' + server.info.uri);
});
```

That's it! With a few lines we've required the Hapi framework in our file, instantiated a new instance of the Hapi.Server object, passed in our port to run the server on, and logged to the console a beautiful message dictating our running server address – `localhost:3000`.

Albeit, the configuration can be much more complicated than this if further config is needed. The nice thing about it though is that each method on the server object takes an object of key/value pairs exactly like everyday, familiar JSON. (or other Javascript web framework for that matter)

For example, now that we have our server running, let's take a look at the snippet to make a route. A route requires a path, a RESTFUL verb, and a handler. The server then waits for a request of that verb type at the location/path, and provides the file/view provided in the handler.

```javascript
server.route({
  path: '/',
  method: 'GET',
  handler: {
    file: 'index.html'
  }
});
```

Again, a method and a simple object passed in w/ key value pairs. Keep in mind that [there are several ways to use the handler](https://hapijs.com/tutorials/serving-files). You can directly call a static file, pass in a function with reply & request arguments then access those arguments, designate entire directories to search for matching assets, and those are just a few of the cases I've come across in my abbreviated time with the framework.

So far, I've really been enjoying the experience of learning Hapi due to it's similarly to Rails and the well-designed configuration. As soon as I finish up my core React lessons, I'll be turning my focus to launching a Node/Hapi & React app. I have a few burning ideas, as usual. （ ^_^)
