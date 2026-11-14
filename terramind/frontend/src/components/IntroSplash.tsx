import React, { useEffect, useState } from 'react';

interface IntroSplashProps {
  onDone: () => void;
}

export const IntroSplash: React.FC<IntroSplashProps> = ({ onDone }) => {
  const [phase, setPhase] = useState<'in' | 'hold' | 'out'>('in');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('hold'), 350);
    const t2 = setTimeout(() => setPhase('out'),  2100);
    const t3 = setTimeout(() => onDone(),         2650);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);

  const gone = phase === 'out';
  const visible = phase !== 'in';

  const ease = 'cubic-bezier(0, 0, 0.2, 1)';

  return (
    <div
      onClick={onDone}
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
        transition: gone ? `opacity 540ms ${ease}` : 'none',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        userSelect: 'none',
      }}
    >
      {/* Expanding rule — top */}
      <div style={{
        width: visible ? 200 : 0,
        height: 1,
        background: 'rgba(255,255,255,0.07)',
        marginBottom: 32,
        transition: `width 700ms ${ease}`,
        transitionDelay: '80ms',
        borderRadius: 1,
      }} />

      {/* Icon mark */}
      <div style={{
        width: 42,
        height: 42,
        borderRadius: 11,
        background: '#111A11',
        border: '1px solid rgba(124,154,107,0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 18,
        opacity: visible ? 1 : 0,
        transform: visible ? 'scale(1)' : 'scale(0.88)',
        transition: `opacity 380ms ${ease}, transform 480ms ${ease}`,
        transitionDelay: '160ms',
      }}>
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
          <path d="M4 16C4 16 6 8 14 5C14 5 14 13 6 15L4 16Z" fill="#7C9A6B" opacity="0.9"/>
          <path d="M4 16L9 11" stroke="#A8C496" strokeWidth="1.3" strokeLinecap="round" opacity="0.6"/>
        </svg>
      </div>

      {/* Wordmark */}
      <div style={{
        fontSize: 26,
        fontWeight: 600,
        color: '#FFFFFF',
        letterSpacing: '-0.03em',
        lineHeight: 1,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(8px)',
        transition: `opacity 380ms ${ease}, transform 480ms ${ease}`,
        transitionDelay: '240ms',
      }}>
        farmelster
      </div>

      {/* Tagline */}
      <div style={{
        fontSize: 11,
        fontWeight: 400,
        color: 'rgba(255,255,255,0.22)',
        letterSpacing: '0.04em',
        marginTop: 8,
        opacity: visible ? 1 : 0,
        transition: `opacity 480ms ${ease}`,
        transitionDelay: '380ms',
      }}>
        Agricultural Intelligence Platform
      </div>

      {/* Data sources */}
      <div style={{
        display: 'flex',
        gap: 6,
        marginTop: 24,
        opacity: visible ? 0.5 : 0,
        transition: `opacity 480ms ${ease}`,
        transitionDelay: '500ms',
      }}>
        {['NASA POWER', 'SoilGrids', 'Sentinel-2'].map((s) => (
          <span key={s} style={{
            fontSize: 10,
            fontWeight: 500,
            color: 'rgba(255,255,255,0.3)',
            padding: '3px 9px',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 5,
          }}>
            {s}
          </span>
        ))}
      </div>

      {/* Expanding rule — bottom */}
      <div style={{
        width: visible ? 200 : 0,
        height: 1,
        background: 'rgba(255,255,255,0.07)',
        marginTop: 32,
        transition: `width 700ms ${ease}`,
        transitionDelay: '80ms',
        borderRadius: 1,
      }} />

      {/* Skip hint */}
      <div style={{
        position: 'absolute',
        bottom: 24,
        fontSize: 11,
        color: 'rgba(255,255,255,0.15)',
        letterSpacing: '0.03em',
        opacity: phase === 'hold' ? 1 : 0,
        transition: `opacity 400ms ${ease}`,
        transitionDelay: phase === 'hold' ? '500ms' : '0ms',
      }}>
        click anywhere to skip
      </div>
    </div>
  );
};
