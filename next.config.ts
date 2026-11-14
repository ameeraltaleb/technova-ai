import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/articles/:slug*',
        destination: '/article/:slug*',
        permanent: true,
      },
      {
        source: '/article/most-popular-mobile-phones-20',
        destination: '/article/top-10-ai-trends-us-tech-november-2026',
        permanent: true,
      },
      {
        source: '/article/top-10-ai-trends-shaping-us-tech-late-2026',
        destination: '/article/top-10-ai-trends-us-tech-november-2026',
        permanent: true,
      },
      {
        source: '/article/sam-altman-prompt-engineering-dead-autonomous-agents',
        destination: '/article/sam-altman-you-dont-need-to-write-prompts-anymore',
        permanent: true,
      },
      {
        source: '/article/building-production-ai-workflows-with-mcp',
        destination: '/article/building-autonomous-ai-workflows-with-model-context-protocol',
        permanent: true,
      },
      {
        source: '/article/sora-2-vs-runway-gen4-vs-kling-video-generation-showdown',
        destination: '/article/10-ai-models-for-video-generation-changing-content-creation',
        permanent: true,
      },
      {
        source: '/article/ai-video-generation-masterclass',
        destination: '/article/10-ai-models-for-video-generation-changing-content-creation',
        permanent: true,
      },
      {
        source: '/article/ai-agentic-soc-crowdstrike-microsoft-sentinel-2026',
        destination: '/article/ai-cybersecurity-agentic-soc-crowdstrike-microsoft-copilot',
        permanent: true,
      },
      {
        source: '/article/best-vpn-2026',
        destination: '/article/top-15-vpn-in-2026',
        permanent: true,
      },
      {
        source: '/article/webassembly-wasm-explained',
        destination: '/article/webassembly-is-it-replacing-javascript',
        permanent: true,
      },
      {
        source: '/article/rust-systems-programming-2026',
        destination: '/article/why-rust-loved-programming-language',
        permanent: true,
      },
      {
        source: '/index.html',
        destination: '/',
        permanent: true,
      },
      {
        source: '/tools.html',
        destination: '/tools',
        permanent: true,
      },
      {
        source: '/news.html',
        destination: '/news',
        permanent: true,
      },
      {
        source: '/about.html',
        destination: '/about',
        permanent: true,
      },
      {
        source: '/privacy.html',
        destination: '/privacy',
        permanent: true,
      },
      {
        source: '/terms.html',
        destination: '/terms',
        permanent: true,
      },
      {
        source: '/article.html',
        has: [
          {
            type: 'query',
            key: 'id',
            value: '(?<id>.*)',
          },
        ],
        destination: '/article/:id',
        permanent: true,
      },
      {
        source: '/article.html',
        destination: '/',
        permanent: true,
      },
      {
        source: '/category.html',
        has: [
          {
            type: 'query',
            key: 'category',
            value: '(?<category>.*)',
          },
        ],
        destination: '/category/:category',
        permanent: true,
      },
      {
        source: '/category.html',
        destination: '/category',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
