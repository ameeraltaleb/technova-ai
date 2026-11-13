'use client';

import { usePathname } from 'next/navigation';
import Script from 'next/script';
import { useEffect } from 'react';

const GA_MEASUREMENT_ID = 'G-0RXE2K2K6P';

export default function AnalyticsScripts() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (isAdmin) {
        // Officially disable Google Analytics tracking on admin pages
        (window as any)[`ga-disable-${GA_MEASUREMENT_ID}`] = true;
      } else {
        (window as any)[`ga-disable-${GA_MEASUREMENT_ID}`] = false;
      }
    }
  }, [isAdmin]);

  // Completely omit analytics & advertising scripts on admin dashboard & login
  if (isAdmin) {
    return null;
  }

  return (
    <>
      {/* Google Analytics 4 */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
    </>
  );
}

