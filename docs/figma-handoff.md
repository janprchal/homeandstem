# HomeStem — Figma Design System Handoff
*Use this file as context when starting a Claude Code session with Figma MCP.*
*Figma file: https://www.figma.com/design/kFyEtVBYBwiAsJItoyxU2I/Homeandstem*

---

## ✅ As-built status & updates (2026-06-15)

**The design system AND all page designs are BUILT** — this file's Phase 1–3 instructions are now historical (kept for reference). Current state of the Figma file:

- **Pages:** 🎨 Cover · 🔤 Foundations · Atoms · Components — Product · Components — Article · Components — Navigation · 🏠 Homepage · 📄 Article — Listicle / Buying Guide / Comparison / How-to. Each article page and the homepage have a **desktop frame + a 375px mobile frame**.
- **Responsive component SETS** (variant property `Layout`) — added so mobile reflows without detaching instances:
  | Component | Variants | Desktop / Mobile |
  |-----------|----------|------------------|
  | ProductHeroCard | `Layout=Horizontal` / `Layout=Stacked` | image-left / image-top + full-width CTA |
  | VerdictCards | `Layout=Row` / `Layout=Stacked` | 2 cards + vs / stacked |
  | VerdictBlock | `Layout=Row` / `Layout=Stacked` | 2 panels / stacked |
  | RelatedArticles | `Layout=Row` / `Layout=Stacked` | 3-card row / stacked |
- **Article hero = overlay banner** (not a 2:3 image in body): full-bleed photo + dark-green `#1B4332` scrim + bottom-left `hero-content` = **eyebrow-row (category Tag + article-type Badge)** + white H1 + meta line. Desktop ≈1100×440, mobile ≈375×400. Same pattern as the homepage hero.
- **Eyebrow** uses real component instances: **Tag** (category) + **Badge** `Style=Accent` (article type) — never plain text.
- **Flat cards (no shadows):** ProductHeroCard & ComparisonTable (and all cards/tables) use `1px color/border` + radius, **no drop shadow**. The `shadow/card` effect styles are deprecated for cards (owner preference — avoid heavy shadows). 
- **RelatedArticles placement:** END of the article body (after FAQ, before AffiliateDisclaimer) — **removed from the sidebar**. Sidebars now hold only TableOfContents + one type-specific widget (EditorsPick / VerdictMini / WhatYouNeedMini).
- **Tables on mobile** (ComparisonTable, HeadToHeadTable): horizontal **swipe** — table fixed ~600px inside a clipped scroll frame + "→ swipe" hint.
- **Mobile body recipe:** single column, padding 20, gap 28; sidebar widgets move below the intro.

## ✅ Logo update (2026-06-17)

- **New "Logo" section** added to the `🔤 Foundations` page, right after Radius, following the same section-header pattern (32×3 `color/primary` rule + DM Sans Medium 22 title). Contains three components:
  - `Logo / Primary Mark` — full-color roof+sprout glyph, fills bound to `color/primary` (roof/base) and `color/accent` (sprout). Use on light backgrounds.
  - `Logo / Favicon Mark` — simplified single-glyph version (sprout only, white knockout on a `color/primary` circular tile). The full 3-shape mark wasn't legible at favicon scale, so this is a deliberately reduced glyph; tested at 16/32/48/256px.
  - `Logo / Mark · On Dark` — plain white version of the full mark, for dark backgrounds where `color/primary` shapes would blend into the bg (e.g. the Cover page).
