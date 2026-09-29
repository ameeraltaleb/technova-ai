import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div>
            <Link href="/" className="navbar__logo">
              <div className="navbar__logo-icon">🚀</div>
              <span>TechNova AI</span>
            </Link>
            <p className="footer__brand-description">
              Your trusted source for honest, in-depth reviews of AI tools, software, and technology that shapes the future.
            </p>
            <div className="footer__social">
              <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="footer__social-link" aria-label="Twitter / X">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="footer__social-link" aria-label="YouTube">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="footer__social-link" aria-label="GitHub">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
              </a>
              <a href="/sitemap.xml" className="footer__social-link" aria-label="RSS Feed">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M6.18 15.64a2.18 2.18 0 0 1 2.18 2.18C8.36 19.01 7.38 20 6.18 20 4.98 20 4 19.02 4 17.82a2.18 2.18 0 0 1 2.18-2.18M4 4.44A15.56 15.56 0 0 1 19.56 20h-2.83A12.73 12.73 0 0 0 4 7.27V4.44m0 5.66a9.9 9.9 0 0 1 9.9 9.9h-2.83A7.07 7.07 0 0 0 4 12.93V10.1z"/></svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="footer__heading">Categories</h4>
            <div className="footer__links">
              <Link href="/category/ai-tools" className="footer__link">AI Tools</Link>
              <Link href="/category/dev-tools" className="footer__link">Dev Tools</Link>
              <Link href="/category/productivity" className="footer__link">Productivity</Link>
              <Link href="/category/design" className="footer__link">Design</Link>
              <Link href="/category/security" className="footer__link">Cybersecurity</Link>
              <Link href="/category/cloud" className="footer__link">Cloud & SaaS</Link>
            </div>
          </div>

          <div>
            <h4 className="footer__heading">Popular</h4>
            <div className="footer__links">
              <Link href="/article/claude-vs-chatgpt-2026" className="footer__link">Claude vs ChatGPT</Link>
              <Link href="/article/best-ai-code-editors-2026" className="footer__link">Best AI Code Editors</Link>
              <Link href="/article/notion-vs-obsidian-2026" className="footer__link">Notion vs Obsidian</Link>
              <Link href="/article/midjourney-v7-review" className="footer__link">Midjourney V7 Review</Link>
            </div>
          </div>

          <div>
            <h4 className="footer__heading">Company</h4>
            <div className="footer__links">
              <Link href="/about" className="footer__link">About Us</Link>
              <Link href="/about#contactForm" className="footer__link">Contact</Link>
              <Link href="/about#contactForm" className="footer__link">Write for Us</Link>
              <Link href="/about#contactForm" className="footer__link">Advertise</Link>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <span>© 2026 TechNova AI. All rights reserved.</span>
          <div className="footer__bottom-links">
            <Link href="/privacy" className="footer__bottom-link">Privacy Policy</Link>
            <Link href="/terms" className="footer__bottom-link">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
