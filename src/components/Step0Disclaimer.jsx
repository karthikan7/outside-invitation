import React from 'react';
import { AlertTriangle, ArrowRight, ShieldAlert } from 'lucide-react';

export default function Step0Disclaimer({ onProceed }) {
  return (
    <section className="py-2 text-left animate-scale-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5 pb-3 border-b border-pink-100">
        <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold shadow-sm shrink-0">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <div>
          <span className="text-[11px] font-bold tracking-wider text-amber-600 uppercase">
            Official Notice
          </span>
          <h2 className="text-xl md:text-2xl font-black text-slate-800">
            DISCLAIMER 🚨
          </h2>
        </div>
      </div>

      {/* Official Disclaimer Box */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 border border-pink-200 shadow-inner mb-6 space-y-3.5 text-slate-700 text-sm md:text-base leading-relaxed">
        <p>
          By proceeding further, I officially confirm that I am willing to go out with you 😌.
        </p>
        <p>
          This decision has been made voluntarily, without any pressure, blackmail, emotional damage, or excessive bribery (unless food is involved 😭).
        </p>
        <p>
          I understand that this outing may include random conversations, unnecessary laughing, taking approximately 847 photos, arguing about where to eat, and pretending we have a proper plan when we actually have no idea what we’re doing.
        </p>
        <p className="font-semibold text-slate-800">
          By clicking “Yes,” I accept all the possible consequences of having a suspiciously good time. 😂
        </p>
      </div>

      {/* Next Button */}
      <button
        type="button"
        onClick={onProceed}
        className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-indigo-600 hover:brightness-105 active:scale-[0.98] text-white font-bold text-base shadow-lg shadow-pink-500/25 transition-all flex items-center justify-center gap-2 group"
      >
        <span>I Understand & Agree — Next</span>
        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </button>
    </section>
  );
}
