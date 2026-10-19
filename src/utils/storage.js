// Local Storage & Analytics Manager (100% Frontend)

export const STORAGE_KEYS = {
  ANALYTICS: 'outside_invitation_analytics_v1',
  SETTINGS: 'outside_invitation_settings_v1',
  ADMIN_SESSION: 'outside_invitation_admin_auth'
};

export const defaultSettings = {
  herName: '',
  adminPin: '1234',
  whatsAppNumber: '917760718421',
  webhookUrl: ''
};

export function loadSettings() {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return saved ? { ...defaultSettings, ...JSON.parse(saved) } : { ...defaultSettings };
  } catch (e) {
    return { ...defaultSettings };
  }
}

export function saveSettings(newSettings) {
  const current = loadSettings();
  const updated = { ...current, ...newSettings };
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
  return updated;
}

export function loadAnalytics() {
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

export function saveAnalytics(analytics) {
  localStorage.setItem(STORAGE_KEYS.ANALYTICS, JSON.stringify(analytics));
}

export function logEvent(type, details = {}) {
  const analytics = loadAnalytics();
  const entry = {
    id: Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
    timestamp: new Date().toISOString(),
    type,
    details,
    userAgent: navigator.userAgent
  };
  analytics.logs.unshift(entry);
  if (analytics.logs.length > 200) analytics.logs.pop();
  saveAnalytics(analytics);
  return entry;
}

export function recordVisit(webhookUrl) {
  const analytics = loadAnalytics();
  analytics.totalVisits += 1;
  const entry = {
    id: Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
    timestamp: new Date().toISOString(),
    type: 'page_visit',
    details: { visitNumber: analytics.totalVisits },
    userAgent: navigator.userAgent
  };
  analytics.logs.unshift(entry);
  saveAnalytics(analytics);
  return analytics;
}
