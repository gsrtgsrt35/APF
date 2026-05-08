/* ============================================
   CAMPAÑA SEGURO DE AUTO — PROTEGE TU PATRIMONIO
   main.js
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. NAV SCROLL EFFECT ── */
  const nav = document.querySelector('nav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });

  /* ── 2. SCROLL-TRIGGERED CARD ANIMATIONS ── */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay * 100);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.scenario-card').forEach((card, i) => {
    card.dataset.delay = i;
    observer.observe(card);
  });

  /* ── 3. ANIMATED COUNTERS ── */
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounters();
        counterObserver.disconnect();
      }
    });
  }, { threshold: 0.5 });

  const statsBar = document.querySelector('.stats-bar');
  if (statsBar) counterObserver.observe(statsBar);

  function animateCounters() {
    document.querySelectorAll('[data-target]').forEach(el => {
      const target = parseFloat(el.dataset.target);
      const prefix = el.dataset.prefix || '';
      const suffix = el.dataset.suffix || '';
      const isDecimal = el.dataset.decimal === 'true';
      const duration = 1800;
      const start = performance.now();

      function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = eased * target;
        el.textContent = prefix + (isDecimal
          ? current.toFixed(1)
          : Math.floor(current).toLocaleString()) + suffix;
        if (progress < 1) requestAnimationFrame(update);
        else el.textContent = prefix + (isDecimal ? target.toFixed(1) : target.toLocaleString()) + suffix;
      }
      requestAnimationFrame(update);
    });
  }

  /* ── 4. MODAL COTIZADOR ── */
  const modalOverlay = document.getElementById('modalOverlay');
  const modalCloseBtn = document.getElementById('modalClose');
  const cotizarBtns = document.querySelectorAll('.open-modal');

  cotizarBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      modalOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  modalOverlay?.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  /* ── 5. FORM SUBMIT ── */
  const form = document.getElementById('cotizarForm');
  const toast = document.getElementById('toast');

  form?.addEventListener('submit', (e) => {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const auto = document.getElementById('auto').value;

    if (!nombre || !telefono || !auto) {
      showToast('⚠ Por favor completa todos los campos.', '#c0392b');
      return;
    }

    // Simulate submission
    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = 'Enviando...';
    btn.disabled = true;

    setTimeout(() => {
      closeModal();
      form.reset();
      btn.textContent = 'Quiero mi cotización →';
      btn.disabled = false;
      showToast('✓ ¡Listo! Un asesor te contactará en menos de 2 horas.', '#5cb85c');
    }, 1500);
  });

  function showToast(message, color = '#5cb85c') {
    if (!toast) return;
    toast.textContent = message;
    toast.style.background = color;
    toast.style.color = color === '#5cb85c' ? '#0a0a0f' : '#f5f0e8';
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 4500);
  }

  /* ── 6. PHONE INPUT FORMATTER ── */
  const telefonoInput = document.getElementById('telefono');
  telefonoInput?.addEventListener('input', (e) => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 10);
    if (val.length > 6) {
      val = val.slice(0,2) + ' ' + val.slice(2,6) + ' ' + val.slice(6);
    } else if (val.length > 2) {
      val = val.slice(0,2) + ' ' + val.slice(2);
    }
    e.target.value = val;
  });

  /* ── 7. URGENCY STRIP TIMER ── */
  const timerEl = document.getElementById('urgencyTimer');
  if (timerEl) {
    let seconds = 23 * 60 + 47; // ~24 min countdown
    setInterval(() => {
      seconds = Math.max(0, seconds - 1);
      const m = String(Math.floor(seconds / 60)).padStart(2, '0');
      const s = String(seconds % 60).padStart(2, '0');
      timerEl.textContent = `${m}:${s}`;
    }, 1000);
  }

  /* ── 8. SMOOTH SCROLL FOR ANCHOR LINKS ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ── 9. PARALLAX SUBTLE EFFECT on HERO ── */
  const heroLeft = document.querySelector('.hero-left');
  window.addEventListener('scroll', () => {
    if (window.scrollY < window.innerHeight) {
      const offset = window.scrollY * 0.18;
      if (heroLeft) heroLeft.style.transform = `translateY(${offset}px)`;
    }
  });

});
