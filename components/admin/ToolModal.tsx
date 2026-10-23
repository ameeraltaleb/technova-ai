'use client';

import { useState, useEffect } from 'react';
import { ToolItem } from '@/lib/admin-store';
import { CATEGORIES } from '@/lib/data';

interface ToolModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (tool: ToolItem) => void;
  initialTool?: ToolItem | null;
}

export default function ToolModal({
  isOpen,
  onClose,
  onSave,
  initialTool,
}: ToolModalProps) {
  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [affiliateUrl, setAffiliateUrl] = useState('');
  const [category, setCategory] = useState('ai-tools');
  const [pricing, setPricing] = useState('Freemium');
  const [rating, setRating] = useState(4.8);
  const [icon, setIcon] = useState('⚡');
  const [isSponsored, setIsSponsored] = useState(false);

  useEffect(() => {
    if (initialTool) {
      setName(initialTool.name || '');
      setId(initialTool.id || '');
      setDescription(initialTool.description || '');
      setUrl(initialTool.url || '');
      setAffiliateUrl(initialTool.affiliateUrl || '');
      setCategory(initialTool.category || 'ai-tools');
      setPricing(initialTool.pricing || 'Freemium');
      setRating(initialTool.rating || 4.8);
      setIcon(initialTool.icon || '⚡');
      setIsSponsored(!!initialTool.isSponsored);
    } else {
      setName('');
      setId('');
      setDescription('');
      setUrl('');
      setAffiliateUrl('');
      setCategory('ai-tools');
      setPricing('Freemium');
      setRating(4.8);
      setIcon('⚡');
      setIsSponsored(false);
    }
  }, [initialTool, isOpen]);

  if (!isOpen) return null;

  const handleNameChange = (val: string) => {
    setName(val);
    if (!initialTool) {
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
    if (!name || !url) return;

    const toolItem: ToolItem = {
      id: id || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      name,
      description,
      url,
      affiliateUrl,
      category,
      pricing,
      rating: Number(rating),
      icon,
      isSponsored,
    };

    onSave(toolItem);
  };

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal" style={{ maxWidth: '600px' }} onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal__header">
          <h2 className="admin-modal__title">
            {initialTool ? '🛠️ Edit Tool' : '🛠️ Add New AI Tool'}
          </h2>
          <button className="admin-modal__close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', flex: 1 }}>
          <div className="admin-modal__body">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Tool Name *</label>
                <input
                  type="text"
                  className="form-input"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Perplexity AI"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Icon / Emoji</label>
                <input
                  type="text"
                  className="form-input"
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  placeholder="e.g. 🤖 or ⚡"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Description *</label>
              <textarea
                className="form-textarea"
                style={{ minHeight: '80px' }}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Clear 1-2 sentence description explaining what this tool does and who it's for..."
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Website URL *</label>
                <input
                  type="url"
                  className="form-input"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Affiliate URL (Monetization)</label>
                <input
                  type="url"
                  className="form-input"
                  value={affiliateUrl}
                  onChange={(e) => setAffiliateUrl(e.target.value)}
                  placeholder="https://partnerstack.com/..."
                />
              </div>
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
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Pricing Model</label>
                <select
                  className="admin-select"
                  style={{ width: '100%' }}
                  value={pricing}
                  onChange={(e) => setPricing(e.target.value)}
                >
                  <option value="Free">Free</option>
                  <option value="Freemium">Freemium</option>
                  <option value="Freemium (/mo)">Freemium (/mo)</option>
                  <option value="Paid (/mo)">Paid (/mo)</option>
                  <option value="Free Trial">Free Trial</option>
                  <option value="Open Source">Open Source</option>
                </select>
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
              <div className="form-group" style={{ display: 'flex', alignItems: 'center', paddingTop: '24px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.875rem' }}>
                  <input
                    type="checkbox"
                    checked={isSponsored}
                    onChange={(e) => setIsSponsored(e.target.checked)}
                  />
                  <span>Mark as Sponsored / Featured Tool</span>
                </label>
              </div>
            </div>
          </div>

          <div className="admin-modal__footer">
            <button type="button" onClick={onClose} className="btn-admin btn-admin-outline">
              Cancel
            </button>
            <button type="submit" className="btn-admin btn-admin-primary">
              💾 Save Tool
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
