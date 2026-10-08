/* =============================================
   ESTANCIAS DEL BOSQUE ESTATES — Coming Soon
   Landing page scripts
   ============================================= */
(function () {
  'use strict';

  // --- NAV BACKGROUND ON SCROLL ---
  var nav = document.getElementById('nav');
  var onScroll = function () {
    if (!nav) return;
    nav.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // --- REVEAL ON SCROLL ---
  var items = document.querySelectorAll('.fade-up');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('visible'); });
  }

  // --- HERO: one house at a time (Flamboyán → Yagrumo → Ceiba) ---
  var stage = document.getElementById('heroStage');
  var heroNav = document.getElementById('heroNav');
  if (stage) {
    var slides = Array.prototype.slice.call(stage.querySelectorAll('.hero-slide'));
    var dots = heroNav ? Array.prototype.slice.call(heroNav.querySelectorAll('.hero-dot')) : [];
    var current = 0;
    var timer = null;
    var HOLD = 5200;
    var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var show = function (next) {
      current = (next + slides.length) % slides.length;
      slides.forEach(function (s, i) { s.classList.toggle('is-active', i === current); });
      dots.forEach(function (d, i) {
        d.classList.toggle('is-active', i === current);
        d.setAttribute('aria-selected', i === current ? 'true' : 'false');
      });
    };

    var start = function () {
      if (still || slides.length < 2) return;
      stop();
      timer = window.setInterval(function () { show(current + 1); }, HOLD);
    };
    var stop = function () {
      if (timer !== null) { window.clearInterval(timer); timer = null; }
    };

    // Clicking a name jumps to that house and restarts the clock, so the pick
    // isn't yanked away half a second later.
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () { show(i); start(); });
    });

    // Don't burn cycles (or data) rotating a hero nobody is looking at.
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stop(); else start();
    });

    start();
  }

  // --- VIDEOS: autoplay while on screen, pause off-screen (saves data on mobile) ---
  var videos = ['filmVideo', 'teaserVideo']
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);
  var play = function (v) {
    var p = v.play();
    if (p && p.catch) p.catch(function () { /* autoplay blocked — the poster stays up */ });
  };
  if ('IntersectionObserver' in window) {
    var videoIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) play(entry.target);
        else if (!entry.target.paused) entry.target.pause();
      });
    }, { threshold: 0.25 });
    videos.forEach(function (v) { videoIO.observe(v); });
  } else {
    videos.forEach(play);
  }

  // --- CONTACT FORM → Monday ("Citas Propiedades: Estancias del Bosque") ---
  // TODO (needs client credential): paste the Monday integration webhook URL here.
  // Monday → the board → Integrations → "When a webhook event occurs" / form-to-item
  // automation. Until this is set, submissions fall back to a pre-filled email.
  var MONDAY_ENDPOINT = '';
  var SALES_EMAIL = 'office@aarealtorpr.com';

  window.handleSubmit = async function (e) {
    e.preventDefault();

    var form  = e.target;
    var btn   = form.querySelector('[type="submit"]');
    var errEl = document.getElementById('formError');
    var orig  = btn.textContent;

    if (errEl) { errEl.style.display = 'none'; errEl.textContent = ''; }

    if (!form.checkValidity()) { form.reportValidity(); return; }

    var data = {
      board:     'Citas Propiedades: Estancias del Bosque',
      firstName: form.firstName.value.trim(),
      lastName:  form.lastName.value.trim(),
      email:     form.email.value.trim(),
      phone:     form.phone.value.trim(),
      model:     form.model.value,
      message:   form.message.value.trim(),
      source:    'estancias-landing-coming-soon',
      submittedAt: new Date().toISOString()
    };

    btn.textContent = 'Sending…';
    btn.disabled = true;

    // Fallback: capture the lead today via a pre-filled email to the sales office.
    if (!MONDAY_ENDPOINT) {
      var subject = encodeURIComponent(
        'Info — Estancias del Bosque Estates (' + (data.model || 'General') + ')'
      );
      var body = encodeURIComponent(
        'Nombre: ' + data.firstName + ' ' + data.lastName + '\n' +
        'Email: ' + data.email + '\n' +
        'Teléfono: ' + (data.phone || '—') + '\n' +
        'Modelo de interés: ' + (data.model || '—') + '\n\n' +
        'Mensaje:\n' + (data.message || '—') + '\n\n' +
        '— Enviado desde la landing "Coming Soon"'
      );
      window.location.href = 'mailto:' + SALES_EMAIL + '?subject=' + subject + '&body=' + body;
      btn.textContent = '✓ Opening your email…';
      setTimeout(function () { btn.textContent = orig; btn.disabled = false; }, 3000);
      return;
    }

    try {
      var res = await fetch(MONDAY_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      btn.textContent = '✓ Thank You — We\'ll Be In Touch';
      form.reset();
    } catch (err) {
      console.error('[contact] submission failed', err);
      if (errEl) {
        errEl.style.display = 'block';
        errEl.textContent = 'No pudimos enviar tu solicitud. Inténtalo de nuevo, escríbenos por WhatsApp o llámanos al (787) 860-1415.';
      }
      btn.textContent = orig;
      btn.disabled = false;
    }
  };
})();
