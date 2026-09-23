import { CATEGORIES } from '@/lib/data';
import Link from 'next/link';

export const metadata = {
  title: 'All Categories — TechNova AI',
  description: 'Browse all categories on TechNova AI.',
};

export default function AllCategoriesPage() {
  return (
    <>
      <section className="category-hero">
        <div className="container">
          <h1 className="category-hero__title">All Categories</h1>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="categories-grid">
            {CATEGORIES.map(cat => (
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
