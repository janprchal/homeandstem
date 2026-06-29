# HomeStem — Code Specification
*Version 1.1 | June 2026 (React islands; overlay hero + Tag/Badge eyebrow; flat cards; RelatedArticles end-of-body; responsive Layout variants)*
*Brief for Claude Code. For visual design, colors, and layout, see `homestem-design-spec.md`.*

---

## 1. Project Context

**HomeStem** (homeandstem.com) is an English-language affiliate blog in the Home & Garden niche, monetized via Amazon Associates (tracking ID: `homeandstem-20`). Traffic source: Pinterest → Blog → Amazon.

**Tech stack:** Astro (static site generator) + **React islands** + Tailwind CSS v4 + Markdown/MDX content files + Netlify hosting.
> **Note (2026-06-15):** this spec originally said Vue 3, but the chosen theme (bookworm-light-astro) uses **React** — React is the convention going forward. Treat any "Vue" reference in older docs as React.

**Core conversion goal:** Get the user to click an Amazon affiliate link. Every component must serve this goal.

---

## 2. Tech Stack Details

| Layer | Choice |
|-------|--------|
| Framework | Astro v6 (SSG) |
| Interactive components | React islands (theme convention; not Vue) |
| Styling | Tailwind CSS v4 |
| Content | Markdown files in repo (Astro Content Collections) |
| Version control | GitHub |
| Hosting | Netlify (auto-deploy on push) |
| Domain | homeandstem.com |

---

## 3. Content Collections Schema

Defined in `src/content.config.ts` (root of the repo, not inside `src/content/`). Uses Astro's glob loader pattern. All fields are required unless marked optional.

```typescript
import { glob } from "astro/loaders";
import { defineCollection } from "astro:content";
import { z } from "astro/zod";

// Articles collection
const articlesCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "src/content/articles" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      meta_title: z.string().optional(),      // overrides <title> tag if set
      description: z.string(),
      pubDate: z.coerce.date(),
      type: z.enum(["listicle", "buying-guide", "comparison", "how-to"]),
      category: z.enum([
        "indoor-plants",
        "small-space-org",
        "lawn-outdoor",
        "balcony-garden",
        "home-decor",
      ]),
      tags: z.array(z.string()).default(() => []),
      authors: z.array(z.string()).default(() => ["Admin"]),
      heroImage: image(),                     // co-located file, Astro image()-optimised
      heroImageAlt: z.string(),
      editorsPick: z.string().optional(),     // product slug → EditorsPick sidebar
      compareProducts: z.array(z.string()).optional(), // product slugs for comparison type
      // how-to only: tools/materials checklist. Feeds WhatYouNeedList (body) and
      // WhatYouNeedMini (sidebar) — both read from the same frontmatter array.
      essentials: z.array(z.object({
        name: z.string(),
        estimatedCost: z.string().optional(),
        affiliateUrl: z.url().optional(),
        category: z.enum(["tool", "material"]).optional(),
      })).optional(),
      seasonal: z.boolean().default(false),
      affiliate: z.boolean().default(true),
      draft: z.boolean().default(false),
    }),
});

// Products data collection — one YAML per product, slug = filename.
// Referenced by editorsPick / compareProducts frontmatter fields.
// Resolved at runtime via src/lib/products.ts → getProduct(slug).
const productsCollection = defineCollection({
  loader: glob({ pattern: "**/*.{yaml,yml}", base: "src/content/products" }),
  schema: z.object({
    name: z.string(),
    image: z.string(),      // plain /public path (not image()-optimised yet)
    imageAlt: z.string(),
    affiliateUrl: z.url(), // full Amazon URL; AffiliateLink appends the tracking tag
    price: z.string(),
  }),
});

export const collections = { articles: articlesCollection, products: productsCollection };
```

**Example frontmatter:**
```yaml
---
title: "7 Best Self-Watering Planters for a Low-Maintenance Balcony"
description: "We tested the best self-watering planters so you don't have to..."
pubDate: 2026-06-05
type: listicle
category: balcony-garden
tags: [planters, self-watering, balcony, small-space]
heroImage: ./hero.jpg
heroImageAlt: "Seven self-watering planters arranged on a sunny balcony"
editorsPick: "lechuza-cubico"
seasonal: false
affiliate: true
draft: false
---
```

