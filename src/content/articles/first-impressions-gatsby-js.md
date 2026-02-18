---
title: "First Impressions: Gatsby.js"
date: 2017-07-23
description: "Although Gatsby.js has been around the static-site generator scene for awhile now but has recently come to age with a v1 launch and explosion of popularity."
tags:
  - gatsby
  - static-site-generators
  - javascript
---

Although Gatsby.js has been around the static-site generator scene for awhile now, but has recently come to age with a [v1 launch](https://www.gatsbyjs.org/blog/gatsby-v1/) and explosion of popularity.

### Structure
My experience early on with Gatsby left me yearning for me as far as structure is concerned. With the v1 launch, the team on the project decided to follow a similar build structure to Gulp & Grunt common setups where there is separation between the source and public/build. 

### How it works
Since each Gatsby project has this separation, it allows us to edit dynamic content & use dev tools in our source folder & have Gatsby transform it into flat, static files that can be served from [GitHub Pages](https://pages.github.com/), [S3](https://aws.amazon.com/s3/), or [Surge](https://surge.sh/) – very similar to other static site generators. One big difference between other popular options like Jekyll, outside of being JS, is that Gatsby loads all pages on initial load to make subsequent loads quicker. This logic is something that I'm still studying and is one trait that made not only Gatsby super popular, but in a zoomed out picture, React as a whole.

### Customization
If you're comfortable in a React or JS environment, you'll be right at home with customization. To set or tweak settings, Gatsby has a `gatsby-config` file that is a simple JSON file. For example, here is mine.

```javascript
module.exports = {
  siteMetadata: {
    title: "Steve Frost – Full Stack Web Developer",
    author: "Steve Frost",
  },
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/src/pages`,
        name: "pages",
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
  ],
}
```

Simple! To add a plugin, we can yarn/npm install and add to our `gatsby-config` file.

### Conclusion
So far, so good. I really like Gatsby because of it's simplicity and also because working with it on personal projects is a great way to complete jobs while also learning more about the most popular emerging JS framework, React. I hope to continue to build this website up from the starter template piece-by-piece so that I understand how Gatsby fundamentally works.
