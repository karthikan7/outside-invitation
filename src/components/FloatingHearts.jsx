import React, { useMemo } from 'react';

const symbols = ['✨', '☕', '🍕', '🎬', '⭐', '🎈', '🎉', '🥤'];

export default function FloatingHearts() {
  const particles = useMemo(() => {
    return Array.from({ length: 14 }).map((_, i) => ({
      id: i,
      symbol: symbols[i % symbols.length],
      left: `${(i * 7 + Math.random() * 4) % 95}%`,
      duration: `${9 + (i % 5) * 2}s`,
      delay: `${(i % 5) * 1.5}s`,
      size: `${14 + (i % 3) * 4}px`
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <div className="floating-orb orb-1"></div>
      <div className="floating-orb orb-2"></div>
      <div className="floating-orb orb-3"></div>
      {particles.map(p => (
        <div
          key={p.id}
          className="floating-heart"
          style={{
            left: p.left,
            animationDuration: p.duration,
            animationDelay: p.delay,
            fontSize: p.size,
            opacity: 0.4
          }}
        >
          {p.symbol}
        </div>
      ))}
    </div>
  );
}
