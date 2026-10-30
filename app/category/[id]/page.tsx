import { CATEGORIES } from '@/lib/data';
import { getLiveArticles } from '@/lib/public-data';
import { getArticleImage } from '@/lib/utils';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const revalidate = 60;

export function generateStaticParams() {
  return CATEGORIES.map((cat) => ({
    id: cat.id,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cat = CATEGORIES.find(c => c.id === id);
  if (!cat) {
    notFound();
  }
  const catUrl = `https://www.technova-ai.online/category/${cat.id}`;
  return {
    title: cat.name,
    description: `Browse comprehensive reviews, guides, and articles related to ${cat.name} on TechNova AI.`,
    alternates: {
      canonical: catUrl,
    },
    openGraph: {
      title: `${cat.name} — TechNova AI`,
      description: `Browse comprehensive reviews, guides, and articles related to ${cat.name} on TechNova AI.`,
      url: catUrl,
    },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const category = CATEGORIES.find(c => c.id === id);
  if (!category) {
    notFound();
  }

  const allArticles = await getLiveArticles();
  const articles = allArticles.filter(a => a.category === id);

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
