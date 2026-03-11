// Landing Page UI Templates — Premium Dark (KPI Master · Real Estate Edition)

// ─────────────────────────────────────────────
// TRANSLATION ENGINE
// ─────────────────────────────────────────────
UI._lpLang = localStorage.getItem('kpi_lp_lang') || 'pt';

UI.landingTranslations = {
    // Navbar
    'nav-features': { pt: 'Funcionalidades', en: 'Features' },
    'nav-docs': { pt: 'Documentos', en: 'Documents' },
    'nav-profiles': { pt: 'Perfis', en: 'Profiles' },
    'nav-login-btn': { pt: 'Entrar na plataforma →', en: 'Enter platform →' },
    'nav-badge': { pt: 'Imobiliário', en: 'Real Estate' },
    // Hero
    'hero-urgency': { pt: 'Consultores imobiliários estão a perder leads todos os dias — sem saber.', en: 'Real estate agents are losing leads every day — without knowing it.' },
    'hero-h1-1': { pt: 'Os teus leads estão no', en: 'Your leads are in' },
    'hero-h1-2': { pt: 'Trello. Os teus resultados', en: 'Trello. Your results' },
    'hero-h1-3': { pt: 'estão a escapar-te.', en: 'are slipping away.' },
    'hero-desc': { pt: 'O KPI Master liga-se ao teu Trello e mostra-te em tempo real quais os leads a perder tração, quem da equipa está a produzir e o que tens de fazer agora.', en: 'KPI Master connects to your Trello and shows you in real time which leads are losing traction, who on the team is producing, and what you need to do right now.' },
    'hero-cta-main': { pt: 'Ligar o meu Trello — é grátis', en: 'Connect my Trello — it\'s free' },
    'hero-cta-secondary': { pt: 'Ver como funciona →', en: 'See how it works →' },
    // Pain Points
    'pain-eyebrow': { pt: 'Reconheces algum destes cenários?', en: 'Do any of these sound familiar?' },
    'pain-h2': { pt: 'Os problemas que custam negócios todos os meses', en: 'The problems costing you deals every month' },
    'pain-desc': { pt: 'Cada lead parado é dinheiro parado. O KPI Master é a ferramenta que faz o aviso antes de ser tarde.', en: 'Every stalled lead is stalled money. KPI Master is the tool that warns you before it\'s too late.' },
    'pain-0-pain': { pt: 'Leads parados há semanas que nunca chegaste a reativar', en: 'Leads stalled for weeks that you never managed to reactivate' },
    'pain-0-fix': { pt: 'A Focus Zone alerta-te automaticamente com prioridade por dias sem contacto', en: 'Focus Zone alerts you automatically, prioritised by days without contact' },
    'pain-1-pain': { pt: 'Não sabes qual consultor está a produzir e qual está estagnado', en: "You don't know which agent is producing and which is stagnant" },
    'pain-1-fix': { pt: 'Rankings automáticos com leads, visitas, propostas e contratos por membro', en: 'Automatic rankings with leads, visits, proposals and contracts per member' },
    'pain-2-pain': { pt: 'Perdes horas a preparar relatórios para reuniões semanais', en: 'You waste hours preparing reports for weekly meetings' },
    'pain-2-fix': { pt: 'PDF/CSV/Email gerado automaticamente com um clique — em segundos', en: 'PDF/CSV/Email generated automatically with one click — in seconds' },
    'pain-3-pain': { pt: 'Propostas enviadas que ficam sem follow-up e morrem', en: 'Sent proposals that go without follow-up and die' },
    'pain-3-fix': { pt: 'Time Tracking mostra quanto tempo cada lead está parado em "Proposta Enviada"', en: 'Time Tracking shows how long each lead has been stuck in "Proposal Sent"' },
    // Features
    'feat-eyebrow': { pt: 'O que inclui', en: 'What\'s included' },
    'feat-h2-1': { pt: 'Construído para imobiliário.', en: 'Built for real estate.' },
    'feat-h2-2': { pt: 'Ligado ao teu Trello.', en: 'Connected to your Trello.' },
    'feat-desc': { pt: 'Todas as funcionalidades que uma agência ou consultor independente precisa para não perder leads — sem mudar o que já usa.', en: 'Every feature an agency or independent agent needs to stop losing leads — without changing what they already use.' },
    'feat-0-title': { pt: 'Pipeline Imobiliário em Tempo Real', en: 'Real-Time Real Estate Pipeline' },
    'feat-0-desc': { pt: 'Vê quantos leads estão em cada fase — Contacto, Visita, Proposta, Fecho — e onde estão a perder-se. Atualizado cada vez que mexes no Trello.', en: 'See how many leads are in each stage — Contact, Visit, Proposal, Close — and where they\'re being lost. Updated every time you touch Trello.' },
    'feat-0-tag': { pt: 'Base', en: 'Base' },
    'feat-1-title': { pt: 'Alertas de Leads a Arrefecer', en: 'Cooling Lead Alerts' },
    'feat-1-desc': { pt: 'Quando um lead fica X dias sem movimento, a Focus Zone avisa-te automaticamente. Nunca mais perdes um cliente por falta de follow-up.', en: 'When a lead goes X days without activity, Focus Zone alerts you automatically. Never lose a client to lack of follow-up again.' },
    'feat-1-tag': { pt: 'Mais Usado', en: 'Most Used' },
    'feat-2-title': { pt: 'Tempo por Fase do Pipeline', en: 'Time per Pipeline Stage' },
    'feat-2-desc': { pt: 'Quanto tempo em média fica um lead parado em "Visita Marcada"? O Time Tracking responde. Identifica o gargalo e trata-o antes de perder o cliente.', en: 'How long does a lead sit in "Visit Scheduled" on average? Time Tracking answers that. Spot the bottleneck and fix it before losing the client.' },
    'feat-3-title': { pt: 'Ranking da Equipa Automático', en: 'Automatic Team Ranking' },
    'feat-3-desc': { pt: 'Leads, visitas, propostas e contratos por consultor — numa tabela que se atualiza sozinha. Sem perguntar, sem reuniões de acompanhamento.', en: 'Leads, visits, proposals and contracts per agent — in a self-updating table. No asking, no check-in meetings.' },
    'feat-4-title': { pt: 'Scripts e Documentos de Reativação', en: 'Reactivation Scripts & Documents' },
    'feat-4-desc': { pt: 'Acesso a guias de reativação de leads frios, scripts de follow-up por fase e templates de email — criados especificamente para o imobiliário.', en: 'Access to cold lead reactivation guides, stage-specific follow-up scripts and email templates — built specifically for real estate.' },
    'feat-4-tag': { pt: 'Exclusivo', en: 'Exclusive' },
    'feat-5-title': { pt: 'Relatórios com Um Clique', en: 'One-Click Reports' },
    'feat-5-desc': { pt: 'PDF para apresentar ao diretor, CSV para análise própria, ou email automático toda a segunda-feira. O fim das tardes de domingo a preparar relatórios.', en: 'PDF for the director, CSV for your own analysis, or auto email every Monday. The end of Sunday afternoons preparing reports.' },
    'feat-6-title': { pt: 'Login em 30 Segundos', en: 'Login in 30 Seconds' },
    'feat-6-desc': { pt: 'Ligação direta com a tua conta Trello via OAuth. Sem registos, sem passwords novas, sem IT. Ligas e está pronto.', en: 'Direct connection to your Trello account via OAuth. No sign-ups, no new passwords, no IT. Connect and you\'re ready.' },
    'feat-7-title': { pt: 'Vista do Consultor Individual', en: 'Individual Agent View' },
    'feat-7-desc': { pt: 'Cada membro da equipa tem a sua própria vista: só o seu pipeline, os seus leads críticos e as suas métricas. Sem ver o que não é seu.', en: "Each team member has their own view: just their pipeline, their critical leads and their metrics. Without seeing what isn't theirs." },
    'feat-8-title': { pt: 'Analytics Completo', en: 'Full Analytics' },
    'feat-8-desc': { pt: 'Taxa de conversão real por fase, evolução semanal e dispersão por consultor. Dados que antes demoravam horas a calcular, agora a um olhar.', en: 'Real conversion rate per stage, weekly evolution and dispersion by agent. Data that used to take hours to calculate, now at a glance.' },
    // Audience
    'aud-eyebrow': { pt: 'Para quem é', en: 'Who it\'s for' },
    'aud-h2': { pt: 'Ideal para qualquer equipa que use Trello como CRM', en: 'Ideal for any team using Trello as a CRM' },
    'aud-desc': { pt: 'O KPI Master não substitui o teu Trello — amplifica-o. Se já organizas leads em quadros Trello, estás a um clique de ter os dados a trabalhar para ti.', en: "KPI Master doesn't replace your Trello — it amplifies it. If you already organise leads in Trello boards, you're one click away from your data working for you." },
    'aud-0-label': { pt: 'Agências Imobiliárias', en: 'Real Estate Agencies' },
    'aud-0-desc': { pt: 'Equipas de 3 a 20 consultores que gerem leads no Trello e precisam de visibilidade sobre o pipeline sem Excel ou reuniões de acompanhamento.', en: 'Teams of 3 to 20 agents who manage leads in Trello and need pipeline visibility without Excel or check-in meetings.' },
    'aud-1-label': { pt: 'Consultores Independentes', en: 'Independent Agents' },
    'aud-1-desc': { pt: 'Mediadores a trabalhar sozinhos que querem saber quais os leads a contactar hoje, quais as propostas paradas e como está a correr o mês.', en: 'Solo brokers who want to know which leads to contact today, which proposals are stalled and how the month is going.' },
    'aud-2-label': { pt: 'Equipas Comerciais B2B', en: 'B2B Sales Teams' },
    'aud-2-desc': { pt: 'Startups e PMEs com pipeline de vendas no Trello que precisam de saber qual o lead mais quente, quem está a produzir e qual a taxa de conversão real.', en: 'Startups and SMBs with a Trello sales pipeline who need to know the hottest lead, who\'s producing and the real conversion rate.' },
    'aud-3-label': { pt: 'Account Managers', en: 'Account Managers' },
    'aud-3-desc': { pt: 'Profissionais que gerem um portefólio de clientes no Trello e perdem horas a compilar relatórios semanais manualmente para apresentar à chefia.', en: 'Professionals who manage a client portfolio in Trello and waste hours manually compiling weekly reports to present to management.' },
    'aud-note': { pt: 'Se a tua equipa usa o Trello como CRM informal — listas como "Lead", "Visita Marcada", "Proposta", "Fecho" — o KPI Master lê esses dados e transforma-os num dashboard de performance em tempo real. Sem configurações, sem integrações, sem IT.', en: 'If your team uses Trello as an informal CRM — lists like "Lead", "Visit Scheduled", "Proposal", "Close" — KPI Master reads that data and turns it into a real-time performance dashboard. No setup, no integrations, no IT.' },
    // Profiles
    'prof-eyebrow': { pt: 'Para quem é', en: 'Who it\'s for' },
    'prof-h2-1': { pt: 'Feito para o imobiliário.', en: 'Built for real estate.' },
    'prof-h2-2': { pt: 'Para todos os papéis.', en: 'For every role.' },
    'prof-desc': { pt: 'O teu cargo define o que vês. Sem informação a mais, sem confusão. Só o que precisas para agir.', en: 'Your role defines what you see. No clutter, no confusion. Just what you need to act.' },
    'prof-mgr-title': { pt: 'Diretor / Gestor', en: 'Director / Manager' },
    'prof-mgr-badge': { pt: 'Visão completa da agência', en: 'Full agency overview' },
    'prof-mgr-desc': { pt: 'Chega de perguntar à equipa como estão os números. Abre o dashboard de manhã e já sabes quem precisa de suporte, qual o lead mais crítico e qual o consultor do mês.', en: "Stop asking the team how the numbers look. Open the dashboard in the morning and you already know who needs support, the most critical lead and the agent of the month." },
    'prof-mgr-li-0': { pt: 'Pipeline completo da agência por fase e por consultor', en: 'Full agency pipeline by stage and by agent' },
    'prof-mgr-li-1': { pt: 'Ranking automático — sem Excel, sem cálculos manuais', en: 'Automatic ranking — no Excel, no manual calculations' },
    'prof-mgr-li-2': { pt: 'Alertas de leads críticos antes de se perderem definitivamente', en: 'Critical lead alerts before they\'re lost for good' },
    'prof-mgr-li-3': { pt: 'Relatório semanal PDF automático para reuniões', en: 'Automatic weekly PDF report for meetings' },
    'prof-mgr-li-4': { pt: 'Taxa de conversão real por fase e por elemento da equipa', en: 'Real conversion rate per stage and per team member' },
    'prof-cons-title': { pt: 'Consultor Imobiliário', en: 'Real Estate Agent' },
    'prof-cons-badge': { pt: 'Foco nos teus próprios números', en: 'Focus on your own numbers' },
    'prof-cons-desc': { pt: 'Entras e sabes o que fazer hoje. Quais os leads a contactar, quais as propostas sem resposta e como estás a correr este mês — sem perguntar ao diretor.', en: 'You log in and know what to do today. Which leads to contact, which proposals have no reply and how your month is going — without asking the director.' },
    'prof-cons-li-0': { pt: 'O teu pipeline pessoal — fase a fase, lead a lead', en: 'Your personal pipeline — stage by stage, lead by lead' },
    'prof-cons-li-1': { pt: 'Focus Zone: o sistema diz-te quem contactar hoje', en: 'Focus Zone: the system tells you who to contact today' },
    'prof-cons-li-2': { pt: 'Os teus contratos e taxa de conversão vs. mês anterior', en: 'Your contracts and conversion rate vs. previous month' },
    'prof-cons-li-3': { pt: 'Alertas para leads que arrefecem dentro do teu portefólio', en: 'Alerts for leads cooling within your portfolio' },
    'prof-cons-li-4': { pt: 'Acesso direto aos scripts de reativação quando precisas', en: 'Direct access to reactivation scripts when you need them' },
    // CTA
    'cta-eyebrow': { pt: 'Começa hoje · É grátis', en: 'Start today · It\'s free' },
    'cta-h2-1': { pt: 'O teu Trello já tem os dados.', en: 'Your Trello already has the data.' },
    'cta-h2-2': { pt: 'O que falta são os alertas.', en: 'What\'s missing are the alerts.' },
    'cta-desc': { pt: 'Conecta o teu quadro Trello agora — em menos de 2 minutos tens o pipeline ativo, os leads críticos identificados e os scripts de reativação disponíveis.', en: 'Connect your Trello board now — in under 2 minutes you have an active pipeline, critical leads identified and reactivation scripts available.' },
    'cta-note': { pt: 'Sem Excel. Sem configurações. Sem IT. Só o teu Trello, transformado numa máquina de não perder leads.', en: 'No Excel. No setup. No IT. Just your Trello, turned into a lead-keeping machine.' },
    'cta-btn': { pt: 'Ligar o meu Trello — é grátis', en: 'Connect my Trello — it\'s free' },
    'cta-trust-0': { pt: '100% gratuito', en: '100% free' },
    'cta-trust-1': { pt: 'Sem cartão de crédito', en: 'No credit card' },
    'cta-trust-2': { pt: 'Liga em 2 minutos', en: 'Ready in 2 minutes' },
    'cta-trust-3': { pt: 'Scripts de reativação incluídos', en: 'Reactivation scripts included' },
    // Footer
    'footer-badge': { pt: 'Imobiliário', en: 'Real Estate' },
    'footer-copy': { pt: `© ${new Date().getFullYear()} KPI Master. Feito para consultores imobiliários que usam Trello.`, en: `© ${new Date().getFullYear()} KPI Master. Built for real estate agents who use Trello.` },
    'footer-privacy': { pt: 'Privacidade', en: 'Privacy' },
    'footer-terms': { pt: 'Termos', en: 'Terms' },
    'footer-contact': { pt: 'Contacto', en: 'Contact' },
};

