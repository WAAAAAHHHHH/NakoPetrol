import React, { useEffect, useState, useRef } from 'react';

interface IntroSplashProps {
  onDone: () => void;
}

export const IntroSplash: React.FC<IntroSplashProps> = ({ onDone }) => {
  const [phase, setPhase] = useState<'hold' | 'out'>('hold');
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    // Snappy, smooth entrance: 950ms view, 350ms fade-out
    const t1 = setTimeout(() => setPhase('out'), 950);
    const t2 = setTimeout(() => onDoneRef.current(), 1300);

    const handleKeyDown = () => {
      onDoneRef.current();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const gone = phase === 'out';
  const ease = 'cubic-bezier(0, 0, 0.2, 1)';

  return (
    <div
      onClick={() => onDoneRef.current()}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: '#0A0B0D',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        opacity: gone ? 0 : 1,
        pointerEvents: gone ? 'none' : 'auto',
        transition: gone ? `opacity 350ms ${ease}` : 'none',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        userSelect: 'none',
      }}
    >
      {/* Top rule */}
      <div
        style={{
          width: 180,
          height: 1,
          background: 'rgba(255,255,255,0.08)',
          marginBottom: 28,
          borderRadius: 1,
        }}
      />

      {/* Icon mark */}
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          background: '#111A11',
          border: '1px solid rgba(124,154,107,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 16,
          boxShadow: '0 0 24px rgba(124,154,107,0.15)',
        }}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M4 16C4 16 6 8 14 5C14 5 14 13 6 15L4 16Z" fill="#7C9A6B" opacity="0.95"/>
          <path d="M4 16L9 11" stroke="#A8C496" strokeWidth="1.4" strokeLinecap="round" opacity="0.8"/>
        </svg>
      </div>

      {/* Wordmark */}
      <div
        style={{
          fontSize: 27,
          fontWeight: 600,
          color: '#FFFFFF',
          letterSpacing: '-0.03em',
          lineHeight: 1,
        }}
      >
        farmelster
      </div>

      {/* Tagline */}
      <div
        style={{
          fontSize: 11,
          fontWeight: 400,
          color: 'rgba(255,255,255,0.4)',
          letterSpacing: '0.04em',
          marginTop: 8,
        }}
      >
        Agricultural Intelligence Platform
      </div>

      {/* Data sources */}
      <div
        style={{
          display: 'flex',
          gap: 6,
          marginTop: 22,
        }}
      >
        {['NASA POWER', 'SoilGrids', 'Sentinel-2'].map((s) => (
          <span
            key={s}
            style={{
              fontSize: 10,
              fontWeight: 500,
              color: 'rgba(255,255,255,0.45)',
              padding: '3px 9px',
              border: '1px solid rgba(255,255,255,0.08)',
              background: 'rgba(255,255,255,0.02)',
              borderRadius: 6,
            }}
          >
            {s}
          </span>
        ))}
      </div>

      {/* Bottom rule */}
      <div
        style={{
          width: 180,
          height: 1,
          background: 'rgba(255,255,255,0.08)',
          marginTop: 28,
          borderRadius: 1,
        }}
      />

      {/* Skip hint */}
      <div
        style={{
          position: 'absolute',
          bottom: 24,
          fontSize: 10,
          color: 'rgba(255,255,255,0.25)',
          letterSpacing: '0.03em',
        }}
      >
        click anywhere to enter
      </div>
    </div>
  );
};
