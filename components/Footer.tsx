import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div>
            <Link href="/" className="navbar__logo" aria-label="TechNova AI">
              <div className="navbar__brand-wordmark">
                <span className="navbar__brand-title">TECHNOVA</span>
                <div className="navbar__brand-subline">
                  <span className="navbar__brand-bar"></span>
                  <span className="navbar__brand-badge">AI</span>
                </div>
              </div>
            </Link>
            <p className="footer__brand-description">
              Your trusted source for honest, in-depth reviews of AI tools, software, and technology that shapes the future.
            </p>
            <div className="footer__social">
              <a href="https://x.com/TechNova__AI" target="_blank" rel="noopener noreferrer" className="footer__social-link" aria-label="TechNova AI on X (Twitter)">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
              </a>
              <a href="https://www.facebook.com/profile.php?id=61596020852355" target="_blank" rel="noopener noreferrer" className="footer__social-link" aria-label="TechNova AI on Facebook">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
              </a>
              <a href="/feed.xml" className="footer__social-link" aria-label="RSS Feed">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M6.18 15.64a2.18 2.18 0 0 1 2.18 2.18C8.36 19.01 7.38 20 6.18 20 4.98 20 4 19.02 4 17.82a2.18 2.18 0 0 1 2.18-2.18M4 4.44A15.56 15.56 0 0 1 19.56 20h-2.83A12.73 12.73 0 0 0 4 7.27V4.44m0 5.66a9.9 9.9 0 0 1 9.9 9.9h-2.83A7.07 7.07 0 0 0 4 12.93V10.1z" /></svg>
              </a>
            </div>
          </div>

          <div>
            <h3 className="footer__heading">Categories</h3>
            <div className="footer__links">
              <Link href="/category/ai-tools" className="footer__link">AI Tools</Link>
              <Link href="/models" className="footer__link">Open-Source Models</Link>
              <Link href="/category/dev-tools" className="footer__link">Dev Tools</Link>
              <Link href="/category/productivity" className="footer__link">Productivity</Link>
              <Link href="/category/design" className="footer__link">Design</Link>
              <Link href="/category/security" className="footer__link">Cybersecurity</Link>
              <Link href="/category/cloud" className="footer__link">Cloud & SaaS</Link>
            </div>
          </div>

          <div>
            <h3 className="footer__heading">Popular</h3>
            <div className="footer__links">
              <Link href="/article/claude-vs-chatgpt-2026" className="footer__link">Claude vs ChatGPT</Link>
              <Link href="/article/best-ai-code-editors-2026" className="footer__link">Best AI Code Editors</Link>
              <Link href="/article/notion-vs-obsidian-2026" className="footer__link">Notion vs Obsidian</Link>
              <Link href="/article/local-llms-guide-2026" className="footer__link">Local LLMs Guide</Link>
            </div>
          </div>

          <div>
            <h3 className="footer__heading">Company</h3>
            <div className="footer__links">
              <Link href="/about" className="footer__link">About Us</Link>
              <Link href="/contact" className="footer__link">Contact Us</Link>
              <Link href="/contact?topic=write-for-us" className="footer__link">Write for Us</Link>
              <Link href="/contact?topic=advertising" className="footer__link">Advertise</Link>
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
