import React, { useState } from 'react';
import { Clock, Check } from 'lucide-react';

const timeSlots = [
  { id: '12:30 PM (Lunch)', icon: '☀️', title: '12:30 PM', sub: 'Lunch time' },
  { id: '04:30 PM (Afternoon)', icon: '☕', title: '04:30 PM', sub: 'Afternoon' },
  { id: '07:00 PM (Evening)', icon: '🌙', title: '07:00 PM', sub: 'Evening' }
];

export default function Step4Time({ selectedTime, onSelectTime, onConfirm, onBack }) {
  const [note, setNote] = useState('');

  const formatTime12h = (timeStr) => {
    if (!timeStr) return '';
    const [hours, minutes] = timeStr.split(':');
    let h = parseInt(hours, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${h}:${minutes} ${ampm}`;
  };

  const handleCustomTime = (e) => {
    if (e.target.value) {
      onSelectTime(formatTime12h(e.target.value));
    }
  };

  const handleConfirm = () => {
    onConfirm(note.trim());
  };

  return (
    <section className="py-2 animate-scale-in">
      <div className="text-center mb-6">
        <div className="w-12 h-12 mx-auto mb-2 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold shadow-sm border border-indigo-100">
          <Clock className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">What Time Works? ⏰</h2>
        <p className="text-slate-500 text-sm">Select the best timing for you</p>
      </div>

      {/* Preset Time Slots */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {timeSlots.map((slot) => {
          const isSelected = selectedTime === slot.id;
          return (
            <button
              key={slot.id}
              type="button"
              onClick={() => onSelectTime(slot.id)}
              className={`p-3 rounded-2xl border text-center transition-all ${
                isSelected
                  ? 'border-indigo-600 bg-indigo-50/70 shadow-md shadow-indigo-500/10 -translate-y-0.5'
                  : 'border-slate-200 bg-white/90 hover:border-slate-300'
              }`}
            >
              <span className="block text-lg">{slot.icon}</span>
              <span className="block font-bold text-xs text-slate-800">{slot.title}</span>
              <span className="text-[10px] text-slate-400">{slot.sub}</span>
            </button>
          );
        })}
      </div>

      {/* Custom Time Picker */}
      <div className="mb-4">
        <label className="block text-xs font-semibold text-slate-600 mb-1.5">
          Or set a specific time:
        </label>
        <input
          type="time"
          onChange={handleCustomTime}
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white/90 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
        />
      </div>

      {/* Note / Food Preferences */}
      <div className="mb-6">
        <label className="block text-xs font-semibold text-slate-600 mb-1.5">
          Any food preferences or note? (Optional) 📝
        </label>
        <textarea
          rows={2}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="e.g. Any food spot you've been wanting to try!"
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white/90 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition placeholder:text-slate-400 resize-none"
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
          disabled={!selectedTime}
          onClick={handleConfirm}
          className="px-7 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-base shadow-lg shadow-indigo-500/25 transition-all flex items-center gap-2"
        >
          <span>Confirm Hangout Plan</span>
          <Check className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
}
