---
title: "Five Projects Later: What I Actually Think About Tailwind CSS"
date: 2025-08-18
tags:
  - tailwind
  - css
  - design
  - frontend
---

I've used Tailwind CSS on five production sites now — a food stylist portfolio, two children's entertainment tour sites, a delivery driver tip tracker, and my personal site. Before Tailwind, I wrote BEM-style CSS, maintained component stylesheets, and occasionally fought specificity wars. After five projects, I don't want to go back.

That said, it took me about a project and a half to stop hating it.

## The Ugly Phase

The first time you see a Tailwind component, it looks like someone dumped a thesaurus into the class attribute:

```html
<div class="flex items-center gap-4 rounded-xl border border-zinc-700/50 bg-zinc-900/50 p-4 backdrop-blur transition-all hover:scale-105 hover:border-coral-400/30">
```

My instinct was to extract this into a CSS class immediately. That instinct is wrong — or at least premature. The utility classes are the abstraction. Extracting them into a named class just adds a layer of indirection without reducing complexity.

It took a couple of projects before I internalized this. After that, I was writing utility classes without thinking about it, the way you stop thinking about individual keystrokes when you can touch-type.

## What Clicked

The moment Tailwind won me over was responsive design. Instead of writing media queries in a separate block and mentally mapping them back to the element, the breakpoint is right there on the element:

```html
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
```

One line. Three layouts. No context switching. On the Cocomelon tour site, the show listings grid needed to work across phone, tablet, and desktop. With traditional CSS, that's a component class plus two or three media query blocks. With Tailwind, the responsive behavior is declared inline and immediately visible.

The same applies to hover states, focus states, and dark mode. Everything that would normally scatter across multiple CSS rule blocks collapses into a single element declaration. It's more characters, but fewer places to look.

## Custom Design Tokens

Every project starts with `tailwind.config.ts`. I define the project's colors, fonts, and any custom spacing or animation values upfront. For the Cocomelon site, that meant matching their brand palette exactly. For my personal site, it meant defining a `coral` color scale for the accent gradient.

```typescript
theme: {
  extend: {
    colors: {
      coral: {
        300: '#fca5a5',
        400: '#f87171',
        500: '#ef4444',
      }
    }
  }
}
```

Once the tokens are in the config, they're available everywhere as utilities: `bg-coral-400`, `text-coral-500`, `from-coral-400`. Changing the brand color later means editing one file, not searching through stylesheets.

## Composition Over Abstraction

The Tailwind approach leans heavily on composition. Instead of creating a `.card` class and a `.card--featured` modifier, you compose utilities directly in the markup. If two cards share most of their styles, you extract the shared markup into a component (React, Astro, whatever), not a shared CSS class.

On Tip Track, the order cards, report panels, and form sections all share a similar container style. Rather than a `.panel` utility class, there's an Astro/React component that applies the consistent padding, border radius, and background. The styles live with the markup they apply to, and the component is the reuse mechanism.

This aligns well with component-driven frameworks. If you're already breaking your UI into components, Tailwind's utility-first approach means each component is self-contained — no external stylesheet to coordinate with, no class name collisions, no specificity leaks.

## The `@apply` Escape Hatch

Tailwind provides `@apply` for extracting utility patterns into CSS classes. I used it sparingly — mostly for base typography styles in the Astro site's article layout, where Tailwind's typography plugin handles the heavy lifting:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

The typography plugin styles all the prose elements (headings, paragraphs, code blocks, lists) inside an `prose` container class. It saved me from manually styling every markdown element across 41 blog posts.

Beyond the typography plugin, I've rarely reached for `@apply`. If I'm tempted to extract a class, it usually means I should extract a component instead.

## What I Still Don't Love

**Long class strings are hard to scan visually.** Tooling helps — Tailwind's VS Code extension sorts classes and provides autocomplete — but a 15-utility class attribute is still harder to parse at a glance than a semantic class name like `.show-card`. I've accepted this trade-off, but I understand why it bothers people.

**Tailwind is a dependency.** My CSS is now inseparable from Tailwind's utility framework. If the project died or made a breaking change, migration would be painful. The same is true of any framework, but CSS feels like it should be more portable. In practice, Tailwind has been stable and well-maintained, so this is more a philosophical concern than a practical one.

## The Verdict

Five projects in, Tailwind is part of my default stack. The speed of development is real — I style new components without leaving the markup, and the result is consistent because the design tokens constrain my choices in a good way. The learning curve is a few days of discomfort followed by a permanent productivity gain.

If you've tried Tailwind and bounced off it, give it one more full project. The muscle memory takes a little while to develop, but once it does, writing CSS the old way feels like driving stick after getting used to automatic.
