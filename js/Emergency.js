/* ===================== Emergency Quick Access ===================== */
/* Self-contained: injects its own button + panel markup into the page,
   the same pattern background.js uses for the ambient scene. Drop
   <script src="js/emergency.js"></script> onto any page and it just works.

   If js/i18n.js is also loaded, this re-renders its text through msT()
   whenever the language changes (listens for 'ms:langchange'); otherwise
   it falls back to the English strings baked in below. */

const MS_EMERGENCY_NUMBERS = [
  { key:'sos_num_all',      fallback:'All-in-one Emergency', number:'112' },
  { key:'sos_num_ambulance',fallback:'Ambulance',             number:'108' },
  { key:'sos_num_police',   fallback:'Police',                number:'100' },
  { key:'sos_num_fire',     fallback:'Fire',                  number:'101' },
  { key:'sos_num_women',    fallback:'Women Helpline',        number:'1091' },
  { key:'sos_num_child',    fallback:'Child Helpline',        number:'1098' },
  { key:'sos_num_mental',   fallback:'Mental Health Helpline (KIRAN)', number:'18005990019', display:'1800-599-0019' },
];

const MS_FIRST_AID = [
  {
    key:'choking',
    title:{ key:'sos_fa_choking_title', fallback:'Choking' },
    steps:{ key:'sos_fa_choking_steps', fallback:[
      'Encourage them to keep coughing if they can.',
      "If they can't breathe, cough, or speak: give 5 firm back blows between the shoulder blades.",
      'If that doesn\u2019t clear it, give 5 abdominal thrusts (Heimlich maneuver).',
      'Call 108 if the object doesn\u2019t come out or they lose consciousness.'
    ]}
  },
  {
    key:'bleeding',
    title:{ key:'sos_fa_bleeding_title', fallback:'Severe Bleeding' },
    steps:{ key:'sos_fa_bleeding_steps', fallback:[
      'Apply firm, direct pressure on the wound with a clean cloth.',
      'Keep pressing without lifting the cloth to check.',
      'Raise the injured area above heart level if possible.',
      'Call 108 for anything more than a minor cut.'
    ]}
  },
  {
    key:'burns',
    title:{ key:'sos_fa_burns_title', fallback:'Burns' },
    steps:{ key:'sos_fa_burns_steps', fallback:[
      'Cool the burn under cool running water for at least 10 minutes.',
      'Do not apply ice, butter, or toothpaste.',
      'Cover loosely with a clean, non-fluffy cloth.',
      'Seek medical help for large, deep, or blistering burns.'
    ]}
  },
  {
    key:'fainting',
    title:{ key:'sos_fa_fainting_title', fallback:'Fainting' },
    steps:{ key:'sos_fa_fainting_steps', fallback:[
      'Lay the person flat and raise their legs slightly.',
      'Loosen tight clothing and make sure they have fresh air.',
      'Check that they\u2019re breathing normally.',
      'Call 108 if they don\u2019t wake within a minute, or fall and are hurt.'
    ]}
  },
  {
    key:'chestpain',
    title:{ key:'sos_fa_chest_title', fallback:'Chest Pain / Suspected Heart Attack' },
    steps:{ key:'sos_fa_chest_steps', fallback:[
      'Call 108 immediately — every minute matters.',
      'Help them sit or lie down in a comfortable, calm position.',
      'Loosen tight clothing around the neck and chest.',
      'Stay with them and keep them calm until help arrives.'
    ]}
  },
  {
    key:'snakebite',
    title:{ key:'sos_fa_snake_title', fallback:'Snake Bite' },
    steps:{ key:'sos_fa_snake_steps', fallback:[
      'Keep the person still and calm — movement spreads venom faster.',
      'Keep the bitten limb at or below heart level.',
      'Remove rings, watches, or anything tight near the bite.',
      'Do NOT cut the wound, suck out venom, or apply a tourniquet.',
      'Get to a hospital immediately and call 108 on the way.'
    ]}
  },
];

function msT2(key, fallback){
  // Small local helper so this file works standalone if i18n.js isn't present.
  if(typeof window.msT === 'function'){
    const v = window.msT(key);
    if(v !== undefined && v !== null && v !== key) return v;
  }
  return fallback;
}

