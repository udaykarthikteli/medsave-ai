/* ==========================================================================
   MedSave AI — Live Reading page
   Physical-AI device bridge: real Web Bluetooth GATT connections to
   standard heart-rate / blood-pressure monitors, plus a microphone-based
   digital stethoscope input (works with electronic/USB stethoscopes that
   register as an audio input device, or a laptop mic held near the chest).

   Everything here talks to *real* browser hardware APIs — nothing here is
   simulated or randomly generated. Values only appear once real hardware
   reports them.
   ========================================================================== */

const MS_VITALS = {
  heartRateBLE: null,       // bpm, from a Bluetooth Heart Rate Service device
  bpSystolic: null,         // mmHg, from a Bluetooth Blood Pressure Service device
  bpDiastolic: null,        // mmHg
  bpPulse: null,            // bpm, reported alongside a BP reading
  stethoscopeBpm: null,     // experimental acoustic estimate from the mic
};

/* Exposed for chatbot.js so the AI chat can reference live numbers. */
function msGetLiveVitalsSnapshot(){
  const snap = {};
  if(MS_VITALS.heartRateBLE != null) snap['Heart rate (Bluetooth monitor)'] = `${MS_VITALS.heartRateBLE} bpm`;
  if(MS_VITALS.bpSystolic != null && MS_VITALS.bpDiastolic != null){
    snap['Blood pressure (Bluetooth monitor)'] = `${Math.round(MS_VITALS.bpSystolic)}/${Math.round(MS_VITALS.bpDiastolic)} mmHg`;
  }
  if(MS_VITALS.bpPulse != null) snap['Pulse (from BP cuff)'] = `${Math.round(MS_VITALS.bpPulse)} bpm`;
  if(MS_VITALS.stethoscopeBpm != null) snap['Acoustic pulse estimate (mic stethoscope, experimental)'] = `${MS_VITALS.stethoscopeBpm} bpm`;
  return snap;
}

function msRefreshVitalsBar(){
  const bar = document.getElementById('vitalsContextBar');
  if(!bar) return;
  const snap = msGetLiveVitalsSnapshot();
  const keys = Object.keys(snap);
  if(!keys.length){
    bar.innerHTML = `<span class="vc-empty">No live readings yet — connect a device below, and I'll factor it into the chat.</span>`;
    return;
  }
  bar.innerHTML = keys.map(k => `<span class="vc-chip">${msIcon('activity')} ${k}: ${snap[k]}</span>`).join('');
}

/* --------------------------------------------------------------------------
   IEEE-11073 16-bit SFLOAT decoder (used by the Bluetooth Blood Pressure
   Service, per the Bluetooth SIG GATT specification).
   -------------------------------------------------------------------------- */
function msParseSFloat(raw){
  let mantissa = raw & 0x0FFF;
  let exponent = raw >> 12;
  if(exponent >= 0x8) exponent -= 0x10;
  if(mantissa >= 0x800) mantissa -= 0x1000;
  return mantissa * Math.pow(10, exponent);
}

/* ==========================================================================
   Bluetooth — Heart Rate Service (0x180D)
   ========================================================================== */
