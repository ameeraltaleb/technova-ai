'use client';

import { useState, useEffect } from 'react';
import { ArticleItem } from '@/lib/admin-store';
import { CATEGORIES } from '@/lib/data';
import { callAdminAiApi } from '@/lib/admin-api';
import { removeUndefined } from '@/lib/utils';

interface ArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (article: ArticleItem) => Promise<void> | void;
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
  const [isSponsored, setIsSponsored] = useState(false);
  const [sponsorName, setSponsorName] = useState('');
  const [sponsorUrl, setSponsorUrl] = useState('');
  const [prosText, setProsText] = useState('');
  const [consText, setConsText] = useState('');
  const [content, setContent] = useState('');

  // Save & Readiness State
  const [isSaving, setIsSaving] = useState(false);
  const [savedReadyId, setSavedReadyId] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  // Buffer Auto-Publish
  const [shareToBuffer, setShareToBuffer] = useState(true);
  const [bufferPublishStatus, setBufferPublishStatus] = useState<string | null>(null);


  // AI Assistant States
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLanguage, setAiLanguage] = useState<'ar' | 'en'>('ar');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiStatusMsg, setAiStatusMsg] = useState('');
  const [activeAiHelper, setActiveAiHelper] = useState<string | null>(null);

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
      setIsSponsored(Boolean(initialArticle.isSponsored));
      setSponsorName(initialArticle.sponsorName || '');
      setSponsorUrl(initialArticle.sponsorUrl || '');
      setProsText((initialArticle.pros || []).join('\n'));
      setConsText((initialArticle.cons || []).join('\n'));
      setContent(initialArticle.content || '');
    } else {
      // New article defaults: clean and empty
      setTitle('');
      setSlug('');
      setExcerpt('');
      setCategory('ai-tools');
      setAuthorName('TechNova AI Team');
      setRating(4.8);
      setReadTime('6 min read');
      setFeatured(false);
      setIsSponsored(false);
      setSponsorName('');
      setSponsorUrl('');
      setTags('');
      setImage('');
      setAffiliateUrl('');
      setProsText('');
      setConsText('');
      setContent('');
    }
    setAiPrompt('');
    setAiStatusMsg('');
    setIsAiLoading(false);
    setIsSaving(false);
    setSavedReadyId(null);
    setSaveError(null);
  }, [initialArticle, isOpen]);

  const handleGenerateFullArticle = async () => {
    if (!aiPrompt.trim()) {
      alert('يرجى كتابة فكرة المقال أو اسم الأداة أولاً.');
      return;
    }

    setIsAiLoading(true);
    setAiStatusMsg('جاري الاتصال بـ Google Gemini لتوليد المقال بالكامل...');

    try {
      const res = await callAdminAiApi({
        action: 'generate_article',
        topic: aiPrompt.trim(),
        language: aiLanguage,
      });

      const resData = await res.json();
      if (!res.ok || !resData.success) {
        throw new Error(resData.error || 'فشل توليد المقال');
      }

      const generated = resData.data;
      if (generated.title) setTitle(generated.title);
      if (generated.slug) setSlug(generated.slug);
      if (generated.excerpt) setExcerpt(generated.excerpt);
      if (generated.category) {
        const matchingCat = CATEGORIES.find((c) => c.id === generated.category);
        setCategory(matchingCat ? matchingCat.id : 'ai-tools');
      }
      if (generated.readTime) setReadTime(generated.readTime);
      if (generated.rating) setRating(generated.rating);
      if (Array.isArray(generated.tags)) setTags(generated.tags.join(', '));
      if (Array.isArray(generated.pros)) setProsText(generated.pros.join('\n'));
      if (Array.isArray(generated.cons)) setConsText(generated.cons.join('\n'));
      if (generated.content) setContent(generated.content);

      setAiStatusMsg('✨ تم توليد المقال وتعبئة جميع الحقول بنجاح!');
      setTimeout(() => setAiStatusMsg(''), 4000);
    } catch (err: any) {
      alert('خطأ أثناء التوليد: ' + err.message);
      setAiStatusMsg('');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleGenerateExcerpt = async () => {
    if (!content.trim()) {
      alert('يرجى كتابة محتوى في المقال أولاً لتلخيصه.');
      return;
    }
    setActiveAiHelper('excerpt');
    try {
      const res = await callAdminAiApi({
        action: 'generate_excerpt',
        contextData: content,
      });
      const data = await res.json();
      if (data.success && data.data?.excerpt) {
        setExcerpt(data.data.excerpt);
      }
    } catch (e: any) {
      alert('خطأ: ' + e.message);
    } finally {
      setActiveAiHelper(null);
    }
  };

  const handleExtractProsCons = async () => {
    if (!content.trim()) {
      alert('يرجى كتابة محتوى المقال أولاً لاستخراج الإيجابيات والسلبيات.');
      return;
    }
    setActiveAiHelper('pros_cons');
    try {
      const res = await callAdminAiApi({
        action: 'extract_pros_cons',
        contextData: content,
      });
      const data = await res.json();
      if (data.success && data.data) {
        if (Array.isArray(data.data.pros)) setProsText(data.data.pros.join('\n'));
        if (Array.isArray(data.data.cons)) setConsText(data.data.cons.join('\n'));
      }
    } catch (e: any) {
      alert('خطأ: ' + e.message);
    } finally {
      setActiveAiHelper(null);
    }
  };

  const handleSuggestTags = async () => {
    if (!title.trim() && !content.trim()) {
      alert('يرجى كتابة العنوان أو المحتوى لاقتراح الوسوم.');
      return;
    }
    setActiveAiHelper('tags');
    try {
      const res = await callAdminAiApi({
        action: 'suggest_tags',
        topic: title,
        contextData: content,
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.data?.tags)) {
        setTags(data.data.tags.join(', '));
      }
    } catch (e: any) {
      alert('خطأ: ' + e.message);
    } finally {
      setActiveAiHelper(null);
    }
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanTitle = title.trim();
    const cleanSlug = slug
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    const cleanExcerpt = excerpt.trim();
    const cleanContent = content.trim();

    // Separate validation for each required field with clear messages
    if (!cleanTitle) {
      setSaveError('يرجى إدخال عنوان المقال (Article Title مطلوب).');
      setActiveTab('edit');
      return;
    }
    if (!cleanSlug) {
      setSaveError('يرجى إدخال معرّف الرابط للمقال (URL Slug مطلوب).');
      setActiveTab('edit');
      return;
    }
    if (!cleanExcerpt) {
      setSaveError('يرجى إدخال ملخص المقال (Excerpt / Summary مطلوب).');
      setActiveTab('edit');
      return;
    }
    if (!cleanContent) {
      setSaveError('يرجى كتابة محتوى المقال (Article Content مطلوب).');
      setActiveTab('edit');
      return;
    }
    if (!category) {
      setSaveError('يرجى اختيار تصنيف المقال (Category مطلوب).');
      setActiveTab('edit');
      return;
    }

    setIsSaving(true);
    setSaveError(null);
    setSavedReadyId(null);

    const pros = prosText.split('\n').map((p) => p.trim()).filter(Boolean);
    const cons = consText.split('\n').map((c) => c.trim()).filter(Boolean);
    const parsedTags = tags.split(',').map((t) => t.trim()).filter(Boolean);

    // Auto-format plain text into paragraphs if no HTML tags were used
    let formattedContent = cleanContent;
    if (!cleanContent.includes('<') && !cleanContent.includes('>')) {
      formattedContent = cleanContent
        .split('\n\n')
        .filter((block) => block.trim())
        .map((block) => `<p>${block.replace(/\n/g, '<br/>')}</p>`)
        .join('\n\n');
    }

    const cleanAuthor = authorName.trim() || 'TechNova AI Team';

    const rawArticleItem: ArticleItem = {
      id: cleanSlug,
      title: cleanTitle,
      excerpt: cleanExcerpt,
      category,
      author: {
        name: cleanAuthor,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(cleanAuthor)}&background=random`,
      },
      date: initialArticle?.date || new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString(),
      readTime: readTime.trim() || '6 min read',
      rating: Number(rating) || 4.8,
      featured: Boolean(featured),
      tags: parsedTags,
      image: image.trim(),
      content: formattedContent,
      isSponsored: Boolean(isSponsored),
      ratingBreakdown: {
        overall: Number(rating) || 4.8,
        label: Number(rating) >= 4.8 ? 'Exceptional' : Number(rating) >= 4.5 ? 'Excellent' : 'Very Good',
      },
    };

    // Attach optional fields strictly when provided and valid
    if (initialArticle?.createdAt) {
      rawArticleItem.createdAt = initialArticle.createdAt;
    }
    if (pros.length > 0) {
      rawArticleItem.pros = pros;
    }
    if (cons.length > 0) {
      rawArticleItem.cons = cons;
    }
    if (affiliateUrl && affiliateUrl.trim()) {
      rawArticleItem.affiliateUrl = affiliateUrl.trim();
    }
    if (initialArticle?.pricingInfo && initialArticle.pricingInfo.trim()) {
      rawArticleItem.pricingInfo = initialArticle.pricingInfo.trim();
    }
    if (isSponsored && sponsorName && sponsorName.trim()) {
      rawArticleItem.sponsorName = sponsorName.trim();
    }
    if (isSponsored && sponsorUrl && sponsorUrl.trim()) {
      rawArticleItem.sponsorUrl = sponsorUrl.trim();
    }

    const articleItem = removeUndefined(rawArticleItem);

    try {
      await onSave(articleItem);
      // Confirmed saved and available on Firestore & storage!
      setSavedReadyId(articleItem.id);

      // Trigger Buffer Immediate Auto-Publish
      if (shareToBuffer) {
        try {
          const bRes = await fetch('/api/buffer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: articleItem.id,
              title: articleItem.title,
              excerpt: articleItem.excerpt,
              image: articleItem.image,
              now: true,
            }),
          });
          const bData = await bRes.json();
          if (bRes.ok && bData.success) {
            setBufferPublishStatus('🚀 تم النشر فورياً عبر Buffer على حسابات السوشيال ميديا المتصلة!');
          } else if (bData.error && !bData.error.includes('غير متوفر')) {
            console.warn('Buffer auto-publish note:', bData.error);
          }
        } catch (bErr) {
          console.warn('Buffer publish call error:', bErr);
        }
      }

    } catch (err: any) {
      console.error('Error saving article:', err);
      setSaveError(err?.message || 'حدث خطأ أثناء حفظ المقال، يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSaving(false);
    }
  };

  const insertTag = (before: string, after: string = '') => {
    setContent((prev) => prev + before + after);
  };

  const insertTemplate = () => {
    setContent(`<h2>Introduction</h2>
<p>Write an engaging opening that explains what this tool is and why it matters in 2026.</p>

<h2>Key Features</h2>
<ul>
  <li><strong>Feature 1:</strong> Description of the capability.</li>
  <li><strong>Feature 2:</strong> Description of the capability.</li>
</ul>

<h2>Pricing & Plans</h2>
<p>Break down the free vs paid tiers and whether it offers good value.</p>

<h2>Final Verdict</h2>
<p>Summary recommendation for creators, developers, or teams.</p>`);
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
              <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <span className="badge-pill badge-pill-primary" style={{ marginBottom: '12px' }}>{category}</span>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '8px 0 12px', color: '#0f172a' }}>{title || 'Article Title Preview'}</h1>
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
                  style={{ lineHeight: 1.8, color: '#334155' }}
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              </div>
            ) : (
              <>
                {/* ─── Google Gemini AI Writer Banner ─── */}
                <div
                  style={{
                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(168, 85, 247, 0.08) 100%)',
                    border: '1px solid rgba(129, 140, 248, 0.35)',
                    borderRadius: '12px',
                    padding: '16px 20px',
                    marginBottom: '20px',
                    boxShadow: '0 4px 15px -3px rgba(99, 102, 241, 0.05)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '1.25rem' }}>✨</span>
                      <div>
                        <strong style={{ fontSize: '0.95rem', color: '#312e81' }}>
                          Google Gemini AI Co-Writer
                        </strong>
                        <span style={{ fontSize: '0.75rem', background: '#e0e7ff', color: '#4338ca', padding: '2px 8px', borderRadius: '12px', marginLeft: '8px', fontWeight: 600 }}>
                          PRO MODEL ACTIVE
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)' }}>اللغة:</span>
                      <button
                        type="button"
                        onClick={() => setAiLanguage('ar')}
                        style={{
                          padding: '3px 10px',
                          fontSize: '0.75rem',
                          borderRadius: '6px',
                          border: aiLanguage === 'ar' ? '1px solid #4f46e5' : '1px solid #cbd5e1',
                          background: aiLanguage === 'ar' ? '#4f46e5' : '#ffffff',
                          color: aiLanguage === 'ar' ? '#ffffff' : '#475569',
                          cursor: 'pointer',
                          fontWeight: 600,
                        }}
                      >
                        🇸🇦 العربية
                      </button>
                      <button
                        type="button"
                        onClick={() => setAiLanguage('en')}
                        style={{
                          padding: '3px 10px',
                          fontSize: '0.75rem',
                          borderRadius: '6px',
                          border: aiLanguage === 'en' ? '1px solid #4f46e5' : '1px solid #cbd5e1',
                          background: aiLanguage === 'en' ? '#4f46e5' : '#ffffff',
                          color: aiLanguage === 'en' ? '#ffffff' : '#475569',
                          cursor: 'pointer',
                          fontWeight: 600,
                        }}
                      >
                        🇺🇸 English
                      </button>
                    </div>
                  </div>

                  <p style={{ margin: '0 0 10px', fontSize: '0.82rem', color: '#475569', lineHeight: 1.4 }}>
                    اكتب فكرة المقال، أو عنوان أداة تريد مراجعتها، وسيقوم الذكاء الاصطناعي بتوليد المقال بالكامل مع الهيكل، العناوين، الإيجابيات والسلبيات، والوسوم:
                  </p>

                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <input
                      type="text"
                      className="form-input"
                      style={{ flex: '1 1 300px', background: '#ffffff', borderColor: '#c7d2fe' }}
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleGenerateFullArticle();
                        }
                      }}
                      placeholder="مثال: مراجعة لأداة Devin للبرمجة الذاتية وهل تستبدل المبرمجين..."
                      disabled={isAiLoading}
                    />
                    <button
                      type="button"
                      onClick={handleGenerateFullArticle}
                      disabled={isAiLoading}
                      style={{
                        background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '8px 18px',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        cursor: isAiLoading ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: '0 2px 8px rgba(79, 70, 229, 0.3)',
                        opacity: isAiLoading ? 0.7 : 1,
                      }}
                    >
                      {isAiLoading ? '⏳ جاري التوليد...' : '🚀 توليد المقال بالكامل'}
                    </button>
                  </div>

                  {aiStatusMsg && (
                    <div
                      style={{
                        marginTop: '10px',
                        padding: '6px 12px',
                        background: aiStatusMsg.includes('✨') ? '#ecfdf5' : '#eff6ff',
                        color: aiStatusMsg.includes('✨') ? '#065f46' : '#1e40af',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        fontWeight: 500,
                      }}
                    >
                      {aiStatusMsg}
                    </div>
                  )}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <label className="form-label" style={{ margin: 0 }}>Article Title *</label>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          color: title.length > 65 ? '#ef4444' : title.length >= 40 ? '#10b981' : '#64748b',
                        }}
                      >
                        SEO: {title.length}/65 chars {title.length > 65 ? '(Auto-truncated in meta)' : title.length >= 40 ? '✓ Ideal' : ''}
                      </span>
                    </div>
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
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <label className="form-label" style={{ margin: 0 }}>Excerpt / Summary *</label>
                    <button
                      type="button"
                      onClick={handleGenerateExcerpt}
                      disabled={activeAiHelper === 'excerpt'}
                      className="btn-admin btn-admin-outline"
                      style={{ padding: '2px 8px', fontSize: '0.75rem', borderColor: '#a5b4fc', color: '#4338ca' }}
                    >
                      {activeAiHelper === 'excerpt' ? '⏳ جاري التلخيص...' : '✨ تلخيص من المحتوى بالـ AI'}
                    </button>
                  </div>
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

                <div style={{ marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--admin-text-main)' }}>
                      المزايا والعيوب (Pros & Cons)
                    </span>
                    <button
                      type="button"
                      onClick={handleExtractProsCons}
                      disabled={activeAiHelper === 'pros_cons'}
                      className="btn-admin btn-admin-outline"
                      style={{ padding: '2px 8px', fontSize: '0.75rem', borderColor: '#a5b4fc', color: '#4338ca' }}
                    >
                      {activeAiHelper === 'pros_cons' ? '⏳ جاري الاستخراج...' : '✨ استخراج من المحتوى بالـ AI'}
                    </button>
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
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <label className="form-label" style={{ margin: 0 }}>Tags (comma-separated)</label>
                    <button
                      type="button"
                      onClick={handleSuggestTags}
                      disabled={activeAiHelper === 'tags'}
                      className="btn-admin btn-admin-outline"
                      style={{ padding: '2px 8px', fontSize: '0.75rem', borderColor: '#a5b4fc', color: '#4338ca' }}
                    >
                      {activeAiHelper === 'tags' ? '⏳ جاري الاقتراح...' : '✨ اقتراح وسوم بالـ AI'}
                    </button>
                  </div>
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

                {initialArticle?.isSponsored && (
                  <div
                    style={{
                      margin: '12px 0 16px',
                      padding: '12px 14px',
                      borderRadius: '8px',
                      background: 'rgba(245, 158, 11, 0.08)',
                      border: '1px solid rgba(245, 158, 11, 0.4)',
                    }}
                  >
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span>⭐ Legacy Sponsored Article Disclosure (Preserved)</span>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)', margin: '4px 0 10px' }}>
                      This historical article has active sponsored disclosure. New paid reviews have been discontinued per TechNova editorial policy.
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <div>
                        <label className="form-label" style={{ fontSize: '0.75rem' }}>Sponsor / Product Name</label>
                        <input
                          type="text"
                          className="form-input"
                          value={sponsorName}
                          onChange={(e) => setSponsorName(e.target.value)}
                          placeholder="e.g. Synthesia AI"
                        />
                      </div>
                      <div>
                        <label className="form-label" style={{ fontSize: '0.75rem' }}>Client Target URL (rel=&quot;sponsored&quot;)</label>
                        <input
                          type="url"
                          className="form-input"
                          value={sponsorUrl}
                          onChange={(e) => setSponsorUrl(e.target.value)}
                          placeholder="https://client-tool.com"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="form-group">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                    <label className="form-label" style={{ margin: 0 }}>محتوى المقال (Article Content) *</label>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      <button type="button" onClick={() => insertTag('<h2>', '</h2>\n')} className="btn-admin btn-admin-outline" style={{ padding: '2px 8px', fontSize: '0.75rem' }}>+ H2 عنوان</button>
                      <button type="button" onClick={() => insertTag('<h3>', '</h3>\n')} className="btn-admin btn-admin-outline" style={{ padding: '2px 8px', fontSize: '0.75rem' }}>+ H3 فرعي</button>
                      <button type="button" onClick={() => insertTag('<strong>', '</strong>')} className="btn-admin btn-admin-outline" style={{ padding: '2px 8px', fontSize: '0.75rem' }}>+ B عريض</button>
                      <button type="button" onClick={() => insertTag('<ul>\n  <li>', '</li>\n</ul>\n')} className="btn-admin btn-admin-outline" style={{ padding: '2px 8px', fontSize: '0.75rem' }}>+ قائمة نقاط</button>
                      <button type="button" onClick={insertTemplate} className="btn-admin btn-admin-outline" style={{ padding: '2px 8px', fontSize: '0.75rem', borderColor: '#818cf8', color: '#4f46e5' }}>📋 إدراج قالب جاهز</button>
                    </div>
                  </div>
                  <textarea
                    className="form-textarea"
                    style={{ minHeight: '220px', fontSize: '0.9rem', lineHeight: 1.7 }}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="اكتب المقال بحرية هنا... يمكنك كتابة نص عادي وسيقوم النظام بتنسيقه تلقائياً إلى فقرات، أو استخدام أزرار التنسيق السريعة أعلاه..."
                    required
                  />
                </div>
              </>
            )}

            {/* Saved and ready banner */}
            {savedReadyId && (
              <div
                style={{
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(5, 150, 105, 0.08))',
                  border: '1.5px solid #10b981',
                  borderRadius: '10px',
                  padding: '14px 18px',
                  margin: '16px 0 8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  flexWrap: 'wrap',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.15)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '1.5rem' }}>✅</span>
                  <div>
                    <div style={{ fontWeight: 700, color: '#065f46', fontSize: '0.95rem' }}>
                      تم حفظ وتأكيد المقال في قاعدة البيانات بنجاح!
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#047857' }}>
                      المقال الآن جاهز ومتاح بالكامل على الموقع دون أي انتظار.
                    </div>
                    {bufferPublishStatus && (
                      <div style={{ fontSize: '0.82rem', color: '#6366f1', fontWeight: 600, marginTop: '4px' }}>
                        {bufferPublishStatus}
                      </div>
                    )}

                  </div>
                </div>
                <a
                  href={`/article/${savedReadyId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-admin btn-admin-primary"
                  style={{
                    background: '#10b981',
                    borderColor: '#10b981',
                    color: '#ffffff',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    textDecoration: 'none',
                    fontWeight: 700,
                    padding: '8px 16px',
                    borderRadius: '6px',
                    fontSize: '0.9rem',
                  }}
                >
                  👁️ عرض المقال بالموقع الآن ↗
                </a>
              </div>
            )}

            {saveError && (
              <div
                style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid #ef4444',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  color: '#b91c1c',
                  margin: '12px 0 6px',
                  fontSize: '0.85rem',
                }}
              >
                ⚠️ {saveError}
              </div>
            )}
          </div>

          <div
            className="admin-modal__footer"
            style={{
              display: 'flex',
              justifyContent: savedReadyId ? 'space-between' : 'flex-end',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            {savedReadyId ? (
              <>
                <a
                  href={`/article/${savedReadyId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-admin"
                  style={{
                    background: '#10b981',
                    borderColor: '#10b981',
                    color: '#ffffff',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    textDecoration: 'none',
                    fontWeight: 700,
                    padding: '8px 16px',
                  }}
                >
                  👁️ عرض المقال بالموقع الآن ↗
                </a>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button type="button" onClick={onClose} className="btn-admin btn-admin-outline">
                    إغلاق النافذة
                  </button>
                  <button type="submit" disabled={isSaving} className="btn-admin btn-admin-primary">
                    {isSaving ? '⏳ جاري الحفظ...' : '💾 حفظ التعديلات مجدداً'}
                  </button>
                </div>
              </>
            ) : (
              <>
                <label
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    marginInlineEnd: 'auto',
                    fontSize: '0.84rem',
                    fontWeight: 600,
                    color: '#6366f1',
                    background: 'rgba(99, 102, 241, 0.08)',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(99, 102, 241, 0.25)',
                  }}
                  title="نشر فوري عبر Buffer إلى X ولينكد إن وفيسبوك فور حفظ المقال"
                >
                  <input
                    type="checkbox"
                    checked={shareToBuffer}
                    onChange={(e) => setShareToBuffer(e.target.checked)}
                    style={{ width: '15px', height: '15px', accentColor: '#6366f1' }}
                  />
                  <span>📡 نشر فوري عبر Buffer</span>
                </label>

                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSaving}
                  className="btn-admin btn-admin-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="btn-admin btn-admin-primary"
                  style={{
                    minWidth: '150px',
                    display: 'inline-flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  {isSaving ? (
                    <>
                      <span
                        style={{
                          width: '13px',
                          height: '13px',
                          border: '2px solid rgba(255,255,255,0.4)',
                          borderTopColor: '#fff',
                          borderRadius: '50%',
                          display: 'inline-block',
                          animation: 'spin 0.8s linear infinite',
                        }}
                      />
                      <span>جاري الحفظ والتأكيد...</span>
                    </>
                  ) : (
                    '💾 Save Article'
                  )}
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
