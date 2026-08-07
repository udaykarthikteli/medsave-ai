/* Take a Breather — three self-contained relaxation widgets.
   No backend calls, no data leaves the browser. Pure vanilla JS. */

let msAudioCtx = null;
function msPlayPop(){
  // Lazily create the AudioContext on first user gesture (autoplay policy).
  try{
    if(!msAudioCtx) msAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const ctx = msAudioCtx;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(620 + Math.random()*80, now);
    osc.frequency.exponentialRampToValueAtTime(90, now + 0.09);
    gain.gain.setValueAtTime(0.22, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.11);

    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.12);
  }catch(e){ /* audio not critical — fail silently */ }
}

/* ----------------------------- 1. Bubble wrap ----------------------------- */
function initBubbleWrap(){
  const grid = document.getElementById('bubbleGrid');
  const statEl = document.getElementById('bubbleStat');
  const resetBtn = document.getElementById('bubbleReset');
  if(!grid) return;

  const COUNT = 24;
  let popped = 0;

  function build(){
    grid.innerHTML = '';
    popped = 0;
    for(let i=0;i<COUNT;i++){
      const b = document.createElement('div');
      b.className = 'bubble';
      b.addEventListener('click', ()=>{
        if(b.classList.contains('popped')) return;
        b.classList.add('popped');
        popped++;
        msPlayPop();
        updateStat();
      });
      grid.appendChild(b);
    }
    updateStat();
  }
  function updateStat(){
    statEl.textContent = `${popped} / ${COUNT} popped`;
  }
  resetBtn.addEventListener('click', build);
  build();
}

/* ----------------------------- 2. Kinetic sand ----------------------------- */
function initSand(){
  const canvas = document.getElementById('sandCanvas');
  const hint = document.getElementById('sandHint');
  const resetBtn = document.getElementById('sandReset');
  if(!canvas) return;

  const LOW_W = 160, LOW_H = 120;
  const height = new Float32Array(LOW_W * LOW_H);

  // Precomputed static grain noise so the texture reads as sand, not plastic.
  const grain = new Float32Array(LOW_W * LOW_H);
  for(let i=0;i<grain.length;i++) grain[i] = (Math.random()-0.5) * 0.14;

  const off = document.createElement('canvas');
  off.width = LOW_W; off.height = LOW_H;
  const offCtx = off.getContext('2d');
  const img = offCtx.createImageData(LOW_W, LOW_H);

  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = true;

  function resizeCanvas(){
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width; canvas.height = rect.height;
    render();
  }

  const BASE = [196, 163, 112]; // warm sand tone, tuned to sit near the gold palette
  const LIGHT = { x: 0.5, y: 0.55, z: 0.67 };

  function render(){
    const data = img.data;
    for(let y=0;y<LOW_H;y++){
      for(let x=0;x<LOW_W;x++){
        const idx = y*LOW_W + x;
        const hL = height[idx - 1] ?? height[idx];
        const hR = height[idx + 1] ?? height[idx];
        const hU = height[idx - LOW_W] ?? height[idx];
        const hD = height[idx + LOW_W] ?? height[idx];
        const dx = (hR - hL);
        const dy = (hD - hU);
        // simple normal-based lighting: brighter on the rim facing the light, darker in the groove
        let shade = 1 - (dx*LIGHT.x + dy*LIGHT.y) * 3.2;
        shade = Math.min(1.3, Math.max(0.55, shade));
        shade += height[idx] * 0.35; // deeper spots read slightly darker overall
        shade += grain[idx];

        const p = idx*4;
        data[p]   = Math.min(255, Math.max(0, BASE[0]*shade));
        data[p+1] = Math.min(255, Math.max(0, BASE[1]*shade));
        data[p+2] = Math.min(255, Math.max(0, BASE[2]*shade));
        data[p+3] = 255;
      }
    }
    offCtx.putImageData(img, 0, 0);
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.drawImage(off, 0, 0, LOW_W, LOW_H, 0, 0, canvas.width, canvas.height);
  }

  function digAt(cx, cy){
    const r = 9; // radius in low-res grid units
    for(let y=-r; y<=r; y++){
      for(let x=-r; x<=r; x++){
        const gx = cx + x, gy = cy + y;
        if(gx < 0 || gy < 0 || gx >= LOW_W || gy >= LOW_H) continue;
        const dist = Math.sqrt(x*x + y*y);
        if(dist > r) continue;
        const idx = gy*LOW_W + gx;
        const falloff = 1 - dist/r;
        height[idx] = Math.max(-1, height[idx] - 0.9 * falloff * falloff);
      }
    }
  }

  function clientToGrid(clientX, clientY){
    const rect = canvas.getBoundingClientRect();
    const gx = Math.round((clientX - rect.left) / rect.width * LOW_W);
    const gy = Math.round((clientY - rect.top) / rect.height * LOW_H);
    return { gx, gy };
  }

  let drawing = false;
  let last = null;

  function pointerDown(e){
    drawing = true;
    if(hint) hint.style.opacity = '0';
    const p = pointFromEvent(e);
    last = clientToGrid(p.x, p.y);
    digAt(last.gx, last.gy);
    render();
  }
  function pointerMove(e){
    if(!drawing) return;
    const p = pointFromEvent(e);
    const cur = clientToGrid(p.x, p.y);
    // interpolate so fast strokes don't leave gaps
    if(last){
      const steps = Math.max(1, Math.round(Math.hypot(cur.gx-last.gx, cur.gy-last.gy)));
      for(let s=0;s<=steps;s++){
        const ix = Math.round(last.gx + (cur.gx-last.gx) * (s/steps));
        const iy = Math.round(last.gy + (cur.gy-last.gy) * (s/steps));
        digAt(ix, iy);
      }
    } else {
      digAt(cur.gx, cur.gy);
    }
    last = cur;
    render();
  }
  function pointerUp(){ drawing = false; last = null; }
  function pointFromEvent(e){
    if(e.touches && e.touches[0]) return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    return { x: e.clientX, y: e.clientY };
  }

  canvas.addEventListener('pointerdown', pointerDown);
  canvas.addEventListener('pointermove', pointerMove);
  window.addEventListener('pointerup', pointerUp);
  canvas.addEventListener('pointerleave', pointerUp);

  resetBtn.addEventListener('click', ()=>{
    height.fill(0);
    render();
    if(hint){ hint.style.opacity = '1'; }
  });

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();
}

