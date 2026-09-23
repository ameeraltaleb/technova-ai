import { ARTICLES } from '@/lib/data';
import Link from 'next/link';

export function generateStaticParams() {
  return ARTICLES.map((a) => ({
    id: a.id,
  }));
}

export function generateMetadata({ params }: { params: { id: string } }) {
  const article = ARTICLES.find(a => a.id === params.id);
  if (!article) return { title: 'Article Not Found' };
  return {
    title: `${article.title} — TechNova AI`,
    description: article.excerpt,
  };
}

export default function ArticlePage({ params }: { params: { id: string } }) {
  const article = ARTICLES.find(a => a.id === params.id);

  if (!article) {
    return (
      <div className="container" style={{ padding: 'var(--space-12) 0', textAlign: 'center' }}>
        <h1>Article not found</h1>
      </div>
    );
  }

  return (
    <>
      <div className="reading-progress" id="readingProgress"></div>
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
              <img src={article.author.avatar} alt={article.author.name} />
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
          <img src={article.image} alt={article.title} className="article-hero__image" />
        </div>
      </div>

      <div className="container container--narrow">
        <article className="article-layout">
          <div className="article-content" dangerouslySetInnerHTML={{ __html: article.content }}></div>
          <aside className="article-sidebar">
            <div className="toc">
              <h4 className="toc__title">Table of Contents</h4>
              <div className="toc__list">
                 {/* TOC logic can be added here or parsed from content */}
              </div>
            </div>
          </aside>
        </article>
      </div>
    </>
  );
}
