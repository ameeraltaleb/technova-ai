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

export async function getLiveArticles(options?: { includeUnpublished?: boolean }): Promise<ArticleItem[]> {
  const includeUnpublished = Boolean(options?.includeUnpublished);

  try {
    const colRef = collection(db, 'articles');
    const snap = await getDocs(colRef);
    if (!snap.empty) {
      const firestoreArticles = snap.docs.map((d) => d.data() as ArticleItem);
      // Merge with static articles so existing articles are never lost
      const firestoreIds = new Set(firestoreArticles.map((a) => a.id));
      const remainingStatic = (ARTICLES as unknown as ArticleItem[]).filter(
        (a) => !firestoreIds.has(a.id)
      );
      const combined = [...firestoreArticles, ...remainingStatic];
      const uniqueMap = new Map<string, ArticleItem>();
      for (const art of combined) {
        if (art.id && !uniqueMap.has(art.id)) {
          uniqueMap.set(art.id, art);
        }
      }
      const sorted = sortArticlesByNewest(Array.from(uniqueMap.values()));
      return includeUnpublished ? sorted : sorted.filter(isArticlePublished);
    }
  } catch (error) {
    console.warn('getLiveArticles fallback to static:', error);
  }
  const uniqueMap = new Map<string, ArticleItem>();
  for (const art of (ARTICLES as unknown as ArticleItem[])) {
    if (art.id && !uniqueMap.has(art.id)) {
      uniqueMap.set(art.id, art);
    }
  }
  const sorted = sortArticlesByNewest(Array.from(uniqueMap.values()));
  return includeUnpublished ? sorted : sorted.filter(isArticlePublished);
}

export async function getLiveArticleById(id: string, options?: { allowUnpublished?: boolean }): Promise<ArticleItem | null> {
  const allowUnpublished = options?.allowUnpublished ?? true;
  let article: ArticleItem | null = null;

  try {
    const docRef = doc(db, 'articles', id);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      article = snap.data() as ArticleItem;
    }
  } catch (error) {
    console.warn(`getLiveArticleById(${id}) fallback:`, error);
  }

  if (!article) {
    const found = ARTICLES.find((a) => a.id === id);
    article = (found as unknown as ArticleItem) || null;
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
