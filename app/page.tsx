import Link from 'next/link';
import { getLiveArticles, getLiveTools, getLiveNews, getCategoriesWithCounts } from '@/lib/public-data';
import { getArticleImage } from '@/lib/utils';
import Newsletter from '@/components/Newsletter';
import HeroSearchTrigger from '@/components/HeroSearchTrigger';

export const revalidate = 60; // Incremental Static Regeneration (revalidates every 60 seconds)

export default async function Home() {
  const articles = await getLiveArticles();
  const tools = await getLiveTools();
  const news = await getLiveNews();
  const categoriesWithCounts = getCategoriesWithCounts(articles);

  // Articles are already sorted newest-first by getLiveArticles()
  const recentFeatured = articles.slice(0, 5).find(a => a.featured);
  const featuredArticle = recentFeatured || articles[0];
  const sideArticles = articles.filter(a => a.id !== featuredArticle?.id).slice(0, 3);
  const topTools = tools.slice(0, 4);
  const trendingNews = news.slice(0, 3);
  const latestArticles = articles
    .filter(a => a.id !== featuredArticle?.id && !sideArticles.some(s => s.id === a.id))
    .slice(0, 12);

  return (
    <>
      {/* ── Magazine Bento Hero ── */}
      <section className="bento-hero">
        <div className="hero__bg"></div>
        <div className="hero__glow hero__glow--purple"></div>
        <div className="hero__glow hero__glow--cyan"></div>
        <div className="hero__grid-overlay"></div>

        <div className="container">
          {/* Header row: Title + Search */}
          <div className="bento-hero__top">
            <div className="bento-hero__intro">
              <h1 className="bento-hero__title">
                Discover, Compare & Master <br />
                <span className="hero__title-gradient">The Best AI & Tech Tools</span>
              </h1>
              <p className="bento-hero__desc">
                In-depth reviews, head-to-head comparisons, and unbiased guides designed to elevate your workflow and productivity.
              </p>
            </div>
            <div className="bento-hero__search-wrap">
              <HeroSearchTrigger />
            </div>
          </div>

          {/* Bento Grid */}
          <div className="bento-grid">
            {/* Lead Story (Left / Main) */}
            {featuredArticle && (
              <Link href={`/article/${featuredArticle.id}`} className="bento-lead">
                <div className="bento-lead__image-wrap">
                  <img
                    src={getArticleImage(featuredArticle)}
                    alt={featuredArticle.title}
                    className="bento-lead__image"
                    loading="eager"
                    decoding="async"
                  />
                  <div className="bento-lead__overlay"></div>
                </div>

                <div className="bento-lead__content">
                  <div className="bento-lead__badges">
                    <span className="bento-badge bento-badge--featured">
                      <span>⚡</span> EDITOR&apos;S CHOICE
                    </span>
                    <span className="bento-badge bento-badge--cat">
                      #{featuredArticle.category}
                    </span>
                  </div>

                  <h2 className="bento-lead__title">{featuredArticle.title}</h2>
                  <p className="bento-lead__excerpt">{featuredArticle.excerpt}</p>

                  <div className="bento-lead__footer">
                    <div className="bento-lead__author">
                      <img
                        src={featuredArticle.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                        alt={featuredArticle.author?.name || 'Author'}
                        className="bento-lead__avatar"
                      />
                      <div>
                        <div className="bento-lead__author-name">{featuredArticle.author?.name || 'TechNova Team'}</div>
                        <div className="bento-lead__meta">
                          <span>{featuredArticle.date}</span>
                          <span>•</span>
                          <span>⏱️ {featuredArticle.readTime}</span>
                        </div>
                      </div>
                    </div>
                    <span className="bento-lead__cta">
                      Read Full Review →
                    </span>
                  </div>
                </div>
              </Link>
            )}

            {/* Side Stack (Right / Latest) */}
            <div className="bento-side">
              <div className="bento-side__header">
                <div className="bento-side__label">
                  <span className="bento-side__dot"></span>
                  <span>LATEST STORIES</span>
                </div>
                <Link href="/category" className="bento-side__link">
                  View All →
                </Link>
              </div>

              <div className="bento-side__list">
                {sideArticles.map(a => (
                  <Link key={a.id} href={`/article/${a.id}`} className="bento-side-card">
                    <div className="bento-side-card__thumb-wrap">
                      <img
                        src={getArticleImage(a)}
                        alt={a.title}
                        className="bento-side-card__thumb"
                        loading="lazy"
                        decoding="async"
                        width={90}
                        height={75}
                      />
                    </div>
                    <div className="bento-side-card__content">
                      <span className="bento-side-card__cat">#{a.category}</span>
                      <h3 className="bento-side-card__title">{a.title}</h3>
                      <div className="bento-side-card__meta">
                        <span>{a.date}</span>
                        <span>•</span>
                        <span>⏱️ {a.readTime}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Sleek Stats Strip */}
          <div className="bento-stats">
            <div className="bento-stat-item">
              <span className="bento-stat-value">{articles.length}+</span>
              <span className="bento-stat-label">In-Depth Reviews</span>
            </div>
            <div className="bento-stat-divider"></div>
            <div className="bento-stat-item">
              <span className="bento-stat-value">{tools.length * 30}+</span>
              <span className="bento-stat-label">AI Tools Tested</span>
            </div>
            <div className="bento-stat-divider"></div>
            <div className="bento-stat-item">
              <span className="bento-stat-value">100K+</span>
              <span className="bento-stat-label">Monthly Tech Readers</span>
            </div>
            <div className="bento-stat-divider"></div>
            <div className="bento-stat-item">
              <span className="bento-stat-value">100%</span>
              <span className="bento-stat-label">Independent & Unbiased</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Top AI Tools Directory ── */}
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

      {/* ── Breaking Tech News ── */}
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
              <article key={news.id} className="news-card" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-card)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', transition: 'transform 0.3s ease' }}>
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

      {/* ── Browse by Topic ── */}
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
            {categoriesWithCounts.map(cat => (
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

      {/* ── All Reviews & Guides Library ── */}
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
                  <img
                    src={getArticleImage(a)}
                    alt={a.title}
                    className="article-card__image"
                    loading="lazy"
                    decoding="async"
                    width={380}
                    height={200}
                  />
                  <div className="article-card__category">{a.category}</div>
                </div>
                <div className="article-card__content">
                  <div className="article-card__meta">
                    <div className="article-card__author">
                      <img src={a.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'} alt={a.author?.name || 'Author'} className="article-card__author-avatar" />
                      <span>{a.author?.name || 'TechNova Team'}</span>
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

      <Newsletter />
    </>
  );
}
