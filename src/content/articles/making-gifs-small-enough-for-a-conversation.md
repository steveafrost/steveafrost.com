---
title: "Making GIFs Small Enough for a Conversation"
date: 2026-08-18
draft: false
image: /river-assets/gif.png
imageAlt: "The illustrated Tiny GIFs project artwork."
---

The first 300-by-300 animated sticker I tested in [Tiny GIFs](https://github.com/steveafrost/tiny-gifs) reached the Messages conversation and took over the transcript. It looked reasonable in the picker. Once sent, it was too big for the compact reaction the app was supposed to deliver.

During July and August, I worked on shrinking the delivered result, preserving its animation, and getting the drawer out of the way after a successful send. Each change needed a check inside Messages. The search screen could only tell me so much.

## Picking the Right Place to Send

The project has three native pieces: a SwiftUI containing app, a Messages extension, and an optional custom keyboard. There's also a React and Vite product site, but the primary interaction belongs inside Messages.

The containing app explains installation and the available sharing paths. The Messages extension supplies a searchable GIPHY drawer. The keyboard offers another route for supported chat apps, using the pasteboard rather than assuming every app has the same integration points.

That distinction matters. A single promise like “GIFs everywhere” would hide several different experiences behind one button. Messages can send an animated sticker directly. Another chat app decides whether it accepts pasted GIFs and how it displays them. The product copy needed to describe those differences as carefully as the code handled them.

## Checking the GIF Inside Messages

I started with simulator checks because the output needed to survive the whole sending path. Rendering a small preview in the picker wouldn't tell me how much space the actual sticker would occupy, or whether its animation would survive delivery.

I tried smaller outputs and checked them in the conversation itself. Those early captures established two separate things: the sticker could take up substantially less space, and it continued animating after delivery. Looking at two frames captured apart was useful evidence that I hadn't accidentally reduced an animation to a still image.

The later build normalized outgoing GIFs to a 192-by-192 animated canvas with a 500 KB limit. Both the Messages and keyboard paths use normalized output. I also changed the renderer's cache generation so an older, larger result couldn't survive a sizing fix simply because it had already been cached.

The earlier simulator screenshots document the smaller renderer tested at that stage; they don't prove the current 192-pixel result. Receiving apps also control final presentation. The source dimensions are something I can enforce. An identical on-screen size across every chat app isn't.

## One Tap Has a Completion Handler

Sending introduced another small-looking detail with a surprisingly visible effect: when should the drawer close?

I changed the flow to keep Messages expanded while browsing and searching. Tapping a GIF renders the animated sticker and sends it immediately. The extension waits for the send completion to succeed before dismissing the drawer. If rendering or sending fails, the drawer stays open with an error.

Closing it as soon as the user taps would make a failed send look successful. Leaving it open after a successful send creates unnecessary friction. The completion callback is the point where those two cases become distinguishable.

This also meant updating the website and onboarding. Earlier wording described adding a GIF to the compose field and then tapping Send. Once the native interaction became one tap, that explanation was wrong. I added checks for stale two-tap wording alongside the implementation checks. Documentation can preserve a bug after the code has moved on.

## Keeping the Keyboard Honest

The optional keyboard has a different set of constraints. GIPHY search, media downloads, and GIF copying require Full Access in this implementation. Ordinary typing, delete, space, return, and switching keyboards still need to work without it.

Bundled reactions provide a fallback, although their checked-in GIF exports are static. The searchable GIPHY results supply the animated library. That fallback keeps a small catalog available without depending on a network request, but it doesn't provide the same animation experience as the GIPHY library.

The release path also checks the containing app and both embedded extensions together. A correctly configured host app doesn't prove that an extension has the settings it needs. Tests cover the fallback catalog, media dimensions and budgets, Full Access decisions, and the Messages sending behavior.

## Where It Stands

Tiny GIFs has a working native implementation and documented simulator evidence for searching, sending, and preserving animation. The remaining release work includes checking the current build on a physical iPhone, verifying both sides of a Messages conversation, and testing the optional keyboard in supported third-party apps. I wouldn't describe it as an App Store launch yet.

The current implementation covers the picker, normalized output, and send-completion behavior. The next check is the same one that exposed the original sizing problem: send a reaction, look at what arrived, and make sure it still animates. This time that check needs to happen on the physical devices people will use.
