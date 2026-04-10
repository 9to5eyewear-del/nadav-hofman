'use strict';

// ── Animated background ───────────────────────────────────
(function () {
  const canvas = document.getElementById('bg-canvas');
  const ctx    = canvas.getContext('2d');

  const COLORS = [
    'rgba(14,159,142,ALPHA)',
    'rgba(10,120,108,ALPHA)',
    'rgba(6,80,72,ALPHA)',
    'rgba(20,200,170,ALPHA)',
  ];

  let orbs = [];
  let W, H;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function createOrb() {
    const r = Math.random() * 220 + 80;
    return {
      x:    Math.random() * W,
      y:    Math.random() * H,
      r,
      dx:   (Math.random() - 0.5) * 0.35,
      dy:   (Math.random() - 0.5) * 0.35,
      alpha: Math.random() * 0.13 + 0.04,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    };
  }

  function init() {
    resize();
    orbs = Array.from({ length: 9 }, createOrb);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Deep dark base
    ctx.fillStyle = '#0a1616';
    ctx.fillRect(0, 0, W, H);

    // Orbs
    orbs.forEach(o => {
      const grad = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r);
      const c = o.color.replace('ALPHA', o.alpha);
      const c0 = o.color.replace('ALPHA', 0);
      grad.addColorStop(0, c);
      grad.addColorStop(1, c0);
      ctx.beginPath();
      ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      // Move
      o.x += o.dx;
      o.y += o.dy;
      if (o.x < -o.r)  o.x = W + o.r;
      if (o.x > W + o.r) o.x = -o.r;
      if (o.y < -o.r)  o.y = H + o.r;
      if (o.y > H + o.r) o.y = -o.r;
    });

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  init();
  draw();
})();

// ── Modal helpers ─────────────────────────────────────────
function openModal(overlay) {
  overlay.hidden = false;
  overlay.classList.remove('is-closing');
  const first = overlay.querySelector('button, a[href]');
  if (first) first.focus();
  document.body.style.overflow = 'hidden';
}

function closeModal(overlay) {
  overlay.classList.add('is-closing');
  overlay.addEventListener('animationend', () => {
    overlay.hidden = true;
    overlay.classList.remove('is-closing');
  }, { once: true });
  document.body.style.overflow = '';
}

// ── CV modal ──────────────────────────────────────────────
const modalCv = document.getElementById('modal-cv');
document.getElementById('btn-cv').addEventListener('click', () => openModal(modalCv));
document.getElementById('close-cv').addEventListener('click', () => closeModal(modalCv));
modalCv.addEventListener('click', (e) => { if (e.target === modalCv) closeModal(modalCv); });

// ── Contact modal ─────────────────────────────────────────
const modalCon = document.getElementById('modal-contact');
document.getElementById('btn-contact').addEventListener('click', () => openModal(modalCon));
document.getElementById('close-contact').addEventListener('click', () => closeModal(modalCon));
modalCon.addEventListener('click', (e) => { if (e.target === modalCon) closeModal(modalCon); });

// ── CV Tab navigation ─────────────────────────────────────
const tabs   = document.querySelectorAll('.cv-tab');
const panels = document.querySelectorAll('.cv-panel');

tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.tab;

    // Update tab states
    tabs.forEach((t) => {
      t.classList.remove('is-active');
      t.setAttribute('aria-selected', 'false');
    });
    tab.classList.add('is-active');
    tab.setAttribute('aria-selected', 'true');

    // Update panel visibility
    panels.forEach((panel) => {
      const isTarget = panel.id === `cv-panel-${target}`;
      panel.classList.toggle('is-active', isTarget);
      panel.hidden = !isTarget;
    });

    // Scroll panel to top
    document.querySelector('.cv-panels').scrollTop = 0;
  });
});

// ── Keyboard: Escape ──────────────────────────────────────
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  if (!modalCv.hidden)  closeModal(modalCv);
  if (!modalCon.hidden) closeModal(modalCon);
});
