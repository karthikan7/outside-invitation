import React, { useState } from 'react';
import { MapPin, ArrowRight } from 'lucide-react';

const placeOptions = [
  { id: 'Cozy Cafe & Coffee', emoji: '☕', title: 'Cozy Cafe', subtitle: 'Coffee & snacks' },
  { id: 'Great Food & Dinner', emoji: '🍕', title: 'Food & Dinner', subtitle: 'Good food & catch up' },
  { id: 'Cinema / Movie', emoji: '🍿', title: 'Cinema / Movie', subtitle: 'Latest movie' },
  { id: 'Park Walk & Ice Cream', emoji: '🌅', title: 'Walk & Ice Cream', subtitle: 'Fresh air & stroll' },
  { id: 'Fun Arcade & Games', emoji: '🎮', title: 'Arcade / Bowling', subtitle: 'Games & fun' },
  { id: 'Custom', emoji: '✨', title: 'Surprise / Other', subtitle: 'Type custom below' }
];

export default function Step3Place({ selectedPlace, onSelectPlace, onNext, onBack }) {
  const [customInput, setCustomInput] = useState('');

  const handleCardClick = (id) => {
    if (id === 'Custom') {
      onSelectPlace(customInput.trim() || 'Anywhere cool');
    } else {
      setCustomInput('');
      onSelectPlace(id);
    }
  };

  const handleCustomChange = (e) => {
    const val = e.target.value;
    setCustomInput(val);
    if (val.trim()) {
      onSelectPlace(val.trim());
    }
  };

  const isCustomActive = placeOptions.every(p => p.id !== selectedPlace) || selectedPlace === 'Custom' || selectedPlace === 'Anywhere cool';

  return (
    <section className="py-2 animate-scale-in">
      <div className="text-center mb-6">
        <div className="w-12 h-12 mx-auto mb-2 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold shadow-sm border border-indigo-100">
          <MapPin className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Where Should We Go? 📍</h2>
        <p className="text-slate-500 text-sm">Pick what sounds most fun to you</p>
      </div>

      {/* Place Cards Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {placeOptions.map((opt) => {
          const isSelected = opt.id === 'Custom' ? isCustomActive : selectedPlace === opt.id;
          return (
            <div
              key={opt.id}
              onClick={() => handleCardClick(opt.id)}
              className={`p-3 rounded-2xl border-2 cursor-pointer transition-all text-center flex flex-col items-center justify-center ${
                isSelected
                  ? 'border-indigo-600 bg-indigo-50/70 shadow-md shadow-indigo-500/10 -translate-y-0.5'
                  : 'border-slate-100 hover:border-slate-300 bg-white/80'
              }`}
            >
              <span className="text-3xl mb-1.5">{opt.emoji}</span>
              <span className="font-bold text-slate-800 text-xs">{opt.title}</span>
              <span className="text-[10px] text-slate-400">{opt.subtitle}</span>
            </div>
          );
        })}
      </div>

      {/* Custom Place Input */}
      <div className="mb-6">
        <input
          type="text"
          value={customInput}
          onChange={handleCustomChange}
          placeholder="Or type a specific place/spot you prefer..."
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white/90 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition placeholder:text-slate-400"
        />
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium text-sm transition"
        >
          Back
        </button>
        <button
          type="button"
          disabled={!selectedPlace}
          onClick={onNext}
          className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm shadow-md transition flex items-center gap-1.5"
        >
          <span>Next: Choose Time</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
}
