import type { Metadata } from 'next';
import { getTrendingModels } from '@/lib/huggingface';
import ModelsDirectoryClient from '@/components/ModelsDirectoryClient';

export const revalidate = 3600; // Revalidate every hour via Next.js ISR

export const metadata: Metadata = {
  title: 'Trending Open-Source AI Models Directory',
  description:
    'Explore top trending open-source AI models, LLMs, vision, and audio checkpoints from Hugging Face. Live download counts, community likes, and direct access.',
  alternates: {
    canonical: 'https://www.technova-ai.online/models',
  },
  openGraph: {
    title: 'Trending Open-Source AI Models Directory | TechNova AI',
    description:
      'Explore top trending open-source AI models, LLMs, vision, and audio checkpoints from Hugging Face. Live download counts, community likes, and direct access.',
    url: 'https://www.technova-ai.online/models',
    siteName: 'TechNova AI',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Trending Open-Source AI Models Directory | TechNova AI',
    description:
      'Explore top trending open-source AI models, LLMs, vision, and audio checkpoints from Hugging Face.',
  },
};

export default async function ModelsPage() {
  const models = await getTrendingModels();

  return (
    <main style={{ minHeight: '80vh', padding: 'var(--space-8) 0 var(--space-16)' }}>
      {/* Hero Header */}
      <div
        className="container"
        style={{
          textAlign: 'center',
          maxWidth: '820px',
          margin: '0 auto var(--space-10)',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: '999px',
            background: 'rgba(99, 102, 241, 0.1)',
            border: '1px solid rgba(99, 102, 241, 0.25)',
            color: 'var(--color-primary)',
            fontSize: '0.82rem',
            fontWeight: 600,
            marginBottom: 'var(--space-4)',
          }}
        >
          <span>⚡ Live Open-Source Ecosystem</span>
        </div>

        <h1
          style={{
            fontSize: 'clamp(2rem, 4vw, 2.75rem)',
            fontWeight: 800,
            color: 'var(--text-primary)',
            lineHeight: 1.2,
            marginBottom: 'var(--space-4)',
          }}
        >
          Trending Open-Source AI Models
        </h1>

        <p
          style={{
            fontSize: '1.05rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
            margin: '0 auto',
          }}
        >
          Track the most popular, emerging, and downloaded open-source model weights, LLMs, vision architectures, and audio tools from the global AI community.
        </p>
      </div>

      {/* Directory Client (Search, Filters, Sort, and Cards Grid) */}
      <ModelsDirectoryClient initialModels={models} />
    </main>
  );
}

