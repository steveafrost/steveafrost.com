---
title: "Preprocessing, Bundling, and Live Preview with Gulp"
date: 2017-07-02
description: "A common phenomenon in the community is that we regularly build upon abstractions that have been established without fully understanding what they are or how to build them ourselves. On one hand, if we dug down into every abstraction to the individual pieces that make it work, we'd probably never get any work done. On the other hand, I believe it's important to have at least a general understanding of what is going on under the hood so if there is an issue, I can fix it. In the intersection between 'no idea how it works' and static-site generators is the development environment setup by these generators."
tags:
  - sass
  - css
  - javascript
  - gulp
  - environment
---

![gulp-logo](/assets/img/blogs/gulp1.jpg)

A common phenomenon in the community is that we regularly build upon abstractions that have been established without fully understanding what they are or how to build them ourselves. On one hand, if we dug down into every abstraction to the individual pieces that make it work, we'd probably never get any work done. On the other hand, I believe it's important to have at least a general understanding of what is going on under the hood so if there is an issue, I can fix it. In the intersection between 'no idea how it works' and [static-site generators](https://steveafrost.com/building-a-website-using-middleman/) is the development environment setup by these generators.

After using such generators as Jekyll, Middleman, and Gatsby, I became interested in how to build such an environment that included preprocessing for SASS, bundling for javascript files, and live reload for an efficient [feedback loop](https://www.smashingmagazine.com/2013/02/designing-great-feedback-loops/). 

When I received my next side project, I started to look for what kind of tools were being used for this and came across three: [Gulp](http://gulpjs.com/), [Grunt](https://gruntjs.com/), and [Webpack](https://webpack.github.io/). If you've been within earshot of even a single developer over the past half year, you've probably heard about at least Webpack. It's generating the most buzz right now particularly because it works well with the emerging Javascript frameworks like React. That said, I put it on my short list of tools to learn because I've read that it can be overwhelming to learn especially if it is your first build tool. Instead, I wanted to start with a build tool that has been around for longer and is the older brother in some ways: [Gulp](http://gulpjs.com/).

### Unboxing Gulp

Put simply, Gulp can do a ton. Out of the box, there are simple functions like `.src` and `.dest` to designate source & destination folders. There are simple ways to read, process, and return the result in the same folder but I'd suggest structuring your project with a `./source` and `./build` folder. The source folder is where the individual, unbundled, unminified, unoptimized files will live and after Gulp is done, the build folder will contain these same files organized in a manner that is fully web optimized & ready to ship.

### Gulp Plugins Starter Kit

When Gulp really starts to shine is with plugins. You can find an entire list [here](http://gulpjs.com/plugins/). In fact, you'll need a few plugins to do the automation/building we're going to do.

* _gulp-sass_ used for preprocessing SASS files and turning them into one cumulative CSS file. This is beneficial because then rules can be separated by topic, section, or other designation and the production site wouldn't know otherwise. It also helps in reducing load times & server load because there's only one request made to the server for one CSS file rather than multiple requests for multiple files. 
* _gulp-concat_ used for bundling all Javascript included in the project. This has similar benefits to the gulp-sass plugin in that it allows for separation of code and reduces server requests to a single request for one bundled Javascript file.
* _gulp-sourcemaps_ used for guiding back to the original SCSS or JS file. Most modern browsers support sourcemaps now and they're a great way to keep tabs on the individual files 
* _browser-sync_ used for live preview of code. This allows for any changes made to HTML/CSS/JS/etc to show up instantly within the browser reducing the feedback loop to nearly seconds.

### Other Optional, Cool Plugins

* _gulp-imagemin_ used for minifying images and optimizing them so that each image is the smallest it can be without sacrificing noticeable quality. Since images typically are the heaviest lifting on a project, this is a favorite.
* _gulp-clean_ used for cleaning our build folder with a simple `gulp clean` command so that the folder doesn't contain stagnant, unused files. Great item to run every once and then or loop into your regular build process.
* _gulp-rename_ used for renaming files after running a task on them. This is optional since the original filename might be all that is needed for certain projects.
* _gulp-sequence_ used for running multiple tasks in a sequence rather than asynchronously. Gulp 4.0 will [support this out of the box](https://fettblog.eu/gulp-4-parallel-and-series/) with `.series` & `.parallel` functions.

### Using Gulp

Once we have the plugins we need, we can move into the actual automation of the tasks. The pattern I like to follow is to make individual tasks each with their own name then rolling all of them into one general `gulp build` command. For example, here is a few tasks to process the SASS, bundle JS, and launch live preview.

```javascript
// Process ./source/assets/css/main.scss to ./build/assets/css/styles.css
gulp.task('processSass', function() {
  return gulp.src('source/assets/css/main.scss')
             .pipe(sourcemaps.init())
             .pipe(sass())
             .pipe(sourcemaps.write())
             .pipe(rename('styles.css'))  // optional renaming
             .pipe(gulp.dest('build/assets/css/'))
             .pipe(browserSync.reload({stream: true}));
});

// Process ./source/assets/js/* to ./build/assets/js/bundle.js
gulp.task('concatJS', function() {
  return gulp.src('source/assets/js/*.js')
             .pipe(sourcemaps.init())
             .pipe(concat('scripts.js'))
             .pipe(sourcemaps.write())
             .pipe(gulp.dest('build/assets/js'))
             .pipe(browserSync.reload({stream: true}));
});

// Load browserSync to create local server & hot reload
gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'build'
    },
  });
});
```

If you've never used Gulp before, don't let those lines scare you away from it. They are using fundamental Javascript patterns of anonymous functions, objects, and chaining. The techniques & code are outlined incredibly in the docs for more clarity.

Next, I like to take each of these tasks and combine them into a single command which will watch our files & run the tasks when it detects any changes. That looks like this:

```javascript
// Assemble preprocessor, bundle js, and live preview to create dev environment
gulp.task('develop', ['processSass', 'concatJS', ['browserSync']], function() {
  gulp.watch('source/assets/css/**/*.scss', ['processSass']);
  gulp.watch('source/assets/js/*.js', ['concatJS']);
});
```

Here, we provide the task `develop` with the two previously created tasks `processSass` & `concatJS` which tells the task to run these before running anything inside of the task itself - the `.watch` items in this case. Once the initial tasks are run, `.watch` functions keep an eye on the folders where the CSS & JS files are located and will rerun the `processSass` & `concatJS` tasks if there are any changes detected. The processed and/or bundled code will then be injected into our browser thanks to the task `browserSync` ([more about BrowserSync](https://www.browsersync.io/)) which was also included. Pretty cool!

### Conclusion

Armed with these plugins, specifically the starter kit list, we can do all the 'magic' done by static-site generators and further customize the tasks for our specific project. It is fun to work with Gulp and can be motivating work knowing that each task is automating work usually done manually over and over. Also, once you have an established setup, many of the tasks can be saved and reused with slight, if any, modification to provide a jumping off point for projects.
