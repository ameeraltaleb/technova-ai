import Link from 'next/link';
import { ARTICLES, CATEGORIES, TOOLS, NEWS } from '@/lib/data';

export default function Home() {
  const featuredArticle = ARTICLES.find(a => a.featured) || ARTICLES[0];
  const topTools = TOOLS.slice(0, 4);
  const trendingNews = NEWS.slice(0, 3);
  const latestArticles = ARTICLES.filter(a => !a.featured).slice(0, 12);

  return (
    <>
      <section className="hero">
        <div className="hero__bg"></div>
        <div className="hero__glow hero__glow--purple"></div>
        <div className="hero__glow hero__glow--cyan"></div>
        <div className="hero__grid-overlay"></div>

        <div className="container">
          <div className="hero__content">
            <div className="hero__badge">
              <span className="hero__badge-dot"></span>
              The Future of Tech Reviews
            </div>

            <h1 className="hero__title">
              Discover the Best
              <span className="hero__title-gradient">AI & Tech Tools</span>
              for 2026
            </h1>

            <p className="hero__description">
              In-depth reviews, head-to-head comparisons, and expert guides to help you choose the right tools — and master them.
            </p>

            <div className="hero__search">
              <span className="hero__search-icon">🔍</span>
              <input type="text" className="hero__search-input" id="heroSearch" placeholder="Search for tools, reviews, comparisons..." />
              <button className="hero__search-btn" id="heroSearchBtn">Search</button>
            </div>

            <div className="hero__stats">
              <div className="hero__stat">
                <span className="hero__stat-number">{ARTICLES.length}+</span>
                <span className="hero__stat-label">Reviews</span>
              </div>
              <div className="hero__stat">
                <span className="hero__stat-number">200+</span>
                <span className="hero__stat-label">Tools Tested</span>
              </div>
              <div className="hero__stat">
                <span className="hero__stat-number">100K+</span>
                <span className="hero__stat-label">Monthly Readers</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section__header">
            <div>
              <div className="section__label">// Featured Review</div>
              <h2 className="section__title">Editor's Pick</h2>
            </div>
          </div>
          {featuredArticle && (
            <Link href={`/article/${featuredArticle.id}`} className="article-card article-card--featured">
              <div className="article-card__image-container">
                <img src={featuredArticle.image} alt={featuredArticle.title} className="article-card__image" />
                <div className="article-card__category">{featuredArticle.category}</div>
              </div>
              <div className="article-card__content">
                <div className="article-card__meta">
                  <div className="article-card__author">
                    <img src={featuredArticle.author.avatar} alt={featuredArticle.author.name} className="article-card__author-avatar" />
                    <span>{featuredArticle.author.name}</span>
                  </div>
                  <span>{featuredArticle.date}</span>
                  <span>{featuredArticle.readTime}</span>
                </div>
                <h3 className="article-card__title">{featuredArticle.title}</h3>
                <p className="article-card__excerpt">{featuredArticle.excerpt}</p>
              </div>
            </Link>
          )}
        </div>
      </section>

      <section className="section section--alt">
        <div className="container">
          <div className="section__header">
            <div>
              <div className="section__label">// Directory</div>
              <h2 className="section__title">Top AI Tools</h2>
            </div>
            <Link href="/tools" className="section__link">View All Tools →</Link>
          </div>
          <div className="cards-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
            {topTools.map(tool => (
              <a key={tool.id} href={tool.url} target="_blank" rel="noopener noreferrer" className="article-card" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: 'var(--space-6)', background: 'rgba(255,255,255,0.02)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', height: '120px' }}>
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

      <section className="section">
        <div className="container">
          <div className="section__header">
            <div>
              <div className="section__label">// Breaking</div>
              <h2 className="section__title">Trending Tech News</h2>
            </div>
            <Link href="/news" className="section__link">View All News →</Link>
          </div>
          <div style={{ display: 'grid', gap: 'var(--space-4)', maxWidth: '800px' }}>
            {trendingNews.map(news => (
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

      <section className="section section--alt">
        <div className="container">
          <div className="section__header">
            <div>
              <div className="section__label">// Browse by Topic</div>
              <h2 className="section__title">Explore Categories</h2>
              <p className="section__subtitle">Find the tools that matter most to you</p>
            </div>
          </div>
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

      <section className="section">
        <div className="container">
          <div className="section__header">
            <div>
              <div className="section__label">// Articles Library</div>
              <h2 className="section__title">All Reviews & Guides</h2>
            </div>
            <Link href="/category" className="section__link">Full Directory →</Link>
          </div>
          <div className="cards-grid">
            {latestArticles.map(a => (
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
                    <span>{a.readTime}</span>
                  </div>
                  <h3 className="article-card__title">{a.title}</h3>
                  <p className="article-card__excerpt">{a.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
