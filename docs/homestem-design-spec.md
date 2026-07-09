# HomeStem — Design Specification
*Version 1.2 | June 2026 (overlay hero, Tag+Badge eyebrow, flat cards, RelatedArticles end-of-body, mobile reflow variants)*
*Brief for Claude Design. For component interfaces and code requirements, see `homestem-code-spec.md`.*

---

## 1. Project Context

**HomeStem** (homeandstem.com) is an English-language affiliate blog in the Home & Garden niche, monetized via Amazon Associates. Traffic source: **Pinterest → Blog → Amazon**.

**Core conversion goal:** Get the user to click an Amazon affiliate link. Every design decision should serve this goal without feeling like a hard sell.

**Key audience insight:** Users arrive from Pinterest — they are visually oriented, often on mobile, and in a shopping mindset.

---

## 2. Design Inspiration & References

### Primary visual inspiration
**Dribbble — Plant Shop Responsive Design**
https://dribbble.com/shots/23443980-Plant-Shop-Website-Responsive-Design

Use for: overall visual mood, color application, product presentation style, UI feel. Plant-related niche makes this directly relevant. Pay attention to how products and nature imagery are combined with clean UI.

### Affiliate blog structure reference
**Dawnlight** — https://dawnlight.cosmicthemes.com/
*(Astro affiliate blog template by Cosmic Themes)*

Use for: content hierarchy, article page structure, navigation patterns, newsletter CTA placement, related articles section, Pinterest sharing integration, footer layout.

Key observations from Dawnlight:
- Clean editorial layout with strong typography, generous white space
- Category badge + date shown above article title
- Related articles ("You'll also enjoy") as a card row below the article
- Newsletter CTA embedded mid-article and in footer
- Pinterest/social sharing on every article
- Minimal navigation — categories in top nav, no mega menus
- Simple two-column footer

**Important difference from Dawnlight:** Dawnlight has no sidebar on article pages. HomeStem intentionally uses a sticky sidebar (TableOfContents + EditorsPick) for conversion optimization. This is a deliberate design decision — keep the sidebar.

---

## 3. Not Yet Decided — Revisit Later

| Item | Status | When |
|------|--------|------|
| **Logo / brand mark** | ✅ Decided | Designed in Figma 2026-06-17 (`Logo / Primary Mark`, `Logo / Favicon Mark`, `Logo / Mark · On Dark` — see `figma-handoff.md`); live in code 2026-06-22 (Header/Footer + favicon.png + og-image.png) |
| **Typography / fonts** | ✅ Decided | See Section 5 |
| **Mobile navigation pattern** | ⏳ To be defined | After article type layouts are done |

---

## 4. Design Principles

1. **Conversion-first, never pushy.** Affiliate CTAs are prominent but blend naturally into editorial content. No pop-ups, no blinking buttons, no fake countdown timers.
2. **Mobile-first.** Pinterest sends predominantly mobile traffic. Design for 375px and scale up — never the other way around.
3. **Fast and clean.** No unnecessary visual complexity. White space is intentional.
4. **Trust through editorial quality.** The design should feel like a real editorial publication, not a spam affiliate site. Good typography, honest pros/cons, generous white space.
5. **Pinterest-ready visuals.** Every article hero image must work as a standalone Pinterest pin: vertical 2:3 ratio, minimum 1000px wide, readable text overlay.

---

## 5. Visual Design Tokens

Define all tokens as CSS custom properties. Use them consistently across all components — never hardcode values.

