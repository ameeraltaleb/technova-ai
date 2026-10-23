import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import LayoutShell from '@/components/LayoutShell';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.technova-ai.online'),
  title: {
    default: 'TechNova AI — Discover, Compare & Master the Best AI & Tech Tools',
    template: '%s — TechNova AI',
  },
  description: 'Your go-to source for in-depth reviews, comparisons, and guides on the latest AI tools, software, and digital productivity solutions.',
  keywords: ['AI tools', 'tech reviews', 'software comparisons', 'developer tools', 'productivity apps', 'cybersecurity', 'cloud SaaS'],
  authors: [{ name: 'TechNova AI Team' }],
  creator: 'TechNova AI',
  publisher: 'TechNova AI',
  verification: {
    google: 'pz9GEGv-Bv4P9R1DSaF51xHj0bW2cBos1PNYkLTLtYQ',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.technova-ai.online',
    siteName: 'TechNova AI',
    title: 'TechNova AI — Discover, Compare & Master the Best AI & Tech Tools',
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="dark">
      <head>
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
        {/* Google Analytics 4 */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-0RXE2K2K6P"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-0RXE2K2K6P');
          `}
        </Script>

        {/* Google AdSense */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8381284855782594"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />

        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}
