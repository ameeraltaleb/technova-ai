import { getLiveArticles, getCategoriesWithCounts } from '@/lib/public-data';
import { getArticleImage } from '@/lib/utils';
import Link from 'next/link';

export const revalidate = 3600;

export const metadata = {
  title: 'All Categories, Topics & Article Search',
  description: 'Search and browse all in-depth AI reviews, developer guides, and tech categories on TechNova AI — AI Tools, Dev Tools, Security, Cloud, and more.',
  alternates: {
    canonical: 'https://www.technova-ai.online/category',
  },
};

export default async function AllCategoriesPage({
  searchParams,
}: {
  searchParams?: Promise<{ search?: string; q?: string }>;
}) {
  const resolvedParams = searchParams ? await searchParams : {};
  const rawQuery = (resolvedParams?.search || resolvedParams?.q || '').trim();
  const query = rawQuery.toLowerCase();

  const articles = await getLiveArticles();
  const categories = getCategoriesWithCounts(articles);
  const categoryNameMap = new Map(categories.map((c) => [c.id, c]));

  const filteredArticles = query
    ? articles.filter((art) => {
        const hay = `${art.title} ${art.excerpt} ${(art.tags || []).join(' ')} ${art.category}`.toLowerCase();
        return hay.includes(query);
      })
    : articles.slice(0, 24);

  return (
    <>
      <section className="category-hero">
        <div className="container">
          <div className="article__breadcrumb">
            <Link href="/">Home</Link> <span>/</span>
            <span>Categories &amp; Archive</span>
          </div>
          <h1 className="category-hero__title">
            {rawQuery ? `Search Results for "${rawQuery}"` : 'All Categories & Articles'}
          </h1>
          <p className="category-hero__description">
            {rawQuery
              ? `Found ${filteredArticles.length} matching article${filteredArticles.length === 1 ? '' : 's'} on TechNova AI`
              : 'Browse all specialized technology verticals or search our full library of reviews and benchmarks.'}
          </p>
          <p className="category-hero__count">
            {articles.length} published articles across {categories.length} categories
          </p>

          {/* Direct SSR Search Form matching WebSite SearchAction Schema */}
          <form
            action="/category"
            method="GET"
            style={{
              maxWidth: '580px',
              margin: '20px auto 0',
              display: 'flex',
              gap: '10px',
            }}
          >
            <input
              type="search"
              name="search"
              defaultValue={rawQuery}
              placeholder="Search AI models, MCP, cybersecurity, VPNs, coding tools..."
              aria-label="Search articles"
              style={{
                flex: 1,
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-card)',
                background: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                fontSize: '0.95rem',
              }}
            />
            <button
              type="submit"
              className="btn btn--primary"
              style={{ padding: '12px 22px', fontWeight: 600, cursor: 'pointer' }}
            >
              Search
            </button>
            {rawQuery && (
              <Link
                href="/category"
                className="btn btn--outline"
                style={{ padding: '12px 16px', display: 'inline-flex', alignItems: 'center' }}
              >
                Clear
              </Link>
            )}
          </form>
        </div>
      </section>

      {!rawQuery && (
        <section className="section" style={{ paddingBottom: 'var(--space-6)' }}>
          <div className="container">
            <div className="section__header" style={{ marginBottom: 'var(--space-6)' }}>
              <div>
                <div className="section__label">// Browse by Topic</div>
                <h2 className="section__title"> Core Technology Categories</h2>
              </div>
            </div>
            <div className="categories-grid">
              {categories.map((cat) => (
                <Link key={cat.id} href={`/category/${cat.id}`} className="category-card">
                  <div className={`category-card__icon ${cat.iconClass}`}>{cat.icon}</div>
                  <div className="category-card__info">
                    <div className="category-card__name">{cat.name}</div>
                    <div className="category-card__count">
                      {cat.count} article{cat.count !== 1 ? 's' : ''}
                    </div>
                  </div>
                  <span className="category-card__arrow">→</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section" style={{ paddingTop: 'var(--space-6)' }}>
        <div className="container">
          <div className="section__header" style={{ marginBottom: 'var(--space-6)' }}>
            <div>
              <div className="section__label">
                {rawQuery ? '// Search Matches' : '// Full Editorial Archive'}
              </div>
              <h2 className="section__title">
                {rawQuery ? `Matching Articles (${filteredArticles.length})` : 'Latest Reviews, Benchmarks & Guides'}
              </h2>
            </div>
          </div>

          {filteredArticles.length === 0 ? (
            <div
              style={{
                padding: 'var(--space-8)',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-card)',
                borderRadius: 'var(--radius-lg)',
                textAlign: 'center',
              }}
            >
              <p style={{ color: 'var(--text-secondary)', marginBottom: '12px' }}>
                No articles matched &ldquo;{rawQuery}&rdquo;. Try searching for AI, MCP, Claude, Sora, or VPN.
              </p>
              <Link href="/category" className="btn btn--primary">
                View All Articles
              </Link>
            </div>
          ) : (
            <div className="cards-grid">
              {filteredArticles.map((a) => {
                const catObj = categoryNameMap.get(a.category);
                return (
                  <Link key={a.id} href={`/article/${a.id}`} className="article-card">
                    <div className="article-card__image-container">
                      <img src={getArticleImage(a)} alt={a.title} className="article-card__image" loading="lazy" />
                      <div className="article-card__category">
                        {catObj?.icon && <span>{catObj.icon} </span>}
                        {catObj?.name || a.category}
                      </div>
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
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
