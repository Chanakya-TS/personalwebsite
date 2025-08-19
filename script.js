(function() {
  const html = document.documentElement;
  const navToggle = document.getElementById('nav-toggle');
  const navList = document.getElementById('nav-list');
  let tooltipEl;

  // Theme
  html.setAttribute('data-theme', 'dark');

  // Mobile nav
  navToggle?.addEventListener('click', () => {
    const isOpen = navList.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Smooth scroll for internal links and close mobile menu
  document.addEventListener('click', (e) => {
    const target = e.target;
    if (!(target instanceof Element)) return;
    if (target.tagName === 'A' && target.getAttribute('href')?.startsWith('#')) {
      const id = target.getAttribute('href');
      const section = id && document.querySelector(id);
      if (section) {
        e.preventDefault();
        const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        section.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
        navList?.classList.remove('open');
        navToggle?.setAttribute('aria-expanded', 'false');
      }
    }
  });

  // Footer year
  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  // Honors tooltips (fixed-position to avoid clipping)
  function ensureTooltip() {
    if (!tooltipEl) {
      tooltipEl = document.createElement('div');
      tooltipEl.id = 'tooltip';
      document.body.appendChild(tooltipEl);
    }
  }

  document.addEventListener('mouseover', (e) => {
    const target = e.target;
    if (!(target instanceof Element)) return;
    if (target.matches('.marquee__item[data-tip]')) {
      ensureTooltip();
      tooltipEl.textContent = target.getAttribute('data-tip') || '';
      const rect = target.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.bottom;
      tooltipEl.setAttribute('data-pos', 'below');
      tooltipEl.style.left = `${x}px`;
      tooltipEl.style.top = `${y}px`;
      tooltipEl.style.opacity = '1';
    }
  });

  document.addEventListener('mousemove', (e) => {
    if (!tooltipEl || tooltipEl.style.opacity !== '1') return;
    const active = document.querySelector('.marquee__item[data-tip]:hover');
    if (!active) return;
    const rect = active.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.bottom;
    tooltipEl.setAttribute('data-pos', 'below');
    tooltipEl.style.left = `${x}px`;
    tooltipEl.style.top = `${y}px`;
  });

  document.addEventListener('mouseout', (e) => {
    const target = e.target;
    if (!(target instanceof Element)) return;
    if (target.matches('.marquee__item[data-tip]')) {
      if (tooltipEl) tooltipEl.style.opacity = '0';
    }
  });
})();