```css
/* Typography */
--font-heading: 'DM Sans', system-ui, sans-serif;
--font-body: 'Lora', Georgia, serif;
--font-size-base: 17px;        /* body text — slightly larger for readability */
--line-height-body: 1.75;
--line-height-heading: 1.2;

/* Color palette — nature-inspired, trustworthy */
--color-primary: #2D6A4F;      /* deep forest green — brand color, CTAs */
--color-primary-light: #52B788; /* lighter green — hover states */
--color-primary-bg: #D8F3DC;   /* very light green — subtle backgrounds */
--color-accent: #F4A261;       /* warm amber — secondary accent, badges */
--color-accent-bg: #FFF3E0;    /* light amber bg */

--color-text-primary: #1A1A1A;
--color-text-secondary: #555555;
--color-text-muted: #888888;

--color-bg-page: #FAFAF8;      /* slightly warm white — easier on eyes */
--color-bg-card: #FFFFFF;
--color-bg-subtle: #F5F5F0;    /* subtle warm gray for alternating sections */

--color-border: #E0E0D8;
--color-border-strong: #C8C8BE;

--color-success: #2D6A4F;      /* reuse primary for pros/positive */
--color-danger: #C0392B;       /* cons/negative */
--color-warning: #E67E22;      /* warnings in callout boxes */
--color-info: #2980B9;         /* tips/info in callout boxes */

/* Spacing scale */
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 24px;
--space-6: 32px;
--space-7: 48px;
--space-8: 64px;

/* Border radius */
--radius-sm: 4px;
--radius-md: 8px;
--radius-lg: 12px;
--radius-xl: 16px;

/* Shadows — DEPRECATED for cards (owner preference, 2026-06-15).
   Design uses FLAT depth: cards = white fill + 1px var(--color-border) + radius, NO drop shadow.
   Keep these only for incidental overlays (dropdowns/menus); never on product cards or tables. */
--shadow-card: 0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04);
--shadow-card-hover: 0 4px 12px rgba(0,0,0,0.1);

/* Layout */
--content-width: 720px;        /* main article column */
--sidebar-width: 280px;
--layout-gap: 40px;
--page-padding: 20px;          /* horizontal padding on mobile */
```

---

## 6. Layout System

### Article page (desktop ≥ 1024px)
```
┌─────────────────────────────────────────────────┐
│  HEADER (full width)                            │
├──────────────────────────┬──────────────────────┤
│  MAIN CONTENT            │  SIDEBAR             │
│  max-width: 720px        │  width: 280px        │
│                          │  position: sticky    │
│                          │  top: 24px           │
├──────────────────────────┴──────────────────────┤
│  FOOTER (full width)                            │
└─────────────────────────────────────────────────┘
```

### Article page (mobile < 1024px)
Sidebar moves below the hero image and intro, before the first product. Sticky behavior disabled.

### Max page width
`1100px` centered, with `var(--page-padding)` on sides.

### Article hero (all types) — overlay banner *(added 2026-06-15)*
The on-page hero is a **homepage-style full-bleed overlay banner**, identical pattern across the homepage and all four article types. It is **not** a 2:3 image dropped into the body.
```
┌───────────────────────────────────────────────┐
│  [background photo] + dark-green scrim          │
│                                                 │
│  ┌─ hero-content (bottom-left) ─────────────┐   │
│  │ [Category Tag] [Article-Type Badge]       │   │  ← eyebrow-row
│  │ H1 — Article Title (white)                │   │
│  │ By the HomeStem Team · X min read · …      │   │  ← meta
│  └───────────────────────────────────────────┘   │
└───────────────────────────────────────────────┘
```
- Desktop ≈ 1100×440, mobile ≈ 375×400 (landscape both; mobile H1 uses the h2 size).
- Scrim: linear gradient of deep green `#1B4332`, alpha ~0 → 0.5 → 0.94 toward the bottom-left, so the text always has contrast.
- **Eyebrow = real components:** a **Tag** atom (category, neutral pill) + a **Badge** atom (article type, `Accent` style). Not plain text. e.g. `Indoor Plants` · `Listicle`.
- **Hero image vs Pinterest pin:** `heroImage` is still the **2:3, ≥1000px** Pinterest asset (the `og:image`); the banner crops it to landscape on the page. Two different ratios — keep both in mind.

### Depth & elevation — FLAT, not shadows *(owner preference, 2026-06-15)*
HomeStem uses **flat depth**: separate surfaces with a `1px var(--color-border)` outline + `var(--radius-*)` and background contrast — **not** drop shadows. Product cards, ComparisonTable, VerdictCards, etc. carry a border and no shadow. (Avoid heavy/overused shadows entirely.)

---

## 7. Article Layouts

Each article type has a fixed structure — the order and combination of components is not flexible. Design every type as a complete page, not a collection of isolated components.

---

### 5.1 Listicle — "Top X Best [Product]"
*Most common type. 5–8 products in ranked order.*

```
┌─────────────────────────────────────────────────┐
│ HERO — overlay banner (eyebrow + H1 + meta)       │ ← full width
├─────────────────────────────┬───────────────────┤
│ MAIN (720px)                │ SIDEBAR (sticky)   │
│ Intro paragraph (2–4 lines) │ TableOfContents    │
│                             │ EditorsPick        │
│ ComparisonTable             │                    │
│                             │ (NO RelatedArticles│
│ ── Product block × 5–8 ──  │  in sidebar)       │
│  H2: "#1 Best Overall: X"   └───────────────────┤
│  ProductHeroCard                                  │
│  Body text (2–4 paragraphs)                       │
│  ProsConsList                                     │
│ ───────────────────────────                       │
│  H2: "#2 Best Budget: Y" ... (repeat)             │
│                                                   │
│ H2: "What to Look For" (H3 × 3–5, no products)    │
│ FAQ                                               │
│ RelatedArticles   ← end of body (was sidebar S3)  │
│ AffiliateDisclaimer                               │
└───────────────────────────────────────────────────┘
```

