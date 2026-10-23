'use client';

import { useState } from 'react';

interface SubscribersTabProps {
  subscribers: { email: string; date: string }[];
  onDelete: (email: string) => void;
}

export default function SubscribersTab({ subscribers, onDelete }: SubscribersTabProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = subscribers.filter((s) =>
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Email,Date Joined', ...subscribers.map((s) => `"${s.email}","${s.date}"`)].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `technova-subscribers-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="admin-panel">
      <div className="admin-panel__header">
        <div>
          <h2 className="admin-panel__title">Newsletter Audience ({subscribers.length})</h2>
          <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: 'var(--admin-text-muted)' }}>
            Readers who opted-in to the TechNova AI weekly dispatch
          </p>
        </div>
        <div className="admin-panel__controls">
          <input
            type="text"
            className="admin-search-input"
            placeholder="Search email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={handleExportCSV} className="btn-admin btn-admin-primary">
            📥 Export CSV
          </button>
        </div>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Email Address</th>
              <th>Date Subscribed</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: 'var(--admin-text-muted)' }}>
                  No subscribers found.
                </td>
              </tr>
            ) : (
              filtered.map((sub, i) => (
                <tr key={i}>
                  <td style={{ color: 'var(--admin-text-dim)', fontSize: '0.8rem' }}>{i + 1}</td>
                  <td>
                    <strong style={{ color: 'var(--admin-text-main)' }}>{sub.email}</strong>
                  </td>
                  <td style={{ fontSize: '0.85rem', color: 'var(--admin-text-muted)' }}>
                    {sub.date}
                  </td>
                  <td>
                    <span className="badge-pill badge-pill-success">Subscribed</span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      onClick={() => {
                        if (confirm(`Remove subscriber ${sub.email}?`)) {
                          onDelete(sub.email);
                        }
                      }}
                      className="btn-admin btn-admin-danger"
                      style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                    >
                      🗑️
                    </button>
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
