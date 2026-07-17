# 📊 KPI Master — Pipedrive Sales Analytics Dashboard

**Real-time sales KPI dashboards for Pipedrive pipelines, built with Next.js, React, and Zustand (zero backend storage).**

KPI Master for Pipedrive is a zero-infrastructure sales analytics platform designed for sales teams. Instead of copying, storing, and serving your data from a third-party database, it calls the Pipedrive REST API **directly from the browser** — providing live analytics with no setup, no database, and no data lock-in.

> 💡 Looking for the Trello version? Check out [Trello Power-Up & Dashboard](../README.md).

| Product | Status | Link |
|---|---|---|
| **Pipedrive KPI Dashboard** | 🔧 In Development (Testing Phase)  |

---

## 🎯 Background & Motivation

KPI Master was built to solve the core challenges of sales team metrics. The creator, managing operations at their **marketing agency**, originally used Trello and Pipedrive as CRMs but found it difficult to monitor salesperson productivity, manage consultants, and pinpoint bottleneck areas. Although they provided sales scripts and training, tracking individual performance was hard without real-time metrics.

To overcome this, KPI Master was created to track conversion rates, pipeline velocity, and sales goals. It allows managers to inspect the ROI of leads generated through paid Facebook and Instagram ads, detect stalled deals in real-time, and enable sales reps to instantly follow up via WhatsApp. By processing everything client-side, the app maintains complete privacy and transparency.

---

## ✨ Features

KPI Master features a rich dark-mode interface with animations and interactive charts, structured into two separate role-based dashboards:

### 1. Manager Dashboard (Team Analytics)
* **Team Leaderboard:** Renders salesperson performance based on closed deals, won values, and active pipelines.
* **Visual Sales Funnel:** Maps Pipedrive pipeline stages to show conversion rates, bottleneck detection, and average time-in-stage.
* **Activity Heatmap:** Renders a day-of-week × hour-of-day grid of deal movements and updates.
* **Stuck Leads Aging Analysis:** Custom client-side algorithm that flags deals stalled beyond a threshold, calculating "days stuck" automatically.

### 2. Salesperson Dashboard (Focus Zone)
* **Goal Tracker:** Personal sales goal progress bars compared to team averages.
* **Focus Zone:** Surfaced items that require immediate attention (such as deals nearing expiration, stuck leads, or scheduled activities).
* **Activity Timeline:** Log of recent updates and actions performed by the rep.

### 💬 WhatsApp Quick Actions
Embedded contact buttons on stuck leads and salesperson focus widgets. A single click extracts context from the Pipedrive Deal object (Client Name, Deal Title, Days Stuck, and Owner) and generates a pre-filled, professional follow-up message template. Clicking the button opens `https://wa.me/` to initiate the conversation instantly.

### 🔄 Multi-Pipeline Switcher
A dropdown selector that fetches and lists all Pipedrive pipelines associated with the user account, loading and processing the selected pipeline's deals on-the-fly.

### 📄 PDF Export
Export print-ready dashboards to PDF from the browser using `html2pdf.js`, preserving charts and layout.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript 5 |
| UI | React 19 |
| Styling | Tailwind CSS v4 |
| Charts | Recharts 2 |
| Animations | Framer Motion 11 |
| State | Zustand 5 |
| Icons | Lucide React |
| PDF Export | html2pdf.js |
| API | Pipedrive REST API |
| Hosting | Vercel |

---

## 🚀 Getting Started

### Prerequisites
* Node.js v18+
* A Pipedrive API Token → Pipedrive → Settings → Personal Preferences → API

### Setup Instructions

1. **Navigate to the Directory:**
   ```bash
   cd pipedrive-kpi
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Run Dev Server:**
   ```bash
   npm run dev
   ```
   Runs at `http://localhost:3000`. Simply paste your Pipedrive API Token into the login screen to access your pipelines (stored securely in your browser's `localStorage`).

---

## ⚙️ Configuration & OAuth Environment

For local developer testing of the Pipedrive Marketplace OAuth flow, create a `.env.local` file inside `pipedrive-kpi/`:

```env
PIPEDRIVE_CLIENT_ID=your_client_id
PIPEDRIVE_CLIENT_SECRET=your_client_secret       # Server-side only, never exposed to browser
NEXT_PUBLIC_PIPEDRIVE_CLIENT_ID=your_client_id
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

> ⚠️ Never commit `.env.local` to source control.

---

## 🧠 Architecture

KPI Master Pipedrive app is structured to separate data fetching, state management, and visual components:
* **Data Layer:** A single `PipedriveAPI` wrapper in processes all REST requests.
* **State Layer:** Zustand stores the API token, pipeline ID, active filters, and cached deal summaries.
* **Component Layer:** Modular components subscribe to Zustand store slices and render views dynamically.
---

## 🔒 Security

* **Read-only scopes** — KPI Master only reads deal, activity, pipeline, and user data.
* **No database/server storage** — OAuth tokens are kept in the user's browser `localStorage`.
* **OAuth Client Secret isolation** — Client Secret is processed exclusively in server-side Next.js route handlers  and never exposed to the client.


