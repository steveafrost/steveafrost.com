---
layout: post
title: "A Greenhorn's Approach to Angular"
author: Steve Frost
date: 2017-1-18 23:00:00 -04:00
categories: blog
tags: flatiron-school learning-to-code angular javascript ruby rails project
description: "A synopsis of what I learned by building my first Angular web app including the resources that were helpful to me, the hang ups, and the engineering decisions that were constructed on my first Angular project."
comments: true
---

I started learning Angular over a month ago as part of my final section at Flatiron School... about a week ago I actually started to understand Angular, I think. This seems to be the typical trajectory, and sentiment, as there is _so_ much information on what Angular is and how Angular is done. After reading material, watching tutorials, and practicing small segments of Angular, I started on my final project a few weeks ago. There were [several specific specs](https://github.com/steveafrost/daily-documentary/blob/master/spec.md) provided for the project with the general idea being that the back-end would be Rails while the front-end would be Angular.

In this post I'll provide the material that was useful to me when starting out on Angular, the hang ups, and the engineering decisions that were constructed on my first Angular project.

### Front-End Package Management

Immediately upon starting my project I was met with something I've never dabbled with before - installing & maintaining front-end dependencies for Javascript. At this point, I had heard somewhat about different tools on the JS scene like [NPM](https://www.npmjs.com/), [Bower](https://bower.io/), and [Yarn](https://yarnpkg.com/). A majority of the [Angular tutorial videos](https://www.youtube.com/watch?v=zKkUN-mJtPQ) that I watched used Bower so I set down that road at first until I came along a recent development called RailsAssets in [this valuable GoRails video](https://gorails.com/episodes/rails-assets).

If you're using Rails, I really like [Rails Assets](https://rails-assets.org/#/) over Bower. More or less, Rails Assets will look at the same repo file Bower would (bower.json) and then it repackages that manifest file into a gem. This all happens on the Rails Assets backend and the only thing needed on your side is to include a block w/ a new source for gems and then list the gem.

```ruby
source 'https://rubygems.org'

gem 'rails'
gem 'sass-rails'
gem 'uglifier'
gem 'coffee-rails'

source 'https://rails-assets.org' do
  gem 'rails-assets-bootstrap'
  gem 'rails-assets-angular'
  gem 'rails-assets-leaflet'
end
```

Using Rails Assets over Bower has several benefits:

* There is no need for an extra bower.json file. All packages (or gems) & dependencies live in Gemfile.
* Since everything is in one file, we only need `bundle install` to install all packages whereas with Bower & Bundler we'd need to run two different commands, `bundle install` and `bower install`.
* Front-end packages are now included in the asset pipeline. [More about Asset Pipeline benefits](http://guides.rubyonrails.org/asset_pipeline.html).
* Compared to traditional Ruby gems, there is no waiting for an author to update their gem. Rails Assets repackages bower.json files when they are updated at the source.

After using rails-assets.org for the entirety of this project, I can say I really enjoyed this way of managing front-end packages. It had all the features of Bower, that I know of, and the added benefits listed above. When I do a project without Rails, I will opt for Bower. However, if the project uses a Rails backend then I'll be utilizing the Rails Assets method.

### Choosing a Design Framework

Even though design is not a graded criteria at Flatiron, I find that many students and creators in general will strive to have a polished product after putting in innumerable hours of work. Along those lines, the second decision I made after a package manager was what design framework I wanted to use. On previous projects and side-jobs I had used [Bootstrap](http://getbootstrap.com/) & [Foundation](http://foundation.zurb.com/) so I went looking for something different. 

After considering that I was using Google's Angular framework for my front-end, I narrowed my search to design frameworks that supported directives that I could plug straight into Angular. This slimmed down the options to just a handful: Angular Bootstrap, Angular Foundation, Ionic, UI Grid, or Angular Material. Since both Angular & Material were created by Google, I decided to try an app that had them paired up. I also really enjoyed the [Material approach to design](https://material.io/guidelines/) which supports a mobile-first design (the good ones do) with emphasis on user interaction and bright colors. If the purpose of Material design interests you, WIRED did a good piece on what [Google's Material Design Is Really About](https://www.wired.com/insights/2014/12/google-material-design/).

Since this was my first experience with Material, I struggled at first with simple concepts such as layout. There is an abundance of Flexbox usage in Material which is robust once you learn [how it works](https://css-tricks.com/snippets/css/a-guide-to-flexbox/) but can be aggravating if you're coming from the row/column behavior of a framework like Bootstrap. Other features like the services provided by Material seamlessly integrated with Angular. One that I couldn't believe how easy it was to use was the $mdToast service which provides options for showing a "toast" or notification on the screen as a result of an action.

```javascript
    function addToWatchlist(docTitle) {
      return profileFactory.addToWatchlist(docTitle)
                           .then(showMessage);

        function showMessage(response) {
          $mdToast.showSimple(response.title + ' added to watchlist');
        }
    }
```

That simple! If you want to further [configure the $mdToast service](https://material.angularjs.org/latest/api/service/$mdToast) there are plenty of options available for that as well.

That leads to my final point about Angular Material - the documentation is has been extraordinary in my experience. It is split between a few pages which can be tough but each provides a look from a different angle. The two pages that were most useful were the [Demo Documentation](https://material.angularjs.org/latest/demo/) which shows live demos of each feature of the framework and the [API Documentation](https://material.angularjs.org/latest/api/directive/mdAutocomplete) which details the finer points of the features.

### Engineering Decisions

The Angular community is the fastest changing, most style-opinionated language I've encountered since I've started at Flatiron. That has the benefit of being on the bleeding edge of the JS Framework scene but you also come across conflicting resources. In light of this, I used the style guide & Angular pieces with the widest adoption at the time of creating my project.

The style guide I settled on was [John Papa's Style Guide](https://github.com/johnpapa/angular-styleguide/blob/master/a1/README.md#single-responsibility) which is an impressive collection of guidelines for writing Angular. The guide is so impressive that the Angular team themselves adopted it for Angular 1 and even brought on John Papa for creating a style guide when they created Angular 2. Papa also wrote a [descriptive post](https://johnpapa.net/angular-app-structuring-guidelines/) on his site about how to structure your app.

As far as what types of Angular pieces to use, I settled on using controllers, factories, and templates. While controllers are fairly common place in Angular 1, some developers use Components which more closely model Angular 2 and other popular JS frameworks like React. The more research I did about the Angular 1 community, the more it seemed like Angular 1 developers used components for a period then went back to controllers & factories, so I stuck to these. Additionally, there are services which are used often too. Factories are simply a kind of service with less overhead and can usually be used 90% of the time instead of using a full-fledged service. When considering which is needed, reading [a comparison of services vs factories](https://blog.thoughtram.io/angular/2015/07/07/service-vs-factory-once-and-for-all.html) was especially constructive.

As far as the templates, there were two options: place them within my Rails public folder or use [angular-templates](https://github.com/pitr/angular-rails-templates) to incorporate them with the asset pipeline. I chose the latter since my original decision to use Rails-Assets instead of Bower also capitalized on using the asset pipeline. Using this gem was a breeze: include the gem in the Gemfile, create a templates folder next to your controllers & factories folders, insert your html templates in there, and reference them by filename from anywhere in your Angular app.

### Wrapping It Up

As is the case with learning new material, Angular was frustrating at first. Similar to jQuery, once I figured it out I started to really enjoy the immediacy of the framework & the structural organization that Angular offers. Though most of the industry has adopted React as their primary JS framework, I really enjoyed Angular and plan to refine what I've learned before moving onto learning React - I am inspirited to start React though! Soon.

It is bittersweet to be finishing Flatiron School. In the past 8 months I've learned more about web development than years of using learning on my own. It doesn't stop here though. After graduation there will be additional resources opening up that cover Node & React, a few side-projects that are in the planning phases, and personal project ideas that are brewing. Hopefully that more opportunities like Flatiron come along in the future. The time here has instilled that there will consistently be emerging technologies to try, struggle with, and most satisfyingly, learn.