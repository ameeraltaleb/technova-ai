import { CATEGORIES } from '@/lib/data';
import { getLiveArticleById, getLiveArticles } from '@/lib/public-data';
import { getArticleImage, parseTOC, injectHeadingIds, qualifyArticleContentLinks, formatMetaDescription, ensureImageAlts } from '@/lib/utils';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReadingProgress from '@/components/ReadingProgress';
import ShareButtons from '@/components/ShareButtons';
import Newsletter from '@/components/Newsletter';

export const dynamicParams = true;
export const revalidate = 0;

export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const article = await getLiveArticleById(id);
  if (!article) {
    notFound();
  }

  const image = getArticleImage(article as any);
  const articleUrl = `https://www.technova-ai.online/article/${article.id}`;
  const cleanTitle = article.title.replace(/\s*[—–-]\s*TechNova AI\s*$/i, '');
  const metaDescription = formatMetaDescription(article.excerpt, `${cleanTitle} — In-depth guide and tech analysis on TechNova AI.`);

  return {
    title: cleanTitle,
    description: metaDescription,
    alternates: {
      canonical: articleUrl,
    },
    openGraph: {
      title: article.title,
      description: metaDescription,
      type: 'article',
      url: articleUrl,
      publishedTime: article.date,
      authors: [article.author.name],
      images: image ? [{ url: image, width: 800, height: 450, alt: article.title }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: metaDescription,
      images: image ? [image] : [],
    },
  };
}