UI.applyLandingTranslation = function (lang) {
    UI._lpLang = lang;
    localStorage.setItem('kpi_lp_lang', lang);
    document.querySelectorAll('[data-translate]').forEach(el => {
        const key = el.dataset.translate;
        const map = UI.landingTranslations[key];
        if (map && map[lang] !== undefined) {
            el.innerHTML = map[lang];
        }
    });
    // Update toggle button labels (desktop + mobile)
    const label = lang === 'pt'
        ? `<span style="opacity:.4">PT</span> <span style="opacity:.15">|</span> EN`
        : `PT <span style="opacity:.15">|</span> <span style="opacity:.4">EN</span>`;
    const btn = document.getElementById('lpLangToggleBtn');
    if (btn) btn.innerHTML = label;
    const btnMob = document.getElementById('lpLangToggleBtnMob');
    if (btnMob) btnMob.innerHTML = label;
};


/* --- LP STYLES --- */
const _lpStyle = `
<style id="lp-styles">
*{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#06080f;
  --bg1:#0b0e17;
  --bg2:#0f1320;
  --border:rgba(255,255,255,0.07);
  --border2:rgba(255,255,255,0.04);
  --text:#f1f5f9;
  --muted:#64748b;
  --muted2:#475569;
  --blue:#3b82f6;
  --blue-dark:#2563eb;
  --blue-glow:rgba(59,130,246,0.15);
}
.lp *{font-family:'Inter',-apple-system,BlinkMacSystemFont,sans-serif;}
.lp section{padding:96px 24px;}
.lp .wrap{max-width:1080px;margin:0 auto;}
.lp .pill{
  display:inline-flex;align-items:center;gap:7px;
  padding:5px 14px;border-radius:999px;
  font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;
  border:1px solid rgba(59,130,246,0.25);
  color:#93c5fd;background:rgba(59,130,246,0.08);
  margin-bottom:24px;
}
.lp h2.section-title{
  font-size:clamp(30px,4vw,46px);font-weight:800;
  color:#f1f5f9;letter-spacing:-0.025em;line-height:1.12;
  margin-bottom:16px;
}
.lp p.section-sub{
  font-size:16px;color:var(--muted);line-height:1.7;
  max-width:600px;
}
.lp .card{
  background:var(--bg1);
  border:1px solid var(--border);
  border-radius:16px;
  transition:border-color .2s;
}
.lp .card:hover{border-color:rgba(255,255,255,0.12);}
.lp .btn-primary{
  display:inline-flex;align-items:center;gap:9px;
  background:var(--blue-dark);color:#fff;
  border:none;border-radius:10px;
  padding:13px 28px;font-size:14px;font-weight:700;
  cursor:pointer;letter-spacing:-.01em;
  box-shadow:0 4px 20px rgba(37,99,235,0.35);
  transition:all .2s;
}
.lp .btn-primary:hover{background:#1d4ed8;box-shadow:0 8px 30px rgba(37,99,235,0.5);transform:translateY(-1px);}
.lp .btn-ghost{
  display:inline-flex;align-items:center;gap:8px;
  background:transparent;color:var(--muted);
  border:1px solid var(--border);border-radius:10px;
  padding:13px 28px;font-size:14px;font-weight:600;
  cursor:pointer;transition:all .2s;
}
.lp .btn-ghost:hover{color:var(--text);border-color:rgba(255,255,255,0.15);}
.lp .check-item{display:flex;align-items:flex-start;gap:10px;margin-bottom:12px;}
.lp .check-icon{
  width:20px;height:20px;border-radius:50%;flex-shrink:0;margin-top:1px;
  background:rgba(34,197,94,0.12);border:1px solid rgba(34,197,94,0.25);
  display:flex;align-items:center;justify-content:center;
}
@keyframes lp-fade-up{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}
.lp-section-anim{animation:lp-fade-up .5s ease both;}

/* --- ANIMATIONS --- */
@keyframes lp-fade-up { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
@keyframes lp-fade-in { from { opacity: 0; } to { opacity: 1; } }
@keyframes lp-typing { from { width: 0; } to { width: 100%; } }
@keyframes lp-blink { 50% { border-color: transparent; } }
@keyframes lp-slide-right { from { width: 0; } }

.lp-anim-hidden { opacity: 0; transform: translateY(30px); transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1); }
.lp-anim-hidden.is-visible { opacity: 1; transform: translateY(0); }
.lp-fade-hidden { opacity: 0; transition: opacity 1s ease-out; }
.lp-fade-hidden.is-visible { opacity: 1; }
.lp-delay-1 { transition-delay: 0.1s; }
.lp-delay-2 { transition-delay: 0.2s; }
.lp-delay-3 { transition-delay: 0.3s; }

.lp-typing-txt {
    display: inline-block;
    overflow: hidden;
    white-space: nowrap;
    border-right: 3px solid var(--blue);
    width: 0;
}
.lp-typing-txt.is-visible {
    animation: lp-typing 2.5s steps(40, end) forwards, lp-blink .75s step-end infinite;
}
.lp-bar-fill {
    transform-origin: left;
}
.lp-bar-fill.is-visible {
    animation: lp-slide-right 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

/* --- NAVBAR RESPONSIVE --- */
.lp-nav-links { display: flex; align-items: center; gap: 32px; font-size: 13px; font-weight: 500; }
.lp-nav-desktop-cta { display: flex; align-items: center; gap: 8px; }
.lp-nav-hamburger { display: none; }
.lp-nav-mobile-menu {
    display: none;
    flex-direction: column;
    position: fixed;
    top: 58px;
    left: 0;
    right: 0;
    z-index: 99;
    background: rgba(6,8,15,0.97);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(255,255,255,0.06);
    padding: 20px 24px 24px;
    gap: 0;
}
.lp-nav-mobile-menu.open { display: flex; }

@media (max-width: 700px) {
    .lp-nav-links { display: none !important; }
    .lp-nav-desktop-cta { display: none !important; }
    .lp-nav-hamburger { display: flex !important; align-items: center; gap: 10px; }
}
</style>`;

