'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArticleItem } from '@/lib/admin-store';
import { CATEGORIES } from '@/lib/data';

interface ArticlesTabProps {
  articles: ArticleItem[];
  onEdit: (article: ArticleItem) => void;
  onDelete: (id: string) => void;
  onNew: () => void;
}

export default function ArticlesTab({
  articles,
  onEdit,
  onDelete,
  onNew,
}: ArticlesTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filtered = articles.filter((art) => {
    const matchesSearch =
      art.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      art.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (art.tags || []).some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCat = selectedCategory === 'all' || art.category === selectedCategory;

    return matchesSearch && matchesCat;
  });

  return (
    <div className="admin-panel">
      <div className="admin-panel__header">
        <div>
          <h2 className="admin-panel__title">Articles & Reviews ({articles.length})</h2>
        </div>
        <div className="admin-panel__controls">
          <input
            type="text"
            className="admin-search-input"
            placeholder="Search articles by title, tag..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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

          <button onClick={onNew} className="btn-admin btn-admin-primary">
            + New Article
          </button>
        </div>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title & Excerpt</th>
              <th>Category</th>
              <th>Author</th>
              <th>Rating</th>
              <th>Date</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: 'var(--admin-text-muted)' }}>
                  No articles found matching your search.
                </td>
              </tr>
            ) : (
              filtered.map((art) => (
                <tr key={art.id}>
                  <td style={{ maxWidth: '340px' }}>
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
                    {art.featured && (
                      <span className="badge-pill badge-pill-warning" style={{ marginTop: '4px' }}>
                        ⭐ Featured
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
                    {art.date}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '6px' }}>
                      <Link
                        href={`/article/${art.id}`}
                        target="_blank"
                        className="btn-admin btn-admin-outline"
                        style={{ padding: '4px 10px', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}
                        title="عرض المقال بالموقع"
                      >
                        👁️ عرض
                      </Link>
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
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
