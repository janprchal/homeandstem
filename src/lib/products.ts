import { getEntry } from "astro:content";

// Product catalog access. Products live in the `products` data collection
// (`src/content/products/*.yaml`), one file per product with the filename as the
// slug. Article frontmatter references products by slug (`editorsPick`,
// `compareProducts`) and sidebar widgets resolve display data via `getProduct`.
// Affiliate URLs are stored as full Amazon links; AffiliateLink appends the tag.
export interface Product {
  slug: string;
  name: string;
  image: string;
  imageAlt: string;
  affiliateUrl: string;
  price: string;
}

export async function getProduct(slug?: string): Promise<Product | undefined> {
  if (!slug) return undefined;
  const entry = await getEntry("products", slug);
  return entry ? { slug: entry.id, ...entry.data } : undefined;
}
