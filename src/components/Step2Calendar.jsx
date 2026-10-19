import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default function Step2Calendar({ selectedDate, onSelectDate, onNext, onBack }) {
  const [viewDate, setViewDate] = useState(() => selectedDate || new Date());

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const prevMonth = () => {
    setViewDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setViewDate(new Date(year, month + 1, 1));
  };

  const handleQuickChip = (type) => {
    const target = new Date();
    target.setHours(0, 0, 0, 0);

    if (type === 'tomorrow') {
      target.setDate(target.getDate() + 1);
    } else if (type === 'weekend') {
      const currentDay = target.getDay();
      const daysUntilSaturday = (6 - currentDay + 7) % 7 || 7;
      target.setDate(target.getDate() + daysUntilSaturday);
    }
    setViewDate(new Date(target));
    onSelectDate(target);
  };

  const daysCells = [];
  for (let i = 0; i < firstDayIndex; i++) {
    daysCells.push(<div key={`empty-${i}`} className="aspect-square opacity-0 pointer-events-none" />);
  }

  for (let day = 1; day <= totalDays; day++) {
    const cellDate = new Date(year, month, day);
    cellDate.setHours(0, 0, 0, 0);
    const isPast = cellDate < today;
    const isToday = cellDate.getTime() === today.getTime();
    const isSelected = selectedDate && cellDate.toDateString() === selectedDate.toDateString();

    daysCells.push(
      <button
        key={`day-${day}`}
        type="button"
        disabled={isPast}
        onClick={() => onSelectDate(cellDate)}
        className={`aspect-square flex items-center justify-center rounded-xl font-medium text-sm transition-all ${
          isSelected
            ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold shadow-md shadow-indigo-500/30 scale-105'
            : isPast
            ? 'opacity-25 cursor-not-allowed text-slate-400'
            : isToday
            ? 'border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-bold'
            : 'text-slate-700 hover:bg-slate-100 hover:text-indigo-600'
        }`}
      >
        {day}
      </button>
    );
  }

  const formattedDate = selectedDate
    ? selectedDate.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    : null;

  return (
    <section className="py-2 animate-scale-in">
      <div className="text-center mb-6">
        <div className="w-12 h-12 mx-auto mb-2 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold shadow-sm border border-indigo-100">
          <Calendar className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Pick a Date 📅</h2>
        <p className="text-slate-500 text-sm">When are you free to meet up?</p>
      </div>

      {/* Quick Suggestions */}
      <div className="flex flex-wrap gap-2 justify-center mb-5">
        <button
          type="button"
          onClick={() => handleQuickChip('today')}
          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all border border-slate-200"
        >
          Today
        </button>
        <button
          type="button"
          onClick={() => handleQuickChip('tomorrow')}
          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all border border-slate-200"
        >
          Tomorrow
        </button>
        <button
          type="button"
          onClick={() => handleQuickChip('weekend')}
          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all border border-slate-200"
        >
          This Weekend
        </button>
      </div>

      {/* Interactive Calendar Card */}
      <div className="bg-white/90 backdrop-blur rounded-2xl p-4 shadow-sm border border-slate-200 mb-6">
        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            onClick={prevMonth}
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-600 hover:text-indigo-600 transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h3 className="font-bold text-slate-800 text-base">
            {monthNames[month]} {year}
          </h3>
          <button
            type="button"
            onClick={nextMonth}
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-600 hover:text-indigo-600 transition"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Days Header */}
        <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-slate-400 mb-2">
          <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-1 text-center text-sm">
          {daysCells}
        </div>
      </div>

      {/* Selected Date Notice */}
      <div className="text-center text-xs font-medium text-indigo-600 mb-6 min-h-[20px]">
        {formattedDate ? `Selected Date: ${formattedDate} ✨` : "Please select a day above"}
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
          disabled={!selectedDate}
          onClick={onNext}
          className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm shadow-md transition flex items-center gap-1.5"
        >
          <span>Next: Choose Place</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
}
