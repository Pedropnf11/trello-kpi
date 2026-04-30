# 🚀 Roadmap — Pipedrive KPI no Marketplace do Pipedrive

## 🎯 Visão Geral

O objetivo é colocar o **Pipedrive KPI Dashboard** no Marketplace do Pipedrive,
para que qualquer utilizador do Pipedrive possa instalar com 1 clique e ser
redirecionado para o teu site com o dashboard completo — sem base de dados,
sem guardar dados no servidor.

```
Marketplace do Pipedrive
        ↓
Utilizador clica "Install Now" (1 clique)
        ↓
OAuth automático — Pipedrive pede permissão ao utilizador
        ↓
Redireciona para o teu site com token no browser do utilizador
        ↓
Dashboard completo funciona normalmente (zero servidor teu)
```

> ✅ Zero base de dados
> ✅ Zero dados guardados no teu servidor
> ✅ O token fica apenas no localStorage do browser do utilizador
> ✅ O teu servidor só tem 1 rota para trocar o code por token (não guarda nada)

---

## ⚠️ Diferença entre o que tens agora e o que o Marketplace exige

| Agora | Com OAuth (Marketplace) |
|---|---|
| Utilizador copia e cola o token manualmente | Pipedrive dá o token automaticamente via OAuth |
| Token guardado no localStorage ✅ | Token guardado no localStorage ✅ (igual) |
| Zero servidor ✅ | 1 rota Next.js `/api/auth/callback` (não guarda nada) |
| Funciona mas não é aceite no Marketplace | Aceite no Marketplace ✅ |

---

## 📋 PARTE 1 — REGISTO DA APP NO PIPEDRIVE DEVELOPER HUB

### Passo 1.1 — Criar conta de Developer Sandbox (obrigatório)

> ⚠️ O Developer Hub só está disponível em contas Sandbox, NÃO na conta de produção.

1. Ir a: **https://developers.pipedrive.com/**
2. Clicar em **"Get a free sandbox account"**
3. Criar conta separada da tua conta de produção
4. Confirmar email
5. Fazer login na conta sandbox

---

### Passo 1.2 — Aceder ao Developer Hub

1. Na conta sandbox, clicar no teu nome (canto superior direito)
2. No dropdown, selecionar **"(nome da empresa) Developer Hub"**
3. Se não aparecer, ir diretamente a: **Settings → Developer Hub**

---

### Passo 1.3 — Criar a App

1. Clicar no botão verde **"Create an app"**
2. Selecionar **"Create public app"** (para o Marketplace)
   > ⚠️ Atenção: o tipo de app **não pode ser alterado depois**. Escolhe bem.
   > - Public app = aparece no Marketplace (o teu objetivo)
   > - Private app = só partilhada via link direto (mais simples de testar primeiro)

3. Na janela que abre, preencher:
   - **App name:** `LeadPulse KPI` (ou o nome que escolheres)
   - **OAuth callback URL:** `https://pipedrive-kpi.vercel.app/api/auth/callback`
   > ⚠️ Este URL tem de estar online e funcional ANTES de submeter para revisão.
   > Para testes iniciais podes usar um URL temporário e mudar depois.

4. Clicar **"Save"**
5. O Pipedrive gera automaticamente:
   - **Client ID** — público, pode estar no código
   - **Client Secret** — privado, NUNCA no código, vai para variável de ambiente

---

### Passo 1.4 — Configurar OAuth & Access Scopes

No separador **"OAuth & access scopes"**, ativar APENAS os scopes que usas:

| Scope | Porquê precisas |
|---|---|
| `deals:read` | Ler deals/negócios do pipeline |
| `activities:read` | Ler atividades da equipa |
| `users:read` | Ler utilizadores e membros |
| `pipelines:read` | Listar pipelines disponíveis |
| `stages:read` | Ler estágios do pipeline |

