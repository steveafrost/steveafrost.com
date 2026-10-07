# Astro Starter Kit: Minimal

```sh
npm create astro@latest -- --template minimal
```

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/withastro/astro/tree/latest/examples/minimal)
[![Open with CodeSandbox](https://assets.codesandbox.io/github/button-edit-lime.svg)](https://codesandbox.io/p/sandbox/github/withastro/astro/tree/latest/examples/minimal)
[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/withastro/astro?devcontainer_path=.devcontainer/minimal/devcontainer.json)

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
├── src/
│   └── pages/
│       └── index.astro
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).

## Choose the featured projects

Content is edited in this repository; there is no separate CMS dashboard.
Edit [`src/data/featured-projects.json`](src/data/featured-projects.json) locally or
with GitHub's file editor. Put exactly three project IDs in the JSON array, in
the order you want them shown from left to right. The same selection supplies
the homepage cards and the links at the bottom of personal featurettes.

```json
[
  "kindle-newspaper",
  "tiny-gifs",
  "parcelrouter"
]
```

Available IDs: `kindle-newspaper`, `tiny-gifs`, `parcelrouter`,
`pi-skill-recommender`, `message-relay`, `the-ride-bus-schedule`, `tip-track`.
For example, replace `parcelrouter` with `tip-track` to feature Tip Track third,
or move an ID to change its position. Keep three different IDs; unknown IDs,
duplicates, non-string values, and any count other than three stop the build
with an error naming this file.

Run `npm run build`, then `node --test tests/*.test.mjs` before submitting the
change on a review branch. The site updates when the reviewed change is
published through the existing Git/Vercel workflow. Selection is site-wide,
not a per-device preference. Removing a project from this list keeps its
featurette and URL available. Portfolio story dates do not control placement.
