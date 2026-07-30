/* ==========================================================================
   MedSave AI — chatbot interaction logic
   Talks to the backend's /api/chat endpoint (Google Gemini) when available,
   and gracefully falls back to a rule-based demo mode when it isn't
   (e.g. the site is opened as a static file, or no API key is configured).
   ========================================================================== */

const MS_RESPONSES = {
  symptoms: "Common symptoms to watch for include fever, fatigue, persistent cough, body aches, and appetite changes. If symptoms last more than 3 days or feel severe, please consult a licensed healthcare professional promptly.",
  disease: "Disease awareness starts with knowing how illnesses spread — droplets, contact, or vectors like mosquitoes. Learning early warning signs for conditions like flu, dengue, or diabetes helps you act sooner and stay protected.",
  prevention: "Prevention basics: wash hands for 20 seconds, keep vaccinations current, maintain good ventilation indoors, and avoid close contact when unwell. Small daily habits prevent most common illnesses.",
  lifestyle: "A healthy lifestyle blends balanced meals, 30 minutes of daily movement, 7–8 hours of sleep, and stress management. Consistency matters more than intensity — small sustainable habits win long-term.",
  vaccination: "Vaccines train your immune system to recognize threats before you're exposed. Stay current with routine immunizations and seasonal recommendations from your local health authority.",
  emergency: "For a medical emergency — difficulty breathing, chest pain, severe bleeding, or loss of consciousness — call your local emergency number immediately. Don't wait for symptoms to worsen.",
  greeting: "Hello! I'm your MedSave AI assistant. I can share general health awareness, prevention tips, and lifestyle guidance. What would you like to explore today?",
  vitals: "I can see your live reading. In general, this is useful for awareness trends over time — but a single reading from a consumer sensor isn't a diagnosis. If a number looks unusual for you, it's worth rechecking and mentioning it to a clinician.",
  default: "That's a great question. While I specialize in general public health awareness and prevention tips, for anything specific to your health, please consult a licensed doctor. Would you like tips on symptoms, prevention, or healthy living instead?"
};

/* --------------------------- helpers --------------------------- */

function msTimestamp(){
  const d = new Date();
  return d.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
}

function msMatchResponse(text){
  const t = text.toLowerCase();
  if(/symptom/.test(t)) return MS_RESPONSES.symptoms;
  if(/disease|awareness|illness/.test(t)) return MS_RESPONSES.disease;
  if(/prevent/.test(t)) return MS_RESPONSES.prevention;
  if(/lifestyle|diet|exercise|sleep/.test(t)) return MS_RESPONSES.lifestyle;
  if(/vaccin/.test(t)) return MS_RESPONSES.vaccination;
  if(/emergency|urgent|help now/.test(t)) return MS_RESPONSES.emergency;
  if(/bpm|heart rate|blood pressure|reading|vitals|stethoscope/.test(t)) return MS_RESPONSES.vitals;
  if(/hi|hello|hey/.test(t)) return MS_RESPONSES.greeting;
  return MS_RESPONSES.default;
}

function msEscapeHtml(str){
  return str.replace(/[&<>"']/g, (c)=>({
    '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'
  }[c]));
}

/* Very small markdown-lite renderer: **bold**, `code`, "- " bullet lists, paragraphs. */
function msRenderMarkdownLite(raw){
  const escaped = msEscapeHtml(raw);
  const lines = escaped.split(/\n/);
  let html = '';
  let inList = false;

  const inline = (s) => s
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`(.+?)`/g, '<code>$1</code>');

  lines.forEach((line) => {
    const bullet = line.match(/^\s*[-*]\s+(.*)/);
    if(bullet){
      if(!inList){ html += '<ul>'; inList = true; }
      html += `<li>${inline(bullet[1])}</li>`;
    } else {
      if(inList){ html += '</ul>'; inList = false; }
      if(line.trim() === ''){
        // paragraph break — skip empty <p>
      } else {
        html += `<p>${inline(line)}</p>`;
      }
    }
  });
  if(inList) html += '</ul>';
  return html || `<p>${inline(escaped)}</p>`;
}

/* --------------------------- rendering --------------------------- */