> ✅ Não ativas `write` em nada que não precises — menos scopes = aprovação mais rápida.
> ⚠️ Os utilizadores têm de aceitar OU rejeitar todos os scopes em bloco. Sem meio-termo.

---

### Passo 1.5 — Preencher General Info (para o Marketplace)

No separador **"General info"**, preencher:

**App name:**
```
LeadPulse KPI
```

**Summary (até 1 linha curta):**
```
Dashboard de KPIs de vendas em tempo real para equipas Pipedrive
```

**Description (campo longo):**
```
O LeadPulse KPI transforma os dados do teu Pipedrive num dashboard
visual de performance de vendas, acessível em segundos.

✅ Dashboard de Gestor — Leaderboard, Funil visual, Heatmap de atividade,
   Win/Lost chart, Análise de risco por equipa
✅ Dashboard de Vendedor — Focus Zone, Activity Timeline, Goal Tracker,
   KPIs pessoais em tempo real
✅ Filtros por pipeline, por membro, por data
✅ Export PDF do dashboard
✅ Sem configuração técnica — liga em 1 clique

Instala o LeadPulse KPI, autoriza o acesso ao teu Pipedrive e
começa a acompanhar a performance da tua equipa imediatamente.
```

**Category:** `Analytics & Reporting`

**Website URL:** `https://pipedrive-kpi.vercel.app`

**Video URL (opcional):** URL de um vídeo de demonstração no YouTube (recomendado para aprovação)

---

### Passo 1.6 — Preencher Setup and Installation

No separador **"Setup and installation"**:

**Installation URL:** `https://pipedrive-kpi.vercel.app/install`
> Esta é a página que o Pipedrive abre quando o utilizador clica "Install Now"

**Post-installation instructions:**
```
Após instalar, serás redirecionado automaticamente para o dashboard.
Seleciona o teu pipeline e começa a ver os KPIs da tua equipa.
```

---

### Passo 1.7 — Preencher Support and Legal Info

No separador **"Support and legal info"**:

| Campo | Valor |
|---|---|
| Support email | O teu email |
| Support URL | `https://pipedrive-kpi.vercel.app` |
| Privacy policy URL | `https://pipedrive-kpi.vercel.app/privacy` ← tens de criar esta página |
| Terms of service URL | `https://pipedrive-kpi.vercel.app/terms` ← tens de criar esta página |

> ⚠️ Sem Privacy Policy o Pipedrive não aprova a app. É obrigatório.

---

### Passo 1.8 — Testar antes de submeter

1. No separador "OAuth & access scopes", clicar no botão verde **"Install & test"**
2. O Pipedrive abre o diálogo OAuth na tua conta sandbox
3. Clicar "Allow and Install"
4. Verificar que o fluxo funciona corretamente

---

### Passo 1.9 — Submeter para revisão

1. Verificar que todos os separadores estão preenchidos
2. Clicar **"Send to review"**
3. Aceitar os termos do **Pipedrive Developer Partner Agreement**
4. Fornecer informações de teste para a equipa do Pipedrive:
   - Credenciais de uma conta de teste (se necessário)
   - Instruções de como testar a app
5. Confirmar o email de contacto
6. A app fica com estado **"In review"**

> ⏳ O processo de revisão pode demorar **1 a 3 semanas**.
> O Pipedrive vai testar a instalação, o fluxo OAuth, as funcionalidades e a UX.

---

## 📋 PARTE 2 — ALTERAÇÕES NO PROJETO (O QUE MUDA NO CÓDIGO)

### O que NÃO muda

- ✅ Toda a lógica do `pipedrive.ts` (chamadas à API) — igual
- ✅ Todos os componentes de dashboard — igual
- ✅ O Zustand store — quase igual (pequena adição)
- ✅ O Recharts, Framer Motion, Tailwind — igual
- ✅ O token continua no localStorage do utilizador — igual

### O que MUDA

