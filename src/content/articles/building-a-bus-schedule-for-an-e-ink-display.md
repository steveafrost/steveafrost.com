---
title: "Building a Bus Schedule for an E-Ink Display"
date: 2025-12-18
tags:
  - trmnl
  - liquid
  - api
  - hardware
---

I bought a [TRMNL](https://usetrmnl.com) — a small e-ink display that cycles through widgets. Weather, calendar, stocks, that sort of thing. It also lets you build custom "recipes" using Liquid templates and API data. I live near a bus stop on TheRide system in Ann Arbor, and I wanted to glance at a screen and know when the next bus is coming without pulling out my phone.

The result is a [Liquid template](https://github.com/steveafrost/the-ride-bus-schedule-trmnl) that fetches real-time departure data from TheRide's API and renders the next three buses on the e-ink screen. Route number, direction, and departure time — nothing else.

## How TRMNL Recipes Work

TRMNL recipes are Liquid templates. You point the device at a JSON API endpoint, and the response data becomes available as variables inside your template. The device fetches the data on a schedule, renders the Liquid to HTML, and pushes the result to the e-ink screen.

The constraint is the display itself. E-ink has no color (on this model), no animation, and refreshes slowly. You design for glanceability — big text, high contrast, zero clutter. It forces you to strip a UI down to exactly the information that matters.

## Parsing TheRide's Data

TheRide exposes departure data through a GTFS-compatible API. The response includes stops, and each stop has an array of departures with trip details. The fields I care about are the route ID, the direction, and the departure time.

The wrinkle is direction. Route 27, for example, runs two ways — one toward Meijer, one toward the Transit Center. The API represents this as `direction_id`: 0 or 1. I needed to map that to human-readable labels:

```liquid
{% assign routeId = trip.route.route_id %}
{% assign routeDirection = trip.direction_id %}

{% if routeId == "27" and routeDirection == 0 %}
  {% assign is27Meijer = true %}
{% elsif routeId == "27" and routeDirection == 1 %}
  {% assign is27TransitCenter = true %}
{% endif %}
```

This kind of conditional logic in Liquid is verbose but readable. Each departure gets a colored badge (styled with inline CSS since TRMNL renders in a constrained HTML environment), a route label, a destination, and a formatted time:

```liquid
{% for departure in stops[0].departures | limit: 3 %}
  <span class="label label--inverted">Route {{ routeId }}</span>
  <span class="departure-time">
    {{ departure.departure_time | date: "%l:%M %P" }}
  </span>
{% endfor %}
```

The `limit: 3` filter is key. Three departures is all that fits on the 800x480 e-ink screen without shrinking the text below comfortable reading distance.

## Designing for E-Ink

The TRMNL screen has a warm paper-like background — not pure white, more like `#e8e4d9`. I styled the template to match that aesthetic: bold route numbers in large colored squares, departure times in 32px font weight, and a minimal footer showing the stop name and last update time.

There's no JavaScript. No interactivity. The display refreshes on a timer, and whatever HTML the Liquid produces is what you see until the next refresh. This constraint is oddly freeing — you can't overthink the UX when there's literally one state.

The timestamp at the bottom uses TRMNL's built-in UTC offset to show local time:

```liquid
Updated at {{ "now" | date: "%s" | plus: trmnl.user.utc_offset | date: "%l:%M" }}
```

## What I Like About This Setup

The TRMNL is mounted in the kitchen, which is convenient because it's the last thing I see on my way out the door. A quick glance — "Route 27 -> Meijer at 3:42 pm" — and I know whether I need to leave now or have time to finish what I'm doing. No phone, no app, no notifications.

E-ink displays are a good match for information that changes slowly and needs to be visible passively. Transit schedules, weather, calendar agendas — anything where "check once in a while" beats "push a notification." TRMNL's recipe system makes it straightforward to build these, and Liquid is just constrained enough to keep the templates simple.

The [full recipe is on GitHub](https://github.com/steveafrost/the-ride-bus-schedule-trmnl) if you want to adapt it for your own transit system.
