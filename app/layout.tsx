import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'TechNova AI — Discover, Compare & Master the Best AI & Tech Tools',
  description: 'Your go-to source for in-depth reviews, comparisons, and guides on the latest AI tools, software, and digital productivity solutions.',
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
        <button className="back-to-top" id="backToTop" aria-label="Back to top">↑</button>
      </body>
    </html>
  );
}