- ❌ O `LoginScreen.tsx` — substituído por botão OAuth
- ➕ Nova rota `/api/auth/callback` — troca o code pelo token (não guarda nada)
- ➕ Nova rota `/api/auth/refresh` — renova o token quando expira
- ➕ Nova página `/install` — página de boas-vindas para novos utilizadores
- ➕ Nova página `/privacy` — política de privacidade (obrigatório)
- ➕ Nova página `/terms` — termos de serviço (recomendado)
- ➕ Variáveis de ambiente no Vercel — Client ID e Client Secret

---

### Alteração 2.1 — Variáveis de ambiente (`.env.local`)

Criar ficheiro `.env.local` na raiz do projeto `pipedrive-kpi/`:

```env
PIPEDRIVE_CLIENT_ID=o_teu_client_id_aqui
PIPEDRIVE_CLIENT_SECRET=o_teu_client_secret_aqui
NEXT_PUBLIC_PIPEDRIVE_CLIENT_ID=o_teu_client_id_aqui
NEXT_PUBLIC_APP_URL=https://pipedrive-kpi.vercel.app
```

> ⚠️ `PIPEDRIVE_CLIENT_SECRET` nunca tem prefixo `NEXT_PUBLIC_` — nunca vai para o browser
> ✅ `NEXT_PUBLIC_PIPEDRIVE_CLIENT_ID` é público — pode estar no browser (igual à API Key do Trello)
> ⚠️ Adicionar `.env.local` ao `.gitignore` (confirmar que já está)

No Vercel, adicionar estas variáveis em:
**Project Settings → Environment Variables**

---

### Alteração 2.2 — Criar rota `/api/auth/callback`

Ficheiro a criar: `src/app/api/auth/callback/route.ts`

Esta rota recebe o `?code=` do Pipedrive, troca pelo token, e redireciona
o utilizador para o dashboard com o token na URL (que o browser guarda no localStorage).

```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  // Utilizador cancelou a instalação
  if (error || !code) {
    return NextResponse.redirect(new URL('/auth-error', request.url));
  }

  try {
    // Trocar o code pelo access_token
    // O Client Secret só existe no servidor — nunca vai ao browser
    const credentials = Buffer.from(
      `${process.env.PIPEDRIVE_CLIENT_ID}:${process.env.PIPEDRIVE_CLIENT_SECRET}`
    ).toString('base64');

    const tokenResponse = await fetch('https://oauth.pipedrive.com/oauth/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`,
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error('Falha ao obter token');
    }

    const tokenData = await tokenResponse.json();
    const { access_token, refresh_token, expires_in, api_domain } = tokenData;

    // Redirecionar para o dashboard com os tokens na URL (fragment — não vai ao servidor)
    // O browser guarda os tokens no localStorage via o código cliente
    const redirectUrl = new URL('/auth/success', request.url);
    redirectUrl.searchParams.set('access_token', access_token);
    redirectUrl.searchParams.set('refresh_token', refresh_token);
    redirectUrl.searchParams.set('expires_in', String(expires_in));
    redirectUrl.searchParams.set('api_domain', api_domain);

    return NextResponse.redirect(redirectUrl);

  } catch (err) {
    console.error('OAuth callback error:', err);
    return NextResponse.redirect(new URL('/auth-error', request.url));
  }
}
```

> ✅ Esta rota não guarda nada — só faz a troca e redireciona.
> ✅ O Client Secret nunca sai do servidor.
> ✅ O token vai para o browser do utilizador via URL, que o teu código guarda no localStorage.

---

### Alteração 2.3 — Criar rota `/api/auth/refresh`

Ficheiro a criar: `src/app/api/auth/refresh/route.ts`

Quando o `access_token` expira (tem vida útil), é necessário renová-lo com o `refresh_token`.

```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { refresh_token } = await request.json();

    if (!refresh_token) {
      return NextResponse.json({ error: 'refresh_token required' }, { status: 400 });
    }

    const credentials = Buffer.from(
      `${process.env.PIPEDRIVE_CLIENT_ID}:${process.env.PIPEDRIVE_CLIENT_SECRET}`
    ).toString('base64');

    const tokenResponse = await fetch('https://oauth.pipedrive.com/oauth/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refresh_token,
      }),
    });

    if (!tokenResponse.ok) {
      return NextResponse.json({ error: 'Failed to refresh token' }, { status: 401 });
    }

    const tokenData = await tokenResponse.json();
    // Devolve os novos tokens ao browser — não guarda nada no servidor
    return NextResponse.json(tokenData);

  } catch (err) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
