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
              <a href="#" className="footer__social-link" aria-label="Twitter">𝕏</a>
              <a href="#" className="footer__social-link" aria-label="YouTube">▶</a>
              <a href="#" className="footer__social-link" aria-label="GitHub">⌥</a>
              <a href="#" className="footer__social-link" aria-label="RSS">☰</a>
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
              <Link href="/about" className="footer__link">Write for Us</Link>
              <Link href="/about#contactForm" className="footer__link">Advertise</Link>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <span>© 2026 TechNova AI. All rights reserved.</span>
          <div className="footer__bottom-links">
            <Link href="/privacy" className="footer__bottom-link">Privacy Policy</Link>
            <Link href="/terms" className="footer__bottom-link">Terms of Service</Link>
            <Link href="/privacy" className="footer__bottom-link">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
