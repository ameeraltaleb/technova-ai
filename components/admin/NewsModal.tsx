'use client';

import { useState, useEffect } from 'react';
import { NewsItem } from '@/lib/admin-store';
import { callAdminAiApi } from '@/lib/admin-api';

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

  // AI State
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLang, setAiLang] = useState<'ar' | 'en'>('ar');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiStatusMsg, setAiStatusMsg] = useState('');

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
    setAiPrompt('');
    setAiStatusMsg('');
    setIsAiLoading(false);
  }, [initialNews, isOpen]);

  const handleGenerateNews = async () => {
    if (!aiPrompt.trim()) {
      alert('يرجى كتابة فكرة الخبر أو نص مقتبس أولاً.');
      return;
    }
    setIsAiLoading(true);
    setAiStatusMsg('جاري صياغة الخبر بالذكاء الاصطناعي عبر Gemini...');

    try {
      const res = await callAdminAiApi({
        action: 'generate_news',
        topic: aiPrompt.trim(),
        language: aiLang,
      });

      const resData = await res.json();
      if (!res.ok || !resData.success) {
        throw new Error(resData.error || 'فشل توليد الخبر');
      }

      const generated = resData.data;
      if (generated.headline) setHeadline(generated.headline);
      if (generated.id) setId(generated.id);
      if (generated.source) setSource(generated.source);
      if (generated.category) setCategory(generated.category);
      if (generated.content) setContent(generated.content);
      if (generated.fullContent) setFullContent(generated.fullContent);
      if (Array.isArray(generated.tags)) setTags(generated.tags.join(', '));

      setAiStatusMsg('✨ تم توليد الخبر بنجاح!');
      setTimeout(() => setAiStatusMsg(''), 4000);
    } catch (err: any) {
      alert('خطأ أثناء التوليد: ' + err.message);
      setAiStatusMsg('');
    } finally {
      setIsAiLoading(false);
    }
  };

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
            {/* ─── Gemini AI News Assistant ─── */}
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(168, 85, 247, 0.08) 100%)',
                border: '1px solid rgba(129, 140, 248, 0.35)',
                borderRadius: '12px',
                padding: '14px 16px',
                marginBottom: '18px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '1.1rem' }}>✨</span>
                  <strong style={{ fontSize: '0.9rem', color: '#312e81' }}>Gemini Fast News Creator</strong>
                </div>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button
                    type="button"
                    onClick={() => setAiLang('ar')}
                    style={{
                      padding: '2px 8px',
                      fontSize: '0.72rem',
                      borderRadius: '5px',
                      border: aiLang === 'ar' ? '1px solid #4f46e5' : '1px solid #cbd5e1',
                      background: aiLang === 'ar' ? '#4f46e5' : '#ffffff',
                      color: aiLang === 'ar' ? '#ffffff' : '#475569',
                      cursor: 'pointer',
                      fontWeight: 600,
                    }}
                  >
                    🇸🇦 عربي
                  </button>
                  <button
                    type="button"
                    onClick={() => setAiLang('en')}
                    style={{
                      padding: '2px 8px',
                      fontSize: '0.72rem',
                      borderRadius: '5px',
                      border: aiLang === 'en' ? '1px solid #4f46e5' : '1px solid #cbd5e1',
                      background: aiLang === 'en' ? '#4f46e5' : '#ffffff',
                      color: aiLang === 'en' ? '#ffffff' : '#475569',
                      cursor: 'pointer',
                      fontWeight: 600,
                    }}
                  >
                    🇺🇸 En
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '6px' }}>
                <input
                  type="text"
                  className="form-input"
                  style={{ flex: 1, background: '#ffffff', fontSize: '0.82rem' }}
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleGenerateNews();
                    }
                  }}
                  placeholder="ضع فكرة الخبر أو نص مقتبس أو إعلان شركة..."
                  disabled={isAiLoading}
                />
                <button
                  type="button"
                  onClick={handleGenerateNews}
                  disabled={isAiLoading}
                  className="btn-admin btn-admin-primary"
                  style={{ padding: '4px 12px', fontSize: '0.8rem', whiteSpace: 'nowrap' }}
                >
                  {isAiLoading ? '⏳ جاري الصياغة...' : '🚀 صياغة الخبر'}
                </button>
              </div>

              {aiStatusMsg && (
                <div style={{ marginTop: '8px', fontSize: '0.78rem', color: '#4338ca', fontWeight: 500 }}>
                  {aiStatusMsg}
                </div>
              )}
            </div>

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
