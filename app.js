// Outside Date Invitation Web App
// 100% Frontend with Local Analytics & Optional Webhook Sync

(function () {
  'use strict';

  // --- STATE MANAGEMENT ---
  const STORAGE_KEYS = {
    ANALYTICS: 'outside_invitation_analytics_v1',
    SETTINGS: 'outside_invitation_settings_v1',
    ADMIN_SESSION: 'outside_invitation_admin_auth'
  };

  const defaultSettings = {
    herName: 'Cutie',
    adminPin: '1234',
    whatsAppNumber: '',
    webhookUrl: ''
  };

  let settings = loadSettings();
  let analytics = loadAnalytics();

  let currentStep = 1;
  let selectedDate = null;
  let selectedPlace = null;
  let selectedTime = null;
  let currentCalDate = new Date(); // Month navigation tracker

  // Playful 'No' button messages
  const playfulNoMessages = [
    "No 🙈",
    "Are you sure? 🥺",
    "Think again! 😉",
    "Wait, don't! 🏃‍♂️",
    "Almost got it!",
    "Error: 'No' disabled! 😅",
    "Try the other one! 👉",
    "Pleeease? 💖",
    "You can't catch me! 💨",
    "Give it a chance! 🥰"
  ];

  // --- DOM ELEMENTS ---
  const dom = {
    // Nav & Admin
    adminTriggerBtn: document.getElementById('adminTriggerBtn'),
    adminModal: document.getElementById('adminModal'),
    closeAdminModalBtn: document.getElementById('closeAdminModalBtn'),
    adminLockScreen: document.getElementById('adminLockScreen'),
    adminContentScreen: document.getElementById('adminContentScreen'),
    adminPinForm: document.getElementById('adminPinForm'),
    adminPinInput: document.getElementById('adminPinInput'),
    adminPinError: document.getElementById('adminPinError'),
    recipientName: document.getElementById('recipientName'),

    // Step 1
    step1: document.getElementById('step1'),
    buttonArena: document.getElementById('buttonArena'),
    yesBtn: document.getElementById('yesBtn'),
    noBtn: document.getElementById('noBtn'),
    noBtnText: document.getElementById('noBtnText'),
    dodgeNotice: document.getElementById('dodgeNotice'),
    heroEmoji: document.getElementById('heroEmoji'),

    // Progress
    progressContainer: document.getElementById('progressContainer'),
    stepIndicator: document.getElementById('stepIndicator'),
    stepPercent: document.getElementById('stepPercent'),
    progressBar: document.getElementById('progressBar'),

    // Step 2
    step2: document.getElementById('step2'),
    calendarDaysGrid: document.getElementById('calendarDaysGrid'),
    calCurrentMonthYear: document.getElementById('calCurrentMonthYear'),
    calPrevMonth: document.getElementById('calPrevMonth'),
    calNextMonth: document.getElementById('calNextMonth'),
    selectedDateDisplay: document.getElementById('selectedDateDisplay'),
    backToStep1Btn: document.getElementById('backToStep1Btn'),
    toStep3Btn: document.getElementById('toStep3Btn'),
    quickDateChips: document.getElementById('quickDateChips'),

    // Step 3
    step3: document.getElementById('step3'),
    placeOptionsContainer: document.getElementById('placeOptionsContainer'),
    customPlaceInput: document.getElementById('customPlaceInput'),
    backToStep2Btn: document.getElementById('backToStep2Btn'),
    toStep4Btn: document.getElementById('toStep4Btn'),

    // Step 4
    step4: document.getElementById('step4'),
    timeSlotsContainer: document.getElementById('timeSlotsContainer'),
    customTimePicker: document.getElementById('customTimePicker'),
    noteInput: document.getElementById('noteInput'),
    backToStep3Btn: document.getElementById('backToStep3Btn'),
    submitDatePlanBtn: document.getElementById('submitDatePlanBtn'),

    // Step 5
    step5: document.getElementById('step5'),
    recapDate: document.getElementById('recapDate'),
    recapPlace: document.getElementById('recapPlace'),
    recapTime: document.getElementById('recapTime'),
    recapNote: document.getElementById('recapNote'),
    recapNoteWrapper: document.getElementById('recapNoteWrapper'),
    whatsappShareBtn: document.getElementById('whatsappShareBtn'),
    replayBtn: document.getElementById('replayBtn'),

    // Admin Dashboard Elements
    statVisitCount: document.getElementById('statVisitCount'),
    statDodgeCount: document.getElementById('statDodgeCount'),
    statAcceptedCount: document.getElementById('statAcceptedCount'),
    statLastVisit: document.getElementById('statLastVisit'),
    bookingBadge: document.getElementById('bookingBadge'),
    bookingDetailsContainer: document.getElementById('bookingDetailsContainer'),
    visitLogsTableBody: document.getElementById('visitLogsTableBody'),
    exportDataBtn: document.getElementById('exportDataBtn'),
    clearDataBtn: document.getElementById('clearDataBtn'),
    webhookUrlInput: document.getElementById('webhookUrlInput'),
    saveWebhookBtn: document.getElementById('saveWebhookBtn'),
    testWebhookBtn: document.getElementById('testWebhookBtn'),
    settingHerName: document.getElementById('settingHerName'),
    settingWhatsAppNumber: document.getElementById('settingWhatsAppNumber'),
    saveCustomSettingsBtn: document.getElementById('saveCustomSettingsBtn'),
    heartCanvasContainer: document.getElementById('heartCanvasContainer')
  };

  // --- INITIALIZATION ---
  init();

  function init() {
    // 1. Process URL search params (e.g. ?name=Chloe&phone=123456)
    parseUrlParams();

    // 2. Render personalization
    renderPersonalization();

    // 3. Log current visit in analytics
    recordVisit();

    // 4. Setup floating background hearts
    createFloatingHearts();

    // 5. Initialize Lucide icons
    if (window.lucide) {
      window.lucide.createIcons();
    }

    // 6. Setup Event Listeners
    setupEventListeners();

    // 7. Check if user opened with #admin hash
    if (window.location.hash.toLowerCase() === '#admin') {
      openAdminModal();
    }
  }

  // --- SETTINGS & ANALYTICS PERSISTENCE ---
  function loadSettings() {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return saved ? { ...defaultSettings, ...JSON.parse(saved) } : { ...defaultSettings };
    } catch (e) {
      return { ...defaultSettings };
    }
  }

  function saveSettings(newSettings) {
    settings = { ...settings, ...newSettings };
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    renderPersonalization();
  }

  function loadAnalytics() {
    const defaultData = {
      totalVisits: 0,
      totalDodges: 0,
      submissions: [],
      logs: []
    };
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ANALYTICS);
      return saved ? { ...defaultData, ...JSON.parse(saved) } : defaultData;
    } catch (e) {
      return defaultData;
    }
  }

  function saveAnalytics() {
    localStorage.setItem(STORAGE_KEYS.ANALYTICS, JSON.stringify(analytics));
  }

  function logEvent(type, details = {}) {
    const entry = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2, 4),
      timestamp: new Date().toISOString(),
      type: type,
      details: details,
      userAgent: navigator.userAgent
    };
    analytics.logs.unshift(entry);
    if (analytics.logs.length > 200) analytics.logs.pop(); // Keep last 200 logs
    saveAnalytics();
    return entry;
  }

  function recordVisit() {
    analytics.totalVisits += 1;
    const entry = logEvent('page_visit', { visitNumber: analytics.totalVisits });
    saveAnalytics();

    // Optional cross-device webhook notification (if configured)
    triggerWebhookNotification(`👀 **Someone opened your Outside Invitation!** (Visit #${analytics.totalVisits})\n🕒 ${new Date().toLocaleTimeString()} on ${new Date().toLocaleDateString()}`);
  }

  function parseUrlParams() {
    const params = new URLSearchParams(window.location.search);
    if (params.has('name')) {
      settings.herName = params.get('name').trim();
    }
    if (params.has('phone')) {
      settings.whatsAppNumber = params.get('phone').trim();
    }
  }

  function renderPersonalization() {
    if (dom.recipientName) {
      dom.recipientName.textContent = settings.herName || 'Cutie';
    }
  }

  // --- FLOATING BACKGROUND HEARTS ---
  function createFloatingHearts() {
    if (!dom.heartCanvasContainer) return;
    const heartSymbols = ['💖', '🌸', '✨', '💕', '🌷', '🍬'];
    for (let i = 0; i < 15; i++) {
      const heart = document.createElement('div');
      heart.className = 'floating-heart';
      heart.textContent = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
      heart.style.left = `${Math.random() * 95}%`;
      heart.style.animationDuration = `${8 + Math.random() * 10}s`;
      heart.style.animationDelay = `${Math.random() * 8}s`;
      heart.style.fontSize = `${14 + Math.random() * 16}px`;
      dom.heartCanvasContainer.appendChild(heart);
    }
  }

  // --- RUNAWAY 'NO' BUTTON MECHANICS ---
  let dodgeCount = 0;
  let yesScale = 1;

  function dodgeNoButton(e) {
    dodgeCount++;
    analytics.totalDodges += 1;
    logEvent('no_button_dodge', { count: dodgeCount });

    // Update 'No' button text playfully
    const msgIndex = dodgeCount % playfulNoMessages.length;
    dom.noBtnText.textContent = playfulNoMessages[msgIndex];

    // Show dodge notice
    if (dodgeCount >= 2) {
      dom.dodgeNotice.classList.remove('opacity-0');
      dom.dodgeNotice.classList.add('opacity-100');
    }

    // Slightly increase 'Yes' button size & attractiveness
    if (yesScale < 1.35) {
      yesScale += 0.04;
      dom.yesBtn.style.transform = `scale(${yesScale})`;
    }

    // Calculate new position
    const arenaRect = dom.buttonArena.getBoundingClientRect();
    const btnRect = dom.noBtn.getBoundingClientRect();

    // Ensure it stays reachable inside viewport or container bounds
    const maxRelX = Math.max(10, arenaRect.width - btnRect.width - 20);
    const maxRelY = Math.max(10, arenaRect.height - btnRect.height - 10);

    const randomX = (Math.random() - 0.5) * (maxRelX * 1.5);
    const randomY = (Math.random() - 0.5) * 120;

    dom.noBtn.style.transform = `translate(${randomX}px, ${randomY}px)`;
    dom.noBtn.style.transition = 'transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1)';

    // Playful emoji reaction
    const emojis = ['🥺', '😳', '🤭', '🏃‍♂️', '💨', '🫣'];
    dom.heroEmoji.textContent = emojis[dodgeCount % emojis.length];

    // Prevent default touch behavior
    if (e && e.cancelable && e.type === 'touchstart') {
      e.preventDefault();
    }
  }

  // --- STEP TRANSITIONS & PROGRESS ---
  function showStep(stepNum) {
    currentStep = stepNum;

    // Sections list
    const steps = [dom.step1, dom.step2, dom.step3, dom.step4, dom.step5];
    steps.forEach((stepEl, idx) => {
      if (idx + 1 === stepNum) {
        stepEl.classList.remove('hidden');
        stepEl.classList.add('active');
      } else {
        stepEl.classList.add('hidden');
        stepEl.classList.remove('active');
      }
    });

    // Update Progress Bar
    if (stepNum > 1 && stepNum < 5) {
      dom.progressContainer.classList.remove('hidden');
      const progressSteps = { 2: 33, 3: 66, 4: 100 };
      const labels = { 2: 'Step 1 of 3: Choose Date', 3: 'Step 2 of 3: Choose Place', 4: 'Step 3 of 3: Choose Time' };
      const pct = progressSteps[stepNum] || 33;
      dom.progressBar.style.width = `${pct}%`;
      dom.stepIndicator.textContent = labels[stepNum];
      dom.stepPercent.textContent = `${pct}%`;
    } else {
      dom.progressContainer.classList.add('hidden');
    }

    // Scroll to top of card smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (window.lucide) window.lucide.createIcons();
  }

  // --- CONFETTI CELEBRATION ---
  function fireConfetti() {
    if (typeof confetti !== 'function') return;
    
    // Heart & stars confetti burst
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f43f5e', '#ec4899', '#a855f7', '#fbbf24']
    });

    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 }
      });
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 }
      });
    }, 250);
  }

  // --- CALENDAR IMPLEMENTATION ---
  function renderCalendar(dateObj) {
    dom.calendarDaysGrid.innerHTML = '';
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth();

    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    dom.calCurrentMonthYear.textContent = `${monthNames[month]} ${year}`;

    // First day of month & total days
    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Padding empty cells
    for (let i = 0; i < firstDayIndex; i++) {
      const emptyCell = document.createElement('div');
      emptyCell.className = 'cal-day-cell opacity-0 pointer-events-none';
      dom.calendarDaysGrid.appendChild(emptyCell);
    }

    // Date cells
    for (let day = 1; day <= totalDays; day++) {
      const cell = document.createElement('button');
      cell.type = 'button';
      cell.className = 'cal-day-cell text-slate-700';
      cell.textContent = day;

      const cellDate = new Date(year, month, day);
      cellDate.setHours(0, 0, 0, 0);

      // Disable past dates
      if (cellDate < today) {
        cell.classList.add('disabled');
      }

      // Check if today
      if (cellDate.getTime() === today.getTime()) {
        cell.classList.add('today');
      }

      // Check if selected
      if (selectedDate && cellDate.toDateString() === selectedDate.toDateString()) {
        cell.classList.add('selected');
      }

      cell.addEventListener('click', () => {
        selectDate(cellDate);
      });

      dom.calendarDaysGrid.appendChild(cell);
    }
  }

  function selectDate(dateObj) {
    selectedDate = dateObj;
    const formatted = dateObj.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    dom.selectedDateDisplay.textContent = `Selected Date: ${formatted} ✨`;
    dom.toStep3Btn.removeAttribute('disabled');

    // Re-render calendar to reflect selection style
    renderCalendar(currentCalDate);
    logEvent('date_selected', { date: formatted });
  }

  // --- EVENT LISTENERS SETUP ---
  function setupEventListeners() {
    // 1. Runaway 'No' Button hover/pointer/touch
    dom.noBtn.addEventListener('mouseenter', dodgeNoButton);
    dom.noBtn.addEventListener('mousemove', dodgeNoButton);
    dom.noBtn.addEventListener('touchstart', dodgeNoButton, { passive: false });
    dom.noBtn.addEventListener('click', (e) => {
      dodgeNoButton(e);
      e.preventDefault();
    });

    // 2. 'Yes' Button Click -> Confetti & Move to Step 2
    dom.yesBtn.addEventListener('click', () => {
      logEvent('yes_clicked', { dodgesBeforeYes: dodgeCount });
      fireConfetti();
      showStep(2);
      renderCalendar(currentCalDate);
    });

    // 3. Step 2: Calendar Month Navigation
    dom.calPrevMonth.addEventListener('click', () => {
      currentCalDate.setMonth(currentCalDate.getMonth() - 1);
      renderCalendar(currentCalDate);
    });

    dom.calNextMonth.addEventListener('click', () => {
      currentCalDate.setMonth(currentCalDate.getMonth() + 1);
      renderCalendar(currentCalDate);
    });

    // Quick Date Chips (Today, Tomorrow, Weekend)
    if (dom.quickDateChips) {
      dom.quickDateChips.querySelectorAll('.date-chip').forEach(btn => {
        btn.addEventListener('click', () => {
          const offset = btn.dataset.offset;
          const target = new Date();
          target.setHours(0, 0, 0, 0);

          if (offset === '1') {
            target.setDate(target.getDate() + 1);
          } else if (offset === 'weekend') {
            const currentDay = target.getDay(); // 0 is Sunday, 6 is Saturday
            const daysUntilSaturday = (6 - currentDay + 7) % 7 || 7;
            target.setDate(target.getDate() + daysUntilSaturday);
          }

          currentCalDate = new Date(target);
          selectDate(target);
        });
      });
    }

    // Step 2 Buttons
    dom.backToStep1Btn.addEventListener('click', () => showStep(1));
    dom.toStep3Btn.addEventListener('click', () => {
      if (selectedDate) showStep(3);
    });

    // 4. Step 3: Place Selection
    const placeCards = dom.placeOptionsContainer.querySelectorAll('.place-card');
    placeCards.forEach(card => {
      card.addEventListener('click', () => {
        placeCards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        selectedPlace = card.dataset.place;

        if (selectedPlace === 'Custom') {
          dom.customPlaceInput.focus();
        } else {
          dom.customPlaceInput.value = '';
        }
        dom.toStep4Btn.removeAttribute('disabled');
      });
    });

    dom.customPlaceInput.addEventListener('input', (e) => {
      if (e.target.value.trim().length > 0) {
        selectedPlace = e.target.value.trim();
        placeCards.forEach(c => c.classList.remove('selected'));
        const customCard = Array.from(placeCards).find(c => c.dataset.place === 'Custom');
        if (customCard) customCard.classList.add('selected');
        dom.toStep4Btn.removeAttribute('disabled');
      }
    });

    dom.backToStep2Btn.addEventListener('click', () => showStep(2));
    dom.toStep4Btn.addEventListener('click', () => {
      if (selectedPlace) {
        logEvent('place_selected', { place: selectedPlace });
        showStep(4);
      }
    });

    // 5. Step 4: Time Selection
    const timeSlotBtns = dom.timeSlotsContainer.querySelectorAll('.time-slot-btn');
    timeSlotBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        timeSlotBtns.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        selectedTime = btn.dataset.time;
        dom.customTimePicker.value = '';
        dom.submitDatePlanBtn.removeAttribute('disabled');
      });
    });

    dom.customTimePicker.addEventListener('change', (e) => {
      if (e.target.value) {
        timeSlotBtns.forEach(b => b.classList.remove('selected'));
        selectedTime = formatTime12h(e.target.value);
        dom.submitDatePlanBtn.removeAttribute('disabled');
      }
    });

    dom.backToStep3Btn.addEventListener('click', () => showStep(3));

    // Submit Date Plan
    dom.submitDatePlanBtn.addEventListener('click', submitFinalPlan);

    // Step 5 Replay
    dom.replayBtn.addEventListener('click', () => {
      showStep(1);
    });

    // 6. Admin Panel Triggers
    dom.adminTriggerBtn.addEventListener('click', openAdminModal);
    dom.closeAdminModalBtn.addEventListener('click', closeAdminModal);
    dom.adminPinForm.addEventListener('submit', handleAdminUnlock);
    dom.exportDataBtn.addEventListener('click', exportAnalyticsJSON);
    dom.clearDataBtn.addEventListener('click', clearAnalyticsData);
    dom.saveWebhookBtn.addEventListener('click', saveWebhookConfig);
    dom.testWebhookBtn.addEventListener('click', testWebhook);
    dom.saveCustomSettingsBtn.addEventListener('click', saveCustomConfig);

    // Close admin on backdrop click
    dom.adminModal.addEventListener('click', (e) => {
      if (e.target === dom.adminModal) closeAdminModal();
    });

    // Keyboard shortcut to open admin: Shift + A or Esc to close
    document.addEventListener('keydown', (e) => {
      if (e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        openAdminModal();
      }
      if (e.key === 'Escape' && !dom.adminModal.classList.contains('hidden')) {
        closeAdminModal();
      }
    });
  }

  function formatTime12h(timeStr) {
    if (!timeStr) return '';
    const [hours, minutes] = timeStr.split(':');
    let h = parseInt(hours, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${h}:${minutes} ${ampm}`;
  }

  // --- FINAL PLAN SUBMISSION ---
  function submitFinalPlan() {
    const formattedDate = selectedDate.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    const note = dom.noteInput.value.trim();

    const planData = {
      date: formattedDate,
      place: selectedPlace || 'Somewhere lovely',
      time: selectedTime || 'Flexible',
      note: note || 'None',
      submittedAt: new Date().toISOString()
    };

    // Save to analytics
    analytics.submissions.unshift(planData);
    logEvent('plan_confirmed', planData);

    // Update Step 5 Recap UI
    dom.recapDate.textContent = planData.date;
    dom.recapPlace.textContent = planData.place;
    dom.recapTime.textContent = planData.time;

    if (note) {
      dom.recapNote.textContent = `"${note}"`;
      dom.recapNoteWrapper.classList.remove('hidden');
    } else {
      dom.recapNoteWrapper.classList.add('hidden');
    }

    // Build WhatsApp Message Link
    const waText = encodeURIComponent(
      `Hey! I said YES to our date! 🥰\n\n` +
      `📅 Date: ${planData.date}\n` +
      `📍 Place: ${planData.place}\n` +
      `⏰ Time: ${planData.time}\n` +
      (note ? `💌 Note: ${note}\n` : '') +
      `\nCan't wait! ✨`
    );

    const waPhone = settings.whatsAppNumber ? settings.whatsAppNumber.replace(/[^0-9]/g, '') : '';
    dom.whatsappShareBtn.href = waPhone 
      ? `https://wa.me/${waPhone}?text=${waText}`
      : `https://api.whatsapp.com/send?text=${waText}`;

    // Fire big celebration confetti
    fireConfetti();
    setTimeout(fireConfetti, 500);

    // Move to Step 5
    showStep(5);

    // Send Webhook Alert
    triggerWebhookNotification(
      `🎉 **SHE SAID YES! DATE CONFIRMED!** 💖\n\n` +
      `📅 **Date:** ${planData.date}\n` +
      `📍 **Place:** ${planData.place}\n` +
      `⏰ **Time:** ${planData.time}\n` +
      `💌 **Note:** ${planData.note}\n` +
      `🏃‍♂️ **'No' Dodges:** ${analytics.totalDodges}\n` +
      `👀 **Total Visits:** ${analytics.totalVisits}`
    );
  }

  // --- WEBHOOK ZERO-BACKEND ALERTS ---
  function triggerWebhookNotification(content) {
    if (!settings.webhookUrl || !settings.webhookUrl.startsWith('http')) return;

    try {
      // If it's a Discord Webhook
      if (settings.webhookUrl.includes('discord.com/api/webhooks')) {
        fetch(settings.webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: "Date Invitation Tracker 💌",
            avatar_url: "https://em-content.zobj.net/source/microsoft-teams/363/sparkling-heart_1f496.png",
            content: content
          })
        }).catch(err => console.warn('Webhook notification error:', err));
      } else {
        // Formspree or generic webhook
        fetch(settings.webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: content })
        }).catch(err => console.warn('Generic webhook notification error:', err));
      }
    } catch (e) {
      console.warn('Could not post to webhook:', e);
    }
  }

  // --- ADMIN DASHBOARD MODAL LOGIC ---
  function openAdminModal() {
    dom.adminModal.classList.remove('hidden');
    const isAuthed = sessionStorage.getItem(STORAGE_KEYS.ADMIN_SESSION) === 'true';

    if (isAuthed) {
      showAdminDashboard();
    } else {
      dom.adminLockScreen.classList.remove('hidden');
      dom.adminContentScreen.classList.add('hidden');
      dom.adminPinInput.value = '';
      dom.adminPinError.classList.add('hidden');
      setTimeout(() => dom.adminPinInput.focus(), 150);
    }

    if (window.lucide) window.lucide.createIcons();
  }

  function closeAdminModal() {
    dom.adminModal.classList.add('hidden');
    // Clean up #admin hash from URL if present
    if (window.location.hash.toLowerCase() === '#admin') {
      history.replaceState(null, null, ' ');
    }
  }

  function handleAdminUnlock(e) {
    e.preventDefault();
    const pin = dom.adminPinInput.value.trim();
    if (pin === settings.adminPin || pin === '1234') {
      sessionStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, 'true');
      showAdminDashboard();
    } else {
      dom.adminPinError.classList.remove('hidden');
      dom.adminPinInput.value = '';
      dom.adminPinInput.focus();
    }
  }

  function showAdminDashboard() {
    dom.adminLockScreen.classList.add('hidden');
    dom.adminContentScreen.classList.remove('hidden');

    // Update Stats
    dom.statVisitCount.textContent = analytics.totalVisits || 0;
    dom.statDodgeCount.textContent = analytics.totalDodges || 0;
    dom.statAcceptedCount.textContent = analytics.submissions.length || 0;

    const lastVisitLog = analytics.logs.find(l => l.type === 'page_visit');
    if (lastVisitLog) {
      const d = new Date(lastVisitLog.timestamp);
      dom.statLastVisit.textContent = `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      dom.statLastVisit.textContent = 'None yet';
    }

    // Latest Booking Details
    if (analytics.submissions.length > 0) {
      const latest = analytics.submissions[0];
      dom.bookingBadge.className = "text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700";
      dom.bookingBadge.textContent = "Accepted 🎉";

      dom.bookingDetailsContainer.innerHTML = `
        <div class="grid grid-cols-2 gap-2 text-slate-700">
          <div><strong class="text-pink-600">Date:</strong> ${latest.date}</div>
          <div><strong class="text-pink-600">Time:</strong> ${latest.time}</div>
          <div class="col-span-2"><strong class="text-pink-600">Place:</strong> ${latest.place}</div>
          ${latest.note && latest.note !== 'None' ? `<div class="col-span-2"><strong class="text-pink-600">Note:</strong> "${latest.note}"</div>` : ''}
          <div class="col-span-2 text-[10px] text-slate-400">Confirmed at: ${new Date(latest.submittedAt).toLocaleString()}</div>
        </div>
      `;
    } else {
      dom.bookingBadge.className = "text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-200 text-slate-600";
      dom.bookingBadge.textContent = "Waiting for response";
      dom.bookingDetailsContainer.innerHTML = `<p class="italic text-slate-400">She hasn't finished selecting yet.</p>`;
    }

    // Populate Settings Inputs
    dom.webhookUrlInput.value = settings.webhookUrl || '';
    dom.settingHerName.value = settings.herName || '';
    dom.settingWhatsAppNumber.value = settings.whatsAppNumber || '';

    // Populate Activity Logs Table
    dom.visitLogsTableBody.innerHTML = '';
    if (analytics.logs.length === 0) {
      dom.visitLogsTableBody.innerHTML = `<tr><td colspan="4" class="p-3 text-center text-slate-400">No activity logged yet</td></tr>`;
    } else {
      analytics.logs.slice(0, 50).forEach((entry, idx) => {
        const row = document.createElement('tr');
        const d = new Date(entry.timestamp);
        const timeFormatted = `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;
        
        let eventBadge = '';
        if (entry.type === 'page_visit') {
          eventBadge = '<span class="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-semibold text-[10px]">Page Visit</span>';
        } else if (entry.type === 'no_button_dodge') {
          eventBadge = '<span class="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 font-semibold text-[10px]">No Hovered/Dodged</span>';
        } else if (entry.type === 'yes_clicked') {
          eventBadge = '<span class="px-2 py-0.5 rounded-full bg-pink-100 text-pink-700 font-semibold text-[10px]">Yes Clicked! 🥰</span>';
        } else if (entry.type === 'plan_confirmed') {
          eventBadge = '<span class="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-semibold text-[10px]">Plan Submitted 🎉</span>';
        } else {
          eventBadge = `<span class="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px]">${entry.type}</span>`;
        }

        const detailsText = Object.keys(entry.details).length 
          ? JSON.stringify(entry.details).replace(/[{"}]/g, '').replace(/,/g, ', ') 
          : '-';

        row.innerHTML = `
          <td class="p-2 text-slate-400 font-mono text-[10px]">${idx + 1}</td>
          <td class="p-2 whitespace-nowrap text-[11px] font-mono">${timeFormatted}</td>
          <td class="p-2">${eventBadge}</td>
          <td class="p-2 text-[11px] truncate max-w-[180px]" title="${detailsText}">${detailsText}</td>
        `;
        dom.visitLogsTableBody.appendChild(row);
      });
    }

    if (window.lucide) window.lucide.createIcons();
  }

  function exportAnalyticsJSON() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(analytics, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", `invitation_records_${new Date().toISOString().slice(0, 10)}.json`);
    dlAnchorElem.click();
  }

  function clearAnalyticsData() {
    if (confirm("Are you sure you want to clear all visit records and activity logs?")) {
      analytics = {
        totalVisits: 0,
        totalDodges: 0,
        submissions: [],
        logs: []
      };
      saveAnalytics();
      showAdminDashboard();
    }
  }

  function saveWebhookConfig() {
    const url = dom.webhookUrlInput.value.trim();
    saveSettings({ webhookUrl: url });
    alert("Webhook URL saved successfully!");
  }

  function testWebhook() {
    const url = dom.webhookUrlInput.value.trim();
    if (!url) {
      alert("Please enter a Webhook URL first.");
      return;
    }
    saveSettings({ webhookUrl: url });
    triggerWebhookNotification("🧪 **Test Alert:** Your Outside Invitation webhook is configured and working perfectly!");
    alert("Test alert sent! Check your Discord channel or webhook receiver.");
  }

  function saveCustomConfig() {
    const herName = dom.settingHerName.value.trim();
    const phone = dom.settingWhatsAppNumber.value.trim();
    saveSettings({ herName: herName || 'Cutie', whatsAppNumber: phone });
    alert("Settings saved! Page updated.");
  }

})();
