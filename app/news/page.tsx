import { NEWS } from '@/lib/data';
import Link from 'next/link';

export const metadata = {
  title: 'Tech News Bites — TechNova AI',
  description: 'Quick, bite-sized updates on the latest in tech and AI.',
};

export default function NewsPage() {
  return (
    <>
      <section className="category-hero">
        <div className="container">
          <div className="article__breadcrumb">
            <Link href="/">Home</Link> <span>/</span>
            <span>Tech News</span>
          </div>
          <div className="category-hero__icon" style={{ background: 'rgba(108, 92, 231, 0.15)', color: 'var(--color-primary-light)' }}>📰</div>
          <h1 className="category-hero__title">Tech News Bites</h1>
          <p className="category-hero__description">Quick, bite-sized updates on the latest in tech and AI.</p>
          <p className="category-hero__count">{NEWS.length} updates</p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 'var(--space-6)' }}>
        <div className="container">
          <div style={{ display: 'grid', gap: 'var(--space-4)', maxWidth: '800px', margin: '0 auto' }}>
            {NEWS.map(news => (
              <article key={news.id} className="news-card" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', transition: 'transform 0.3s ease' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)', fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' }}>
                  <span style={{ fontWeight: 600, color: 'var(--color-primary-light)' }}>{news.source}</span>
                  <span>{news.date}</span>
                </div>
                <h3 style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-3)', lineHeight: 1.4 }}>{news.headline}</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{news.content}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
