/* MedSave AI — BMI, BMR, calorie & water calculator */
(function () {
  const $ = (id) => document.getElementById(id);

  function bmiCategory(bmi) {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 23)   return 'Healthy range';
    if (bmi < 25)   return 'Borderline — increased risk (Asian cut-off)';
    if (bmi < 30)   return 'Overweight';
    return 'Obese — please consider a check-up';
  }

  $('cGo').addEventListener('click', () => {
    const age  = +$('cAge').value;
    const h    = +$('cH').value;      // cm
    const w    = +$('cW').value;      // kg
    const act  = +$('cAct').value;    // activity multiplier
    const male = $('cSex').value === 'm';
    const out  = $('cOut');

    if (!(age > 0 && h >= 50 && w >= 10)) {
      out.hidden = false;
      out.innerHTML = '<div class="bmi-stat"><span>Please enter a valid age, height and weight.</span></div>';
      return;
    }

    const m   = h / 100;
    const bmi = w / (m * m);
    const lo  = 18.5 * m * m;
    const hi  = 24.9 * m * m;

    // Mifflin–St Jeor equation
    const bmr  = 10 * w + 6.25 * h - 5 * age + (male ? 5 : -161);
    const tdee = bmr * act;

    // ~35 ml per kg, plus 0.5 L if very active
    const water = w * 0.035 + (act >= 1.55 ? 0.5 : 0);

    const cards = [
      [bmi.toFixed(1),                              'BMI — ' + bmiCategory(bmi)],
      [lo.toFixed(0) + '–' + hi.toFixed(0) + ' kg', 'Weight range for BMI 18.5–24.9'],
      [Math.round(bmr) + ' kcal',                   'Resting energy (BMR)'],
      [Math.round(tdee) + ' kcal',                  'Daily maintenance estimate'],
      [water.toFixed(1) + ' L',                     'Suggested water per day']
    ];

    out.hidden = false;
    out.innerHTML = cards
      .map((c) => `<div class="bmi-stat"><b>${c[0]}</b><span>${c[1]}</span></div>`)
      .join('');

    // Position the marker on the vertical colour scale (scale spans BMI 15–35)
    const scale = $('cScale');
    scale.hidden = false;
    const pct = Math.min(100, Math.max(0, ((bmi - 15) / 20) * 100)); // 0 = bottom, 100 = top
    $('cMarker').style.top = (100 - pct) + '%';

    // Highlight the matching row and print the exact BMI into its label
    const cat = bmi < 18.5 ? 'under' : bmi < 25 ? 'healthy' : bmi < 30 ? 'over' : 'obese';
    document.querySelectorAll('.scale-row').forEach((row) => {
      const isActive = row.dataset.cat === cat;
      row.classList.toggle('active', isActive);
      const you = row.querySelector('.scale-you');
      if (you) you.remove();
      if (isActive) {
        const tag = document.createElement('span');
        tag.className = 'scale-you';
        tag.textContent = '👉 Your BMI: ' + bmi.toFixed(1);    
        row.querySelector('.scale-label').appendChild(tag);
      }
    });
  });
})();
