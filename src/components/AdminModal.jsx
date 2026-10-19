import React, { useState } from 'react';
import {
  LayoutDashboard,
  X,
  Lock,
  CalendarCheck,
  BellRing,
  Download,
  Trash2
} from 'lucide-react';
import { triggerWebhook } from '../utils/webhook';
import { saveAnalytics } from '../utils/storage';

export default function AdminModal({
  isOpen,
  onClose,
  analytics,
  setAnalytics,
  settings,
  onUpdateSettings
}) {
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(() => {
    return sessionStorage.getItem('outside_invitation_admin_auth') === 'true';
  });

  const [webhookInput, setWebhookInput] = useState(settings.webhookUrl || '');
  const [nameInput, setNameInput] = useState(settings.herName || '');
  const [phoneInput, setPhoneInput] = useState(settings.whatsAppNumber || '');

  if (!isOpen) return null;

  const handleUnlock = (e) => {
    e.preventDefault();
    if (pinInput.trim() === settings.adminPin || pinInput.trim() === '1234') {
      setIsUnlocked(true);
      sessionStorage.setItem('outside_invitation_admin_auth', 'true');
      setPinError(false);
    } else {
      setPinError(true);
      setPinInput('');
    }
  };

  const handleSaveWebhook = () => {
    onUpdateSettings({ webhookUrl: webhookInput.trim() });
    alert('Webhook saved successfully!');
  };

  const handleTestWebhook = () => {
    if (!webhookInput.trim()) {
      alert('Please enter a Webhook URL first.');
      return;
    }
    triggerWebhook(
      webhookInput.trim(),
      '🧪 **Test Alert:** Your Hangout Invitation webhook is configured and working!'
    );
    alert('Test alert sent! Check your Discord channel or webhook receiver.');
  };

  const handleSaveCustom = () => {
    onUpdateSettings({
      herName: nameInput.trim(),
      whatsAppNumber: phoneInput.trim()
    });
    alert('Settings saved!');
  };

  const handleExportJSON = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(analytics, null, 2));
    const dl = document.createElement('a');
    dl.setAttribute('href', dataStr);
    dl.setAttribute(
      'download',
      `hangout_records_${new Date().toISOString().slice(0, 10)}.json`
    );
    dl.click();
  };

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all visit records and activity logs?')) {
      const reset = {
        totalVisits: 0,
        totalDodges: 0,
        submissions: [],
        logs: []
      };
      saveAnalytics(reset);
      setAnalytics(reset);
    }
  };

  const latestSubmission = analytics.submissions?.[0];
  const lastVisitLog = analytics.logs?.find((l) => l.type === 'page_visit');
  const lastVisitFormatted = lastVisitLog
    ? `${new Date(lastVisitLog.timestamp).toLocaleDateString()} ${new Date(
        lastVisitLog.timestamp
      ).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    : 'Never';

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-scale-in"
    >
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] flex flex-col relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <LayoutDashboard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-800 text-lg">
                Admin Record & Activity Log
              </h3>
              <p className="text-xs text-slate-500">
                Track visits, responses, and runaway 'No' statistics
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Lock Screen if not authed */}
        {!isUnlocked ? (
          <div className="py-8 text-center flex-1">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center">
              <Lock className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-800 text-base mb-1">Enter Admin PIN</h4>
            <p className="text-xs text-slate-500 mb-4">
              Default PIN is{' '}
              <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-indigo-600">
                1234
              </code>
            </p>
            <form onSubmit={handleUnlock} className="max-w-xs mx-auto flex gap-2">
              <input
                type="password"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Enter PIN..."
                autoFocus
                className="flex-1 px-4 py-2 text-center rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono tracking-widest text-lg"
              />
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition"
              >
                Unlock
              </button>
            </form>
            {pinError && (
              <p className="text-xs text-rose-500 mt-2">Incorrect PIN. Try again!</p>
            )}
          </div>
        ) : (
          /* Main Admin Content */
          <div className="flex-1 overflow-y-auto py-4 space-y-6">
            {/* Top Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-indigo-50/60 border border-indigo-100 rounded-2xl p-3.5 text-center">
                <span className="text-xs font-semibold text-indigo-700">Total Visits</span>
                <span className="block text-2xl font-black text-indigo-600 mt-1">
                  {analytics.totalVisits || 0}
                </span>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-center">
                <span className="text-xs font-semibold text-slate-700">'No' Dodges</span>
                <span className="block text-2xl font-black text-slate-800 mt-1">
                  {analytics.totalDodges || 0}
                </span>
              </div>

              <div className="bg-emerald-50/60 border border-emerald-100 rounded-2xl p-3.5 text-center">
                <span className="text-xs font-semibold text-emerald-700">Confirmed Plans</span>
                <span className="block text-2xl font-black text-emerald-600 mt-1">
                  {analytics.submissions?.length || 0}
                </span>
              </div>

              <div className="bg-blue-50/60 border border-blue-100 rounded-2xl p-3.5 text-center">
                <span className="text-xs font-semibold text-blue-700">Last Visited</span>
                <span className="block text-xs font-bold text-blue-600 mt-2 truncate">
                  {lastVisitFormatted}
                </span>
              </div>
            </div>

            {/* Latest Booking Card */}
            <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/60">
              <h4 className="font-bold text-slate-800 text-sm mb-3 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <CalendarCheck className="w-4 h-4 text-indigo-600" />
                  Selected Hangout Plan
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    latestSubmission
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {latestSubmission ? 'Confirmed 🎉' : 'Pending'}
                </span>
              </h4>
              {latestSubmission ? (
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-700">
                  <div>
                    <strong className="text-indigo-600">Date:</strong> {latestSubmission.date}
                  </div>
                  <div>
                    <strong className="text-indigo-600">Time:</strong> {latestSubmission.time}
                  </div>
                  <div className="col-span-2">
                    <strong className="text-indigo-600">Place:</strong> {latestSubmission.place}
                  </div>
                  {latestSubmission.note && latestSubmission.note !== 'None' && (
                    <div className="col-span-2">
                      <strong className="text-indigo-600">Note:</strong> "{latestSubmission.note}"
                    </div>
                  )}
                  <div className="col-span-2 text-[10px] text-slate-400">
                    Confirmed: {new Date(latestSubmission.submittedAt).toLocaleString()}
                  </div>
                </div>
              ) : (
                <p className="italic text-xs text-slate-400">
                  No response submitted yet.
                </p>
              )}
            </div>

            {/* Zero-Backend Webhook Notifications */}
            <div className="border border-indigo-100 rounded-2xl p-4 bg-indigo-50/30">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                  <BellRing className="w-4 h-4 text-indigo-600" />
                  Instant Phone Notifications (Zero-Backend)
                </h4>
                <span className="text-[10px] bg-indigo-200 text-indigo-800 font-bold px-2 py-0.5 rounded-full">
                  Optional
                </span>
              </div>
              <p className="text-xs text-slate-600 mb-3">
                Paste a Discord Webhook URL to get pinged on your phone the instant she opens
                or submits the invitation:
              </p>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={webhookInput}
                  onChange={(e) => setWebhookInput(e.target.value)}
                  placeholder="https://discord.com/api/webhooks/..."
                  className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
                />
                <button
                  type="button"
                  onClick={handleSaveWebhook}
                  className="px-4 py-1.5 text-xs bg-slate-800 hover:bg-black text-white font-semibold rounded-xl transition"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={handleTestWebhook}
                  className="px-3 py-1.5 text-xs bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-semibold rounded-xl transition"
                >
                  Test
                </button>
              </div>
            </div>

            {/* Visit Log Table */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-slate-800 text-sm">Detailed Activity Log</h4>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleExportJSON}
                    className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" /> Export JSON
                  </button>
                  <button
                    type="button"
                    onClick={handleClearData}
                    className="text-xs font-semibold text-rose-500 hover:underline flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Clear
                  </button>
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden max-h-48 overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-600 font-semibold sticky top-0">
                    <tr>
                      <th className="p-2.5">#</th>
                      <th className="p-2.5">Timestamp</th>
                      <th className="p-2.5">Event</th>
                      <th className="p-2.5">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-600">
                    {!analytics.logs?.length ? (
                      <tr>
                        <td colSpan={4} className="p-3 text-center text-slate-400">
                          No activity logged yet
                        </td>
                      </tr>
                    ) : (
                      analytics.logs.slice(0, 50).map((entry, idx) => {
                        const d = new Date(entry.timestamp);
                        const timeStr = `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;
                        const detailsStr = Object.keys(entry.details || {}).length
                          ? JSON.stringify(entry.details)
                              .replace(/[{"}]/g, '')
                              .replace(/,/g, ', ')
                          : '-';

                        return (
                          <tr key={entry.id || idx}>
                            <td className="p-2 text-slate-400 font-mono text-[10px]">
                              {idx + 1}
                            </td>
                            <td className="p-2 whitespace-nowrap text-[11px] font-mono">
                              {timeStr}
                            </td>
                            <td className="p-2">
                              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-semibold">
                                {entry.type}
                              </span>
                            </td>
                            <td
                              className="p-2 text-[11px] truncate max-w-[180px]"
                              title={detailsStr}
                            >
                              {detailsStr}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Customization Settings */}
            <div className="border-t border-slate-100 pt-4">
              <h4 className="font-bold text-slate-800 text-sm mb-3">Customization</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">
                    Her Name / Nickname:
                  </label>
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder="e.g. Sarah (optional)"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-1 focus:ring-indigo-400"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">
                    Your WhatsApp Number (with country code):
                  </label>
                  <input
                    type="text"
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    placeholder="e.g. 919876543210 (without +)"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-1 focus:ring-indigo-400"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={handleSaveCustom}
                className="mt-3 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs transition"
              >
                Save Customizations
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
