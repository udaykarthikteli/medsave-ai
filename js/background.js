/* MedSave AI — ambient background: particles, floating icons, guardian scene */

function buildParticles(container, count = 22){
  for(let i=0;i<count;i++){
    const p = document.createElement('div');
    p.className = 'particle';
    const size = 4 + Math.random()*10;
    p.style.width = size+'px';
    p.style.height = size+'px';
    p.style.left = Math.random()*100+'%';
    p.style.top = Math.random()*100+'%';
    p.style.animationDuration = (6+Math.random()*8)+'s';
    p.style.animationDelay = (Math.random()*6)+'s';
    container.appendChild(p);
  }
}

function buildFloatingIcons(container, names){
  const spots = [
    {top:'12%', left:'8%'}, {top:'22%', left:'88%'}, {top:'68%', left:'6%'},
    {top:'78%', left:'90%'}, {top:'45%', left:'4%'}, {top:'8%', left:'50%'},
    {top:'88%', left:'46%'}, {top:'35%', left:'93%'}
  ];
  names.forEach((name, i)=>{
    const spot = spots[i % spots.length];
    const el = document.createElement('div');
    el.className = 'floating-icon';
    const size = 30 + Math.random()*22;
    el.style.width = size+'px';
    el.style.height = size+'px';
    el.style.top = spot.top;
    el.style.left = spot.left;
    el.style.animationDelay = (Math.random()*4)+'s';
    el.style.animationDuration = (7+Math.random()*5)+'s';
    el.innerHTML = msIcon(name);
    container.appendChild(el);
  });
}

/* Realistic virus render (electron-microscope style sphere with spike proteins),
   built in the site's existing gold/yellow palette so it drops in cleanly.
   `id` just needs to be unique per instance so each copy gets its own gradient defs. */
function buildVirusSVG(id){
  const spikeCount = 14 + Math.floor(Math.random()*4);
  let spikes = '';
  for(let i=0;i<spikeCount;i++){
    const angle = (i/spikeCount)*Math.PI*2 + (Math.random()*0.12);
    const x1 = 50 + Math.cos(angle)*26, y1 = 50 + Math.sin(angle)*26;
    const x2 = 50 + Math.cos(angle)*38, y2 = 50 + Math.sin(angle)*38;
    spikes += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="url(#spikeGrad${id})" stroke-width="3" stroke-linecap="round"/>
      <circle cx="${x2.toFixed(1)}" cy="${y2.toFixed(1)}" r="4.1" fill="url(#bulbGrad${id})"/>`;
  }
  return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="bodyGrad${id}" cx="35%" cy="32%" r="70%">
        <stop offset="0%" stop-color="#fff6cf"/>
        <stop offset="45%" stop-color="#f4d23a"/>
        <stop offset="100%" stop-color="#c9a227"/>
      </radialGradient>
      <linearGradient id="spikeGrad${id}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#e8c34a"/>
        <stop offset="100%" stop-color="#a6821a"/>
      </linearGradient>
      <radialGradient id="bulbGrad${id}" cx="35%" cy="30%" r="70%">
        <stop offset="0%" stop-color="#fff6cf"/>
        <stop offset="100%" stop-color="#c9a227"/>
      </radialGradient>
      <filter id="shadow${id}" x="-40%" y="-40%" width="180%" height="180%">
        <feDropShadow dx="0" dy="1.5" stdDeviation="1.6" flood-color="#a6821a" flood-opacity="0.45"/>
      </filter>
    </defs>
    <g filter="url(#shadow${id})">
      ${spikes}
      <circle cx="50" cy="50" r="27" fill="url(#bodyGrad${id})"/>
      <circle cx="41" cy="40" r="4" fill="#fffbe6" opacity="0.55"/>
      <circle cx="61" cy="47" r="2.6" fill="#8a6a12" opacity="0.35"/>
      <circle cx="46" cy="59" r="3.2" fill="#8a6a12" opacity="0.3"/>
      <circle cx="58" cy="61" r="2.2" fill="#8a6a12" opacity="0.3"/>
    </g>
  </svg>`;
}

/* Guardian scene: small AI bots patrol and clear floating "germ" characters with a healing beam.
   Purely decorative, gentle and non-violent — germs fade into sparkles, then quietly respawn elsewhere. */
function buildGuardianScene(container, {germCount = 7, botCount = 2} = {}){
  const germs = [];
  for(let i=0;i<germCount;i++){
    const g = document.createElement('div');
    g.className = 'germ';
    const size = 30 + Math.random()*22;
    g.style.width = size+'px'; g.style.height = size+'px';
    g.style.left = (5+Math.random()*88)+'%';
    g.style.top = (14+Math.random()*72)+'%';
    g.style.animationDuration = (12+Math.random()*10)+'s';
    g.style.animationDelay = (Math.random()*4)+'s';
    g.innerHTML = buildVirusSVG('germ'+i);
    container.appendChild(g);
    germs.push(g);
  }

  for(let b=0;b<botCount;b++){
    const bot = document.createElement('div');
    bot.className = 'bot';
    bot.style.left = (10+Math.random()*30)+'%';
    bot.style.top = (20+Math.random()*40)+'%';
    bot.style.animationDuration = (18+Math.random()*10)+'s';
    bot.style.animationDelay = (Math.random()*4)+'s';
    bot.innerHTML = msIcon('bot2') + '<div class="beam"></div>';
    container.appendChild(bot);
  }

  // periodically "clear" a random germ with a soft beam pulse, then respawn it
  function cycle(){
    if(!germs.length) return;
    const bots = container.querySelectorAll('.bot');
    const target = germs[Math.floor(Math.random()*germs.length)];
    const bot = bots[Math.floor(Math.random()*bots.length)];
    if(bot){ bot.classList.add('firing'); setTimeout(()=>bot.classList.remove('firing'), 550); }
    target.classList.add('zapped');
    setTimeout(()=>{
      target.classList.remove('zapped');
      target.style.left = (5+Math.random()*88)+'%';
      target.style.top = (14+Math.random()*72)+'%';
    }, 750);
  }
  setInterval(cycle, 3200);
}

document.addEventListener('DOMContentLoaded', ()=>{
  const bgCanvas = document.querySelector('.bg-canvas');
  if(bgCanvas){
    buildParticles(bgCanvas, 24);
    const iconSet = bgCanvas.dataset.icons ? bgCanvas.dataset.icons.split(',') : ['stethoscope','heart','shield','dna','cross','pill'];
    buildFloatingIcons(bgCanvas, iconSet);
  }
  const guardianEl = document.querySelector('.guardian-scene');
  if(guardianEl){
    buildGuardianScene(guardianEl, {germCount:7, botCount:2});
  }
});