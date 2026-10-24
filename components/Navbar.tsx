'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { CATEGORIES } from '@/lib/data';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Theme initialization
    const saved = localStorage.getItem('technova-theme') || 'dark';
    setTheme(saved);
    document.documentElement.setAttribute('data-theme', saved);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileOpen]);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('technova-theme', next);
    document.documentElement.setAttribute('data-theme', next);
  };

  return (
    <>
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`} id="navbar">
        <div className="container navbar__inner">
          <Link href="/" className="navbar__logo">
            <img src="/logo.png" alt="TechNova AI" className="navbar__logo-img" width={36} height={36} />
            <span>TechNova AI</span>
          </Link>

          <div className="navbar__nav">
            <Link href="/" className="navbar__link">Home</Link>
            <Link href="/category" className="navbar__link">All Articles</Link>
            <Link href="/tools" className="navbar__link">Tools Directory</Link>
            <Link href="/news" className="navbar__link">News</Link>
            <Link href="/category/ai-tools" className="navbar__link">AI Tools</Link>
            <Link href="/category/dev-tools" className="navbar__link">Dev Tools</Link>
            <Link href="/category/productivity" className="navbar__link">Productivity</Link>
            <Link href="/about" className="navbar__link">About</Link>
          </div>

          <div className="navbar__actions">
            <button
              className="navbar__search-btn"
              onClick={() => window.dispatchEvent(new CustomEvent('open-search'))}
              aria-label="Search"
              title="Search articles & tools (Ctrl+K)"
            >
              🔍
            </button>
            <button className="navbar__theme-btn" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <button
              className="navbar__mobile-toggle"
              onClick={() => setIsMobileOpen(true)}
              aria-label="Open navigation menu"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="6" x2="20" y2="6"></line>
                <line x1="4" y1="12" x2="20" y2="12"></line>
                <line x1="4" y1="18" x2="20" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Modern Slide-in Mobile Drawer */}
      <div
        className={`mobile-menu ${isMobileOpen ? 'active' : ''}`}
        onClick={() => setIsMobileOpen(false)}
      >
        <div
          className="mobile-drawer"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Drawer Top Bar */}
          <div className="mobile-drawer__header">
            <Link href="/" className="navbar__logo" onClick={() => setIsMobileOpen(false)}>
              <img src="/logo.png" alt="TechNova AI" className="navbar__logo-img" width={32} height={32} />
              <span style={{ fontSize: 'var(--fs-lg)' }}>TechNova AI</span>
            </Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                className="mobile-drawer__theme-btn"
                onClick={toggleTheme}
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
              </button>
              <button
                className="mobile-drawer__close"
                onClick={() => setIsMobileOpen(false)}
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Quick Search Trigger */}
          <div className="mobile-drawer__search">
            <button
              type="button"
              className="mobile-drawer__search-btn"
              onClick={() => {
                setIsMobileOpen(false);
                window.dispatchEvent(new CustomEvent('open-search'));
              }}
            >
              <span>🔍 Search articles, tools...</span>
              <kbd className="mobile-drawer__kbd">Search</kbd>
            </button>
          </div>

          {/* Navigation Links */}
          <div className="mobile-drawer__content">
            <div className="mobile-drawer__section-label">Main Navigation</div>
            <nav className="mobile-drawer__nav">
              <Link href="/" className="mobile-drawer__link" onClick={() => setIsMobileOpen(false)}>
                <span className="mobile-drawer__link-icon">🏠</span>
                <span>Home</span>
              </Link>
              <Link href="/category" className="mobile-drawer__link" onClick={() => setIsMobileOpen(false)}>
                <span className="mobile-drawer__link-icon">📚</span>
                <span>All Articles & Reviews</span>
              </Link>
              <Link href="/tools" className="mobile-drawer__link" onClick={() => setIsMobileOpen(false)}>
                <span className="mobile-drawer__link-icon">⚡</span>
                <span>Tools Directory</span>
              </Link>
              <Link href="/news" className="mobile-drawer__link" onClick={() => setIsMobileOpen(false)}>
                <span className="mobile-drawer__link-icon">📰</span>
                <span>Tech News</span>
              </Link>
              <Link href="/about" className="mobile-drawer__link" onClick={() => setIsMobileOpen(false)}>
                <span className="mobile-drawer__link-icon">ℹ️</span>
                <span>About Us</span>
              </Link>
            </nav>

            {/* Popular Topics / Categories */}
            <div className="mobile-drawer__section-label" style={{ marginTop: 'var(--space-6)' }}>
              Explore Topics
            </div>
            <div className="mobile-drawer__categories">
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.id}`}
                  className="mobile-drawer__cat-chip"
                  onClick={() => setIsMobileOpen(false)}
                >
                  <span>{cat.icon}</span> {cat.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Drawer Bottom Bar */}
          <div className="mobile-drawer__footer">
            <span>TechNova AI • Modern Tech Reviews & Directory</span>
          </div>
        </div>
      </div>
    </>
  );
}
