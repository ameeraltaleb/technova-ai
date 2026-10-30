'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { CATEGORIES } from '@/lib/data';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isArticlesDropdownOpen, setIsArticlesDropdownOpen] = useState(false);
  const [theme, setTheme] = useState('dark');
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  // Close dropdown on click outside or Escape key
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsArticlesDropdownOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsArticlesDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
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

          {/* Desktop Nav: Clean 5 Core Links with Dropdown for Categories */}
          <div className="navbar__nav">
            {/* Articles Dropdown */}
            <div
              className="navbar__dropdown-wrapper"
              ref={dropdownRef}
              onMouseEnter={() => setIsArticlesDropdownOpen(true)}
              onMouseLeave={() => setIsArticlesDropdownOpen(false)}
            >
              <button
                type="button"
                className={`navbar__dropdown-trigger ${isArticlesDropdownOpen ? 'active' : ''}`}
                onClick={() => setIsArticlesDropdownOpen(!isArticlesDropdownOpen)}
                aria-expanded={isArticlesDropdownOpen}
                aria-haspopup="true"
              >
                <span>Articles</span>
                <svg
                  className={`navbar__dropdown-arrow ${isArticlesDropdownOpen ? 'open' : ''}`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {/* Floating Dropdown Card */}
              <div
                className={`navbar__dropdown-menu ${isArticlesDropdownOpen ? 'open' : ''}`}
                role="menu"
                aria-label="Articles and Categories"
              >
                <Link
                  href="/category"
                  className="navbar__dropdown-header-link"
                  onClick={() => setIsArticlesDropdownOpen(false)}
                >
                  <span className="navbar__dropdown-header-icon">📚</span>
                  <div>
                    <div>All Articles & Reviews</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 400 }}>
                      Browse all tech analysis & guides
                    </div>
                  </div>
                </Link>

                <div className="navbar__dropdown-divider" />
                <div className="navbar__dropdown-label">Explore by Topic</div>

                <div className="navbar__dropdown-grid">
                  {CATEGORIES.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/category/${cat.id}`}
                      className="navbar__dropdown-item"
                      onClick={() => setIsArticlesDropdownOpen(false)}
                    >
                      <span className="navbar__dropdown-item-icon">{cat.icon}</span>
                      <span>{cat.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <Link href="/tools" className="navbar__link">
              Tools
            </Link>

            <Link href="/models" className="navbar__link" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <span>AI Models</span>
              <span
                style={{
                  fontSize: '0.62rem',
                  fontWeight: 700,
                  background: 'rgba(255, 157, 0, 0.18)',
                  color: '#f59e0b',
                  padding: '1px 5px',
                  borderRadius: '4px',
                  letterSpacing: '0.3px',
                }}
              >
                HUB
              </span>
            </Link>

            <Link href="/news" className="navbar__link">
              News
            </Link>

            <Link href="/about" className="navbar__link">
              About
            </Link>
          </div>

          {/* Action Buttons */}
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

      {/* Modern Slide-in Mobile Drawer for Mobile & Small Tablets */}
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
              <span>🔍 Search articles, tools, models...</span>
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
              <Link href="/models" className="mobile-drawer__link" onClick={() => setIsMobileOpen(false)}>
                <span className="mobile-drawer__link-icon">🤗</span>
                <span>AI Models Hub</span>
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

            {/* Topics / Categories Grid */}
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
