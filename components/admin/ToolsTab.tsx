'use client';

import { useState } from 'react';
import { ToolItem } from '@/lib/admin-store';
import { CATEGORIES } from '@/lib/data';

interface ToolsTabProps {
  tools: ToolItem[];
  onEdit: (tool: ToolItem) => void;
  onDelete: (id: string) => void;
  onNew: () => void;
}

export default function ToolsTab({ tools, onEdit, onDelete, onNew }: ToolsTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filtered = tools.filter((tool) => {
    const matchesSearch =
      tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCat = selectedCategory === 'all' || tool.category === selectedCategory;

    return matchesSearch && matchesCat;
  });

  return (
    <div className="admin-panel">
      <div className="admin-panel__header">
        <div>
          <h2 className="admin-panel__title">AI Tools Directory ({tools.length})</h2>
        </div>
        <div className="admin-panel__controls">
          <input
            type="text"
            className="admin-search-input"
            placeholder="Search tools by name..."
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
            + Add Tool
          </button>
        </div>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Tool</th>
              <th>Category</th>
              <th>Pricing</th>
              <th>Rating</th>
              <th>Affiliate Link</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: 'var(--admin-text-muted)' }}>
                  No tools found matching your search.
                </td>
              </tr>
            ) : (
              filtered.map((tool) => (
                <tr key={tool.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '1.4rem' }}>{tool.icon || '⚡'}</span>
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--admin-text-main)' }}>{tool.name}</div>
                        <div
                          style={{
                            fontSize: '0.75rem',
                            color: 'var(--admin-text-muted)',
                            maxWidth: '260px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {tool.description}
                        </div>
                        {tool.isSponsored && (
                          <span className="badge-pill badge-pill-warning" style={{ marginTop: '2px' }}>
                            ⭐ Sponsored
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="badge-pill badge-pill-primary">{tool.category}</span>
                  </td>
                  <td>
                    <span className="badge-pill badge-pill-success">{tool.pricing}</span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 600, color: '#fbbf24' }}>★ {tool.rating}</span>
                  </td>
                  <td>
                    {tool.affiliateUrl ? (
                      <span style={{ color: '#10b981', fontSize: '0.8rem', fontWeight: 600 }}>
                        ✓ Active
                      </span>
                    ) : (
                      <span style={{ color: 'var(--admin-text-dim)', fontSize: '0.8rem' }}>
                        Direct
                      </span>
                    )}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '6px' }}>
                      <a
                        href={tool.affiliateUrl || tool.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-admin btn-admin-outline"
                        style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                        title="Visit Tool"
                      >
                        ↗
                      </a>
                      <button
                        onClick={() => onEdit(tool)}
                        className="btn-admin btn-admin-outline"
                        style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete "${tool.name}"?`)) {
                            onDelete(tool.id);
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
