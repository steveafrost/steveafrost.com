webpackJsonp([0xc58c355b58d7c800],{"./node_modules/json-loader/index.js!./.cache/json/articles-busting-cache-with-asset-hash.json":function(e,t){e.exports={data:{site:{siteMetadata:{title:"Steve Frost – Full Stack Web Developer",author:"Steve Frost"}},markdownRemark:{id:"/Users/stevefrost/Development/Websites/steveafrost.github.io/src/pages/articles/busting-cache-with-asset-hash.md absPath of file >>> MarkdownRemark",html:'<p></p>\n<p>While there are plenty of quirky nooks to browsers like different standards and behaviors, browsers also provide developers with some useful, practical tools. One of these is <a href="https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/http-caching">HTTP Caching</a> and is a god-send especially as a website grows in complexity. </p>\n<p>Briefly, cache is temporary storage that a browser can leverage to remember what a website looks like. On first visit, the user’s browser has to make requests directly to the server, wait for a response, then display the files – CSS, Javascript, etc. This process takes time and resources. After that first visit, the browser can access this information directly from the cache rather than making additional requests from the server. <a href="https://developers.google.com/speed/docs/insights/LeverageBrowserCaching">Extremely beneficial</a> for both the user and the server! The downside of this is that when resources do need to change, user’s browsers won’t pick up on those changes until the cache expires which can be upwards of months. To combat this, we can use what is called cache busting.</p>\n<p>There are a <a href="https://css-tricks.com/strategies-for-cache-busting-css/">few techniques</a> to bust cache with the most widely adopted being the technique called <a href="https://survivejs.com/webpack/optimizing/adding-hashes-to-filenames/">asset hashing</a>. The process involves creating a random string of letters and numbers, appending it to the end of all filenames, and in some cases using URL helpers to keep the HTML links up-to-date. By changing the filename each time the resource is updated, the browser is forced to load the new resource instead of refer back to the cached version. Additionally, this method is available with the most popular tools such as <a href="https://medium.com/@okonetchnikov/long-term-caching-of-static-assets-with-webpack-1ecb139adb95#.ycss3zitu">Webpack</a>, <a href="https://middlemanapp.com/advanced/improving-cacheability/">Sprockets</a>, and <a href="https://www.npmjs.com/package/asset_hash">NPM</a> so the process can be set to happen automatically on build – so simple!</p>\n<p>For additional reading on caching and other performance-based topics, check out the immense <a href="https://developers.google.com/speed/pagespeed/insights/">Google’s PageSpeed Insights documentation</a> or walk-through a checklist using <a href="https://gtmetrix.com/">GTMetrix’s Analyzer</a>.</p>',frontmatter:{title:"Busting Cache with Asset Hash",date:"March 27, 2017"}}},pathContext:{path:"/articles/busting-cache-with-asset-hash"}}}});
//# sourceMappingURL=path---articles-busting-cache-with-asset-hash-6babe60901dade920f96.js.map