function msAppendMessage(body, role, text, opts){
  opts = opts || {};
  const wrap = document.createElement('div');
  wrap.className = 'msg ' + role;

  const avatar = document.createElement('div');
  avatar.className = 'bubble-avatar';
  avatar.innerHTML = role === 'bot' ? msIcon('bot') : msIcon('user');
  if(role === 'user'){ avatar.style.color = 'var(--gold-600)'; }

  const bubbleWrap = document.createElement('div');
  bubbleWrap.className = 'bubble-col';
  const bubble = document.createElement('div');
  bubble.className = 'bubble' + (opts.error ? ' error-bubble' : '');

  if(role === 'bot'){
    bubble.innerHTML = msRenderMarkdownLite(text);
  } else {
    bubble.textContent = text;
  }

  const time = document.createElement('span');
  time.className = 'time';
  time.textContent = msTimestamp();
  bubbleWrap.appendChild(bubble);
  bubbleWrap.appendChild(time);

  wrap.appendChild(avatar);
  wrap.appendChild(bubbleWrap);
  body.appendChild(wrap);
  msScrollToBottom(body);
  return wrap;
}

/* Scrolls after layout has actually settled (double rAF) instead of right
   after appendChild, so the entrance animation/image/font reflow can't
   cause a second visible jump a moment later. */
function msScrollToBottom(body){
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      body.scrollTop = body.scrollHeight;
    });
  });
}

function msShowTyping(body){
  const wrap = document.createElement('div');
  wrap.className = 'msg bot';
  wrap.id = 'typingIndicator';
  wrap.innerHTML = `<div class="bubble-avatar">${msIcon('bot')}</div>
    <div class="bubble"><div class="typing-dots"><span></span><span></span><span></span></div></div>`;
  body.appendChild(wrap);
  msScrollToBottom(body);
}
function msHideTyping(body){
  const t = document.getElementById('typingIndicator');
  if(t) t.remove();
}

/* --------------------------- AI backend bridge --------------------------- */

let MS_AI_STATUS = 'unknown'; // 'live' | 'demo' | 'offline'

async function msCheckAIHealth(){
  try{
    const ctrl = new AbortController();
    const timer = setTimeout(()=>ctrl.abort(), 4000);
    const res = await fetch('/api/health', { signal: ctrl.signal });
    clearTimeout(timer);
    if(!res.ok) throw new Error('bad status');
    const data = await res.json();
    MS_AI_STATUS = data.aiConfigured ? 'live' : 'demo';
  } catch(e){
    MS_AI_STATUS = 'offline';
  }
  document.dispatchEvent(new CustomEvent('ms-ai-status', { detail: MS_AI_STATUS }));
  return MS_AI_STATUS;
}

/**
 * Sends a message to the Gemini-backed /api/chat endpoint.
 * Falls back to the local rule-based responder if the backend is
 * unreachable or no API key has been configured server-side.
 */
async function msGetAIReply(message, history, vitals){
  if(MS_AI_STATUS === 'offline'){
    return { reply: msMatchResponse(message), source: 'demo' };
  }
  try{
    const ctrl = new AbortController();
    const timer = setTimeout(()=>ctrl.abort(), 20000);
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history: history || [], vitals: vitals || null }),
      signal: ctrl.signal
    });
    clearTimeout(timer);

    if(res.status === 503){
      MS_AI_STATUS = 'demo';
      return { reply: msMatchResponse(message), source: 'demo' };
    }
    if(!res.ok){
      const err = await res.json().catch(()=>({}));
      return { reply: err.message || "I couldn't reach the AI service just now. Please try again in a moment.", source: 'error' };
    }
    const data = await res.json();
    return { reply: data.reply, source: 'live' };
  } catch(e){
    MS_AI_STATUS = 'offline';
    return { reply: msMatchResponse(message), source: 'demo' };
  }
}

/* --------------------------- voice input (mic → text) --------------------------- */

/**
 * Wires a mic button to the browser's SpeechRecognition API so the person
 * can dictate their question instead of typing it. Falls back to a
 * disabled, explained button when the browser doesn't support it.
 */
