import React, { useState, useEffect, useRef } from 'react';
import { Compass, Sparkles } from 'lucide-react';

const playfulNoMessages = [
  "No",
  "Are you sure? 🤔",
  "Think again! 😉",
  "Wait! 🏃‍♂️",
  "Almost got it!",
  "Error 404: Can't click! 😅",
  "Try the other one! 👉",
  "Come on, it'll be fun! 🙌",
  "You can't catch me! 💨",
  "Over here! 😜",
  "Too fast! 🚀",
  "Nope, try again! 🏃💨"
];

export default function Step1BigQuestion({ recipientName, onYes, onDodge }) {
  const [dodgeCount, setDodgeCount] = useState(0);
  const [isFullFlying, setIsFullFlying] = useState(false);
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
  const noBtnRef = useRef(null);

  // Function to move 'No' button anywhere across the entire browser viewport
  const moveNoToRandomScreenPos = (e) => {
    const nextCount = dodgeCount + 1;
    setDodgeCount(nextCount);
    onDodge(nextCount);

    const btnWidth = 140;
    const btnHeight = 60;
    const pad = 30;

    const maxX = Math.max(pad, window.innerWidth - btnWidth - pad);
    const maxY = Math.max(pad, window.innerHeight - btnHeight - pad);

    const randomX = Math.floor(Math.random() * (maxX - pad)) + pad;
    const randomY = Math.floor(Math.random() * (maxY - pad)) + pad;

    setIsFullFlying(true);
    setNoPosition({ x: randomX, y: randomY });

    if (e && e.cancelable && e.type === 'touchstart') {
      e.preventDefault();
    }
  };

  // Window proximity listener: if mouse gets within 120px of the 'No' button, it instantly leaps away!
  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      if (!noBtnRef.current) return;
      const rect = noBtnRef.current.getBoundingClientRect();
      const btnCenterX = rect.left + rect.width / 2;
      const btnCenterY = rect.top + rect.height / 2;

      const dist = Math.hypot(e.clientX - btnCenterX, e.clientY - btnCenterY);

      // If mouse is within 110px of the button, trigger the runaway dodge!
      if (dist < 110) {
        moveNoToRandomScreenPos(e);
      }
    };

    window.addEventListener('mousemove', handleGlobalMouseMove);
    return () => window.removeEventListener('mousemove', handleGlobalMouseMove);
  }, [dodgeCount]);

  const currentNoMsg = playfulNoMessages[dodgeCount % playfulNoMessages.length];
  const yesScale = Math.min(1.4, 1 + dodgeCount * 0.04);
  const greeting = recipientName ? `Hey ${recipientName}!` : "Hey there!";

  return (
    <section className="text-center py-4 animate-scale-in">
      {/* Clean Outing Badge */}
      <div className="relative w-24 h-24 mx-auto mb-5">
        <div className="w-full h-full rounded-3xl bg-gradient-to-tr from-pink-100 via-indigo-50 to-sky-100 flex items-center justify-center shadow-md border-2 border-white/90">
          <Compass className="w-10 h-10 text-pink-600 animate-spin-slow" />
        </div>
        <div className="absolute -bottom-2 -right-1 bg-white px-2.5 py-1 rounded-full text-xs font-bold shadow-md text-pink-600 flex items-center gap-1 border border-pink-100">
          <Sparkles className="w-3 h-3 text-amber-500" />
          <span>The Big Question</span>
        </div>
      </div>

      <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight leading-snug mb-8">
        {greeting} Want to hang out outside?
      </h1>

      {/* Button Arena (Yes Button centered) */}
      <div className="relative min-h-[90px] flex items-center justify-center gap-4 mb-3">
        {/* YES BUTTON */}
        <button
          type="button"
          onClick={onYes}
          style={{ transform: `scale(${yesScale})` }}
          className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-indigo-600 text-white font-bold text-base md:text-lg shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 hover:brightness-105 active:scale-95 transition-all duration-300 flex items-center gap-2 group z-20 cursor-pointer"
        >
          <span>Yes, I'm in!</span>
          <span className="text-xl group-hover:scale-125 transition-transform duration-300">🙌</span>
        </button>

        {/* IN-CARD PLACEHOLDER FOR NO (before first runaway trigger) */}
        {!isFullFlying && (
          <button
            ref={noBtnRef}
            type="button"
            onMouseEnter={moveNoToRandomScreenPos}
            onTouchStart={moveNoToRandomScreenPos}
            onClick={moveNoToRandomScreenPos}
            className="px-6 py-3 rounded-2xl bg-white/95 text-slate-700 font-semibold text-base shadow-sm border border-slate-200 select-none z-10 transition-all cursor-pointer"
          >
            <span>{currentNoMsg}</span>
          </button>
        )}
      </div>

      {/* FULL-SCREEN RUNAWAY 'NO' BUTTON (Moves anywhere across 100% of the browser window!) */}
      {isFullFlying && (
        <button
          ref={noBtnRef}
          type="button"
          onMouseEnter={moveNoToRandomScreenPos}
          onTouchStart={moveNoToRandomScreenPos}
          onClick={moveNoToRandomScreenPos}
          style={{
            position: 'fixed',
            left: `${noPosition.x}px`,
            top: `${noPosition.y}px`,
            zIndex: 99999,
            transition: 'left 0.22s cubic-bezier(0.34, 1.56, 0.64, 1), top 0.22s cubic-bezier(0.34, 1.56, 0.64, 1)'
          }}
          className="px-6 py-3 rounded-2xl bg-white text-slate-800 font-bold text-base shadow-2xl border-2 border-pink-400 select-none cursor-pointer hover:bg-pink-50 active:scale-95 animate-bounce-slow"
        >
          <span>{currentNoMsg}</span>
        </button>
      )}

      {/* Playful Notice */}
      <p
        className={`text-xs text-pink-600 font-medium mt-4 h-5 transition-opacity duration-300 ${
          dodgeCount >= 2 ? 'opacity-100' : 'opacity-0'
        }`}
      >
        "No" is zooming across your entire screen! 🏃‍♂️💨
      </p>
    </section>
  );
}
