# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Project Overview

**HomeStem** (homeandstem.com) is an English-language affiliate blog in the Home & Garden niche, monetized via Amazon Associates. Traffic flows **Pinterest → Blog → Amazon**. Amazon tracking ID: `homeandstem-20`.

This repo contains the Astro site. It started from the **bookworm-light-astro v4.0.2** theme (Themefisher) and has been adapted to the HomeStem spec. The HomeStem layer is in place (design tokens, `articles` collection, components, four article layouts, homepage, taxonomy + legal pages, HomeStem branding/nav/footer). The stock `posts`/`blog`/`authors` machinery has been removed. GTM is wired and **enabled** with the real container ID (`config.json` → `google_tag_manager.gtm_id` = `GTM-W9WJKL9T`). The real brand mark (sprout/roof glyph from Figma) is live as `favicon.png` (48×48) and in `og-image.png` (1200×630, on-dark mark + wordmark + tagline) — both verified on disk and wired via `config.json` → `site.favicon` / `metadata.meta_image` and `Base.astro`.

### HomeStem layer (what's been adapted)

- **Design tokens** — `src/styles/tokens.css` is the source of truth for all HomeStem custom properties (colors, spacing, radius, shadows, layout); `src/config/theme.json` mirrors brand colors + fonts (DM Sans / Lora) so the theme's Tailwind utilities and Google Font loading stay in sync. Both are imported via `src/styles/main.css`; shared component primitives live in `src/styles/homestem.css`.
- **Content** — `articles` collection in `src/content.config.ts` (schema per `docs/homestem-code-spec.md §3`); articles live in `src/content/articles/` with co-located hero images (`image()`-validated). Sample article per type exists.
- **Components** — `src/layouts/components/homestem/`. Affiliate rules are centralized in `AffiliateLink.astro` + `src/lib/utils/affiliate.ts` (tag append, rel/target, delegated `affiliate_click` dataLayer push). Sidebar widgets resolve product data via `src/lib/products.ts` → `getProduct(slug)` (async), backed by the `products` data collection (`src/content/products/*.yaml`, one file per product, slug = filename, referenced by `editorsPick` / `compareProducts`). The how-to sidebar's `WhatYouNeedMini` reads the article's `essentials` frontmatter (same array feeds the in-body `WhatYouNeedList` full variant via MDX `frontmatter`). HomeStem content components are auto-imported into MDX via `astro-auto-import` (see `astro.config.mjs`).
- **Routes/layouts** — articles-only `src/pages/[slug].astro` → `ArticleLayout.astro` → `ArticleBase.astro` (1100/720/280 shell, hero, per-type sidebar via `ArticleSidebar.astro`, AuthorBox, disclaimer, Article/FAQ JSON-LD). Per-type *body composition* is authored in each article's MDX per the fixed templates in `docs/homestem-code-spec.md §4`. Other routes: homepage (`index.astro` — FeaturedArticle + ArticleGrid + category sections), `/category/[category]` and `/tag/[tag]` (`ListingLayout.astro` + BreadcrumbList JSON-LD), static `about` / `affiliate-disclosure` / `privacy-policy` (`ProsePage.astro`), plus theme `search` (search repointed to `articles`) and `/rss.xml` (`@astrojs/rss`, newest-first over the `articles` collection). No `/contact` page — contact is just a `mailto:` link in the footer and on the legal pages, sourced from `config.json → contactinfo.email`. Shared helpers: `src/lib/categories.ts`, `src/lib/articleCard.ts`.

**Known gaps / next steps:**
- The four type-specific sidebars share one selector component.
- Product images in the `products` collection are still plain `/public` string paths (not `image()`-optimized like hero images).

**Key component conventions (2026-06-29):**
- **Header nav** is right-aligned (logo left, nav+search right via `margin-left: auto` on `.hs-header__nav`). Mobile end (search + burger) also right-aligned via `margin-left: auto` in the `@media (max-width: 1023px)` block.
- **Header burger / View Transitions** — the burger script uses a `window.__hsHeader` guard to prevent duplicate `document.addEventListener` registration across Astro `<ClientRouter>` page navigations. Pattern: guard → `astro:before-preparation` resets nav state → `astro:page-load` re-binds via `cloneNode`.
- **CalloutBox** — icon + title are siblings in a `.hs-callout__header` flex-row; body text is a separate `.hs-callout__body` block below. Border is `1px solid [variant-color]` on all four sides (matches Figma), not a left-only accent bar.
- **ProductHeroCard** — badge renders above the image with a flex-column gap (not overlaid via `position: absolute`). The `.hs-phc__body` column stretches to full card height (`align-items: stretch` on the grid + `height: 100%` on the body); CTA button is pinned to the bottom via `margin-top: auto`. Price disclaimer (`hs-phc__price-note`) is a separate row below the [stars + price] row, not inside the meta flex-row.
- **ComparisonTable** — `th` border-bottom uses `1px solid var(--color-border)` (standard, not green primary).
- **RelatedArticles** — `.hs-related-body__info` uses `align-items: flex-start` so the badge shrinks to content width; `.hs-related-body__title` has `width: 100%` to preserve full-width line-clamping.

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

