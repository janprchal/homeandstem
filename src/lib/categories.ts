// HomeStem category taxonomy — the five fixed categories from the spec. Single
// source for slugs, display labels, nav order, and listing-page copy.
export interface CategoryMeta {
  slug: string;
  label: string;
  description: string;
}

export const categories: CategoryMeta[] = [
  {
    slug: "indoor-plants",
    label: "Indoor Plants",
    description:
      "Houseplant care, grow lights, and the gear that keeps your indoor jungle thriving.",
  },
  {
    slug: "small-space-org",
    label: "Small Space Org",
    description:
      "Smart storage and organization picks for apartments and compact homes.",
  },
  {
    slug: "lawn-outdoor",
    label: "Lawn & Outdoor",
    description:
      "Tools and tips for a healthier lawn, yard, and outdoor living space.",
  },
  {
    slug: "balcony-garden",
    label: "Balcony Garden",
    description:
      "Planters, containers, and low-maintenance ideas for balcony and patio gardens.",
  },
  {
    slug: "home-decor",
    label: "Home Decor",
    description: "Finishing touches and decor finds to make a house feel like home.",
  },
];

const bySlug = new Map(categories.map((c) => [c.slug, c]));

export function getCategory(slug: string): CategoryMeta | undefined {
  return bySlug.get(slug);
}

export function categoryLabel(slug: string): string {
  return bySlug.get(slug)?.label ?? slug.replace(/-/g, " ");
}
