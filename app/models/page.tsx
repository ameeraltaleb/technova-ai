import type { Metadata } from 'next';
import Link from 'next/link';
import { getTrendingModels, FAQ_ITEMS } from '@/lib/huggingface';
import ModelsDirectoryClient from '@/components/ModelsDirectoryClient';
import VramCalculator from '@/components/VramCalculator';
import EditorModelPicks from '@/components/EditorModelPicks';
import ModelComparisonTable from '@/components/ModelComparisonTable';
import ModelsFaq from '@/components/ModelsFaq';

export const revalidate = 3600; // Revalidate every hour via Next.js ISR

export const metadata: Metadata = {
  title: 'Open-Source AI Models Hub & VRAM Calculator',
  description:
    'Track trending open-source AI models from Hugging Face, calculate GPU VRAM requirements, explore Editor’s Choice picks, and deploy weights locally with Ollama & Transformers.',
  keywords: [
    'open source AI models',
    'hugging face trending models',
    'LLM VRAM calculator',
    'run llama 3 locally',
    'deepseek v3 weights',
    'mistral 7b instruct',
    'qwen 2.5 coder',
    'ollama models directory',
    'open weights commercial licenses',
    'gguf quantization guide',
  ],
  alternates: {
    canonical: 'https://www.technova-ai.online/models',
  },
  openGraph: {
    title: 'Open-Source AI Models Hub & VRAM Calculator | TechNova AI',
    description:
      'Real-time Hugging Face tracking, interactive GPU VRAM estimator, editor picks, benchmark comparison, and deployment code snippets.',
    url: 'https://www.technova-ai.online/models',
    siteName: 'TechNova AI',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Open-Source AI Models Hub & VRAM Calculator | TechNova AI',
    description:
      'Real-time Hugging Face tracking, interactive GPU VRAM estimator, editor picks, and deployment code snippets.',
  },
};

