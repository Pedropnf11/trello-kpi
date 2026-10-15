import posthog from 'posthog-js';

const KEY = import.meta.env.VITE_POSTHOG_KEY;
const HOST = import.meta.env.VITE_POSTHOG_HOST || 'https://eu.i.posthog.com';

let isReady = false;

export const Analytics = {
  init() {
    // Só inicializa se houver uma chave válida configurada
    if (!KEY || KEY === 'phc_tua_chave_aqui' || isReady) return;

    try {
      posthog.init(KEY, {
        api_host: HOST,
        persistence: 'localStorage', // Crítico para funcionar perfeitamente dentro dos iframes do Trello
        autocapture: false,          // Cumpre Trello Guidelines: não captura cliques indiscriminados
        capture_pageview: true,
        disable_session_recording: true // Cumpre Trello Guidelines: sem gravação de ecrã/sessão para não expor cartões ou dados de clientes
      });
      isReady = true;
    } catch (err) {
      console.warn('[Analytics] Bypass init:', err);
    }
  },

  identify(userId, traits = {}) {
    if (!isReady) return;
    try {
      posthog.identify(userId, traits);
    } catch (e) {}
  },

  track(eventName, properties = {}) {
    if (!isReady) return;
    try {
      posthog.capture(eventName, properties);
    } catch (e) {}
  }
};
