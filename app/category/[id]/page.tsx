import { CATEGORIES, ARTICLES } from '@/lib/data';
import Link from 'next/link';

export function generateStaticParams() {
  return CATEGORIES.map((cat) => ({
    id: cat.id,
  }));
}

export function generateMetadata({ params }: { params: { id: string } }) {
  const cat = CATEGORIES.find(c => c.id === params.id);
  if (!cat) return { title: 'Category Not Found' };
  return {
    title: `${cat.name} — TechNova AI`,
    description: `Browse all articles related to ${cat.name} on TechNova AI.`,
  };
}

export default function CategoryPage({ params }: { params: { id: string } }) {
  const category = CATEGORIES.find(c => c.id === params.id);
  const articles = ARTICLES.filter(a => a.category === params.id);

  if (!category) {
    return (
      <div className="container" style={{ padding: 'var(--space-12) 0', textAlign: 'center' }}>
        <h1>Category not found</h1>
      </div>
    );
  }

  return (
    <>
      <section className="category-hero">
        <div className="container">
          <div className="article__breadcrumb">
            <Link href="/">Home</Link> <span>/</span>
            <span>{category.name}</span>
          </div>
          <div className={`category-hero__icon ${category.iconClass}`}>{category.icon}</div>
          <h1 className="category-hero__title">{category.name}</h1>
          <p className="category-hero__description">Explore {category.name} articles and reviews.</p>
          <p className="category-hero__count">{category.count} articles</p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 'var(--space-6)' }}>
        <div className="container">
          <div className="cards-grid">
            {articles.length === 0 ? (
              <p style={{ color: 'var(--text-tertiary)' }}>No articles found.</p>
            ) : (
              articles.map(a => (
                <Link key={a.id} href={`/article/${a.id}`} className="article-card">
                  <div className="article-card__image-container">
                    <img src={a.image} alt={a.title} className="article-card__image" />
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
