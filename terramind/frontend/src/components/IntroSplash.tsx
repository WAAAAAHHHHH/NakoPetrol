import React, { useEffect, useState } from 'react';

interface IntroSplashProps {
  onDone: () => void;
}

export const IntroSplash: React.FC<IntroSplashProps> = ({ onDone }) => {
  const [phase, setPhase] = useState<'in' | 'hold' | 'out'>('in');

  useEffect(() => {
    // in → hold at 400ms
    const t1 = setTimeout(() => setPhase('hold'), 400);
    // hold → out at 2200ms
    const t2 = setTimeout(() => setPhase('out'), 2200);
    // unmount at 2800ms
    const t3 = setTimeout(() => onDone(), 2800);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);

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
        opacity: phase === 'out' ? 0 : 1,
        transition: phase === 'out' ? 'opacity 580ms cubic-bezier(0.4,0,1,1)' : 'none',
        userSelect: 'none',
      }}
    >
      {/* Top rule */}
      <div style={{
        width: phase === 'in' ? 0 : 220,
        height: 1,
        background: 'rgba(255,255,255,0.08)',
        marginBottom: 36,
        transition: 'width 700ms cubic-bezier(0.19,1,0.22,1)',
        transitionDelay: '100ms',
      }} />

      {/* Icon mark */}
      <div style={{
        width: 44,
        height: 44,
        borderRadius: 12,
        background: '#121A12',
        border: '1px solid rgba(124,154,107,0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        opacity: phase === 'in' ? 0 : 1,
        transform: phase === 'in' ? 'scale(0.85)' : 'scale(1)',
        transition: 'opacity 400ms ease, transform 500ms cubic-bezier(0.19,1,0.22,1)',
        transitionDelay: '200ms',
      }}>
        {/* leaf SVG */}
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M4 16C4 16 6 8 14 5C14 5 14 13 6 15L4 16Z"
            fill="#7C9A6B"
            opacity="0.9"
          />
          <path
            d="M4 16L9 11"
            stroke="#A8C496"
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity="0.6"
          />
        </svg>
      </div>

      {/* Wordmark */}
      <div style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: 28,
        fontWeight: 600,
        color: '#FFFFFF',
        letterSpacing: '-0.03em',
        opacity: phase === 'in' ? 0 : 1,
        transform: phase === 'in' ? 'translateY(10px)' : 'translateY(0)',
        transition: 'opacity 400ms ease, transform 500ms cubic-bezier(0.19,1,0.22,1)',
        transitionDelay: '300ms',
      }}>
        farmelster
      </div>

      {/* Tagline */}
      <div style={{
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 10,
        color: '#525660',
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        marginTop: 10,
        opacity: phase === 'in' ? 0 : 1,
        transition: 'opacity 500ms ease',
        transitionDelay: '500ms',
      }}>
        Agricultural Intelligence Platform
      </div>

      {/* Data sources row */}
      <div style={{
        display: 'flex',
        gap: 8,
        marginTop: 28,
        opacity: phase === 'in' ? 0 : 1,
        transition: 'opacity 500ms ease',
        transitionDelay: '650ms',
      }}>
        {['NASA POWER', 'ISRIC SoilGrids', 'Sentinel-2', 'Natural Earth'].map((s) => (
          <span key={s} style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 9,
            color: '#3A3D45',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            padding: '3px 8px',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: 4,
          }}>
            {s}
          </span>
        ))}
      </div>

      {/* Bottom rule */}
      <div style={{
        width: phase === 'in' ? 0 : 220,
        height: 1,
        background: 'rgba(255,255,255,0.08)',
        marginTop: 36,
        transition: 'width 700ms cubic-bezier(0.19,1,0.22,1)',
        transitionDelay: '100ms',
      }} />

      {/* Skip hint */}
      <div style={{
        position: 'absolute',
        bottom: 28,
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 9,
        color: '#2A2D35',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        opacity: phase === 'hold' ? 1 : 0,
        transition: 'opacity 400ms ease',
        transitionDelay: phase === 'hold' ? '600ms' : '0ms',
      }}>
        click to skip
      </div>
    </div>
  );
};
