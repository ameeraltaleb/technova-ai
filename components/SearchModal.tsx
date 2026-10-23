'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ARTICLES, TOOLS, NEWS } from '@/lib/data';

interface SearchItem {
  id: string;
  title: string;
  subtitle: string;
  type: 'article' | 'tool' | 'news';
  url: string;
  icon: string;
}

export default function SearchModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Aggregate searchable items
  const allItems: SearchItem[] = [
    ...ARTICLES.map(a => ({
      id: `article-${a.id}`,
      title: a.title,
      subtitle: `${a.category} • ${a.date}`,
      type: 'article' as const,
      url: `/article/${a.id}`,
      icon: '📄',
    })),
    ...TOOLS.map(t => ({
      id: `tool-${t.id}`,
      title: t.name,
      subtitle: `${t.category} • ${t.pricing} • ${t.description.slice(0, 60)}...`,
      type: 'tool' as const,
      url: `/tools#${t.id}`,
      icon: t.icon || '🛠️',
    })),
    ...NEWS.map(n => ({
      id: `news-${n.id}`,
      title: n.headline,
      subtitle: `${n.source} • ${n.date}`,
      type: 'news' as const,
      url: `/news`,
      icon: '📰',
    })),
  ];

  const results = query.trim() === ''
    ? allItems.slice(0, 6)
    : allItems.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8);

  // Global open / close event listeners & shortcuts
  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true);
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
        if (!isOpen) {
          setTimeout(() => inputRef.current?.focus(), 50);
        }
      } else if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('open-search', handleOpen);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('open-search', handleOpen);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (url: string) => {
    setIsOpen(false);
    router.push(url);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % Math.max(1, results.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + results.length) % Math.max(1, results.length));
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      e.preventDefault();
      handleSelect(results[selectedIndex].url);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={`search-modal ${isOpen ? 'active' : ''}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsOpen(false);
      }}
    >
      <div className="search-modal__inner" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)' }}>
        <div className="search-modal__header">
          <span className="search-modal__icon">🔍</span>
          <input
            ref={inputRef}
            type="text"
            className="search-modal__input"
            placeholder="Search articles, tools, AI news..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleInputKeyDown}
          />
          <button
            className="search-modal__close"
            onClick={() => setIsOpen(false)}
            aria-label="Close search"
            style={{
              padding: '4px 8px',
              fontSize: '12px',
              borderRadius: '4px',
              background: 'var(--bg-secondary)',
              color: 'var(--text-tertiary)',
              border: '1px solid var(--border-secondary)',
              cursor: 'pointer',
            }}
          >
            ESC
          </button>
        </div>

        <div className="search-modal__results">
          {results.length === 0 ? (
            <div className="search-modal__empty">
              <p>No results found for &ldquo;{query}&rdquo;</p>
              <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)' }}>
                Try searching for ChatGPT, Claude, Dev Tools, or Productivity
              </span>
            </div>
          ) : (
            results.map((item, idx) => (
              <div
                key={item.id}
                className="search-modal__result"
                style={{
                  background: idx === selectedIndex ? 'var(--bg-tertiary)' : undefined,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                }}
                onClick={() => handleSelect(item.url)}
                onMouseEnter={() => setSelectedIndex(idx)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', overflow: 'hidden' }}>
                  <div className="search-modal__result-icon">{item.icon}</div>
                  <div style={{ overflow: 'hidden' }}>
                    <div className="search-modal__result-title" style={{ color: 'var(--text-primary)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                      {item.title}
                    </div>
                    <div className="search-modal__result-cat" style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem' }}>
                      {item.subtitle}
                    </div>
                  </div>
                </div>
                <span
                  style={{
                    fontSize: '0.7rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    background: item.type === 'article' ? 'rgba(108, 92, 231, 0.15)' : item.type === 'tool' ? 'rgba(0, 206, 201, 0.15)' : 'rgba(253, 121, 168, 0.15)',
                    color: item.type === 'article' ? 'var(--color-primary-light)' : item.type === 'tool' ? '#00cec9' : '#fd79a8',
                    fontWeight: 600,
                    flexShrink: 0,
                  }}
                >
                  {item.type}
                </span>
              </div>
            ))
          )}
        </div>

        <div
          style={{
            padding: '8px 16px',
            borderTop: '1px solid var(--border-secondary)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.75rem',
            color: 'var(--text-tertiary)',
            background: 'var(--bg-secondary)',
          }}
        >
          <span>Navigate with <kbd>↑</kbd> <kbd>↓</kbd></span>
          <span>Open with <kbd>Enter</kbd></span>
          <span>Shortcut <kbd>Ctrl+K</kbd></span>
        </div>
      </div>
    </div>
  );
}
