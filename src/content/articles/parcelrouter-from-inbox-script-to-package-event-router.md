---
title: "ParcelRouter: From Inbox Script to Package Event Router"
date: 2026-05-21
draft: false
---

Shipping emails already contain the information a package tracker needs. The tracking number is there, usually somewhere between an order summary, a promotional banner, and a button asking you to keep shopping. Getting that information into another app is the repetitive part.

I started ParcelRouter with a narrow job: read shipping emails from iCloud Mail and send tracking numbers to [Parcel](https://parcel.app/). The core came together in March. This month, I built on that core with a review step for uncertain matches, optional integrations, and a clearer setup process. The local database could support a workflow of its own, even with Parcel sync turned off.

That left a practical question: what should happen between finding something that looks like a tracking number and letting it trigger something else?

## Keeping the Core Local

The service is written in TypeScript. An IMAP client polls the inbox and Archive folder, a parser extracts tracking information, and SQLite stores package metadata and polling state. Express serves the dashboard and REST API. Docker Compose handles the self-hosted setup.

SQLite keeps this part straightforward: there's no separate database service to configure, and the dashboard reads from the same local records the API exposes.

The important change in May was making Parcel sync optional. Leaving the API key blank now means packages stay local. Someone can use the dashboard without also needing a Parcel account, then enable an integration if it fits their setup.

There's a limit to what “local-first” means here. The service connects to a mailbox, and enabling Parcel or a webhook sends information to that destination. The local database gives the application a useful starting point without requiring those additional connections.

## Giving Uncertain Matches Somewhere to Go

Email is a messy input format. An order number can resemble a tracking number, and a long numeric string doesn't announce which role it plays. Carrier patterns help, but a regex match alone is a weak reason to create a delivery.

The project already had confidence scoring. In May, I added a review queue around it. High-confidence detections can become packages directly. Medium- and low-confidence detections wait for approval before becoming deliveries or entering the normal sync flow.

The dashboard lets you approve or ignore those candidates. That gives the parser somewhere to put uncertainty without treating every match as a fact.

The timing matters. A warning attached to an already-created package asks you to clean up afterward. A review queue puts the decision before the downstream action. It adds a manual step for uncertain matches, but keeps a questionable number from automatically becoming someone else's problem.

## Making Events Useful Outside Parcel

Once packages exist locally, Parcel can be one destination among several. I added webhook events for package creation and deletion, review actions, and Parcel sync outcomes.

An endpoint can receive a JSON event with a name, timestamp, and data. That provides a connection point for something like Home Assistant, n8n, or a small service of your own, without building each integration into ParcelRouter.

Webhook signing is optional: configuring a secret adds a SHA-256 HMAC signature to the request. The receiving service can use that signature to verify the payload. Requests also have a timeout so an unresponsive endpoint doesn't wait indefinitely.

These are package-management events, though. Finding a shipping email and emitting `package.created` doesn't establish that a box has arrived on the doorstep. Keeping those meanings distinct matters when another automation is listening.

## Setup and Tests Count Too

The May work also included setup checks, a guided installer, and a static marketing page. The installer handles configuration, while the static page explains the workflow without making someone read through the repository first.

The setup check looks for missing configuration, invalid settings, and a writable data directory. It also distinguishes required mailbox configuration from optional Parcel and webhook settings. An intentionally empty integration field shouldn't look like a broken installation.

I added Playwright coverage for both the marketing site and dashboard. The dashboard tests exercise approve, ignore, and delete actions, along with API persistence against an isolated test database. The marketing checks cover navigation, assets, and mobile overflow. That covers what happens after a click, including whether the change reaches the database.

## The Result

The result is a service that can read shipping emails, hold uncertain matches for review, and keep the resulting packages in a local database. Parcel sync and webhooks are optional outputs. If you already have somewhere useful to send those events, the router gives you a way to connect it without replacing the rest of your setup.

The [source and setup instructions are on GitHub](https://github.com/steveafrost/parcelrouter).
