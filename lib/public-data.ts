import { db } from './firebase';
import { collection, getDocs, doc, getDoc, query, orderBy } from 'firebase/firestore';
import { ARTICLES, TOOLS, NEWS, CATEGORIES } from './data';
import { ArticleItem, ToolItem, NewsItem } from './admin-store';

export function getArticleTimestamp(
  article: ArticleItem & { updatedAt?: any; createdAt?: any }
): number {
  if (article.updatedAt) {
    if (typeof article.updatedAt.toMillis === 'function') return article.updatedAt.toMillis();
    if (typeof article.updatedAt.seconds === 'number') return article.updatedAt.seconds * 1000;
    if (article.updatedAt.timestampValue) {
      const t = new Date(article.updatedAt.timestampValue).getTime();
      if (!isNaN(t) && t > 0) return t;
    }
    const t = new Date(article.updatedAt).getTime();
    if (!isNaN(t) && t > 0) return t;
  }
  if (article.createdAt) {
    if (typeof article.createdAt.toMillis === 'function') return article.createdAt.toMillis();
    if (typeof article.createdAt.seconds === 'number') return article.createdAt.seconds * 1000;
    if (article.createdAt.timestampValue) {
      const t = new Date(article.createdAt.timestampValue).getTime();
      if (!isNaN(t) && t > 0) return t;
    }
    const t = new Date(article.createdAt).getTime();
    if (!isNaN(t) && t > 0) return t;
  }
  if (article.date) {
    const t = new Date(article.date).getTime();
    if (!isNaN(t) && t > 0) return t;
  }
  return 0;
}

export function sortArticlesByNewest<T extends ArticleItem>(articles: T[]): T[] {
  return [...articles].sort((a, b) => getArticleTimestamp(b) - getArticleTimestamp(a));
}

export function isArticlePublished(article: ArticleItem): boolean {
  if (article.status === 'draft') return false;
  // If explicitly published, it is ALWAYS published immediately
  if (article.status === 'published') return true;
  // If scheduled, only suppress from automated listings (homepage, RSS) until scheduled time
  if (article.status === 'scheduled') {
    if (article.scheduledFor) {
      const scheduledTime = new Date(article.scheduledFor).getTime();
      if (!isNaN(scheduledTime) && Date.now() < scheduledTime) {
        return false;
      }
    }
  }
  return true;
}

const SEO_OPTIMIZED_SLUGS = new Set([
  'top-10-ai-trends-us-tech-november-2026',
  'ai-cybersecurity-agentic-soc-crowdstrike-microsoft-copilot',
  'building-autonomous-ai-workflows-with-model-context-protocol',
  '10-ai-models-for-video-generation-changing-content-creation',
  'top-10-ai-services-revolutionizing-the-tech-landscape-in-the-usa',
  'sam-altman-you-dont-need-to-write-prompts-anymore',
  'top-30-ai-news-october-2026',
  'top-15-vpn-in-2026',
  'ai-in-us-universities-detector-bans-reversed',
  'webassembly-is-it-replacing-javascript',
  'why-rust-loved-programming-language',
]);

// Consolidated duplicate slugs permanently 301-redirected in next.config.ts
const REDIRECTED_DUPLICATE_SLUGS = new Set([
  'top-10-ai-trends-shaping-us-tech-late-2026',
  'sam-altman-prompt-engineering-dead-autonomous-agents',
  'building-production-ai-workflows-with-mcp',
  'sora-2-vs-runway-gen4-vs-kling-video-generation-showdown',
  'ai-video-generation-masterclass',
  'ai-agentic-soc-crowdstrike-microsoft-sentinel-2026',
  'best-vpn-2026',
  'webassembly-wasm-explained',
  'rust-systems-programming-2026',
]);

let cachedAllArticles: ArticleItem[] | null = null;
let cachedAt = 0;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5-minute memory cache to prevent exhausting Firestore 50k/day free read quota

