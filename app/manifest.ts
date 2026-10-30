import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'TechNova AI — Future Tech & AI Tools Directory',
    short_name: 'TechNova AI',
    description:
      'In-depth reviews, comparisons, and guides on the latest AI tools, open-source models, and future technology.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0C0D12',
    theme_color: '#6366F1',
    icons: [
      {
        src: '/logo.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/logo.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}

