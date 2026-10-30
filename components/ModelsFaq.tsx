'use client';

import { useState } from 'react';

export const FAQ_ITEMS = [
  {
    question: 'What is the difference between open-weights and true open-source AI?',
    answer:
      'True open-source (under OSI guidelines) provides the complete training code, original datasets, and architecture without restrictions. Most modern releases (like Meta Llama 3.3 or Mistral) are strictly "open-weights": the pre-trained neural network weights are publicly downloadable and self-hostable, but the raw training datasets and training pipelines are kept proprietary, often subject to acceptable-use licenses.',
  },
  {
    question: 'How do I run Hugging Face models locally on my computer for free?',
    answer:
      'The easiest method for beginners and developers is using Ollama or LM Studio. Both tools allow you to download, quantize, and execute models like Llama 3 or Mistral directly on your CPU/GPU with a single command or GUI, operating 100% offline with zero subscription fees or data telemetry.',
  },
  {
    question: 'What is model quantization (GGUF, AWQ, INT4) and does it hurt output quality?',
    answer:
      'Quantization reduces the precision of neural network weights from 16-bit floating point (FP16) to 8-bit, 4-bit, or even 2-bit integers. A 4-bit quantized model (e.g., GGUF Q4_K_M) reduces RAM and VRAM footprint by ~70% with negligible loss in reasoning ability (less than 1% perplexity difference in standard language benchmarks), enabling consumer GPUs to run models that previously required enterprise server racks.',
  },
  {
    question: 'Can I use open-source models like Llama 3 and Mistral for commercial products?',
    answer:
      'Yes, with license-specific considerations. Models licensed under Apache 2.0 or MIT (such as Mistral 7B, Qwen 2.5, and DeepSeek) permit unrestricted commercial deployment, modification, and integration into proprietary SaaS products. Meta Llama 3.3 uses the Llama Community License, which allows free commercial use for products with fewer than 700 million monthly active users.',
  },
  {
    question: 'How much GPU VRAM do I need to run a 70B parameter model?',
    answer:
      'At 16-bit unquantized precision, a 70B model requires ~140GB VRAM (two 80GB A100 GPUs). However, when quantized to 4-bit (GGUF Q4 or AWQ), the model fits within ~40GB to 48GB VRAM. This makes it runnable across two consumer RTX 3090/4090 GPUs (24GB each) or an Apple Mac with 64GB Unified Memory.',
  },
  {
    question: 'What is the difference between Ollama, LM Studio, and vLLM?',
    answer:
      'Ollama is an intuitive terminal CLI and lightweight local daemon ideal for local development and script automation. LM Studio provides a rich visual chat UI with a built-in Hugging Face model search and downloader. vLLM is an enterprise-grade inference engine with PagedAttention designed for high-concurrency production deployments serving multiple users simultaneously.',
  },
];

export default function ModelsFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex((curr) => (curr === idx ? null : idx));
  };

  return (
    <div style={{ marginBottom: 'var(--space-12)' }}>
      <div style={{ textAlign: 'left', marginBottom: 'var(--space-6)' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(99, 102, 241, 0.12)', color: 'var(--color-primary)', padding: '4px 10px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700, marginBottom: '8px' }}>
          <span>❓ Knowledge Hub</span>
        </div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 6px' }}>
          Frequently Asked Questions About Open-Source AI Models
        </h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0 }}>
          Everything you need to know about self-hosting, quantization formats, GPU hardware sizing, and commercial licensing.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {FAQ_ITEMS.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={item.question}
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-card)',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                transition: 'border-color 0.2s ease',
              }}
            >
              <button
                onClick={() => toggle(idx)}
                style={{
                  width: '100%',
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-primary)',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  textAlign: 'left',
                  cursor: 'pointer',
                  gap: '12px',
                }}
              >
                <span>{item.question}</span>
                <span
                  style={{
                    fontSize: '1.1rem',
                    color: 'var(--color-primary)',
                    transform: isOpen ? 'rotate(180deg)' : 'none',
                    transition: 'transform 0.2s ease',
                  }}
                >
                  ▾
                </span>
              </button>

              {isOpen && (
                <div
                  style={{
                    padding: '0 20px 18px',
                    fontSize: '0.88rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.6,
                    borderTop: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.04))',
                    paddingTop: '12px',
                  }}
                >
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

