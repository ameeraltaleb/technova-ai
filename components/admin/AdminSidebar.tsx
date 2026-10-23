'use client';

import Link from 'next/link';

export type AdminTab =
  | 'overview'
  | 'articles'
  | 'tools'
  | 'submissions'
  | 'news'
  | 'subscribers'
  | 'settings';

interface AdminSidebarProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  counts: {
    articles: number;
    tools: number;
    submissions: number;
    news: number;
    subscribers: number;
  };
  onLogout: () => void;
}

export default function AdminSidebar({
  activeTab,
  setActiveTab,
  counts,
  onLogout,
}: AdminSidebarProps) {
  const navItems: { id: AdminTab; label: string; icon: string; count?: number }[] = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'articles', label: 'Articles & Reviews', icon: '✍️', count: counts.articles },
    { id: 'tools', label: 'AI Tools Directory', icon: '🛠️', count: counts.tools },
    { id: 'submissions', label: 'Tool Submissions', icon: '📥', count: counts.submissions },
    { id: 'news', label: 'Tech News', icon: '📰', count: counts.news },
    { id: 'subscribers', label: 'Newsletter', icon: '👥', count: counts.subscribers },
    { id: 'settings', label: 'Settings & Monetization', icon: '⚙️' },
  ];

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar__brand">
        <img src="/logo.png" alt="TechNova AI" className="admin-sidebar__logo-img" />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span className="admin-sidebar__brand-name">TechNova AI</span>
        </div>
        <span className="admin-sidebar__badge">ADMIN</span>
      </div>

      <div className="admin-sidebar__nav">
        <span className="admin-sidebar__section-title">Management</span>
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`admin-nav-item ${activeTab === item.id ? 'active' : ''}`}
          >
            <div className="admin-nav-item__left">
              <span className="admin-nav-item__icon">{item.icon}</span>
              <span>{item.label}</span>
            </div>
            {item.count !== undefined && (
              <span className="admin-nav-item__count">{item.count}</span>
            )}
          </button>
        ))}

        <span className="admin-sidebar__section-title" style={{ marginTop: '16px' }}>
          Quick Links
        </span>
        <Link
          href="/"
          target="_blank"
          className="admin-nav-item"
          style={{ textDecoration: 'none' }}
        >
          <div className="admin-nav-item__left">
            <span className="admin-nav-item__icon">🌐</span>
            <span>View Live Site</span>
          </div>
          <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>↗</span>
        </Link>
      </div>

      <div className="admin-sidebar__footer">
        <button
          onClick={onLogout}
          className="btn-admin btn-admin-outline"
          style={{ width: '100%', justifyContent: 'center' }}
        >
          🚪 Sign Out
        </button>
      </div>
    </aside>
  );
}