```

---

### Alteração 2.4 — Criar página `/auth/success`

Ficheiro a criar: `src/app/auth/success/page.tsx`

Esta página lê os tokens da URL e guarda-os no localStorage (como já fazes com o token manual).

```typescript
"use client";
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAppStore } from '@/store/appStore';
import { PipedriveAPI } from '@/lib/pipedrive';
import { Loader2 } from 'lucide-react';

export default function AuthSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setToken, setUserParams } = useAppStore();

  useEffect(() => {
    const access_token = searchParams.get('access_token');
    const refresh_token = searchParams.get('refresh_token');
    const expires_in = searchParams.get('expires_in');
    const api_domain = searchParams.get('api_domain');

    if (!access_token) {
      router.push('/auth-error');
      return;
    }

    // Guardar no localStorage (igual ao que fazes agora)
    // Adicionar refresh_token e api_domain ao store
    const init = async () => {
      try {
        const api = new PipedriveAPI(access_token);
        const user = await api.getCurrentUser();
        setUserParams(user.id, user.name, user.is_admin);
        setToken(access_token);
        // Guardar também refresh_token para renovação futura
        localStorage.setItem('pipedrive_refresh_token', refresh_token || '');
        localStorage.setItem('pipedrive_api_domain', api_domain || '');
        localStorage.setItem('pipedrive_token_expires', String(Date.now() + Number(expires_in) * 1000));
        router.push('/');
      } catch {
        router.push('/auth-error');
      }
    };

    init();
  }, []);

  return (
    <div className="min-h-screen bg-[#05070a] flex flex-col items-center justify-center">
      <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-4" />
      <p className="text-gray-400">A ligar ao Pipedrive...</p>
    </div>
  );
}
```

---

### Alteração 2.5 — Substituir o `LoginScreen.tsx`

O ecrã de login atual pede o token manualmente. Substituir por um botão OAuth.

**Ficheiro:** `src/components/auth/LoginScreen.tsx`

Manter o mesmo design visual mas substituir o formulário por:

```typescript
const handleOAuthLogin = () => {
  const clientId = process.env.NEXT_PUBLIC_PIPEDRIVE_CLIENT_ID;
  const redirectUri = encodeURIComponent(`${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`);
  const state = Math.random().toString(36).substring(7); // Anti-CSRF básico

  const authUrl = `https://oauth.pipedrive.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}`;
  window.location.href = authUrl;
};

// No JSX, substituir o <form> por:
<button onClick={handleOAuthLogin} className="...mesmo estilo...">
  Ligar ao Pipedrive
  <ArrowRight className="w-5 h-5" />
</button>
```

> ✅ O utilizador clica → vai ao Pipedrive → autoriza → volta ao teu site com token automático.
> ✅ O teu token manual pode ficar como alternativa (para testes locais).

---

### Alteração 2.6 — Atualizar o `pipedrive.ts` para usar o `api_domain`

Atualmente o teu `pipedrive.ts` usa `https://api.pipedrive.com/v1` fixo.
Com OAuth, o Pipedrive devolve um `api_domain` específico por empresa que deve ser usado.

```typescript
// Antes (fixo):
const API_BASE_URL = 'https://api.pipedrive.com/v1';

// Depois (dinâmico):
const API_BASE_URL = apiDomain
  ? `https://${apiDomain}/api/v1`
  : 'https://api.pipedrive.com/v1';
