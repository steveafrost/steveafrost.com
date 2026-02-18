---
title: "Continuous Deployment with Surge"
date: 2017-07-30
description: "Surge is a CLI client that will feel familiar to developers who spend most of their time in Terminal - that's most of us, right? It has plugins for popular build tools like Gulp & Grunt so that the publishing step can be built right into an app or you can publish straight from the CLI, or, our third option that we'll be discussing here is using GitHooks to enable continuous deployment from the repository."
tags:
  - devops
  - environment
  - static-site-generators
---

As long as I've had a static-generated site, I've hosted it on GitHub Pages & built with Jekyll. If you take a quick look at [what generators are the most popular](https://www.staticgen.com/), Jekyll takes the cake. Although it is a well-thought, stable option, most of it's popularity can be attributed to being natively supported by GitHub Pages which makes deployment seamless. Essentially, the entire file-system of Jekyll can be pushed up and GitHub will handle the build process – extremely convenient! But what about the other static-site generators or even a static-site built from scratch with a custom build process say through Gulp, [as we covered before](https://steveafrost.com/articles/preprocessing-bundling-and-live-preview-with-gulp). Well, that's where Surge comes in.

### What is Surge?
Surge is a CLI client that will feel familiar to developers who spend most of their time in Terminal - that's most of us, right? It has plugins for popular build tools like Gulp & Grunt so that the publishing step can be built right into an app or you can publish straight from the CLI, or, our third option that we'll be discussing here is using GitHooks to enable continuous deployment from the repository. 

### What is Continuous Deployment?
Continuous Deployment means that when code is published to the repository, it is set live without a step in-between. The action of GitHub w/ Jekyll building the static files & then deploying them is essentially this step. As a Jekyll site is being built, any commits are processed, built, then deployed.

When using a custom environment or an alternate static-site generator that's not hosted by GitHub Pages, we're required to build this process into our own website or app. It sounds complicated, but it's rather simple through GitHooks and a simple package.json script.

(There's also Continuous Delivery which is slightly different requiring a manual step to deploy - more about that [here](https://puppet.com/blog/continuous-delivery-vs-continuous-deployment-what-s-diff)).

### Build & Deploy w/ Surge
We'll need to install a few dependencies in the project to get things started. 

1. If you don't already have a package.json file, type `npm init` to create one. 
2. Following that, `npm install --save-dev surge git-scripts`
3. Add in a pre-push script in your package.json file. In addition to pre-push, there are several different parts of the git process that can be hooked into using GitHooks. Read more about those & GitHook managers [here](http://githooks.com/).

```javascript
"devDependencies": {
  "surge": "latest",
  "git-scripts": "latest"
},
"git": {
  "scripts": {
    "pre-push": "surge --project ./public --domain steveafrost.com"
  }
}
```

Now we're ready to test it out. Try to commit some new changes to the repository and once you `git push`, the surge command will run on your ./public folder for the providing domain. Don't forget to update those two parameters with your specific directory & domain.

```
    Surge - surge.sh

              email: hello@steveafrost.com
              token: *****************
       project path: /Users/stevefrost/Downloads/public
```

Awesome! Our most recent commit is pushed to GitHub while the ./public folder is sent over to Surge. One issue though, we haven't rebuilt the ./public folder based on our most recent code. Let's add that to the script too. In order to do this, use the specific command for the environment being worked in or the tool being used. In my case, I am using Gatsby so the command to take all dynamic files and make them static is `gatsby build`. Here is the new GitHook script.

```javascript
"git": {
  "scripts": {
    "pre-push": "gatsby build && surge --project ./public --domain steveafrost.com"
  }
}
```

Simple as that! Now each time `git push` is run, Gatsby will run the build process, send that newly built ./public folder over to Surge, and commit the latest code to GitHub. Viva la automation!
