'use client';

interface GlossaryTerm {
  term: string;
  category: string;
  definition: string;
  example: string;
}

export default function ModelGlossary() {
  const terms: GlossaryTerm[] = [
    {
      term: 'Quantization (GGUF / AWQ)',
      category: 'Compression & Speed',
      definition:
        'The process of mapping high-precision 16-bit floating-point weights (FP16) down to 8-bit, 4-bit, or 2-bit representations. This slashes VRAM requirements by up to 70% while maintaining over 98% of baseline cognitive reasoning.',
      example: 'Running a 70B model in 4-bit GGUF on two consumer RTX 3090s instead of requiring a $30,000 server.',
    },
    {
      term: 'Mixture of Experts (MoE)',
      category: 'Model Architecture',
      definition:
        'An architectural paradigm where only a selected subset of neural parameters (experts) is activated for any given token, rather than firing all weights simultaneously.',
      example: 'DeepSeek-V3 has 671 billion total parameters, but only 37 billion active parameters participate in generating each token.',
    },
    {
      term: 'KV Cache (Key-Value Cache)',
      category: 'Memory Management',
      definition:
        'A dedicated section of GPU VRAM allocated to store past attention keys and values so the model does not have to recompute self-attention over preceding context tokens.',
      example: 'At 128K context, KV cache can consume up to 8GB to 16GB of additional VRAM beyond the static weight size.',
    },
    {
      term: 'Context Window (Token Horizon)',
      category: 'Capacity',
      definition:
        'The total token capacity (prompt + output) that an LLM can process in a single inference session without losing memory of earlier conversational turns or document excerpts.',
      example: '128,000 tokens accommodates approximately 300 pages of technical documentation or a complete code repository.',
    },
    {
      term: 'LoRA & QLoRA (Fine-Tuning)',
      category: 'Customization',
      definition:
        'Low-Rank Adaptation freezes base weights and trains lightweight auxiliary adapter rank matrices, allowing developers to specialize open models on domain data using consumer hardware.',
      example: 'Fine-tuning a custom medical or legal assistant in 3 hours on a single RTX 4090.',
    },
    {
      term: 'Tokens Per Second (TPS)',
      category: 'Throughput',
      definition:
        'The primary metric measuring generation speed. Human reading speed is approximately 5 to 7 tokens per second, while real-time coding assistants require 30+ TPS for a fluid developer experience.',
      example: 'vLLM and llama.cpp achieve 45+ TPS on quantized 8B models using consumer RTX GPUs.',
    },
  ];

  return (
    <section id="glossary" style={{ marginBottom: 'var(--space-12)' }}>
      <div style={{ textAlign: 'left', marginBottom: 'var(--space-6)' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(6, 182, 212, 0.12)', color: '#06b6d4', padding: '4px 10px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700, marginBottom: '8px' }}>
          <span>📚 Technical Glossary & Concepts</span>
        </div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 6px' }}>
          Open-Source AI & LLM Terminology Glossary
        </h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0, maxWidth: '750px' }}>
          Master the foundational engineering terms of local model execution, memory compression, and self-hosted inference.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 'var(--space-6)',
        }}
      >
        {terms.map((t) => (
          <div
            key={t.term}
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-card)',
              borderRadius: 'var(--radius-xl)',
              padding: 'var(--space-6)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
            }}
          >
            <div>
              <div
                style={{
                  display: 'inline-block',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: 'var(--color-primary)',
                  background: 'rgba(99, 102, 241, 0.1)',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  marginBottom: '8px',
                }}
              >
                {t.category}
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 8px' }}>
                {t.term}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.55, margin: '0 0 12px' }}>
                {t.definition}
              </p>
            </div>

            <div
              style={{
                fontSize: '0.78rem',
                color: 'var(--text-tertiary)',
                background: 'var(--bg-tertiary, rgba(255, 255, 255, 0.02))',
                padding: '8px 12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-card)',
              }}
            >
              💡 <strong>Real-World Example:</strong> {t.example}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

