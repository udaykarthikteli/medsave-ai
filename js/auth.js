/* MedSave AI — lightweight demo auth (front-end only, for project-demo purposes).
   Stores users in localStorage. Not a real backend — replace with your API for production. */

const MS_USERS_KEY = 'medsave_users';
const MS_SESSION_KEY = 'medsave_session';

function msGetUsers(){
  try{ return JSON.parse(localStorage.getItem(MS_USERS_KEY)) || []; }
  catch(e){ return []; }
}
function msSaveUsers(users){ localStorage.setItem(MS_USERS_KEY, JSON.stringify(users)); }
function msSetSession(email){ localStorage.setItem(MS_SESSION_KEY, email); }
function msValidEmail(v){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }

function initSignupForm(){
  const form = document.getElementById('signupForm');
  if(!form) return;
  const alertBox = document.getElementById('formAlert');

  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const name = document.getElementById('fullName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const pass = document.getElementById('signupPassword').value;
    const confirm = document.getElementById('confirmPassword').value;

    let ok = true;
    ok = validateField('fullName', name.length >= 2, 'Enter your full name') && ok;
    ok = validateField('signupEmail', msValidEmail(email), 'Enter a valid email address') && ok;
    ok = validateField('signupPassword', pass.length >= 6, 'Use at least 6 characters') && ok;
    ok = validateField('confirmPassword', confirm === pass && confirm.length>0, 'Passwords do not match') && ok;

    if(!ok){
      showAlert(alertBox, 'Please fix the highlighted fields.', false);
      return;
    }

    const users = msGetUsers();
    if(users.some(u=>u.email.toLowerCase() === email.toLowerCase())){
      validateField('signupEmail', false, 'An account with this email already exists');
      showAlert(alertBox, 'That email is already registered — try logging in instead.', false);
      return;
    }

    users.push({ name, email, pass });
    msSaveUsers(users);
    showAlert(alertBox, 'Account created! Redirecting to login…', true);
    form.querySelectorAll('button[type=submit]')[0].disabled = true;
    setTimeout(()=>{ window.location.href = 'login.html?created=1'; }, 1100);
  });
}

function initLoginForm(){
  const form = document.getElementById('loginForm');
  if(!form) return;
  const alertBox = document.getElementById('formAlert');

  const params = new URLSearchParams(window.location.search);
  if(params.get('created') === '1'){
    showAlert(alertBox, 'Account created successfully. Please log in.', true);
  }

  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const pass = document.getElementById('loginPassword').value;

    let ok = true;
    ok = validateField('loginEmail', msValidEmail(email), 'Enter a valid email address') && ok;
    ok = validateField('loginPassword', pass.length >= 6, 'Enter your password') && ok;
    if(!ok) return;

    const users = msGetUsers();
    const match = users.find(u=>u.email.toLowerCase() === email.toLowerCase() && u.pass === pass);

    if(!match){
      // demo-friendly fallback: allow instant access even without a prior signup
      showAlert(alertBox, 'Signing you in…', true);
      msSetSession(email);
      setTimeout(()=>{ window.location.href = 'dashboard.html'; }, 700);
      return;
    }

    showAlert(alertBox, `Welcome back, ${match.name.split(' ')[0]}! Redirecting…`, true);
    msSetSession(match.email);
    setTimeout(()=>{ window.location.href = 'dashboard.html'; }, 700);
  });
}

function validateField(id, isValid, message){
  const input = document.getElementById(id);
  const hint = document.getElementById(id+'Hint');
  if(!input) return true;
  input.style.borderColor = isValid ? 'rgba(76,138,82,.5)' : '#d97a3f';
  if(hint){
    hint.textContent = isValid ? '' : message;
    hint.className = 'hint ' + (isValid ? '' : 'error');
  }
  return isValid;
}

function showAlert(box, text, success){
  if(!box) return;
  box.textContent = text;
  box.className = 'form-alert show' + (success ? ' success' : '');
}

function togglePassword(inputId, btn){
  const input = document.getElementById(inputId);
  const isPwd = input.type === 'password';
  input.type = isPwd ? 'text' : 'password';
  btn.textContent = isPwd ? 'Hide' : 'Show';
}

document.addEventListener('DOMContentLoaded', ()=>{
  initSignupForm();
  initLoginForm();
});
