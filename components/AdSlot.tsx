'use client';

import { useEffect, useRef, useState } from 'react';

interface AdSlotProps {
  slot?: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'vertical' | 'horizontal';
  layout?: 'in-article' | 'in-feed';
  className?: string;
  sticky?: boolean;
}

const ADSENSE_CLIENT_ID = 'ca-pub-8381284855782594';

export default function AdSlot({
  slot = '',
  format = 'auto',
  layout,
  className = '',
  sticky = false,
}: AdSlotProps) {
  const adRef = useRef<HTMLModElement | null>(null);
  const pushedRef = useRef(false);
  const [adStatus, setAdStatus] = useState<'pending' | 'filled' | 'unfilled'>('pending');

  useEffect(() => {
    const insEl = adRef.current;
    if (!insEl) return;

    // Observe AdSense fill status so unfilled slots collapse cleanly without empty boxes
    const observer = new MutationObserver(() => {
      const status = insEl.getAttribute('data-ad-status');
      if (status === 'filled') {
        setAdStatus('filled');
      } else if (status === 'unfilled') {
        setAdStatus('unfilled');
      }
    });

    observer.observe(insEl, {
      attributes: true,
      attributeFilter: ['data-ad-status'],
    });

    if (!pushedRef.current && !insEl.getAttribute('data-adsbygoogle-status')) {
      pushedRef.current = true;
      try {
        ((window as unknown as { adsbygoogle: unknown[] }).adsbygoogle =
          (window as unknown as { adsbygoogle: unknown[] }).adsbygoogle || []).push({});
      } catch {
        // Ignore if blocked by client adblocker
      }
    }

    return () => observer.disconnect();
  }, []);

  if (adStatus === 'unfilled') {
    return null;
  }

  return (
    <div
      className={`tn-ad-slot ${sticky ? 'tn-ad-slot--sticky' : ''} ${className}`}
      style={{
        margin: sticky ? '0' : 'var(--space-6) 0',
        position: sticky ? 'sticky' : 'relative',
        top: sticky ? '96px' : undefined,
        textAlign: 'center',
        overflow: 'hidden',
        borderRadius: 'var(--radius-lg)',
        background: adStatus === 'filled' ? 'rgba(255, 255, 255, 0.02)' : 'transparent',
        border: adStatus === 'filled' ? '1px solid var(--border-card)' : 'none',
        padding: adStatus === 'filled' ? '12px' : '0',
        transition: 'padding 0.2s ease',
      }}
      aria-label="Advertisement"
    >
      {adStatus === 'filled' && (
        <div
          style={{
            fontSize: '0.65rem',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--text-tertiary)',
            marginBottom: '6px',
            userSelect: 'none',
          }}
        >
          Advertisement
        </div>
      )}
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{
          display: 'block',
          textAlign: layout === 'in-article' ? 'center' : undefined,
          width: '100%',
        }}
        data-ad-client={ADSENSE_CLIENT_ID}
        {...(slot ? { 'data-ad-slot': slot } : {})}
        data-ad-format={format}
        {...(layout ? { 'data-ad-layout': layout } : {})}
        data-full-width-responsive="true"
      />
    </div>
  );
}
