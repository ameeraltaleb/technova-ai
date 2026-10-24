import type { MetadataRoute } from 'next';
import { CATEGORIES } from '@/lib/data';
import { getLiveArticles, getArticleTimestamp } from '@/lib/public-data';

export const revalidate = 3600; // Revalidate sitemap every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.technova-ai.online';

  // Fetch live articles from Firestore with fallback to initial articles (already sorted newest first)
  const liveArticles = await getLiveArticles();
  const latestArticleTs = liveArticles.length > 0 ? getArticleTimestamp(liveArticles[0]) : null;
  const latestDate = latestArticleTs ? new Date(latestArticleTs) : new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: latestDate, changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/category`, lastModified: latestDate, changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/tools`, lastModified: latestDate, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/news`, lastModified: latestDate, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ];

  const articlePages: MetadataRoute.Sitemap = liveArticles.map((article) => {
    const ts = getArticleTimestamp(article);
    return {
      url: `${baseUrl}/article/${article.id}`,
      lastModified: ts ? new Date(ts) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    };
  });

  const categoryPages: MetadataRoute.Sitemap = CATEGORIES.map((cat) => {
    const catArticles = liveArticles.filter((a) => a.category === cat.id);
    const latestCatTs = catArticles.length > 0 ? getArticleTimestamp(catArticles[0]) : null;
    return {
      url: `${baseUrl}/category/${cat.id}`,
      lastModified: latestCatTs ? new Date(latestCatTs) : latestDate,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    };
  });

  return [...staticPages, ...articlePages, ...categoryPages];
}
