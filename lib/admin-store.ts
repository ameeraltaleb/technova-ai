'use client';

import { ARTICLES, TOOLS, NEWS, SITE_CONFIG } from './data';
import { FirebaseService } from './firebase-service';

export interface ArticleItem {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  author: {
    name: string;
    avatar: string;
    role?: string;
  };
  date: string;
  createdAt?: any;
  updatedAt?: any;
  readTime: string;
  rating: number;
  featured: boolean;
  tags: string[];
  image: string;
  content: string;
  pros?: string[];
  cons?: string[];
  ratingBreakdown?: {
    overall: number;
    label: string;
  };
  affiliateUrl?: string;
  pricingInfo?: string;
}

export interface ToolItem {
  id: string;
  name: string;
  description: string;
  url: string;
  category: string;
  pricing: string;
  rating: number;
  icon: string;
  isSponsored?: boolean;
  affiliateUrl?: string;
}

export interface NewsItem {
  id: string;
  headline: string;
  content: string;
  fullContent?: string;
  date: string;
  source: string;
  category: string;
  tags: string[];
}

export interface ToolSubmission {
  name: string;
  url: string;
  category: string;
  email: string;
  description: string;
  tier: 'featured' | 'review' | 'free';
  date: string;
  status?: 'pending' | 'approved' | 'rejected';
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  description: string;
  adsenseEnabled: boolean;
  adsenseClientId: string;
  analyticsId: string;
  announcementEnabled: boolean;
  announcementText: string;
  announcementLink: string;
  announcementBadge: string;
  affiliateDisclosure: string;
  twitterUrl: string;
  youtubeUrl: string;
  githubUrl: string;
  linkedinUrl: string;
}

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  isConnected: boolean;
}

export const STORAGE_KEYS = {
  ARTICLES: 'technova_admin_articles',
  TOOLS: 'technova_admin_tools',
  NEWS: 'technova_admin_news',
  SUBMISSIONS: 'technova_tool_submissions',
  SUBSCRIBERS: 'technova_subscribers',
  SETTINGS: 'technova_admin_settings',
  FIREBASE: 'technova_firebase_config',
  AUTH: 'technova_admin_auth',
};

const DEFAULT_SETTINGS: SiteSettings = {
  siteName: SITE_CONFIG.name,
  tagline: SITE_CONFIG.tagline,
  description: SITE_CONFIG.description,
  adsenseEnabled: true,
  adsenseClientId: 'ca-pub-8381284855782594',
  analyticsId: 'G-0RXE2K2K6P',
  announcementEnabled: true,
  announcementText: '🔥 Explore the Top 30 Curated AI Tools for 2026 — Tested & Benchmarked',
  announcementLink: '/tools',
  announcementBadge: 'NEW',
  affiliateDisclosure: 'TechNova AI is reader-supported. When you purchase through links on our site, we may earn an affiliate commission at no extra cost to you.',
  twitterUrl: 'https://x.com',
  youtubeUrl: 'https://youtube.com',
  githubUrl: 'https://github.com/ameeraltaleb/technova-ai',
  linkedinUrl: 'https://linkedin.com',
};

const DEFAULT_FIREBASE_CONFIG: FirebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
  isConnected: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
};

