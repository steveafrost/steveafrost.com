---
title: "Turning a Next.js App Into a PWA for Delivery Drivers"
date: 2025-11-18
tags:
  - pwa
  - nextjs
  - typescript
  - react
---

My childhood best friend does Shipt deliveries. After every order, he'd save the address in Apple Maps with emoji labels to indicate how well they tipped — green hearts for good tippers, red flags for the stingy ones. It worked, but scrolling through a map full of emoji pins to plan a delivery route is not exactly a scalable system.

I built [Tip Track](https://github.com/steveafrost/tip-track) to replace that workflow. It's a Next.js app where he logs orders, records tips by address, and pulls up reports with charts. The important part for this post: it had to feel like a native app on his phone, work offline when cell service drops mid-delivery, and not require an App Store download. That meant building it as a Progressive Web App.

## What Makes a PWA a PWA

A PWA is a web app that meets a few browser criteria so it can be "installed" to a phone's home screen and behave like a native app. The core requirements are a web app manifest (a JSON file describing the app's name, icons, colors, and display mode) and a service worker (a script that intercepts network requests and can serve cached responses when offline).

In Next.js, you need to provide both. The manifest is straightforward — a `manifest.json` in the `public/` directory:

```json
{
  "name": "Tip Track",
  "short_name": "TipTrack",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#09090b",
  "theme_color": "#09090b",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

`display: "standalone"` is the key property. It tells the browser to hide the URL bar and browser chrome, making the app look and feel native. `theme_color` controls the status bar color on Android and the window frame on desktop.

## The Service Worker Question

The service worker is where things get interesting — and where opinions diverge. You can use a library like Workbox (via `next-pwa`) to auto-generate a service worker that precaches your entire build output, or you can write a minimal one that only caches the shell and fetches everything else from the network.

For Tip Track, I leaned toward the network-first approach. The app's value is in real-time data — recent orders, tip totals, address lookups. Serving stale cached data would be worse than showing a loading state. The service worker caches the app shell (HTML, CSS, JS bundles) so the app launches instantly, but API calls always hit the network first and fall back to cache only when offline.

The practical effect: he opens the app from his home screen, it loads immediately even with a weak signal, and the data is fresh. If he's in a dead zone, he can still see his previously loaded orders — they just won't update until he's back online.

## Install Prompts and the Home Screen

Getting users to actually install a PWA is the awkward part. Browsers show an install banner at their own discretion, and the UX varies wildly between Chrome, Safari, and Firefox. On iOS Safari, there's no automatic prompt at all — users have to know to tap "Share" then "Add to Home Screen."

For Tip Track, I added a simple banner that detects whether the app is already installed (by checking `window.matchMedia('(display-mode: standalone)')`) and shows an install hint if it isn't. On iOS, the hint explains the Share > Add to Home Screen flow. On Android, it triggers the native `beforeinstallprompt` event.

It's not elegant, but once the app is on the home screen, the experience is indistinguishable from a native app. Full screen, custom splash screen on launch, and it appears in the app switcher alongside everything else.

## Auth in a PWA

Tip Track uses [Clerk](https://clerk.com) for authentication. One thing I didn't anticipate: PWAs on iOS run in a separate browser context from Safari. Cookies and session storage are isolated. If a user signs in through Safari and then opens the PWA from the home screen, they'll need to sign in again because the PWA has its own cookie jar.

Clerk handles this gracefully — the sign-in flow works the same in both contexts — but it's worth knowing upfront that PWA auth state and browser auth state are not shared on iOS.

## Was It Worth It Over a Native App?

Absolutely. A native app would have meant maintaining two codebases (or learning React Native), dealing with App Store review, and convincing someone to download yet another app. The PWA is one codebase, deploys instantly on push, and installs in two taps.

The trade-offs are real — no push notifications on iOS (until recently), no background sync, limited access to device APIs. For Tip Track, none of those mattered. The app needs to accept input, store data, and show charts. A PWA does all of that with zero platform gatekeeping.

If you're building a tool for a specific person or small group and it doesn't need deep device integration, a PWA is hard to beat.
