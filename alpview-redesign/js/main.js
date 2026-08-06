/* ALPVIEW — interactions (adapted from the Mellom interaction system) */

// Safe-area guide lines: adapt color to whichever section sits behind them
(() => {
  const lines = document.querySelectorAll('.safe-line');
  const sections = document.querySelectorAll('[data-line]');
  if (!lines.length || !sections.length) return;
  let ticking = false;
  const update = () => {
    ticking = false;
    const y = window.innerHeight * 0.5;
    let theme = 'dark';
    sections.forEach((sec) => {
      const r = sec.getBoundingClientRect();
      if (r.top <= y && r.bottom >= y) theme = sec.dataset.line;
    });
    lines.forEach((l) => { l.dataset.theme = theme; });
  };
  const onScroll = () => {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
})();

// Team carousel: drag to scroll, or use the prev/next buttons
(() => {
  const carousel = document.querySelector('.team-carousel');
  const track = document.getElementById('teamTrack');
  const prevBtn = document.getElementById('teamPrev');
  const nextBtn = document.getElementById('teamNext');
  if (!carousel || !track || !prevBtn || !nextBtn) return;

  let offset = 0;
  let dragging = false;
  let startX = 0;
  let startOffset = 0;

  const maxOffset = () => Math.max(0, track.scrollWidth - carousel.clientWidth);
  const clamp = (v) => Math.min(maxOffset(), Math.max(0, v));
  const apply = () => { track.style.transform = `translateX(${-offset}px)`; };
  const updateButtons = () => {
    const max = maxOffset();
    prevBtn.disabled = offset <= 0;
    nextBtn.disabled = offset >= max - 1;
  };
  const cardStep = () => {
    const card = track.querySelector('.team-card');
    if (!card) return 300;
    const style = getComputedStyle(track);
    return card.getBoundingClientRect().width + parseFloat(style.gap || '32');
  };

  prevBtn.addEventListener('click', () => {
    offset = clamp(offset - cardStep());
    apply(); updateButtons();
  });
  nextBtn.addEventListener('click', () => {
    offset = clamp(offset + cardStep());
    apply(); updateButtons();
  });

  track.addEventListener('pointerdown', (e) => {
    dragging = true;
    track.classList.add('grabbing');
    startX = e.clientX;
    startOffset = offset;
    track.setPointerCapture(e.pointerId);
  });
  track.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    offset = clamp(startOffset - (e.clientX - startX));
    apply(); updateButtons();
  });
  const endDrag = () => { dragging = false; track.classList.remove('grabbing'); };
  track.addEventListener('pointerup', endDrag);
  track.addEventListener('pointercancel', endDrag);
  track.addEventListener('pointerleave', endDrag);

  window.addEventListener('resize', () => { offset = clamp(offset); apply(); updateButtons(); });
  updateButtons();
})();

