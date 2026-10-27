'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  AdminStore,
  ArticleItem,
  ToolItem,
  NewsItem,
  ToolSubmission,
  SiteSettings,
  FirebaseConfig,
  STORAGE_KEYS,
} from '@/lib/admin-store';
import { getLiveArticles, getLiveTools, getLiveNews } from '@/lib/public-data';
import { FirebaseService } from '@/lib/firebase-service';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import AdminSidebar, { AdminTab } from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import OverviewTab from '@/components/admin/OverviewTab';
import ArticlesTab from '@/components/admin/ArticlesTab';
import ArticleModal from '@/components/admin/ArticleModal';
import ToolsTab from '@/components/admin/ToolsTab';
import ToolModal from '@/components/admin/ToolModal';
import SubmissionsTab from '@/components/admin/SubmissionsTab';
import NewsTab from '@/components/admin/NewsTab';
import NewsModal from '@/components/admin/NewsModal';
import SubscribersTab from '@/components/admin/SubscribersTab';
import SettingsTab from '@/components/admin/SettingsTab';

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [tools, setTools] = useState<ToolItem[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [submissions, setSubmissions] = useState<ToolSubmission[]>([]);
  const [subscribers, setSubscribers] = useState<{ email: string; date: string }[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(AdminStore.getSettings());
  const [firebaseConfig, setFirebaseConfig] = useState<FirebaseConfig>(AdminStore.getFirebaseConfig());
  const [userEmail, setUserEmail] = useState('admin@technova-ai.online');
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Modals state
  const [articleModalOpen, setArticleModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<ArticleItem | null>(null);

  const [toolModalOpen, setToolModalOpen] = useState(false);
  const [editingTool, setEditingTool] = useState<ToolItem | null>(null);

  const [newsModalOpen, setNewsModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);

  // Live Cloud Synchronization (cross-device: Mobile <-> Laptop)
  const syncLiveData = async () => {
    setIsSyncing(true);
    try {
      const [liveArticles, liveTools, liveNews, liveSubs, liveSubscribers] = await Promise.all([
        getLiveArticles(),
        getLiveTools(),
        getLiveNews(),
        FirebaseService.getSubmissions(),
        FirebaseService.getSubscribers(),
      ]);

      if (liveArticles && liveArticles.length > 0) {
        setArticles(liveArticles);
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(liveArticles));
        }
      }

      if (liveTools && liveTools.length > 0) {
        setTools(liveTools);
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEYS.TOOLS, JSON.stringify(liveTools));
        }
      }

      if (liveNews && liveNews.length > 0) {
        setNews(liveNews);
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEYS.NEWS, JSON.stringify(liveNews));
        }
      }

      if (liveSubs && liveSubs.length > 0) {
        setSubmissions(liveSubs);
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(liveSubs));
        }
      }

      if (liveSubscribers && liveSubscribers.length > 0) {
        setSubscribers(liveSubscribers);
        if (typeof window !== 'undefined') {
          localStorage.setItem(
            STORAGE_KEYS.SUBSCRIBERS,
            JSON.stringify(liveSubscribers.map((s) => s.email))
          );
        }
      }
    } catch (err) {
      console.warn('Sync live data error:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    // 1. Local Auth state check
    const localAuth = AdminStore.getAuthState();
    if (!localAuth.isAuthenticated) {
      router.push('/admin/login');
      return;
    }

    // 2. Live Firebase Auth session listener
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) {
        AdminStore.setAuthState(null);
        router.push('/admin/login');
      } else {
        if (firebaseUser.email) {
          setUserEmail(firebaseUser.email);
        }
        setIsLoaded(true);
      }
    });

    // 3. Fast initial render from local cache
    setArticles(AdminStore.getArticles());
    setTools(AdminStore.getTools());
    setNews(AdminStore.getNews());
    setSubmissions(AdminStore.getSubmissions());
    setSubscribers(AdminStore.getSubscribers());
    setSettings(AdminStore.getSettings());
    setFirebaseConfig(AdminStore.getFirebaseConfig());
    if (typeof window !== 'undefined') {
      (window as any).syncToFirestore = () => AdminStore.syncToFirestore();
    }

    // 4. Fetch live data from Firebase to guarantee cross-device sync (e.g. Mobile <-> Laptop)
    syncLiveData();

    return () => unsubscribe();
  }, [router]);

  if (!isLoaded) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#f8fafc',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#4f46e5',
          fontWeight: 600,
        }}
      >
        جاري التحقق من أمان وحساب المدير عبر Firebase...
      </div>
    );
  }

  // Article Actions
  const handleOpenNewArticle = () => {
    setEditingArticle(null);
    setArticleModalOpen(true);
  };

  const handleEditArticle = (art: ArticleItem) => {
    setEditingArticle(art);
    setArticleModalOpen(true);
  };

  const handleSaveArticle = async (art: ArticleItem) => {
    const updated = await AdminStore.saveArticle(art, articles);
    setArticles(updated);
  };

  const handleDeleteArticle = async (id: string) => {
    const updated = await AdminStore.deleteArticle(id, articles);
    setArticles(updated);
  };

  // Tool Actions
  const handleOpenNewTool = () => {
    setEditingTool(null);
    setToolModalOpen(true);
  };

  const handleEditTool = (tool: ToolItem) => {
    setEditingTool(tool);
    setToolModalOpen(true);
  };

  const handleSaveTool = (tool: ToolItem) => {
    const updated = AdminStore.saveTool(tool, tools);
    setTools(updated);
    setToolModalOpen(false);
  };

  const handleDeleteTool = (id: string) => {
    const updated = AdminStore.deleteTool(id, tools);
    setTools(updated);
  };

  // Submissions Actions
  const handleApproveSubmission = (sub: ToolSubmission, index: number) => {
    const newTool: ToolItem = {
      id: sub.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      name: sub.name,
      description: sub.description,
      url: sub.url,
      category: sub.category,
      pricing: sub.tier === 'featured' ? 'Paid (/mo)' : 'Freemium',
      rating: 4.8,
      icon: '✨',
      isSponsored: sub.tier === 'featured',
    };
    const updatedTools = AdminStore.saveTool(newTool);
    setTools(updatedTools);

    const updatedSubs = AdminStore.updateSubmissionStatus(index, 'approved');
    setSubmissions(updatedSubs);
  };

  const handleRejectSubmission = (index: number) => {
    const updated = AdminStore.updateSubmissionStatus(index, 'rejected');
    setSubmissions(updated);
  };

  // News Actions
  const handleOpenNewNews = () => {
    setEditingNews(null);
    setNewsModalOpen(true);
  };

  const handleEditNews = (item: NewsItem) => {
    setEditingNews(item);
    setNewsModalOpen(true);
  };

  const handleSaveNews = (item: NewsItem) => {
    const updated = AdminStore.saveNews(item, news);
    setNews(updated);
    setNewsModalOpen(false);
  };

  const handleDeleteNews = (id: string) => {
    const updated = AdminStore.deleteNews(id, news);
    setNews(updated);
  };

  // Subscriber Actions
  const handleDeleteSubscriber = (email: string) => {
    const updated = AdminStore.deleteSubscriber(email);
    setSubscribers(updated);
  };

  // Settings Actions
  const handleSaveSettings = (newSettings: SiteSettings) => {
    const saved = AdminStore.saveSettings(newSettings);
    setSettings(saved);
  };

  const handleSaveFirebaseConfig = (config: FirebaseConfig) => {
    const saved = AdminStore.saveFirebaseConfig(config);
    setFirebaseConfig(saved);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.error(e);
    }
    AdminStore.setAuthState(null);
    router.push('/admin/login');
  };

  // Action button header logic
  let headerNewAction: (() => void) | undefined;
  let headerNewActionLabel: string | undefined;

  if (activeTab === 'articles') {
    headerNewAction = handleOpenNewArticle;
    headerNewActionLabel = 'New Article';
  } else if (activeTab === 'tools') {
    headerNewAction = handleOpenNewTool;
    headerNewActionLabel = 'Add Tool';
  } else if (activeTab === 'news') {
    headerNewAction = handleOpenNewNews;
    headerNewActionLabel = 'Post News';
  }

  const counts = {
    articles: articles.length,
    tools: tools.length,
    submissions: submissions.filter((s) => !s.status || s.status === 'pending').length,
    news: news.length,
    subscribers: subscribers.length,
  };

  return (
    <div className="admin-layout">
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        counts={counts}
        onLogout={handleLogout}
      />

      <div className="admin-main">
        <AdminHeader
          activeTab={activeTab}
          onNewAction={headerNewAction}
          newActionLabel={headerNewActionLabel}
          isFirebaseConnected={firebaseConfig.isConnected}
          userEmail={userEmail}
          onSync={syncLiveData}
          isSyncing={isSyncing}
        />

        <div className="admin-content">
          {activeTab === 'overview' && (
            <OverviewTab
              articles={articles}
              tools={tools}
              news={news}
              submissions={submissions}
              subscribers={subscribers}
              settings={settings}
              setActiveTab={setActiveTab}
              onOpenArticleModal={handleOpenNewArticle}
              onOpenToolModal={handleOpenNewTool}
            />
          )}

          {activeTab === 'articles' && (
            <ArticlesTab
              articles={articles}
              onEdit={handleEditArticle}
              onDelete={handleDeleteArticle}
              onNew={handleOpenNewArticle}
            />
          )}

          {activeTab === 'tools' && (
            <ToolsTab
              tools={tools}
              onEdit={handleEditTool}
              onDelete={handleDeleteTool}
              onNew={handleOpenNewTool}
            />
          )}

          {activeTab === 'submissions' && (
            <SubmissionsTab
              submissions={submissions}
              onApprove={handleApproveSubmission}
              onReject={handleRejectSubmission}
            />
          )}

          {activeTab === 'news' && (
            <NewsTab
              news={news}
              onEdit={handleEditNews}
              onDelete={handleDeleteNews}
              onNew={handleOpenNewNews}
            />
          )}

          {activeTab === 'subscribers' && (
            <SubscribersTab
              subscribers={subscribers}
              onDelete={handleDeleteSubscriber}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsTab
              settings={settings}
              firebaseConfig={firebaseConfig}
              onSaveSettings={handleSaveSettings}
              onSaveFirebaseConfig={handleSaveFirebaseConfig}
            />
          )}
        </div>
      </div>

      {/* Article Modal */}
      <ArticleModal
        isOpen={articleModalOpen}
        onClose={() => setArticleModalOpen(false)}
        onSave={handleSaveArticle}
        initialArticle={editingArticle}
      />

      {/* Tool Modal */}
      <ToolModal
        isOpen={toolModalOpen}
        onClose={() => setToolModalOpen(false)}
        onSave={handleSaveTool}
        initialTool={editingTool}
      />

      {/* News Modal */}
      <NewsModal
        isOpen={newsModalOpen}
        onClose={() => setNewsModalOpen(false)}
        onSave={handleSaveNews}
        initialNews={editingNews}
      />
    </div>
  );
}
