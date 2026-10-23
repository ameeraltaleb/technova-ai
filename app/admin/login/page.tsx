'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { AdminStore } from '@/lib/admin-store';
import '../admin.css';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('يرجى إدخال البريد الإلكتروني وكلمة المرور');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      AdminStore.setAuthState({
        email: user.email || email,
        name: user.displayName || 'TechNova Administrator',
      });

      router.push('/admin');
    } catch (err: any) {
      console.error('Firebase Auth Login Error:', err);
      if (
        err.code === 'auth/invalid-credential' ||
        err.code === 'auth/wrong-password' ||
        err.code === 'auth/user-not-found'
      ) {
        setError('البريد الإلكتروني أو كلمة المرور غير صحيحة. يرجى التحقق من المستخدم في Firebase Authentication.');
      } else if (err.code === 'auth/invalid-email') {
        setError('صيغة البريد الإلكتروني غير صالحة.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('تم حظر المحاولات مؤقتاً لكثرة المحاولات الخاطئة. يرجى المحاولة لاحقاً.');
      } else {
        setError(err.message || 'فشل التحقق من حساب المدير عبر Firebase.');
      }
    } finally {
      setLoading(false);
    }
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
          maxWidth: '430px',
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
            تسجيل الدخول الآمن للمشرفين عبر Firebase Authentication
          </p>
        </div>

        {error && (
          <div
            style={{
              padding: '12px 14px',
              borderRadius: '8px',
              background: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#dc2626',
              fontSize: '0.85rem',
              marginBottom: '18px',
              lineHeight: 1.5,
              direction: 'rtl',
            }}
          >
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">البريد الإلكتروني للإدارة (Admin Email)</label>
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
            <label className="form-label">كلمة المرور (Password)</label>
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
            {loading ? 'جاري التحقق من Firebase...' : 'تسجيل الدخول إلى اللوحة'}
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
          🔒 محمي بواسطة نظام أمان وتحقق Firebase Authentication
        </div>
      </div>
    </div>
  );
}
