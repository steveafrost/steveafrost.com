# AGENTS.md

Personal portfolio site for Steve Frost. Astro 5, Tailwind CSS 3, TypeScript strict mode, deployed on Vercel.

## Commands

```bash
npm run dev      # dev server at localhost:4321
npm run build    # production build to dist/
npm run preview  # preview production build locally
```

## Project Structure

```
src/
├── components/       # Astro components (Bio, Logo, MockBanner)
├── content/
│   ├── config.ts     # Content collection schema
│   └── articles/     # 56+ Markdown article files
├── layouts/
│   └── MainLayout.astro  # Single shared layout
├── pages/
│   ├── index.astro
│   ├── about.astro
│   ├── articles.astro
│   ├── projects.astro
│   ├── articles/[...slug].astro   # Dynamic article routes
│   └── projects/mock/*.astro      # Per-project mock pages
└── styles/
    └── global.css    # Tailwind directives + custom utilities + font-faces
public/
├── fonts/            # Self-hosted Inter + JetBrains Mono woff2
└── img/              # Profile pic, project mocks
```

## Stack

- **Astro 5** — file-based routing, View Transitions (`ClientRouter`), prefetch all on viewport
- **TypeScript** — extends `astro/tsconfigs/strict`; no `any`, explicit return types
- **Tailwind CSS 3** — custom `coral` and `ctp` (Catppuccin Mocha) color palettes; `@tailwindcss/typography` for article prose
- **MDX** — articles support MDX via `@astrojs/mdx`
- **Sitemap + RSS** — `@astrojs/sitemap`, `@astrojs/rss` integrations configured
- **Vercel** — static output, `build.inlineStylesheets: 'always'`

## Content Collections

Articles use a single `articles` collection defined in `src/content/config.ts`:

```ts
schema: z.object({
  title: z.string(),
  date: z.date(),
  description: z.string().optional(),
  draft: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
})
```

New article files go in `src/content/articles/` as `.md` or `.mdx`.

## Layout Contract

`MainLayout.astro` accepts three optional props:

```ts
interface Props {
  title?: string;       // defaults to 'Steve Frost - Software Engineer'
  description?: string; // defaults to bio tagline
  ogImage?: string;
}
```

All pages wrap content in `<MainLayout>`. It renders sticky desktop nav, fixed mobile bottom nav, and footer.

## Projects

Projects are a **hardcoded array** in `src/pages/projects.astro`—not a content collection. Each project mock page lives at `src/pages/projects/mock/<name>.astro` and uses `MockBanner` to link back to `/projects`.

## Conventions

- Pure `.astro` components—no React/Vue/Svelte
- No default exports (Astro components export implicitly)
- Tailwind for all styling; no CSS modules or styled-components
- Custom CSS utilities defined in `src/styles/global.css` (`.mask-blob`, `.text-gradient`, `.bg-mesh`, `.card-glow`)
- Fonts self-hosted from `public/fonts/`—do not add Google Fonts or external font CDN calls
- `draft: true` in frontmatter hides articles from listings
