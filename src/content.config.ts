import { glob } from "astro/loaders";
import { defineCollection } from "astro:content";
import { z } from "astro/zod";

// Products data collection (HomeStem). One YAML file per product; the filename
// is the slug referenced from article frontmatter (`editorsPick`,
// `compareProducts`) and from the `src/lib/products.ts` helper. Keep
// `affiliateUrl` as the full Amazon link — AffiliateLink appends the tracking tag.
const productsCollection = defineCollection({
  loader: glob({ pattern: "**/*.{yaml,yml,json}", base: "src/content/products" }),
  schema: z.object({
    name: z.string(),
    image: z.string(),
    imageAlt: z.string(),
    affiliateUrl: z.url(),
    price: z.string(),
  }),
});

// Articles collection schema (HomeStem) — see docs/homestem-code-spec.md §3
const articlesCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "src/content/articles" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      meta_title: z.string().optional(),
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
      heroImage: image(),
      heroImageAlt: z.string(),
      editorsPick: z.string().optional(),
      compareProducts: z.array(z.string()).optional(),
      // how-to: tools/materials checklist. Single source for the in-body
      // WhatYouNeedList (full) and the sidebar WhatYouNeedMini.
      essentials: z
        .array(
          z.object({
            name: z.string(),
            estimatedCost: z.string().optional(),
            affiliateUrl: z.url().optional(),
            category: z.enum(["tool", "material"]).optional(),
          }),
        )
        .optional(),
      seasonal: z.boolean().default(false),
      affiliate: z.boolean().default(true),
      draft: z.boolean().default(false),
    }),
});

// Export collections
export const collections = {
  articles: articlesCollection,
  products: productsCollection,
};