---

## 4. Article Structures

Each article type maps to a layout file and a set of components. Content is written in Markdown/MDX; Astro renders it using the matching layout.

**Shared across all types (added 2026-06-15):**
- **Hero `[1]`** is a full-bleed **overlay banner** (background photo + dark-green scrim + bottom-left content): an **eyebrow row** (category Tag + article-type Badge) + the **H1** (white) + a **meta line** (`By the HomeStem Team · X min read · Updated <Month Year>`). The H1 lives in the hero; the body starts with the intro. `heroImage` is the 2:3 ≥1000px og:image/Pinterest source, cropped to landscape for the banner.
- **RelatedArticles** sits at the **end of the body** (after FAQ, before AffiliateDisclaimer) — **not** in the sidebar. Sidebar = TableOfContents + one type-specific widget only.
- **Responsive:** desktop = 720px content + 280px sticky sidebar; mobile (<1024px) = single column, sidebar widgets reflow below the intro. ProductHeroCard, VerdictCards, VerdictBlock, RelatedArticles each render image-left/row on desktop and stacked on mobile (in Figma these are `Layout` component variants; in code, one component with a CSS breakpoint). ComparisonTable & HeadToHeadTable become horizontal-scroll on mobile.
- **Flat cards:** all cards/tables use a `1px` border + radius, **no drop shadow**.

### 4.1 Listicle — `type: listicle`

```
[1] Hero — overlay banner: eyebrow (Tag + Badge) + H1 + meta line
[2] Intro paragraph (2–4 sentences)
[3] ComparisonTable — all products at a glance
[4] Product blocks (5–8 total), each containing:
    [4a] H2: "#N Best [adjective]: [Product Name]"
    [4b] ProductHeroCard
    [4c] Body text (2–4 paragraphs, second person)
    [4d] ProsConsList
[5] H2: "What to Look for in [Category]" — 3–5 H3 subsections (no product mentions)
[6] FAQ
[7] RelatedArticles — end of body, after FAQ
[8] AffiliateDisclaimer

SIDEBAR (sticky, desktop) — 2 widgets:
    [S1] TableOfContents
    [S2] EditorsPick
```

### 4.2 Buying Guide — `type: buying-guide`

```
[1] Hero — overlay banner: eyebrow (Tag + Badge "Buying Guide") + H1 "Best [Product] for [Use Case] ([Year])" + meta
[2] Intro paragraph (2–4 sentences)
[3] H2: "What to Look for" — 3–5 H3 criteria (no product mentions, longer than Listicle)
[4] H2: "[Product] Types: Which Is Right for You?" (optional)
[5] Our picks (3–5 products), each H2 labeled:
    "Best Overall: [Product]" / "Best Budget Pick: [Product]" / "Best Premium Pick: [Product]"
    Each containing: ProductHeroCard + body text + ProsConsList
[6] FAQ
[7] RelatedArticles — end of body, after FAQ
[8] AffiliateDisclaimer

SIDEBAR (2 widgets): TableOfContents + EditorsPick (same as Listicle)
```

### 4.3 Comparison — `type: comparison`

```
[1] Hero — overlay banner: eyebrow (Tag + Badge "Comparison") + H1 (must contain exact "[Product A] vs [Product B]") + meta
[2] Intro paragraph (2–4 sentences)
[3] VerdictCards — quick verdict, both products
[4] HeadToHeadTable — criteria rows, winner highlighted
[5] Detailed criterion sections — one H2 per criterion, mini-verdict at end
[6] VerdictBlock — "Buy [A] if..." / "Buy [B] if..."
[7] FAQ
[8] RelatedArticles — end of body, after FAQ
[9] AffiliateDisclaimer

SIDEBAR (2 widgets):
    [S1] TableOfContents
    [S2] VerdictMini (replaces EditorsPick)
```

### 4.4 How-to — `type: how-to`

