import { getLiveArticles, getCategoriesWithCounts } from '@/lib/public-data';
import Link from 'next/link';

export const revalidate = 60;

export const metadata = {
  title: 'All Categories & Topics',
  description: 'Browse all article categories on TechNova AI — AI Tools, Dev Tools, Productivity, Design, Security, Cloud, and more.',
  alternates: {
    canonical: 'https://www.technova-ai.online/category',
  },
};

export default async function AllCategoriesPage() {
  const articles = await getLiveArticles();
  const categories = getCategoriesWithCounts(articles);

  return (
    <>
      <section className="category-hero">
        <div className="container">
          <div className="article__breadcrumb">
            <Link href="/">Home</Link> <span>/</span>
            <span>Categories</span>
          </div>
          <h1 className="category-hero__title">All Categories</h1>
          <p className="category-hero__description">Browse all topics covered on TechNova AI</p>
          <p className="category-hero__count">{articles.length} articles across {categories.length} categories</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="categories-grid">
            {categories.map(cat => (
              <Link key={cat.id} href={`/category/${cat.id}`} className="category-card">
                <div className={`category-card__icon ${cat.iconClass}`}>{cat.icon}</div>
                <div className="category-card__info">
                  <div className="category-card__name">{cat.name}</div>
                  <div className="category-card__count">{cat.count} article{cat.count !== 1 ? 's' : ''}</div>
                </div>
                <span className="category-card__arrow">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