UI.renderLandingPage = function (state) {
    return `
    ${_lpStyle}
    <div class="lp" style="min-height:100vh;overflow-x:hidden;background:var(--bg);color:var(--text);">
        ${UI.renderLandingNavbar()}
        ${UI.renderLandingHero()}
        ${UI.renderLandingPainPoints()}
        ${UI.renderLandingFeatures()}
        <!-- DOCS SECTION — temporariamente oculta (DB pendente) -->
        ${UI.renderLandingAudience()}
        ${UI.renderLandingProfiles()}
        ${UI.renderLandingCTA()}
        ${UI.renderLandingFooter()}
    </div>
    `;
};

UI.renderLandingNavbar = function () {
    const lang = UI._lpLang || 'pt';
    const _t = (key) => (UI.landingTranslations[key] && UI.landingTranslations[key][lang]) || '';
    const langLabel = lang === 'pt'
        ? `<span style="opacity:.4">PT</span> <span style="opacity:.15">|</span> EN`
        : `PT <span style="opacity:.15">|</span> <span style="opacity:.4">EN</span>`;
    return `
    <nav style="position:fixed;top:0;left:0;right:0;z-index:100;
        background:rgba(6,8,15,0.85);
        backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);
        border-bottom:1px solid var(--border2);">
        <div class="wrap" style="display:flex;align-items:center;justify-content:space-between;height:58px;padding:0 24px;">

            <!-- Logo -->
            <div style="display:flex;align-items:center;gap:10px;flex-shrink:0;">
                <div style="width:30px;height:30px;border-radius:8px;background:linear-gradient(135deg,#2563eb,#4f46e5);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:900;color:#fff;letter-spacing:-.02em;box-shadow:0 2px 12px rgba(37,99,235,0.4);">K</div>
                <span style="font-size:15px;font-weight:800;color:#fff;letter-spacing:-.03em;white-space:nowrap;">KPI Master</span>
                <span style="font-size:9px;font-weight:700;color:#93c5fd;background:rgba(59,130,246,0.1);border:1px solid rgba(59,130,246,0.2);border-radius:99px;padding:3px 8px;letter-spacing:.06em;text-transform:uppercase;white-space:nowrap;" data-translate="nav-badge">${_t('nav-badge')}</span>
            </div>

            <!-- Desktop: center links -->
            <div class="lp-nav-links">
                <a href="#features" data-translate="nav-features" style="color:var(--muted);text-decoration:none;transition:color .15s;white-space:nowrap;" onmouseover="this.style.color='#f1f5f9'" onmouseout="this.style.color='#64748b'">${_t('nav-features')}</a>
                <a href="#perfis" data-translate="nav-profiles" style="color:var(--muted);text-decoration:none;transition:color .15s;white-space:nowrap;" onmouseover="this.style.color='#f1f5f9'" onmouseout="this.style.color='#64748b'">${_t('nav-profiles')}</a>
            </div>

            <!-- Desktop: lang + CTA -->
            <div class="lp-nav-desktop-cta" style="flex-shrink:0;">
                <button id="lpLangToggleBtn" style="font-size:11px;font-weight:700;color:var(--muted);background:transparent;border:1px solid var(--border);border-radius:7px;padding:6px 10px;cursor:pointer;letter-spacing:.06em;transition:all .15s;white-space:nowrap;" onmouseover="this.style.color='#f1f5f9';this.style.borderColor='rgba(255,255,255,0.15)'" onmouseout="this.style.color='#64748b';this.style.borderColor='rgba(255,255,255,0.07)'">${langLabel}</button>
                <button id="navLoginBtn" data-translate="nav-login-btn" class="btn-primary" style="padding:9px 18px;font-size:13px;border-radius:8px;white-space:nowrap;">${_t('nav-login-btn')}</button>
            </div>

            <!-- Mobile: lang + hamburger -->
            <div class="lp-nav-hamburger" style="flex-shrink:0;">
                <button id="lpLangToggleBtnMob" style="font-size:11px;font-weight:700;color:var(--muted);background:transparent;border:1px solid var(--border);border-radius:7px;padding:5px 8px;cursor:pointer;letter-spacing:.06em;transition:all .15s;" onmouseover="this.style.color='#f1f5f9'" onmouseout="this.style.color='#64748b'">${langLabel}</button>
                <button id="lpNavHamburger" style="background:transparent;border:1px solid var(--border);border-radius:7px;padding:6px 8px;cursor:pointer;color:var(--muted);display:flex;align-items:center;justify-content:center;transition:all .15s;" onmouseover="this.style.color='#f1f5f9'" onmouseout="this.style.color='#64748b'" aria-label="Menu">
                    <svg id="lpHamIcon" width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
                </button>
            </div>
        </div>
    </nav>

    <!-- Mobile dropdown -->
    <div id="lpMobileMenu" class="lp-nav-mobile-menu">
        <a href="#features" data-translate="nav-features" style="display:block;padding:13px 0;font-size:14px;font-weight:500;color:var(--muted);text-decoration:none;border-bottom:1px solid var(--border2);transition:color .15s;" onmouseover="this.style.color='#f1f5f9'" onmouseout="this.style.color='#64748b'">${_t('nav-features')}</a>
        <a href="#perfis" data-translate="nav-profiles" style="display:block;padding:13px 0;font-size:14px;font-weight:500;color:var(--muted);text-decoration:none;border-bottom:1px solid var(--border2);transition:color .15s;" onmouseover="this.style.color='#f1f5f9'" onmouseout="this.style.color='#64748b'">${_t('nav-profiles')}</a>
        <div style="padding-top:16px;">
            <button id="navLoginBtnMob" data-translate="nav-login-btn" class="btn-primary" style="width:100%;justify-content:center;padding:12px 20px;font-size:14px;border-radius:10px;">${_t('nav-login-btn')}</button>
        </div>
    </div>
    `;
};

