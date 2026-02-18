---
title: "Busting Cache with Asset Hash"
date: 2017-03-26
tags:
  - caching
  - hashing
  - performance
  - sprockets
  - middleman
  - rails
  - webpack
  - npm
---

![asset-hash-picture](/img/blogs/assethash1.jpg)

While there are plenty of quirky nooks to browsers like different standards and behaviors, browsers also provide developers with some useful, practical tools. One of these is [HTTP Caching](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/http-caching) and is a god-send especially as a website grows in complexity. 

Briefly, cache is temporary storage that a browser can leverage to remember what a website looks like. On first visit, the user's browser has to make requests directly to the server, wait for a response, then display the files – CSS, Javascript, etc. This process takes time and resources. After that first visit, the browser can access this information directly from the cache rather than making additional requests from the server. [Extremely beneficial](https://developers.google.com/speed/docs/insights/LeverageBrowserCaching) for both the user and the server! The downside of this is that when resources do need to change, user's browsers won't pick up on those changes until the cache expires which can be upwards of months. To combat this, we can use what is called cache busting.

There are a [few techniques](https://css-tricks.com/strategies-for-cache-busting-css/) to bust cache with the most widely adopted being the technique called [asset hashing](https://survivejs.com/webpack/optimizing/adding-hashes-to-filenames/). The process involves creating a random string of letters and numbers, appending it to the end of all filenames, and in some cases using URL helpers to keep the HTML links up-to-date. By changing the filename each time the resource is updated, the browser is forced to load the new resource instead of refer back to the cached version. Additionally, this method is available with the most popular tools such as [Webpack](https://medium.com/@okonetchnikov/long-term-caching-of-static-assets-with-webpack-1ecb139adb95#.ycss3zitu), [Sprockets](https://middlemanapp.com/advanced/improving-cacheability/), and [NPM](https://www.npmjs.com/package/asset_hash) so the process can be set to happen automatically on build – so simple!

For additional reading on caching and other performance-based topics, check out the immense [Google's PageSpeed Insights documentation](https://developers.google.com/speed/pagespeed/insights/) or walk-through a checklist using [GTMetrix's Analyzer](https://gtmetrix.com/).