export default async function ModelsPage() {
  const models = await getTrendingModels();

  // Structured Data (JSON-LD) for Google Rich Snippets & Knowledge Graph
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': 'https://www.technova-ai.online/models#webpage',
        url: 'https://www.technova-ai.online/models',
        name: 'Open-Source AI Models Hub & VRAM Calculator | TechNova AI',
        description:
          'Track trending open-source AI models from Hugging Face, calculate GPU VRAM requirements, and explore editor-curated picks.',
        isPartOf: {
          '@type': 'WebSite',
          '@id': 'https://www.technova-ai.online/#website',
          name: 'TechNova AI',
          url: 'https://www.technova-ai.online',
        },
      },
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
            name: 'Open-Source AI Models Hub',
            item: 'https://www.technova-ai.online/models',
          },
        ],
      },
      {
        '@type': 'SoftwareApplication',
        name: 'LLM GPU & VRAM Requirements Estimator',
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'All',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        description:
          'Interactive calculator for estimating GPU memory and VRAM requirements for running open-source LLMs locally across different quantization precisions.',
      },
      {
        '@type': 'FAQPage',
        mainEntity: FAQ_ITEMS.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      },
      {
        '@type': 'ItemList',
        name: 'Trending Open-Source AI Models',
        description: 'Top trending open-source model weights on Hugging Face.',
        itemListElement: models.slice(0, 10).map((m, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: m.id,
          url: `https://huggingface.co/${m.id}`,
        })),
      },
    ],
  };

  return (
    <>
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Main Container with generous top spacing to prevent navbar collision */}
      <main style={{ minHeight: '80vh', paddingTop: 'calc(var(--space-28) + 24px)', paddingBottom: 'var(--space-16)' }}>
        {/* Hero Section */}
        <div
          className="container"
          style={{
            textAlign: 'center',
            maxWidth: '880px',
            margin: '0 auto var(--space-10)',
          }}
        >
          {/* Breadcrumb Navigation */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              fontSize: '0.85rem',
              color: 'var(--text-secondary)',
              marginBottom: 'var(--space-4)',
            }}
          >
            <Link href="/" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
              Home
            </Link>
            <span style={{ color: 'var(--text-tertiary)' }}>/</span>
            <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>AI Models Hub</span>
          </div>

          {/* Glowing Hero Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              borderRadius: '999px',
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.15) 100%)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              color: 'var(--color-primary)',
              fontSize: '0.82rem',
              fontWeight: 700,
              marginBottom: 'var(--space-4)',
              boxShadow: '0 4px 16px rgba(99, 102, 241, 0.12)',
            }}
          >
            <span>⚡ Live Open-Source AI Intelligence & Radar</span>
          </div>

          {/* Primary H1 */}
          <h1
            style={{
              fontSize: 'clamp(2.1rem, 4.5vw, 3rem)',
              fontWeight: 900,
              color: 'var(--text-primary)',
              lineHeight: 1.15,
              marginBottom: 'var(--space-4)',
              letterSpacing: '-0.5px',
            }}
          >
            Open-Source AI Models Hub & Hardware Estimator
          </h1>

          {/* Hero Lead Paragraph */}
          <p
            style={{
              fontSize: '1.05rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              maxWidth: '720px',
              margin: '0 auto var(--space-6)',
            }}
          >
            Discover, benchmark, and deploy the world&apos;s leading open-weights language models, reasoning architectures, and vision checkpoints. Calculate exact GPU VRAM needs and run weights locally.
          </p>

          {/* Jump Navigation Pills */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            <a
              href="#calculator"
              style={{
                fontSize: '0.8rem',
                fontWeight: 600,
                padding: '6px 14px',
                borderRadius: '999px',
                background: 'rgba(99, 102, 241, 0.1)',
                border: '1px solid rgba(99, 102, 241, 0.25)',
                color: 'var(--color-primary)',
                textDecoration: 'none',
                transition: 'all 0.15s ease',
              }}
            >
              📊 VRAM Calculator
            </a>
            <a
              href="#picks"
              style={{
                fontSize: '0.8rem',
                fontWeight: 600,
                padding: '6px 14px',
                borderRadius: '999px',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-card)',
                color: 'var(--text-secondary)',
                textDecoration: 'none',
                transition: 'all 0.15s ease',
              }}
            >
              ⭐ Editor&apos;s Choice
            </a>
            <a
              href="#comparison"
              style={{
                fontSize: '0.8rem',
                fontWeight: 600,
                padding: '6px 14px',
                borderRadius: '999px',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-card)',
                color: 'var(--text-secondary)',
                textDecoration: 'none',
                transition: 'all 0.15s ease',
              }}
            >
              📋 Benchmark Matrix
            </a>
            <a
              href="#models-list"
              style={{
                fontSize: '0.8rem',
                fontWeight: 600,
                padding: '6px 14px',
                borderRadius: '999px',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-card)',
                color: 'var(--text-secondary)',
                textDecoration: 'none',
                transition: 'all 0.15s ease',
              }}
            >
              🌐 Trending Models
            </a>
            <a
              href="#guide"
              style={{
                fontSize: '0.8rem',
                fontWeight: 600,
                padding: '6px 14px',
                borderRadius: '999px',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-card)',
                color: 'var(--text-secondary)',
                textDecoration: 'none',
                transition: 'all 0.15s ease',
              }}
            >
              📖 Deployment Guide
            </a>
            <a
              href="#faq"
              style={{
                fontSize: '0.8rem',
                fontWeight: 600,
                padding: '6px 14px',
                borderRadius: '999px',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-card)',
                color: 'var(--text-secondary)',
                textDecoration: 'none',
                transition: 'all 0.15s ease',
              }}
            >
              ❓ FAQs
            </a>
          </div>
        </div>

        <div className="container">
          {/* 1. Editor's Curated Best-in-Class Picks */}
          <EditorModelPicks />

          {/* 2. Interactive VRAM & Hardware Calculator */}
          <VramCalculator />

          {/* 3. Comprehensive Model Comparison Matrix */}
          <ModelComparisonTable />

          {/* 4. Live Hugging Face Directory with Filters & Run Modal */}
          <div id="models-list" style={{ marginBottom: 'var(--space-12)' }}>
            <div style={{ textAlign: 'left', marginBottom: 'var(--space-6)' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'rgba(34, 197, 94, 0.12)',
                  color: '#22c55e',
                  padding: '4px 10px',
                  borderRadius: '999px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  marginBottom: '8px',
                }}
              >
                <span>🌐 Real-Time Community Checkpoints</span>
              </div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 6px' }}>
                Live Trending Open-Source Models
              </h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0 }}>
                Synced directly from Hugging Face every hour. Click <strong>&ldquo;⚡ Run&rdquo;</strong> on any model to get copy-paste CLI and Python code snippets.
              </p>
            </div>

            <ModelsDirectoryClient initialModels={models} />
          </div>

          {/* 5. Comprehensive Educational & Technical Guides (High SEO & AdSense Value) */}
          <section
            id="guide"
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-card)',
              borderRadius: 'var(--radius-xl)',
              padding: 'clamp(var(--space-6), 4vw, var(--space-10))',
              marginBottom: 'var(--space-12)',
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(99, 102, 241, 0.12)',
                color: 'var(--color-primary)',
                padding: '4px 10px',
                borderRadius: '999px',
                fontSize: '0.75rem',
                fontWeight: 700,
                marginBottom: '12px',
              }}
            >
              <span>📖 Technical Field Guide</span>
            </div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 'var(--space-6)' }}>
              Engineering Guide: Selecting, Sizing, and Deploying Open Models
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-8)' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
                  1. Dense vs. Mixture-of-Experts (MoE)
                </h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  Traditional models like <strong>Meta Llama 3</strong> use dense architectures where every parameter is activated for every token. In contrast, <strong>Mixture-of-Experts (MoE)</strong> models like <strong>DeepSeek-V3</strong> have hundreds of billions of total parameters, but only route input tokens through a small fraction (e.g. 37B active parameters) per forward pass. This yields frontier intelligence with drastically reduced computational FLOPs per generated token.
                </p>
              </div>

              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
                  2. Quantization: GGUF vs. AWQ vs. EXL2
                </h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  Quantization transforms 16-bit model weights into compact 4-bit or 8-bit representations. For local CPU and mixed GPU inference, <strong>GGUF</strong> (powered by llama.cpp) is the universal industry standard. For dedicated NVIDIA GPU production servers, <strong>AWQ (Activation-aware Weight Quantization)</strong> and <strong>EXL2</strong> preserve the highest accuracy at extreme memory efficiency, allowing 70B models to run on consumer hardware.
                </p>
              </div>

              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
                  3. Commercial Licensing: Apache 2.0 vs. Community
                </h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  Licensing governs whether you can safely embed model weights in commercial products. <strong>Apache 2.0</strong> and <strong>MIT</strong> (used by Mistral and Qwen) offer total freedom with zero royalties. <strong>Llama Community License</strong> grants free commercial rights up to 700M monthly active users, while proprietary fine-tunes may enforce non-commercial research-only clauses. Always verify license headers before enterprise deployment.
                </p>
              </div>
            </div>

            {/* Step-by-Step Practical Implementation Guide */}
            <div
              style={{
                marginTop: 'var(--space-8)',
                paddingTop: 'var(--space-8)',
                borderTop: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.05))',
              }}
            >
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 'var(--space-4)' }}>
                How to Run Open Models Locally in 3 Steps
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--space-6)' }}>
                <div
                  style={{
                    background: 'var(--bg-card, rgba(255, 255, 255, 0.02))',
                    padding: '16px',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--border-card)',
                  }}
                >
                  <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '4px' }}>
                    STEP 01
                  </div>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
                    Install Local Runtime
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                    Download <strong>Ollama</strong> (macOS/Windows/Linux) or <strong>LM Studio</strong>. These runtimes handle GPU offloading, Metal acceleration, and CUDA drivers automatically.
                  </p>
                </div>

                <div
                  style={{
                    background: 'var(--bg-card, rgba(255, 255, 255, 0.02))',
                    padding: '16px',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--border-card)',
                  }}
                >
                  <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '4px' }}>
                    STEP 02
                  </div>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
                    Pull Quantized Weights
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                    Run <code>ollama run llama3:8b</code> or select a 4-bit GGUF checkpoint. The weights download directly to your local drive with zero telemetry.
                  </p>
                </div>

                <div
                  style={{
                    background: 'var(--bg-card, rgba(255, 255, 255, 0.02))',
                    padding: '16px',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--border-card)',
                  }}
                >
                  <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '4px' }}>
                    STEP 03
                  </div>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
                    Connect to UI or IDE
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                    Integrate your local model with <strong>Open WebUI</strong> for ChatGPT-like chat, or point <strong>VS Code / Cursor</strong> to <code>http://localhost:11434/v1</code> for private coding.
                  </p>
                </div>
              </div>
            </div>

            {/* Editorial Benchmark & Testing Methodology */}
            <div
              style={{
                marginTop: 'var(--space-8)',
                padding: '16px 20px',
                borderRadius: 'var(--radius-lg)',
                background: 'rgba(99, 102, 241, 0.05)',
                border: '1px solid rgba(99, 102, 241, 0.2)',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
              }}
            >
              <span style={{ fontSize: '1.75rem' }}>🔬</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                  TechNova AI Testing & Verification Methodology
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  All benchmark figures (MMLU-Pro, HumanEval, GSM8K) cite official peer-reviewed technical reports and our internal test benches running on consumer NVIDIA RTX 4090 (24GB) and Apple Silicon M3 Max (64GB) workstations.
                </div>
              </div>
            </div>
          </section>

          {/* 6. Frequently Asked Questions with Schema Markup */}
          <ModelsFaq />
        </div>
      </main>
    </>
  );
}
