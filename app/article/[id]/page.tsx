import { ARTICLES } from '@/lib/data';
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
      <div className="container" style={{ padding: 'var(--space-12) 0', textAlign: 'center' }}>
        <h1>Article not found</h1>
        <Link href="/" style={{ color: 'var(--text-link)', marginTop: 'var(--space-4)', display: 'inline-block' }}>← Back to Home</Link>
      </div>
    );
  }

  const articleImage = getArticleImage(article);
  const toc = parseTOC(article.content);
  const contentWithIds = injectHeadingIds(article.content);

  // JSON-LD Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    image: articleImage,
    datePublished: article.date,
    author: {
      '@type': 'Person',
      name: article.author.name,
    },
    publisher: {
      '@type': 'Organization',
      name: 'TechNova AI',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.technova-ai.online/favicon.ico',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://www.technova-ai.online/article/${article.id}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ReadingProgress />
      <header className="article-header">
        <div className="container container--narrow">
          <div className="article__breadcrumb">
            <Link href="/">Home</Link> <span>/</span>
            <Link href={`/category/${article.category}`}>{article.category}</Link> <span>/</span>
            <span>{article.title}</span>
          </div>
          <div className="article-header__meta">
            <span className="article-header__tag">{article.category}</span>
            <div className="article-header__author">
              <img src={article.author.avatar} alt={article.author.name} loading="lazy" />
              <span>{article.author.name}</span>
            </div>
            <span>{article.date}</span>
            <span>{article.readTime}</span>
          </div>
          <h1 className="article-header__title">{article.title}</h1>
        </div>
      </header>

      <div className="article-hero">
        <div className="container">
          <img src={articleImage} alt={article.title} className="article-hero__image" loading="eager" />
        </div>
      </div>

      <div className="container container--narrow">
        <article className="article-layout">
          <div className="article-content" dangerouslySetInnerHTML={{ __html: contentWithIds }}></div>
          <aside className="article-sidebar">
            {toc.length > 0 && (
              <div className="toc">
                <h4 className="toc__title">Table of Contents</h4>
                <div className="toc__list">
                  {toc.map((heading) => (
                    <a key={heading.id} href={`#${heading.id}`} className="toc__link">
                      {heading.text}
                    </a>
                  ))}
                </div>
              </div>
            )}
            {article.pros && article.pros.length > 0 && (
              <div className="toc" style={{ marginTop: 'var(--space-6)' }}>
                <h4 className="toc__title" style={{ color: '#4ade80' }}>✅ Pros</h4>
                <div className="toc__list">
                  {article.pros.map((pro: string, i: number) => (
                    <div key={i} style={{ padding: 'var(--space-2) 0', color: 'var(--text-secondary)', fontSize: 'var(--fs-sm)', lineHeight: 1.5, borderBottom: '1px solid var(--border-card)' }}>
                      {pro}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {article.cons && article.cons.length > 0 && (
              <div className="toc" style={{ marginTop: 'var(--space-4)' }}>
                <h4 className="toc__title" style={{ color: '#f87171' }}>❌ Cons</h4>
                <div className="toc__list">
                  {article.cons.map((con: string, i: number) => (
                    <div key={i} style={{ padding: 'var(--space-2) 0', color: 'var(--text-secondary)', fontSize: 'var(--fs-sm)', lineHeight: 1.5, borderBottom: '1px solid var(--border-card)' }}>
                      {con}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </article>
      </div>
    </>
  );
}
