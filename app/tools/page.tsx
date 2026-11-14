import { getLiveTools } from '@/lib/public-data';
import Link from 'next/link';
import ToolsDirectoryClient from '@/components/ToolsDirectoryClient';
import AdSlot from '@/components/AdSlot';

export const revalidate = 3600;

export const metadata = {
  title: 'Best AI Tools Directory & Enterprise SaaS Reviews (2026)',
  description:
    'Explore our independently tested directory of the best AI tools, developer copilots, cybersecurity platforms, and productivity software in 2026.',
  alternates: {
    canonical: 'https://www.technova-ai.online/tools',
  },
};

export default async function ToolsPage() {
  const tools = await getLiveTools();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://www.technova-ai.online',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'AI Tools Directory',
            item: 'https://www.technova-ai.online/tools',
          },
        ],
      },
      {
        '@type': 'ItemList',
        name: 'Best AI Tools & Developer Software Directory (2026)',
        itemListElement: tools.slice(0, 15).map((t, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: t.name,
          description: t.description,
          url: t.url,
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="category-hero">
        <div className="container">
          <div className="article__breadcrumb">
            <Link href="/">Home</Link> <span>/</span>
            <span>Tools Directory</span>
          </div>
          <div className="category-hero__icon" style={{ background: 'rgba(232, 67, 147, 0.15)', color: 'var(--color-secondary)' }}>⚡</div>
          <h1 className="category-hero__title">AI Tools &amp; Software Directory</h1>
          <p className="category-hero__description">
            An independently benchmarked directory of top-tier AI tools, developer IDEs, cybersecurity platforms, and enterprise productivity software.
          </p>
          <p className="category-hero__count">{tools.length} verified tools available</p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 'var(--space-6)' }}>
        <div className="container">
          <ToolsDirectoryClient initialTools={tools} />

          {/* High-CPC SaaS & Developer Tools Responsive Ad Unit */}
          <AdSlot format="auto" />

          {/* Editorial Evaluation Methodology & Buyer's Guide (AdSense & SEO Authority) */}
          <div
            style={{
              marginTop: 'var(--space-12)',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-card)',
              borderRadius: 'var(--radius-xl)',
              padding: 'clamp(var(--space-6), 4vw, var(--space-10))',
            }}
          >
            <div className="section__label" style={{ marginBottom: '8px' }}>
              // Editorial Software Evaluation Framework
            </div>
            <h2
              style={{
                fontSize: 'clamp(1.35rem, 2.5vw, 1.75rem)',
                fontWeight: 800,
                color: 'var(--text-primary)',
                marginBottom: 'var(--space-4)',
              }}
            >
              How TechNova AI Benchmarks Enterprise AI Tools &amp; SaaS Platforms
            </h2>
            <p
              style={{
                color: 'var(--text-secondary)',
                fontSize: '0.95rem',
                lineHeight: 1.7,
                marginBottom: 'var(--space-6)',
              }}
            >
              Every software platform listed in the TechNova AI directory undergoes hands-on engineering evaluation before inclusion. Unlike automated aggregators, our editorial team tests API latency, SOC2/HIPAA data privacy compliance, token cost efficiency, and real-world workflow integration.
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: 'var(--space-6)',
                marginBottom: 'var(--space-6)',
              }}
            >
              <div
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-card)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '18px',
                }}
              >
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
                  1. Security &amp; Zero-Data Retention
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.55, margin: 0 }}>
                  We verify whether AI coding assistants and enterprise copilots train on customer prompts by default, prioritizing platforms with strict zero-data retention (ZDR) and self-hosted VPC deployment options.
                </p>
              </div>

              <div
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-card)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '18px',
                }}
              >
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
                  2. Total Cost of Ownership (TCO)
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.55, margin: 0 }}>
                  Beyond base seat licenses, we audit API rate limits, overage token pricing, and GPU compute requirements so engineering leaders can forecast production costs accurately.
                </p>
              </div>

              <div
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-card)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '18px',
                }}
              >
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
                  3. Deep Benchmark Comparisons
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.55, margin: 0 }}>
                  Explore our full head-to-head lab reports on{' '}
                  <Link href="/article/top-10-ai-services-revolutionizing-the-tech-landscape-in-the-usa" style={{ color: 'var(--color-primary-light)', textDecoration: 'underline' }}>
                    US Enterprise AI Services
                  </Link>
                  ,{' '}
                  <Link href="/article/10-ai-models-for-video-generation-changing-content-creation" style={{ color: 'var(--color-primary-light)', textDecoration: 'underline' }}>
                    AI Video Generators
                  </Link>
                  , and{' '}
                  <Link href="/article/top-15-vpn-in-2026" style={{ color: 'var(--color-primary-light)', textDecoration: 'underline' }}>
                    Tested VPNs for 2026
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