- **Header & Footer master components** (`Components — Navigation` page) now use a real instance of `Logo / Primary Mark` instead of the old green-dot-+-text placeholder. Since both are real component instances elsewhere, this cascades automatically to Homepage and all 4 article-type pages (desktop).
- **Cover page** title lockup now uses `Logo / Mark · On Dark` + the wordmark (the redundant accent-dot ellipse that used to sit next to the wordmark was removed).
- **Mobile** (Homepage + all 4 article-type 375px shells): Header and Footer both got the icon added. Header keeps the **full icon + "HomeStem" wordmark** — initially built icon-only to save space, but since mobile nav is already collapsed behind a hamburger menu there's no real space constraint, so it matches desktop/footer for brand consistency.
- Logo masters live as components on the Foundations page (`362:2` Primary Mark, `362:3` Favicon Mark, `372:9` Mark · On Dark at time of writing — re-resolve via `figma.currentPage.query('COMPONENT[name^=Logo]')` if these drift).

## ✅ Logo synced to code (2026-06-22)

The Figma-side Logo work above is now mirrored in the Astro repo:
- `Logo / Favicon Mark` exported and live as `public/images/favicon.png` (48×48), wired via `config.json → site.favicon`.
- `Logo / Mark · On Dark` + the DM Sans/Lora wordmark+tagline exported as `public/images/og-image.png` (1200×630, on the `color/primary` dark-green bg), wired via `config.json → metadata.meta_image` and `Base.astro`'s `og:image`.
- `Logo / Primary Mark` re-created as inline SVG in a new shared `src/layouts/components/homestem/Logo.astro` component, used by both `Header.astro` and `Footer.astro` — replacing the old CSS dot + bold-text placeholder. Matches the Figma Header/Footer master components exactly (24.66×28 mark, 8px gap, "HomeStem" in DM Sans Medium 18/`color/primary`).
- The leftover `public/images/logo.png` (unused Bookworm theme asset, not the HomeStem mark) was deleted from the repo.

The sections below are the original build brief.

---

## Your task

Build a complete design system for HomeStem in Figma following the atomic design workflow below. Work incrementally — tokens first, then atoms, then components. Stop for review after atoms.

---

## Phase 1 — Design Tokens (do this first)

Set up all tokens as Figma variables before touching any components.

### Collections to create

**Collection: "Primitives"** (1 mode: Value)
Raw values — set scopes to `[]` (hidden from pickers).

```
green/900  = #1B4332
green/800  = #2D6A4F   ← primary brand color
green/700  = #40916C
green/500  = #52B788   ← primary light / hover
green/100  = #D8F3DC   ← primary bg
amber/500  = #F4A261   ← accent
amber/100  = #FFF3E0   ← accent bg
red/600    = #C0392B   ← danger / cons
orange/600 = #E67E22   ← warning
blue/600   = #2980B9   ← info
gray/900   = #1A1A1A   ← text primary
gray/600   = #555555   ← text secondary
gray/400   = #888888   ← text muted
gray/50    = #FAFAF8   ← page bg
white      = #FFFFFF   ← card bg
gray/100   = #F5F5F0   ← subtle bg
gray/200   = #E0E0D8   ← border
gray/300   = #C8C8BE   ← border strong
```

**Collection: "Color"** (2 modes: Light / Dark)
Semantic aliases — set proper scopes.

| Token | Light | Dark | Scope |
|-------|-------|------|-------|
| color/primary | → green/800 | → green/500 | FRAME_FILL, SHAPE_FILL |
| color/primary-light | → green/500 | → green/700 | FRAME_FILL, SHAPE_FILL |
| color/primary-bg | → green/100 | → green/900 | FRAME_FILL, SHAPE_FILL |
| color/accent | → amber/500 | → amber/500 | FRAME_FILL, SHAPE_FILL |
| color/accent-bg | → amber/100 | → amber/100 | FRAME_FILL, SHAPE_FILL |
| color/text-primary | → gray/900 | → white | TEXT_FILL |
| color/text-secondary | → gray/600 | → gray/400 | TEXT_FILL |
| color/text-muted | → gray/400 | → gray/600 | TEXT_FILL |
| color/bg-page | → gray/50 | → gray/900 | FRAME_FILL |
| color/bg-card | → white | → gray/900 | FRAME_FILL, SHAPE_FILL |
| color/bg-subtle | → gray/100 | → gray/800 | FRAME_FILL, SHAPE_FILL |
| color/border | → gray/200 | → gray/700 | STROKE_COLOR |
| color/border-strong | → gray/300 | → gray/600 | STROKE_COLOR |
| color/danger | → red/600 | → red/600 | FRAME_FILL, SHAPE_FILL, TEXT_FILL |
| color/warning | → orange/600 | → orange/600 | TEXT_FILL |
| color/info | → blue/600 | → blue/600 | TEXT_FILL |

