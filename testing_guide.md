# Easy KPIs Master — Trello Power-Up Testing & Usage Guide

Thank you for reviewing **Easy KPIs Master**! This guide explains how to install, configure, and test the Power-Up on a Trello board.

---

## 1. Installation

To add **Easy KPIs Master** as a custom Power-Up on your Trello board:
1. Go to your Trello Board and open the **Power-Ups** menu.
2. Select **Custom** -> **Create a Power-Up**.
3. Fill in the basic details:
   - **Name**: `Easy KPIs Master`
   - **Iframe Connector URL**: `https://kpismaster.vercel.app/trello/index.html`
4. Go to **Capabilities** (Recursos) and ensure that:
   - **Board Buttons** (Botões do quadro) is enabled.
   - **Show Settings** (Mostrar configurações) is enabled.
   - **Authorization Status** and **Show Authorization** are enabled.
5. Click **Save** and add the newly created Power-Up to your testing board.

---

## 2. Testing Steps

### Step 1: Open the Power-Up
- Click the **Easy KPIs Master** button in the Trello board header.
- A popup modal will open immediately.

### Step 2: Open the Dashboard
- Click the **🚀 Open KPI Master** (or **🚀 Abrir KPI Master** depending on your Trello language) button.
- The Power-Up will automatically detect the active board's ID and open the main interactive dashboard in a new tab:
  `https://kpismaster.vercel.app/#board={boardId}`

---

## 3. Localization
The Power-Up automatically detects your Trello user language:
- If your Trello account language starts with **Portuguese (`pt`)**, the Power-Up will render in Portuguese.
- For all other languages, it will default to **English (`en`)**.

---

For any questions, support, or further guidance, feel free to contact us at [phenrique07082003@gmail.com](mailto:phenrique07082003@gmail.com).
