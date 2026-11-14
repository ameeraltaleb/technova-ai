import type { Metadata, Viewport } from 'next';
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import LayoutShell from '@/components/LayoutShell';
import AnalyticsScripts from '@/components/AnalyticsScripts';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-grotesk',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jetbrains-mono',
});

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0C0D12' },
    { media: '(prefers-color-scheme: light)', color: '#FFFFFF' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://www.technova-ai.online'),
  title: {
    default: 'TechNova AI — Discover & Compare The Best AI Tools',
    template: '%s — TechNova AI',
  },
  description: 'Your go-to source for in-depth reviews, comparisons, and guides on the latest AI tools, software, and digital productivity solutions.',
  keywords: ['AI tools', 'tech reviews', 'software comparisons', 'developer tools', 'productivity apps', 'cybersecurity', 'cloud SaaS'],
  authors: [{ name: 'TechNova AI Team' }],
  creator: 'TechNova AI',
  publisher: 'TechNova AI',
  alternates: {
    types: {
      'application/rss+xml': 'https://www.technova-ai.online/feed.xml',
    },
  },
  verification: {
    google: 'pz9GEGv-Bv4P9R1DSaF51xHj0bW2cBos1PNYkLTLtYQ',
  },
  other: {
    'google-adsense-account': 'ca-pub-8381284855782594',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.technova-ai.online',
    siteName: 'TechNova AI',
    title: 'TechNova AI — Discover & Compare The Best AI Tools',
    description: 'Your go-to source for in-depth reviews, comparisons, and guides on the latest AI tools, software, and digital productivity solutions.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'TechNova AI',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@TechNova__AI',
    creator: '@TechNova__AI',
    title: 'TechNova AI — Discover, Compare & Master the Best AI & Tech Tools',
    description: 'Your go-to source for in-depth reviews, comparisons, and guides on the latest AI tools, software, and digital productivity solutions.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
};

const jsonLdWebSite = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'TechNova AI',
  url: 'https://www.technova-ai.online',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://www.technova-ai.online/category?search={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
};

const jsonLdOrganization = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'TechNova AI',
  description: 'In-depth reviews, comparisons, and guides on the latest AI tools and software.',
  url: 'https://www.technova-ai.online',
  logo: 'https://www.technova-ai.online/og-image.png',
  sameAs: [
    'https://x.com/TechNova__AI',
    'https://www.facebook.com/profile.php?id=61596020852355',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="dark" className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      <head>
        <meta name="google-adsense-account" content="ca-pub-8381284855782594" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8381284855782594"
          crossOrigin="anonymous"
        ></script>
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebSite) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrganization) }}
        />
      </head>
      <body>
        {/* Dynamic Analytics & AdSense (excluded from /admin paths) */}
        <AnalyticsScripts />

        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}
