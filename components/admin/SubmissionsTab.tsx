'use client';

import { useState } from 'react';
import { ToolSubmission, ToolItem } from '@/lib/admin-store';

interface SubmissionsTabProps {
  submissions: ToolSubmission[];
  onApprove: (submission: ToolSubmission, index: number) => void;
  onReject: (index: number) => void;
}

export default function SubmissionsTab({
  submissions,
  onApprove,
  onReject,
}: SubmissionsTabProps) {
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  const filtered = submissions.filter((sub) => {
    if (filter === 'all') return true;
    const status = sub.status || 'pending';
    return status === filter;
  });

  return (
    <div className="admin-panel">
      <div className="admin-panel__header">
        <div>
          <h2 className="admin-panel__title">Tool Submissions Queue ({submissions.length})</h2>
          <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: 'var(--admin-text-muted)' }}>
            Review external tool developer submissions and approve them to your live directory
          </p>
        </div>
        <div className="admin-panel__controls">
          <select
            className="admin-select"
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
          >
            <option value="all">All Submissions</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Tool Details</th>
              <th>Submitter Email</th>
              <th>Tier</th>
              <th>Category</th>
              <th>Submitted</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: 'var(--admin-text-muted)' }}>
                  No submissions found matching &quot;{filter}&quot;.
                </td>
              </tr>
            ) : (
              filtered.map((sub, i) => {
                const status = sub.status || 'pending';
                return (
                  <tr key={i}>
                    <td>
                      <div style={{ fontWeight: 600, color: '#fff' }}>{sub.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>
                        {sub.url}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-dim)', marginTop: '2px', maxWidth: '280px' }}>
                        {sub.description}
                      </div>
                    </td>
                    <td style={{ fontSize: '0.85rem' }}>
                      <a href={`mailto:${sub.email}`} style={{ color: '#a29bfe', textDecoration: 'none' }}>
                        {sub.email}
                      </a>
                    </td>
                    <td>
                      <span className={`badge-pill ${sub.tier === 'featured' ? 'badge-pill-primary' : 'badge-pill-warning'}`}>
                        {sub.tier.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <span className="badge-pill badge-pill-primary">{sub.category}</span>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)' }}>
                      {new Date(sub.date).toLocaleDateString()}
                    </td>
                    <td>
                      <span
                        className={`badge-pill ${
                          status === 'approved'
                            ? 'badge-pill-success'
                            : status === 'rejected'
                            ? 'btn-admin-danger'
                            : 'badge-pill-warning'
                        }`}
                      >
                        {status.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {status === 'pending' ? (
                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                          <button
                            onClick={() => onApprove(sub, i)}
                            className="btn-admin btn-admin-primary"
                            style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                          >
                            ✓ Approve
                          </button>
                          <button
                            onClick={() => onReject(i)}
                            className="btn-admin btn-admin-danger"
                            style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-dim)' }}>
                          Processed
                        </span>
                      )}
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
