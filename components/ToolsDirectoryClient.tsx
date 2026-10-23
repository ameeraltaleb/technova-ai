'use client';

import { useState } from 'react';
import SubmitToolModal from '@/components/SubmitToolModal';

interface Tool {
  id: string;
  name: string;
  description: string;
  url: string;
  category: string;
  pricing: string;
  rating: number;
  icon: string;
}

interface ToolsDirectoryClientProps {
  initialTools: Tool[];
}

export default function ToolsDirectoryClient({ initialTools }: ToolsDirectoryClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'productivity', name: 'Productivity' },
    { id: 'dev-tools', name: 'Dev Tools' },
    { id: 'design', name: 'Design' },
    { id: 'security', name: 'Cybersecurity' },
    { id: 'cloud', name: 'Cloud & SaaS' },
  ];

  const filteredTools = initialTools.filter((tool) => {
    const matchesCategory = selectedCategory === 'all' || tool.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      searchQuery.trim() === '' ||
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <SubmitToolModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* Monetization / Sponsor Banner */}
      <div
        style={{
          background: 'linear-gradient(90deg, rgba(108, 92, 231, 0.15) 0%, rgba(0, 206, 201, 0.1) 100%)',
          border: '1px solid rgba(108, 92, 231, 0.3)',
          borderRadius: 'var(--radius-xl)',
          padding: 'var(--space-4) var(--space-6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 'var(--space-4)',
          marginBottom: 'var(--space-8)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '1.75rem' }}>🚀</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
              Are you an AI founder or developer?
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Promote your software, get a verified dofollow backlink, and reach thousands of daily readers.
            </div>
          </div>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          style={{
            background: 'var(--color-primary)',
            color: '#fff',
            fontWeight: 700,
            fontSize: '0.85rem',
            padding: '10px 18px',
            borderRadius: 'var(--radius-md)',
            border: 'none',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-glow)',
            whiteSpace: 'nowrap',
            transition: 'transform 0.2s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
        >
          + Submit & Feature Your Tool
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 'var(--space-4)',
          marginBottom: 'var(--space-6)',
        }}
      >
        {/* Category Filter Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.85rem',
                fontWeight: 600,
                border: '1px solid',
                borderColor: selectedCategory === cat.id ? 'var(--color-primary)' : 'var(--border-card)',
                background: selectedCategory === cat.id ? 'var(--color-primary)' : 'var(--bg-card)',
                color: selectedCategory === cat.id ? '#fff' : 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Quick Search Input */}
        <div style={{ minWidth: '240px' }}>
          <input
            type="text"
            placeholder="Filter tools by keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 14px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-card)',
              color: 'var(--text-primary)',
              fontSize: '0.85rem',
              outline: 'none',
            }}
          />
        </div>
      </div>

      {/* Tools Grid */}
      <div className="cards-grid" id="toolsGrid">
        {filteredTools.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 'var(--space-12) 0', color: 'var(--text-tertiary)' }}>
            No tools found matching your criteria.
          </div>
        ) : (
          filteredTools.map((tool, index) => {
            const isFeatured = index < 3; // First 3 tools highlighted as Featured
            return (
              <a
                key={tool.id}
                id={tool.id}
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="article-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  border: isFeatured ? '1px solid rgba(0, 206, 201, 0.4)' : undefined,
                  boxShadow: isFeatured ? '0 4px 20px rgba(0, 206, 201, 0.1)' : undefined,
                }}
              >
                {isFeatured && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      background: 'rgba(0, 206, 201, 0.15)',
                      border: '1px solid #00cec9',
                      color: '#00cec9',
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: '4px',
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                      zIndex: 2,
                    }}
                  >
                    Featured
                  </span>
                )}
                <div
                  style={{
                    padding: 'var(--space-6)',
                    background: 'var(--bg-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '3rem',
                    height: '110px',
                  }}
                >
                  {tool.icon}
                </div>
                <div className="article-card__content" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div className="article-card__meta">
                    <span className="article-card__tag">{tool.category}</span>
                    <span>⭐ {tool.rating}</span>
                  </div>
                  <h3 className="article-card__title">{tool.name}</h3>
                  <p className="article-card__excerpt" style={{ flex: 1 }}>
                    {tool.description}
                  </p>
                  <div
                    style={{
                      marginTop: 'var(--space-4)',
                      fontSize: 'var(--text-sm)',
                      color: 'var(--color-primary-light)',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span>{tool.pricing}</span>
                    <span>Visit Tool →</span>
                  </div>
                </div>
              </a>
            );
          })
        )}
      </div>
    </>
  );
}