function splitContentForInlineInserts(html: string): { part1: string; part2: string; part3: string } {
  // Find </p> tags to split nicely between paragraphs
  const pRegex = /<\/p>/gi;
  const matches: number[] = [];
  let m: RegExpExecArray | null;
  while ((m = pRegex.exec(html)) !== null) {
    matches.push(m.index + 4);
  }

  // If 5 or more paragraphs: place Models Banner after paragraph 2, Related Card after paragraph 5
  if (matches.length >= 5) {
    return {
      part1: html.substring(0, matches[1]),
      part2: html.substring(matches[1], matches[4]),
      part3: html.substring(matches[4]),
    };
  } else if (matches.length >= 3) {
    return {
      part1: html.substring(0, matches[0]),
      part2: html.substring(matches[0], matches[2]),
      part3: html.substring(matches[2]),
    };
  } else if (matches.length === 2) {
    return {
      part1: html.substring(0, matches[0]),
      part2: html.substring(matches[0]),
      part3: '',
    };
  }

  return { part1: html, part2: '', part3: '' };
}

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const article = await getLiveArticleById(id);

  if (!article) {
    notFound();
  }

  const allArticles = await getLiveArticles();
  const articleImage = getArticleImage(article as any);
  const toc = parseTOC(article.content);
  const contentWithIds = injectHeadingIds(article.content);
  const contentWithAlts = ensureImageAlts(contentWithIds, article.title);
  const qualifiedContent = qualifyArticleContentLinks(contentWithAlts, {
    isSponsored: article.isSponsored,
    sponsorUrl: article.sponsorUrl,
    affiliateUrl: article.affiliateUrl,
  });
  const categoryData = CATEGORIES.find(c => c.id === article.category);
  const categoryName = categoryData?.name || article.category;

  const isArabicArticle = /[\u0600-\u06FF]/.test(article.title + ' ' + (article.content || ''));

  // Split content intelligently for inline banner and related article card
  const { part1, part2, part3 } = splitContentForInlineInserts(qualifiedContent);

  // Smart Related Articles Algorithm (Tags similarity + Category match)
  const currentTags = (article.tags || []).map((t: string) => t.toLowerCase().trim());
  const rankedArticles = allArticles
    .filter(a => a.id !== article.id)
    .map(a => {
      const aTags = (a.tags || []).map((t: string) => t.toLowerCase().trim());
      const sharedTags = aTags.filter((t: string) => currentTags.includes(t)).length;
      const sameCategory = a.category === article.category ? 1 : 0;
      return {
        article: a,
        score: sharedTags * 3 + sameCategory * 2,
      };
    })
    .sort((a, b) => b.score - a.score)
    .map(item => item.article);

  // Most relevant article goes into the inline card
  const inlineRelated = rankedArticles[0] || null;

  // The rest go to the bottom section
  const relatedArticles = rankedArticles.slice(1, 4).length > 0
    ? rankedArticles.slice(1, 4)
    : rankedArticles.slice(0, 3);

  // JSON-LD
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    image: articleImage,
    datePublished: article.date,
    dateModified: article.date,
    author: { '@type': 'Person', name: article.author.name },
    publisher: {
      '@type': 'Organization',
      name: 'TechNova AI',
      logo: { '@type': 'ImageObject', url: 'https://www.technova-ai.online/og-image.png' },
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
          <img src={articleImage} alt={article.title} className="ap-hero__bg-img" />
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

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: 'var(--space-5)' }}>
              <Link href={`/category/${article.category}`} className="ap-category-badge" style={{ marginBottom: 0 }}>
                {categoryData?.icon && <span>{categoryData.icon}</span>}
                {categoryName}
              </Link>
              {article.isSponsored && (
                <span className="ap-badge-sponsored">
                  ⭐ Sponsored Review
                </span>
              )}
            </div>

            <h1 className="ap-hero__title">{article.title}</h1>
            <p className="ap-hero__excerpt">{article.excerpt}</p>

            <div className="ap-author-bar">
              <div className="ap-author-bar__left">
                <span style={{ fontSize: '1.25rem' }}>✍️</span>
                <div>
                  <div className="ap-author-bar__name">{article.author?.name || 'TechNova AI Team'}</div>
                </div>
              </div>
              <div className="ap-author-bar__right">
                <div className="ap-meta-chip">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                  {article.date}
                </div>
                <div className="ap-meta-chip">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
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
              {/* Sponsored Content / Paid Partnership Reader Disclosure */}
              {article.isSponsored && (
                <div className="ap-sponsored-disclosure" role="note" aria-label="Sponsored Content Disclosure">
                  <div className="ap-sponsored-disclosure__header">
                    <span className="ap-sponsored-disclosure__badge">SPONSORED REVIEW / PAID PARTNERSHIP</span>
                  </div>
                  <p className="ap-sponsored-disclosure__text">
                    This article is part of a commercial partnership or dedicated review{article.sponsorName ? ` for ${article.sponsorName}` : ''}. TechNova AI maintains strict editorial guidelines and honest, independent testing standards.
                  </p>
                </div>
              )}

              {/* Dedicated Sponsor CTA Card */}
              {article.isSponsored && (article.sponsorUrl || article.affiliateUrl) && (
                <div className="ap-sponsor-card">
                  <div className="ap-sponsor-card__content">
                    <div className="ap-sponsor-card__tag">Commercial Partner / Official Link</div>
                    <h4 className="ap-sponsor-card__title">{article.sponsorName || article.title}</h4>
                    <p className="ap-sponsor-card__desc">
                      Visit the official product page to explore features, documentation, and pricing plans.
                    </p>
                  </div>
                  <a
                    href={article.sponsorUrl || article.affiliateUrl}
                    target="_blank"
                    rel="noopener noreferrer nofollow sponsored"
                    className="ap-sponsor-card__btn"
                  >
                    Visit {article.sponsorName || 'Website'} ↗
                  </a>
                </div>
              )}

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

              <div className="article-content" dangerouslySetInnerHTML={{ __html: part1 }} />

              {/* ── Sleek Contextual Inline Models Link (Between Paragraphs) ── */}
              <div className="ap-inline-banner" role="complementary" aria-label="Open-Source AI Models">
                <Link href="/models" className="ap-inline-banner__link">
                  <div className="ap-inline-banner__left">
                    <span className="ap-inline-banner__icon">⚡</span>
                    <span className="ap-inline-banner__badge">AI MODELS</span>
                    <span className="ap-inline-banner__text">
                      {isArabicArticle
                        ? "أحدث نماذج الذكاء الاصطناعي مفتوحة المصدر — انقر للاطلاع"
                        : "Latest Open-Source AI Models & GPU VRAM Specs — Click to Explore"}
                    </span>
                  </div>
                  <span className="ap-inline-banner__action">
                    {isArabicArticle ? "عرض ←" : "Explore →"}
                  </span>
                </Link>
              </div>

              {part2 && <div className="article-content" dangerouslySetInnerHTML={{ __html: part2 }} />}

              {/* ── Inline "Read Next" Related Article Card ── */}
              {inlineRelated && (part3 ? (
                <>
                  <div className="ap-inline-related" role="complementary" aria-label="Related Article">
                    <div className="ap-inline-related__badge">
                      <span>💡</span>
                      <span>RECOMMENDED READ</span>
                    </div>
                    <Link href={`/article/${inlineRelated.id}`} className="ap-inline-related__link">
                      <img
                        src={getArticleImage(inlineRelated)}
                        alt={inlineRelated.title}
                        className="ap-inline-related__thumb"
                        loading="lazy"
                      />
                      <div className="ap-inline-related__body">
                        <h4 className="ap-inline-related__title">{inlineRelated.title}</h4>
                        <div className="ap-inline-related__meta">
                          <span className="ap-inline-related__cat">#{inlineRelated.category}</span>
                          <span>•</span>
                          <span>⏱️ {inlineRelated.readTime}</span>
                        </div>
                      </div>
                      <span className="ap-inline-related__action">
                        Read Article →
                      </span>
                    </Link>
                  </div>
                  <div className="article-content" dangerouslySetInnerHTML={{ __html: part3 }} />
                </>
              ) : null)}

              {/* Tags */}
              {article.tags && article.tags.length > 0 && (
                <div className="ap-tags">
                  <span className="ap-tags__label">Tags:</span>
                  {article.tags.map((tag: string) => (
                    <span key={tag} className="ap-tags__item">{tag}</span>
                  ))}
                </div>
              )}

              {/* Simple Clean Author Box */}
              <div className="ap-author-card">
                <div className="ap-author-card__avatar">
                  <span>✍️</span>
                </div>
                <div className="ap-author-card__content">
                  <div className="ap-author-card__top">
                    <span className="ap-author-card__name">{article.author?.name || 'TechNova AI Team'}</span>
                    <span className="ap-author-card__date">Published on {article.date}</span>
                  </div>
                  <p className="ap-author-card__bio">
                    {(article.author as Record<string, string>).bio ||
                      'In-depth reviews and practical guides on modern AI tools and technology.'}
                  </p>
                </div>
              </div>

              {/* Share Buttons */}
              <ShareButtons title={article.title} />
            </article>

            {/* Sidebar */}
            <aside className="ap-sidebar">
              {toc.length > 0 && (
                <div className="ap-sidebar__card">
                  <h4 className="ap-sidebar__heading">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg>
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
              {article.rating && (() => {
                const rawRating = Number(article.rating);
                const normalizedRating = rawRating > 5 ? Number((rawRating / 2).toFixed(1)) : rawRating;
                const roundedStars = Math.min(5, Math.max(0, Math.round(normalizedRating)));
                return (
                  <div className="ap-sidebar__card ap-rating-card">
                    <h4 className="ap-sidebar__heading">Our Rating</h4>
                    <div className="ap-rating-card__score">{normalizedRating}<span>/5</span></div>
                    <div className="ap-rating-card__stars">
                      {'★'.repeat(roundedStars)}{'☆'.repeat(5 - roundedStars)}
                    </div>
                  </div>
                );
              })()}

              {/* Mini AI Models Hub Card in Sidebar */}
              <div className="ap-sidebar__card" style={{ borderColor: 'rgba(99, 102, 241, 0.3)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '1.25rem' }}>⚡</span>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--color-primary-light)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Hardware Estimator
                  </span>
                </div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0 0 6px', lineHeight: 1.35 }}>
                  Calculate GPU VRAM for Open Weights
                </h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0 0 12px', lineHeight: 1.4 }}>
                  Check if your GPU or Mac can run Llama 3, DeepSeek, or Mistral locally.
                </p>
                <Link
                  href="/models"
                  className="btn btn--outline"
                  style={{ display: 'block', textAlign: 'center', fontSize: '0.8rem', padding: '8px 12px' }}
                >
                  Launch VRAM Calculator →
                </Link>
              </div>

              {/* Dedicated Sponsor Partner in Sidebar */}
              {article.isSponsored && (article.sponsorUrl || article.affiliateUrl) && (
                <div className="ap-sidebar__card" style={{ borderColor: 'rgba(245, 158, 11, 0.35)' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
                    SPONSORED PARTNER
                  </div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0 0 8px' }}>
                    {article.sponsorName || 'Official Product'}
                  </h4>
                  <a
                    href={article.sponsorUrl || article.affiliateUrl}
                    target="_blank"
                    rel="noopener noreferrer nofollow sponsored"
                    className="btn btn--primary"
                    style={{ display: 'block', textAlign: 'center', fontSize: '0.8rem', padding: '8px 12px' }}
                  >
                    Visit Website ↗
                  </a>
                </div>
              )}
            </aside>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <Newsletter />

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