function msWireMic(micBtn, input){
  if(!micBtn) return;
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;

  if(!SR){
    micBtn.innerHTML = msIcon('micOff');
    micBtn.disabled = true;
    micBtn.title = "Voice input isn't supported in this browser";
    return;
  }

  micBtn.innerHTML = msIcon('mic');
  micBtn.title = 'Speak your question';
  micBtn.setAttribute('aria-pressed', 'false');

  let rec = null;
  let listening = false;
  let baseValue = '';

  function stopListening(){
    listening = false;
    micBtn.classList.remove('recording');
    micBtn.setAttribute('aria-pressed', 'false');
    if(rec){ try{ rec.stop(); } catch(e){} }
  }

  function startListening(){
    baseValue = input.value.trim() ? input.value.trim() + ' ' : '';
    rec = new SR();
    rec.continuous = false;
    rec.interimResults = true;
    rec.maxAlternatives = 1;
    rec.lang = navigator.language || 'en-US';

    rec.onresult = (e) => {
      let transcript = '';
      for(let i = e.resultIndex; i < e.results.length; i++){
        transcript += e.results[i][0].transcript;
      }
      input.value = (baseValue + transcript).trim();
    };
    rec.onerror = (e) => {
      if(e.error === 'not-allowed' || e.error === 'service-not-allowed'){
        micBtn.title = 'Microphone permission was blocked';
      }
      stopListening();
    };
    rec.onend = () => {
      listening = false;
      micBtn.classList.remove('recording');
      micBtn.setAttribute('aria-pressed', 'false');
      input.focus();
    };

    try{
      rec.start();
      listening = true;
      micBtn.classList.add('recording');
      micBtn.setAttribute('aria-pressed', 'true');
    } catch(err){
      stopListening();
    }
  }

  micBtn.addEventListener('click', () => {
    listening ? stopListening() : startListening();
  });
}

/* --------------------------- voice output (text → speech) --------------------------- */

const MS_TTS_KEY = 'msTtsEnabled';

function msStripForSpeech(raw){
  return raw
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/`(.+?)`/g, '$1')
    .replace(/^\s*[-*]\s+/gm, '')
    .replace(/\n+/g, '. ')
    .trim();
}

/**
 * Wires a toggle button that lets the person turn "read replies aloud" on
 * or off (persisted across visits). Returns a small controller the chat
 * widget uses to actually speak a given reply once it arrives.
 */
function msWireTTS(ttsBtn){
  const supported = 'speechSynthesis' in window;
  let enabled = supported && localStorage.getItem(MS_TTS_KEY) === '1';

  function paint(){
    if(!ttsBtn) return;
    ttsBtn.innerHTML = msIcon(enabled ? 'volume' : 'volumeOff');
    ttsBtn.classList.toggle('active', enabled);
    ttsBtn.setAttribute('aria-pressed', String(enabled));
    ttsBtn.title = enabled ? 'Voice replies on — tap to mute' : 'Voice replies off — tap to enable';
  }

  if(ttsBtn){
    if(!supported){
      ttsBtn.innerHTML = msIcon('volumeOff');
      ttsBtn.disabled = true;
      ttsBtn.title = "Voice replies aren't supported in this browser";
    } else {
      paint();
      ttsBtn.addEventListener('click', () => {
        enabled = !enabled;
        localStorage.setItem(MS_TTS_KEY, enabled ? '1' : '0');
        if(!enabled) window.speechSynthesis.cancel();
        paint();
      });
    }
  }

  return {
    isEnabled: () => supported && enabled,
    speak(text, cb){
      cb = cb || {};
      if(!supported || !enabled) return false;
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(msStripForSpeech(text));
      utter.rate = 1;
      utter.pitch = 1;
      utter.lang = navigator.language || 'en-US';
      if(cb.onStart) utter.onstart = cb.onStart;
      if(cb.onEnd){ utter.onend = cb.onEnd; utter.onerror = cb.onEnd; }
      window.speechSynthesis.speak(utter);
      return true;
    },
    stop(){ if(supported) window.speechSynthesis.cancel(); }
  };
}

/* --------------------------- widget wiring --------------------------- */

