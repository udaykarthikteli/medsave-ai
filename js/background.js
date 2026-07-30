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
    g.innerHTML = msIcon(Math.random()>0.5 ? 'germ1':'germ2');
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
