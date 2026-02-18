---
title: "Rebuilding My Personal Site with Astro"
date: 2025-09-18
tags:
  - astro
  - tailwind
  - javascript
  - performance
---

My personal site has been through a few frameworks. It started on WordPress, moved to Middleman, then to Gatsby. Each migration fixed the problems of the previous one and introduced new ones. Gatsby was fast but the build tooling was heavy, the plugin ecosystem was getting stale, and I was shipping a React runtime to visitors who were reading static blog posts. When I decided to rebuild again, I wanted something that sent zero JavaScript by default and got out of my way.

Astro does exactly that.

## Why Astro

Astro is a static site generator that renders everything to HTML at build time and ships no client-side JavaScript unless you explicitly ask for it. Components are `.astro` files — a blend of frontmatter (server-side JS/TS) and an HTML template. It looks like this:

```astro
---
const greeting = 'Hello';
---
<h1>{greeting}</h1>
```

The frontmatter runs at build time. The template becomes static HTML. No hydration, no virtual DOM, no framework runtime sent to the browser. If you need interactivity, you can add React, Vue, Svelte, or vanilla JS components and tell Astro when to hydrate them (`client:load`, `client:visible`, etc.). My site doesn't need any of that — it's articles, projects, and a homepage — so every page is pure HTML and CSS.

## Content Collections

The feature that sold me was content collections. Astro lets you define a `src/content/` directory with typed schemas for your content. My articles collection looks like this:

```typescript
const articles = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
    description: z.string().optional(),
    draft: z.boolean().optional(),
    tags: z.array(z.string()).optional(),
  }),
});
```

Every markdown file in `src/content/articles/` is validated against that schema at build time. If I forget the `title` or put a string where a date should be, the build fails with a clear error. Coming from Gatsby, where frontmatter was loosely typed and errors surfaced as blank pages, this was a major improvement.

Querying content is just as clean. To get all published articles sorted by date:

```astro
---
import { getCollection } from 'astro:content';

const articles = (await getCollection('articles'))
  .filter(a => !a.data.draft)
  .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
---
```

No GraphQL layer. No source plugins. No build-time data graph. Just a function call that returns typed objects.

## Performance by Default

Migrating from Gatsby to Astro, my Lighthouse performance score went to 100 without any optimization work. That's not because I'm good at performance — it's because Astro's defaults are aggressive. It inlines all stylesheets (configured with `inlineStylesheets: 'always'`), outputs static HTML with no JS payload, and generates optimized images through its built-in `<Image>` component.

The site loads in a single request for the HTML plus whatever images are visible. There's no JavaScript bundle to parse, no hydration step, no client-side routing taking over. Pages feel instant because they *are* instant — there's nothing to execute.

I also enabled Astro's prefetching, which preloads links as they enter the viewport:

```javascript
prefetch: {
  prefetchAll: true,
  defaultStrategy: 'viewport',
}
```

The result is that clicking any link on the site feels like navigating a local app. The HTML is already in the browser cache by the time you click.

## Migrating 41 Blog Posts

I had 41 markdown blog posts from the Gatsby era. The migration was surprisingly smooth: copy the markdown files into `src/content/articles/`, adjust the frontmatter to match the Zod schema, and fix a few date format inconsistencies. No content rewriting, no plugin conversions, no data layer rewiring.

The only Gatsby-specific things I had to remove were GraphQL queries embedded in the markdown templates and a few `gatsby-image` references. Everything else — the prose, code blocks, links — transferred unchanged.

## Tailwind Integration

Astro has a first-party Tailwind integration. One command — `npx astro add tailwind` — installs the package, creates the config, and wires up the PostCSS pipeline. I added the typography plugin for article rendering and was done.

The combination of Astro's zero-JS output and Tailwind's utility classes means the entire site is HTML with a single inlined stylesheet. No external CSS requests, no runtime style injection, no flash of unstyled content.

## What I'd Tell Someone Considering Astro

If your site is primarily content — blog posts, marketing pages, documentation, portfolios — Astro is the best tool I've used. It's fast to build with, fast to build (sub-2-second builds for my 50+ page site), and fast for visitors.

If you need heavy client-side interactivity, Astro can handle it through its island architecture, but at that point you're layering a framework on top and losing some of the simplicity. For a full app with auth, real-time data, and complex state, I'd still reach for Next.js.

For a personal site that's mostly words and images? Astro is perfect.