**Mobile:** Hero stays as the overlay banner (375×400). Sidebar widgets (TableOfContents + EditorsPick) move below the intro, before the first product block. ProductHeroCards stack; ComparisonTable becomes a horizontal swipe; RelatedArticles stacks at the end before the disclaimer.

---

### 5.2 Buying Guide — "Best [Product] for [Use Case]"
*3–5 products. Education-heavy — reader wants to learn before buying.*

```
┌─────────────────────────────────────────────────┐
│ HERO — overlay banner (eyebrow + H1 + meta)       │ ← full width
├─────────────────────────────┬───────────────────┤
│ MAIN (720px)                │ SIDEBAR (sticky)   │
│ Intro paragraph             │ TableOfContents    │
│                             │ EditorsPick        │
│ H2: "What to Look For"      │                    │
│  H3 criteria × 3–5          │ (NO RelatedArticles│
│  (longer than Listicle,     │  in sidebar)       │
│   no product mentions)      └───────────────────┤
│ H2: "Types Overview" (optional)                   │
│                                                   │
│ ── Our Picks × 3–5 ──                            │
│  H2: "Best Overall: X"                            │
│  ProductHeroCard / Body text / ProsConsList       │
│  H2: "Best Budget Pick: Y" ... (repeat)           │
│                                                   │
│ FAQ                                               │
│ RelatedArticles   ← end of body                   │
│ AffiliateDisclaimer                               │
└───────────────────────────────────────────────────┘
```

---

### 5.3 Comparison — "[Product A] vs [Product B]"
*2–4 products. High-intent traffic — reader already knows the category.*

```
┌─────────────────────────────────────────────────┐
│ HERO — overlay banner (eyebrow + H1 + meta)       │ ← full width
├─────────────────────────────┬───────────────────┤
│ MAIN (720px)                │ SIDEBAR (sticky)   │
│ Intro paragraph             │ TableOfContents    │
│                             │ VerdictMini        │
│ VerdictCards                │ (both CTAs visible,│
│ (quick pick, both products) │  replaces          │
│                             │  EditorsPick)      │
│ HeadToHeadTable             │                    │
│                             │ (NO RelatedArticles│
│ ── Criterion sections ──    │  in sidebar)       │
│  H2: "[Criterion]: X vs Y"  └───────────────────┤
│  Body text + mini-verdict (repeat per criterion)  │
│                                                   │
│ VerdictBlock "Buy X if… / Buy Y if…"              │
│ FAQ                                               │
│ RelatedArticles   ← end of body                   │
│ AffiliateDisclaimer                               │
└───────────────────────────────────────────────────┘
```

---

### 5.4 How-to — "How to [Action]"
*Step-by-step guide. Products appear naturally as tools/materials.*

```
┌─────────────────────────────────────────────────┐
│ HERO — overlay banner, shows RESULT (eyebrow+H1+meta)│ ← full width
├─────────────────────────────┬───────────────────┤
│ MAIN (720px)                │ SIDEBAR (sticky)   │
│ Intro (difficulty + time    │ TableOfContents    │
│  + budget estimate)         │ WhatYouNeedMini    │
│ WhatYouNeedList (full)      │ (compact list,     │
│                             │  stays visible)    │
│ ── StepBlock × 4–7 ──      │                    │
│  H2: "Step 1: [Action]"     │ (NO RelatedArticles│
│  Body text                  │  in sidebar)       │
│  Optional: image / Callout / └───────────────────┤
│            ProductInlineCard                      │
│  Step 2, 3… (repeat)                              │
│                                                   │
│ H2: "Tips & Common Mistakes" (4–6 tips)           │
│ H2: "Take It Further" — ProductInlineCard × 2–3   │
│ FAQ                                               │
│ RelatedArticles   ← end of body                   │
│ AffiliateDisclaimer                               │
└───────────────────────────────────────────────────┘
```

---

## 8. Component Visual Specifications

