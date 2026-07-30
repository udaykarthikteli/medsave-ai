/* ==========================================================================
   MedSave AI — backend server
   Serves the static front-end and proxies chat requests to the Gemini API
   so the API key never has to live in browser JavaScript.
   ========================================================================== */

require('dotenv').config();

const path = require('path');
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const PORT = process.env.PORT || 3000;
let GEMINI_API_KEY = (process.env.GEMINI_API_KEY || '').trim().replace(/^["']|["']$/g, '');
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

if (GEMINI_API_KEY && /your_gemini_api_key_here|your_key_here/i.test(GEMINI_API_KEY)) {
  console.warn('\n  ⚠️  GEMINI_API_KEY in .env is still the placeholder text — paste your real key from https://aistudio.google.com/apikey\n');
  GEMINI_API_KEY = '';
}
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.static(path.join(__dirname), { extensions: ['html'] }));

/* --------------------------------------------------------------------------
   System instruction — keeps the assistant in its lane: general public
   health awareness, never a diagnosis, always defers to real clinicians.
   -------------------------------------------------------------------------- */
const SYSTEM_INSTRUCTION = `You are the "MedSave AI Assistant", the in-app helper for the MedSave AI
public-health-awareness platform. Your job is to explain diseases, symptoms in general terms,
prevention, hygiene, vaccination, nutrition, exercise, mental wellbeing, and healthy-living habits
in clear, warm, plain language.

Hard rules:
- You are NOT a doctor and must never provide a diagnosis, a prescription, or a specific dosage.
- If the user describes symptoms, give general educational information and clearly recommend they
  see a licensed healthcare professional for anything specific to their situation.
- If the user describes an emergency (chest pain, difficulty breathing, severe bleeding, stroke
  signs, loss of consciousness, suicidal thoughts, etc.), immediately and clearly tell them to
  contact local emergency services or a crisis line right now, before anything else.
- Keep answers concise (roughly 2-6 short sentences or a short bullet list) and easy to read on a
  small chat widget. Avoid walls of text.
- You may be given "Live sensor context" describing real-time readings from a Bluetooth heart-rate
  or blood-pressure device, or a microphone-based digital stethoscope that the user has connected
  in their browser. Reference those numbers naturally when relevant, explain in general terms what
  a healthy range looks like, and always add that connected consumer sensors are for awareness and
  education only, not a certified medical device or diagnosis.
- Never invent readings that were not given to you in the Live sensor context.
- Be warm, encouraging, and non-alarmist, while still taking real red flags seriously.`;

/* --------------------------------------------------------------------------
   Rate limiting — keep this demo project from being trivially abused.
   -------------------------------------------------------------------------- */
const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many messages — please wait a moment and try again.' }
});

/* --------------------------------------------------------------------------
   Health check — the front-end pings this once so it knows whether to show
   "Live AI" (Gemini configured) or "Demo mode" (rule-based fallback).
   -------------------------------------------------------------------------- */
app.get('/api/health', (req, res) => {
  res.json({ ok: true, aiConfigured: Boolean(GEMINI_API_KEY), model: GEMINI_MODEL });
});

/* --------------------------------------------------------------------------
   Chat endpoint
   Body: { message: string, history?: [{role:'user'|'bot', text:string}], vitals?: object }
   -------------------------------------------------------------------------- */
app.post('/api/chat', chatLimiter, async (req, res) => {
  try {
    const { message, history, vitals } = req.body || {};

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'A "message" string is required.' });
    }
    if (message.length > 2000) {
      return res.status(400).json({ error: 'Message is too long.' });
    }

    if (!GEMINI_API_KEY) {
      return res.status(503).json({
        error: 'no_api_key',
        message: 'Gemini API key is not configured on the server yet.'
      });
    }

    const contents = [];

    if (Array.isArray(history)) {
      history.slice(-12).forEach((turn) => {
        if (!turn || !turn.text) return;
        contents.push({
          role: turn.role === 'user' ? 'user' : 'model',
          parts: [{ text: String(turn.text).slice(0, 2000) }]
        });
      });
    }

    let userText = message.trim();
    if (vitals && typeof vitals === 'object' && Object.keys(vitals).length) {
      const vitalsLines = Object.entries(vitals)
        .filter(([, v]) => v !== null && v !== undefined && v !== '')
        .map(([k, v]) => `- ${k}: ${v}`)
        .join('\n');
      if (vitalsLines) {
        userText += `\n\n[Live sensor context — real-time readings from the user's connected device(s), for awareness only]\n${vitalsLines}`;
      }
    }

    contents.push({ role: 'user', parts: [{ text: userText }] });

    const geminiResponse = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': GEMINI_API_KEY
      },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
        contents,
        generationConfig: {
          temperature: 0.6,
          maxOutputTokens: 500
        },
        safetySettings: [
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_ONLY_HIGH' },
          { category: 'HARM_CATEGORY_MEDICAL', threshold: 'BLOCK_NONE' }
        ]
      })
    });

    if (!geminiResponse.ok) {
      const errText = await geminiResponse.text().catch(() => '');
      console.error('Gemini API error:', geminiResponse.status, errText);

      let hint = 'The AI service could not be reached right now. Please try again shortly.';
      if (geminiResponse.status === 400) hint = 'Gemini rejected the request (400) — often an invalid GEMINI_MODEL name in .env.';
      else if (geminiResponse.status === 401 || geminiResponse.status === 403) hint = 'Gemini rejected the API key (401/403) — the key in .env is invalid, disabled, or missing API access. Get a fresh key from https://aistudio.google.com/apikey.';
      else if (geminiResponse.status === 429) hint = 'Gemini rate/quota limit hit (429) — wait a bit or check quota in Google AI Studio.';

      return res.status(502).json({
        error: 'upstream_error',
        message: hint
      });
    }

    const data = await geminiResponse.json();
    const candidate = data && data.candidates && data.candidates[0];
    const reply = candidate?.content?.parts?.map((p) => p.text || '').join('').trim();

    if (!reply) {
      const blockReason = data?.promptFeedback?.blockReason;
      return res.status(200).json({
        reply: blockReason
          ? "I can't help with that particular request. Could you rephrase it as a general health-awareness question?"
          : "I didn't quite catch that — could you rephrase your question?"
      });
    }

    res.json({ reply, model: GEMINI_MODEL });
  } catch (err) {
    console.error('Chat endpoint error:', err);
    res.status(500).json({ error: 'server_error', message: 'Something went wrong on our end.' });
  }
});

/* --------------------------------------------------------------------------
   Fallback: send index.html for unknown non-API GET routes (nice for
   direct links / refreshes if this is ever deployed behind a router).
   -------------------------------------------------------------------------- */
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) return next();
  res.sendFile(path.join(__dirname, 'index.html'), (err) => {
    if (err) next();
  });
});

app.listen(PORT, () => {
  console.log(`\n  MedSave AI server running →  http://localhost:${PORT}`);
  console.log(`  Gemini AI chat: ${GEMINI_API_KEY ? `ENABLED (${GEMINI_MODEL})` : 'DISABLED — add GEMINI_API_KEY to .env'}\n`);
});
