import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';

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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="dark">
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
        <BackToTop />
      </body>
    </html>
  );
}
