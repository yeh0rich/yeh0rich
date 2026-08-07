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

// AI-enabled Operations card: typing effect cycling through document names
(() => {
  const el = document.getElementById('aiTyped');
  if (!el) return;
  const names = ['vendor_contract_q3.pdf', 'invoice_4471.pdf', 'candidate_profile_keller.pdf', 'purchase_order_8825.pdf'];
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return;
  let n = 0, i = names[0].length, deleting = false;
  const tick = () => {
    const word = names[n];
    el.textContent = word.slice(0, i);
    if (!deleting) {
      if (i < word.length) { i++; setTimeout(tick, 45); }
      else { deleting = true; setTimeout(tick, 1800); }
    } else {
      if (i > 0) { i--; setTimeout(tick, 30); }
      else { deleting = false; n = (n + 1) % names.length; setTimeout(tick, 150); }
    }
  };
  setTimeout(tick, 1800);
})();

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

// Contact form (demo handler — wire this up to a real backend/API before launch)
const form = document.getElementById('contactForm');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!form.reportValidity()) return;
  document.getElementById('formSuccess').hidden = false;
  form.querySelector('button[type="submit"]').disabled = true;
  form.reset();
});