```
[1] Hero — overlay banner (shows the RESULT): eyebrow (Tag + Badge "How-To") + H1 (must start with "How to") + meta
[2] Intro paragraph (2–4 sentences, include difficulty + time + budget estimate)
[3] WhatYouNeedList (full variant)
[4] StepBlock × 4–7 steps
[5] H2: "Tips and Common Mistakes to Avoid" — 4–6 tips
[6] H2: "Take It Further: Recommended Products" — 2–3 ProductInlineCard
[7] FAQ
[8] RelatedArticles — end of body, after FAQ
[9] AffiliateDisclaimer

SIDEBAR (2 widgets):
    [S1] TableOfContents
    [S2] WhatYouNeedMini
```

---

## 5. Component Props

### ProductHeroCard
```typescript
interface ProductHeroCardProps {
  name: string;
  image: string;           // URL (Amazon image or local)
  imageAlt: string;
  affiliateUrl: string;    // Full Amazon URL with tracking ID homeandstem-20
  rating: number;          // 1–5, supports decimals (4.5)
  price: string;           // Display string, e.g. "$49.99"
  badge?: string;          // Optional badge text, e.g. "Best Overall"
  reviewCount?: number;
}
```
**Behavior:** All clicks push to dataLayer: `{ event: 'affiliate_click', product: name, url: affiliateUrl }`. Images: lazy loading, WebP with JPEG fallback.
**Layout/visual:** Flat card — `1px` border + radius, no shadow. Responsive: image-left on desktop, stacked (image-top, full-width CTA) below 1024px. (Figma documents this as a `Layout` variant: Horizontal/Stacked.)
**Badge position:** The optional badge renders *above* the image (flex-column, `gap: 8px`), not overlaid on it. The left column is a flex-column: `[badge?] → [image]`.
**Body column:** stretches to the full card height; CTA button is pinned to the bottom via `margin-top: auto`. Row order: `[name H3] → [stars + price row] → [price disclaimer] → [CTA button]`.

---

### ComparisonTable
**Flat** (border, no shadow). **Mobile:** horizontal swipe — fixed-width table inside a clipped, scrollable wrapper with a "→ swipe" hint (no column compression).
```typescript
interface ComparisonTableProps {
  products: Array<{
    rank: number;
    name: string;
    affiliateUrl: string;
    price: string;
    rating: number;
    bestFor: string;
  }>;
}
```

---

### ProsConsList
```typescript
interface ProsConsListProps {
  pros: string[];   // 2–3 items
  cons: string[];   // 1–2 items
}
```

---

### TableOfContents
```typescript
interface TableOfContentsProps {
  headings: Array<{
    depth: 2 | 3;
    text: string;
    slug: string;  // auto-generated anchor ID
  }>;
}
```
**Behavior:** IntersectionObserver highlights current section on scroll. Mobile: collapsed by default behind "Contents ↓" toggle.

---

### EditorsPick
```typescript
interface EditorsPickProps {
  name: string;
  image: string;
  imageAlt: string;
  affiliateUrl: string;
  price: string;
}
```

---

### FAQ
```typescript
interface FAQProps {
  items: Array<{
    question: string;
    answer: string;   // plain text only, no HTML
  }>;
}
```
**Technical requirement:** Must output valid `schema.org FAQPage` JSON-LD in `<head>`.

---

### AffiliateDisclaimer
No props — static component. Must appear on every page containing affiliate links.

---

### RelatedArticles
**Placement:** end of article body (after FAQ, before AffiliateDisclaimer) — not in the sidebar. Responsive: full-width 3-card row on desktop, stacked cards on mobile.
```typescript
interface RelatedArticlesProps {
  articles: Array<{
    title: string;
    slug: string;
    image: string;
    imageAlt: string;
    category: string;
  }>;
}
```

---

### CalloutBox
```typescript
interface CalloutBoxProps {
  variant: 'tip' | 'warning' | 'note' | 'danger';
  title?: string;
  children: string;   // MDX slot
}
```

---

### ImageWithCaption
```typescript
interface ImageWithCaptionProps {
  src: string;
  alt: string;       // Required — enforce at build time
  caption?: string;
  width: number;
  height: number;
}
```
**Technical:** Always specify `width` + `height` (prevents CLS). `loading="lazy"` below the fold. `<picture>` element with WebP + JPEG fallback.

---

