'use client';

import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import {
  ArticleItem,
  ToolItem,
  NewsItem,
  ToolSubmission,
  SiteSettings,
} from './admin-store';
import { ARTICLES, TOOLS, NEWS } from './data';

export const FirebaseService = {
  // Articles
  async getArticles(): Promise<ArticleItem[]> {
    try {
      const colRef = collection(db, 'articles');
      const snap = await getDocs(colRef);
      if (snap.empty) return [];
      return snap.docs.map((d) => d.data() as ArticleItem);
    } catch (error) {
      console.warn('Firestore getArticles warning (using local fallback):', error);
      return [];
    }
  },

  async saveArticle(article: ArticleItem): Promise<void> {
    try {
      const docRef = doc(db, 'articles', article.id);
      await setDoc(
        docRef,
        {
          ...article,
          updatedAt: serverTimestamp(),
          createdAt: (article as any).createdAt || serverTimestamp(),
        },
        { merge: true }
      );
    } catch (error) {
      console.error('Firestore saveArticle error:', error);
      throw error;
    }
  },

  async deleteArticle(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'articles', id));
    } catch (error) {
      console.error('Firestore deleteArticle error:', error);
      throw error;
    }
  },

  // Tools
  async getTools(): Promise<ToolItem[]> {
    try {
      const colRef = collection(db, 'tools');
      const snap = await getDocs(colRef);
      if (snap.empty) return [];
      return snap.docs.map((d) => d.data() as ToolItem);
    } catch (error) {
      console.warn('Firestore getTools warning (using local fallback):', error);
      return [];
    }
  },

  async saveTool(tool: ToolItem): Promise<void> {
    try {
      const docRef = doc(db, 'tools', tool.id);
      await setDoc(docRef, { ...tool, updatedAt: serverTimestamp() }, { merge: true });
    } catch (error) {
      console.error('Firestore saveTool error:', error);
      throw error;
    }
  },

  async deleteTool(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'tools', id));
    } catch (error) {
      console.error('Firestore deleteTool error:', error);
      throw error;
    }
  },

  // News
  async getNews(): Promise<NewsItem[]> {
    try {
      const colRef = collection(db, 'news');
      const snap = await getDocs(colRef);
      if (snap.empty) return [];
      return snap.docs.map((d) => d.data() as NewsItem);
    } catch (error) {
      console.warn('Firestore getNews warning:', error);
      return [];
    }
  },

  async saveNews(item: NewsItem): Promise<void> {
    try {
      const docRef = doc(db, 'news', item.id);
      await setDoc(docRef, { ...item, updatedAt: serverTimestamp() }, { merge: true });
    } catch (error) {
      console.error('Firestore saveNews error:', error);
      throw error;
    }
  },

  async deleteNews(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'news', id));
    } catch (error) {
      console.error('Firestore deleteNews error:', error);
      throw error;
    }
  },

  // Submissions
  async getSubmissions(): Promise<ToolSubmission[]> {
    try {
      const colRef = collection(db, 'submissions');
      const snap = await getDocs(colRef);
      if (snap.empty) return [];
      return snap.docs.map((d) => d.data() as ToolSubmission);
    } catch (error) {
      console.warn('Firestore getSubmissions warning:', error);
      return [];
    }
  },

  async saveSubmission(submission: ToolSubmission): Promise<void> {
    try {
      const id = `${submission.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`;
      const docRef = doc(db, 'submissions', id);
      await setDoc(docRef, { ...submission, createdAt: serverTimestamp() });
    } catch (error) {
      console.error('Firestore saveSubmission error:', error);
    }
  },

  // Subscribers
  async getSubscribers(): Promise<{ email: string; date: string }[]> {
    try {
      const colRef = collection(db, 'subscribers');
      const snap = await getDocs(colRef);
      if (snap.empty) return [];
      return snap.docs.map((d) => d.data() as { email: string; date: string });
    } catch (error) {
      console.warn('Firestore getSubscribers warning:', error);
      return [];
    }
  },

  async addSubscriber(email: string): Promise<void> {
    try {
      const id = email.replace(/[^a-zA-Z0-9]/g, '_');
      const docRef = doc(db, 'subscribers', id);
      await setDoc(docRef, { email, date: new Date().toISOString().split('T')[0], createdAt: serverTimestamp() }, { merge: true });
    } catch (error) {
      console.error('Firestore addSubscriber error:', error);
    }
  },

  async deleteSubscriber(email: string): Promise<void> {
    try {
      const id = email.replace(/[^a-zA-Z0-9]/g, '_');
      await deleteDoc(doc(db, 'subscribers', id));
    } catch (error) {
      console.error('Firestore deleteSubscriber error:', error);
    }
  },

  // Settings
  async getSettings(): Promise<SiteSettings | null> {
    try {
      const docRef = doc(db, 'settings', 'site');
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        return snap.data() as SiteSettings;
      }
      return null;
    } catch (error) {
      console.warn('Firestore getSettings warning:', error);
      return null;
    }
  },

  async saveSettings(settings: SiteSettings): Promise<void> {
    try {
      const docRef = doc(db, 'settings', 'site');
      await setDoc(docRef, { ...settings, updatedAt: serverTimestamp() }, { merge: true });
    } catch (error) {
      console.error('Firestore saveSettings error:', error);
      throw error;
    }
  },

  // One-Click Bulk Seeder: Copies all articles, tools, and news into Firestore
  async seedAllData(): Promise<{ articles: number; tools: number; news: number }> {
    let artCount = 0;
    let toolCount = 0;
    let newsCount = 0;

    // Articles
    for (const art of ARTICLES) {
      try {
        await setDoc(doc(db, 'articles', art.id), {
          ...art,
          updatedAt: serverTimestamp(),
        });
        artCount++;
      } catch (e) {
        console.error('Seed article error:', e);
      }
    }

    // Tools
    for (const tool of TOOLS) {
      try {
        await setDoc(doc(db, 'tools', tool.id), {
          ...tool,
          updatedAt: serverTimestamp(),
        });
        toolCount++;
      } catch (e) {
        console.error('Seed tool error:', e);
      }
    }

    // News
    for (const item of NEWS) {
      try {
        await setDoc(doc(db, 'news', item.id), {
          ...item,
          updatedAt: serverTimestamp(),
        });
        newsCount++;
      } catch (e) {
        console.error('Seed news error:', e);
      }
    }

    return { articles: artCount, tools: toolCount, news: newsCount };
  },
};