function initHeartRateBLE(){
  const btn = document.getElementById('hrConnectBtn');
  const pill = document.getElementById('hrStatusPill');
  const pillLabel = pill ? pill.querySelector('.lbl') : null;
  const valEl = document.getElementById('hrValue');
  if(!btn) return;

  if(!navigator.bluetooth){
    pill.classList.add('warn');
    pillLabel.textContent = 'Web Bluetooth not supported in this browser';
    btn.disabled = true;
    btn.textContent = 'Unavailable';
    return;
  }

  let device = null;

  function onHRData(event){
    const value = event.target.value;
    const flags = value.getUint8(0);
    const is16bit = flags & 0x1;
    const bpm = is16bit ? value.getUint16(1, true) : value.getUint8(1);
    MS_VITALS.heartRateBLE = bpm;
    if(valEl) valEl.textContent = bpm;
    msRefreshVitalsBar();
  }

  function setConnected(name){
    pill.classList.add('connected');
    pill.classList.remove('warn');
    pillLabel.textContent = `Connected · ${name || 'Heart rate monitor'}`;
    btn.textContent = 'Disconnect';
  }
  function setDisconnected(){
    pill.classList.remove('connected');
    pillLabel.textContent = 'Not connected';
    btn.textContent = 'Connect Device';
    if(valEl) valEl.textContent = '--';
    MS_VITALS.heartRateBLE = null;
    msRefreshVitalsBar();
  }

  btn.addEventListener('click', async () => {
    if(device && device.gatt.connected){
      device.gatt.disconnect();
      return;
    }
    try{
      btn.disabled = true;
      pillLabel.textContent = 'Requesting device…';
      device = await navigator.bluetooth.requestDevice({
        filters: [{ services: ['heart_rate'] }],
        optionalServices: ['battery_service']
      });
      device.addEventListener('gattserverdisconnected', setDisconnected);

      pillLabel.textContent = 'Connecting…';
      const server = await device.gatt.connect();
      const service = await server.getPrimaryService('heart_rate');
      const characteristic = await service.getCharacteristic('heart_rate_measurement');
      await characteristic.startNotifications();
      characteristic.addEventListener('characteristicvaluechanged', onHRData);

      setConnected(device.name);
    } catch(err){
      console.error(err);
      pillLabel.textContent = err.name === 'NotFoundError' ? 'No device selected' : 'Connection failed — try again';
    } finally {
      btn.disabled = false;
    }
  });
}

/* ==========================================================================
   Bluetooth — Blood Pressure Service (0x1810)
   ========================================================================== */
function initBloodPressureBLE(){
  const btn = document.getElementById('bpConnectBtn');
  const pill = document.getElementById('bpStatusPill');
  const pillLabel = pill ? pill.querySelector('.lbl') : null;
  const sysEl = document.getElementById('bpSystolic');
  const diaEl = document.getElementById('bpDiastolic');
  const pulseEl = document.getElementById('bpPulseVal');
  if(!btn) return;

  if(!navigator.bluetooth){
    pill.classList.add('warn');
    pillLabel.textContent = 'Web Bluetooth not supported in this browser';
    btn.disabled = true;
    btn.textContent = 'Unavailable';
    return;
  }

  let device = null;

  function onBPData(event){
    const value = event.target.value;
    const flags = value.getUint8(0);
    const kPa = flags & 0x1;
    let offset = 1;

    const systolicRaw = value.getUint16(offset, true); offset += 2;
    const diastolicRaw = value.getUint16(offset, true); offset += 2;
    offset += 2; // mean arterial pressure — not displayed

    let systolic = msParseSFloat(systolicRaw);
    let diastolic = msParseSFloat(diastolicRaw);
    if(kPa){ systolic *= 7.50062; diastolic *= 7.50062; } // kPa -> mmHg

    const timeStampPresent = flags & 0x2;
    if(timeStampPresent) offset += 7;

    let pulse = null;
    const pulsePresent = flags & 0x4;
    if(pulsePresent){
      pulse = msParseSFloat(value.getUint16(offset, true));
      offset += 2;
    }

    MS_VITALS.bpSystolic = systolic;
    MS_VITALS.bpDiastolic = diastolic;
    MS_VITALS.bpPulse = pulse;

    if(sysEl) sysEl.textContent = Math.round(systolic);
    if(diaEl) diaEl.textContent = Math.round(diastolic);
    if(pulseEl) pulseEl.textContent = pulse != null ? Math.round(pulse) : '--';
    msRefreshVitalsBar();
  }

  function setConnected(name){
    pill.classList.add('connected');
    pill.classList.remove('warn');
    pillLabel.textContent = `Connected · ${name || 'Blood pressure monitor'}`;
    btn.textContent = 'Disconnect';
  }
  function setDisconnected(){
    pill.classList.remove('connected');
    pillLabel.textContent = 'Not connected';
    btn.textContent = 'Connect Device';
    if(sysEl) sysEl.textContent = '--';
    if(diaEl) diaEl.textContent = '--';
    if(pulseEl) pulseEl.textContent = '--';
    MS_VITALS.bpSystolic = null;
    MS_VITALS.bpDiastolic = null;
    MS_VITALS.bpPulse = null;
    msRefreshVitalsBar();
  }

  btn.addEventListener('click', async () => {
    if(device && device.gatt.connected){
      device.gatt.disconnect();
      return;
    }
    try{
      btn.disabled = true;
      pillLabel.textContent = 'Requesting device…';
      device = await navigator.bluetooth.requestDevice({
        filters: [{ services: ['blood_pressure'] }],
        optionalServices: ['battery_service']
      });
      device.addEventListener('gattserverdisconnected', setDisconnected);

      pillLabel.textContent = 'Connecting…';
      const server = await device.gatt.connect();
      const service = await server.getPrimaryService('blood_pressure');
      const characteristic = await service.getCharacteristic('blood_pressure_measurement');
      await characteristic.startNotifications();
      characteristic.addEventListener('characteristicvaluechanged', onBPData);

      setConnected(device.name);
    } catch(err){
      console.error(err);
      pillLabel.textContent = err.name === 'NotFoundError' ? 'No device selected' : 'Connection failed — try again';
    } finally {
      btn.disabled = false;
    }
  });
}

