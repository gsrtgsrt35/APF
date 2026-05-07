/* ============================================================
   CAMPAÑA GMM – TU ESCUDO FINANCIERO
   Script principal: Scroll Reveal + Calculadora de Prima
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. SCROLL REVEAL ── */
  const reveals = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, i * 80);
      }
    });
  }, { threshold: 0.1 });

  reveals.forEach(el => revealObserver.observe(el));


  /* ── 2. CALCULADORA DE PRIMA GMM ── */

  /**
   * Multiplicadores por rango de edad del titular
   */
  const AGE_MULT = {
    young:  0.7,   // 18 – 35 años
    mid:    1.0,   // 36 – 50 años
    senior: 1.6    // 51 – 65 años
  };

  /**
   * Multiplicadores por número de asegurados
   * Clave: string del value del <select>
   */
  const PERSONS_MULT = {
    '1': 1.0,   // Solo el titular
    '2': 1.7,   // Titular + pareja
    '3': 2.4    // Familia con hijos
  };

  /**
   * Multiplicadores por suma asegurada elegida (en millones MXN)
   */
  const SUMA_MULT = {
    '5':    0.80,
    '10':   1.00,
    '20':   1.35,
    'ilim': 1.70
  };

  /** Prima base de referencia en MXN */
  const BASE_PRIMA = 18_000;

  /**
   * Calcula y actualiza la prima estimada en pantalla.
   * Se llama en cada cambio de cualquier <select> del formulario.
   */
  window.calcPrima = function () {
    const age     = document.getElementById('age').value;
    const persons = document.getElementById('persons').value;
    const suma    = document.getElementById('suma').value;

    const prima   = Math.round(
      (BASE_PRIMA * AGE_MULT[age] * PERSONS_MULT[persons] * SUMA_MULT[suma]) / 100
    ) * 100;

    const monthly = Math.round(prima / 12 / 100) * 100;

    document.getElementById('result-num').textContent =
      '$' + prima.toLocaleString('es-MX');

    document.getElementById('result-sub').textContent =
      `Equivale a $${monthly.toLocaleString('es-MX')}/mes · Deducible de impuestos`;
  };

  // Ejecutar al cargar para mostrar valor inicial
  calcPrima();


  /* ── 3. SMOOTH SCROLL para botones internos ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});
