<h1 align="center">HomeStem</h1>
<p align="center">Tested home &amp; garden buying guides and how-tos — indoor plants, balconies, small-space organization, and the yard.</p>
<p align="center"><a href="https://homeandstem.com">homeandstem.com</a></p>

## About

HomeStem is an English-language affiliate content site in the Home & Garden niche, monetized via the Amazon Associates program. Traffic flow is **Pinterest → Blog → Amazon**: articles are written to rank on Pinterest and search, and recommend specific products via tracked Amazon links.

The site is a statically generated [Astro](https://astro.build) build with content authored in MDX and product data in YAML, deployed to Netlify and Cloudflare Workers.

## Stack

- **Astro 6** (static site generation)
- **React** for interactive islands
- **Tailwind CSS v4**
- **MDX** for article bodies, auto-imported HomeStem components
- Content collections: `articles` (MDX) and `products` (YAML)

## Getting started

Requires [Node.js](https://nodejs.org/en/download/) (LTS recommended) and Yarn.

```sh
yarn install
yarn dev
```

This starts a local dev server and live-reloads on changes to source files.

### Other scripts

```sh
yarn build      # production build
yarn preview    # preview the production build locally
yarn check      # astro check (type checking)
yarn format     # prettier -w .
```

## Deployment

- **Netlify** — configured via `netlify.toml`
- **Cloudflare Workers** — `wrangler.jsonc`, deploy with `yarn deploy:cf-workers`

## Content

- Articles live in `src/content/articles/` (MDX, one of four fixed article types — buying guide, comparison, how-to, or listicle — per `docs/homestem-code-spec.md`).
- Products referenced by articles (sidebar picks, comparison tables) live in `src/content/products/` (one YAML file per product).
- Affiliate link rules (tag param, `rel`/`target`, disclosure requirements, dataLayer tracking) are centralized in `src/lib/utils/affiliate.ts` and `AffiliateLink.astro` — see `CLAUDE.md` for the full list.

## Docs

Project-specific specs and conventions live in `docs/`:

- `docs/homestem-code-spec.md` — content schema, article-type templates, component conventions
- `docs/homestem-design-spec.md` — design tokens, layout, typography
- `docs/figma-handoff.md` — Figma → code handoff notes

`CLAUDE.md` has a more detailed architecture overview and the non-negotiable affiliate-link rules.

## License

Code released under the [MIT](./LICENSE) license.
