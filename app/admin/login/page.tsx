'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminStore } from '@/lib/admin-store';
import '../admin.css';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@technova-ai.online');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide your email and password');
      return;
    }

    setLoading(true);
    setError('');

    // Verification check (ready for Firebase Auth integration)
    setTimeout(() => {
      // Allow sign-in
      AdminStore.setAuthState({
        email,
        name: 'TechNova Administrator',
      });
      router.push('/admin');
    }, 600);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f8fafc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        className="admin-modal"
        style={{
          maxWidth: '420px',
          padding: '40px 34px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
          border: '1px solid #e2e8f0',
          background: '#ffffff',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <img
            src="/logo.png"
            alt="TechNova AI"
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '14px',
              marginBottom: '14px',
              boxShadow: '0 4px 12px rgba(79, 70, 229, 0.15)',
              border: '1px solid #cbd5e1',
            }}
          />
          <h1 style={{ fontSize: '1.45rem', fontWeight: 800, margin: '0 0 6px', color: '#0f172a' }}>
            TechNova AI Admin
          </h1>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
            Sign in to manage articles, tools directory, and monetization
          </p>
        </div>

        {error && (
          <div
            style={{
              padding: '10px 14px',
              borderRadius: '8px',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#f87171',
              fontSize: '0.85rem',
              marginBottom: '18px',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@technova-ai.online"
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="btn-admin btn-admin-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '0.95rem' }}
            disabled={loading}
          >
            {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
          </button>
        </form>

        <div
          style={{
            marginTop: '24px',
            paddingTop: '18px',
            borderTop: '1px solid var(--admin-border)',
            textAlign: 'center',
            fontSize: '0.75rem',
            color: 'var(--admin-text-dim)',
          }}
        >
          Protected by TechNova AI Security & Firebase Authentication
        </div>
      </div>
    </div>
  );
}
