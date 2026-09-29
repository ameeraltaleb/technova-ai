import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Us — TechNova AI',
  description: 'Learn about TechNova AI, our mission, and the team behind honest, in-depth tech reviews.',
};

export default function AboutPage() {
  return (
    <>
      <section className="category-hero">
        <div className="container">
          <div className="article__breadcrumb">
            <Link href="/">Home</Link> <span>/</span>
            <span>About</span>
          </div>
          <div className="category-hero__icon" style={{ background: 'rgba(108, 92, 231, 0.15)', color: 'var(--color-primary-light)' }}>🚀</div>
          <h1 className="category-hero__title">About TechNova AI</h1>
          <p className="category-hero__description">Honest reviews, in-depth comparisons, and expert guides for the tools that matter.</p>
        </div>
      </section>

      <section className="section">
        <div className="container container--narrow">
          <div style={{ display: 'grid', gap: 'var(--space-12)' }}>

            {/* Mission */}
            <div>
              <div className="section__label">// Our Mission</div>
              <h2 className="section__title" style={{ marginBottom: 'var(--space-6)' }}>Empowering Your Tech Decisions</h2>
              <div style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: 'var(--fs-md)', display: 'grid', gap: 'var(--space-4)' }}>
                <p>
                  In a world saturated with sponsored posts and pay-to-play reviews, <strong style={{ color: 'var(--text-primary)' }}>TechNova AI</strong> was founded on one principle: <em>radical honesty</em>. We believe developers, creators, and business leaders deserve transparent, hands-on evaluations of the tools that shape their work — not corporate press releases disguised as reviews.
                </p>
                <p>
                  Every article we publish is based on weeks of real-world testing. We buy our own subscriptions, build real projects, and push tools to their breaking points before giving our verdict. If a product has flaws, we will tell you. If a free alternative outperforms a $50/month subscription, we will tell you that too.
                </p>
                <p>
                  Our mission is to be the most trusted resource for AI tools, developer software, productivity apps, cybersecurity solutions, and everything in between. Whether you're a solo developer choosing your next code editor or a CTO evaluating enterprise platforms, TechNova AI has the analysis you need to make confident decisions.
                </p>
              </div>
            </div>

            {/* What We Cover */}
            <div>
              <div className="section__label">// Coverage</div>
              <h2 className="section__title" style={{ marginBottom: 'var(--space-6)' }}>What We Cover</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--space-4)' }}>
                {[
                  { icon: '🤖', title: 'AI Tools', desc: 'From ChatGPT to open-source LLMs, we test every major AI platform.' },
                  { icon: '💻', title: 'Dev Tools', desc: 'Code editors, frameworks, CI/CD pipelines, and developer infrastructure.' },
                  { icon: '⚡', title: 'Productivity', desc: 'Project management, note-taking, automation, and collaboration tools.' },
                  { icon: '🎨', title: 'Design', desc: 'UI/UX platforms, image generators, prototyping, and creative software.' },
                  { icon: '🛡️', title: 'Security', desc: 'VPNs, password managers, encryption tools, and privacy solutions.' },
                  { icon: '☁️', title: 'Cloud & SaaS', desc: 'Cloud platforms, hosting, serverless, and business SaaS tools.' },
                ].map((item) => (
                  <div key={item.title} style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-card)',
                    borderRadius: 'var(--radius-lg)',
                    padding: 'var(--space-6)',
                  }}>
                    <div style={{ fontSize: '2rem', marginBottom: 'var(--space-3)' }}>{item.icon}</div>
                    <h3 style={{ fontSize: 'var(--fs-lg)', marginBottom: 'var(--space-2)' }}>{item.title}</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--fs-sm)', lineHeight: 1.6 }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Our Approach */}
            <div>
              <div className="section__label">// Our Approach</div>
              <h2 className="section__title" style={{ marginBottom: 'var(--space-6)' }}>How We Review</h2>
              <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
                {[
                  { step: '01', title: 'Hands-On Testing', desc: 'We use every tool in real-world workflows for at least two weeks before writing a single word.' },
                  { step: '02', title: 'Transparent Scoring', desc: 'Our rating breakdown covers performance, usability, pricing, and support — no hidden criteria.' },
                  { step: '03', title: 'Head-to-Head Comparisons', desc: 'When tools compete, we run them side-by-side on identical tasks to give you a clear winner.' },
                  { step: '04', title: 'Regular Updates', desc: 'Tech evolves fast. We revisit and update our reviews quarterly to keep recommendations current.' },
                ].map((item) => (
                  <div key={item.step} style={{
                    display: 'flex',
                    gap: 'var(--space-5)',
                    alignItems: 'flex-start',
                    padding: 'var(--space-5)',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-card)',
                    borderRadius: 'var(--radius-lg)',
                  }}>
                    <div style={{
                      fontSize: 'var(--fs-2xl)',
                      fontWeight: 800,
                      color: 'var(--color-primary)',
                      fontFamily: 'var(--font-mono)',
                      minWidth: '3rem',
                    }}>{item.step}</div>
                    <div>
                      <h3 style={{ fontSize: 'var(--fs-lg)', marginBottom: 'var(--space-1)' }}>{item.title}</h3>
                      <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div id="contactForm">
              <div className="section__label">// Get in Touch</div>
              <h2 className="section__title" style={{ marginBottom: 'var(--space-6)' }}>Contact Us</h2>
              <div style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-card)',
                borderRadius: 'var(--radius-xl)',
                padding: 'var(--space-8)',
              }}>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-6)', lineHeight: 1.6 }}>
                  Have a question, want to submit a tool for review, or interested in advertising? Drop us a line.
                </p>
                <form style={{ display: 'grid', gap: 'var(--space-4)' }} action="#">
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
                    <input type="text" placeholder="Your Name" style={{
                      padding: 'var(--space-3) var(--space-4)',
                      background: 'var(--bg-input)',
                      border: '1px solid var(--border-card)',
                      borderRadius: 'var(--radius-md)',
                      color: 'var(--text-primary)',
                      fontSize: 'var(--fs-base)',
                    }} />
                    <input type="email" placeholder="Your Email" style={{
                      padding: 'var(--space-3) var(--space-4)',
                      background: 'var(--bg-input)',
                      border: '1px solid var(--border-card)',
                      borderRadius: 'var(--radius-md)',
                      color: 'var(--text-primary)',
                      fontSize: 'var(--fs-base)',
                    }} />
                  </div>
                  <select style={{
                    padding: 'var(--space-3) var(--space-4)',
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-card)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--text-secondary)',
                    fontSize: 'var(--fs-base)',
                  }}>
                    <option>Select a topic</option>
                    <option>Submit a Tool for Review</option>
                    <option>Advertising & Partnerships</option>
                    <option>Write for Us</option>
                    <option>Bug Report / Feedback</option>
                    <option>General Inquiry</option>
                  </select>
                  <textarea placeholder="Your Message" rows={5} style={{
                    padding: 'var(--space-3) var(--space-4)',
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-card)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--text-primary)',
                    fontSize: 'var(--fs-base)',
                    resize: 'vertical',
                  }} />
                  <button type="submit" style={{
                    padding: 'var(--space-3) var(--space-8)',
                    background: 'var(--gradient-primary)',
                    color: '#fff',
                    borderRadius: 'var(--radius-full)',
                    fontWeight: 600,
                    fontSize: 'var(--fs-md)',
                    cursor: 'pointer',
                    border: 'none',
                    justifySelf: 'start',
                  }}>
                    Send Message →
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