UI.renderLandingAudience = function () {
    const lang = UI._lpLang || 'pt';
    const _t = (key) => (UI.landingTranslations[key] && UI.landingTranslations[key][lang]) || '';
    const profiles = [
        { key: 'aud-0', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4', accent: '#3b82f6' },
        { key: 'aud-1', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', accent: '#10b981' },
        { key: 'aud-2', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z', accent: '#8b5cf6' },
        { key: 'aud-3', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', accent: '#f59e0b' },
    ];
    return `
    <section id="audiencia" style="padding:80px 24px;background:var(--bg1);border-top:1px solid var(--border2);border-bottom:1px solid var(--border2);">
        <div class="wrap">
            <div style="text-align:center;margin-bottom:56px;">
                <div class="pill" data-translate="aud-eyebrow">${_t('aud-eyebrow')}</div>
                <h2 class="section-title" data-translate="aud-h2" style="max-width:700px;margin:0 auto 16px;">${_t('aud-h2')}</h2>
                <p class="section-sub" data-translate="aud-desc" style="margin:0 auto;">${_t('aud-desc')}</p>
            </div>
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:16px;margin-bottom:16px;">
                ${profiles.map(p => `
                <div class="card lp-anim-hidden lp-delay-2" style="padding:24px;">
                    <div style="width:38px;height:38px;border-radius:10px;background:rgba(255,255,255,0.04);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;margin-bottom:14px;">
                        <svg width="18" height="18" fill="none" stroke="${p.accent}" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="${p.icon}"/></svg>
                    </div>
                    <h3 style="font-size:14px;font-weight:700;color:#f1f5f9;margin-bottom:8px;" data-translate="${p.key}-label">${_t(p.key + '-label')}</h3>
                    <p style="font-size:12px;color:var(--muted);line-height:1.65;" data-translate="${p.key}-desc">${_t(p.key + '-desc')}</p>
                </div>`).join('')}
            </div>
            <div class="card lp-anim-hidden lp-delay-3" style="padding:20px 24px;display:flex;align-items:flex-start;gap:14px;">
                <div style="width:36px;height:36px;border-radius:9px;background:rgba(255,255,255,0.03);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px;">
                    <svg width="16" height="16" fill="none" stroke="#64748b" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </div>
                <p style="font-size:13px;color:var(--muted);line-height:1.7;" data-translate="aud-note">${_t('aud-note')}</p>
            </div>
        </div>
    </section>
    `;
};




/* --- HERO --- */
UI.renderLandingHero = function () {
    const lang = UI._lpLang || 'pt';
    const _t = (key) => (UI.landingTranslations[key] && UI.landingTranslations[key][lang]) || '';
    return `
    <section class="lp-fade-hidden" style="min-height:100vh;display:flex;align-items:center;justify-content:center;padding:100px 24px 80px;position:relative;overflow:hidden;
        background:radial-gradient(ellipse 80% 50% at 50% 0%, rgba(37,99,235,0.12) 0%, transparent 70%),
        radial-gradient(ellipse 50% 30% at 80% 70%, rgba(99,102,241,0.07) 0%, transparent 60%),
        var(--bg);">
        <!-- Subtle grid -->
        <div style="position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px);background-size:56px 56px;pointer-events:none;"></div>

        <div class="wrap" style="position:relative;text-align:center;max-width:860px;">

            <!-- Pill badge -->
            <div style="display:inline-flex;align-items:center;gap:8px;padding:6px 16px;border-radius:999px;margin-bottom:36px;background:rgba(37,99,235,0.08);border:1px solid rgba(59,130,246,0.2);">
                <span style="width:5px;height:5px;border-radius:50%;background:#f59e0b;display:inline-block;box-shadow:0 0 6px #f59e0b;"></span>
                <span style="font-size:12px;font-weight:600;color:#fcd34d;letter-spacing:.01em;" data-translate="hero-urgency">${_t('hero-urgency')}</span>
            </div>

            <!-- H1 -->
            <h1 style="font-size:clamp(40px,6.5vw,80px);font-weight:800;line-height:1.08;letter-spacing:-0.03em;color:#f1f5f9;margin-bottom:24px;">
                <span data-translate="hero-h1-1" style="display:block;">${_t('hero-h1-1')}</span>
                <span data-translate="hero-h1-2" style="display:block;">${_t('hero-h1-2')}</span>
                <span data-translate="hero-h1-3" style="display:block; max-width:100%;" class="lp-typing-txt" background:linear-gradient(135deg,#60a5fa 0%,#818cf8 50%,#c084fc 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;" id="lp-hero-typer" class="lp-typing-txt">${_t('hero-h1-3')}</span>
            </h1>

            <!-- Description -->
            <p data-translate="hero-desc" style="font-size:17px;color:var(--muted);max-width:560px;margin:0 auto 40px;line-height:1.75;">${_t('hero-desc')}</p>

            <!-- CTAs -->
            <div style="display:flex;flex-wrap:wrap;gap:12px;justify-content:center;margin-bottom:48px;">
                <button id="heroStartBtn" class="btn-primary" style="padding:14px 32px;font-size:15px;border-radius:12px;">
                    <span data-translate="hero-cta-main">${_t('hero-cta-main')}</span>
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
                </button>
                <button data-translate="hero-cta-secondary" class="btn-ghost" style="padding:14px 32px;font-size:15px;border-radius:12px;" onmouseover="this.style.color='#f1f5f9';this.style.borderColor='rgba(255,255,255,0.15)'" onmouseout="this.style.color='#64748b';this.style.borderColor='rgba(255,255,255,0.07)'">${_t('hero-cta-secondary')}</button>
            </div>

            <!-- Trust bar -->
            <div style="display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:28px;margin-bottom:64px;">
                ${[
            { icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', label: 'OAuth Trello — 30 segundos', c: '#34d399' },
            { icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z', label: 'Sem dados armazenados', c: '#60a5fa' },
            { icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6', label: 'Tempo real — sempre atualizado', c: '#a78bfa' },
        ].map(i => `<span style="display:flex;align-items:center;gap:6px;font-size:12px;color:#475569;font-weight:500;">
                    <svg width="13" height="13" fill="none" stroke="${i.c}" viewBox="0 0 24 24" style="flex-shrink:0;opacity:.85;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${i.icon}"/></svg>${i.label}</span>`).join('')}
            </div>

            <!-- DASHBOARD MOCKUP -->
            <div style="position:relative;border-radius:18px;overflow:hidden;
                box-shadow:0 0 0 1px rgba(59,130,246,0.18),0 40px 80px rgba(0,0,0,0.65);
                background:#0a0f1a;">
                <!-- Top gradient line -->
                <div style="position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(96,165,250,0.6),rgba(167,139,250,0.4),transparent);z-index:10;"></div>

                <div style="display:flex;height:480px;overflow:hidden;text-align:left;user-select:none;">
                    <!-- Sidebar -->
                    <div style="width:172px;background:#070b12;border-right:1px solid rgba(255,255,255,0.04);flex-shrink:0;display:flex;flex-direction:column;">
                        <div style="height:38px;display:flex;align-items:center;gap:7px;padding:0 10px;border-bottom:1px solid rgba(255,255,255,0.04);">
                            <div style="width:18px;height:18px;background:#2563eb;border-radius:5px;display:flex;align-items:center;justify-content:center;font-size:8px;font-weight:900;color:#fff;">K</div>
                            <span style="font-size:11px;font-weight:800;color:#fff;">KPI Master</span>
                        </div>
                        <div style="flex:1;padding:10px 8px;overflow:hidden;display:flex;flex-direction:column;gap:14px;">
                            <div>
                                <p style="font-size:6.5px;color:#374151;font-weight:700;text-transform:uppercase;letter-spacing:.15em;margin-bottom:6px;padding-left:4px;">Perfil</p>
                                <div style="display:flex;align-items:center;gap:7px;padding:7px 8px;background:#0d1117;border-radius:8px;border:1px solid rgba(255,255,255,0.04);">
                                    <div style="width:18px;height:18px;border-radius:5px;background:rgba(37,99,235,0.2);border:1px solid rgba(37,99,235,0.2);display:flex;align-items:center;justify-content:center;font-size:6px;font-weight:700;color:#93c5fd;">RC</div>
                                    <div><div style="font-size:8px;font-weight:700;color:#fff;">Ricardo C.</div><div style="font-size:6.5px;color:#10b981;font-weight:600;">● Gestor</div></div>
                                </div>
                            </div>
                            <div>
                                <p style="font-size:6.5px;color:#374151;font-weight:700;text-transform:uppercase;letter-spacing:.15em;margin-bottom:5px;padding-left:4px;">Consultores</p>
                                <div style="display:flex;align-items:center;gap:7px;padding:5px 8px;background:rgba(37,99,235,0.15);border-radius:6px;border:1px solid rgba(37,99,235,0.2);margin-bottom:2px;">
                                    <span style="font-size:8px;font-weight:600;color:#fff;">Todos</span>
                                </div>
                                ${['Ana M.', 'Bruno S.', 'Carla F.'].map(n => `<div style="display:flex;align-items:center;gap:7px;padding:4px 8px;"><span style="font-size:8px;color:#475569;">${n}</span></div>`).join('')}
                            </div>
                        </div>
                    </div>

                    <!-- Main content -->
                    <div style="flex:1;background:#0f172a;display:flex;flex-direction:column;min-width:0;">
                        <div style="height:38px;background:#0f172a;border-bottom:1px solid rgba(255,255,255,0.04);display:flex;align-items:center;justify-content:space-between;padding:0 14px;flex-shrink:0;">
                            <div style="display:flex;align-items:center;gap:8px;">
                                <span style="font-size:11px;font-weight:800;color:#fff;">Dashboard Imobiliário</span>
                                <span style="font-size:7px;font-weight:700;color:#60a5fa;background:rgba(37,99,235,0.12);padding:2px 6px;border-radius:4px;">Manager</span>
                            </div>
                            <div style="display:flex;gap:6px;">
                                <div style="background:#2563eb;border-radius:6px;padding:4px 10px;font-size:8px;font-weight:700;color:#fff;">Analytics</div>
                                <div style="background:#111827;border:1px solid rgba(255,255,255,0.06);border-radius:6px;padding:4px 10px;font-size:8px;color:#94a3b8;">Exportar PDF</div>
                            </div>
                        </div>

                        <div style="flex:1;padding:12px;display:grid;grid-template-rows:auto auto auto;gap:10px;overflow:hidden;">
                            <!-- Row 1: Pipeline + Focus -->
                            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
                                <div style="background:#0a0f1a;border:1px solid rgba(255,255,255,0.04);border-radius:10px;padding:10px;">
                                    <div style="display:flex;align-items:center;gap:5px;margin-bottom:8px;"><div style="width:6px;height:6px;background:#3b82f6;border-radius:2px;"></div><span style="font-size:7px;font-weight:700;color:#475569;text-transform:uppercase;letter-spacing:.1em;">Pipeline Imob.</span></div>
                                    ${[{ s: 'Novo Contacto', n: 52, p: 100 }, { s: 'Visita Marcada', n: 35, p: 67 }, { s: 'Proposta Enviada', n: 21, p: 40 }, { s: 'Contrato', n: 8, p: 15 }].map(r => `<div style="display:flex;align-items:center;gap:6px;font-size:7px;margin-bottom:5px;"><span style="width:72px;color:#475569;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${r.s}</span><div style="flex:1;height:4px;background:rgba(255,255,255,0.04);border-radius:2px;"><div style="height:100%;border-radius:2px;background:${r.n === 8 ? '#10b981' : '#3b82f6'};width:${r.p}%;" class="lp-bar-fill"></div></div><span style="color:#475569;width:14px;text-align:right;" data-count-to="${r.n}">0</span></div>`).join('')}
                                </div>
                                <div style="background:#0a0f1a;border:1px solid rgba(255,255,255,0.04);border-radius:10px;padding:10px;">
                                    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
                                        <div style="display:flex;align-items:center;gap:5px;"><div style="width:6px;height:6px;background:#ef4444;border-radius:2px;"></div><span style="font-size:7px;font-weight:700;color:#475569;text-transform:uppercase;letter-spacing:.1em;">Leads Críticos</span></div>
                                        <span style="font-size:6.5px;font-weight:700;color:#f87171;background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.2);padding:1px 5px;border-radius:99px;">⚠ 5</span>
                                    </div>
                                    ${[{ n: 'Família Mendes — T3 Algés', t: '🔴 14d', bg: 'rgba(239,68,68,0.05)' }, { n: 'Dr. Ferreira — Escritório', t: '🟡 8d', bg: 'rgba(245,158,11,0.05)' }, { n: 'Ana Costa — T2 Cascais', t: '🟡 6d', bg: 'rgba(245,158,11,0.05)' }].map(a => `<div style="background:${a.bg};border:1px solid rgba(255,255,255,0.03);border-radius:7px;padding:5px 8px;display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;"><span style="font-size:7px;color:#94a3b8;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:130px;">${a.n}</span><span style="font-size:6.5px;color:#475569;flex-shrink:0;">${a.t}</span></div>`).join('')}
                                </div>
                            </div>

                            <!-- Row 2: Tempo + Performance -->
                            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
                                <div style="background:#0a0f1a;border:1px solid rgba(255,255,255,0.04);border-radius:10px;padding:10px;">
                                    <div style="display:flex;align-items:center;gap:5px;margin-bottom:8px;"><div style="width:6px;height:6px;background:#f59e0b;border-radius:2px;"></div><span style="font-size:7px;font-weight:700;color:#475569;text-transform:uppercase;letter-spacing:.1em;">Tempo Médio por Fase</span></div>
                                    <div style="display:grid;grid-template-columns:auto 1fr;gap:6px;align-items:center;">
                                        <div style="background:#111827;border-radius:8px;padding:8px 10px;border:1px solid rgba(255,255,255,0.04);">
                                            <p style="font-size:22px;font-weight:900;color:#fff;line-height:1;">11d</p>
                                            <p style="font-size:7px;color:#f87171;margin-top:2px;">↑ acima do ideal</p>
                                        </div>
                                        <div style="display:flex;flex-direction:column;gap:4px;">
                                            ${[{ l: 'Visita→Proposta', t: '7d', c: '#f87171' }, { l: 'Proposta→Fecho', t: '18d', c: '#f87171' }, { l: 'Contacto→Visita', t: '4d', c: '#34d399' }].map(r => `<div style="background:#111827;border-radius:5px;padding:4px 7px;border:1px solid rgba(255,255,255,0.04);display:flex;justify-content:space-between;align-items:center;"><span style="font-size:6.5px;color:#475569;">${r.l}</span><span style="font-size:7.5px;font-weight:700;color:${r.c};">${r.t}</span></div>`).join('')}
                                        </div>
                                    </div>
                                </div>
                                <div style="background:#0a0f1a;border:1px solid rgba(255,255,255,0.04);border-radius:10px;padding:10px;">
                                    <div style="display:flex;align-items:center;gap:5px;margin-bottom:8px;"><div style="width:6px;height:6px;background:#8b5cf6;border-radius:2px;"></div><span style="font-size:7px;font-weight:700;color:#475569;text-transform:uppercase;letter-spacing:.1em;">Performance</span></div>
                                    <div style="background:#111827;border:1px solid rgba(245,158,11,0.15);border-radius:8px;padding:7px 9px;display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;">
                                        <div style="display:flex;align-items:center;gap:6px;">
                                            <div style="width:16px;height:16px;border-radius:4px;background:rgba(245,158,11,0.15);display:flex;align-items:center;justify-content:center;font-size:6px;font-weight:700;color:#fcd34d;">AN</div>
                                            <div><p style="font-size:8px;font-weight:700;color:#fff;">Ana Martins</p><p style="font-size:7px;color:#f59e0b;">🏆 8 contratos</p></div>
                                        </div>
                                        <span style="font-size:14px;font-weight:900;color:#fff;" data-count-to="42">0</span>
                                    </div>
                                    ${[{ n: 'Bruno S.', v: 31, p: 74 }, { n: 'Carla F.', v: 22, p: 52 }, { n: 'David R.', v: 15, p: 36 }].map(m => `<div style="display:flex;align-items:center;gap:5px;font-size:7px;margin-bottom:4px;"><span style="width:42px;color:#475569;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${m.n}</span><div style="flex:1;height:4px;background:rgba(255,255,255,0.04);border-radius:2px;"><div style="height:100%;border-radius:2px;background:rgba(255,255,255,0.15);width:${m.p}%;" class="lp-bar-fill"></div></div><span style="color:#475569;width:14px;text-align:right;" data-count-to="${m.v}">0</span></div>`).join('')}
                                </div>
                            </div>

                            <!-- Row 3: Table -->
                            <div style="background:#0a0f1a;border:1px solid rgba(255,255,255,0.04);border-radius:10px;padding:10px;overflow:hidden;">
                                <div style="display:flex;align-items:center;gap:5px;margin-bottom:8px;"><div style="width:6px;height:6px;background:#6366f1;border-radius:2px;"></div><span style="font-size:7px;font-weight:700;color:#475569;text-transform:uppercase;letter-spacing:.1em;">Tabela de Performance — Fev</span><span style="margin-left:auto;font-size:7px;font-weight:700;color:#34d399;background:rgba(34,197,94,0.08);border:1px solid rgba(34,197,94,0.15);padding:1px 6px;border-radius:4px;">8 contratos</span></div>
                                <table style="width:100%;font-size:7.5px;border-collapse:collapse;">
                                    <thead><tr style="border-bottom:1px solid rgba(255,255,255,0.04);">${['Consultor', 'Leads', 'Visitas', 'Propostas', 'Contratos', 'Taxa'].map(h => `<th style="text-align:left;color:#374151;padding-bottom:5px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;padding-right:10px;">${h}</th>`).join('')}</tr></thead>
                                    <tbody>${[{ n: 'Ana Martins', l: 42, v: 28, p: 15, c: 8, t: '19%' }, { n: 'Bruno S.', l: 31, v: 19, p: 11, c: 5, t: '16%' }, { n: 'Carla F.', l: 22, v: 14, p: 7, c: 3, t: '14%' }].map(r => `<tr><td style="padding:4px 10px 4px 0;color:#cbd5e1;font-weight:600;">${r.n}</td><td style="padding:4px 10px 4px 0;"><span style="background:rgba(59,130,246,0.12);color:#60a5fa;padding:1px 5px;border-radius:99px;font-weight:700;" data-count-to="${r.l}">0</span></td><td style="padding:4px 10px 4px 0;color:#475569;" data-count-to="${r.v}">0</td><td style="padding:4px 10px 4px 0;color:#475569;" data-count-to="${r.p}">0</td><td style="padding:4px 10px 4px 0;color:#34d399;font-weight:700;" data-count-to="${r.c}">0</td><td style="padding:4px 10px 4px 0;color:#fbbf24;font-weight:700;">${r.t}</td></tr>`).join('')}</tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    `;
};

/* --- PAIN POINTS --- */
UI.renderLandingPainPoints = function () {
    const lang = UI._lpLang || 'pt';
    const _t = (key) => (UI.landingTranslations[key] && UI.landingTranslations[key][lang]) || '';
    const pains = [
        { key: 'pain-0', icon: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z', accent: '#ef4444' },
        { key: 'pain-1', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', accent: '#f59e0b' },
        { key: 'pain-2', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', accent: '#3b82f6' },
        { key: 'pain-3', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', accent: '#8b5cf6' },
    ];
    return `
    <section class="lp-fade-hidden" style="padding:96px 24px;background:var(--bg1);border-top:1px solid var(--border2);">
        <div class="wrap">
            <div style="text-align:center;margin-bottom:64px;">
                <div class="pill" data-translate="pain-eyebrow" style="border-color:rgba(239,68,68,0.25);color:#fca5a5;background:rgba(239,68,68,0.08);">${_t('pain-eyebrow')}</div>
                <h2 class="section-title" data-translate="pain-h2" style="max-width:700px;margin:0 auto 16px;">${_t('pain-h2')}</h2>
                <p class="section-sub" data-translate="pain-desc" style="margin:0 auto;">${_t('pain-desc')}</p>
            </div>
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(290px,1fr));gap:16px;">
                ${pains.map(p => `
                <div class="card lp-anim-hidden lp-delay-1" style="padding:28px;position:relative;overflow:hidden;">
                    <div style="position:absolute;left:0;top:0;bottom:0;width:3px;background:${p.accent};opacity:.6;border-radius:3px 0 0 3px;"></div>
                    <div style="width:40px;height:40px;border-radius:10px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.06);display:flex;align-items:center;justify-content:center;margin-bottom:16px;">
                        <svg width="18" height="18" fill="none" stroke="${p.accent}" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="${p.icon}"/></svg>
                    </div>
                    <p style="font-size:14px;font-weight:700;color:#e2e8f0;margin-bottom:14px;line-height:1.45;" data-translate="${p.key}-pain">${_t(p.key + '-pain')}</p>
                    <div style="display:flex;align-items:flex-start;gap:9px;">
                        <div style="width:18px;height:18px;border-radius:50%;background:rgba(34,197,94,0.1);border:1px solid rgba(34,197,94,0.2);display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px;">
                            <svg width="10" height="10" fill="none" stroke="#34d399" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                        </div>
                        <p style="font-size:12px;color:#34d399;line-height:1.6;" data-translate="${p.key}-fix">${_t(p.key + '-fix')}</p>
                    </div>
                </div>`).join('')}
            </div>
        </div>
    </section>
    `;
};

/* --- FEATURES --- */
UI.renderLandingFeatures = function () {
    const lang = UI._lpLang || 'pt';
    const _t = (key) => (UI.landingTranslations[key] && UI.landingTranslations[key][lang]) || '';
    const features = [
        { key: 'feat-0', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', accent: '#3b82f6', badgeStyle: 'background:rgba(59,130,246,0.12);color:#60a5fa;border:1px solid rgba(59,130,246,0.2);' },
        { key: 'feat-1', icon: 'M13 10V3L4 14h7v7l9-11h-7z', accent: '#ef4444', badgeStyle: 'background:rgba(34,197,94,0.1);color:#4ade80;border:1px solid rgba(34,197,94,0.2);' },
        { key: 'feat-2', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', accent: '#f59e0b', badgeStyle: '' },
        { key: 'feat-3', icon: 'M3 10h18M3 6h18M3 14h18M3 18h18', accent: '#6366f1', badgeStyle: '' },
        { key: 'feat-4', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', accent: '#10b981', badgeStyle: 'background:rgba(139,92,246,0.1);color:#c4b5fd;border:1px solid rgba(139,92,246,0.2);' },
        { key: 'feat-5', icon: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4', accent: '#8b5cf6', badgeStyle: '' },
        { key: 'feat-6', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z', accent: '#64748b', badgeStyle: '' },
        { key: 'feat-7', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', accent: '#10b981', badgeStyle: '' },
        { key: 'feat-8', icon: 'M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z', accent: '#6366f1', badgeStyle: '' },
    ];
    return `
    <section id="features" style="padding:96px 24px;background:var(--bg);border-top:1px solid var(--border2);">
        <div class="wrap">
            <div style="text-align:center;margin-bottom:64px;">
                <div class="pill" data-translate="feat-eyebrow">${_t('feat-eyebrow')}</div>
                <h2 class="section-title" style="max-width:700px;margin:0 auto 10px;">
                    <span data-translate="feat-h2-1">${_t('feat-h2-1')}</span><br>
                    <span data-translate="feat-h2-2">${_t('feat-h2-2')}</span>
                </h2>
                <p class="section-sub" data-translate="feat-desc" style="margin:0 auto;">${_t('feat-desc')}</p>
            </div>
            <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px;">
                ${features.map(f => {
        const tag = _t(f.key + '-tag');
        return `<div class="card lp-anim-hidden lp-delay-2" style="padding:28px;position:relative;">
                        ${tag ? `<span style="position:absolute;top:16px;right:16px;font-size:9px;font-weight:700;padding:3px 8px;border-radius:99px;text-transform:uppercase;letter-spacing:.06em;${f.badgeStyle || 'background:rgba(59,130,246,0.1);color:#60a5fa;border:1px solid rgba(59,130,246,0.15);'}" data-translate="${f.key}-tag">${tag}</span>` : ''}
                        <div style="width:40px;height:40px;border-radius:10px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.07);display:flex;align-items:center;justify-content:center;margin-bottom:16px;">
                            <svg width="18" height="18" fill="none" stroke="${f.accent}" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="${f.icon}"/></svg>
                        </div>
                        <h3 style="font-size:14px;font-weight:700;color:#f1f5f9;margin-bottom:8px;line-height:1.4;" data-translate="${f.key}-title">${_t(f.key + '-title')}</h3>
                        <p style="font-size:12px;color:var(--muted);line-height:1.7;" data-translate="${f.key}-desc">${_t(f.key + '-desc')}</p>
                    </div>`;
    }).join('')}
            </div>
        </div>
    </section>
    `;
};

/* --- DOCS (hidden — DB pending) --- */
UI.renderLandingDocs = function () { return ''; };

/* --- PROFILES --- */
UI.renderLandingProfiles = function () {
    const lang = UI._lpLang || 'pt';
    const _t = (key) => (UI.landingTranslations[key] && UI.landingTranslations[key][lang]) || '';
    const mgrItems = ['prof-mgr-li-0', 'prof-mgr-li-1', 'prof-mgr-li-2', 'prof-mgr-li-3', 'prof-mgr-li-4'];
    const consItems = ['prof-cons-li-0', 'prof-cons-li-1', 'prof-cons-li-2', 'prof-cons-li-3', 'prof-cons-li-4'];
    return `
    <section id="perfis" style="padding:96px 24px;background:var(--bg1);border-top:1px solid var(--border2);border-bottom:1px solid var(--border2);">
        <div class="wrap">
            <div style="text-align:center;margin-bottom:64px;">
                <div class="pill" data-translate="prof-eyebrow">${_t('prof-eyebrow')}</div>
                <h2 class="section-title" style="max-width:700px;margin:0 auto 10px;">
                    <span data-translate="prof-h2-1">${_t('prof-h2-1')}</span><br>
                    <span data-translate="prof-h2-2">${_t('prof-h2-2')}</span>
                </h2>
                <p class="section-sub" data-translate="prof-desc" style="margin:0 auto;">${_t('prof-desc')}</p>
            </div>
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(340px,1fr));gap:20px;">
                <!-- Gestor -->
                <div class="card lp-anim-hidden lp-delay-3" style="padding:36px;border-color:rgba(59,130,246,0.2);position:relative;overflow:hidden;" onmouseover="this.style.borderColor='rgba(59,130,246,0.35)'" onmouseout="this.style.borderColor='rgba(59,130,246,0.2)'">
                    <div style="position:absolute;top:0;right:0;width:200px;height:200px;background:radial-gradient(ellipse at top right,rgba(37,99,235,0.06),transparent 70%);pointer-events:none;"></div>
                    <div style="display:flex;align-items:center;gap:14px;margin-bottom:20px;">
                        <div style="width:44px;height:44px;border-radius:12px;background:rgba(37,99,235,0.1);border:1px solid rgba(59,130,246,0.2);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                            <svg width="20" height="20" fill="none" stroke="#60a5fa" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
                        </div>
                        <div>
                            <h3 style="font-size:18px;font-weight:800;color:#f1f5f9;" data-translate="prof-mgr-title">${_t('prof-mgr-title')}</h3>
                            <span style="font-size:10px;color:#60a5fa;font-weight:700;text-transform:uppercase;letter-spacing:.06em;" data-translate="prof-mgr-badge">${_t('prof-mgr-badge')}</span>
                        </div>
                    </div>
                    <p style="font-size:13px;color:var(--muted);margin-bottom:24px;line-height:1.7;" data-translate="prof-mgr-desc">${_t('prof-mgr-desc')}</p>
                    <ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:10px;">
                        ${mgrItems.map(k => `<li style="display:flex;align-items:flex-start;gap:10px;font-size:13px;color:#94a3b8;">
                            <span style="width:6px;height:6px;border-radius:50%;background:#3b82f6;flex-shrink:0;margin-top:5px;display:block;"></span>
                            <span data-translate="${k}">${_t(k)}</span></li>`).join('')}
                    </ul>
                </div>
                <!-- Consultor -->
                <div class="card lp-anim-hidden lp-delay-1" style="padding:36px;border-color:rgba(16,185,129,0.2);position:relative;overflow:hidden;" onmouseover="this.style.borderColor='rgba(16,185,129,0.35)'" onmouseout="this.style.borderColor='rgba(16,185,129,0.2)'">
                    <div style="position:absolute;top:0;right:0;width:200px;height:200px;background:radial-gradient(ellipse at top right,rgba(16,185,129,0.06),transparent 70%);pointer-events:none;"></div>
                    <div style="display:flex;align-items:center;gap:14px;margin-bottom:20px;">
                        <div style="width:44px;height:44px;border-radius:12px;background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.2);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                            <svg width="20" height="20" fill="none" stroke="#34d399" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                        </div>
                        <div>
                            <h3 style="font-size:18px;font-weight:800;color:#f1f5f9;" data-translate="prof-cons-title">${_t('prof-cons-title')}</h3>
                            <span style="font-size:10px;color:#34d399;font-weight:700;text-transform:uppercase;letter-spacing:.06em;" data-translate="prof-cons-badge">${_t('prof-cons-badge')}</span>
                        </div>
                    </div>
                    <p style="font-size:13px;color:var(--muted);margin-bottom:24px;line-height:1.7;" data-translate="prof-cons-desc">${_t('prof-cons-desc')}</p>
                    <ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:10px;">
                        ${consItems.map(k => `<li style="display:flex;align-items:flex-start;gap:10px;font-size:13px;color:#94a3b8;">
                            <span style="width:6px;height:6px;border-radius:50%;background:#10b981;flex-shrink:0;margin-top:5px;display:block;"></span>
                            <span data-translate="${k}">${_t(k)}</span></li>`).join('')}
                    </ul>
                </div>
            </div>
        </div>
    </section>
    `;
};

/* --- CTA --- */
UI.renderLandingCTA = function () {
    const lang = UI._lpLang || 'pt';
    const _t = (key) => (UI.landingTranslations[key] && UI.landingTranslations[key][lang]) || '';
    return `
    <section id="cta" style="padding:120px 24px;background:var(--bg);">
        <div class="wrap" style="max-width:760px;text-align:center;">
            <!-- Card -->
            <div style="position:relative;border-radius:24px;overflow:hidden;padding:72px 48px;
                background:linear-gradient(145deg,#0d1526,#0a0f1a);
                border:1px solid rgba(59,130,246,0.18);
                box-shadow:0 40px 80px rgba(0,0,0,0.5),0 0 0 1px rgba(99,102,241,0.06);">
                <!-- Top line -->
                <div style="position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(96,165,250,0.5),rgba(167,139,250,0.4),transparent);"></div>
                <!-- Ambient glow -->
                <div style="position:absolute;top:-60px;left:50%;transform:translateX(-50%);width:400px;height:250px;background:radial-gradient(ellipse,rgba(37,99,235,0.12),transparent 70%);pointer-events:none;"></div>

                <div style="position:relative;">
                    <p style="font-size:11px;font-weight:700;color:#60a5fa;text-transform:uppercase;letter-spacing:.2em;margin-bottom:20px;" data-translate="cta-eyebrow">${_t('cta-eyebrow')}</p>
                    <h2 style="font-size:clamp(28px,4vw,48px);font-weight:800;color:#f1f5f9;line-height:1.1;letter-spacing:-0.025em;margin-bottom:20px;">
                        <span data-translate="cta-h2-1">${_t('cta-h2-1')}</span><br>
                        <span data-translate="cta-h2-2" style="background:linear-gradient(135deg,#60a5fa,#a78bfa);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">${_t('cta-h2-2')}</span>
                    </h2>
                    <p style="font-size:15px;color:var(--muted);margin-bottom:12px;line-height:1.7;max-width:540px;margin-left:auto;margin-right:auto;" data-translate="cta-desc">${_t('cta-desc')}</p>
                    <p style="font-size:13px;color:#334155;margin-bottom:40px;max-width:440px;margin-left:auto;margin-right:auto;" data-translate="cta-note">${_t('cta-note')}</p>

                    <button id="ctaStartBtn" class="btn-primary" style="font-size:16px;padding:16px 40px;border-radius:12px;margin-bottom:28px;">
                        <span data-translate="cta-btn">${_t('cta-btn')}</span>
                        <svg width="17" height="17" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
                    </button>

                    <div style="display:flex;align-items:center;justify-content:center;gap:24px;flex-wrap:wrap;">
                        ${['cta-trust-0', 'cta-trust-1', 'cta-trust-2', 'cta-trust-3'].map(k => `<span style="display:flex;align-items:center;gap:6px;font-size:12px;color:#334155;font-weight:500;">
                            <span style="width:5px;height:5px;border-radius:50%;background:#10b981;display:block;"></span>
                            <span data-translate="${k}">${_t(k)}</span></span>`).join('')}
                    </div>
                </div>
            </div>
        </div>
    </section>
    `;
};

/* --- FOOTER --- */
UI.renderLandingFooter = function () {
    const lang = UI._lpLang || 'pt';
    const _t = (key) => (UI.landingTranslations[key] && UI.landingTranslations[key][lang]) || '';
    return `
    <footer style="padding:40px 24px;border-top:1px solid var(--border2);background:var(--bg);">
        <div class="wrap" style="display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:20px;">
            <div style="display:flex;align-items:center;gap:10px;">
                <div style="width:28px;height:28px;border-radius:8px;background:linear-gradient(135deg,#2563eb,#4f46e5);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:900;color:#fff;">K</div>
                <span style="font-size:14px;font-weight:800;color:#f1f5f9;letter-spacing:-.02em;">KPI Master</span>
                <span style="font-size:9px;font-weight:700;color:#93c5fd;background:rgba(59,130,246,0.1);border:1px solid rgba(59,130,246,0.2);border-radius:99px;padding:2px 7px;letter-spacing:.06em;text-transform:uppercase;" data-translate="footer-badge">${_t('footer-badge')}</span>
            </div>
            <p style="font-size:12px;color:#334155;" data-translate="footer-copy">${_t('footer-copy')}</p>
            <div style="display:flex;gap:24px;">
                ${['footer-privacy', 'footer-terms', 'footer-contact'].map(k => `<a href="#" style="font-size:12px;color:#334155;text-decoration:none;transition:color .15s;" onmouseover="this.style.color='#94a3b8'" onmouseout="this.style.color='#334155'" data-translate="${k}">${_t(k)}</a>`).join('')}
            </div>
        </div>
    </footer>
    `;
};



UI.initLandingAnimations = function () {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');

                // Animate counters
                if (entry.target.hasAttribute('data-count-to')) {
                    const targetStr = entry.target.getAttribute('data-count-to');
                    const target = parseInt(targetStr, 10);
                    if (!isNaN(target)) {
                        animateCounter(entry.target, target);
                    }
                    entry.target.removeAttribute('data-count-to');
                }
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.lp-anim-hidden, .lp-fade-hidden, .lp-typing-txt, .lp-bar-fill, [data-count-to]').forEach(el => observer.observe(el));

    function animateCounter(el, target) {
        let current = 0;
        const duration = 1500;
        const stepTime = Math.max(20, Math.floor(duration / target)) || 30;
        const timer = setInterval(() => {
            current += Math.max(1, Math.ceil(target / (duration / stepTime)));
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            el.innerText = current;
        }, stepTime);
    }

    // --- Hamburger menu toggle ---
    const hamburger = document.getElementById('lpNavHamburger');
    const mobileMenu = document.getElementById('lpMobileMenu');
    const hamIcon = document.getElementById('lpHamIcon');

    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            const isOpen = mobileMenu.classList.toggle('open');
            hamIcon.innerHTML = isOpen
                ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>'
                : '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>';
        });

        // Close menu when a link is clicked
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('open');
                hamIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>';
            });
        });
    }

    // --- Lang toggle (desktop + mobile) ---
    function setupLangToggle(btnId) {
        const btn = document.getElementById(btnId);
        if (!btn) return;
        btn.addEventListener('click', () => {
            const next = UI._lpLang === 'pt' ? 'en' : 'pt';
            UI.applyLandingTranslation(next);
        });
    }
    setupLangToggle('lpLangToggleBtn');
    setupLangToggle('lpLangToggleBtnMob');
};
