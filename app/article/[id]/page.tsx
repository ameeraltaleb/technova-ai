import { CATEGORIES } from '@/lib/data';
import { getLiveArticleById, getLiveArticles } from '@/lib/public-data';
import { getArticleImage, parseTOC, injectHeadingIds } from '@/lib/utils';
import Link from 'next/link';
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
  if (!article) return { title: 'Article Not Found' };

  const image = getArticleImage(article as any);
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

function splitContentForInlineCard(html: string): { part1: string; part2: string } {
  // Find </p> tags to split nicely between paragraphs
  const pRegex = /<\/p>/gi;
  const matches: number[] = [];
  let m: RegExpExecArray | null;
  while ((m = pRegex.exec(html)) !== null) {
    matches.push(m.index + 4);
  }

  // If there are at least 3 paragraphs, split around the 2nd paragraph
  if (matches.length >= 3) {
    const splitIndex = matches.length >= 6 ? matches[2] : matches[1];
    return {
      part1: html.substring(0, splitIndex),
      part2: html.substring(splitIndex),
    };
  } else if (matches.length === 2) {
    const splitIndex = matches[0];
    return {
      part1: html.substring(0, splitIndex),
      part2: html.substring(splitIndex),
    };
  }

  return { part1: html, part2: '' };
}

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const article = await getLiveArticleById(id);

  if (!article) {
    return (
      <div className="container" style={{ padding: 'var(--space-12) 0', textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: '4rem', marginBottom: 'var(--space-4)', opacity: 0.3 }}>📄</div>
        <h1 style={{ fontSize: 'var(--fs-3xl)', marginBottom: 'var(--space-4)' }}>Article not found</h1>
        <Link href="/" className="ap-back-btn">← Back to Home</Link>
      </div>
    );
  }

  const allArticles = await getLiveArticles();
  const articleImage = getArticleImage(article as any);
  const toc = parseTOC(article.content);
  const contentWithIds = injectHeadingIds(article.content);
  const categoryData = CATEGORIES.find(c => c.id === article.category);
  const categoryName = categoryData?.name || article.category;

  // Split content around ~35-40% mark for the inline related article card
  const { part1, part2 } = splitContentForInlineCard(contentWithIds);

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
                <span style={{ fontSize: '1.25rem' }}>✍️</span>
                <div>
                  <div className="ap-author-bar__name">{article.author?.name || 'TechNova AI Team'}</div>
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

              <div className="article-content" dangerouslySetInnerHTML={{ __html: part1 }} />

              {/* ── Inline "Read Next" Related Article Card ── */}
              {inlineRelated && (
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
              )}

              {part2 && <div className="article-content" dangerouslySetInnerHTML={{ __html: part2 }} />}

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
