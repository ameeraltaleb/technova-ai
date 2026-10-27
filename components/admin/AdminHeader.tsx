'use client';

import { AdminTab } from './AdminSidebar';

interface AdminHeaderProps {
  activeTab: AdminTab;
  onNewAction?: () => void;
  newActionLabel?: string;
  isFirebaseConnected: boolean;
  userEmail?: string;
  onSync?: () => void;
  isSyncing?: boolean;
}

export default function AdminHeader({
  activeTab,
  onNewAction,
  newActionLabel,
  isFirebaseConnected,
  userEmail = 'admin@technova-ai.online',
  onSync,
  isSyncing = false,
}: AdminHeaderProps) {
  const titles: Record<AdminTab, string> = {
    overview: 'Dashboard Overview',
    articles: 'Articles & Tool Reviews',
    tools: 'AI Tools Directory Management',
    submissions: 'Pending Tool Submissions',
    news: 'Tech News & Breaking Updates',
    subscribers: 'Newsletter Subscribers',
    settings: 'Site Settings & Monetization',
  };

  return (
    <header className="admin-header">
      <div className="admin-header__title-area">
        <h1 className="admin-header__title">{titles[activeTab]}</h1>
      </div>

      <div className="admin-header__actions">
        <div className={`firebase-badge ${isFirebaseConnected ? 'connected' : ''}`}>
          <span className="firebase-badge__dot"></span>
          <span>{isFirebaseConnected ? 'Firebase Live' : 'Local Storage Mode'}</span>
        </div>

        {onSync && (
          <button
            onClick={onSync}
            disabled={isSyncing}
            className="btn-admin btn-admin-outline"
            style={{
              padding: '6px 12px',
              fontSize: '0.8rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              borderColor: '#c7d2fe',
              color: '#4338ca',
            }}
            title="مزامنة فورية لكافة المقالات والبيانات من السيرفر"
          >
            <span
              style={{
                display: 'inline-block',
                animation: isSyncing ? 'spin 0.8s linear infinite' : 'none',
              }}
            >
              🔄
            </span>
            <span>{isSyncing ? 'جاري المزامنة...' : 'مزامنة السحاب'}</span>
          </button>
        )}

        {onNewAction && newActionLabel && (
          <button onClick={onNewAction} className="btn-admin btn-admin-primary">
            + {newActionLabel}
          </button>
        )}

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '4px 10px',
            background: '#f1f5f9',
            borderRadius: '20px',
            border: '1px solid var(--admin-border)',
            fontSize: '0.8rem',
            color: 'var(--admin-text-muted)',
          }}
        >
          <img
            src="https://ui-avatars.com/api/?name=Admin&background=6c5ce7&color=fff&size=28"
            alt="Admin"
            style={{ width: '24px', height: '24px', borderRadius: '50%' }}
          />
          <span>{userEmail}</span>
        </div>
      </div>
    </header>
  );
}
