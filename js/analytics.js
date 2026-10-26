import posthog from 'posthog-js/dist/module.no-external';

const KEY = import.meta.env.VITE_POSTHOG_KEY;
const HOST = import.meta.env.VITE_POSTHOG_HOST || 'https://eu.i.posthog.com';

let isReady = false;

function clearLegacyPostHogPersistence() {
  if (typeof window === 'undefined') return;
  const storageKey = `ph_${KEY}_posthog`;

  try {
    window.localStorage.removeItem(storageKey);
  } catch (err) { }
  try {
    window.sessionStorage.removeItem(storageKey);
  } catch (err) { }
  try {
    document.cookie = `${storageKey}=; Max-Age=0; Path=/; SameSite=Lax`;
  } catch (err) { }
}

export const Analytics = {
  init() {
    // Só inicializa se houver uma chave válida configurada
    if (!KEY || KEY === 'phc_tua_chave_aqui' || isReady) return;

    try {
      // Remove the old persistent PostHog identity from previous versions.
      clearLegacyPostHogPersistence();
      posthog.init(KEY, {
        api_host: HOST,
        cookieless_mode: 'always',
        person_profiles: 'never',
        autocapture: false,
        capture_pageview: false,
        capture_pageleave: false,
        disable_session_recording: true,
        disable_surveys: true,
        save_campaign_params: false,
        before_send: (event) => ({ ...event, properties: {} })
      });
      isReady = true;
    } catch (err) {
      console.warn('[Analytics] Bypass init:', err);
    }
  },

  track(eventName) {
    if (!isReady) return;
    try {
      // Event names show which feature was used. Call-site properties are deliberately ignored.
      posthog.capture(eventName);
    } catch (e) { }
  }
};

// Trello Power-Up pages import this module directly, outside main.js.
// Initialize here so their explicitly tracked events are actually sent.
Analytics.init();
