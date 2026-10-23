'use client';

import { useState, useEffect } from 'react';
import { NewsItem } from '@/lib/admin-store';

interface NewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (news: NewsItem) => void;
  initialNews?: NewsItem | null;
}

export default function NewsModal({
  isOpen,
  onClose,
  onSave,
  initialNews,
}: NewsModalProps) {
  const [headline, setHeadline] = useState('');
  const [id, setId] = useState('');
  const [source, setSource] = useState('TechNova News');
  const [category, setCategory] = useState('AI Models');
  const [content, setContent] = useState('');
  const [fullContent, setFullContent] = useState('');
  const [tags, setTags] = useState('AI, Tech');

  useEffect(() => {
    if (initialNews) {
      setHeadline(initialNews.headline || '');
      setId(initialNews.id || '');
      setSource(initialNews.source || 'TechNova News');
      setCategory(initialNews.category || 'AI Models');
      setContent(initialNews.content || '');
      setFullContent(initialNews.fullContent || '');
      setTags((initialNews.tags || []).join(', '));
    } else {
      setHeadline('');
      setId('');
      setSource('TechNova News');
      setCategory('AI Models');
      setContent('');
      setFullContent('');
      setTags('AI, Emerging Tech');
    }
  }, [initialNews, isOpen]);

  if (!isOpen) return null;

  const handleHeadlineChange = (val: string) => {
    setHeadline(val);
    if (!initialNews) {
      setId(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')
      );
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!headline || !content) return;

    const item: NewsItem = {
      id: id || headline.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      headline,
      source,
      category,
      content,
      fullContent: fullContent || `<p>${content}</p>`,
      date: initialNews?.date || new Date().toISOString().split('T')[0],
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
    };

    onSave(item);
  };

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal" style={{ maxWidth: '650px' }} onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal__header">
          <h2 className="admin-modal__title">
            {initialNews ? '📰 Edit News Story' : '📰 Post Tech News'}
          </h2>
          <button className="admin-modal__close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', flex: 1 }}>
          <div className="admin-modal__body">
            <div className="form-group">
              <label className="form-label">Headline *</label>
              <input
                type="text"
                className="form-input"
                value={headline}
                onChange={(e) => handleHeadlineChange(e.target.value)}
                placeholder="e.g. OpenAI Announces Next-Generation Reasoning Engine"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Source Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  placeholder="e.g. The Verge, Bloomberg, TechCrunch"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Category</label>
                <input
                  type="text"
                  className="form-input"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. AI Models, Robotics, Hardware"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Short Summary *</label>
              <textarea
                className="form-textarea"
                style={{ minHeight: '70px' }}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Concise 1-2 sentence overview for the news feed..."
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Full Story HTML</label>
              <textarea
                className="form-textarea"
                style={{ minHeight: '140px' }}
                value={fullContent}
                onChange={(e) => setFullContent(e.target.value)}
                placeholder="<p>Full story paragraphs and analysis...</p>"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Tags (comma-separated)</label>
              <input
                type="text"
                className="form-input"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="OpenAI, LLM, Innovation"
              />
            </div>
          </div>

          <div className="admin-modal__footer">
            <button type="button" onClick={onClose} className="btn-admin btn-admin-outline">
              Cancel
            </button>
            <button type="submit" className="btn-admin btn-admin-primary">
              💾 Save News
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
