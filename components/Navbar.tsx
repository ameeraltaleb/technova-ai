'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Theme
    const saved = localStorage.getItem('technova-theme') || 'dark';
    setTheme(saved);
    document.documentElement.setAttribute('data-theme', saved);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
            <div className="navbar__logo-icon">🚀</div>
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
            <button className="navbar__theme-btn" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <button className="navbar__mobile-toggle" onClick={() => setIsMobileOpen(true)} aria-label="Menu">☰</button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMobileOpen ? 'active' : ''}`}>
        <button className="mobile-menu__close" onClick={() => setIsMobileOpen(false)}>✕</button>
        <div className="mobile-menu__inner">
          <Link href="/" className="mobile-menu__link" onClick={() => setIsMobileOpen(false)}>Home</Link>
          <Link href="/category" className="mobile-menu__link" onClick={() => setIsMobileOpen(false)}>All Articles</Link>
          <Link href="/tools" className="mobile-menu__link" onClick={() => setIsMobileOpen(false)}>Tools Directory</Link>
          <Link href="/news" className="mobile-menu__link" onClick={() => setIsMobileOpen(false)}>News</Link>
          <Link href="/about" className="mobile-menu__link" onClick={() => setIsMobileOpen(false)}>About</Link>
        </div>
      </div>
    </>
  );
}
