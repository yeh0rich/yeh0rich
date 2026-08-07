/* ALPVIEW — interactions */

// Header hover bar (header stays at the top of the page, not sticky)
const header = document.getElementById('siteHeader');
header.addEventListener('mouseenter', () => header.classList.add('bar-active'));
header.addEventListener('mouseleave', () => header.classList.remove('bar-active'));

// Side quick-nav tab: only show once the header scrolls out of view
const sideTab = document.getElementById('sideTab');
if (sideTab) {
  const headerObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => sideTab.classList.toggle('visible', !e.isIntersecting));
  });
  headerObserver.observe(header);
}

// Mobile menu
const burger = document.getElementById('navBurger');
const mobileMenu = document.getElementById('mobileMenu');
burger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
mobileMenu.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => mobileMenu.classList.remove('open'))
);

// Scroll reveal
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// Workforce Systems card: swap the KPI chip through a few metrics
(() => {
  const el = document.getElementById('kpiChip');
  if (!el) return;
  const metrics = ['↑ 18% fill rate', '32 active placements', '4.8★ candidate NPS', '-22% time-to-hire'];
  let i = 0;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return;
  setInterval(() => {
    el.classList.add('swap');
    setTimeout(() => {
      i = (i + 1) % metrics.length;
      el.textContent = metrics[i];
      el.classList.remove('swap');
    }, 200);
  }, 2800);
})();

// Hero dashboard: count up the capacity metric, tooltip on chart hover
(() => {
  const value = document.getElementById('dashValue');
  if (!value) return;
  const target = parseInt(value.dataset.target, 10);
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) { value.textContent = target; } else {
    const start = performance.now(), duration = 1200;
    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      value.textContent = Math.round(eased * target);
      if (p < 1) requestAnimationFrame(tick);
    };
    setTimeout(() => requestAnimationFrame(tick), 500);
  }

  const svg = document.getElementById('dashChart');
  const cursor = document.getElementById('chartCursor');
  const tip = document.getElementById('chartTip');
  if (svg && cursor && tip) {
    const quarters = ['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6'];
    svg.addEventListener('pointermove', (e) => {
      const r = svg.getBoundingClientRect();
      const fx = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
      const x = fx * 320;
      cursor.setAttribute('x1', x); cursor.setAttribute('x2', x);
      cursor.setAttribute('visibility', 'visible');
      const q = quarters[Math.min(quarters.length - 1, Math.floor(fx * quarters.length))];
      const projects = Math.round(9 + fx * 9);
      tip.textContent = `${q} · ${projects} active projects`;
      tip.hidden = false;
      tip.style.left = (fx * r.width) + 'px';
      tip.style.top = (92 - fx * 70) / 110 * r.height + 'px';
    });
    svg.addEventListener('pointerleave', () => {
      cursor.setAttribute('visibility', 'hidden');
      tip.hidden = true;
    });
  }
})();

// Contact form (demo handler — wire this up to a real backend/API before launch)
const form = document.getElementById('contactForm');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!form.reportValidity()) return;
  document.getElementById('formSuccess').hidden = false;
  form.querySelector('button[type="submit"]').disabled = true;
  form.reset();
});
