import { CATEGORIES, ARTICLES } from '@/lib/data';
import { getArticleImage } from '@/lib/utils';
import Link from 'next/link';

export function generateStaticParams() {
  return CATEGORIES.map((cat) => ({
    id: cat.id,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cat = CATEGORIES.find(c => c.id === id);
  if (!cat) return { title: 'Category Not Found' };
  return {
    title: `${cat.name} — TechNova AI`,
    description: `Browse all ${cat.count} articles related to ${cat.name} on TechNova AI.`,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const category = CATEGORIES.find(c => c.id === id);
  const articles = ARTICLES.filter(a => a.category === id);

  if (!category) {
    return (
      <div className="container" style={{ padding: 'var(--space-12) 0', textAlign: 'center' }}>
        <h1>Category not found</h1>
        <Link href="/category" style={{ color: 'var(--text-link)', marginTop: 'var(--space-4)', display: 'inline-block' }}>← Browse All Categories</Link>
      </div>
    );
  }

  return (
    <>
      <section className="category-hero">
        <div className="container">
          <div className="article__breadcrumb">
            <Link href="/">Home</Link> <span>/</span>
            <Link href="/category">Categories</Link> <span>/</span>
            <span>{category.name}</span>
          </div>
          <div className={`category-hero__icon ${category.iconClass}`}>{category.icon}</div>
          <h1 className="category-hero__title">{category.name}</h1>
          <p className="category-hero__description">{category.description}</p>
          <p className="category-hero__count">{articles.length} article{articles.length !== 1 ? 's' : ''}</p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 'var(--space-6)' }}>
        <div className="container">
          <div className="cards-grid">
            {articles.length === 0 ? (
              <p style={{ color: 'var(--text-tertiary)' }}>No articles found in this category yet.</p>
            ) : (
              articles.map(a => (
                <Link key={a.id} href={`/article/${a.id}`} className="article-card">
                  <div className="article-card__image-container">
                    <img src={getArticleImage(a)} alt={a.title} className="article-card__image" loading="lazy" />
                    <div className="article-card__category">{a.category}</div>
                  </div>
                  <div className="article-card__content">
                    <div className="article-card__meta">
                      <div className="article-card__author">
                        <img src={a.author.avatar} alt={a.author.name} className="article-card__author-avatar" />
                        <span>{a.author.name}</span>
                      </div>
                      <span>{a.date}</span>
                    </div>
                    <h3 className="article-card__title">{a.title}</h3>
                    <p className="article-card__excerpt">{a.excerpt}</p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>
    </>
  );
}
