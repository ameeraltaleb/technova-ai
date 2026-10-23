'use client';

import { ArticleItem, ToolItem, NewsItem, ToolSubmission, SiteSettings } from '@/lib/admin-store';
import { AdminTab } from './AdminSidebar';

interface OverviewTabProps {
  articles: ArticleItem[];
  tools: ToolItem[];
  news: NewsItem[];
  submissions: ToolSubmission[];
  subscribers: { email: string; date: string }[];
  settings: SiteSettings;
  setActiveTab: (tab: AdminTab) => void;
  onOpenArticleModal: () => void;
  onOpenToolModal: () => void;
}

export default function OverviewTab({
  articles,
  tools,
  news,
  submissions,
  subscribers,
  settings,
  setActiveTab,
  onOpenArticleModal,
  onOpenToolModal,
}: OverviewTabProps) {
  const pendingSubmissions = submissions.filter((s) => !s.status || s.status === 'pending');

  return (
    <div>
      {/* KPI Cards */}
      <div className="admin-stats-grid">
        <div className="stat-card">
          <div className="stat-card__icon" style={{ color: '#a29bfe' }}>✍️</div>
          <div>
            <div className="stat-card__value">{articles.length}</div>
            <div className="stat-card__label">Published Articles</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card__icon" style={{ color: '#00cec9' }}>🛠️</div>
          <div>
            <div className="stat-card__value">{tools.length}</div>
            <div className="stat-card__label">Curated Tools</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card__icon" style={{ color: '#f59e0b' }}>📥</div>
          <div>
            <div className="stat-card__value">{pendingSubmissions.length}</div>
            <div className="stat-card__label">Pending Submissions</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card__icon" style={{ color: '#10b981' }}>👥</div>
          <div>
            <div className="stat-card__value">{subscribers.length}</div>
            <div className="stat-card__label">Newsletter Subscribers</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card__icon" style={{ color: '#ec4899' }}>📰</div>
          <div>
            <div className="stat-card__value">{news.length}</div>
            <div className="stat-card__label">News Stories</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card__icon" style={{ color: '#6366f1' }}>💰</div>
          <div>
            <div className="stat-card__value">{settings.adsenseEnabled ? 'Active' : 'Off'}</div>
            <div className="stat-card__label">AdSense Monetization</div>
          </div>
        </div>
      </div>

      {/* Quick Actions Bar */}
      <div
        className="admin-panel"
        style={{
          padding: '22px',
          background: 'linear-gradient(135deg, #eef2ff 0%, #ffffff 100%)',
          borderColor: '#e0e7ff',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h3 style={{ margin: '0 0 4px', fontSize: '1.1rem', fontWeight: 700 }}>Quick Actions</h3>
            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--admin-text-muted)' }}>
              Create new content or update site settings with one click
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button onClick={onOpenArticleModal} className="btn-admin btn-admin-primary">
              ✍️ New Article
            </button>
            <button onClick={onOpenToolModal} className="btn-admin btn-admin-outline">
              🛠️ Add Tool
            </button>
            <button onClick={() => setActiveTab('submissions')} className="btn-admin btn-admin-outline">
              📥 Review Submissions ({pendingSubmissions.length})
            </button>
            <button onClick={() => setActiveTab('settings')} className="btn-admin btn-admin-outline">
              ⚙️ Site Settings
            </button>
          </div>
        </div>
      </div>

      {/* Dual Column Layout: Pending Submissions & Recent Articles */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
        {/* Pending Submissions */}
        <div className="admin-panel">
          <div className="admin-panel__header">
            <h3 className="admin-panel__title">📥 Recent Tool Submissions</h3>
            <button
              onClick={() => setActiveTab('submissions')}
              className="btn-admin btn-admin-outline"
              style={{ padding: '4px 10px', fontSize: '0.75rem' }}
            >
              View All
            </button>
          </div>
          {pendingSubmissions.length === 0 ? (
            <div style={{ padding: '30px', textAlign: 'center', color: 'var(--admin-text-muted)' }}>
              No pending submissions at the moment.
            </div>
          ) : (
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Tool</th>
                    <th>Tier</th>
                    <th>Category</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingSubmissions.slice(0, 5).map((sub, i) => (
                    <tr key={i}>
                      <td>
                        <strong>{sub.name}</strong>
                        <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>
                          {sub.url}
                        </div>
                      </td>
                      <td>
                        <span className={`badge-pill ${sub.tier === 'featured' ? 'badge-pill-primary' : 'badge-pill-warning'}`}>
                          {sub.tier}
                        </span>
                      </td>
                      <td>{sub.category}</td>
                      <td style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)' }}>
                        {new Date(sub.date).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent Articles */}
        <div className="admin-panel">
          <div className="admin-panel__header">
            <h3 className="admin-panel__title">✍️ Recent Articles</h3>
            <button
              onClick={() => setActiveTab('articles')}
              className="btn-admin btn-admin-outline"
              style={{ padding: '4px 10px', fontSize: '0.75rem' }}
            >
              Manage ({articles.length})
            </button>
          </div>
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Rating</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {articles.slice(0, 5).map((art) => (
                  <tr key={art.id}>
                    <td>
                      <div style={{ fontWeight: 600, maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {art.title}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>
                        by {art.author.name}
                      </div>
                    </td>
                    <td>
                      <span className="badge-pill badge-pill-primary">{art.category}</span>
                    </td>
                    <td>⭐ {art.rating}</td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)' }}>
                      {art.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