/* ----------------------------- 3. Breathing guide ----------------------------- */
function initBreathing(){
  const orb = document.getElementById('breatheOrb');
  const label = document.getElementById('breatheLabel');
  const countEl = document.getElementById('breatheCount');
  const toggleBtn = document.getElementById('breatheToggle');
  if(!orb) return;

  // 4-4-6-2 pacing: a gentle box-breathing-style cycle, easy to sustain.
  const PHASES = [
    { name: 'inhale', label: 'Breathe in…', ms: 4000 },
    { name: 'hold',   label: 'Hold',        ms: 4000 },
    { name: 'exhale', label: 'Breathe out…',ms: 6000 },
    { name: 'rest',   label: 'Hold',        ms: 2000 },
  ];

  let running = false;
  let phaseIdx = 0;
  let cycles = 0;
  let timer = null;

  function setPhase(i){
    phaseIdx = i;
    const phase = PHASES[i];
    orb.className = 'breathe-orb ' + phase.name;
    label.textContent = phase.label;
    timer = setTimeout(()=>{
      const next = (i + 1) % PHASES.length;
      if(next === 0) { cycles++; countEl.textContent = `${cycles} full breath${cycles===1?'':'s'} completed`; }
      if(running) setPhase(next);
    }, phase.ms);
  }

  function start(){
    running = true;
    toggleBtn.textContent = 'Pause';
    setPhase(0);
  }
  function stop(){
    running = false;
    clearTimeout(timer);
    orb.className = 'breathe-orb rest';
    label.textContent = 'Paused — press start when ready';
    toggleBtn.textContent = 'Start breathing';
  }

  toggleBtn.addEventListener('click', ()=> running ? stop() : start());
  label.textContent = 'Press start when ready';
}

document.addEventListener('DOMContentLoaded', ()=>{
  initBubbleWrap();
  initSand();
  initBreathing();
});