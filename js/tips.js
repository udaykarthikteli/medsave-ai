/* MedSave AI — rotating daily health tips */
const MS_TIPS = [
  "Wash your hands regularly with soap for at least 20 seconds.",
  "Stay hydrated — aim for 8 glasses of water a day.",
  "Eat a balanced diet rich in fruits, vegetables, and whole grains.",
  "Exercise regularly — even a 30-minute walk makes a difference.",
  "Get enough sleep — adults need 7 to 8 hours nightly.",
  "Wear a mask in crowded or high-risk indoor spaces when necessary.",
  "Keep your vaccinations up to date as recommended.",
  "Consult a healthcare professional if symptoms persist beyond a few days."
];

function initTips(){
  const el = document.getElementById('tipText');
  const dotsWrap = document.getElementById('tipDots');
  if(!el) return;

  MS_TIPS.forEach((_, i)=>{
    const d = document.createElement('span');
    if(i===0) d.className = 'active';
    dotsWrap.appendChild(d);
  });

  let idx = 0;
  function show(i){
    el.style.opacity = 0;
    setTimeout(()=>{
      el.textContent = MS_TIPS[i];
      el.style.opacity = 1;
      [...dotsWrap.children].forEach((d,j)=>d.classList.toggle('active', j===i));
    }, 250);
  }
  show(0);
  setInterval(()=>{
    idx = (idx+1) % MS_TIPS.length;
    show(idx);
  }, 4500);
}

document.addEventListener('DOMContentLoaded', initTips);
