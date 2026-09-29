import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="section" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="container" style={{ textAlign: 'center', maxWidth: '600px' }}>
        <div style={{ fontSize: '6rem', marginBottom: 'var(--space-4)', opacity: 0.3 }}>🔍</div>
        <h1 style={{
          fontSize: 'var(--fs-4xl)',
          background: 'var(--gradient-text)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: 'var(--space-4)',
        }}>
          404 — Page Not Found
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--fs-lg)', marginBottom: 'var(--space-8)', lineHeight: 1.6 }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/" style={{
            padding: 'var(--space-3) var(--space-6)',
            background: 'var(--gradient-primary)',
            color: '#fff',
            borderRadius: 'var(--radius-full)',
            fontWeight: 600,
            fontSize: 'var(--fs-md)',
          }}>
            ← Back to Home
          </Link>
          <Link href="/category" style={{
            padding: 'var(--space-3) var(--space-6)',
            border: '1px solid var(--border-primary)',
            color: 'var(--text-primary)',
            borderRadius: 'var(--radius-full)',
            fontWeight: 600,
            fontSize: 'var(--fs-md)',
          }}>
            Browse Articles
          </Link>
        </div>
      </div>
    </section>
  );
}
