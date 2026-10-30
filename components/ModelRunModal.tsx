'use client';

import { useState } from 'react';
import { HfModel } from '@/lib/huggingface';

interface ModelRunModalProps {
  model: HfModel | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ModelRunModal({ model, isOpen, onClose }: ModelRunModalProps) {
  const [activeTab, setActiveTab] = useState<'ollama' | 'python' | 'vllm'>('ollama');
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  if (!isOpen || !model) return null;

  // Clean identifier for Ollama (e.g. meta-llama/Llama-3-8B -> llama3:8b)
  const cleanId = model.id.toLowerCase();
  let ollamaName = cleanId.includes('llama-3') ? 'llama3' : cleanId.includes('mistral') ? 'mistral' : cleanId.includes('qwen') ? 'qwen2.5' : cleanId.includes('deepseek') ? 'deepseek-r1' : cleanId.split('/')[1] || cleanId;

  const ollamaSnippet = `# 1. Download and run locally via Ollama CLI
ollama run ${ollamaName}

# 2. Or query via local API (curl):
curl http://localhost:11434/api/generate -d '{
  "model": "${ollamaName}",
  "prompt": "Explain quantum computing in three bullet points"
}'`;

  const pythonSnippet = `from transformers import AutoModelForCausalLM, AutoTokenizer
import torch

model_id = "${model.id}"

# Load tokenizer and model in 4-bit / 8-bit precision for consumer hardware
tokenizer = AutoTokenizer.from_pretrained(model_id)
model = AutoModelForCausalLM.from_pretrained(
    model_id,
    device_map="auto",
    torch_dtype=torch.bfloat16,
    trust_remote_code=True
)

prompt = "Analyze the key architectural trade-offs in modern LLMs."
inputs = tokenizer(prompt, return_tensors="pt").to("cuda")
outputs = model.generate(**inputs, max_new_tokens=256, temperature=0.7)

print(tokenizer.decode(outputs[0], skip_special_tokens=True))`;

  const vllmSnippet = `# High-throughput production OpenAI-compatible server via vLLM
pip install vllm

python3 -m vllm.entrypoints.openai.api_server \\
    --model ${model.id} \\
    --port 8000 \\
    --gpu-memory-utilization 0.90 \\
    --max-model-len 8192

# Test with standard OpenAI client:
# base_url="http://localhost:8000/v1", api_key="token-abc"`;

  const getActiveCode = () => {
    if (activeTab === 'ollama') return ollamaSnippet;
    if (activeTab === 'python') return pythonSnippet;
    return vllmSnippet;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getActiveCode());
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-4)',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-card)',
          borderRadius: 'var(--radius-xl)',
          width: '100%',
          maxWidth: '680px',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 24px 48px rgba(0, 0, 0, 0.5)',
          padding: 'var(--space-6)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-4)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Quick Deployment Guide
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: '4px 0 0', wordBreak: 'break-word' }}>
              Run {model.id}
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.4rem',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              lineHeight: 1,
              padding: '4px',
            }}
          >
            ✕
          </button>
        </div>

        {/* Runner Selector Tabs */}
        <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-card)', paddingBottom: '8px' }}>
          <button
            onClick={() => setActiveTab('ollama')}
            style={{
              padding: '8px 14px',
              borderRadius: 'var(--radius-md)',
              background: activeTab === 'ollama' ? 'var(--color-primary)' : 'transparent',
              color: activeTab === 'ollama' ? '#fff' : 'var(--text-secondary)',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.85rem',
            }}
          >
            🦙 Ollama (Local CLI)
          </button>

          <button
            onClick={() => setActiveTab('python')}
            style={{
              padding: '8px 14px',
              borderRadius: 'var(--radius-md)',
              background: activeTab === 'python' ? 'var(--color-primary)' : 'transparent',
              color: activeTab === 'python' ? '#fff' : 'var(--text-secondary)',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.85rem',
            }}
          >
            🐍 Python (Transformers)
          </button>

          <button
            onClick={() => setActiveTab('vllm')}
            style={{
              padding: '8px 14px',
              borderRadius: 'var(--radius-md)',
              background: activeTab === 'vllm' ? 'var(--color-primary)' : 'transparent',
              color: activeTab === 'vllm' ? '#fff' : 'var(--text-secondary)',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.85rem',
            }}
          >
            🚀 vLLM (Production Server)
          </button>
        </div>

        {/* Code Snippet Box */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={handleCopy}
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              background: copiedSnippet ? '#22c55e' : 'rgba(255, 255, 255, 0.1)',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              zIndex: 2,
            }}
          >
            {copiedSnippet ? '✓ Copied!' : '📋 Copy Code'}
          </button>

          <pre
            style={{
              background: '#0d1117',
              border: '1px solid var(--border-card)',
              borderRadius: 'var(--radius-lg)',
              padding: '16px',
              color: '#e6edf3',
              fontSize: '0.82rem',
              fontFamily: 'var(--font-mono, monospace)',
              overflowX: 'auto',
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            <code>{getActiveCode()}</code>
          </pre>
        </div>

        {/* Footer Notes */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
          <span>💡 Need a GUI? Try <strong>LM Studio</strong> or <strong>Jan.ai</strong> for single-click installation.</span>
          <a
            href={`https://huggingface.co/${model.id}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none' }}
          >
            View Model Card ↗
          </a>
        </div>
      </div>
    </div>
  );
}

