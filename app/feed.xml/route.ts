import { getLiveArticles, getArticleTimestamp } from '@/lib/public-data';

export const revalidate = 60; // Revalidate every 60 seconds for instant social media & RSS updates

function escapeXml(unsafe: string): string {
  return (unsafe || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  const baseUrl = 'https://www.technova-ai.online';
  const articles = await getLiveArticles();

  const itemsXml = articles
    .slice(0, 50)
    .map((article) => {
      const ts = getArticleTimestamp(article);
      const pubDate = ts ? new Date(ts).toUTCString() : new Date().toUTCString();
      const articleUrl = `${baseUrl}/article/${article.id}`;
      return `    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${articleUrl}</link>
      <guid isPermaLink="true">${articleUrl}</guid>
      <description>${escapeXml(article.excerpt || '')}</description>
      <category>${escapeXml(article.category || 'Tech')}</category>
      <author>team@technova-ai.online (${escapeXml(article.author?.name || 'TechNova AI Team')})</author>
      <pubDate>${pubDate}</pubDate>
    </item>`;
    })
    .join('\n');

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>TechNova AI — Discover, Compare &amp; Master the Best AI &amp; Tech Tools</title>
    <link>${baseUrl}</link>
    <description>Your go-to source for in-depth reviews, comparisons, and guides on the latest AI tools, software, and digital productivity solutions.</description>
    <language>en-US</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
${itemsXml}
  </channel>
</rss>`;

  return new Response(rssXml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 's-maxage=60, stale-while-revalidate=300',
    },
  });
}
