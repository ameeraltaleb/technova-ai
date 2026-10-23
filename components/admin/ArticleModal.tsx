'use client';

import { useState, useEffect } from 'react';
import { ArticleItem } from '@/lib/admin-store';
import { CATEGORIES } from '@/lib/data';

interface ArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (article: ArticleItem) => void;
  initialArticle?: ArticleItem | null;
}

export default function ArticleModal({
  isOpen,
  onClose,
  onSave,
  initialArticle,
}: ArticleModalProps) {
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [category, setCategory] = useState('ai-tools');
  const [authorName, setAuthorName] = useState('TechNova AI Team');
  const [rating, setRating] = useState(4.8);
  const [readTime, setReadTime] = useState('8 min read');
  const [featured, setFeatured] = useState(false);
  const [tags, setTags] = useState('AI, Tools, Review');
  const [image, setImage] = useState('');
  const [affiliateUrl, setAffiliateUrl] = useState('');
  const [prosText, setProsText] = useState('');
  const [consText, setConsText] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (initialArticle) {
      setTitle(initialArticle.title || '');
      setSlug(initialArticle.id || '');
      setExcerpt(initialArticle.excerpt || '');
      setCategory(initialArticle.category || 'ai-tools');
      setAuthorName(initialArticle.author?.name || 'TechNova AI Team');
      setRating(initialArticle.rating || 4.8);
      setReadTime(initialArticle.readTime || '8 min read');
      setFeatured(!!initialArticle.featured);
      setTags((initialArticle.tags || []).join(', '));
      setImage(initialArticle.image || '');
      setAffiliateUrl(initialArticle.affiliateUrl || '');
      setProsText((initialArticle.pros || []).join('\n'));
      setConsText((initialArticle.cons || []).join('\n'));
      setContent(initialArticle.content || '');
    } else {
      // New article defaults
      setTitle('');
      setSlug('');
      setExcerpt('');
      setCategory('ai-tools');
      setAuthorName('TechNova AI Team');
      setRating(4.8);
      setReadTime('7 min read');
      setFeatured(false);
      setTags('AI, Review, Guide');
      setImage('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=450&fit=crop');
      setAffiliateUrl('');
      setProsText('Fast processing\nIntuitive user interface\nAffordable pricing');
      setConsText('Requires stable internet\nLimited free tier');
      setContent(`<h2>Introduction</h2>\n<p>Enter your comprehensive review content here...</p>\n\n<h2>Key Features</h2>\n<ul>\n  <li>Feature 1: Seamless integration</li>\n  <li>Feature 2: High accuracy</li>\n</ul>\n\n<h2>Verdict</h2>\n<p>Why this tool is recommended in 2026.</p>`);
    }
  }, [initialArticle, isOpen]);

  if (!isOpen) return null;

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!initialArticle) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')
      );
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !slug) return;

    const pros = prosText.split('\n').map((p) => p.trim()).filter(Boolean);
    const cons = consText.split('\n').map((c) => c.trim()).filter(Boolean);
    const parsedTags = tags.split(',').map((t) => t.trim()).filter(Boolean);

    const articleItem: ArticleItem = {
      id: slug,
      title,
      excerpt,
      category,
      author: {
        name: authorName,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=random`,
      },
      date: initialArticle?.date || new Date().toISOString().split('T')[0],
      readTime,
      rating: Number(rating),
      featured,
      tags: parsedTags,
      image,
      content,
      pros,
      cons,
      affiliateUrl,
      ratingBreakdown: {
        overall: Number(rating),
        label: rating >= 4.8 ? 'Exceptional' : rating >= 4.5 ? 'Excellent' : 'Very Good',
      },
    };

    onSave(articleItem);
  };

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal" style={{ maxWidth: '850px' }} onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal__header">
          <h2 className="admin-modal__title">
            {initialArticle ? '✍️ Edit Article' : '✍️ Create New Article'}
          </h2>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={() => setActiveTab('edit')}
              className={`btn-admin ${activeTab === 'edit' ? 'btn-admin-primary' : 'btn-admin-outline'}`}
              style={{ padding: '4px 12px', fontSize: '0.8rem' }}
            >
              Editor
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`btn-admin ${activeTab === 'preview' ? 'btn-admin-primary' : 'btn-admin-outline'}`}
              style={{ padding: '4px 12px', fontSize: '0.8rem' }}
            >
              Live Preview
            </button>
            <button className="admin-modal__close" onClick={onClose}>✕</button>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', flex: 1 }}>
          <div className="admin-modal__body">
            {activeTab === 'preview' ? (
              <div style={{ background: '#0b0f19', padding: '24px', borderRadius: '8px', border: '1px solid var(--admin-border)' }}>
                <span className="badge-pill badge-pill-primary" style={{ marginBottom: '12px' }}>{category}</span>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '8px 0 12px', color: '#fff' }}>{title || 'Article Title Preview'}</h1>
                <p style={{ color: 'var(--admin-text-muted)', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '20px' }}>{excerpt}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', fontSize: '0.85rem', color: 'var(--admin-text-dim)' }}>
                  <span>By <strong>{authorName}</strong></span>
                  <span>•</span>
                  <span>{readTime}</span>
                  <span>•</span>
                  <span>⭐ {rating} / 5.0</span>
                </div>
                {image && (
                  <img src={image} alt={title} style={{ width: '100%', maxHeight: '350px', objectFit: 'cover', borderRadius: '10px', marginBottom: '24px' }} />
                )}
                <div
                  style={{ lineHeight: 1.8, color: '#e5e7eb' }}
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              </div>
            ) : (
              <>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Article Title *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      placeholder="e.g. Cursor AI vs GitHub Copilot in 2026"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">URL Slug *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      placeholder="e.g. cursor-vs-copilot-2026"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Excerpt / Summary *</label>
                  <textarea
                    className="form-textarea"
                    style={{ minHeight: '60px' }}
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    placeholder="Brief 1-2 sentence compelling summary for Google SEO and card previews..."
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select
                      className="admin-select"
                      style={{ width: '100%' }}
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.icon} {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Author Name</label>
                    <input
                      type="text"
                      className="form-input"
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      placeholder="e.g. TechNova AI Team"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Rating (1.0 - 5.0)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="1.0"
                      max="5.0"
                      className="form-input"
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Read Time</label>
                    <input
                      type="text"
                      className="form-input"
                      value={readTime}
                      onChange={(e) => setReadTime(e.target.value)}
                      placeholder="e.g. 8 min read"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Featured Image URL</label>
                    <input
                      type="url"
                      className="form-input"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Affiliate URL (Monetization)</label>
                    <input
                      type="url"
                      className="form-input"
                      value={affiliateUrl}
                      onChange={(e) => setAffiliateUrl(e.target.value)}
                      placeholder="https://tool.com?ref=technova"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Pros (One per line)</label>
                    <textarea
                      className="form-textarea"
                      style={{ minHeight: '70px' }}
                      value={prosText}
                      onChange={(e) => setProsText(e.target.value)}
                      placeholder="Great value&#10;Easy to use"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Cons (One per line)</label>
                    <textarea
                      className="form-textarea"
                      style={{ minHeight: '70px' }}
                      value={consText}
                      onChange={(e) => setConsText(e.target.value)}
                      placeholder="Steep learning curve&#10;No free plan"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Tags (comma-separated)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="AI, Development, Code Editor"
                  />
                </div>

                <div className="form-group">
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.875rem' }}>
                    <input
                      type="checkbox"
                      checked={featured}
                      onChange={(e) => setFeatured(e.target.checked)}
                    />
                    <span>Highlight as Featured Article on Homepage</span>
                  </label>
                </div>

                <div className="form-group">
                  <label className="form-label">Article HTML Content *</label>
                  <textarea
                    className="form-textarea"
                    style={{ minHeight: '220px', fontFamily: 'monospace', fontSize: '0.85rem' }}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="<p>Full article body...</p>"
                    required
                  />
                </div>
              </>
            )}
          </div>

          <div className="admin-modal__footer">
            <button type="button" onClick={onClose} className="btn-admin btn-admin-outline">
              Cancel
            </button>
            <button type="submit" className="btn-admin btn-admin-primary">
              💾 Save Article
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
