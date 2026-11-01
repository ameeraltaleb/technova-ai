'use client';

import { useState, useEffect } from 'react';

export default function USClockWidget() {
  const [mounted, setMounted] = useState(false);
  const [timeData, setTimeData] = useState<{
    nyTime: string;
    nyHour: number;
    isAm: boolean;
    periodAr: string;
    isPeak: boolean;
    ptTime: string;
    dayName: string;
  } | null>(null);

  useEffect(() => {
    setMounted(true);

    const updateClock = () => {
      const now = new Date();

      // Format New York (Eastern Time)
      const nyTimeStr = now.toLocaleTimeString('en-US', {
        timeZone: 'America/New_York',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      });

      // Format Pacific Time (California / Silicon Valley)
      const ptTimeStr = now.toLocaleTimeString('en-US', {
        timeZone: 'America/Los_Angeles',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });

      // Get 24-hour hour in NY to determine AM/PM and Peak traffic window
      const nyHour24Str = now.toLocaleTimeString('en-US', {
        timeZone: 'America/New_York',
        hour: 'numeric',
        hour12: false,
      });
      const nyHour = parseInt(nyHour24Str, 10);

      const isAm = nyHour < 12;
      const periodAr = isAm ? 'صباحاً' : 'مساءً';

      // Peak US engagement hours: 9 AM to 5 PM EST
      const isPeak = nyHour >= 9 && nyHour < 17;

      const dayName = now.toLocaleDateString('ar-EG', {
        timeZone: 'America/New_York',
        weekday: 'short',
      });

      setTimeData({
        nyTime: nyTimeStr,
        nyHour,
        isAm,
        periodAr,
        isPeak,
        ptTime: ptTimeStr,
        dayName,
      });
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted || !timeData) {
    return (
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 10px',
          background: 'rgba(241, 245, 249, 0.8)',
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
          fontSize: '0.78rem',
          color: '#64748b',
        }}
      >
        <span>🇺🇸 جاري تحميل توقيت أمريكا...</span>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '5px 12px',
        background: timeData.isPeak
          ? 'linear-gradient(135deg, rgba(238, 242, 255, 0.95), rgba(243, 232, 255, 0.95))'
          : 'linear-gradient(135deg, #f8fafc, #f1f5f9)',
        borderRadius: '10px',
        border: timeData.isPeak ? '1px solid #c7d2fe' : '1px solid #e2e8f0',
        boxShadow: timeData.isPeak ? '0 1px 3px rgba(99, 102, 241, 0.1)' : 'none',
        fontSize: '0.78rem',
        color: '#1e293b',
      }}
      title={`توقيت نيويورك: ${timeData.nyTime} (ET)\nتوقيت كاليفورنيا: ${timeData.ptTime} (PT)\n${timeData.isPeak ? '🔥 وقت الذروة للجمهور الأمريكي (9 ص - 5 م)' : '🌙 خارج أوقات الذروة في أمريكا'}`}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <span style={{ fontSize: '1.05rem', lineHeight: 1 }}>🇺🇸</span>
        <span style={{ fontWeight: 600, color: '#475569', fontSize: '0.72rem' }}>أمريكا (NY):</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
        <span
          style={{
            fontFamily: 'monospace',
            fontWeight: 700,
            fontSize: '0.85rem',
            color: '#0f172a',
            letterSpacing: '0.3px',
          }}
        >
          {timeData.nyTime.replace(/\s*(AM|PM)/i, '')}
        </span>

        {/* صباحاً أو مساءً Badge */}
        <span
          style={{
            padding: '1px 6px',
            borderRadius: '12px',
            fontSize: '0.7rem',
            fontWeight: 700,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '2px',
            background: timeData.isAm ? '#fef3c7' : '#e0e7ff',
            color: timeData.isAm ? '#b45309' : '#3730a3',
            border: timeData.isAm ? '1px solid #fde68a' : '1px solid #c7d2fe',
          }}
        >
          <span>{timeData.isAm ? '☀️' : '🌙'}</span>
          <span>{timeData.periodAr}</span>
        </span>

        {/* Peak indicator */}
        {timeData.isPeak && (
          <span
            style={{
              padding: '1px 5px',
              borderRadius: '4px',
              fontSize: '0.65rem',
              fontWeight: 700,
              background: 'rgba(239, 68, 68, 0.1)',
              color: '#dc2626',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '2px',
            }}
            title="ساعات الذروة للمتابعين في أمريكا (تفاعل عالي)"
          >
            🔥 ذروة
          </span>
        )}
      </div>
    </div>
  );
}

