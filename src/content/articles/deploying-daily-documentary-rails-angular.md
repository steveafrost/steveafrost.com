---
title: "Deploying Daily Documentary - Rails/Angular"
date: 2017-05-28
description: "For the past several months I've been focused on learning, creating, and sharpening skills and just recently found time to take a break and deploy one of those creations, a web application built with a Rails back-end and an Angular front-end. Though Daily Documentary is always available on GitHub for people to download and use, that isn't as accessible as being live which allows users to simply visit the URL. Getting to that fully live state wasn't without bumps which I'll use this blog post to reflect on."
tags:
  - angular
  - postgres
  - rails
---

![baseball-diamond-angle](/img/blogs/railsangularapp1.jpg)

For the past several months I've been focused on learning, creating, and sharpening skills. I just recently found time to take a break and deploy one of those creations, a web application built with a Rails back-end and an Angular front-end. Though [Daily Documentary is always available on GitHub](https://github.com/steveafrost/daily-documentary) for people to download, setup, and use, that isn't as accessible as being live which allows users to [simply visit the URL](https://daily-documentary.herokuapp.com/). Getting to that fully-live state wasn't without bumps which I'll use this blog post to reflect on.

### Finding a Deployment Destination
Previously, I had deployed WordPress sites, static-generated websites, and a Ruby gem so a full-fledge web app was a fresh experience. After some reading around, and previous knowledge, I found that Digital Ocean does a [nice, hefty credit for GitHub Students](https://education.github.com/pack) and started down that road. Once I set up an account and started to read about the deploy process, I ran across [Heroku's free option](https://www.heroku.com/free) which allows deployment of up to five apps or even one-hundred if the account is verified. I'm not sure how they can afford to do that, it's incredible. The servers they store these apps on are not highly performant and even sleep every 30 minutes of inactivity causing page loads which wake up the app to take several-fold longer. Of course we have to make some sacrifices for a free service. These aren't that great of trade-offs in my opinion for an efficient deploy process for no cost out-of-pocket. If/when the app gets popular, I'll look into transferring it onto my Digital Ocean account to have a fully operational server.

### Preparing for Deploy
In order to deploy the Rails app, I had to convert the SQLite3 database into a Postgres database. The reason for this is that SQLite is a database that has it's memory dumped as soon as the server restarts which is a useful trait in development but doesn't bode so well for production. Imagine losing all user information & settings every twenty-four hours (frequency of Heroku) when the production server restarts - not an option. The most straight-forward way to use Postgres with Rails is to pass in the option when generating the app using `rails new --database=postgresql`. In my case, my app was already completed and this option was off the table. Instead, I followed details on how to convert SQLite to Postgres.

1. Install Postgres using Homebrew (or other) with command `brew install postgres`
2. Add `gem 'pg'` to the Gemfile
3. Run `bundle install`
4. Start Postgres local server using `postgres -D /usr/local/var/postgres`
5. Convert Rails app database.yml file to use Postgres adapter
6. Run `rake db:create` and delete old, unused development.sqlite3 file

![converting-sqlite-db-to-postgres-db](/img/blogs/railsangularapp2.jpg)

### Deploy and Debug
With the database converted, tested, and ready to go, it's time to deploy. Regardless of how much preparation is done before deploying code live, there's always a chance of it operating differently in a production environment.

One of the known issues when entering production, especially with Angular, is the process of minification. As much as I prepared for this in my code by using the $injector service to dictate the dependencies, there were inevitably spots that I left it out thinking I didn't need it there. One of these is that this same specificity is needed when using services in the module's configuration itself. [John Papa recommends](https://github.com/johnpapa/angular-styleguide) using the $injector service for executing this which is what I did in all my files except the config not thinking I needed it there. Boy, was I wrong. When I first pushed my code up to Heroku I was ready for a success moment and excited to see the app in the live, instead, I was greeted by error-palooza.

![heroku-errors-about-dependency-fail](/img/blogs/railsangularapp3.jpg)

Looking at the source code, I could see that the dependencies for my Angular module's config were being minified with no reference like my controllers & factories had available.

![source-code-at-fail-point](/img/blogs/railsangularapp4.jpg)

To fix this, I provided the dependencies just like I had done elsewhere in the app. There is a slight style difference here in that I went with an inline approach instead of doing `x.$inject = []` simply because the inline style looks more appealing here. They both have similar behavior so it was purely a design choice.

![config-inject-dependencies](/img/blogs/railsangularapp5.jpg)


### ...and we have liftoff!

Once I fixed the dependency issue, the app appeared as expected on Heroku. Fireworks, graduation bells, victory cheers - [it's now available for anyone to see](https://daily-documentary.herokuapp.com/)! There are a few lingering issues to fix involving the images & asset hashing which can be resolved by using ERB helpers. I'm hoping to have this bug and the app as a whole completely ironed out by mid-week. After that, I'm going to resume work on the [authentication branch](https://github.com/steveafrost/daily-documentary/tree/authentication) to allow for individual profiles instead of having one general profile. At that point, Daily Documentary is ready for users and prime-time!
