---
title: "Adding Custom Styles to Gatsby.js"
date: 2017-08-06
description: "Maybe it's been the long week, or exhausted, but I spent much too long trying to find out how to add custom styles to my blog today. I'm familiar with how to do it in a basic website setup - whether that's WordPress, Jekyll, or Middleman – but with Gatsby, everything is a React component. In retrospect, I was definitely over thinking it so I've made this blog post to help out with people trying to do the same thing who are possibly over thinking it as well."
tags:
  - gatsby
  - static-site-generators
  - javascript
---

Maybe it's been the long week, or exhausted, but I spent much too long trying to find out how to add custom styles to my blog today. I'm familiar with how to do it in a basic website setup - whether that's WordPress, Jekyll, or Middleman – but with Gatsby, everything is a React component. In retrospect, I was definitely over thinking it so I've made this blog post to help out with people trying to do the same thing who are possibly over thinking it as well.

In a typical setup, stylesheets are linked in the head of the page by a simple `<link rel="stylesheet" type="text/css" href="mystyle.css">` and then the rules in mystyle.css are applied to that page. That is pretty basic knowledge. Since I am new to Gatsby, and therefore React, I kept trying to include my stylesheet like this in my components. While that will work if the stylesheet is a static asset in the ./static folder, React & Gatsby has support for importing stylesheets directly into components.

```javascript
import customCSS from "./css/custom.css"
```

Now our customCSS file will be available by that variable name and Webpack will notice we need it throughout our component and therefore apply the Webpack magic to it. Essentially, the magic is minifying, optimizing, and automatically bundling it to create a cumulative styles.css (or whatever you decide to name it) file.

This pattern comes from the module pattern made popular by CommonJS & NodeJS. I haven't decided how I like it so far as I'm so familiar with including it with the classic `link rel` HTML tag. The Webpack benefits seem to be well worth it so I'll continue down this road for now and I hope to write more about React, Gatsby, and Webpack as I learn more.
