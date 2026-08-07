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

// Contact form (demo handler — wire this up to a real backend/API before launch)
const form = document.getElementById('contactForm');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!form.reportValidity()) return;
  document.getElementById('formSuccess').hidden = false;
  form.querySelector('button[type="submit"]').disabled = true;
  form.reset();
});
