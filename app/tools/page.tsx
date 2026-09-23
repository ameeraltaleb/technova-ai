import { TOOLS } from '@/lib/data';
import Link from 'next/link';

export const metadata = {
  title: 'AI Tools Directory — TechNova AI',
  description: 'Explore the best AI tools, software, and platforms.',
};

export default function ToolsPage() {
  return (
    <>
      <section className="category-hero">
        <div className="container">
          <div className="article__breadcrumb">
            <Link href="/">Home</Link> <span>/</span>
            <span>Tools Directory</span>
          </div>
          <div className="category-hero__icon" style={{ background: 'rgba(232, 67, 147, 0.15)', color: 'var(--color-secondary)' }}>⚡</div>
          <h1 className="category-hero__title">AI Tools Directory</h1>
          <p className="category-hero__description">The ultimate curated list of the best AI tools for every use case.</p>
          <p className="category-hero__count">{TOOLS.length} tools available</p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 'var(--space-6)' }}>
        <div className="container">
          <div className="cards-grid" id="toolsGrid">
            {TOOLS.map(tool => (
              <a key={tool.id} href={tool.url} target="_blank" rel="noopener noreferrer" className="article-card" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: 'var(--space-6)', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', height: '120px' }}>
                  {tool.icon}
                </div>
                <div className="article-card__content" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div className="article-card__meta">
                    <span className="article-card__tag">{tool.category}</span>
                    <span>⭐ {tool.rating}</span>
                  </div>
                  <h3 className="article-card__title">{tool.name}</h3>
                  <p className="article-card__excerpt" style={{ flex: 1 }}>{tool.description}</p>
                  <div style={{ marginTop: 'var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--color-primary-light)', fontWeight: 600 }}>
                    {tool.pricing} →
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
