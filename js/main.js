// =============================================
// EL BOSQUE — Main JavaScript
// =============================================

// --- PRELOADER ---
(function () {
  const preloader = document.getElementById('preloader');
  const bar       = document.getElementById('preloaderBar');
  if (!preloader) return;

  // Start fill animation
  requestAnimationFrame(() => {
    if (bar) bar.style.width = '100%';
  });

  // Hide after content loads (min 2.2s for brand moment)
  const hide = () => {
    setTimeout(() => {
      preloader.classList.add('hidden');
      document.body.style.overflow = '';
    }, 2200);
  };

  document.body.style.overflow = 'hidden';

  if (document.readyState === 'complete') {
    hide();
  } else {
    window.addEventListener('load', hide);
    // Fallback — never block user more than 4s
    setTimeout(() => preloader.classList.add('hidden'), 4000);
  }
})();

document.addEventListener('DOMContentLoaded', () => {

  // --- NAVBAR scroll behavior ---
  const nav = document.getElementById('nav');
  const onScroll = () => {
    nav?.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // --- VIDEO HERO — fallback to slides if video can't play ---
  const heroVideo  = document.getElementById('heroVideo');
  const heroSlides = document.getElementById('heroSlides');
  if (heroVideo) {
    heroVideo.addEventListener('error', () => {
      heroVideo.classList.add('hidden');
    });
    const playPromise = heroVideo.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        heroVideo.classList.add('hidden');
      });
    }
  }

  // --- HERO CAROUSEL with counter ---
  const slides          = document.querySelectorAll('.hero-slide');
  const dots            = document.querySelectorAll('.hero-dot');
  const counterCurrent  = document.getElementById('heroCounterCurrent');
  const counterProgress = document.getElementById('heroProgress');
  const TOTAL           = slides.length;
  let current  = 0;
  let autoplay;

  function pad(n) { return String(n).padStart(2, '0'); }

  function updateCounter(idx) {
    if (counterCurrent) counterCurrent.textContent = pad(idx + 1);
    if (counterProgress) counterProgress.style.width = ((idx + 1) / TOTAL * 100) + '%';
  }

  function goToSlide(index) {
    slides[current].classList.remove('active');
    dots[current]?.classList.remove('active');
    current = (index + TOTAL) % TOTAL;
    slides[current].classList.add('active');
    dots[current]?.classList.add('active');
    updateCounter(current);
  }

  function startAutoplay() {
    clearInterval(autoplay);
    autoplay = setInterval(() => goToSlide(current + 1), 5500);
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      clearInterval(autoplay);
      goToSlide(parseInt(dot.dataset.slide));
      startAutoplay();
    });
  });

  if (TOTAL > 0) {
    updateCounter(0);
    startAutoplay();
  }

  // --- HERO PARALLAX on scroll ---
  const heroParallaxImgs = document.querySelectorAll('.hero-slide img');
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y < window.innerHeight) {
      heroParallaxImgs.forEach(img => {
        img.style.transform = `scale(1) translateY(${y * 0.25}px)`;
      });
    }
  }, { passive: true });

  // --- SCROLL REVEAL (fade-up) ---
  const fadeEls = document.querySelectorAll('.fade-up');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  fadeEls.forEach(el => revealObserver.observe(el));

  // --- LIGHTBOX ---
  window.openLightbox = (src) => {
    const lb  = document.getElementById('lightbox');
    const img = document.getElementById('lightbox-img');
    if (!lb || !img) return;
    img.src = src;
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  window.closeLightbox = () => {
    const lb = document.getElementById('lightbox');
    if (!lb) return;
    lb.classList.remove('open');
    document.body.style.overflow = '';
  };

  document.getElementById('lightbox')?.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) window.closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') window.closeLightbox();
  });

  // --- FORM SUBMIT ---
  window.handleSubmit = (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('[type="submit"]');
    const orig = btn.textContent;
    btn.textContent = 'Sending…';
    setTimeout(() => {
      btn.textContent = '✓ Thank You — We\'ll Be In Touch';
      btn.style.background = '#1A1A1A';
      btn.disabled = true;
    }, 800);
  };

  // --- MOBILE HAMBURGER ---
  const hamburger  = document.getElementById('navHamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu?.classList.toggle('open');
    document.body.style.overflow = mobileMenu?.classList.contains('open') ? 'hidden' : '';
  });

  window.closeMobile = () => {
    hamburger?.classList.remove('open');
    mobileMenu?.classList.remove('open');
    document.body.style.overflow = '';
  };

  // Close mobile menu on resize to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) window.closeMobile();
  });

  // --- SMOOTH ANCHOR SCROLL ---
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // --- VIDEO TOUR PLAY BUTTON ---
  window.playTourVideo = () => {
    const video = document.getElementById('tourVideo');
    const btn   = document.getElementById('videoPlayBtn');
    if (!video || !btn) return;
    btn.style.display = 'none';
    video.controls = true;
    video.play();
  };

  // --- CURSOR DOT (desktop only) ---
  if (window.innerWidth > 1024) {
    const cursor = document.createElement('div');
    cursor.className = 'cursor-dot';
    document.body.appendChild(cursor);

    let mx = 0, my = 0, cx = 0, cy = 0;

    window.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; }, { passive: true });

    (function animateCursor() {
      cx += (mx - cx) * 0.12;
      cy += (my - cy) * 0.12;
      cursor.style.transform = `translate(${cx}px, ${cy}px)`;
      requestAnimationFrame(animateCursor);
    })();

    document.querySelectorAll('a, button, .gallery-item, .model-card').forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('large'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('large'));
    });
  }

});