/* ==========================================================================
   Digital Stethoscope — microphone / line-in based audio capture
   Works with any electronic stethoscope or USB/3.5mm audio-in device the
   OS exposes as a microphone, or a laptop mic held to the chest.
   ========================================================================== */
function initStethoscope(){
  const startBtn = document.getElementById('stethStartBtn');
  const deviceSelect = document.getElementById('stethDeviceSelect');
  const pill = document.getElementById('stethStatusPill');
  const pillLabel = pill ? pill.querySelector('.lbl') : null;
  const bpmEl = document.getElementById('stethBpm');
  const canvas = document.getElementById('stethCanvas');
  if(!startBtn || !canvas) return;

  if(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia){
    pill.classList.add('warn');
    pillLabel.textContent = 'Microphone access not supported in this browser';
    startBtn.disabled = true;
    return;
  }

  const ctx2d = canvas.getContext('2d');
  let audioCtx, analyser, source, filter, stream, rafId;
  let listening = false;
  let peakTimes = [];

  async function populateDevices(){
    try{
      // Labels only populate after permission is granted at least once.
      const devices = await navigator.mediaDevices.enumerateDevices();
      const mics = devices.filter(d => d.kind === 'audioinput');
      deviceSelect.innerHTML = mics.length
        ? mics.map(d => `<option value="${d.deviceId}">${d.label || 'Microphone / audio-in device'}</option>`).join('')
        : `<option value="">Default microphone</option>`;
    } catch(e){
      deviceSelect.innerHTML = `<option value="">Default microphone</option>`;
    }
  }
  populateDevices();
  navigator.mediaDevices.addEventListener?.('devicechange', populateDevices);

  function resizeCanvas(){
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * devicePixelRatio;
    canvas.height = rect.height * devicePixelRatio;
  }

  function draw(){
    rafId = requestAnimationFrame(draw);
    const bufferLength = analyser.fftSize;
    const data = new Uint8Array(bufferLength);
    analyser.getByteTimeDomainData(data);

    ctx2d.clearRect(0, 0, canvas.width, canvas.height);
    ctx2d.lineWidth = 2 * devicePixelRatio;
    ctx2d.strokeStyle = '#c9a227';
    ctx2d.beginPath();
    const slice = canvas.width / bufferLength;
    let x = 0;
    for(let i = 0; i < bufferLength; i++){
      const v = data[i] / 128.0;
      const y = (v * canvas.height) / 2;
      i === 0 ? ctx2d.moveTo(x, y) : ctx2d.lineTo(x, y);
      x += slice;
    }
    ctx2d.stroke();

    // ---- simple envelope / peak detection for an experimental BPM estimate ----
    let sumSquares = 0;
    for(let i = 0; i < bufferLength; i++){
      const norm = (data[i] - 128) / 128;
      sumSquares += norm * norm;
    }
    const rms = Math.sqrt(sumSquares / bufferLength);
    const now = performance.now();

    if(rms > 0.12){
      const last = peakTimes[peakTimes.length - 1];
      if(!last || now - last > 300){ // refractory period ~300ms (caps at 200bpm)
        peakTimes.push(now);
      }
    }
    peakTimes = peakTimes.filter(t => now - t <= 8000); // rolling 8s window

    if(peakTimes.length >= 3){
      const spanSeconds = (peakTimes[peakTimes.length - 1] - peakTimes[0]) / 1000;
      const bpm = spanSeconds > 0 ? Math.round(((peakTimes.length - 1) / spanSeconds) * 60) : null;
      if(bpm && bpm > 30 && bpm < 220){
        MS_VITALS.stethoscopeBpm = bpm;
        if(bpmEl) bpmEl.textContent = bpm;
        msRefreshVitalsBar();
      }
    }
  }

  async function start(){
    try{
      startBtn.disabled = true;
      pillLabel.textContent = 'Requesting microphone access…';
      const constraints = {
        audio: {
          deviceId: deviceSelect.value ? { exact: deviceSelect.value } : undefined,
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false
        }
      };
      stream = await navigator.mediaDevices.getUserMedia(constraints);
      await populateDevices();

      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      source = audioCtx.createMediaStreamSource(stream);
      filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 150; // isolate low-frequency thumps

      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 1024;
      analyser.smoothingTimeConstant = 0.6;

      source.connect(filter);
      filter.connect(analyser);

      resizeCanvas();
      peakTimes = [];
      listening = true;
      draw();

      pill.classList.add('connected');
      pill.classList.remove('warn');
      pillLabel.textContent = 'Listening…';
      startBtn.textContent = 'Stop Listening';
    } catch(err){
      console.error(err);
      pill.classList.add('warn');
      pillLabel.textContent = err.name === 'NotAllowedError' ? 'Microphone permission denied' : 'Could not access microphone';
    } finally {
      startBtn.disabled = false;
    }
  }

  function stop(){
    listening = false;
    if(rafId) cancelAnimationFrame(rafId);
    if(stream) stream.getTracks().forEach(t => t.stop());
    if(audioCtx) audioCtx.close();
    ctx2d.clearRect(0, 0, canvas.width, canvas.height);
    pill.classList.remove('connected');
    pillLabel.textContent = 'Not listening';
    startBtn.textContent = 'Start Listening';
    if(bpmEl) bpmEl.textContent = '--';
    MS_VITALS.stethoscopeBpm = null;
    msRefreshVitalsBar();
  }

  startBtn.addEventListener('click', () => listening ? stop() : start());
  window.addEventListener('resize', () => { if(listening) resizeCanvas(); });
}

