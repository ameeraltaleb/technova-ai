'use client';

import { useState } from 'react';
import { NewsItem } from '@/lib/admin-store';

interface NewsTabProps {
  news: NewsItem[];
  onEdit: (item: NewsItem) => void;
  onDelete: (id: string) => void;
  onNew: () => void;
}

export default function NewsTab({ news, onEdit, onDelete, onNew }: NewsTabProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = news.filter(
    (n) =>
      n.headline.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-panel">
      <div className="admin-panel__header">
        <div>
          <h2 className="admin-panel__title">Tech News & Breaking Updates ({news.length})</h2>
        </div>
        <div className="admin-panel__controls">
          <input
            type="text"
            className="admin-search-input"
            placeholder="Search news..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={onNew} className="btn-admin btn-admin-primary">
            + Post News
          </button>
        </div>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Headline</th>
              <th>Source</th>
              <th>Category</th>
              <th>Date</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: 'var(--admin-text-muted)' }}>
                  No news stories found.
                </td>
              </tr>
            ) : (
              filtered.map((item) => (
                <tr key={item.id}>
                  <td style={{ maxWidth: '380px' }}>
                    <div style={{ fontWeight: 600, color: 'var(--admin-text-main)' }}>{item.headline}</div>
                    <div
                      style={{
                        fontSize: '0.75rem',
                        color: 'var(--admin-text-muted)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {item.content}
                    </div>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#00cec9' }}>
                      {item.source}
                    </span>
                  </td>
                  <td>
                    <span className="badge-pill badge-pill-primary">{item.category}</span>
                  </td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)' }}>
                    {item.date}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '6px' }}>
                      <button
                        onClick={() => onEdit(item)}
                        className="btn-admin btn-admin-outline"
                        style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete "${item.headline}"?`)) {
                            onDelete(item.id);
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
