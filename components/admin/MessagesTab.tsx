'use client';

import { useState } from 'react';
import { ContactMessage } from '@/lib/admin-store';

interface MessagesTabProps {
  messages: ContactMessage[];
  onUpdateStatus: (id: string, status: 'unread' | 'read' | 'replied') => void;
  onDeleteMessage: (id: string) => void;
}

export default function MessagesTab({
  messages,
  onUpdateStatus,
  onDeleteMessage,
}: MessagesTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'unread' | 'read' | 'replied'>('all');
  const [activeMessage, setActiveMessage] = useState<ContactMessage | null>(null);

  const filtered = messages.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.message.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = selectedStatus === 'all' || m.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const unreadCount = messages.filter((m) => m.status === 'unread').length;

  const handleReply = (msg: ContactMessage) => {
    // Open default mail client with pre-filled professional response template
    const subject = encodeURIComponent(`Re: ${msg.subject}`);
    const body = encodeURIComponent(
      `Hello ${msg.name},\n\nThank you for reaching out to TechNova AI.\n\nRegarding your inquiry:\n"${msg.message.slice(0, 150)}..."\n\n\n\nBest regards,\nEditorial Team | TechNova AI\nhttps://www.technova-ai.online`
    );
    window.location.href = `mailto:${msg.email}?subject=${subject}&body=${body}`;

    // Auto mark as replied
    onUpdateStatus(msg.id, 'replied');
  };

  return (
    <div>
      {/* Header Controls */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '20px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <input
            type="text"
            className="form-input"
            placeholder="Search messages by sender, email, keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '280px', padding: '8px 12px', fontSize: '0.85rem' }}
          />

          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={() => setSelectedStatus('all')}
              className={`btn-admin ${selectedStatus === 'all' ? 'btn-admin-primary' : 'btn-admin-outline'}`}
              style={{ padding: '6px 12px', fontSize: '0.8rem' }}
            >
              All ({messages.length})
            </button>
            <button
              onClick={() => setSelectedStatus('unread')}
              className={`btn-admin ${selectedStatus === 'unread' ? 'btn-admin-primary' : 'btn-admin-outline'}`}
              style={{
                padding: '6px 12px',
                fontSize: '0.8rem',
                borderColor: unreadCount > 0 ? '#6366f1' : undefined,
                color: unreadCount > 0 && selectedStatus !== 'unread' ? '#6366f1' : undefined,
              }}
            >
              🔵 Unread ({unreadCount})
            </button>
            <button
              onClick={() => setSelectedStatus('replied')}
              className={`btn-admin ${selectedStatus === 'replied' ? 'btn-admin-primary' : 'btn-admin-outline'}`}
              style={{ padding: '6px 12px', fontSize: '0.8rem' }}
            >
              🟢 Replied ({messages.filter((m) => m.status === 'replied').length})
            </button>
          </div>
        </div>

        <div style={{ fontSize: '0.82rem', color: 'var(--admin-text-muted)' }}>
          Showing <strong>{filtered.length}</strong> of {messages.length} messages
        </div>
      </div>

      {/* Messages List */}
      {filtered.length === 0 ? (
        <div className="admin-card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '12px' }}>📭</div>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '6px' }}>No messages found</h3>
          <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.88rem' }}>
            {searchTerm || selectedStatus !== 'all'
              ? 'No messages match your search criteria.'
              : 'Messages submitted through the /contact page will appear here.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '12px' }}>
          {filtered.map((msg) => {
            const isUnread = msg.status === 'unread';
            const isReplied = msg.status === 'replied';

            return (
              <div
                key={msg.id}
                className="admin-card"
                style={{
                  padding: '16px 20px',
                  borderLeft: isUnread ? '4px solid #6366f1' : isReplied ? '4px solid #10b981' : '4px solid #94a3b8',
                  background: isUnread ? 'rgba(99, 102, 241, 0.02)' : undefined,
                  transition: 'all 0.15s ease',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: '12px',
                    flexWrap: 'wrap',
                  }}
                >
                  <div style={{ flex: 1, minWidth: '260px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{msg.name}</span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)' }}>&lt;{msg.email}&gt;</span>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          padding: '2px 8px',
                          borderRadius: '12px',
                          fontWeight: 600,
                          background: isUnread ? '#e0e7ff' : isReplied ? '#d1fae5' : '#f1f5f9',
                          color: isUnread ? '#4338ca' : isReplied ? '#065f46' : '#475569',
                        }}
                      >
                        {isUnread ? '🔵 New / Unread' : isReplied ? '🟢 Replied' : '⚪ Read'}
                      </span>
                      {msg.topic && (
                        <span
                          style={{
                            fontSize: '0.72rem',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            background: '#f8fafc',
                            border: '1px solid #e2e8f0',
                            color: '#64748b',
                          }}
                        >
                          {msg.topic}
                        </span>
                      )}
                    </div>

                    <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '6px', color: '#0f172a' }}>
                      {msg.subject}
                    </div>

                    <p
                      style={{
                        fontSize: '0.85rem',
                        color: 'var(--admin-text-muted)',
                        lineHeight: 1.5,
                        margin: 0,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {msg.message}
                    </p>
                  </div>

                  {/* Actions Column */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>
                      {new Date(msg.date).toLocaleDateString()} {new Date(msg.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>

                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        onClick={() => {
                          setActiveMessage(msg);
                          if (msg.status === 'unread') {
                            onUpdateStatus(msg.id, 'read');
                          }
                        }}
                        className="btn-admin btn-admin-outline"
                        style={{ padding: '4px 10px', fontSize: '0.78rem' }}
                        title="View Full Message"
                      >
                        👁️ View
                      </button>

                      <button
                        onClick={() => handleReply(msg)}
                        className="btn-admin btn-admin-primary"
                        style={{
                          padding: '4px 10px',
                          fontSize: '0.78rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                        title="Reply via Email"
                      >
                        ✉️ Reply
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`Delete message from "${msg.name}"?`)) {
                            onDeleteMessage(msg.id);
                          }
                        }}
                        className="btn-admin btn-admin-danger"
                        style={{ padding: '4px 8px', fontSize: '0.78rem' }}
                        title="Delete Message"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Message Detail Modal */}
      {activeMessage && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px',
          }}
          onClick={() => setActiveMessage(null)}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: '12px',
              maxWidth: '650px',
              width: '100%',
              padding: '28px',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '16px',
                borderBottom: '1px solid #e2e8f0',
                paddingBottom: '12px',
              }}
            >
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0 0 4px 0' }}>
                  {activeMessage.subject}
                </h3>
                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                  From: <strong>{activeMessage.name}</strong> ({activeMessage.email})
                </div>
              </div>
              <button
                onClick={() => setActiveMessage(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.4rem',
                  cursor: 'pointer',
                  color: '#94a3b8',
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
              <span style={{ fontSize: '0.8rem', padding: '3px 8px', background: '#f1f5f9', borderRadius: '4px' }}>
                Topic: <strong>{activeMessage.topic || 'General'}</strong>
              </span>
              <span style={{ fontSize: '0.8rem', padding: '3px 8px', background: '#f1f5f9', borderRadius: '4px' }}>
                Date: {new Date(activeMessage.date).toLocaleString()}
              </span>
            </div>

            <div
              style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '16px',
                fontSize: '0.92rem',
                lineHeight: 1.7,
                whiteSpace: 'pre-wrap',
                color: '#1e293b',
                marginBottom: '24px',
              }}
            >
              {activeMessage.message}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Status:</span>
                <select
                  value={activeMessage.status}
                  onChange={(e) => {
                    const newStatus = e.target.value as 'unread' | 'read' | 'replied';
                    onUpdateStatus(activeMessage.id, newStatus);
                    setActiveMessage({ ...activeMessage, status: newStatus });
                  }}
                  style={{
                    padding: '6px 10px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.85rem',
                  }}
                >
                  <option value="unread">🔵 Unread</option>
                  <option value="read">⚪ Read</option>
                  <option value="replied">🟢 Replied</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => handleReply(activeMessage)}
                  className="btn-admin btn-admin-primary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  ✉️ Reply via Email
                </button>
                <button onClick={() => setActiveMessage(null)} className="btn-admin btn-admin-outline">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