Current collections: `articles` (HomeStem, schema per `docs/homestem-code-spec.md §3` — `type`, `category`, `heroImage` via `image()`, `editorsPick`, `compareProducts`, `essentials`, etc.) and `products` (data collection of YAML product records resolved by `src/lib/products.ts`). The stock `posts`, `authors`, `pages`, `about`, and `contact` collections have been removed.

### Key directories

- `src/config/` — `config.json` (site meta, GTM, pagination), `theme.json` (fonts/colors, drives `astro.config.mjs` font loading), `menu.json`, `social.json`
- `src/layouts/` — `Base.astro` (has a `head` named slot for per-page JSON-LD), HomeStem layouts (`ArticleBase`, `ArticleLayout`, `ListingLayout`, `ProsePage`), `partials/` (Header, Footer), `components/homestem/` (HomeStem components), `shortcodes/` (.tsx, auto-imported in MDX via astro-auto-import)
- `src/lib/` — `categories.ts`, `products.ts`, `articleCard.ts`, content/taxonomy parsers, `utils/` (incl. `affiliate.ts`, dateFormat, readingTime)
- `src/pages/` — routes: `/`, `/[slug]` (articles), `/category/[category]`, `/tag/[tag]`, `/about`, `/affiliate-disclosure`, `/privacy-policy`, `/search`, `404`
- `src/styles/` — plain CSS split by concern (base, buttons, components, navigation, utilities, safe)

### Layout dimensions (target, per spec)

- Max page width: 1100px centered; content column 720px max
- Sidebar: 280px, `position: sticky; top: 24px`; moves below hero+intro on mobile
- Mobile padding: 20px

---

## Design Tokens

Tokens are defined as CSS custom properties in `src/styles/tokens.css`. Font pairing: **DM Sans** (headings/labels) + **Lora** (body) — fonts are configured in `src/config/theme.json`. Key values:

```css
/* Colors */
--color-primary: #2D6A4F;       /* brand green — all CTAs */
--color-primary-light: #52B788; /* hover states */
--color-accent: #F4A261;        /* amber — badges, star ratings */
--color-bg-page: #FAFAF8;
--color-danger: #C0392B;        /* cons, danger callouts */
/* Layout */
--content-width: 720px;
--sidebar-width: 280px;
/* Font weights */
--font-weight-regular: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
/* Line heights */
--line-height-heading: 1.2;
--line-height-tight: 1.3;    /* h4, label/xs */
--line-height-label: 1.4;
--line-height-snug: 1.5;
--line-height-body: 1.75;
/* Composite text-style shorthand — mirrors the 10 Figma text styles.
   Usage: font: var(--type-*) — one declaration replaces separate font-family/weight/size/line-height.
   --type-* prefix avoids conflict with Tailwind's reserved --text-* font-size utilities.
   letter-spacing is NOT part of the CSS font shorthand; declare it separately when needed. */
--type-h2:       var(--font-weight-medium) var(--font-size-h2)/var(--line-height-heading)  var(--font-heading);
--type-h3:       var(--font-weight-medium) var(--font-size-h3)/var(--line-height-heading)  var(--font-heading);
--type-h4:       var(--font-weight-medium) var(--font-size-h4)/var(--line-height-tight)    var(--font-heading);
--type-label-lg: var(--font-weight-medium) var(--font-size-label-lg)/var(--line-height-heading) var(--font-heading);
--type-label:    var(--font-weight-medium) var(--font-size-label)/var(--line-height-label)  var(--font-heading);
--type-label-sm: var(--font-weight-medium) var(--font-size-label-sm)/var(--line-height-label) var(--font-heading);
--type-micro:    var(--font-weight-medium) var(--font-size-micro)/var(--line-height-tight)  var(--font-heading);
--type-body:     var(--font-weight-regular) var(--font-size-base)/var(--line-height-body)   var(--font-body);
--type-body-sm:  var(--font-weight-regular) var(--font-size-body-sm)/var(--line-height-body) var(--font-body);
--type-caption:  var(--font-weight-regular) var(--font-size-caption)/var(--line-height-snug) var(--font-body);
```

Typography notes:
- Figma text styles use **Medium (500)** for all headings/labels. Article body `h1–h6` remain Bold (700) via `@apply font-bold` in `base.css` — intentional (UI component weights vs. long-form article readability are separate systems).
- `text-wrap: balance` on headings, `text-wrap: pretty` on body (`base.css`) — progressive enhancement.
- Cards are **flat**: `1px solid var(--color-border) + border-radius`, no drop shadows. Shadow tokens in `tokens.css` are for overlays/dropdowns only — never apply shadows to cards (design decision 2026-06-15).

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

---

## Modern Web Guidance

Before writing any frontend code (components, scripts, APIs, performance work), invoke the `modern-web-guidance:modern-web-guidance` skill to apply current browser API best practices.
