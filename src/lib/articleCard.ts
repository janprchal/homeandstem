import readingTime from "@/lib/utils/readingTime";

// Maps an `articles` collection entry to the props ArticleCard expects.
export function toCardProps(article: any) {
  return {
    title: article.data.title,
    slug: article.id,
    image: article.data.heroImage.src,
    imageAlt: article.data.heroImageAlt,
    category: article.data.category,
    excerpt: article.data.description,
    readTime: article.body ? readingTime(article.body) : undefined,
  };
}

// Newest first.
export function sortByPubDate<T extends { data: { pubDate: Date } }>(
  items: T[],
): T[] {
  return [...items].sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  );
}