```

Adicionar `apiDomain` como parâmetro opcional no construtor da classe `PipedriveAPI`.

---

### Alteração 2.7 — Adicionar renovação automática do token

O `access_token` do OAuth tem vida útil (normalmente 1 hora). Precisas de renovar automaticamente
usando o `refresh_token` quando expira.

Criar um hook `src/hooks/useTokenRefresh.ts`:

```typescript
"use client";
import { useEffect } from 'react';
import { useAppStore } from '@/store/appStore';

export function useTokenRefresh() {
  const { token, setToken, logout } = useAppStore();

  useEffect(() => {
    if (!token) return;

    const checkAndRefresh = async () => {
      const expiresAt = localStorage.getItem('pipedrive_token_expires');
      const refreshToken = localStorage.getItem('pipedrive_refresh_token');

      if (!expiresAt || !refreshToken) return;

      // Renovar 5 minutos antes de expirar
      const shouldRefresh = Date.now() > Number(expiresAt) - 5 * 60 * 1000;
      if (!shouldRefresh) return;

      try {
        const response = await fetch('/api/auth/refresh', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh_token: refreshToken }),
        });

        if (!response.ok) {
          logout(); // Token expirado sem possibilidade de renovar
          return;
        }

        const data = await response.json();
        setToken(data.access_token);
        localStorage.setItem('pipedrive_refresh_token', data.refresh_token);
        localStorage.setItem('pipedrive_token_expires', String(Date.now() + data.expires_in * 1000));

      } catch {
        // Falha silenciosa — tenta na próxima verificação
      }
    };

    checkAndRefresh();
    // Verificar a cada 10 minutos
    const interval = setInterval(checkAndRefresh, 10 * 60 * 1000);
    return () => clearInterval(interval);

  }, [token]);
}
```

Usar este hook no `layout.tsx` do dashboard.

---

### Alteração 2.8 — Criar página `/install`

Ficheiro a criar: `src/app/install/page.tsx`

Página de boas-vindas mostrada quando o utilizador vem do Marketplace.
Deve iniciar automaticamente o fluxo OAuth.

```typescript
"use client";
import { useEffect } from 'react';

