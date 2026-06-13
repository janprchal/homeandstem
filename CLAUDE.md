# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Project Overview

**HomeStem** (homeandstem.com) is an English-language affiliate blog in the Home & Garden niche, monetized via Amazon Associates. Traffic flows **Pinterest → Blog → Amazon**. Amazon tracking ID: `homeandstem-20`.

This repo contains the Astro site. It started from the **bookworm-light-astro v4.0.2** theme (Themefisher) and is being adapted to the HomeStem spec. As of now it is still largely the stock theme — `src/config/config.json` still carries Bookworm branding and a placeholder GTM ID.

The full project spec lives in the parent project folder (`../files/`, not part of this repo); the code-focused brief is copied into this repo at `docs/homestem-code-spec.md`. When the two disagree, the spec is the source of truth for the *target*; this file describes what the code *currently* does.

---

## Commands

Package manager is **yarn** (v1, see `packageManager` in package.json).

```sh
yarn dev        # dev server
yarn build      # production build
yarn preview    # preview the build
yarn check      # astro check (type checking)
yarn format     # prettier -w .
```

Deploy targets: Netlify (`netlify.toml`) and Cloudflare Workers (`wrangler.jsonc`, `yarn deploy:cf-workers`).

---

## Architecture

**Stack:** Astro 6 (SSG) + **React** islands + Tailwind CSS v4 (via `@tailwindcss/vite`) + MDX.

> Note: the original spec called for Vue 3, but the theme this repo is built on uses React (`@astrojs/react`, `.tsx` shortcodes/helpers). New interactive components should follow the React convention already in the codebase unless a deliberate migration is decided.

### Content Collections (`src/content.config.ts`)

Current collections: `posts`, `authors`, `pages`, `about`, `contact`. Posts frontmatter: `title`, `meta_title`, `description`, `date`, `image`, `categories`, `authors`, `tags`, `draft`.

> The target schema in `docs/homestem-code-spec.md §3` defines an `articles` collection with `type` (listicle | buying-guide | comparison | how-to), `heroImage`, `editorsPick`, `compareProducts`. Migrating `posts` toward that schema is pending work — check which shape a file uses before editing.

### Key directories

- `src/config/` — `config.json` (site meta, GTM, pagination), `theme.json` (fonts/colors, drives `astro.config.mjs` font loading), `menu.json`, `social.json`
- `src/layouts/` — `Base.astro`, `partials/` (Header, Footer, PostSingle, AuthorSingle), `components/` (.astro), `shortcodes/` (.tsx, auto-imported in MDX via astro-auto-import: Button, Accordion, Notice, Video, Youtube, Tabs, Tab)
- `src/lib/` — content/taxonomy parsers, `utils/` (dateFormat, readingTime, similarItems, sorting, taxonomy filters)
- `src/pages/` — routes: `/`, `/blog/[single]`, `/categories/[category]`, `/tags/[tag]`, `/authors/[single]`, `/about`, `/contact`, `/search`, `/[regular]` (generic pages), `404`
- `src/styles/` — plain CSS split by concern (base, buttons, components, navigation, utilities, safe)

### Layout dimensions (target, per spec)

- Max page width: 1100px centered; content column 720px max
- Sidebar: 280px, `position: sticky; top: 24px`; moves below hero+intro on mobile
- Mobile padding: 20px

---

## Design Tokens

Tokens are defined as CSS custom properties. Font pairing: **DM Sans** (headings/labels) + **Lora** (body) — fonts are configured in `src/config/theme.json`. Key values:

```css
--color-primary: #2D6A4F;       /* brand green — all CTAs */
--color-primary-light: #52B788; /* hover states */
--color-accent: #F4A261;        /* amber — badges, star ratings */
--color-bg-page: #FAFAF8;
--color-danger: #C0392B;        /* cons, danger callouts */
--content-width: 720px;
--sidebar-width: 280px;
```

---

## Affiliate Link Rules (Non-Negotiable)

These apply to every component, every link:

1. Always append `?tag=homeandstem-20` to every Amazon URL
2. All affiliate links: `target="_blank" rel="nofollow noopener sponsored"`
3. Never cloak affiliate links (Amazon ToS prohibits it)
4. Never use the word "free" near an affiliate link
5. `AffiliateDisclaimer` component must appear on every page containing affiliate links
6. All affiliate clicks push to dataLayer: `{ event: 'affiliate_click', product: name, url: affiliateUrl }`

---

## SEO Requirements

| Requirement | Notes |
|-------------|-------|
| `schema.org/Article` JSON-LD | Every article page `<head>` |
| `schema.org/FAQPage` JSON-LD | Pages using the FAQ component |
| `og:image` | Must be 2:3 ratio (Pinterest-optimized), from hero image frontmatter |
| Hero images | Min 1000px wide, vertical 2:3 ratio, must have text overlay for Pinterest |
| Images | `width`+`height` attributes always (CLS), `loading="lazy"` below fold, `<picture>` with WebP+JPEG fallback |
| Core Web Vitals | LCP < 2.5s, CLS < 0.1, FID < 100ms |
