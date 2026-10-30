'use client';

import { useState, useMemo } from 'react';

interface Preset {
  label: string;
  params: number; // in billions
  quant: string;
  context: number;
}

export default function VramCalculator() {
  const [params, setParams] = useState<number>(7);
  const [quant, setQuant] = useState<string>('q4');
  const [context, setContext] = useState<number>(8192);

  const paramOptions = [
    { value: 1, label: '1B (Ultra-light, Edge)' },
    { value: 3, label: '3B (Mobile / Small)' },
    { value: 7, label: '7B - 8B (Llama 3 / Mistral)' },
    { value: 14, label: '14B (Qwen / Phi-4)' },
    { value: 32, label: '32B (Qwen Coder / DeepSeek)' },
    { value: 70, label: '70B (Enterprise / Flagship)' },
    { value: 405, label: '405B (Frontier Class)' },
  ];

  const quantOptions = [
    { id: 'fp16', label: '16-bit (FP16/BF16 - Unquantized)', bytes: 2.0, loss: 'None (Full Precision)' },
    { id: 'q8', label: '8-bit (Q8_0 / INT8 - Near Lossless)', bytes: 1.05, loss: '< 0.5% Perplexity Loss' },
    { id: 'q4', label: '4-bit (Q4_K_M / GGUF - Recommended)', bytes: 0.56, loss: 'Minimal (~1% Loss)' },
    { id: 'q3', label: '3-bit (Q3_K_M - Ultra Compact)', bytes: 0.45, loss: 'Noticeable for Complex Reasoning' },
  ];

  const contextOptions = [
    { value: 2048, label: '2K tokens (Short Chat)' },
    { value: 4096, label: '4K tokens (Standard)' },
    { value: 8192, label: '8K tokens (Code & Articles)' },
    { value: 32768, label: '32K tokens (Long Documents)' },
    { value: 128000, label: '128K tokens (Full Agentic Context)' },
  ];

  const presets: Preset[] = [
    { label: 'Llama 3 8B (Consumer 4-bit)', params: 7, quant: 'q4', context: 8192 },
    { label: 'Mistral 7B (FP16 Full Quality)', params: 7, quant: 'fp16', context: 4096 },
    { label: 'Qwen 2.5 Coder 32B (Dev Workstation)', params: 32, quant: 'q4', context: 16384 },
    { label: 'Llama 3.3 70B (High-End GPU)', params: 70, quant: 'q4', context: 8192 },
  ];

  // Calculation logic
  const calculation = useMemo(() => {
    const selectedQuant = quantOptions.find((q) => q.id === quant) || quantOptions[2];
    const weightVram = params * selectedQuant.bytes;

    // Approximate KV Cache VRAM calculation
    // KV Cache = 2 * layers * hidden_dim * context * bytes (approx 0.00035 GB per 1k context for 7B, scales with params)
    const kvScaleFactor = Math.sqrt(params / 7);
    const kvCacheVram = (context / 1000) * 0.35 * kvScaleFactor * (quant === 'fp16' ? 1.0 : 0.6);

    // CUDA runtime + activation overhead (~15%)
    const overhead = (weightVram + kvCacheVram) * 0.15;
    const totalVram = Math.ceil((weightVram + kvCacheVram + overhead) * 10) / 10;

    // Hardware recommendations based on total VRAM
    let recommendedHardware = '';
    let hardwareTier = '';
    let runnerTip = '';

    if (totalVram <= 6) {
      hardwareTier = 'Entry-Level Consumer';
      recommendedHardware = 'NVIDIA RTX 3050 (6GB), RTX 2060, or Apple M1/M2/M3 with 8GB RAM';
      runnerTip = 'Runs smoothly on any modern laptop via Ollama or LM Studio.';
    } else if (totalVram <= 12) {
      hardwareTier = 'Mainstream Consumer GPU';
      recommendedHardware = 'NVIDIA RTX 3060 12GB, RTX 4070 12GB, or Apple Mac with 16GB Unified RAM';
      runnerTip = 'The sweet spot for local 7B/8B models with full speed and long context.';
    } else if (totalVram <= 24) {
      hardwareTier = 'Prosumer / High-End GPU';
      recommendedHardware = 'NVIDIA RTX 3090 24GB, RTX 4090 24GB, or Apple Mac with 32GB Unified RAM';
      runnerTip = 'Capable of running 14B-32B models at full speed and 70B models with heavy offloading.';
    } else if (totalVram <= 48) {
      hardwareTier = 'Dual-GPU / Studio Workstation';
      recommendedHardware = '2x RTX 3090/4090 (48GB Total) or Apple Mac Studio M2/M3 Ultra (64GB RAM)';
      runnerTip = 'Ideal for running 70B parameter models (Llama 3 70B) at 4-bit with fast token generation.';
    } else {
      hardwareTier = 'Datacenter / Multi-GPU Server';
      recommendedHardware = 'NVIDIA A100 (80GB), H100, or Mac Studio 128GB+';
      runnerTip = 'Requires enterprise server hardware or cloud GPU instances (RunPod, Lambda, Vast.ai).';
    }

    return {
      weightVram: weightVram.toFixed(1),
      kvCacheVram: kvCacheVram.toFixed(1),
      overhead: overhead.toFixed(1),
      totalVram: totalVram.toFixed(1),
      hardwareTier,
      recommendedHardware,
      runnerTip,
      loss: selectedQuant.loss,
    };
  }, [params, quant, context]);

  const applyPreset = (preset: Preset) => {
    setParams(preset.params);
    setQuant(preset.quant);
    setContext(preset.context);
  };

  return (
    <div
      id="calculator"
      style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-card)',
        borderRadius: 'var(--radius-xl)',
        padding: 'clamp(var(--space-6), 4vw, var(--space-8))',
        marginBottom: 'var(--space-12)',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.25)',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: 'var(--space-6)' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(99, 102, 241, 0.12)', color: 'var(--color-primary)', padding: '4px 10px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700, marginBottom: '8px' }}>
            <span>⚡ Interactive Hardware Tool</span>
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 6px' }}>
            LLM GPU & VRAM Requirements Estimator
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0, maxWidth: '680px' }}>
            Calculate exact VRAM memory needed to run open-weights models locally based on model parameter size, quantization precision (GGUF/AWQ), and context window length.
          </p>
        </div>

        {/* Quick Presets */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {presets.map((preset) => (
            <button
              key={preset.label}
              onClick={() => applyPreset(preset)}
              style={{
                fontSize: '0.75rem',
                padding: '6px 12px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-card, rgba(255, 255, 255, 0.04))',
                border: '1px solid var(--border-card)',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                fontWeight: 600,
                transition: 'all 0.15s ease',
              }}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Controls Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 'var(--space-6)',
          marginBottom: 'var(--space-8)',
          background: 'var(--bg-tertiary, rgba(255, 255, 255, 0.02))',
          padding: 'var(--space-6)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.05))',
        }}
      >
        {/* 1. Parameter Size */}
        <div>
          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
            1. Model Parameter Size
          </label>
          <select
            value={params}
            onChange={(e) => setParams(Number(e.target.value))}
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-card)',
              background: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              fontSize: '0.88rem',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            {paramOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
            Larger parameters provide deeper reasoning but demand more VRAM.
          </span>
        </div>

        {/* 2. Quantization Precision */}
        <div>
          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
            2. Quantization Precision (Bit-width)
          </label>
          <select
            value={quant}
            onChange={(e) => setQuant(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-card)',
              background: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              fontSize: '0.88rem',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            {quantOptions.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
          <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
            Impact: {calculation.loss}
          </span>
        </div>

        {/* 3. Context Length */}
        <div>
          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
            3. Context Window Length
          </label>
          <select
            value={context}
            onChange={(e) => setContext(Number(e.target.value))}
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-card)',
              background: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              fontSize: '0.88rem',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            {contextOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
            KV Cache expands dynamically as prompt tokens increase.
          </span>
        </div>
      </div>

      {/* Results Dashboard */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 'var(--space-6)',
          alignItems: 'center',
        }}
      >
        {/* Estimated VRAM Card */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(168, 85, 247, 0.12) 100%)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-6)',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-primary)', letterSpacing: '0.5px', marginBottom: '4px' }}>
            Total Recommended VRAM
          </div>
          <div style={{ fontSize: 'clamp(2.5rem, 5vw, 3.2rem)', fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1 }}>
            {calculation.totalVram} <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>GB</span>
          </div>

          {/* Breakdown bars */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '16px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            <div>Weights: <strong>{calculation.weightVram} GB</strong></div>
            <div>•</div>
            <div>KV Cache: <strong>{calculation.kvCacheVram} GB</strong></div>
            <div>•</div>
            <div>Overhead: <strong>{calculation.overhead} GB</strong></div>
          </div>
        </div>

        {/* Hardware Recommendation */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: '#10b981', letterSpacing: '0.5px' }}>
              Hardware Tier: {calculation.hardwareTier}
            </span>
            <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
              {calculation.recommendedHardware}
            </div>
          </div>

          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            💡 <strong>Deployment Recommendation:</strong> {calculation.runnerTip}
          </div>

          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', background: 'var(--bg-card)', padding: '8px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-card)' }}>
            ⚡ <strong>Pro Tip:</strong> On modern Apple Silicon Macs (Unified Memory), macOS allocates up to 75% of total system RAM to GPU VRAM automatically.
          </div>
        </div>
      </div>
    </div>
  );
}

