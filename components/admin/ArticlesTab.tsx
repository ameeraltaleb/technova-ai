'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArticleItem, AdminStore, ArticleStatus } from '@/lib/admin-store';
import { CATEGORIES } from '@/lib/data';

interface ArticlesTabProps {
  articles: ArticleItem[];
  onEdit: (article: ArticleItem) => void;
  onDelete: (id: string) => void;
  onNew: () => void;
  onPublishNow?: (article: ArticleItem) => void | Promise<void>;
}

export default function ArticlesTab({
  articles,
  onEdit,
  onDelete,
  onNew,
  onPublishNow,
}: ArticlesTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'scheduled' | 'draft'>('all');
  const [publishingId, setPublishingId] = useState<string | null>(null);
  const [sharingId, setSharingId] = useState<string | null>(null);
  const [shareMsg, setShareMsg] = useState<{ id: string; text: string; ok: boolean } | null>(null);

  const publishedCount = articles.filter((a) => !a.status || a.status === 'published').length;
  const scheduledCount = articles.filter((a) => a.status === 'scheduled').length;
  const draftCount = articles.filter((a) => a.status === 'draft').length;

  const handleQuickPublish = async (art: ArticleItem) => {
    if (!onPublishNow) return;
    setPublishingId(art.id);
    try {
      await onPublishNow(art);
    } finally {
      setPublishingId(null);
    }
  };

  const handleShareBuffer = async (art: ArticleItem) => {
    setSharingId(art.id);
    setShareMsg(null);
    try {
      const settings = AdminStore.getSettings();
      const token = settings.bufferAccessToken || '';
      if (!token) {
        setShareMsg({
          id: art.id,
          text: '❌ يرجى إدخال مفتاح Buffer في صفحة الإعدادات والضغط على Save Settings أولاً',
          ok: false,
        });
        return;
      }
      const res = await fetch('/api/buffer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          id: art.id,
          title: art.title,
          excerpt: art.excerpt,
          image: art.image,
          category: art.category,
          now: true,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setShareMsg({ id: art.id, text: data.message || '🚀 تم النشر فورياً عبر Buffer!', ok: true });
      } else {
        setShareMsg({ id: art.id, text: `❌ ${data.error || 'فشل النشر'}`, ok: false });
      }
    } catch (e: any) {
      setShareMsg({ id: art.id, text: `❌ خطأ بالشبكة: ${e.message}`, ok: false });
    } finally {
      setSharingId(null);
      setTimeout(() => setShareMsg(null), 6000);
    }
  };

  const filtered = articles.filter((art) => {
    const matchesSearch =
      art.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      art.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (art.tags || []).some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCat = selectedCategory === 'all' || art.category === selectedCategory;

    let matchesStatus = true;
    if (statusFilter === 'published') {
      matchesStatus = !art.status || art.status === 'published';
    } else if (statusFilter === 'scheduled') {
      matchesStatus = art.status === 'scheduled';
    } else if (statusFilter === 'draft') {
      matchesStatus = art.status === 'draft';
    }

    return matchesSearch && matchesCat && matchesStatus;
  });

  return (
    <div className="admin-panel">
      <div className="admin-panel__header" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h2 className="admin-panel__title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              Articles & Reviews
              <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--admin-text-muted)' }}>
                ({articles.length} total)
              </span>
            </h2>
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button onClick={onNew} className="btn-admin btn-admin-primary">
              + New Article
            </button>
          </div>
        </div>

        {/* Filter bar: Status Pills + Search + Category */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', borderTop: '1px solid #e2e8f0', paddingTop: '12px' }}>
          {/* Status Tabs */}
          <div style={{ display: 'inline-flex', background: '#f1f5f9', borderRadius: '10px', padding: '3px', gap: '2px' }}>
            <button
              onClick={() => setStatusFilter('all')}
              style={{
                border: 'none',
                background: statusFilter === 'all' ? '#ffffff' : 'transparent',
                color: statusFilter === 'all' ? '#0f172a' : '#64748b',
                fontWeight: statusFilter === 'all' ? 700 : 500,
                boxShadow: statusFilter === 'all' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.8rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.15s ease',
              }}
            >
              All <span>({articles.length})</span>
            </button>

            <button
              onClick={() => setStatusFilter('published')}
              style={{
                border: 'none',
                background: statusFilter === 'published' ? '#ffffff' : 'transparent',
                color: statusFilter === 'published' ? '#047857' : '#64748b',
                fontWeight: statusFilter === 'published' ? 700 : 500,
                boxShadow: statusFilter === 'published' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.8rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.15s ease',
              }}
            >
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
              Live <span>({publishedCount})</span>
            </button>

            <button
              onClick={() => setStatusFilter('scheduled')}
              style={{
                border: 'none',
                background: statusFilter === 'scheduled' ? '#ffffff' : 'transparent',
                color: statusFilter === 'scheduled' ? '#7e22ce' : '#64748b',
                fontWeight: statusFilter === 'scheduled' ? 700 : 500,
                boxShadow: statusFilter === 'scheduled' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.8rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.15s ease',
              }}
            >
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#a855f7' }} />
              Scheduled <span>({scheduledCount})</span>
            </button>

            <button
              onClick={() => setStatusFilter('draft')}
              style={{
                border: 'none',
                background: statusFilter === 'draft' ? '#ffffff' : 'transparent',
                color: statusFilter === 'draft' ? '#b45309' : '#64748b',
                fontWeight: statusFilter === 'draft' ? 700 : 500,
                boxShadow: statusFilter === 'draft' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.8rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.15s ease',
              }}
            >
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b' }} />
              Drafts <span>({draftCount})</span>
            </button>
          </div>

          {/* Search & Category */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            <input
              type="text"
              className="admin-search-input"
              placeholder="Search title, ID, tag..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ minWidth: '220px' }}
            />

            <select
              className="admin-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title & Excerpt</th>
              <th>Status</th>
              <th>Category</th>
              <th>Author</th>
              <th>Rating</th>
              <th>Date / Schedule</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: 'var(--admin-text-muted)' }}>
                  No articles found matching your filters.
                </td>
              </tr>
            ) : (
              filtered.map((art) => {
                const isScheduled = art.status === 'scheduled';
                const isDraft = art.status === 'draft';
                const isLive = !art.status || art.status === 'published';

                return (
                  <tr key={art.id}>
                    <td style={{ maxWidth: '300px' }}>
                      <div style={{ fontWeight: 600, color: 'var(--admin-text-main)', marginBottom: '2px' }}>
                        {art.title}
                      </div>
                      <div
                        style={{
                          fontSize: '0.75rem',
                          color: 'var(--admin-text-muted)',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {art.excerpt}
                      </div>

                      {shareMsg && shareMsg.id === art.id && (
                        <div
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            marginTop: '4px',
                            color: shareMsg.ok ? '#10b981' : '#ef4444',
                          }}
                        >
                          {shareMsg.text}
                        </div>
                      )}
                      {art.featured && (
                        <span className="badge-pill badge-pill-warning" style={{ marginTop: '4px' }}>
                          ⭐ Featured
                        </span>
                      )}
                    </td>

                    {/* Status Column */}
                    <td>
                      {isScheduled && (
                        <div>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '3px 8px',
                              borderRadius: '9999px',
                              fontSize: '0.725rem',
                              fontWeight: 700,
                              background: '#f3e8ff',
                              color: '#7e22ce',
                              border: '1px solid #d8b4fe',
                            }}
                          >
                            📅 Scheduled
                          </span>
                          {art.scheduledFor && (
                            <div style={{ fontSize: '0.68rem', color: '#6b7280', marginTop: '3px', whiteSpace: 'nowrap' }}>
                              {new Date(art.scheduledFor).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                              })}{' '}
                              {new Date(art.scheduledFor).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </div>
                          )}
                        </div>
                      )}

                      {isDraft && (
                        <span className="badge-pill badge-pill-warning">
                          📝 Draft
                        </span>
                      )}

                      {isLive && (
                        <span className="badge-pill badge-pill-success">
                          ✓ Live
                        </span>
                      )}
                    </td>

                    <td>
                      <span className="badge-pill badge-pill-primary">{art.category}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <img
                          src={art.author?.avatar}
                          alt={art.author?.name}
                          style={{ width: '22px', height: '22px', borderRadius: '50%' }}
                        />
                        <span style={{ fontSize: '0.8rem' }}>{art.author?.name}</span>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontWeight: 600, color: '#fbbf24' }}>★ {art.rating}</span>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)' }}>
                      <div>{art.date}</div>
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '5px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                        {/* Quick Publish Button for Scheduled / Draft */}
                        {(isScheduled || isDraft) && onPublishNow && (
                          <button
                            onClick={() => handleQuickPublish(art)}
                            disabled={publishingId === art.id}
                            className="btn-admin"
                            style={{
                              padding: '4px 8px',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              background: '#10b981',
                              color: '#ffffff',
                              border: 'none',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '3px',
                              cursor: 'pointer',
                            }}
                            title="نشر المقال فورياً وجعله متاحاً للجمهور الآن"
                          >
                            {publishingId === art.id ? '⏳' : '⚡'} Publish
                          </button>
                        )}

                        <Link
                          href={`/article/${art.id}`}
                          target="_blank"
                          className="btn-admin btn-admin-outline"
                          style={{
                            padding: '4px 8px',
                            fontSize: '0.75rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '3px',
                            textDecoration: 'none',
                          }}
                          title="عرض المقال بالموقع"
                        >
                          👁️ View
                        </Link>

                        <button
                          onClick={() => handleShareBuffer(art)}
                          disabled={sharingId === art.id}
                          className="btn-admin btn-admin-outline"
                          style={{
                            padding: '4px 8px',
                            fontSize: '0.75rem',
                            background: 'rgba(99, 102, 241, 0.08)',
                            borderColor: 'rgba(99, 102, 241, 0.3)',
                            color: '#6366f1',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '3px',
                          }}
                          title="نشر فوري عبر Buffer على تويتر ولينكد إن وفيسبوك"
                        >
                          {sharingId === art.id ? '⏳' : '📡'} Buffer
                        </button>

                        <button
                          onClick={() => onEdit(art)}
                          className="btn-admin btn-admin-outline"
                          style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                        >
                          ✏️ Edit
                        </button>

                        <button
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete "${art.title}"?`)) {
                              onDelete(art.id);
                            }
                          }}
                          className="btn-admin btn-admin-danger"
                          style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}