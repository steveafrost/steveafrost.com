---
title: "Building a Nightly Newspaper for My Kindle"
date: 2026-09-30
draft: false
image: /river-assets/kindle.png
imageAlt: "An illustrated Kindle, newspaper, and coffee overlooking a wooded landscape."
---

A nightly newspaper needs a stopping point. RSS feeds keep producing articles, and putting all of them into an EPUB would just move the backlog onto a Kindle.

In August, I built Steve's Evening Edition around a smaller target: ten to eighteen articles, with a reading budget of about 9,000 words. It collects stories from curated feeds, filters and ranks them, builds an EPUB, and hands it to a delivery service.

Choosing the articles was one part of the work. Moving the resulting file through a scheduled cloud job, and later toward KOReader, introduced a separate set of constraints.

## Giving the Edition Some Rules

The selection pipeline starts with ordinary rules. Fetch the configured feeds, filter low-value items, remove duplicates, and rank the remaining candidates. The configuration includes a freshness window, section minimums and maximums, a minimum amount of extracted text, and the overall reading budget.

I also keep a used-article ledger. A story shouldn't become new again just because another scheduled run encounters it. Source diversity and section quotas help keep one busy feed from filling the entire newspaper.

Signed thumbs-up and thumbs-down links in the EPUB collect reader feedback for later rankings. Those signals influence related sources and sections with confidence weighting. A single rating shouldn't immediately rewrite the editorial rules.

These constraints make the output inspectable. If an edition is too long, too repetitive, or too concentrated in one section, there are specific settings and selection decisions to examine.

## A Narrow Job for the LLM

I gave the LLM a specific job: rerank the strongest candidates for quality and relevance. The ordinary selection rules supply those candidates and keep control of the hard limits.

The reranker receives article metadata and returns structured scores for quality, relevance, and novelty. It doesn't get to invent articles or decide that the reading budget no longer applies. If the provider fails, the system falls back to deterministic ranking so the edition can still be built.

The fallback means a provider error doesn't have to cancel that night's edition. It also leaves distinct steps to inspect when the selection is poor: feed selection, extraction, duplicate removal, ranking, and the model's reranking.

## Moving the Nightly Job Off the Mac

The first build landed in mid-August. I then moved the nightly pipeline to a Python function on Vercel, with Neon Postgres holding article history, delivery records, cache data, and feedback. AgentMail handles the email handoff. That migration replaced the local launchd scheduler and LAN-only feedback runtime.

Scheduling brought its own detail. The intended run is 9:15 p.m. Eastern, which corresponds to different UTC times across daylight saving changes. Two cron routes cover the offsets, and the handler checks the intended local hour before generating an edition.

EPUB presentation needed iteration too. Adding a dated cover wasn't enough; the cover had to use a raster image in the reading order to behave as intended on Kindle. Feedback responses were also adjusted to avoid unnecessary navigation. Neither fix changes which stories get selected, but both affect what happens when someone opens the book and uses it.

## Getting a Large EPUB Across a Small Request

In September, I added a private publication path for KOReader. An edition could exceed the function platform's request or response body limit, so serving every EPUB through one function response wasn't a sound assumption.

The implementation splits uploads and downloads into chunks of at most one MiB. Each chunk has a size and SHA-256 hash, and the full EPUB has its own size and hash. The reader verifies both before making the assembled file available.

Partial uploads remain invisible. Retrying an identical upload is safe; replacing an existing edition with different bytes is rejected. A retry therefore needs the original EPUB, because rebuilding the same stories can produce a different file.

I used PostgreSQL for the chunks rather than adding another storage service. That simplified the infrastructure, but it also left a clear maintenance tradeoff: storage grows without a retention or abandoned-upload cleanup policy.

## Downloaded, Transferred, and Read

The next piece was a Calibre plugin that can transfer personal editions to KOReader over the local network. It maintains its own delivery ledger and waits for the book to appear in the device listing before acknowledging delivery. Automatic fetching retrieves the latest edition of each publication without backfilling the whole archive.

By the late-September verification, the host could fetch the latest editions, verify their hashes, and import them into Calibre. Repeating the fetch produced no new downloads. The actual paired Kindle wasn't connected during that verification, so confirmed wireless delivery and opening both publications on the device remained outstanding.

The cloud generator and the local fetching path are implemented, and the host-side checks passed. The wireless path still needs the paired-device check. Its ledger is designed to wait for that device acknowledgement before marking an edition delivered, which makes the remaining work visible rather than hiding it behind a successful download.
