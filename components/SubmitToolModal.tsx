'use client';

import { useState } from 'react';

interface SubmitToolModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SubmitToolModal({ isOpen, onClose }: SubmitToolModalProps) {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState('ai-tools');
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !url || !email) return;

    setLoading(true);
    setTimeout(() => {
      try {
        const submissions = JSON.parse(localStorage.getItem('technova_tool_submissions') || '[]');
        const item = {
          name,
          url,
          category,
          email,
          description,
          tier: 'free' as const,
          date: new Date().toISOString(),
        };
        submissions.push(item);
        localStorage.setItem('technova_tool_submissions', JSON.stringify(submissions));
        import('@/lib/firebase-service').then(({ FirebaseService }) => {
          FirebaseService.saveSubmission(item).catch(() => {});
        }).catch(() => {});
      } catch {
        // Fallback
      }
      setLoading(false);
      setIsSubmitted(true);
    }, 600);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setName('');
    setUrl('');
    setEmail('');
    setDescription('');
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-4)',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '580px',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-card)',
          borderRadius: 'var(--radius-xl)',
          padding: 'var(--space-8)',
          boxShadow: 'var(--shadow-xl)',
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 'var(--space-4)',
            right: 'var(--space-4)',
            background: 'none',
            border: 'none',
            color: 'var(--text-tertiary)',
            fontSize: '1.25rem',
            cursor: 'pointer',
            padding: '4px 8px',
          }}
          aria-label="Close"
        >
          ✕
        </button>

        {isSubmitted ? (
          <div style={{ textAlign: 'center', padding: 'var(--space-6) 0' }}>
            <div style={{ fontSize: '3rem', marginBottom: 'var(--space-3)' }}>🎉</div>
            <h3 style={{ fontSize: 'var(--fs-2xl)', fontWeight: 700, marginBottom: 'var(--space-3)' }}>
              Submission Received!
            </h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 'var(--space-6)' }}>
              Thank you for submitting <strong>{name}</strong>! Your tool has been added to our editorial review queue. Our team evaluates every submission according to utility, quality, and independent editorial standards.
            </p>
            <button
              onClick={handleReset}
              className="navbar__link"
              style={{
                background: 'var(--color-primary)',
                color: '#fff',
                padding: '10px 24px',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                fontWeight: 600,
                border: 'none',
              }}
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: 'var(--space-4)' }}>
              <div style={{ display: 'inline-block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-primary-light)', marginBottom: '4px' }}>
                // Suggest an AI Tool
              </div>
              <h2 style={{ fontSize: 'var(--fs-2xl)', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                Submit a Tool for Editorial Review
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--fs-sm)', marginTop: '6px', lineHeight: 1.5 }}>
                Recommend an AI tool or software for inclusion in the TechNova directory. Every submission is evaluated independently.
              </p>
            </div>

            {/* Editorial Policy Callout */}
            <div
              style={{
                background: 'rgba(108, 92, 231, 0.08)',
                border: '1px solid rgba(108, 92, 231, 0.25)',
                borderRadius: 'var(--radius-md)',
                padding: '10px 14px',
                marginBottom: 'var(--space-5)',
                fontSize: '0.8rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.5,
              }}
            >
              ⚖️ <strong>Editorial Policy:</strong> TechNova AI operates on independent editorial standards. Submissions are reviewed for merit without pay-for-placement or sponsored ranking fees. Submission does not guarantee listing.
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Tool Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Acme AI"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-card)',
                    color: 'var(--text-primary)',
                    fontSize: '0.9rem',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Website URL *
                </label>
                <input
                  type="url"
                  placeholder="https://yourtool.com"
                  required
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-card)',
                    color: 'var(--text-primary)',
                    fontSize: '0.9rem',
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border-card)',
                      color: 'var(--text-primary)',
                      fontSize: '0.9rem',
                      outline: 'none',
                    }}
                  >
                    <option value="ai-tools">AI Tools</option>
                    <option value="dev-tools">Dev Tools</option>
                    <option value="productivity">Productivity</option>
                    <option value="design">Design</option>
                    <option value="security">Cybersecurity</option>
                    <option value="cloud">Cloud & SaaS</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Your Contact Email *
                  </label>
                  <input
                    type="email"
                    placeholder="founder@yourtool.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border-card)',
                      color: 'var(--text-primary)',
                      fontSize: '0.9rem',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Short Pitch (1-2 sentences)
                </label>
                <textarea
                  placeholder="What does your tool do and why do users love it?"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-card)',
                    color: 'var(--text-primary)',
                    fontSize: '0.9rem',
                    outline: 'none',
                    resize: 'vertical',
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  marginTop: 'var(--space-2)',
                  padding: '12px 20px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--gradient-primary)',
                  color: '#fff',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-glow)',
                  transition: 'opacity 0.2s ease',
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? 'Submitting...' : 'Submit for Editorial Review'}
              </button>

              <div style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                🔒 Zero spam. We never share your email. Free submission without fee-for-placement.
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
