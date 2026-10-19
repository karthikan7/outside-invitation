import React from 'react';
import { Calendar, MapPin, Clock, MessageSquare, Send } from 'lucide-react';

export default function Step5Confirmation({ plan, whatsAppNumber, onReplay }) {
  const { date, place, time, note } = plan;

  const waText = encodeURIComponent(
    `Hey! I'm in for our hangout! 🙌\n\n` +
    `📅 Date: ${date}\n` +
    `📍 Place: ${place}\n` +
    `⏰ Time: ${time}\n` +
    (note && note !== 'None' ? `📝 Note: ${note}\n` : '') +
    `\nLooking forward to it! ✨`
  );

  const cleanPhone = whatsAppNumber ? whatsAppNumber.replace(/[^0-9]/g, '') : '';
  const waUrl = cleanPhone
    ? `https://wa.me/${cleanPhone}?text=${waText}`
    : `https://api.whatsapp.com/send?text=${waText}`;

  return (
    <section className="py-4 text-center animate-scale-in">
      <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-4xl shadow-inner animate-bounce-slow">
        🎉
      </div>

      <h2 className="text-3xl font-extrabold text-slate-800 mb-1">All Set! 🎉</h2>
      <p className="text-slate-600 text-sm mb-6">
        Looking forward to catching up! Here are the hangout details:
      </p>

      {/* Summary Card */}
      <div className="bg-gradient-to-br from-slate-50 to-indigo-50/50 rounded-2xl p-5 text-left border border-slate-200 mb-6 shadow-sm">
        <div className="flex items-center gap-3 mb-3 pb-3 border-b border-slate-100">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-sm font-bold">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <span className="block text-[11px] font-bold text-indigo-600 uppercase tracking-wider">Date</span>
            <span className="font-bold text-slate-800 text-sm">{date}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-3 pb-3 border-b border-slate-100">
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <span className="block text-[11px] font-bold text-indigo-600 uppercase tracking-wider">Destination</span>
            <span className="font-bold text-slate-800 text-sm">{place}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-3 pb-3 border-b border-slate-100">
          <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center text-sm font-bold">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <span className="block text-[11px] font-bold text-indigo-600 uppercase tracking-wider">Time</span>
            <span className="font-bold text-slate-800 text-sm">{time}</span>
          </div>
        </div>

        {note && note !== 'None' && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center text-sm font-bold shrink-0">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <span className="block text-[11px] font-bold text-indigo-600 uppercase tracking-wider">Note</span>
              <span className="text-slate-700 text-xs italic">"{note}"</span>
            </div>
          </div>
        )}
      </div>

      {/* Share / WhatsApp Actions */}
      <div className="space-y-3">
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={waUrl}
          className="w-full py-3.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 transition"
        >
          <Send className="w-4 h-4" />
          <span>Send Confirmation on WhatsApp</span>
        </a>

        <button
          type="button"
          onClick={onReplay}
          className="text-xs text-slate-400 hover:text-indigo-600 transition underline underline-offset-4"
        >
          Want to change anything? Start over
        </button>
      </div>
    </section>
  );
}