/* ==========================================================================
   Embedded "Live Awareness Chat" panel (reuses helpers from chatbot.js)
   ========================================================================== */
function initLiveChat(){
  const body = document.getElementById('liveChatBody');
  const input = document.getElementById('liveChatInput');
  const sendBtn = document.getElementById('liveChatSend');
  const statusEl = document.getElementById('liveChatStatus');
  const micBtn = document.getElementById('liveChatMic');
  const ttsBtn = document.getElementById('liveChatTtsBtn');
  const headAvatar = document.getElementById('liveChatAvatar');
  if(!body || !input || !sendBtn) return;

  const history = [];
  const tts = msWireTTS(ttsBtn);
  msWireMic(micBtn, input);

  msCheckAIHealth().then((mode)=> msSetStatusPill(statusEl, mode));
  document.addEventListener('ms-ai-status', (e)=> msSetStatusPill(statusEl, e.detail));

  function setTalking(state){
    if(headAvatar) headAvatar.classList.toggle('talking', state);
  }

  msAppendMessage(body, 'bot', "Hi! Connect a device below and ask me things like **\"what does my heart rate mean?\"** — I'll factor in your live reading. I'm for general awareness only, not a diagnosis.");

  async function respond(userText){
    msAppendMessage(body, 'user', userText);
    history.push({ role: 'user', text: userText });
    input.value = '';
    sendBtn.disabled = true;
    msShowTyping(body);

    const vitals = msGetLiveVitalsSnapshot();
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

  sendBtn.addEventListener('click', () => {
    const text = input.value.trim();
    if(text) respond(text);
  });
  input.addEventListener('keydown', (e) => {
    if(e.key === 'Enter'){
      e.preventDefault();
      const text = input.value.trim();
      if(text) respond(text);
    }
  });
  document.querySelectorAll('.live-chip').forEach(chip => {
    chip.addEventListener('click', () => respond(chip.textContent.trim()));
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initHeartRateBLE();
  initBloodPressureBLE();
  initStethoscope();
  initLiveChat();
  msRefreshVitalsBar();
});