function msBuildEmergencyUI(){
  if(document.querySelector('.sos-btn')) return; // already injected

  const btn = document.createElement('button');
  btn.className = 'sos-btn';
  btn.setAttribute('aria-label', 'Open emergency quick access');
  btn.innerHTML = `
    <span class="sos-pulse"></span>
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L4 6v6c0 5 3.4 8.6 8 10 4.6-1.4 8-5 8-10V6l-8-4z" stroke="white" stroke-width="1.8" stroke-linejoin="round"/>
      <path d="M12 8v5M12 16v.01" stroke="white" stroke-width="2" stroke-linecap="round"/>
    </svg>`;

  const overlay = document.createElement('div');
  overlay.className = 'sos-overlay';
  overlay.innerHTML = `
    <div class="sos-panel" role="dialog" aria-modal="true" aria-label="Emergency quick access">
      <div class="sos-head">
        <div class="sos-icon">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L4 6v6c0 5 3.4 8.6 8 10 4.6-1.4 8-5 8-10V6l-8-4z" stroke="white" stroke-width="1.8" stroke-linejoin="round"/>
          </svg>
        </div>
        <div>
          <h2 data-i18n="sos_title">Emergency Quick Access</h2>
          <p data-i18n="sos_subtitle">Fast numbers &amp; first aid, right when you need them</p>
        </div>
        <button class="sos-close" aria-label="Close">✕</button>
      </div>
      <div class="sos-body">
        <div class="sos-section-title" data-i18n="sos_call_now">Call now</div>
        <div class="sos-numbers" id="sosNumbers"></div>

        <div class="sos-section-title" data-i18n="sos_first_aid">Quick first aid</div>
        <div class="sos-firstaid" id="sosFirstAid"></div>

        <div class="sos-disclaimer" data-i18n="sos_disclaimer">
          This is general guidance only, not a substitute for professional medical care. In any emergency, call 108 (Ambulance) or 112 (National Emergency) immediately.
        </div>
      </div>
    </div>`;

  document.body.appendChild(btn);
  document.body.appendChild(overlay);

  function open(){ overlay.classList.add('open'); document.body.style.overflow = 'hidden'; }
  function close(){ overlay.classList.remove('open'); document.body.style.overflow = ''; }

  btn.addEventListener('click', open);
  overlay.addEventListener('click', (e)=>{ if(e.target === overlay) close(); });
  overlay.querySelector('.sos-close').addEventListener('click', close);
  document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape') close(); });

  renderEmergencyContent();
}

function renderEmergencyContent(){
  const numbersEl = document.getElementById('sosNumbers');
  const firstAidEl = document.getElementById('sosFirstAid');
  if(!numbersEl || !firstAidEl) return;

  numbersEl.innerHTML = MS_EMERGENCY_NUMBERS.map(n => `
    <a class="sos-number-card" href="tel:${n.number}">
      <div>
        <div class="num">${n.display || n.number}</div>
        <div class="label">${msT2(n.key, n.fallback)}</div>
      </div>
    </a>`).join('');

  firstAidEl.innerHTML = MS_FIRST_AID.map(item => {
    const title = msT2(item.title.key, item.title.fallback);
    const steps = msT2(item.steps.key, item.steps.fallback);
    const stepsHtml = (Array.isArray(steps) ? steps : item.steps.fallback)
      .map(s => `<li>${s}</li>`).join('');
    return `
      <div class="sos-fa-item" data-fa="${item.key}">
        <button class="sos-fa-toggle" type="button">
          <span>${title}</span><span class="chev">▾</span>
        </button>
        <div class="sos-fa-steps"><ol>${stepsHtml}</ol></div>
      </div>`;
  }).join('');

  firstAidEl.querySelectorAll('.sos-fa-item').forEach(item=>{
    item.querySelector('.sos-fa-toggle').addEventListener('click', ()=>{
      item.classList.toggle('open');
    });
  });

  // static-text i18n elements inside the panel (title/subtitle/section labels/disclaimer)
  document.querySelectorAll('.sos-overlay [data-i18n]').forEach(el=>{
    el.textContent = msT2(el.dataset.i18n, el.textContent);
  });
}

document.addEventListener('DOMContentLoaded', msBuildEmergencyUI);
document.addEventListener('ms:langchange', renderEmergencyContent);