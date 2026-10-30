export interface HfModel {
  id: string; // e.g. "meta-llama/Llama-3.3-70B-Instruct"
  author?: string;
  likes: number;
  downloads: number;
  pipeline_tag?: string;
  tags: string[];
  lastModified?: string;
  createdAt?: string;
}

// Fallback models in case of API rate-limiting or network issues during SSR/SSG
const FALLBACK_MODELS: HfModel[] = [
  {
    id: 'meta-llama/Llama-3.3-70B-Instruct',
    author: 'meta-llama',
    likes: 3820,
    downloads: 1420000,
    pipeline_tag: 'text-generation',
    tags: ['transformers', 'safetensors', 'llama', 'text-generation', 'conversational'],
    lastModified: '2026-01-15T10:00:00.000Z',
  },
  {
    id: 'deepseek-ai/DeepSeek-V3',
    author: 'deepseek-ai',
    likes: 4950,
    downloads: 2100000,
    pipeline_tag: 'text-generation',
    tags: ['transformers', 'safetensors', 'deepseek', 'text-generation', 'reasoning'],
    lastModified: '2026-01-20T12:00:00.000Z',
  },
  {
    id: 'black-forest-labs/FLUX.1-schnell',
    author: 'black-forest-labs',
    likes: 4210,
    downloads: 890000,
    pipeline_tag: 'text-to-image',
    tags: ['diffusers', 'flux', 'text-to-image', 'image-generation'],
    lastModified: '2025-12-10T14:30:00.000Z',
  },
  {
    id: 'mistralai/Mistral-7B-Instruct-v0.3',
    author: 'mistralai',
    likes: 3100,
    downloads: 1850000,
    pipeline_tag: 'text-generation',
    tags: ['transformers', 'mistral', 'text-generation', 'conversational'],
    lastModified: '2025-11-28T09:15:00.000Z',
  },
  {
    id: 'openai/whisper-large-v3-turbo',
    author: 'openai',
    likes: 2750,
    downloads: 1640000,
    pipeline_tag: 'automatic-speech-recognition',
    tags: ['transformers', 'whisper', 'audio', 'automatic-speech-recognition'],
    lastModified: '2025-10-05T16:20:00.000Z',
  },
  {
    id: 'Qwen/Qwen2.5-Coder-32B-Instruct',
    author: 'Qwen',
    likes: 2980,
    downloads: 720000,
    pipeline_tag: 'text-generation',
    tags: ['transformers', 'qwen', 'code', 'text-generation'],
    lastModified: '2026-01-12T11:45:00.000Z',
  },
  {
    id: 'stabilityai/stable-diffusion-3.5-large',
    author: 'stabilityai',
    likes: 3420,
    downloads: 980000,
    pipeline_tag: 'text-to-image',
    tags: ['diffusers', 'stable-diffusion', 'text-to-image'],
    lastModified: '2025-11-15T08:00:00.000Z',
  },
  {
    id: 'google/gemma-2-27b-it',
    author: 'google',
    likes: 2640,
    downloads: 650000,
    pipeline_tag: 'text-generation',
    tags: ['transformers', 'gemma', 'text-generation'],
    lastModified: '2025-09-22T13:10:00.000Z',
  },
];
/**
 * Fetch top trending models directly from Hugging Face public API.
 * Uses Next.js ISR (revalidate: 3600s = 1 hour) for blazing-fast cached responses.
 */
export async function getTrendingModels(): Promise<HfModel[]> {
  const url = 'https://huggingface.co/api/models?sort=trendingScore&direction=-1&limit=60&full=false';

  try {
    const res = await fetch(url, {
      next: { revalidate: 3600 },
      headers: {
        'User-Agent': 'TechNova-AI-Radar/1.0',
        Accept: 'application/json',
      },
    });

    if (!res.ok) {
      console.warn(`Hugging Face API returned ${res.status}. Falling back to cached popular models.`);
      return FALLBACK_MODELS;
    }

    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) {
      return FALLBACK_MODELS;
    }

    const sanitized: HfModel[] = data
      .filter((item: any) => item && typeof item.id === 'string' && !item.private)
      .map((item: any) => {
        const parts = item.id.split('/');
        const author = parts.length > 1 ? parts[0] : item.author || 'community';
        return {
          id: item.id,
          author,
          likes: typeof item.likes === 'number' ? item.likes : 0,
          downloads: typeof item.downloads === 'number' ? item.downloads : 0,
          pipeline_tag: item.pipeline_tag || (item.tags?.find((t: string) => t.includes('generation') || t.includes('image') || t.includes('audio')) || 'other'),
          tags: Array.isArray(item.tags) ? item.tags.slice(0, 8) : [],
          lastModified: item.lastModified || new Date().toISOString(),
          createdAt: item.createdAt,
        };
      });

    return sanitized.length > 0 ? sanitized : FALLBACK_MODELS;
  } catch (error) {
    console.error('Error fetching models from Hugging Face API:', error);
    return FALLBACK_MODELS;
  }
}

/**
 * Format numbers into human-readable compact metrics (e.g. 1.4M, 250K).
 */
export function formatMetric(num: number): string {
  if (!num || isNaN(num)) return '0';
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return num.toLocaleString('en-US');
}

/**
 * Returns a friendly category badge label based on pipeline_tag
 */
export function getFriendlyTaskLabel(tag?: string): { label: string; group: string; color: string } {
  if (!tag) return { label: 'General AI', group: 'other', color: 'badge--gray' };

  const lower = tag.toLowerCase();

  if (lower.includes('text-generation') || lower.includes('text2text') || lower.includes('conversational')) {
    return { label: 'Text & LLM', group: 'llm', color: 'badge--purple' };
  }
  if (lower.includes('image') || lower.includes('vision') || lower.includes('diffusion')) {
    return { label: 'Computer Vision', group: 'vision', color: 'badge--cyan' };
  }
  if (lower.includes('audio') || lower.includes('speech') || lower.includes('voice')) {
    return { label: 'Audio & Speech', group: 'audio', color: 'badge--green' };
  }
  if (lower.includes('code') || lower.includes('programming')) {
    return { label: 'Code & Dev', group: 'code', color: 'badge--blue' };
  }
  if (lower.includes('translation') || lower.includes('summarization')) {
    return { label: 'NLP / Language', group: 'nlp', color: 'badge--orange' };
  }

  return { label: tag.replace(/-/g, ' ').toUpperCase(), group: 'other', color: 'badge--gray' };
}

export interface FaqItem {
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FaqItem[] = [
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

