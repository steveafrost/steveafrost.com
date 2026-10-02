---
title: "Turning repeated agent workflows into skills worth keeping"
date: 2026-06-20
draft: false
---

## Spotting the work worth saving

Writing a skill is fairly straightforward once you know what it should do. Deciding which work deserves one is harder. A coding agent might follow much the same process across several sessions, with slightly different requests and a different repository each time.

That looks like something worth saving. But a single successful run gives you little to go on, and similar requests can hide different tasks. Before turning a pattern into instructions, it helps to have some evidence that the pattern is real.

In June, I built the first version of [pi-skill-recommender](https://github.com/steveafrost/pi-skill-recommender). It watches for recurring work across Pi sessions and gathers candidates for review. From there, I can explicitly generate a draft skill, inspect it, and decide whether to keep it.

## Start with a simple matching rule

I connected the extension to Pi's input and agent-end hooks to collect lightweight observations. It skips slash commands and extension-generated input, so operating the recommender doesn't become a workflow recommendation of its own.

Each observation includes a normalized prompt capped at 400 characters, keywords, repository and path context, the ordered names of tools used, and an outcome. The state stays in local JSON files. Those files still need care. A shortened prompt can contain private information; the 400-character limit doesn't remove it.

For the first version, I used deterministic matching rather than an LLM. Similarity combines keyword overlap, tool overlap, and repository or path overlap, weighted at 50%, 30%, and 20%. The overlap calculation uses Jaccard similarity: how much the two sets share relative to everything in them.

An observation needs a score of at least 0.55 and at least one overlapping tool to match. The advantage is that the rule is easy to inspect. If two unrelated tasks end up together, there's a specific score to investigate. The trade-off is that word and tool overlap only tell you so much.

## Keep generation deliberate

Matching observations is only the first filter. A candidate needs at least three observations across two sessions before it qualifies for generation. It also needs at least two consistent tools, each appearing in 60% or more of its observations.

That cross-session requirement matters. Repeating something three times while debugging one problem is different from coming back to the same kind of work on separate occasions. The tool requirement adds another check beyond similar wording.

I added commands to check the current state, list candidates, and generate a template-based SKILL.md from a chosen candidate. There are also commands to ignore a suggestion or snooze it for later, with a default of 14 days. A separate promote command copies the draft into the maintained global skill root.

Generation requires an explicit command. Duplicate checks help avoid producing the same skill repeatedly, and a matching pattern alone doesn't cause the extension to write new instructions.

## The parts that still need checking

Tool names are useful evidence, but they don't explain what happened. Two tasks can both read files and run shell commands while having very different purposes. Likewise, similar prompts can refer to different problems. The extension records tool names in order, but the overlap score doesn't establish whether that order was useful.

A recurring workflow can also be a recurring mistake. An outcome record cannot establish that the result was correct or that its steps belong in a reusable skill. That judgment still belongs in review.

The generated file needs editing. Before keeping it, I need to check when the skill should run, replace vague steps with useful instructions, remove incidental details, and make the verification step explicit. Repetition gets the workflow onto the review list. It still has to survive the review.

There's also a discovery detail that's easy to miss: generated drafts already sit beneath Pi's default global skill root. Running /reload after generation can make them available in the current session. That means I need to review a draft before reloading it. Leaving it unpromoted won't keep it out of discovery.

## What the first version does

The implementation keeps up to 2,000 observations and uses a lock plus atomic file replacement for state updates. That keeps the stored history bounded and gives state updates a predictable write path. Even a small extension needs to avoid making a mess of its own files.

Version 0.1.0 implements the basic process: collect observations, group recurring work, and let me choose which candidates get a draft. Ignore and snooze give the suggestions somewhere to go when the answer is “no” or “later.”

The remaining work is in the skill itself. The recommender can point to repetition and produce a starting file. I still need to turn that into clear instructions and check them against real work before calling the skill useful.