export async function getLiveArticles(options?: { includeUnpublished?: boolean }): Promise<ArticleItem[]> {
  const includeUnpublished = Boolean(options?.includeUnpublished);
  const now = Date.now();

  if (typeof window === 'undefined' && cachedAllArticles && now - cachedAt < CACHE_TTL_MS) {
    return includeUnpublished ? cachedAllArticles : cachedAllArticles.filter(isArticlePublished);
  }

  const staticMap = new Map<string, ArticleItem>();
  for (const art of (ARTICLES as unknown as ArticleItem[])) {
    if (art.id && !staticMap.has(art.id)) {
      staticMap.set(art.id, art);
    }
  }

  try {
    const colRef = collection(db, 'articles');
    const snap = await getDocs(colRef);
    if (!snap.empty) {
      const firestoreArticles = snap.docs
        .map((d) => {
          const data = d.data() as ArticleItem;
          if (SEO_OPTIMIZED_SLUGS.has(data.id) && staticMap.has(data.id)) {
            const st = staticMap.get(data.id)!;
            return {
              ...data,
              title: st.title,
              excerpt: st.excerpt,
              content: st.content,
              readTime: st.readTime,
            };
          }
          return data;
        })
        .filter((a) => !REDIRECTED_DUPLICATE_SLUGS.has(a.id));
      const firestoreIds = new Set(firestoreArticles.map((a) => a.id));
      const remainingStatic = Array.from(staticMap.values()).filter(
        (a) => !firestoreIds.has(a.id) && !REDIRECTED_DUPLICATE_SLUGS.has(a.id)
      );
      const combined = [...firestoreArticles, ...remainingStatic];
      const uniqueMap = new Map<string, ArticleItem>();
      for (const art of combined) {
        if (art.id && !uniqueMap.has(art.id)) {
          uniqueMap.set(art.id, art);
        }
      }
      const sorted = sortArticlesByNewest(Array.from(uniqueMap.values()));
      if (typeof window === 'undefined') {
        cachedAllArticles = sorted;
        cachedAt = now;
      }
      return includeUnpublished ? sorted : sorted.filter(isArticlePublished);
    }
  } catch (error) {
    console.warn('getLiveArticles fallback to static:', error);
  }
  const sorted = sortArticlesByNewest(Array.from(staticMap.values()));
  if (typeof window === 'undefined') {
    cachedAllArticles = sorted;
    cachedAt = now;
  }
  return includeUnpublished ? sorted : sorted.filter(isArticlePublished);
}

export async function getLiveArticleById(id: string, options?: { allowUnpublished?: boolean }): Promise<ArticleItem | null> {
  const staticFound = (ARTICLES.find((a) => a.id === id) as unknown as ArticleItem) || null;

  // Use the in-memory cache first if warm to save Firestore reads
  if (typeof window === 'undefined' && cachedAllArticles && Date.now() - cachedAt < CACHE_TTL_MS) {
    const cachedMatch = cachedAllArticles.find((a) => a.id === id);
    if (cachedMatch) {
      if (cachedMatch.status === 'draft' && !options?.allowUnpublished) return null;
      return cachedMatch;
    }
  }

  let article: ArticleItem | null = null;

  try {
    const docRef = doc(db, 'articles', id);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      article = snap.data() as ArticleItem;
      if (article && SEO_OPTIMIZED_SLUGS.has(id) && staticFound) {
        article = {
          ...article,
          title: staticFound.title,
          excerpt: staticFound.excerpt,
          content: staticFound.content,
          readTime: staticFound.readTime,
        };
      }
    }
  } catch (error) {
    console.warn(`getLiveArticleById(${id}) fallback:`, error);
  }

  if (!article) {
    article = staticFound;
  }

  if (!article) return null;

  // Only hide from public viewing if the article is strictly an unfinished draft
  if (article.status === 'draft' && !options?.allowUnpublished) {
    return null;
  }

  return article;
}

export async function getLiveTools(): Promise<ToolItem[]> {
  try {
    const colRef = collection(db, 'tools');
    const snap = await getDocs(colRef);
    if (!snap.empty) {
      const firestoreTools = snap.docs.map((d) => d.data() as ToolItem);
      const firestoreIds = new Set(firestoreTools.map((t) => t.id));
      const remainingStatic = (TOOLS as ToolItem[]).filter((t) => !firestoreIds.has(t.id));
      return [...firestoreTools, ...remainingStatic];
    }
  } catch (error) {
    console.warn('getLiveTools fallback to static:', error);
  }
  return TOOLS as ToolItem[];
}

export async function getLiveNews(): Promise<NewsItem[]> {
  try {
    const colRef = collection(db, 'news');
    const snap = await getDocs(colRef);
    if (!snap.empty) {
      const firestoreNews = snap.docs.map((d) => d.data() as NewsItem);
      const firestoreIds = new Set(firestoreNews.map((n) => n.id));
      const remainingStatic = (NEWS as NewsItem[]).filter((n) => !firestoreIds.has(n.id));
      return [...firestoreNews, ...remainingStatic];
    }
  } catch (error) {
    console.warn('getLiveNews fallback to static:', error);
  }
  return NEWS as NewsItem[];
}

export function getCategoriesWithCounts(articles: ArticleItem[]) {
  const counts: Record<string, number> = {};
  for (const art of articles) {
    if (art.category) {
      counts[art.category] = (counts[art.category] || 0) + 1;
    }
  }
  return CATEGORIES.map((cat) => ({
    ...cat,
    count: counts[cat.id] || 0,
  }));
}
