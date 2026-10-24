---
title: "Knight School Chess: A Chess App for My Kids' Chess Club"
date: 2026-10-23
description: "I built a chess app for my kids and their school chess club. It's iPad only, it works offline, and it went live on the App Store today."
draft: false
tags:
  - chess
  - ipad
  - swiftui
  - kids
  - project
  - launch
---

Knight School Chess is live on the App Store as of today. It is an iPad app for kids learning chess: lessons, puzzles, drills, and games against a coach that does not play like a grandmaster trying to humiliate a seven-year-old.

I did not set out to ship an app. I set out to stop answering the same questions.

## The Actual Reason

I play chess with my kids. Not well — well enough that they can beat me now, which was the point. When the school chess club started up, the parents' group chat filled with the usual: which app should we use, is this one okay, why does it want an account, why is there a chest of gems in the corner.

I tried the apps that came up. They all did roughly the same thing, and the same thing was not what we needed. So I had two options: keep recommending apps I did not like, or build the one my family actually wanted.

I did the second thing. It took longer than the first thing.

## What Was Wrong With the Existing Options

None of these are broken products. They work. They are also built around a business model that pulls against what a beginner needs.

**Ads.** A kid is halfway through a puzzle about knight forks and a thirty-second video for a mobile game interrupts. When the puzzle comes back, the kid has forgotten the position. At that age the interruption is not a minor annoyance — it is the end of the session.

**Accounts.** A seven-year-old does not need a login. A parent does not want one. Nobody wants a social chess feature for elementary schoolers, which means no chat, no friend requests, no strangers. Every app I looked at had some version of that surface area, even when it was off by default.

**Subscriptions.** Chess apps are cheap to run as content libraries, and a subscription is reasonable for an adult who practices daily. For a family with three kids who each play twice a week, it is a recurring bill for a hobby that might not stick.

I wanted the opposite of all three. Not as a marketing position — as a design constraint I could check my own work against.

## The Constraints I Picked

I wrote these down before writing code, then used them to say no to features.

**Offline by default.** Everything runs from data bundled with the app. Only purchasing and restoring need a connection. This matters more than it sounds: the app gets used in the car, on a plane, in a waiting room with bad wifi, and at a school where the iPad is on a filtered network that blocks whatever it feels like blocking that week.

**No accounts.** No email, no login, no password to forget. There is a nickname and an avatar so a kid knows whose progress they are looking at, and neither leaves the iPad. Settings, progress, recent games, and the game in progress all stay on the device.

**No ads, no analytics, no tracking.** Nothing to configure, nothing to opt out of.

**No subscription.** Free forever for the beginner material, one optional US$4.99 unlock for everything else. If I abandon this tomorrow, the app keeps working.

**A grown-up check** on purchases, settings, backups, and sharing. Buying things by accident is a design problem, not a discipline problem.

That is the whole pitch. It is not a feature list, it is a list of things I refused to add.

## What Actually Shipped

The content is bigger than I expected when I started, which says more about my estimate than about the app:

- **21 lessons**, each with a matching quiz
- **36 puzzles** across 8 packs
- **10 coach bots**, with Gentle, Clever, and Coach difficulty levels on the coach bots
- **8 drills**
- **11 opening lines**
- **14 endgame challenges**
- **10 board coordinates exercises**
- **Same-device two-player mode**, which my kids use far more than I predicted

Free forever: the first 4 lessons of the Starter Path and their quizzes, the Gentle bot and a bot named Pip, two-player mode, and local progress and quests. The $4.99 Full School purchase is a one-time non-consumable purchase, not a subscription, and it restores on other iPads through the same Apple Account. It unlocks the remaining lessons, all 36 puzzles, the drills, the 11 opening lines, the 14 endgame challenges, the advanced coaches, and the Analyze, Club, and Adventure sections.

It is iPad-only, iPadOS 17.0 or later, rated 4+. I know phone support is the expected ask. The board is the entire interface, and a board a kid can actually read and tap needs the width. A phone version would need a different design, not a smaller one.

## The Parts That Took the Most Time

The chess coaching was the interesting part. The rest was just work.

Getting a bot to be *gentle* is harder than making it strong. A strong engine gives you the best move, and a beginner loses in twelve moves without understanding why. The Gentle level plays a real game, punishes nothing obvious, and quietly does not take the piece you left hanging — which is a set of deliberate decisions, not a depth setting. Making the three levels feel genuinely different to a seven-year-old took more iteration than anything else in the app.

The other thing was progress. Not storing it — storing it is easy — but deciding what to store. A kid wants to see that they finished something. Quests and the lesson path exist because my early testers (my children, uncompensated, brutally honest) kept asking "what do I do next" when the answer was visible on screen. That is a UI failure, not a user failure.

## What Is Not In It

No online play. No chat, no matchmaking, no strangers — which also means no leaderboards.

No account sync between devices beyond the App Store's own purchase restore. Progress lives on one iPad. If you have three kids and one iPad they can share it, but there is no per-kid profile system that syncs anywhere else.

No Android, no iPhone, no Mac app.

No engine analysis for advanced players. Analyze exists in Full School and it is built for "why did my move fail" at a beginner level, not for someone rated 1600 looking for a second opinion.

And no ratings. It went live today, so I genuinely do not know whether this works for other families. There is no invented social proof in the App Store listing and there will not be.

## What Is Next

I will watch how it gets used before adding anything. The candidates, roughly in order: better separation between kids sharing one iPad, more endgame challenges since those went fastest in testing, and a way to review a game a kid lost without making it feel like homework.

The App Store link is [here](https://apps.apple.com/us/app/knight-school-chess/id6782358551). There is a page with more detail at [steveafrost.com/knight-school](https://steveafrost.com/knight-school), and hello@steveafrost.com reaches me if something is wrong.

It is a small app built for a small audience — my kids, their club, and whoever else has an iPad and a kid who keeps asking to play. That turned out to be enough of a reason to finish it.
