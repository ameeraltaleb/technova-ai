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
    { url: `${baseUrl}/models`, lastModified: latestDate, changeFrequency: 'daily', priority: 0.85 },
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

  const allEntries = [...staticPages, ...articlePages, ...categoryPages];

  // Defensive deduplication across the entire combined sitemap
  const urlMap = new Map<string, MetadataRoute.Sitemap[number]>();

  for (const entry of allEntries) {
    if (!entry || !entry.url) continue;

    // Normalize URL: trim whitespace and trailing slashes (except root domain)
    let normalizedUrl = entry.url.trim();
    if (normalizedUrl !== baseUrl && normalizedUrl.endsWith('/')) {
      normalizedUrl = normalizedUrl.slice(0, -1);
    }

    const currentEntry = { ...entry, url: normalizedUrl };

    if (!urlMap.has(normalizedUrl)) {
      urlMap.set(normalizedUrl, currentEntry);
    } else {
      // Conflict resolution: preserve the entry with the most recent lastModified
      const existing = urlMap.get(normalizedUrl)!;
      const existingTime = existing.lastModified ? new Date(existing.lastModified).getTime() : 0;
      const newTime = currentEntry.lastModified ? new Date(currentEntry.lastModified).getTime() : 0;

      if (newTime > existingTime) {
        urlMap.set(normalizedUrl, currentEntry);
      } else if (newTime === existingTime) {
        // Tie-breaker: keep the higher priority entry
        if ((currentEntry.priority ?? 0) > (existing.priority ?? 0)) {
          urlMap.set(normalizedUrl, currentEntry);
        }
      }
    }
  }

  return Array.from(urlMap.values());
}
