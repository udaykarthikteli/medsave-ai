# MedSave AI

**AI-Driven Public Health Chatbot for Disease Awareness** — a full-stack B.Tech final-year
project. A Node/Express backend serves the site and talks to **Google Gemini** for real,
open-ended AI chat, and the browser can bridge in **real physical devices** (a Bluetooth
heart-rate strap, a Bluetooth blood-pressure cuff, and a microphone-based digital
stethoscope) for live, context-aware health awareness conversations.

## ✨ What's new in this version

- **Real AI chat** — the chatbot now calls the Gemini API through a small backend, so it can
  answer *any* health-awareness question, not just canned keyword replies.
- **Bigger, cleaner chat window** — long AI answers wrap properly, support lists/bold text,
  and the window can be expanded to a larger reading size.
- **Live Reading page** (`live-reading.html`) — a new "Physical AI" page that connects to:
  - a **Bluetooth heart-rate monitor** (standard BLE Heart Rate Service),
  - a **Bluetooth blood-pressure cuff** (standard BLE Blood Pressure Service),
  - a **digital stethoscope via the microphone input** (works with USB/3.5mm electronic
    stethoscopes recognized as an audio device, or a laptop mic).
  Live readings are shown on-screen **and** automatically shared as context with the AI chat
  on that page, so you can ask things like *"what does my heart rate mean?"* and get an
  answer grounded in your actual live number.
- A demo-mode fallback keeps the chatbot fully working even with **zero setup** if you don't
  want to add an API key yet.

## How to run (full stack)

This is now a small Node.js/Express app (previously a static site).

```bash
cd medsave-ai
npm install
cp .env.example .env
```

1. Get a **free Gemini API key** from [Google AI Studio](https://aistudio.google.com/apikey).
2. Open `.env` and paste it in:
   ```
   GEMINI_API_KEY=your_key_here
   ```
3. Start the server:
   ```bash
   npm start
   ```
4. Visit **http://localhost:3000**.

Without a `GEMINI_API_KEY`, the site still runs perfectly — the chatbot automatically drops
into **Demo mode** (the original rule-based keyword responder) and says so in its status pill.

> Live Reading's Bluetooth features require **Chrome or Edge** (desktop or Android) — Web
> Bluetooth isn't supported in Safari/Firefox. The site must be served over `http://localhost`
> or `https://` (not opened as a bare `file://` page) for the microphone and Bluetooth APIs to
> work — running it via `npm start` already takes care of that.

## Structure

```
medsave-ai/
├── server.js          Express backend — serves the site + POST /api/chat (Gemini proxy)
├── package.json        Node dependencies & scripts
├── .env.example         Copy to .env and add your GEMINI_API_KEY
├── index.html          Page 1 — Welcome / landing (Login + Sign Up CTAs)
├── login.html           Page 2 — Login
├── signup.html           Page 3 — Sign Up
├── dashboard.html      Page 4 — Home Dashboard (chatbot, disease-awareness cards,
│                       health tips, features, guardian-bots background scene)
├── live-reading.html   Page 5 — Physical AI: Bluetooth vitals + mic stethoscope + live chat
├── css/
│   └── style.css       All design tokens, layout, glassmorphism, animations
├── js/
│   ├── icons.js          Inline SVG icon library (no external icon fonts)
│   ├── background.js     Glowing particles + floating icons + guardian-bot scene
│   ├── auth.js            Front-end login/signup validation & demo session (localStorage)
│   ├── chatbot.js         Chat window logic, Gemini API bridge, demo-mode fallback
│   ├── live-reading.js    Web Bluetooth GATT + Web Audio mic stethoscope + live chat wiring
│   └── tips.js            Rotating daily health tips
└── README.md
```

## How the AI chat works

- The browser never talks to Gemini directly — it calls **your own server** at
  `POST /api/chat`, which holds the API key and forwards the request. This keeps your key out
  of the client-side JavaScript.
- `GET /api/health` tells the front-end whether a key is configured, so the chat header shows
  **Live AI · Online**, **Demo mode**, or **Offline**.
- The Live Reading page attaches your current device readings to every chat message as extra
  context, so answers can reference your real numbers — the system prompt in `server.js`
  explicitly instructs the model to treat this as general awareness information only, never a
  diagnosis, and to point to real emergency/medical help when appropriate.
- Want a different Gemini model? Set `GEMINI_MODEL` in `.env` (defaults to
  `gemini-2.5-flash`).

## Connecting real hardware (Physical AI)

| Device | How it connects | Standard used |
|---|---|---|
| Heart-rate strap / smartwatch / ring | "Connect Device" → Web Bluetooth pairing dialog | BLE **Heart Rate Service** (`0x180D`) |
| Blood-pressure cuff | "Connect Device" → Web Bluetooth pairing dialog | BLE **Blood Pressure Service** (`0x1810`) |
| Electronic/USB stethoscope | Plug in, allow mic access, pick it from the dropdown | Standard OS audio-input device via `getUserMedia` |

The stethoscope's "acoustic pulse" number is computed live in the browser from the actual
microphone signal (low-pass filter + peak detection) — it is **not** a simulated or random
value, but it's explicitly labelled as an experimental estimate, not a clinical-grade reading,
since consumer mics/laptop mics aren't calibrated diagnostic instruments.

## Notes

- Login/Sign Up is still a **front-end demo**: accounts are stored in the browser's
  `localStorage`, not a real user database. Swap `js/auth.js` for real API calls (and add a
  users table/route to `server.js`) when you're ready to wire up persistent accounts.
- Colors, type, and motion follow the original brief: light-yellow/white/gold palette,
  glassmorphism cards, Poppins + Inter type, and restrained motion (respects
  `prefers-reduced-motion`).
- Everything is a single Express app, so it deploys anywhere Node.js runs (Render, Railway,
  a VPS, etc.) — just set `GEMINI_API_KEY` in that platform's environment variables.
