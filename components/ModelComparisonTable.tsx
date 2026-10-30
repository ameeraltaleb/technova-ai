'use client';

interface ModelRow {
  name: string;
  creator: string;
  architecture: 'Dense' | 'MoE';
  params: string;
  context: string;
  benchmarks: {
    mmluPro: string;
    humanEval: string;
  };
  license: string;
  minVram: string;
  primaryUse: string;
}

export default function ModelComparisonTable() {
  const models: ModelRow[] = [
    {
      name: 'Llama 3.3 70B Instruct',
      creator: 'Meta AI',
      architecture: 'Dense',
      params: '70B',
      context: '128K tokens',
      benchmarks: { mmluPro: '68.5%', humanEval: '82.3%' },
      license: 'Llama 3.3 Community',
      minVram: '40GB (Q4) / 140GB (FP16)',
      primaryUse: 'General Intelligence, Enterprise Agents & Multi-turn Chat',
    },
    {
      name: 'DeepSeek-V3 / R1',
      creator: 'DeepSeek AI',
      architecture: 'MoE',
      params: '671B (37B Active)',
      context: '128K tokens',
      benchmarks: { mmluPro: '75.2%', humanEval: '88.6%' },
      license: 'MIT (Permissive)',
      minVram: 'Dual/Multi-GPU cluster or Unified Mac',
      primaryUse: 'Advanced Math, Deep Reasoning & Complex Problem Solving',
    },
    {
      name: 'Qwen 2.5 Coder 32B Instruct',
      creator: 'Alibaba Qwen',
      architecture: 'Dense',
      params: '32.5B',
      context: '128K tokens',
      benchmarks: { mmluPro: '64.1%', humanEval: '92.7%' },
      license: 'Apache 2.0',
      minVram: '18GB (Q4) / 65GB (FP16)',
      primaryUse: 'Autonomous Coding, Code Completion & Unit Test Generation',
    },
    {
      name: 'Mistral 7B Instruct v0.3',
      creator: 'Mistral AI',
      architecture: 'Dense',
      params: '7.3B',
      context: '32K tokens',
      benchmarks: { mmluPro: '48.2%', humanEval: '62.5%' },
      license: 'Apache 2.0',
      minVram: '6GB (Q4) / 15GB (FP16)',
      primaryUse: 'Local Laptop Assistants, Edge Devices & Offline Summarization',
    },
    {
      name: 'Gemma 2 27B Instruct',
      creator: 'Google DeepMind',
      architecture: 'Dense',
      params: '27.2B',
      context: '8K tokens',
      benchmarks: { mmluPro: '61.8%', humanEval: '74.4%' },
      license: 'Gemma Terms of Use',
      minVram: '16GB (Q4) / 55GB (FP16)',
      primaryUse: 'Academic Research, High-accuracy Instruction Following',
    },
    {
      name: 'Phi-4 14B',
      creator: 'Microsoft Research',
      architecture: 'Dense',
      params: '14B',
      context: '16K tokens',
      benchmarks: { mmluPro: '62.4%', humanEval: '80.2%' },
      license: 'MIT',
      minVram: '9GB (Q4) / 28GB (FP16)',
      primaryUse: 'Synthetic Data Reasoning, High-density Logic on Mid-tier GPUs',
    },
  ];

  return (
    <div id="comparison" style={{ marginBottom: 'var(--space-12)' }}>
      <div style={{ textAlign: 'left', marginBottom: 'var(--space-6)' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(99, 102, 241, 0.12)', color: 'var(--color-primary)', padding: '4px 10px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700, marginBottom: '8px' }}>
          <span>📊 Technical Benchmark Matrix</span>
        </div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 6px' }}>
          Flagship Open-Source Models: Architectural & Benchmark Comparison
        </h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0, maxWidth: '780px' }}>
          Side-by-side technical evaluation of leading open-weights models comparing parameter footprint, context capacity, coding benchmarks, and licensing rights.
        </p>
      </div>

      <div
        style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-card)',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
        }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              textAlign: 'left',
              fontSize: '0.85rem',
              minWidth: '850px',
            }}
          >
            <thead>
              <tr
                style={{
                  background: 'var(--bg-tertiary, rgba(255, 255, 255, 0.03))',
                  borderBottom: '1px solid var(--border-card)',
                }}
              >
                <th style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--text-primary)' }}>Model & Creator</th>
                <th style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--text-primary)' }}>Arch & Size</th>
                <th style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--text-primary)' }}>Context</th>
                <th style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--text-primary)' }}>MMLU-Pro</th>
                <th style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--text-primary)' }}>HumanEval</th>
                <th style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--text-primary)' }}>Min VRAM (Q4)</th>
                <th style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--text-primary)' }}>License</th>
              </tr>
            </thead>
            <tbody>
              {models.map((m, idx) => (
                <tr
                  key={m.name}
                  style={{
                    borderBottom: idx !== models.length - 1 ? '1px solid var(--border-subtle, rgba(255, 255, 255, 0.04))' : 'none',
                    transition: 'background 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(99, 102, 241, 0.04)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{m.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{m.creator}</div>
                  </td>

                  <td style={{ padding: '14px 16px' }}>
                    <span
                      style={{
                        padding: '2px 8px',
                        borderRadius: '4px',
                        background: m.architecture === 'MoE' ? 'rgba(236, 72, 153, 0.15)' : 'rgba(99, 102, 241, 0.15)',
                        color: m.architecture === 'MoE' ? '#ec4899' : 'var(--color-primary)',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                      }}
                    >
                      {m.architecture}
                    </span>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>{m.params}</div>
                  </td>

                  <td style={{ padding: '14px 16px', color: 'var(--text-secondary)', fontWeight: 600 }}>{m.context}</td>

                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{m.benchmarks.mmluPro}</span>
                  </td>

                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ fontWeight: 700, color: '#10b981' }}>{m.benchmarks.humanEval}</span>
                  </td>

                  <td style={{ padding: '14px 16px', color: 'var(--color-primary)', fontWeight: 600 }}>{m.minVram}</td>

                  <td style={{ padding: '14px 16px' }}>
                    <span
                      style={{
                        padding: '2px 8px',
                        borderRadius: '4px',
                        background: m.license.includes('Apache') || m.license.includes('MIT') ? 'rgba(16, 185, 129, 0.12)' : 'rgba(234, 179, 8, 0.12)',
                        color: m.license.includes('Apache') || m.license.includes('MIT') ? '#10b981' : '#eab308',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                      }}
                    >
                      {m.license}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