function msSetStatusPill(statusEl, mode){
  if(!statusEl) return;
  statusEl.classList.remove('mode-live','mode-demo','mode-offline');
  const label = statusEl.querySelector('.label') || statusEl;
  if(mode === 'live'){
    statusEl.classList.add('mode-live');
    if(label !== statusEl) label.textContent = 'Live AI · Online';
  } else if(mode === 'demo'){
    statusEl.classList.add('mode-demo');
    if(label !== statusEl) label.textContent = 'Demo mode';
  } else {
    statusEl.classList.add('mode-offline');
    if(label !== statusEl) label.textContent = 'Offline';
  }
}

/**
 * On phones, opening the on-screen keyboard shrinks the visual viewport.
 * A plain `position: fixed` element doesn't know about that and can end up
 * drifting / getting covered. This tracks the live keyboard inset into a
 * CSS var (--vv-offset) that the .chat-window rule reads, so it stays
 * pinned just above the keyboard instead of moving around.
 */
function msStabilizeChatViewport(win){
  if(!win || !window.visualViewport) return;
  const vv = window.visualViewport;
  function reposition(){
    const offset = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
    win.style.setProperty('--vv-offset', offset + 'px');
  }
  vv.addEventListener('resize', reposition);
  vv.addEventListener('scroll', reposition);
  reposition();
}

function initChatbot(){
  const launcher = document.getElementById('chatLauncher');
  const win = document.getElementById('chatWindow');
  const closeBtn = document.getElementById('chatClose');
  const expandBtn = document.getElementById('chatExpand');
  const body = document.getElementById('chatBody');
  const input = document.getElementById('chatInput');
  const sendBtn = document.getElementById('chatSend');
  const micBtn = document.getElementById('chatMic');
  const ttsBtn = document.getElementById('chatTtsBtn');
  const suggestions = document.querySelectorAll('.chip');
  const headAvatar = document.getElementById('chatHeadAvatar');
  const statusEl = document.getElementById('chatStatus');

  if(!launcher || !win) return;

  const history = [];
  const tts = msWireTTS(ttsBtn);
  msWireMic(micBtn, input);
  msStabilizeChatViewport(win);

  msCheckAIHealth().then((mode)=> msSetStatusPill(statusEl, mode));
  document.addEventListener('ms-ai-status', (e)=> msSetStatusPill(statusEl, e.detail));

  function setTalking(state){
    if(headAvatar) headAvatar.classList.toggle('talking', state);
  }

  function openChat(){
    win.classList.add('open');
    launcher.setAttribute('aria-expanded','true');
  }
  function closeChat(){
    win.classList.remove('open');
    launcher.setAttribute('aria-expanded','false');
    tts.stop();
    setTalking(false);
  }

  launcher.addEventListener('click', ()=>{
    win.classList.contains('open') ? closeChat() : openChat();
  });
  closeBtn.addEventListener('click', closeChat);
  if(expandBtn){
    expandBtn.addEventListener('click', ()=> win.classList.toggle('maximized'));
  }

  async function respond(userText){
    msAppendMessage(body, 'user', userText);
    history.push({ role: 'user', text: userText });
    input.value = '';
    sendBtn.disabled = true;
    msShowTyping(body);

    const vitals = (typeof msGetLiveVitalsSnapshot === 'function') ? msGetLiveVitalsSnapshot() : null;
    const { reply, source } = await msGetAIReply(userText, history, vitals);

    msHideTyping(body);
    msAppendMessage(body, 'bot', reply, { error: source === 'error' });
    history.push({ role: 'bot', text: reply });
    const spoke = tts.speak(reply, { onStart: ()=>setTalking(true), onEnd: ()=>setTalking(false) });
    if(!spoke){
      setTalking(true);
      setTimeout(()=>setTalking(false), Math.min(reply.length * 18, 2600));
    }
    sendBtn.disabled = false;
    input.focus();
  }

  sendBtn.addEventListener('click', ()=>{
    const text = input.value.trim();
    if(!text) return;
    respond(text);
  });
  input.addEventListener('keydown', (e)=>{
    if(e.key === 'Enter'){
      e.preventDefault();
      const text = input.value.trim();
      if(text) respond(text);
    }
  });

  suggestions.forEach(chip=>{
    chip.addEventListener('click', ()=>{
      respond(chip.textContent.trim());
    });
  });
}

document.addEventListener('DOMContentLoaded', initChatbot);
