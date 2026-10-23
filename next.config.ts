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
};

export default nextConfig;