**Collection: "Spacing"** (1 mode: Value)
Scopes: `GAP`, `HORIZONTAL_PADDING`, `VERTICAL_PADDING`

```
spacing/1 = 4
spacing/2 = 8
spacing/3 = 12
spacing/4 = 16
spacing/5 = 24
spacing/6 = 32
spacing/7 = 48
spacing/8 = 64
```

**Collection: "Radius"** (1 mode: Value)
Scope: `CORNER_RADIUS`

```
radius/sm = 4
radius/md = 8
radius/lg = 12
radius/xl = 16
```

### Text styles to create

Font pairing: **DM Sans** (headings) + **Lora** (body)

| Style name | Font | Size | Weight | Line height |
|------------|------|------|--------|-------------|
| heading/h1 | DM Sans | 36 | Medium (500) | 1.2 |
| heading/h2 | DM Sans | 28 | Medium (500) | 1.2 |
| heading/h3 | DM Sans | 22 | Medium (500) | 1.2 |
| heading/h4 | DM Sans | 18 | Medium (500) | 1.3 |
| body/base | Lora | 17 | Regular (400) | 1.75 |
| body/small | Lora | 15 | Regular (400) | 1.75 |
| body/caption | Lora | 13 | Regular (400) | 1.5 |
| label/default | DM Sans | 14 | Medium (500) | 1.4 |
| label/small | DM Sans | 12 | Medium (500) | 1.4 |
| label/xs | DM Sans | 11 | Medium (500) | 1.3 |

### Effect styles to create

| Style name | Type | Values |
|------------|------|--------|
| shadow/card | Drop shadow | x:0 y:1 blur:3 spread:0 color:#000 opacity:8% |
| shadow/card-hover | Drop shadow | x:0 y:4 blur:12 spread:0 color:#000 opacity:10% |

> ⚠️ **Deprecated for cards (2026-06-15):** the design moved to **flat depth** — cards/tables use a `1px color/border` + radius, **no drop shadow**. These effect styles exist but should not be applied to product cards, ComparisonTable, etc.

---

## Phase 2 — Atoms (build after tokens)

### Button — Primary CTA
Used for Amazon affiliate links. Most important atom.

Variants: Size=[Default, Large] × State=[Default, Hover, Disabled]

- Background: color/primary
- Text: white, label/default
- Padding: 12px 20px (Default), 16px 24px (Large)
- Radius: radius/md
- Hover: background → color/primary-light
- Disabled: opacity 50%
- Text: "Check price on Amazon →"
- Full-width option (stretch to container)

### Button — Text Link
For inline affiliate links in body text.

Variants: State=[Default, Hover]

- Text color: color/primary
- Underline on hover
- No background

### Badge
Small label for product categories and "Best Overall" type tags.

Variants: Style=[Brand, Neutral, Accent]

- Brand: background color/primary-bg, text color/primary
- Neutral: background color/bg-subtle, text color/text-secondary
- Accent: background color/accent-bg, text color/accent
- Font: label/small
- Padding: 4px 10px
- Radius: radius/md

### Star Rating
Visual stars for product ratings. 1–5 stars.

Variants: Rating=[1, 2, 3, 4, 4.5, 5]

