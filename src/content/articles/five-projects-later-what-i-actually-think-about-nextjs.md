---
title: "Five Projects Later: What I Actually Think About Next.js"
date: 2025-10-18
tags:
  - nextjs
  - react
  - typescript
  - javascript
---

I've shipped five production sites with Next.js now: a band site for CAAMP, a food stylist portfolio for Drew Aichele, tour sites for Sesame Street Live and Cocomelon On Tour, and a tip-tracking PWA called Tip Track. They range from content-heavy marketing pages to a data-driven app with auth and a database. After building across that spectrum, I have opinions.

## The File-Based Router is the Best Part

Every Next.js project starts the same way: I create a file in `app/` (or `pages/` in older projects) and it becomes a route. No router config, no mapping file, no ceremony. A file at `app/shows/page.tsx` serves `/shows`. A file at `app/shows/[city]/page.tsx` serves `/shows/detroit`.

This sounds trivial until you've worked on a project where routing is a 200-line config file that nobody wants to touch. File-based routing makes the URL structure visible in the file tree. New developers can look at the directory and understand the sitemap immediately. On the tour sites — Sesame Street Live and Cocomelon — the route structure was simple but important, and having it mirror the file system meant one less abstraction to maintain.

## Server Components Changed How I Think About Data

The App Router introduced React Server Components, and it took me a couple projects to stop fighting them. The mental model shift: components run on the server by default, can fetch data directly (no `useEffect`, no loading states for initial data), and send rendered HTML to the client. Client-side interactivity is opt-in with `"use client"`.

On the Drew Aichele portfolio, this meant the masonry photo grid loads with images already in the HTML. No layout shift, no skeleton screens, no flash of empty containers. The data fetch happens at build time or request time on the server, and the client gets a fully rendered page.

On Tip Track, where data changes frequently, Server Components still help. The order list page fetches from Prisma on the server and streams the result. Interactive pieces — the order form, chart filters, date pickers — are client components composed into the server-rendered page. The split feels natural once you internalize which parts of a page are static and which respond to user input.

## The Headless CMS Pattern Repeats Well

Three of my five projects — CAAMP, Sesame Street Live, Cocomelon On Tour — use a headless CMS for content. The pattern is nearly identical each time: the CMS provides structured data via API, Next.js fetches it at build time (or with ISR), and the frontend renders it.

What Next.js does well here is `generateStaticParams`. You query the CMS for all entries, return the slugs, and Next.js pre-renders a page for each one. On rebuild or revalidation, new content appears without a full redeploy. For tour sites where show dates change weekly, this is the right trade-off — mostly static, occasionally dynamic.

The CAAMP site was my first time wiring this up. By Cocomelon, it was muscle memory. That repeatability is one of Next.js's real strengths: the patterns transfer cleanly between projects.

## Image Optimization is Underrated

Next.js ships with `next/image`, which handles lazy loading, responsive `srcset` generation, and automatic format conversion (WebP/AVIF). On the Drew Aichele portfolio — a site that's 90% high-resolution food photography — this was huge. Without any manual work, images serve at the right size for each viewport and in a modern format that cuts file size significantly.

On the tour sites, hero images and promotional banners went through the same pipeline. The performance gains are real and require almost no effort beyond swapping `<img>` for `<Image>`.

## The Things That Annoy Me

**Build times scale with content.** The Cocomelon site renders every show as a row in a listing — location, venue, ticket links — all on a single page driven by CMS data. It's manageable now, but on a site with thousands of dynamic pages, build time would creep up. ISR helps, but the initial build still touches everything. For a personal project it's fine. For a large-scale site, I'd think harder about it.

**The caching story is confusing.** Next.js caches aggressively — `fetch` responses, rendered pages, even router state. The defaults have changed between versions, and understanding exactly what's cached and how to invalidate it requires reading docs carefully. I've been bitten by stale data appearing in development because a cached `fetch` didn't revalidate when I expected it to.

**The framework moves fast.** Between my first and fifth project, the recommended patterns changed meaningfully. Pages Router to App Router, `getServerSideProps` to Server Components, `next export` to `output: 'export'`. Each change improved the framework, but it means tutorials from 18 months ago may steer you wrong.

## Would I Use It Again?

Yes, and I probably will for the next project too. The developer experience is strong, the deployment story with Vercel is seamless, and the patterns I've learned transfer directly from project to project. The rough edges — caching confusion, build time scaling, churn — are real but manageable.

For content sites with a headless CMS, it's my default choice. For a data-heavy app, I'd still reach for it, though I'd evaluate alternatives more carefully. Five projects in, Next.js feels like a tool I understand well enough to know both where it shines and where it'll fight me.
