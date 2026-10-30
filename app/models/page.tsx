import type { Metadata } from 'next';
import Link from 'next/link';
import { getTrendingModels, FAQ_ITEMS } from '@/lib/huggingface';
import { getLiveArticles } from '@/lib/public-data';
import { getArticleImage } from '@/lib/utils';
import ModelsDirectoryClient from '@/components/ModelsDirectoryClient';
import VramCalculator from '@/components/VramCalculator';
import EditorModelPicks from '@/components/EditorModelPicks';
import ModelComparisonTable from '@/components/ModelComparisonTable';
import ModelGlossary from '@/components/ModelGlossary';
import ModelsFaq from '@/components/ModelsFaq';

export const revalidate = 3600; // Revalidate every hour via Next.js ISR

export const metadata: Metadata = {
  title: 'Open-Source AI Models Hub & VRAM Calculator',
  description:
    'Discover trending open-source AI models from Hugging Face, calculate GPU VRAM requirements, and deploy weights locally with Ollama and Transformers.',
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
    'local AI benchmarks',
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
  const [models, allArticles] = await Promise.all([
    getTrendingModels(),
    getLiveArticles(),
  ]);

  const relevantArticleIds = [
    'local-llms-guide-2026',
    'claude-3-opus-vs-gpt4-coding',
    'github-copilot-vs-cursor',
    'beginner-guide-machine-learning-python',
  ];

  const relatedArticles = allArticles.filter(a => relevantArticleIds.includes(a.id));
  if (relatedArticles.length < 4) {
    const aiArticles = allArticles.filter(
      a => a.category === 'ai-tools' || a.category === 'machine-learning' || a.category === 'programming'
    );
    for (const art of aiArticles) {
      if (!relatedArticles.some(r => r.id === art.id) && relatedArticles.length < 4) {
        relatedArticles.push(art);
      }
    }
  }

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

      <main style={{ minHeight: '80vh', paddingBottom: 'var(--space-16)' }}>
        {/* Hero Section with Generous Fixed-Navbar Offset and Glowing Radial Backdrop */}
        <section className="models-hero">
          <div className="container models-hero__inner">
            {/* Breadcrumb Navigation */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.85rem',
                color: 'var(--text-secondary)',
                marginBottom: '16px',
              }}
            >
              <Link href="/" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
                Home
              </Link>
              <span style={{ color: 'var(--text-tertiary)' }}>/</span>
              <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>AI Models Hub</span>
            </div>

            {/* Glowing Hero Badge */}
            <div>
              <div className="models-hero__badge">
                <span>⚡ Live Open-Source AI Intelligence & Radar</span>
              </div>
            </div>

            {/* Primary H1 */}
            <h1
              style={{
                fontSize: 'clamp(2.1rem, 4.5vw, 3.1rem)',
                fontWeight: 900,
                color: 'var(--text-primary)',
                lineHeight: 1.15,
                marginBottom: '16px',
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
                margin: '0 auto 24px',
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
              <a href="#calculator" className="models-jump-pill models-jump-pill--active">
                📊 VRAM Calculator
              </a>
              <a href="#picks" className="models-jump-pill">
                ⭐ Editor&apos;s Choice
              </a>
              <a href="#comparison" className="models-jump-pill">
                📋 Benchmark Matrix
              </a>
              <a href="#models-list" className="models-jump-pill">
                🌐 Trending Models
              </a>
              <a href="#guide" className="models-jump-pill">
                📖 Deployment Guide
              </a>
              <a href="#glossary" className="models-jump-pill">
                📚 AI Glossary
              </a>
              <a href="#faq" className="models-jump-pill">
                ❓ FAQs
              </a>
            </div>
          </div>
        </section>

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

          {/* 6. Technical Glossary & Concepts (Massive SEO Value) */}
          <ModelGlossary />

          {/* 7. Frequently Asked Questions with Schema Markup */}
          <ModelsFaq />

          {/* 8. Practical Guide: How to Run These Models Locally */}
          <section id="local-guide" className="models-local-guide" style={{ marginTop: 'var(--space-12)' }}>
            <div className="section__header" style={{ marginBottom: 'var(--space-6)' }}>
              <div>
                <div className="section__label">// Practical Engineering Guide</div>
                <h2 className="section__title" style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)' }}>
                  How to Run These AI Models Locally to Unlock Their Full Power
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginTop: 'var(--space-2)', maxWidth: '780px', lineHeight: 1.6 }}>
                  Running open-weights models on your own PC, workstation, or Mac gives you complete data privacy, eliminates monthly subscription fees, and allows offline reasoning without rate limits. Here is how to run and benefit from these models in 3 practical steps:
                </p>
              </div>
            </div>

            {/* Why Run Locally Benefit Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: 'var(--radius-lg)', padding: '18px' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>🛡️</div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0 0 6px', color: 'var(--text-primary)' }}>100% Private &amp; Confidential</h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                  Your proprietary code, sensitive business data, and personal prompts stay strictly on your local disk and are never uploaded to external cloud servers.
                </p>
              </div>

              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: 'var(--radius-lg)', padding: '18px' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>💰</div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0 0 6px', color: 'var(--text-primary)' }}>Zero Subscription Fees</h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                  Eliminate recurring $20/month AI subscriptions and token billing. Once downloaded, you can run billions of tokens completely free forever.
                </p>
              </div>

              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: 'var(--radius-lg)', padding: '18px' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>⚡</div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0 0 6px', color: 'var(--text-primary)' }}>Offline &amp; Low Latency</h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                  Works seamlessly without any internet connection. Enjoy immediate token generation without cloud network queue delays or downtime.
                </p>
              </div>

              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: 'var(--radius-lg)', padding: '18px' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>🔧</div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0 0 6px', color: 'var(--text-primary)' }}>Unlimited Customization</h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                  Fine-tune parameters, adjust context windows, set custom system prompts, and connect models into your local IDE as private coding assistants.
                </p>
              </div>
            </div>

            {/* Step-by-Step Execution Workflow */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-6)', marginBottom: 'var(--space-10)' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 'var(--space-4)' }}>
                3-Step Execution: How to Deploy and Run Today
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--space-6)' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span style={{ background: 'rgba(99, 102, 241, 0.15)', color: 'var(--color-primary-light)', padding: '2px 8px', borderRadius: '4px', fontWeight: 800, fontSize: '0.75rem' }}>STEP 1</span>
                    <strong style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>Install Local Engine</strong>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    Download <strong>Ollama</strong> (macOS, Windows, Linux) or <strong>LM Studio</strong>. They manage GPU memory offloading, Apple Silicon Metal acceleration, and NVIDIA CUDA drivers automatically.
                  </p>
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span style={{ background: 'rgba(99, 102, 241, 0.15)', color: 'var(--color-primary-light)', padding: '2px 8px', borderRadius: '4px', fontWeight: 800, fontSize: '0.75rem' }}>STEP 2</span>
                    <strong style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>Pull &amp; Execute Weights</strong>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '6px' }}>
                    Open your terminal and run your desired model checkpoint (e.g. 4-bit quantized Llama 3 or DeepSeek):
                  </p>
                  <pre style={{ background: 'rgba(0, 0, 0, 0.45)', padding: '8px 12px', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem', color: '#34D399', overflowX: 'auto', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <code>ollama run llama3.3:8b</code>
                  </pre>
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span style={{ background: 'rgba(99, 102, 241, 0.15)', color: 'var(--color-primary-light)', padding: '2px 8px', borderRadius: '4px', fontWeight: 800, fontSize: '0.75rem' }}>STEP 3</span>
                    <strong style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>Connect to WebUI or IDE</strong>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    Connect <strong>Open WebUI</strong> for a polished ChatGPT-like browser interface, or point <strong>Cursor / VS Code</strong> to <code>http://localhost:11434/v1</code> for zero-latency private coding.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 9. Related Articles & Deep Dives (Contextual Internal Linking) */}
          <section className="models-related-articles" style={{ marginTop: 'var(--space-8)', marginBottom: 'var(--space-12)' }}>
            <div className="section__header" style={{ marginBottom: 'var(--space-6)' }}>
              <div>
                <div className="section__label">// From Our Blog &amp; Tech Guides</div>
                <h2 className="section__title" style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)' }}>
                  Related Articles &amp; Practical Guides
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: 'var(--space-1)' }}>
                  Explore in-depth hardware setups, prompt techniques, and AI development workflows.
                </p>
              </div>
              <Link href="/category" className="section__link">View All Articles →</Link>
            </div>

            <div className="cards-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
              {relatedArticles.map(article => (
                <Link key={article.id} href={`/article/${article.id}`} className="article-card" style={{ display: 'flex', flexDirection: 'column' }}>
                  <div className="article-card__image-container">
                    <img
                      src={getArticleImage(article)}
                      alt={article.title}
                      className="article-card__image"
                      loading="lazy"
                    />
                    <div className="article-card__category">{article.category}</div>
                  </div>
                  <div className="article-card__content" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div className="article-card__meta">
                      <span>⏱️ {article.readTime}</span>
                      <span>{article.date}</span>
                    </div>
                    <h3 className="article-card__title" style={{ fontSize: '1.02rem', lineHeight: 1.35, marginBottom: '8px' }}>
                      {article.title}
                    </h3>
                    <p className="article-card__excerpt" style={{ fontSize: '0.82rem', lineHeight: 1.45, flex: 1 }}>
                      {article.excerpt}
                    </p>
                    <div style={{ marginTop: 'var(--space-3)', fontSize: '0.82rem', color: 'var(--color-primary-light)', fontWeight: 600 }}>
                      Read Guide →
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
