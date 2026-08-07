/* Take a Breather — three self-contained relaxation widgets.
   Enhanced with fullscreen modal view and improved bubble game. */

let msAudioCtx = null;
function msPlayPop(){
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
  }catch(e){ }
}

/* ----------------------------- Fullscreen Modal ----------------------------- */
function createGameModal(title, gameElement){
  const modal = document.createElement('div');
  modal.className = 'game-modal';
  modal.innerHTML = `
    <div class="game-modal-overlay"></div>
    <div class="game-modal-container">
      <div class="game-modal-header">
        <h2>${title}</h2>
        <button class="game-modal-close" aria-label="Close">&times;</button>
      </div>
      <div class="game-modal-content"></div>
    </div>
  `;
  
  const contentDiv = modal.querySelector('.game-modal-content');
  contentDiv.appendChild(gameElement);
  
  const closeBtn = modal.querySelector('.game-modal-close');
  const overlay = modal.querySelector('.game-modal-overlay');
  
  closeBtn.addEventListener('click', () => modal.remove());
  overlay.addEventListener('click', () => modal.remove());
  document.addEventListener('keydown', (e) => { if(e.key === 'Escape') modal.remove(); });
  
  document.body.appendChild(modal);
  document.body.style.overflow = 'hidden';
  
  const origRemove = modal.remove.bind(modal);
  modal.remove = function(){
    document.body.style.overflow = 'auto';
    origRemove();
  };
  
  return modal;
}

/* ----------------------------- 1. Bubble wrap (100+ bubbles) ----------------------------- */
function initBubbleWrap(){
  const grid = document.getElementById('bubbleGrid');
  const statEl = document.getElementById('bubbleStat');
  const resetBtn = document.getElementById('bubbleReset');
  if(!grid) return;

  const COUNT = 120;
  let popped = 0;

  function build(){
    grid.innerHTML = '';
    popped = 0;
    const totalColumns = Math.ceil(Math.sqrt(COUNT * 1.2));
    grid.style.gridTemplateColumns = `repeat(${totalColumns}, 1fr)`;
    
    for(let i=0;i<COUNT;i++){
      const b = document.createElement('div');
      b.className = 'bubble';
      b.innerHTML = '<div class="bubble-shine"></div>';
      
      // Random size variation for natural look
      const sizeVar = 0.85 + Math.random() * 0.3;
      b.style.transform = `scale(${sizeVar})`;
      
      b.addEventListener('click', function(e){
        e.preventDefault();
        if(b.classList.contains('popped')) return;
        b.classList.add('popped');
        popped++;
        
        // Particle burst effect
        createBubbleParticles(b);
        msPlayPop();
        updateStat();
      });
      
      grid.appendChild(b);
    }
    updateStat();
  }
  
  function updateStat(){
    const percent = Math.round((popped / COUNT) * 100);
    statEl.textContent = `${popped} / ${COUNT} popped (${percent}%)`;
  }
  
  resetBtn.addEventListener('click', build);
  build();
}

function createBubbleParticles(bubble){
  const rect = bubble.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  
  for(let i = 0; i < 8; i++){
    const p = document.createElement('div');
    p.className = 'bubble-particle';
    const angle = (Math.PI * 2 * i) / 8;
    const speed = 3 + Math.random() * 3;
    const vx = Math.cos(angle) * speed;
    const vy = Math.sin(angle) * speed;
    
    p.style.left = cx + 'px';
    p.style.top = cy + 'px';
    document.body.appendChild(p);
    
    let x = cx, y = cy;
    let life = 1;
    const startTime = Date.now();
    
    function animate(){
      life = 1 - (Date.now() - startTime) / 600;
      if(life <= 0){
        p.remove();
        return;
      }
      
      x += vx;
      y += vy;
      p.style.left = x + 'px';
      p.style.top = y + 'px';
      p.style.opacity = life;
      requestAnimationFrame(animate);
    }
    animate();
  }
}

