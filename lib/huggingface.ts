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

