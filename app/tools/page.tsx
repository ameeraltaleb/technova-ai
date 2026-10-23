import { getLiveTools } from '@/lib/public-data';
import Link from 'next/link';
import ToolsDirectoryClient from '@/components/ToolsDirectoryClient';

export const revalidate = 0;

export const metadata = {
  title: 'AI Tools Directory & Software Reviews — TechNova AI',
  description: 'Explore the curated directory of the best AI tools, developer software, and productivity platforms in 2026.',
};

export default async function ToolsPage() {
  const tools = await getLiveTools();
  return (
    <>
      <section className="category-hero">
        <div className="container">
          <div className="article__breadcrumb">
            <Link href="/">Home</Link> <span>/</span>
            <span>Tools Directory</span>
          </div>
          <div className="category-hero__icon" style={{ background: 'rgba(232, 67, 147, 0.15)', color: 'var(--color-secondary)' }}>⚡</div>
          <h1 className="category-hero__title">AI Tools Directory</h1>
          <p className="category-hero__description">The ultimate curated directory of top-tier AI software, tested and benchmarked.</p>
          <p className="category-hero__count">{tools.length} tools available</p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 'var(--space-6)' }}>
        <div className="container">
          <ToolsDirectoryClient initialTools={tools} />
        </div>
      </section>
    </>
  );
}
