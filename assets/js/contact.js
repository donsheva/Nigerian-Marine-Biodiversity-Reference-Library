// ─── CONTACT & NEWSLETTER ──────────────────────────────────────────────────

function submitContact(e) {
  e.preventDefault();
  const name  = document.getElementById('cf-name').value;
  const inst  = document.getElementById('cf-institution').value;
  const email = document.getElementById('cf-email').value;
  const type  = document.getElementById('cf-type').value;
  const msg   = document.getElementById('cf-message').value;
  const subject = encodeURIComponent('Research Enquiry — NMBL: ' + (type || 'General'));
  const body    = encodeURIComponent(
    'Dear Adelodun Odedere,\n\n' + msg +
    '\n\n---\nFrom: ' + name + '\nInstitution: ' + inst + '\nEmail: ' + email +
    '\nEnquiry type: ' + (type || 'General') +
    '\n\nSent via nmbl.envirobiotics.org contact form'
  );
  // Open mailto — replace with your actual email below
  window.location.href = 'mailto:odedereao@niomr.gov.ng?subject=' + subject + '&body=' + body;
  document.getElementById('form-success').style.display = 'block';
}

function nmblSubscribe() {
  const emailEl = document.getElementById('footer-email');
  const msg     = document.getElementById('footer-sub-msg');
  const email   = emailEl.value.trim();
  if (!email || !email.includes('@')) {
    emailEl.style.borderColor = 'rgba(220,53,53,0.7)';
    return;
  }
  emailEl.style.borderColor = '';
  window.location.href = 'mailto:ade@envirobiotics.org?subject=NMBL%20Newsletter%20Subscription&body=Please%20add%20me%20to%20the%20NMBL%20newsletter%3A%20' + encodeURIComponent(email);
  if (msg) msg.style.display = 'block';
  emailEl.value = '';
}

function bindBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;
  window.addEventListener('scroll', function(){
    if (window.scrollY > 400) {
      btn.style.display = 'flex';
      btn.style.opacity = '1';
    } else {
      btn.style.opacity = '0';
      setTimeout(function(){ if(window.scrollY<=400) btn.style.display='none'; }, 200);
    }
  }, {passive:true});
}
