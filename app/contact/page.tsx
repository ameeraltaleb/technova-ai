'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('General Inquiry');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ text: string; ok: boolean } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) return; // Silent reject for spam bots

    if (!name.trim() || !email.trim() || !message.trim()) {
      setStatusMsg({ text: 'Please fill out all required fields.', ok: false });
      return;
    }

    setIsSubmitting(true);
    setStatusMsg(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          topic,
          subject: subject.trim(),
          message: message.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setStatusMsg({
          text: '✓ Thank you! Your message has been sent successfully. We will reply to your email within 24 to 48 business hours.',
          ok: true,
        });
        setName('');
        setEmail('');
        setSubject('');
        setMessage('');
        setTopic('General Inquiry');
      } else {
        setStatusMsg({ text: data.error || 'Failed to submit message. Please try again.', ok: false });
      }
    } catch (err: any) {
      setStatusMsg({ text: 'Network error: ' + (err.message || 'Please try again later.'), ok: false });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <section className="category-hero">
        <div className="container">
          <div className="article__breadcrumb">
            <Link href="/">Home</Link> <span>/</span>
            <span>Contact Us</span>
          </div>
          <div
            className="category-hero__icon"
            style={{ background: 'rgba(99, 102, 241, 0.15)', color: 'var(--color-primary-light)' }}
          >
            📬
          </div>
          <h1 className="category-hero__title">Contact TechNova AI</h1>
          <p className="category-hero__description">
            Have questions about our reviews, want to submit an AI tool, or interested in partnerships? We would love to hear from you.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 'var(--space-8)', paddingBottom: 'var(--space-12)' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: 'var(--space-8)',
              alignItems: 'start',
            }}
          >
            {/* Direct Contact Cards & Info */}
            <div>
              <div className="section__label">// Direct Channels</div>
              <h2 className="section__title" style={{ marginBottom: 'var(--space-4)', fontSize: '1.75rem' }}>
                We Are Here to Help
              </h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 'var(--space-6)' }}>
                Whether you are a developer looking for software recommendations, a tech company planning to feature your tool, or a reader with editorial feedback, choose the channel that fits best.
              </p>

              <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
                <div
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-card)',
                    borderRadius: 'var(--radius-lg)',
                    padding: 'var(--space-5)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '14px',
                  }}
                >
                  <div style={{ fontSize: '1.5rem', lineHeight: 1 }}>✉️</div>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '4px' }}>Editorial & Inquiries</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0 0 6px 0' }}>
                      General questions, tips, fact checks, and corrections.
                    </p>
                    <a
                      href="mailto:contact@technova-ai.online"
                      style={{ color: 'var(--color-primary-light)', fontWeight: 600, fontSize: '0.88rem', textDecoration: 'none' }}
                    >
                      contact@technova-ai.online
                    </a>
                  </div>
                </div>

                <div
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-card)',
                    borderRadius: 'var(--radius-lg)',
                    padding: 'var(--space-5)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '14px',
                  }}
                >
                  <div style={{ fontSize: '1.5rem', lineHeight: 1 }}>💼</div>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '4px' }}>Partnerships & Advertising</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0 0 6px 0' }}>
                      Sponsored deep-dives, banner placements, and affiliate collaborations.
                    </p>
                    <a
                      href="mailto:partners@technova-ai.online"
                      style={{ color: 'var(--color-primary-light)', fontWeight: 600, fontSize: '0.88rem', textDecoration: 'none' }}
                    >
                      partners@technova-ai.online
                    </a>
                  </div>
                </div>

                <div
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-card)',
                    borderRadius: 'var(--radius-lg)',
                    padding: 'var(--space-5)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '14px',
                  }}
                >
                  <div style={{ fontSize: '1.5rem', lineHeight: 1 }}>🛡️</div>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '4px' }}>Privacy & Data Rights</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0 0 6px 0' }}>
                      GDPR/CCPA inquiries, data export, or removal requests.
                    </p>
                    <a
                      href="mailto:privacy@technova-ai.online"
                      style={{ color: 'var(--color-primary-light)', fontWeight: 600, fontSize: '0.88rem', textDecoration: 'none' }}
                    >
                      privacy@technova-ai.online
                    </a>
                  </div>
                </div>

                <div
                  style={{
                    padding: 'var(--space-4)',
                    background: 'rgba(99, 102, 241, 0.08)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid rgba(99, 102, 241, 0.25)',
                    fontSize: '0.85rem',
                    color: 'var(--text-secondary)',
                  }}
                >
                  ⏱️ <strong>Response Expectation:</strong> We review all incoming messages and aim to respond within 24 to 48 hours, Monday through Friday.
                </div>
              </div>
            </div>

            {/* Contact Form Container */}
            <div
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-card)',
                borderRadius: 'var(--radius-xl)',
                padding: 'var(--space-8)',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
              }}
            >
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px' }}>Send Us a Message</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 'var(--space-6)' }}>
                Fill out the form below. All messages are securely delivered directly to our editorial inbox.
              </p>

              {statusMsg && (
                <div
                  style={{
                    padding: '12px 16px',
                    borderRadius: '8px',
                    marginBottom: '20px',
                    fontSize: '0.9rem',
                    background: statusMsg.ok ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                    border: statusMsg.ok ? '1px solid rgba(16, 185, 129, 0.35)' : '1px solid rgba(239, 68, 68, 0.35)',
                    color: statusMsg.ok ? '#10b981' : '#ef4444',
                    lineHeight: 1.5,
                  }}
                >
                  {statusMsg.text}
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 'var(--space-4)' }}>
                {/* Honeypot field (hidden from real users, traps spam bots) */}
                <input
                  type="text"
                  name="website_trap"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                  style={{ display: 'none' }}
                />

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                      Your Full Name <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. John Doe"
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        background: 'var(--bg-input)',
                        border: '1px solid var(--border-card)',
                        borderRadius: 'var(--radius-md)',
                        color: 'var(--text-primary)',
                        fontSize: '0.92rem',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                      Email Address <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        background: 'var(--bg-input)',
                        border: '1px solid var(--border-card)',
                        borderRadius: 'var(--radius-md)',
                        color: 'var(--text-primary)',
                        fontSize: '0.92rem',
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                      Topic / Category
                    </label>
                    <select
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        background: 'var(--bg-input)',
                        border: '1px solid var(--border-card)',
                        borderRadius: 'var(--radius-md)',
                        color: 'var(--text-primary)',
                        fontSize: '0.92rem',
                      }}
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Submit a Tool for Review">Submit a Tool for Review</option>
                      <option value="Advertising & Partnerships">Advertising & Partnerships</option>
                      <option value="Editorial Feedback">Editorial Feedback / Correction</option>
                      <option value="Write for Us">Write for Us / Guest Post</option>
                      <option value="Bug Report">Bug Report / Technical Issue</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                      Subject
                    </label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Brief overview of your inquiry"
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        background: 'var(--bg-input)',
                        border: '1px solid var(--border-card)',
                        borderRadius: 'var(--radius-md)',
                        color: 'var(--text-primary)',
                        fontSize: '0.92rem',
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                    Your Message <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <textarea
                    required
                    rows={6}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us more about how we can help..."
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      background: 'var(--bg-input)',
                      border: '1px solid var(--border-card)',
                      borderRadius: 'var(--radius-md)',
                      color: 'var(--text-primary)',
                      fontSize: '0.92rem',
                      resize: 'vertical',
                      lineHeight: 1.6,
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    padding: '12px 28px',
                    background: 'var(--gradient-primary)',
                    color: '#fff',
                    borderRadius: 'var(--radius-full)',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    border: 'none',
                    justifySelf: 'start',
                    boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)',
                    opacity: isSubmitting ? 0.7 : 1,
                    transition: 'all 0.2s ease',
                  }}
                >
                  {isSubmitting ? 'Sending Message...' : 'Send Message →'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