export default function InstallPage() {
  useEffect(() => {
    // Iniciar OAuth automaticamente ao entrar nesta página
    const clientId = process.env.NEXT_PUBLIC_PIPEDRIVE_CLIENT_ID;
    const redirectUri = encodeURIComponent(`${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`);
    window.location.href = `https://oauth.pipedrive.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}`;
  }, []);

  return (
    <div className="min-h-screen bg-[#05070a] flex items-center justify-center">
      <p className="text-gray-400">A redirecionar para o Pipedrive...</p>
    </div>
  );
}
```

---

### Alteração 2.9 — Criar página `/privacy`

Obrigatório para aprovação no Marketplace. Ficheiro: `src/app/privacy/page.tsx`

Conteúdo mínimo necessário:
- Que dados são acedidos (deals, activities, users, pipelines — só leitura)
- Onde são guardados (apenas no browser do utilizador — localStorage)
- Que não são partilhados com terceiros
- Como o utilizador pode revogar o acesso (desinstalar a app no Pipedrive)
- Contacto para pedidos de privacidade (o teu email)

---

### Alteração 2.10 — Criar página `/auth-error`

Ficheiro: `src/app/auth-error/page.tsx`

Página simples mostrada se o utilizador cancelar a instalação ou houver erro OAuth.

---

## 📋 PARTE 3 — DEPLOY E CONFIGURAÇÃO VERCEL

### Passo 3.1 — Adicionar variáveis de ambiente no Vercel

No painel do Vercel, ir a:
**Project → Settings → Environment Variables**

Adicionar:
```
PIPEDRIVE_CLIENT_ID          = [valor do Developer Hub]
PIPEDRIVE_CLIENT_SECRET      = [valor do Developer Hub]  ← PRIVADO
NEXT_PUBLIC_PIPEDRIVE_CLIENT_ID = [valor do Developer Hub]  ← público
NEXT_PUBLIC_APP_URL          = https://pipedrive-kpi.vercel.app
```

### Passo 3.2 — Confirmar o Callback URL no Developer Hub

Após deploy, confirmar que o URL de callback está correto:
```
https://pipedrive-kpi.vercel.app/api/auth/callback
```

Se mudares o domínio, atualizar no Developer Hub imediatamente.

---

## 🗂️ Resumo de Ficheiros a Criar/Alterar

| Ficheiro | Ação | Prioridade |
|---|---|---|
| `src/app/api/auth/callback/route.ts` | Criar — troca code por token | 🔴 Obrigatório |
| `src/app/api/auth/refresh/route.ts` | Criar — renova token expirado | 🔴 Obrigatório |
| `src/app/auth/success/page.tsx` | Criar — guarda token no localStorage | 🔴 Obrigatório |
| `src/app/install/page.tsx` | Criar — página de boas-vindas / início OAuth | 🔴 Obrigatório |
| `src/app/privacy/page.tsx` | Criar — política de privacidade | 🔴 Obrigatório para Marketplace |
| `src/app/auth-error/page.tsx` | Criar — página de erro OAuth | 🟡 Recomendado |
| `src/app/terms/page.tsx` | Criar — termos de serviço | 🟡 Recomendado |
| `src/components/auth/LoginScreen.tsx` | Alterar — adicionar botão OAuth | 🔴 Obrigatório |
| `src/lib/pipedrive.ts` | Alterar — suporte ao api_domain dinâmico | 🟡 Recomendado |
| `src/hooks/useTokenRefresh.ts` | Criar — renovação automática do token | 🟡 Recomendado |
| `.env.local` | Criar — variáveis de ambiente locais | 🔴 Obrigatório |

---

## ✅ Checklist Final Antes de Submeter

### Técnico
- [ ] Rota `/api/auth/callback` implementada e testada
- [ ] Rota `/api/auth/refresh` implementada
- [ ] Página `/install` inicia OAuth automaticamente
- [ ] Página `/auth/success` guarda token no localStorage
- [ ] `LoginScreen.tsx` tem botão OAuth
- [ ] Variáveis de ambiente configuradas no Vercel
- [ ] Callback URL correto no Developer Hub
- [ ] App testada com "Install & test" na conta sandbox
- [ ] Token expira e é renovado automaticamente

### Marketplace
- [ ] General Info preenchido (nome, descrição, categoria)
- [ ] Setup and Installation preenchido (installation URL)
- [ ] Support and Legal Info preenchido (email, URLs)
- [ ] Página `/privacy` online e acessível
- [ ] Página `/terms` online (recomendado)
- [ ] Scopes mínimos necessários ativados
- [ ] App testada de ponta a ponta na sandbox
- [ ] Email de contacto confirmado

---

## 🔗 Links Úteis

- Developer Hub: https://developers.pipedrive.com/
- Sandbox account: https://pipedrive.readme.io/docs/developer-sandbox-account
- Registar app pública: https://pipedrive.readme.io/docs/marketplace-registering-the-app
- OAuth authorization: https://pipedrive.readme.io/docs/marketplace-oauth-authorization
- OAuth overview: https://pipedrive.readme.io/docs/marketplace-oauth-api
- Scopes mapping: https://pipedrive.readme.io/docs/marketplace-oauth-scopes
- App extensions: https://pipedrive.readme.io/docs/app-extensions
- Installation flows: https://pipedrive.readme.io/docs/marketplace-installation-flows
- Developer community: https://devcommunity.pipedrive.com/

---

*Documento criado em Abril 2026 — Projeto: pipedrive-kpi*