### VerdictCards
**Responsive:** two cards side-by-side (with "vs") on desktop, stacked on mobile. Winner card has a 2px primary border. (Figma `Layout` variant: Row/Stacked.)
```typescript
interface VerdictCardsProps {
  productA: {
    name: string;
    image: string;
    imageAlt: string;
    affiliateUrl: string;
    bestFor: string;
    isWinner: boolean;
  };
  productB: {
    name: string;
    image: string;
    imageAlt: string;
    affiliateUrl: string;
    bestFor: string;
    isWinner: boolean;
  };
}
```

---

### HeadToHeadTable
**Flat** (border, no shadow). **Mobile:** horizontal swipe — same pattern as ComparisonTable.
```typescript
interface HeadToHeadTableProps {
  productA: { name: string; affiliateUrl: string; image: string; };
  productB: { name: string; affiliateUrl: string; image: string; };
  criteria: Array<{
    label: string;
    valueA: string;
    valueB: string;
    winner: 'A' | 'B' | 'tie';
  }>;
  overallWinner: 'A' | 'B';
}
```

---

### VerdictBlock
**Responsive:** two "Buy X if…" panels side-by-side on desktop, stacked on mobile. (Figma `Layout` variant: Row/Stacked.)
```typescript
interface VerdictBlockProps {
  productA: {
    name: string;
    affiliateUrl: string;
    buyIfReasons: string[];   // 2–3 bullet points
  };
  productB: {
    name: string;
    affiliateUrl: string;
    buyIfReasons: string[];
  };
}
```

---

### WhatYouNeedList
```typescript
interface WhatYouNeedListProps {
  items: Array<{
    name: string;
    estimatedCost?: string;    // e.g. "~$25"
    affiliateUrl?: string;
    category?: 'tool' | 'material';
  }>;
  variant: 'full' | 'mini';
}
```

---

### StepBlock
```typescript
interface StepBlockProps {
  number: number;
  title: string;
  children: any;   // MDX slot
}
```

---

### ProductInlineCard
```typescript
interface ProductInlineCardProps {
  name: string;
  image: string;
  imageAlt: string;
  affiliateUrl: string;
  price?: string;
}
```

---

## 6. Affiliate Link Rules

Apply to every component, every link, without exception.

1. Always append `?tag=homeandstem-20` to every Amazon URL (or use the full Associates link)
2. All external affiliate links: `target="_blank"` + `rel="nofollow noopener sponsored"`
3. Never cloak affiliate links (Amazon ToS prohibits it)
4. Never use the word "free" near a product affiliate link
5. `AffiliateDisclaimer` must appear on every page that contains any affiliate link

---

## 7. SEO Technical Requirements

| Requirement | Implementation |
|-------------|----------------|
| Schema.org `Article` | JSON-LD in `<head>` on every article page |
| Schema.org `FAQPage` | JSON-LD in `<head>` on pages using FAQ component |
| `og:image` | From `heroImage` frontmatter, must be 2:3 ratio |
| `og:title`, `og:description` | From frontmatter `title` and `description` |
| Canonical URL | Self-referencing on every page |
| Sitemap | Auto-generated by Astro, submit to Google Search Console |
| Robots.txt | Allow all, disallow `/drafts/` |
| Core Web Vitals | LCP < 2.5s, CLS < 0.1, FID < 100ms |
| Breadcrumbs | Navigation + BreadcrumbList schema |
| RSS feed | For aggregators |
| Frontmatter validation | Enforce required fields at build time |

---

## 8. Global Components

| Component | Notes |
|-----------|-------|
| `Header` | Logo, nav (Home, Indoor Plants, Small Space Org, Lawn & Outdoor, Balcony & Garden), search icon |
| `Footer` | Links: About, Affiliate Disclosure, Privacy Policy. Copyright. Short disclaimer. |
| `ArticleCard` | hero image, category badge, title, 1-line excerpt, read time |
| `AuthorBox` | End of every article. Name, avatar, 2-line bio. E-E-A-T signal for Google. |
| `PinterestSaveButton` | Hover overlay on article images. Opens Pinterest save dialog with pre-filled description + URL. |

---

## 9. Pages

| Page | Route |
|------|-------|
| Homepage | `/` |
| Article | `/[slug]` |
| Category | `/category/[category]` |
| Tag | `/tag/[tag]` |
| About | `/about` |
| Affiliate Disclosure | `/affiliate-disclosure` |
| Privacy Policy | `/privacy-policy` |
| 404 | `404.astro` |
