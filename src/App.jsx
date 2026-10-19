import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { ShieldCheck } from 'lucide-react';

import EyesBackground from './components/EyesBackground';
import Step0Disclaimer from './components/Step0Disclaimer';
import Step1BigQuestion from './components/Step1BigQuestion';
import Step2Calendar from './components/Step2Calendar';
import Step3Place from './components/Step3Place';
import Step4Time from './components/Step4Time';
import Step5Confirmation from './components/Step5Confirmation';
import AdminModal from './components/AdminModal';

import {
  loadSettings,
  saveSettings,
  loadAnalytics,
  saveAnalytics,
  recordVisit,
  logEvent
} from './utils/storage';
import { triggerWebhook } from './utils/webhook';

export default function App() {
  // Step 0 = Disclaimer, 1 = Yes/No, 2 = Calendar, 3 = Place, 4 = Time, 5 = Confirmation
  const [step, setStep] = useState(0);
  const [settings, setSettings] = useState(loadSettings);
  const [analytics, setAnalytics] = useState(loadAnalytics);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Invitation Form State
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [confirmedPlan, setConfirmedPlan] = useState(null);

  // Initialize URL parameters and visit recording
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const overrides = {};
    if (params.has('name')) overrides.herName = params.get('name').trim();
    if (params.has('phone')) overrides.whatsAppNumber = params.get('phone').trim();

    let currentSettings = settings;
    if (Object.keys(overrides).length > 0) {
      currentSettings = saveSettings(overrides);
      setSettings(currentSettings);
    }

    // Record visit in local analytics
    const updatedAnalytics = recordVisit(currentSettings.webhookUrl);
    setAnalytics(updatedAnalytics);

    // Optional webhook ping on visit
    triggerWebhook(
      currentSettings.webhookUrl,
      `👀 **Someone opened your Hangout Invitation!** (Visit #${updatedAnalytics.totalVisits})\n🕒 ${new Date().toLocaleTimeString()} on ${new Date().toLocaleDateString()}`
    );

    // Check #admin in URL
    if (window.location.hash.toLowerCase() === '#admin') {
      setIsAdminOpen(true);
    }

    // Keyboard shortcut Shift + A for Admin
    const handleKeyDown = (e) => {
      if (e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        setIsAdminOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsAdminOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const fireCelebration = () => {
    confetti({
      particleCount: 70,
      spread: 65,
      origin: { y: 0.6 },
      colors: ['#ec4899', '#f43f5e', '#3b82f6', '#f59e0b', '#10b981']
    });

    setTimeout(() => {
      confetti({ particleCount: 40, angle: 60, spread: 55, origin: { x: 0 } });
      confetti({ particleCount: 40, angle: 120, spread: 55, origin: { x: 1 } });
    }, 250);
  };

  const handleDisclaimerProceed = () => {
    logEvent('disclaimer_accepted');
    setStep(1);
  };

  const handleYes = () => {
    logEvent('yes_clicked');
    fireCelebration();
    setStep(2);
  };

  const handleDodge = (count) => {
    const updated = {
      ...analytics,
      totalDodges: (analytics.totalDodges || 0) + 1
    };
    logEvent('no_button_dodge', { count });
    saveAnalytics(updated);
    setAnalytics(updated);
  };

  const handleSelectDate = (date) => {
    setSelectedDate(date);
    logEvent('date_selected', {
      date: date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric'
      })
    });
  };

  const handleSelectPlace = (place) => {
    setSelectedPlace(place);
    logEvent('place_selected', { place });
  };

  const handleSelectTime = (time) => {
    setSelectedTime(time);
    logEvent('time_selected', { time });
  };

  const handleConfirmPlan = (note) => {
    const formattedDate = selectedDate.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    const plan = {
      date: formattedDate,
      place: selectedPlace || 'Anywhere cool',
      time: selectedTime || 'Flexible',
      note: note || 'None',
      submittedAt: new Date().toISOString()
    };

    setConfirmedPlan(plan);

    // Save submission to local analytics
    const updated = {
      ...analytics,
      submissions: [plan, ...(analytics.submissions || [])]
    };
    logEvent('plan_confirmed', plan);
    saveAnalytics(updated);
    setAnalytics(updated);

    // Confetti
    fireCelebration();
    setTimeout(fireCelebration, 500);

    // Webhook Notification (phone push alert)
    triggerWebhook(
      settings.webhookUrl,
      `🎉 **HANGOUT PLAN CONFIRMED!** 🙌\n\n` +
      `📅 **Date:** ${plan.date}\n` +
      `📍 **Place:** ${plan.place}\n` +
      `⏰ **Time:** ${plan.time}\n` +
      `📝 **Note:** ${plan.note}\n` +
      `🏃‍♂️ **'No' Dodges:** ${analytics.totalDodges}\n` +
      `👀 **Total Visits:** ${analytics.totalVisits}`
    );

    setStep(5);
  };

  const handleReplay = () => {
    setStep(0);
    setSelectedDate(null);
    setSelectedPlace(null);
    setSelectedTime(null);
    setConfirmedPlan(null);
  };

  const handleUpdateSettings = (newSettings) => {
    const updated = saveSettings(newSettings);
    setSettings(updated);
  };

  const progressLabels = {
    2: { pct: 33, label: 'Step 1 of 3: Choose Date' },
    3: { pct: 66, label: 'Step 2 of 3: Choose Place' },
    4: { pct: 100, label: 'Step 3 of 3: Choose Time' }
  };

  return (
    <div className="min-h-screen text-slate-800 flex flex-col items-center justify-center p-4 relative overflow-x-hidden">
      {/* Pink Eyes Emoji Pattern Background (from user reference) */}
      <EyesBackground />

      {/* Top Header with discreet shield for admin only */}
      <header className="fixed top-0 left-0 right-0 p-4 flex justify-between items-center z-40 max-w-5xl mx-auto w-full">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/85 backdrop-blur-md shadow-sm border border-pink-200 text-xs font-semibold text-pink-700">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Hangout Invitation</span>
        </div>

        {/* Discreet Admin Shield (only admin knows to click or press Shift+A) */}
        <button
          type="button"
          onClick={() => setIsAdminOpen(true)}
          title="Admin"
          className="text-slate-400 hover:text-pink-600 transition-colors p-2 rounded-full hover:bg-white/80 backdrop-blur-sm"
        >
          <ShieldCheck className="w-4 h-4" />
        </button>
      </header>

      {/* Main Glass Card */}
      <main className="w-full max-w-lg mx-auto z-10 relative pt-12 pb-8">
        <div className="glass-card rounded-3xl p-6 md:p-8 shadow-2xl border border-white/90 relative overflow-hidden transition-all duration-500">
          {/* Progress Bar (Visible in steps 2, 3, 4) */}
          {step >= 2 && step <= 4 && (
            <div className="mb-6 animate-scale-in">
              <div className="flex justify-between items-center text-xs font-semibold text-pink-600 mb-2">
                <span>{progressLabels[step]?.label}</span>
                <span>{progressLabels[step]?.pct}%</span>
              </div>
              <div className="w-full h-2 bg-pink-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-pink-500 to-rose-500 transition-all duration-500 rounded-full"
                  style={{ width: `${progressLabels[step]?.pct}%` }}
                />
              </div>
            </div>
          )}

          {/* STEP 0: DISCLAIMER */}
          {step === 0 && (
            <Step0Disclaimer onProceed={handleDisclaimerProceed} />
          )}

          {/* STEP 1: BIG QUESTION (YES & NO IN BOX) */}
          {step === 1 && (
            <Step1BigQuestion
              recipientName={settings.herName}
              onYes={handleYes}
              onDodge={handleDodge}
            />
          )}

          {/* STEP 2: CALENDAR */}
          {step === 2 && (
            <Step2Calendar
              selectedDate={selectedDate}
              onSelectDate={handleSelectDate}
              onNext={() => setStep(3)}
              onBack={() => setStep(1)}
            />
          )}

          {/* STEP 3: PLACE */}
          {step === 3 && (
            <Step3Place
              selectedPlace={selectedPlace}
              onSelectPlace={handleSelectPlace}
              onNext={() => setStep(4)}
              onBack={() => setStep(2)}
            />
          )}

          {/* STEP 4: TIME */}
          {step === 4 && (
            <Step4Time
              selectedTime={selectedTime}
              onSelectTime={handleSelectTime}
              onConfirm={handleConfirmPlan}
              onBack={() => setStep(3)}
            />
          )}

          {/* STEP 5: CONFIRMATION */}
          {step === 5 && confirmedPlan && (
            <Step5Confirmation
              plan={confirmedPlan}
              whatsAppNumber={settings.whatsAppNumber}
              onReplay={handleReplay}
            />
          )}
        </div>

        <p className="text-center text-slate-700 font-medium text-xs mt-6 bg-white/60 backdrop-blur-sm py-1 px-3 rounded-full w-fit mx-auto shadow-sm border border-pink-100">
          Ready for a fun time outside ✨
        </p>
      </main>

      {/* Admin Modal */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        analytics={analytics}
        setAnalytics={setAnalytics}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
      />
    </div>
  );
}
