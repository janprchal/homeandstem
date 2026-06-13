# HomeStem — Code Specification
*Version 1.0 | June 2026*
*Brief for Claude Code. For visual design, colors, and layout, see `homestem-design-spec.md`.*

---

## 1. Project Context

**HomeStem** (homeandstem.com) is an English-language affiliate blog in the Home & Garden niche, monetized via Amazon Associates (tracking ID: `homeandstem-20`). Traffic source: Pinterest → Blog → Amazon.

**Tech stack:** Astro (static site generator) + Vue 3 components + Markdown content files + Netlify hosting.

**Core conversion goal:** Get the user to click an Amazon affiliate link. Every component must serve this goal.

---

## 2. Tech Stack Details

| Layer | Choice |
|-------|--------|
| Framework | Astro v6 |
| Components | Vue 3 |
| Styling | Tailwind CSS v4 |
| Content | Markdown files in repo (Astro Content Collections) |
| Version control | GitHub |
| Hosting | Netlify (auto-deploy on push) |
| Domain | homeandstem.com |

---

## 3. Content Collections Schema

Define in `src/content/config.ts`. All fields below are required unless marked optional.

```typescript
import { defineCollection, z } from 'astro:content';

const articles = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    type: z.enum(['listicle', 'buying-guide', 'comparison', 'how-to']),
    category: z.enum([
      'indoor-plants',
      'small-space-org',
      'lawn-outdoor',
      'balcony-garden',
      'home-decor'
    ]),
    tags: z.array(z.string()),
    heroImage: z.string(),
    heroImageAlt: z.string(),
    editorsPick: z.string().optional(),       // product slug for EditorsPick sidebar
    compareProducts: z.array(z.string()).optional(), // comparison articles only
    seasonal: z.boolean().default(false),
    affiliate: z.boolean().default(true),
    draft: z.boolean().default(false),
  }),
});

export const collections = { articles };
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

### 4.1 Listicle — `type: listicle`

```
[1] Hero image (2:3, min 1000px, with text overlay)
[2] H1 — article title
[3] Intro paragraph (2–4 sentences)
[4] ComparisonTable — all products at a glance
[5] Product blocks (5–8 total), each containing:
    [5a] H2: "#N Best [adjective]: [Product Name]"
    [5b] ProductHeroCard
    [5c] Body text (2–4 paragraphs, second person)
    [5d] ProsConsList
[6] H2: "What to Look for in [Category]" — 3–5 H3 subsections (no product mentions)
[7] FAQ
[8] AffiliateDisclaimer

SIDEBAR (sticky, desktop):
    [S1] TableOfContents
    [S2] EditorsPick
    [S3] RelatedArticles
```

### 4.2 Buying Guide — `type: buying-guide`

```
[1] Hero image
[2] H1 — "Best [Product] for [Use Case] ([Year])"
[3] Intro paragraph (2–4 sentences)
[4] H2: "What to Look for" — 3–5 H3 criteria (no product mentions, longer than Listicle)
[5] H2: "[Product] Types: Which Is Right for You?" (optional)
[6] Our picks (3–5 products), each H2 labeled:
    "Best Overall: [Product]" / "Best Budget Pick: [Product]" / "Best Premium Pick: [Product]"
    Each containing: ProductHeroCard + body text + ProsConsList
[7] FAQ
[8] AffiliateDisclaimer

SIDEBAR: same as Listicle
```

### 4.3 Comparison — `type: comparison`

```
[1] Hero image (ideally side-by-side of both products)
[2] H1 — must contain exact "[Product A] vs [Product B]" phrase
[3] Intro paragraph (2–4 sentences)
[4] VerdictCards — quick verdict, both products
[5] HeadToHeadTable — criteria rows, winner highlighted
[6] Detailed criterion sections — one H2 per criterion, mini-verdict at end
[7] VerdictBlock — "Buy [A] if..." / "Buy [B] if..."
[8] FAQ
[9] AffiliateDisclaimer

SIDEBAR:
    [S1] TableOfContents
    [S2] VerdictMini (replaces EditorsPick)
    [S3] RelatedArticles
```

### 4.4 How-to — `type: how-to`

```
[1] Hero image (shows the RESULT, not the process)
[2] H1 — must start with "How to"
[3] Intro paragraph (2–4 sentences, include difficulty + time + budget estimate)
[4] WhatYouNeedList (full variant)
[5] StepBlock × 4–7 steps
[6] H2: "Tips and Common Mistakes to Avoid" — 4–6 tips
[7] H2: "Take It Further: Recommended Products" — 2–3 ProductInlineCard
[8] FAQ
[9] AffiliateDisclaimer

SIDEBAR:
    [S1] TableOfContents
    [S2] WhatYouNeedMini
    [S3] RelatedArticles
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

---

### ComparisonTable
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
