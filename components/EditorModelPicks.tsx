'use client';

interface PickItem {
  badge: string;
  badgeColor: string;
  title: string;
  modelId: string;
  author: string;
  license: string;
  params: string;
  verdict: string;
  bestFor: string;
  vram: string;
}

export default function EditorModelPicks() {
  const picks: PickItem[] = [
    {
      badge: '🏆 Best Overall Flagship',
      badgeColor: '#6366f1',
      title: 'Llama 3.3 70B Instruct',
      modelId: 'meta-llama/Llama-3.3-70B-Instruct',
      author: 'Meta AI',
      license: 'Llama 3.3 Community',
      params: '70 Billion',
      verdict: 'Delivers frontier-level general intelligence and tool-calling on par with proprietary commercial models while maintaining 128K context.',
      bestFor: 'Production agent workflows, complex enterprise reasoning, and high-accuracy chat.',
      vram: '~40GB VRAM (4-bit Q4) / Dual RTX 3090/4090',
    },
    {
      badge: '🧠 Best Open Reasoning',
      badgeColor: '#ec4899',
      title: 'DeepSeek-V3 / R1',
      modelId: 'deepseek-ai/DeepSeek-V3',
      author: 'DeepSeek AI',
      license: 'MIT (Permissive)',
      params: '671B Total (37B Active MoE)',
      verdict: 'Revolutionary Mixture-of-Experts architecture delivering unprecedented math and logical reasoning efficiency with ultra-low inference costs.',
      bestFor: 'Mathematical problem-solving, algorithmic synthesis, and competitive coding benchmarks.',
      vram: 'Requires multi-GPU cluster or high-memory Apple Studio (MoE offloading)',
    },
    {
      badge: '💻 Best for Code & Engineering',
      badgeColor: '#0ea5e9',
      title: 'Qwen 2.5 Coder 32B Instruct',
      modelId: 'Qwen/Qwen2.5-Coder-32B-Instruct',
      author: 'Alibaba Qwen Team',
      license: 'Apache 2.0',
      params: '32 Billion',
      verdict: 'Consistently outperforms larger models on HumanEval and SWE-bench. The gold standard for self-hosted AI pair programming.',
      bestFor: 'VS Code/Cursor backend, multi-file code editing, and automated unit test generation.',
      vram: '~18GB VRAM (4-bit) / Single RTX 3090 or RTX 4090',
    },
    {
      badge: '⚡ Best Lightweight Local',
      badgeColor: '#10b981',
      title: 'Mistral 7B Instruct v0.3',
      modelId: 'mistralai/Mistral-7B-Instruct-v0.3',
      author: 'Mistral AI',
      license: 'Apache 2.0',
      params: '7.3 Billion',
      verdict: 'Ultra-fast, natively supports function calling, and fits entirely inside consumer laptops with just 6GB VRAM.',
      bestFor: 'Local private assistants, edge devices, and rapid offline text summarization.',
      vram: '~6GB VRAM (4-bit GGUF) / Any RTX 3060 or Apple M-series 16GB',
    },
  ];

  return (
    <div id="picks" style={{ marginBottom: 'var(--space-12)' }}>
      <div style={{ textAlign: 'left', marginBottom: 'var(--space-6)' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(234, 179, 8, 0.12)', color: '#eab308', padding: '4px 10px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700, marginBottom: '8px' }}>
          <span>⭐ TechNova Editorial Curation</span>
        </div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 6px' }}>
          Editor&apos;s Best-in-Class Open-Source AI Models
        </h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0, maxWidth: '720px' }}>
          Our independent technology team evaluates model weights across rigorous reasoning benchmarks, real-world coding challenges, hardware efficiency, and commercial licensing terms.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))',
          gap: 'var(--space-6)',
        }}
      >
        {picks.map((pick) => (
          <div
            key={pick.modelId}
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-card)',
              borderRadius: 'var(--radius-xl)',
              padding: 'var(--space-6)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Top Badge */}
            <div>
              <div
                style={{
                  display: 'inline-block',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: pick.badgeColor,
                  background: `${pick.badgeColor}18`,
                  padding: '3px 10px',
                  borderRadius: '999px',
                  marginBottom: '12px',
                }}
              >
                {pick.badge}
              </div>

              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 4px' }}>
                {pick.title}
              </h3>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                By <strong>{pick.author}</strong> • License: <strong>{pick.license}</strong>
              </div>

              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '14px' }}>
                {pick.verdict}
              </p>
            </div>

            {/* Spec Details */}
            <div
              style={{
                background: 'var(--bg-tertiary, rgba(255, 255, 255, 0.02))',
                borderRadius: 'var(--radius-md)',
                padding: '10px 12px',
                border: '1px solid var(--border-card)',
                fontSize: '0.75rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
              }}
            >
              <div>
                <span style={{ color: 'var(--text-secondary)' }}>🎯 Best For: </span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{pick.bestFor}</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-secondary)' }}>🖥️ Hardware: </span>
                <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{pick.vram}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

