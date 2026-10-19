import React, { useState, useRef } from 'react';
import { Compass, Sparkles } from 'lucide-react';

const playfulNoMessages = [
  "No",
  "Are you sure? 🤔",
  "Think again! 😉",
  "Wait! 🏃‍♂️",
  "Almost got it!",
  "Try the other one! 👉",
  "Come on, it'll be fun! 🙌",
  "Nope! 😜",
  "Try again! 💨"
];

export default function Step1BigQuestion({ recipientName, onYes, onDodge }) {
  const [dodgeCount, setDodgeCount] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const arenaRef = useRef(null);

  // Playfully dodge inside the card button arena so it stays 100% visible on mobile and desktop
  const handleDodge = (e) => {
    const nextCount = dodgeCount + 1;
    setDodgeCount(nextCount);
    onDodge(nextCount);

    if (arenaRef.current) {
      const arena = arenaRef.current.getBoundingClientRect();
      // Keep strictly within container bounds with safe margins for small phone screens
      const maxX = Math.max(12, arena.width / 2 - 55);
      const maxY = Math.max(10, arena.height / 2 - 28);

      const randomX = (Math.random() - 0.5) * (maxX * 1.7);
      const randomY = (Math.random() - 0.5) * (maxY * 1.5);

      setPosition({ x: randomX, y: randomY });
    }

    if (e && e.cancelable && e.type === 'touchstart') {
      e.preventDefault();
    }
  };

  const currentNoMsg = playfulNoMessages[dodgeCount % playfulNoMessages.length];
  const yesScale = Math.min(1.25, 1 + dodgeCount * 0.03);
  const greeting = recipientName ? `Hey ${recipientName}!` : "Hey there!";

  return (
    <section className="text-center py-2 sm:py-4 animate-scale-in">
      {/* Clean Outing Badge */}
      <div className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-5">
        <div className="w-full h-full rounded-2xl sm:rounded-3xl bg-gradient-to-tr from-pink-100 via-indigo-50 to-sky-100 flex items-center justify-center shadow-md border-2 border-white/90">
          <Compass className="w-9 h-9 sm:w-10 sm:h-10 text-pink-600 animate-spin-slow" />
        </div>
        <div className="absolute -bottom-2 -right-1 bg-white px-2.5 py-0.5 sm:py-1 rounded-full text-[11px] sm:text-xs font-bold shadow-md text-pink-600 flex items-center gap-1 border border-pink-100">
          <Sparkles className="w-3 h-3 text-amber-500" />
          <span>The Big Question</span>
        </div>
      </div>

      <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight leading-snug mb-5 sm:mb-6 px-1">
        {greeting} Want to hang out outside?
      </h1>

      {/* Button Arena (Optimized for all phone screen widths) */}
      <div
        ref={arenaRef}
        className="relative min-h-[150px] sm:min-h-[160px] flex items-center justify-center gap-3 sm:gap-4 mb-2 overflow-hidden rounded-2xl p-3 sm:p-4 bg-white/40 border border-white/60 touch-none"
      >
        {/* YES BUTTON */}
        <button
          type="button"
          onClick={onYes}
          style={{ transform: `scale(${yesScale})` }}
          className="px-5 sm:px-8 py-3 sm:py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-indigo-600 text-white font-bold text-sm sm:text-base md:text-lg shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 hover:brightness-105 active:scale-95 transition-all duration-300 flex items-center gap-1.5 sm:gap-2 group z-20 cursor-pointer shrink-0"
        >
          <span>Yes, I'm in!</span>
          <span className="text-lg sm:text-xl group-hover:scale-125 transition-transform duration-300">🙌</span>
        </button>

        {/* NO BUTTON (Mobile touch friendly, stays strictly inside box) */}
        <button
          type="button"
          onMouseEnter={handleDodge}
          onMouseMove={handleDodge}
          onTouchStart={handleDodge}
          onClick={handleDodge}
          style={{
            transform: `translate(${position.x}px, ${position.y}px)`,
            transition: 'transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1)'
          }}
          className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm sm:text-base shadow-sm border border-slate-200 select-none z-10 transition-all cursor-pointer whitespace-nowrap touch-none"
        >
          <span>{currentNoMsg}</span>
        </button>
      </div>

      {/* Playful Notice */}
      <p
        className={`text-xs text-pink-600 font-medium mt-3 h-5 transition-opacity duration-300 ${
          dodgeCount >= 2 ? 'opacity-100' : 'opacity-0'
        }`}
      >
        "No" is feeling a bit fast today! 🏃‍♂️💨
      </p>
    </section>
  );
}
