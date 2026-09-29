import { ARTICLES, CATEGORIES } from '@/lib/data';
import { getArticleImage, parseTOC, injectHeadingIds } from '@/lib/utils';
import Link from 'next/link';
import ReadingProgress from '@/components/ReadingProgress';

export function generateStaticParams() {
  return ARTICLES.map((a) => ({
    id: a.id,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const article = ARTICLES.find(a => a.id === id);
  if (!article) return { title: 'Article Not Found' };

  const image = getArticleImage(article);
  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: 'article',
      publishedTime: article.date,
      authors: [article.author.name],
      images: image ? [{ url: image, width: 800, height: 450, alt: article.title }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt,
      images: image ? [image] : [],
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const article = ARTICLES.find(a => a.id === id);

  if (!article) {
    return (
      <div className="container" style={{ padding: 'var(--space-12) 0', textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: '4rem', marginBottom: 'var(--space-4)', opacity: 0.3 }}>📄</div>
        <h1 style={{ fontSize: 'var(--fs-3xl)', marginBottom: 'var(--space-4)' }}>Article not found</h1>
        <Link href="/" className="ap-back-btn">← Back to Home</Link>
      </div>
    );
  }

  const articleImage = getArticleImage(article);
  const toc = parseTOC(article.content);
  const contentWithIds = injectHeadingIds(article.content);
  const categoryData = CATEGORIES.find(c => c.id === article.category);
  const categoryName = categoryData?.name || article.category;

  // Related articles (same category, excluding current)
  const relatedArticles = ARTICLES
    .filter(a => a.category === article.category && a.id !== article.id)
    .slice(0, 3);

  // JSON-LD
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    image: articleImage,
    datePublished: article.date,
    author: { '@type': 'Person', name: article.author.name },
    publisher: {
      '@type': 'Organization',
      name: 'TechNova AI',
      logo: { '@type': 'ImageObject', url: 'https://www.technova-ai.online/favicon.ico' },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `https://www.technova-ai.online/article/${article.id}` },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ReadingProgress />

      {/* ── Hero Section ── */}
      <section className="ap-hero">
        <div className="ap-hero__bg">
          <img src={articleImage} alt="" className="ap-hero__bg-img" />
          <div className="ap-hero__overlay" />
        </div>
        <div className="container container--narrow">
          <div className="ap-hero__content">
            <nav className="ap-breadcrumb">
              <Link href="/">Home</Link>
              <span className="ap-breadcrumb__sep">/</span>
              <Link href={`/category/${article.category}`}>{categoryName}</Link>
              <span className="ap-breadcrumb__sep">/</span>
              <span className="ap-breadcrumb__current">Article</span>
            </nav>

            <Link href={`/category/${article.category}`} className="ap-category-badge">
              {categoryData?.icon && <span>{categoryData.icon}</span>}
              {categoryName}
            </Link>

            <h1 className="ap-hero__title">{article.title}</h1>
            <p className="ap-hero__excerpt">{article.excerpt}</p>

            <div className="ap-author-bar">
              <div className="ap-author-bar__left">
                <img src={article.author.avatar} alt={article.author.name} className="ap-author-bar__avatar" />
                <div>
                  <div className="ap-author-bar__name">{article.author.name}</div>
                  <div className="ap-author-bar__role">{(article.author as Record<string, string>).role || 'Author'}</div>
                </div>
              </div>
              <div className="ap-author-bar__right">
                <div className="ap-meta-chip">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  {article.date}
                </div>
                <div className="ap-meta-chip">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  {article.readTime}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Article Body ── */}
      <section className="ap-body">
        <div className="container container--narrow">
          <div className="ap-grid">

            {/* Main Content */}
            <article className="ap-main">
              {/* Pros/Cons inline */}
              {article.pros && article.pros.length > 0 && article.cons && article.cons.length > 0 && (
                <div className="ap-verdict">
                  <div className="ap-verdict__col ap-verdict__col--pro">
                    <h3 className="ap-verdict__heading ap-verdict__heading--pro">
                      <span className="ap-verdict__icon">✓</span> Pros
                    </h3>
                    <ul className="ap-verdict__list">
                      {article.pros.map((pro: string, i: number) => (
                        <li key={i}>{pro}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="ap-verdict__col ap-verdict__col--con">
                    <h3 className="ap-verdict__heading ap-verdict__heading--con">
                      <span className="ap-verdict__icon">✗</span> Cons
                    </h3>
                    <ul className="ap-verdict__list">
                      {article.cons.map((con: string, i: number) => (
                        <li key={i}>{con}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              <div className="article-content" dangerouslySetInnerHTML={{ __html: contentWithIds }} />

              {/* Tags */}
              {article.tags && article.tags.length > 0 && (
                <div className="ap-tags">
                  <span className="ap-tags__label">Tags:</span>
                  {article.tags.map((tag: string) => (
                    <span key={tag} className="ap-tags__item">{tag}</span>
                  ))}
                </div>
              )}

              {/* Author Card */}
              <div className="ap-author-card">
                <img src={article.author.avatar} alt={article.author.name} className="ap-author-card__avatar" />
                <div className="ap-author-card__info">
                  <div className="ap-author-card__label">Written by</div>
                  <div className="ap-author-card__name">{article.author.name}</div>
                  <p className="ap-author-card__bio">
                    {(article.author as Record<string, string>).bio || `${article.author.name} writes about ${categoryName.toLowerCase()} and emerging technologies for TechNova AI.`}
                  </p>
                </div>
              </div>
            </article>

            {/* Sidebar */}
            <aside className="ap-sidebar">
              {toc.length > 0 && (
                <div className="ap-sidebar__card">
                  <h4 className="ap-sidebar__heading">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
                    In This Article
                  </h4>
                  <nav className="ap-sidebar__toc">
                    {toc.map((heading) => (
                      <a key={heading.id} href={`#${heading.id}`} className="toc__link">
                        {heading.text}
                      </a>
                    ))}
                  </nav>
                </div>
              )}

              {/* Rating if exists */}
              {article.rating && (
                <div className="ap-sidebar__card ap-rating-card">
                  <h4 className="ap-sidebar__heading">Our Rating</h4>
                  <div className="ap-rating-card__score">{article.rating}<span>/10</span></div>
                  <div className="ap-rating-card__stars">
                    {'★'.repeat(Math.round(article.rating / 2))}{'☆'.repeat(5 - Math.round(article.rating / 2))}
                  </div>
                </div>
              )}

              {/* Quick Pros/Cons sidebar */}
              {article.pros && article.pros.length > 0 && (
                <div className="ap-sidebar__card">
                  <h4 className="ap-sidebar__heading" style={{ color: '#4ade80' }}>✅ Key Strengths</h4>
                  <ul className="ap-sidebar__bullets ap-sidebar__bullets--pro">
                    {article.pros.slice(0, 4).map((pro: string, i: number) => (
                      <li key={i}>{pro}</li>
                    ))}
                  </ul>
                </div>
              )}
              {article.cons && article.cons.length > 0 && (
                <div className="ap-sidebar__card">
                  <h4 className="ap-sidebar__heading" style={{ color: '#f87171' }}>⚠️ Drawbacks</h4>
                  <ul className="ap-sidebar__bullets ap-sidebar__bullets--con">
                    {article.cons.slice(0, 4).map((con: string, i: number) => (
                      <li key={i}>{con}</li>
                    ))}
                  </ul>
                </div>
              )}
            </aside>
          </div>
        </div>
      </section>

      {/* ── Related Articles ── */}
      {relatedArticles.length > 0 && (
        <section className="ap-related">
          <div className="container">
            <div className="section__header">
              <div>
                <div className="section__label">// More in {categoryName}</div>
                <h2 className="section__title">Related Articles</h2>
              </div>
              <Link href={`/category/${article.category}`} className="section__link">View All →</Link>
            </div>
            <div className="cards-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
              {relatedArticles.map(a => (
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
      )}
    </>
  );
}
