import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import config from "@/config/config.json";
import { sortByPubDate } from "@/lib/articleCard";

export async function GET(context) {
  const articles = sortByPubDate(
    await getCollection("articles", ({ data }) => !data.draft),
  );

  return rss({
    title: config.site.title,
    description: config.metadata.meta_description,
    site: context.site,
    items: articles.map((article) => ({
      title: article.data.title,
      description: article.data.description,
      pubDate: article.data.pubDate,
      link: `/${article.id}`,
      categories: [article.data.category, ...article.data.tags],
    })),
  });
}