- Filled star: color/accent (#F4A261)
- Empty star: color/border
- Size: 16px each, gap 2px

### Divider
Simple horizontal separator.

- Color: color/border
- Width: 100%
- Height: 1px

### Tag / Category pill
For article category display.

- Background: color/bg-subtle
- Text: label/small, color/text-secondary
- Padding: 4px 12px
- Radius: radius/md (pill shape)

### Callout Box
Highlighted info block inside articles. 4 variants.

Variants: Type=[Tip, Warning, Note, Danger]

- Tip: left border color/primary, background color/primary-bg, 💡 icon
- Warning: left border color/warning, background color/accent-bg, ⚠️ icon
- Note: left border color/info, background #EEF4FF, 📝 icon
- Danger: left border color/danger, background #FFEEEE, ❌ icon
- Padding: 16px
- Radius: radius/md (no rounded corners on left side where border is)
- Optional title: label/default
- Body text: body/small

---

## Phase 3 — Components (build after atom review)

### ProductHeroCard
Primary conversion component. **As built: component SET, property `Layout` = Horizontal | Stacked. Flat (1px color/border, no shadow).**

Layout=Horizontal (desktop): image left (200×200) | content right
Layout=Stacked (mobile): image top (full width, ~190h) | content below, full-width CTA

Content area:
- Optional badge (Best Overall / Best Budget / Editor's Pick) — use Badge atom
- Product name H3, affiliate link style
- StarRating atom
- Price: body/base bold, "~$49.99"
- Price note: "Price may vary. Check Amazon for current price." body/caption, color/text-muted
- CTA button: primary button atom, full width on mobile
- Hover: border → color/primary-light (no shadow — flat)

Props: name, image, imageAlt, affiliateUrl, rating, price, badge?

---

### ComparisonTable
Columns: # | Product | Price | Rating | Best for. **Flat (1px color/border, no shadow).**
- Sticky header on scroll (desktop)
- Alternating rows: white / color/bg-subtle
- Product name: color/primary link + external icon
- Rating: StarRating atom
- Top row: left border color/primary
- Mobile: horizontal **swipe** — table fixed ~600px inside a clipped scroll frame + "→ swipe" hint

---

### ProsConsList
Variants: displayed inline in product blocks

- Pros column: green checkmark ✓, background color/primary-bg
- Cons column: red X, background #FFEEEE
- Two-column desktop, stacked mobile
- radius/md on container
- Max 2–3 pros, 1–2 cons

---

### TableOfContents
Sidebar navigation, sticky.

- No card/border — clean borderless list
- "In this article" label: label/xs, color/text-muted
- Links: label/small, color/text-secondary
- Active link: color/primary, weight 500, small left border
- H3 links indented 12px from H2
- Mobile: collapsed toggle

---

### EditorsPick
Sidebar widget, sticky.

- Background: color/primary-bg, left border: color/primary
- "Editor's Pick" label: label/xs uppercase
- Product image: 80×80px rounded
- Product name: label/default bold
- Price: label/small, color/text-secondary
- CTA: primary button atom, full width
- Max width: 280px

---

### FAQ
Accordion of Q&A pairs.

- H2 "Frequently Asked Questions"
- Question: label/default bold
- Answer: body/base
- Divider between items
- Collapsible on mobile (expanded default on desktop)

---

### AffiliateDisclaimer
Static component, no variants.

- Background: color/bg-subtle, radius/sm
- Text: body/caption, color/text-muted
- ℹ️ icon optional
- Text: "This post contains affiliate links. If you purchase through our links, we may earn a small commission at no extra cost to you. This helps us keep the site running. We only recommend products we genuinely believe in."

---

### RelatedArticles
"You might also like" section. **As built: component SET, `Layout` = Row | Stacked. Placed at the END of the article body (after FAQ), NOT in the sidebar.**

- Layout=Row (desktop): 2–3 article cards in a full-width row
- Layout=Stacked (mobile): cards stacked, full width
- Each card: thumbnail (4:3), category badge, title (2 lines max)
- Entire card clickable

---

### VerdictCards
For Comparison article type only. Two products side by side. **As built: component SET, `Layout` = Row | Stacked.**

- Layout=Row (desktop): 1fr 1fr, "vs" badge center
- Each card: product image 120×120, H3 name, "Best for:" one-liner, CTA button
- Winner card: border 2px color/primary, "Our Pick ✓" badge
- Layout=Stacked (mobile): cards stacked vertically, "vs" between

---

### HeadToHeadTable
For Comparison articles. Criteria rows, products as columns. **Flat (1px color/border, no shadow).**

- First column: criterion label
- Winner cell: color/primary text + checkmark
- Last row: "Overall verdict"
- Product name headers = affiliate links
- Mobile: horizontal **swipe** — same pattern as ComparisonTable

---

### VerdictBlock
"Our Verdict" section. Two columns. **As built: component SET, `Layout` = Row | Stacked.**

- "Buy [Product A] if..." + bullet points + CTA button
- Background: color/bg-subtle, radius/lg
- Layout=Row (desktop) two panels / Layout=Stacked (mobile) panels stacked

---

### WhatYouNeedList
For How-to articles. Two variants: full (inline) and mini (sidebar).

Full: checklist with item name, optional "~$price", optional Amazon link
Mini: compact, "See full list ↓" link

---

### StepBlock
Numbered step in How-to articles.

- Step number: 40px circle, color/primary background, white number
- H2 next to circle
- Body text below
- Optional: image, CalloutBox, ProductInlineCard
- Subtle top border between steps

---

### ProductInlineCard
Small inline product mention. Less prominent than ProductHeroCard.

- Horizontal: image 64×64 left | name (link) + price + "View on Amazon →" right
- Background: color/bg-subtle, radius/md
- No star rating, no badge

---

### ArticleCard
Preview card for homepage and category pages.

- Hero image (16:9 or 4:3)
- Category badge + read time
- Title (2 lines max)
- 1-line excerpt
- Entire card clickable

---

### AuthorBox
Bottom of every article. E-E-A-T trust signal.

- Avatar (circular, 60px)
- Name: heading/h4
- 2-line bio: body/small, color/text-secondary
- Background: color/bg-subtle, radius/lg

---

### Header
Full width. Logo left, navigation center/right.

- Nav items: Home, Indoor Plants, Small Space Org, Lawn & Outdoor, Balcony & Garden
- Mobile: hamburger menu (design TBD)

---

### Footer
Full width, multi-column.

- Logo + tagline
- Navigation links
- Social icons (Pinterest primary)
- Legal: Affiliate Disclosure, Privacy Policy
- Copyright

---

## File structure in Figma

Create pages in this order:
1. 🎨 Cover
2. 🔤 Foundations (tokens overview)
3. --- (separator)
4. Atoms
5. Components — Product
6. Components — Article
7. Components — Navigation
8. --- (separator)
9. 📄 Article — Listicle
10. 📄 Article — Buying Guide
11. 📄 Article — Comparison
12. 📄 Article — How-to

---

## Key constraints

- Mobile-first (375px primary)
- All colors bound to variables — never hardcode
- All spacing bound to spacing tokens
- Affiliate CTAs: `target="_blank"` + `rel="nofollow noopener sponsored"` (note in component description)
- Amazon tracking ID: `homeandstem-20` (note wherever CTAs are documented)
- Pinterest hero images: 2:3 ratio, min 1000px wide

---

## Starting prompt for Claude Code

> "I have a Figma file open: https://www.figma.com/design/kFyEtVBYBwiAsJItoyxU2I/Untitled
> 
> Using the Figma MCP, build a design system for an affiliate blog called HomeStem. Start with Phase 1: create all design token variables (Primitives, Color, Spacing, Radius collections) and text/effect styles exactly as specified in the context I'm providing. Do not build any components yet — tokens first. Work incrementally, validate after each collection, and stop for my review when all tokens and styles are done."