### 5.1 ProductHeroCard
The primary conversion component. Most important component in the entire site — must perform on mobile.

**Layout (desktop):** image left (200×200px) | content right — Figma variant `Layout=Horizontal`
**Layout (mobile):** image top (full width, ~190px tall) | content below, full-width CTA — Figma variant `Layout=Stacked`
*(Figma: one component set, property `Layout` = Horizontal | Stacked. Code: one component, CSS reflow at 1024px.)*

**Visual:**
- White card, **FLAT** — `1px var(--color-border)` + `var(--radius-lg)`, **no drop shadow**
- Optional badge top-left: "Best Overall" / "Best Budget" / "Editor's Pick" — background `var(--color-primary-bg)`, text `var(--color-primary)`
- Product name as H3 (affiliate link)
- Star rating: 5 stars filled/empty, color `var(--color-accent)`
- Price: bold, note "Price may vary. Check Amazon for current price."
- CTA button: full-width on mobile, auto-width on desktop. Background `var(--color-primary)`, text white, label "Check price on Amazon →"
- Hover: border color → `var(--color-primary-light)` (no shadow change — flat design)

---

### 5.2 ComparisonTable
Overview table at the top of listicle articles. Captures users who won't read the full article.

**Visual:**
- Full-width within content column. **FLAT** — `1px var(--color-border)` + `var(--radius-md)`, no drop shadow.
- Sticky header row on scroll (desktop)
- Columns: # | Product | Price | Rating | Best for
- Alternating row background: white / `var(--color-bg-subtle)`
- Product column: green affiliate link + small external link icon
- Rating column: star icons (not numbers)
- Top row: subtle left border in `var(--color-primary)`
- Mobile: **horizontal swipe** — fixed ~600px table inside a clipped, scrollable wrapper + "→ swipe" hint (no column truncation)

---

### 5.3 ProsConsList
Honest pros and cons for each product. Builds trust — fake or trivial cons destroy credibility.

**Visual:**
- Two-column layout on desktop, stacked on mobile
- Pros: green checkmark icon, background `var(--color-primary-bg)`
- Cons: red X icon, background `#FFEEEE`
- No border — background tint only
- Each item: 1 line max
- `var(--radius-md)` on container

---

### 5.4 TableOfContents
Sticky navigation sidebar. Highlights current section as user scrolls.

**Visual:**
- No card/box — clean, borderless
- "In this article" label: `var(--color-text-muted)`, 13px
- Links: 14px, `var(--color-text-secondary)`
- Active link: `var(--color-primary)`, font-weight 500, small left border indicator
- H3 links indented 12px relative to H2
- Mobile: collapsed behind "Contents ↓" toggle button

---

### 5.5 EditorsPick
Single best product, always visible in sidebar. Highest-converting sidebar element.

**Visual:**
- Small card, `var(--color-primary-bg)` background, `var(--color-primary)` left border
- "Editor's Pick" label: `var(--color-primary)`, 11px, uppercase, letter-spacing
- Product image: 80×80px, rounded
- Product name: 14px, bold
- Price: 13px, `var(--color-text-secondary)`
- CTA button: full-width, `var(--color-primary)` background, "Check price →"
- Fits within 280px sidebar

---

### 5.6 FAQ
Accordion of common questions. Expanded by default on desktop, collapsed on mobile.

**Visual:**
- H2: "Frequently Asked Questions"
- Each Q&A: question bold, answer as paragraph
- Separator line between items
- Collapsible accordion on mobile

---

### 5.7 AffiliateDisclaimer
Small, unobtrusive legal notice. Not a warning box — a muted footnote.

**Visual:**
- 13px text, `var(--color-text-muted)`
- Optional ℹ️ icon
- Background: `var(--color-bg-subtle)`, no border, `var(--radius-sm)`
- Text: "This post contains affiliate links. If you purchase through our links, we may earn a small commission at no extra cost to you. This helps us keep the site running. We only recommend products we genuinely believe in."

---

### 5.8 RelatedArticles
Internal links. Keeps users on site, reduces bounce. **Placed at the END of the article body** (after FAQ, before the disclaimer) — *not* in the sidebar (design change 2026-06-15).

**Visual:**
- "You might also like" label
- 2–3 article cards, each: thumbnail (4:3 ratio), title (2 lines max, truncated), category pill badge
- Entire card is clickable (no separate CTA button)
- **Responsive:** Figma component set, property `Layout` = `Row` (desktop, full-width 3-card row) | `Stacked` (mobile, full-width cards stacked)

---

