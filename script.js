'use strict';

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