// Footer wordmark: scale font-size so "ALPVIEW" spans the full safe-area width
(() => {
  const el = document.getElementById('footerMega');
  const wrap = el && el.parentElement;
  if (!el || !wrap) return;
  const fit = () => {
    el.style.fontSize = '100px';
    const ratio = wrap.clientWidth / el.scrollWidth;
    el.style.fontSize = (100 * ratio) + 'px';
  };
  fit();
  window.addEventListener('resize', fit);
})();

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
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// Animated counters in the stats band
const animateCount = (el) => {
  const target = parseInt(el.dataset.count, 10);
  const duration = 1400;
  const start = performance.now();
  const tick = (now) => {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(target * eased).toLocaleString();
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateCount(e.target);
      statObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.stat-value').forEach(el => statObserver.observe(el));

// ---- Case panels: decimal count-up stats + entrance animation ----
(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const caseStatObserver = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      caseStatObserver.unobserve(en.target);
      const el = en.target;
      const target = parseFloat(el.dataset.target);
      const dec = parseInt(el.dataset.decimals || '0', 10);
      if (reducedMotion) { el.textContent = target.toFixed(dec); return; }
      const start = performance.now(), dur = 1200;
      const tick = (now) => {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = (target * eased).toFixed(dec);
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.case-stat-value').forEach(el => caseStatObserver.observe(el));

  const panels = document.querySelectorAll('.case-panel');
  const panelObserver = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.classList.add('visible');
        panelObserver.unobserve(en.target);
      }
    });
  }, { threshold: 0.35 });
  panels.forEach(p => panelObserver.observe(p));

  // Sticky deck: covered panels tuck behind the incoming one, each step smaller,
  // with their top edges peeking out above it.
  const stack = document.querySelector('.case-stack');
  const stackPanels = [...document.querySelectorAll('.case-stack .case-panel')];
  if (stackPanels.length) {
    const PEEK = 14;
    const docTopOf = (el) => {
      let y = 0, node = el;
      while (node) { y += node.offsetTop; node = node.offsetParent; }
      return y;
    };
    let metrics = [];
    const measure = () => {
      const stackTop = docTopOf(stack), stackH = stack.offsetHeight;
      metrics = stackPanels.map(p => ({
        docTop: docTopOf(p),
        height: p.offsetHeight,
        stickyTop: parseFloat(getComputedStyle(p).top) || 0,
        cbBottom: stackTop + stackH,
      }));
    };
    measure();
    window.addEventListener('resize', measure);
    window.addEventListener('load', measure);

    const cover = () => {
      const wide = window.innerWidth > 960;
      const n = stackPanels.length;
      const vh = window.innerHeight;
      const sy = window.scrollY;
      const naturals = metrics.map(m => {
        const flowTop = m.docTop - sy;
        const maxTop = (m.cbBottom - sy) - m.height;
        return Math.min(Math.max(flowTop, m.stickyTop), maxTop);
      });
      const arr = stackPanels.map((p, i) => {
        const stickyTop = metrics[i].stickyTop || vh * 0.14;
        return Math.max(0, Math.min(1, (vh - naturals[i]) / (vh - stickyTop)));
      });

      const pos = new Array(n);
      pos[n - 1] = naturals[n - 1];
      for (let i = n - 2; i >= 0; i--) {
        pos[i] = Math.min(naturals[i], pos[i + 1] - PEEK);
      }

      stackPanels.forEach((panel, i) => {
        if (!wide) {
          panel.style.transform = ''; panel.style.filter = '';
          panel.classList.remove('inert');
          return;
        }
        let depth = 0;
        for (let j = i + 1; j < n; j++) depth += arr[j];
        const lift = naturals[i] - pos[i];
        panel.style.transform = depth > 0.001
          ? `translateY(${(-lift).toFixed(1)}px) scale(${(1 - depth * 0.045).toFixed(4)})`
          : '';
        panel.style.filter = depth > 0.001
          ? `brightness(${Math.max(0.55, 1 - depth * 0.24).toFixed(3)})`
          : '';
        const settled = i === 0 || arr[i] >= 0.99;
        const covered = i < n - 1 && arr[i + 1] > 0.02;
        panel.classList.toggle('inert', !(settled && !covered));
      });
    };
    window.addEventListener('scroll', cover, { passive: true });
    window.addEventListener('resize', cover);
    cover();
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

// ---- Applied AI services card: randomize capability-mix segment widths on hover ----
(() => {
  const card = document.querySelector('.bento-6');
  if (!card) return;
  const segs = card.querySelectorAll('.attr-seg');
  if (!segs.length) return;
  const original = Array.from(segs).map(seg => seg.style.width);
  let timer = null;
  const shuffle = () => {
    const raw = Array.from(segs).map(() => 0.15 + Math.random());
    const total = raw.reduce((a, b) => a + b, 0);
    segs.forEach((seg, i) => { seg.style.width = (raw[i] / total * 100).toFixed(1) + '%'; });
  };
  card.addEventListener('mouseenter', () => {
    shuffle();
    timer = setInterval(shuffle, 900);
  });
  card.addEventListener('mouseleave', () => {
    clearInterval(timer);
    segs.forEach((seg, i) => { seg.style.width = original[i]; });
  });
})();
