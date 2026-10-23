'use client';

import { useState } from 'react';

interface SubmitToolModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SubmitToolModal({ isOpen, onClose }: SubmitToolModalProps) {
  const [tier, setTier] = useState<'featured' | 'review' | 'free'>('featured');
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
        submissions.push({
          name,
          url,
          category,
          email,
          description,
          tier,
          date: new Date().toISOString(),
        });
        localStorage.setItem('technova_tool_submissions', JSON.stringify(submissions));
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
              {tier === 'featured' || tier === 'review' ? (
                <>
                  Thank you for submitting <strong>{name}</strong> for the <strong>{tier === 'featured' ? 'Featured Placement ($49)' : 'Dedicated Review ($149)'}</strong> package! Our editorial team will review your tool and send your placement confirmation and invoice to <strong>{email}</strong> within 2 hours.
                </>
              ) : (
                <>
                  Thank you for submitting <strong>{name}</strong>! Your tool has been added to our editorial review queue.
                </>
              )}
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
            <div style={{ marginBottom: 'var(--space-6)' }}>
              <div style={{ display: 'inline-block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-primary-light)', marginBottom: '4px' }}>
                // Promote Your AI Product
              </div>
              <h2 style={{ fontSize: 'var(--fs-2xl)', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                Feature Your Tool on TechNova AI
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--fs-sm)', marginTop: '6px', lineHeight: 1.5 }}>
                Put your software in front of thousands of developers, founders, and AI enthusiasts.
              </p>
            </div>

            {/* Pricing Tiers Selection */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-2)', marginBottom: 'var(--space-6)' }}>
              <div
                onClick={() => setTier('featured')}
                style={{
                  padding: '12px 10px',
                  borderRadius: 'var(--radius-md)',
                  border: tier === 'featured' ? '2px solid var(--color-primary)' : '1px solid var(--border-card)',
                  background: tier === 'featured' ? 'rgba(108, 92, 231, 0.12)' : 'var(--bg-secondary)',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    top: '-9px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: '#00cec9',
                    color: '#000',
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    padding: '1px 6px',
                    borderRadius: '4px',
                    textTransform: 'uppercase',
                  }}
                >
                  Popular
                </span>
                <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>Featured</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary-light)', margin: '4px 0' }}>$49</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>24h Fast Track + Top Badge</div>
              </div>

              <div
                onClick={() => setTier('review')}
                style={{
                  padding: '12px 10px',
                  borderRadius: 'var(--radius-md)',
                  border: tier === 'review' ? '2px solid var(--color-primary)' : '1px solid var(--border-card)',
                  background: tier === 'review' ? 'rgba(108, 92, 231, 0.12)' : 'var(--bg-secondary)',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>Full Review</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary-light)', margin: '4px 0' }}>$149</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>1,500+ Word Dedicated Article</div>
              </div>

              <div
                onClick={() => setTier('free')}
                style={{
                  padding: '12px 10px',
                  borderRadius: 'var(--radius-md)',
                  border: tier === 'free' ? '2px solid var(--color-primary)' : '1px solid var(--border-card)',
                  background: tier === 'free' ? 'rgba(108, 92, 231, 0.12)' : 'var(--bg-secondary)',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>Standard</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: '4px 0' }}>$0</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>Normal Review Queue</div>
              </div>
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
                {loading ? 'Submitting...' : tier === 'free' ? 'Submit for Review' : `Proceed with ${tier === 'featured' ? 'Featured ($49)' : 'Full Review ($149)'}`}
              </button>

              <div style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                🔒 Zero spam. We never share your email. Invoices processed securely.
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