### 5.9 CalloutBox
Highlighted information inline within article text. Four variants.

**Visual:**
| Variant | Border | Icon | Background |
|---------|--------|------|------------|
| `tip` | green | 💡 | `var(--color-primary-bg)` |
| `warning` | orange | ⚠️ | `var(--color-accent-bg)` |
| `note` | blue | 📝 | `#EEF4FF` |
| `danger` | red | ❌ | `#FFEEEE` |

All: `var(--radius-md)`, padding 16px, 15px font size. Optional bold title line.

---

### 5.10 ImageWithCaption
Optimized article image with accessible alt text and visible caption.

**Visual:**
- Full content-column width (720px max), responsive
- Caption: 13px, italic, `var(--color-text-muted)`, centered
- `var(--radius-md)` on image

---

### 5.11 VerdictCards
Quick verdict at top of Comparison articles. Two products side by side, immediate CTA.

**Visual:**
- CSS Grid (1fr 1fr), "vs" badge in center
- Each card: product image (120×120px), name (H3), "Best for:" one-liner, affiliate CTA button
- Winner card: `border: 2px solid var(--color-primary)`, "Our Pick ✓" badge top-right
- Non-winner: normal border
- "vs" badge: circular, `var(--color-bg-subtle)`, `var(--color-text-muted)`
- Mobile: stacked vertically — Figma component set, property `Layout` = `Row` | `Stacked`

---

### 5.12 HeadToHeadTable
Criterion-by-criterion comparison in Comparison articles.

**Visual:**
- Rows = criteria, columns = Product A | Product B
- First column: criterion label, bold, `var(--color-text-secondary)`
- Winner of each row: green text + checkmark
- Last row: "Overall verdict" spanning to show winner
- Header: product names as links, product thumbnails (40×40px) above names
- Mobile: **horizontal swipe** — same pattern as ComparisonTable (fixed ~600px inside a clipped scroll wrapper + "→ swipe" hint)

---

### 5.13 VerdictBlock
"Our Verdict" section in Comparison articles. Guides undecided readers to a decision.

**Visual:**
- Two-column section, stacked on mobile — Figma component set, property `Layout` = `Row` | `Stacked`
- Each column: "Buy [Product] if..." heading + 2–3 bullet points + affiliate CTA button
- Background: `var(--color-bg-subtle)`, `var(--radius-lg)`

---

### 5.14 WhatYouNeedList
Materials/tools list in How-to articles. Two variants.

**Full inline variant:**
- H2: "What You'll Need"
- Checklist style: checkbox icon (decorative), item name, optional "~$price", optional "Buy on Amazon →" link in muted green
- Optional grouping: "Tools" / "Materials"

**Sidebar mini variant:**
- "What you'll need" label, small
- Compact list, 13px font
- "See full list ↓" anchor link

---

### 5.15 StepBlock
Single numbered step in How-to articles.

**Visual:**
- Step number: large circle (40px), `var(--color-primary)` background, white number
- H2 next to the circle: "Step N: [Action]"
- Body text below
- Optional image (full-width with caption)
- Optional CalloutBox (tip or warning)
- Subtle top border separating each step

---

### 5.16 ProductInlineCard
Small inline product recommendation. Less prominent than ProductHeroCard — feels like a helpful mention, not a hard sell.

**Visual:**
- Compact horizontal card: image left (64×64px) | content right
- Content: product name (link), price, "View on Amazon →" text link
- Background: `var(--color-bg-subtle)`, `var(--radius-md)`
- No star rating, no badge

---

## 9. Global Components

| Component | Description |
|-----------|-------------|
| `Header` | Logo, main navigation (Home, Indoor Plants, Small Space Org, Lawn & Outdoor, Balcony & Garden), optional search icon |
| `Footer` | Links (About, Affiliate Disclosure, Privacy Policy), copyright, short disclaimer |
| `ArticleCard` | Preview card: hero image, category badge, title, 1-line excerpt, read time |
| `AuthorBox` | Bottom of every article. Name, avatar, 2-line bio. Builds E-E-A-T trust signals. |
| `PinterestSaveButton` | Hover overlay on all article images. Opens Pinterest save dialog with pre-filled description. |

---

## 10. Pinterest Image Spec

Every article hero image must work as a standalone Pinterest pin:
- Aspect ratio: **2:3 (vertical)**
- Minimum width: **1000px**
- Must include **text overlay**: article title + optional subtitle
- Alt text required
- This is also the `og:image` for Pinterest pins