/* ----------------------------- 2. Kinetic sand ----------------------------- */
function initSand(){
  const canvas = document.getElementById('sandCanvas');
  const hint = document.getElementById('sandHint');
  const resetBtn = document.getElementById('sandReset');
  if(!canvas) return;

  const LOW_W = 160, LOW_H = 120;
  const height = new Float32Array(LOW_W * LOW_H);

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

  const BASE = [196, 163, 112];
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
        let shade = 1 - (dx*LIGHT.x + dy*LIGHT.y) * 3.2;
        shade = Math.min(1.3, Math.max(0.55, shade));
        shade += height[idx] * 0.35;
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
    const r = 9;
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

/* ----------------------------- Game Launch Handlers ----------------------------- */
function setupGameLaunchers(){
  // Bubble game launcher
  const bubblePanel = document.querySelector('.game-panel:has(#bubbleGrid)');
  if(bubblePanel && bubblePanel.querySelector('.game-media')){
    bubblePanel.style.cursor = 'pointer';
    bubblePanel.addEventListener('click', (e) => {
      if(e.target.closest('button')) return;
      const container = document.createElement('div');
      container.className = 'fullscreen-bubble-container';
      container.innerHTML = `
        <div class="bubble-grid" id="bubbleGridFull"></div>
        <div class="bubble-stat" id="bubbleStatFull">0 / 120 popped</div>
        <button class="btn btn-ghost btn-sm bubble-reset" id="bubbleResetFull">Re-inflate</button>
      `;
      createGameModal('Bubble Pop — Focus Mode', container);
      initBubbleWrapFull();
    });
  }
  
  // Sand game launcher
  const sandPanel = document.querySelector('.game-panel.reverse');
  if(sandPanel && sandPanel.querySelector('.sand-media')){
    sandPanel.style.cursor = 'pointer';
    sandPanel.addEventListener('click', (e) => {
      if(e.target.closest('button')) return;
      const container = document.createElement('div');
      container.className = 'fullscreen-sand-container';
      container.innerHTML = `
        <canvas id="sandCanvasFull"></canvas>
        <div class="sand-hint" id="sandHintFull">Drag your finger or mouse through the sand</div>
        <button class="btn btn-ghost btn-sm sand-reset" id="sandResetFull">Smooth the sand</button>
      `;
      createGameModal('Kinetic Sand — Focus Mode', container);
      initSandFull();
    });
  }
  
  // Breathing game launcher
  const breathePanel = document.querySelector('.game-panel:has(#breatheOrb)');
  if(breathePanel && breathePanel.querySelector('.breathe-media')){
    breathePanel.style.cursor = 'pointer';
    breathePanel.addEventListener('click', (e) => {
      if(e.target.closest('button')) return;
      const container = document.createElement('div');
      container.className = 'fullscreen-breathe-container';
      container.innerHTML = `
        <div class="breathe-orb-wrap">
          <div class="breathe-ring"></div>
          <div class="breathe-orb rest" id="breatheOrbFull"></div>
        </div>
        <div class="breathe-label" id="breatheLabelFull">Press start when ready</div>
        <div class="breathe-count" id="breatheCountFull"></div>
        <button class="btn btn-primary btn-sm breathe-start" id="breatheToggleFull">Start breathing</button>
      `;
      createGameModal('Guided Breathing — Focus Mode', container);
      initBreathingFull();
    });
  }
}

function initBubbleWrapFull(){
  const grid = document.getElementById('bubbleGridFull');
  const statEl = document.getElementById('bubbleStatFull');
  const resetBtn = document.getElementById('bubbleResetFull');
  
  const COUNT = 120;
  let popped = 0;

  function build(){
    grid.innerHTML = '';
    popped = 0;
    const totalColumns = Math.ceil(Math.sqrt(COUNT * 1.2));
    grid.style.gridTemplateColumns = `repeat(${totalColumns}, 1fr)`;
    
    for(let i=0;i<COUNT;i++){
      const b = document.createElement('div');
      b.className = 'bubble';
      b.innerHTML = '<div class="bubble-shine"></div>';
      
      const sizeVar = 0.85 + Math.random() * 0.3;
      b.style.transform = `scale(${sizeVar})`;
      
      b.addEventListener('click', function(e){
        e.preventDefault();
        if(b.classList.contains('popped')) return;
        b.classList.add('popped');
        popped++;
        createBubbleParticles(b);
        msPlayPop();
        updateStat();
      });
      
      grid.appendChild(b);
    }
    updateStat();
  }
  
  function updateStat(){
    const percent = Math.round((popped / COUNT) * 100);
    statEl.textContent = `${popped} / ${COUNT} popped (${percent}%)`;
  }
  
  resetBtn.addEventListener('click', build);
  build();
}

function initSandFull(){
  const canvas = document.getElementById('sandCanvasFull');
  const hint = document.getElementById('sandHintFull');
  const resetBtn = document.getElementById('sandResetFull');

  const LOW_W = 240, LOW_H = 160;
  const height = new Float32Array(LOW_W * LOW_H);

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

  const BASE = [196, 163, 112];
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
        let shade = 1 - (dx*LIGHT.x + dy*LIGHT.y) * 3.2;
        shade = Math.min(1.3, Math.max(0.55, shade));
        shade += height[idx] * 0.35;
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
    const r = 15;
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

  resizeCanvas();
}

function initBreathingFull(){
  const orb = document.getElementById('breatheOrbFull');
  const label = document.getElementById('breatheLabelFull');
  const countEl = document.getElementById('breatheCountFull');
  const toggleBtn = document.getElementById('breatheToggleFull');

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
  setupGameLaunchers();
});