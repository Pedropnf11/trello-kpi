# 📊 KPI Master — Trello Sales Analytics Platform (Power-Up & Standalone)

**Real-time sales KPI dashboards and native Trello integrations, built without a backend.**

KPI Master is a zero-infrastructure sales analytics platform built directly on top of Trello. By utilizing client-side processing, it reads data directly from the Trello API via the browser. This ensures maximum privacy (no data is sent to third-party databases), zero infrastructure cost, and real-time fresh insights.

> 💡 Looking for the Pipedrive version? Check out [Pipedrive KPI Dashboard](./pipedrive-kpi/README.md).

| Product | Status | Link |
|---|---|---|
| **Trello Power-Up** | ✅ Live on Trello | 
| **Trello Standalone Dashboard** | ✅ Live  |

---

## 🎯 Background & Motivation

KPI Master was born out of a real business need. The creator utilized Trello as a CRM to manage operations at their **marketing agency**. However, they faced significant challenges in tracking salesperson performance, managing sales consultants, and identifying bottlenecks. Although the team received sales scripts and training, it was difficult to monitor individual and team performance without a structured way to measure metrics. 

To solve this, KPI Master was built to manage the sales pipeline effectively, display transparent performance results, and pinpoint inefficiencies (or "gordura") within the commercial workflow. This specifically allowed the agency to track the ROI of leads generated through paid Facebook and Instagram ads and optimize follow-up times, turning raw Trello activity into clear, actionable, and visual metrics.

---

## 🔌 Trello Integration Flow

You can install and use KPI Master directly inside your Trello workspace. The timeline of using the app is divided into two distinct scopes:

```
[ Trello Interface (UI) ] ── (Click "KPI Master" Board Button) ──> [ Sales World Dashboard ]
   ├── Card Age Badges                                                ├── Leaderboard & Goals
   ├── Card Analytics Section                                         ├── Visual Sales Funnel
   └── List Sorters (Oldest/Newest)                                   └── Stuck Leads & Heatmaps
```

### 1. Inside the Trello UI/Application (Lightweight Features)
To keep the CRM workflow fast and contextual, KPI Master implements only **3 lightweight features** directly within the native Trello boards:
* **🕒 Card Age Badges (Card Front):** Displays the age of each card on the front (e.g. `🕒 Created today`, `🕒 5 days old`). It automatically turns **yellow** (after 14 days) or **red** (after 30 days) to highlight cold leads instantly.
* **📋 Card Analytics Section (Card Back):** A custom detail panel on the back of every card that shows the exact creation date (e.g., `Created on July 17, 2026 (2 days ago)`) and provides a quick-access button (` Ver KPIs do Quadro`) to open the full dashboard.
* **↕️ List Sorters (List Action Menu):** Adds custom sorting options to any Trello list: `KPI Master: Oldest First` and `KPI Master: Newest First`. This helps sales reps organize their pipeline by lead age with a single click.

### 2. Inside the Dashboard — "The Sales World" (Full Features)
Clicking the "KPI Master" button on the board bar opens the full analytics dashboard (either as an iframe modal overlay inside Trello or on a standalone page). This is the **Sales World** where the vast majority of the analytical features live:
* **Leaderboards & Activity Timelines:** Track individual sales rep performance and card update histories.
* **Visual Sales Funnel & Conversion Rates:** Automatically calculates conversion rates, stage throughput, and throughput duration across Trello lists.
* **Activity Heatmaps:** A day-of-week × hour-of-day grid detailing when the team is most active based on card movements.
* **Stuck Leads Detection:** Surfaces stalled cards with a client-side aging algorithm, notifying managers of leads stuck in the pipeline.
* **Dual Dashboard Modes (Manager vs. Salesperson):** Completely different interface configurations based on the user's role.
* **Interactive Filtering:** Filter the entire dataset by date range, list visibility, or specific team members.
* **PDF Export:** Generates print-ready PDFs of the current dashboard using `html2canvas` + `jsPDF`.

---

## ⚡ Power-Up vs. Standalone Dashboard

We provide two products to fit different team preferences:
* **Power-Up (v1):** Maximum workflow integration. Opens directly inside Trello's overlay modal. Clicking any lead inside the dashboard automatically focuses and opens Trello's native card back window, creating a perfect closed loop for client management.
* **Standalone Dashboard (v2):** Maximum layout flexibility. It runs as a full-page web app with a rich dark-mode interface, support for multiple boards, card attachment OCR (via Tesseract.js to scan invoices/receipts in-browser), and direct API Key input.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Bundler | Vite 7 |
| Language | Vanilla JavaScript (ES Modules) |
| Integration | Trello Power-Up SDK |
| API | Trello REST API |
| Charts | Chart.js |
| OCR | Tesseract.js |
| PDF Export | html2canvas + jsPDF |
| Hosting | Vercel |

---

## 🚀 Getting Started

### Prerequisites
* Node.js v18+
* A Trello API Key → [trello.com/app-key](https://trello.com/app-key)

### Setup Instructions

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/Pedropnf11/trello-kpi.git
   cd trello-kpi
   ```

2. **Install & Run Dev Server:**
   ```bash
   npm install
   npm run dev
   ```
   Runs at `http://localhost:5173`.

3. **Configure Environment:**
   Create a `.env` file in the root folder:
   ```env
   VITE_TRELLO_API_KEY=your_trello_api_key
   ```

4. **Testing the Power-Up locally:**
   * Go to [trello.com/power-ups/admin](https://trello.com/power-ups/admin).
   * Create a new Power-Up.
   * Set the iframe connector URL to `http://localhost:5173/trello/index.html`.
   * Add the Power-Up to a test board.

---

## 🔒 Security

* **Read-only scopes** — KPI Master only reads board, card, and member data. It never modifies your CRM records.
* **No database/server storage** — Your Trello API token is stored locally in your browser's `localStorage` and never transmitted to external servers.
* **Content Security Policy (CSP)** — Strict headers configured on Vercel deployment.

---