export const AdminStore = {
  // Articles
  getArticles(): ArticleItem[] {
    if (typeof window === 'undefined') return ARTICLES as unknown as ArticleItem[];
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ARTICLES);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return ARTICLES as unknown as ArticleItem[];
  },

  async saveArticle(article: ArticleItem, currentArticles?: ArticleItem[]): Promise<ArticleItem[]> {
    const articles = currentArticles && currentArticles.length > 0 ? currentArticles : this.getArticles();
    const index = articles.findIndex((a) => a.id === article.id);
    let updated: ArticleItem[];
    if (index >= 0) {
      updated = [article, ...articles.filter((a) => a.id !== article.id)];
    } else {
      updated = [article, ...articles];
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(updated));
    }
    // Await Firebase Firestore sync to guarantee document is saved on server
    await FirebaseService.saveArticle(article);
    return updated;
  },

  async deleteArticle(id: string, currentArticles?: ArticleItem[]): Promise<ArticleItem[]> {
    const articles = currentArticles && currentArticles.length > 0 ? currentArticles : this.getArticles();
    const updated = articles.filter((a) => a.id !== id);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(updated));
    }
    // Async Firebase Firestore delete
    await FirebaseService.deleteArticle(id).catch((err) =>
      console.warn('Background Firestore deleteArticle:', err)
    );
    return updated;
  },

  // Tools
  getTools(): ToolItem[] {
    if (typeof window === 'undefined') return TOOLS as ToolItem[];
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.TOOLS);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return TOOLS as ToolItem[];
  },

  saveTool(tool: ToolItem, currentTools?: ToolItem[]): ToolItem[] {
    const tools = currentTools && currentTools.length > 0 ? currentTools : this.getTools();
    const index = tools.findIndex((t) => t.id === tool.id);
    let updated: ToolItem[];
    if (index >= 0) {
      updated = [...tools];
      updated[index] = tool;
    } else {
      updated = [tool, ...tools];
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.TOOLS, JSON.stringify(updated));
    }
    // Async Firebase Firestore sync
    FirebaseService.saveTool(tool).catch((err) =>
      console.warn('Background Firestore saveTool:', err)
    );
    return updated;
  },

  deleteTool(id: string, currentTools?: ToolItem[]): ToolItem[] {
    const tools = currentTools && currentTools.length > 0 ? currentTools : this.getTools();
    const updated = tools.filter((t) => t.id !== id);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.TOOLS, JSON.stringify(updated));
    }
    // Async Firebase Firestore delete
    FirebaseService.deleteTool(id).catch((err) =>
      console.warn('Background Firestore deleteTool:', err)
    );
    return updated;
  },

  // News
  getNews(): NewsItem[] {
    if (typeof window === 'undefined') return NEWS as NewsItem[];
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.NEWS);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return NEWS as NewsItem[];
  },

  saveNews(item: NewsItem, currentNews?: NewsItem[]): NewsItem[] {
    const news = currentNews && currentNews.length > 0 ? currentNews : this.getNews();
    const index = news.findIndex((n) => n.id === item.id);
    let updated: NewsItem[];
    if (index >= 0) {
      updated = [...news];
      updated[index] = item;
    } else {
      updated = [item, ...news];
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.NEWS, JSON.stringify(updated));
    }
    // Async Firebase Firestore sync
    FirebaseService.saveNews(item).catch((err) =>
      console.warn('Background Firestore saveNews:', err)
    );
    return updated;
  },

  deleteNews(id: string, currentNews?: NewsItem[]): NewsItem[] {
    const news = currentNews && currentNews.length > 0 ? currentNews : this.getNews();
    const updated = news.filter((n) => n.id !== id);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.NEWS, JSON.stringify(updated));
    }
    // Async Firebase Firestore delete
    FirebaseService.deleteNews(id).catch((err) =>
      console.warn('Background Firestore deleteNews:', err)
    );
    return updated;
  },

  // Submissions
  getSubmissions(): ToolSubmission[] {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SUBMISSIONS);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return [
      {
        name: 'Synthesia AI',
        url: 'https://synthesia.io',
        category: 'ai-tools',
        email: 'partners@synthesia.io',
        description: 'AI video generation platform using realistic digital human avatars.',
        tier: 'featured',
        date: new Date(Date.now() - 86400000 * 2).toISOString(),
        status: 'pending',
      },
      {
        name: 'Perplexity Enterprise',
        url: 'https://perplexity.ai',
        category: 'productivity',
        email: 'growth@perplexity.ai',
        description: 'Conversational answer engine with direct citations and corporate search.',
        tier: 'review',
        date: new Date(Date.now() - 86400000 * 4).toISOString(),
        status: 'pending',
      },
    ];
  },

  updateSubmissionStatus(index: number, status: 'approved' | 'rejected'): ToolSubmission[] {
    const submissions = this.getSubmissions();
    if (submissions[index]) {
      submissions[index].status = status;
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(submissions));
      }
    }
    return [...submissions];
  },

  // Subscribers
  getSubscribers(): { email: string; date: string }[] {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SUBSCRIBERS);
      if (stored) {
        const raw = JSON.parse(stored);
        if (Array.isArray(raw)) {
          return raw.map((item, i) => {
            if (typeof item === 'string') {
              return { email: item, date: new Date(Date.now() - i * 3600000 * 12).toLocaleDateString() };
            }
            return item;
          });
        }
      }
    } catch (e) {
      console.error(e);
    }
    return [
      { email: 'alex.tech@gmail.com', date: '2026-10-22' },
      { email: 'sarah.engineer@devhub.io', date: '2026-10-21' },
      { email: 'omar.dev@outlook.com', date: '2026-10-20' },
      { email: 'rachel.founder@growthai.co', date: '2026-10-19' },
    ];
  },

  deleteSubscriber(email: string) {
    const current = this.getSubscribers();
    const updated = current.filter((s) => s.email !== email);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.SUBSCRIBERS, JSON.stringify(updated.map((u) => u.email)));
    }
    FirebaseService.deleteSubscriber(email).catch((e) => console.warn(e));
    return updated;
  },

  // Site Settings
  getSettings(): SiteSettings {
    if (typeof window === 'undefined') return DEFAULT_SETTINGS;
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (stored) return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_SETTINGS;
  },

  saveSettings(settings: Partial<SiteSettings>): SiteSettings {
    const updated = { ...this.getSettings(), ...settings };
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
    }
    FirebaseService.saveSettings(updated).catch((e) => console.warn(e));
    return updated;
  },

  // Firebase Config
  getFirebaseConfig(): FirebaseConfig {
    if (typeof window === 'undefined') return DEFAULT_FIREBASE_CONFIG;
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.FIREBASE);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_FIREBASE_CONFIG;
  },

  saveFirebaseConfig(config: FirebaseConfig): FirebaseConfig {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.FIREBASE, JSON.stringify(config));
    }
    return config;
  },

  // Auth State
  getAuthState(): { isAuthenticated: boolean; user: { email: string; name: string } | null } {
    if (typeof window === 'undefined') return { isAuthenticated: false, user: null };
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.AUTH);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return { isAuthenticated: false, user: null };
  },

  setAuthState(user: { email: string; name: string } | null) {
    if (typeof window === 'undefined') return;
    if (user) {
      localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify({ isAuthenticated: true, user }));
    } else {
      localStorage.removeItem(STORAGE_KEYS.AUTH);
    }
  },

  // One-click Firestore Data Sync
  async syncToFirestore() {
    return await FirebaseService.seedAllData();
  },
};
