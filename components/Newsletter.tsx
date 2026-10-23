'use client';

import { useState } from 'react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'loading'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setStatus('loading');
    setTimeout(() => {
      try {
        const existing = JSON.parse(localStorage.getItem('technova_subscribers') || '[]');
        if (!existing.includes(email)) {
          existing.push(email);
          localStorage.setItem('technova_subscribers', JSON.stringify(existing));
        }
      } catch {
        // Fallback
      }
      setStatus('success');
      setEmail('');
    }, 600);
  };

  return (
    <section className="section" style={{ padding: 'var(--space-12) 0' }}>
      <div className="container container--narrow">
        <div className="newsletter">
          <div className="newsletter__icon">⚡</div>
          <h2 className="newsletter__title">Stay Ahead in the AI Revolution</h2>
          <p className="newsletter__text">
            Join 12,000+ engineers, designers, and tech leaders receiving our weekly curated breakdown of the most powerful new AI tools and breaking tech news.
          </p>

          {status === 'success' ? (
            <div
              style={{
                background: 'rgba(0, 206, 201, 0.15)',
                border: '1px solid #00cec9',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-4) var(--space-6)',
                maxWidth: '500px',
                margin: '0 auto',
                color: '#fff',
                fontSize: 'var(--fs-md)',
              }}
            >
              🎉 <strong>You&apos;re in!</strong> Check your inbox for this week&apos;s AI tool roundup.
            </div>
          ) : (
            <form className="newsletter__form" onSubmit={handleSubmit}>
              <input
                type="email"
                className="newsletter__input"
                placeholder="Enter your email address..."
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === 'loading'}
              />
              <button type="submit" className="newsletter__btn" disabled={status === 'loading'}>
                {status === 'loading' ? 'Joining...' : 'Subscribe Free'}
              </button>
            </form>
          )}

          <p style={{ marginTop: 'var(--space-4)', fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)' }}>
            No spam, ever. Unsubscribe with a single click anytime.
          </p>
        </div>
      </div>
    </section>
  );
}
