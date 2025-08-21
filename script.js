(function() {
  const html = document.documentElement;
  const navToggle = document.getElementById('nav-toggle');
  const navList = document.getElementById('nav-list');
  let tooltipEl;

  // Theme
  html.setAttribute('data-theme', 'dark');

  // Enhanced mobile navigation
  navToggle?.addEventListener('click', () => {
    const isOpen = navList.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
    
    // Move nav-list to body to escape stacking context issues
    if (isOpen) {
      document.body.appendChild(navList);
      document.body.style.overflow = 'hidden';
    } else {
      // Move it back to its original parent
      document.querySelector('.nav').appendChild(navList);
      document.body.style.overflow = '';
    }
  });

  // Close mobile menu when clicking outside or on close button
  document.addEventListener('click', (e) => {
    if (navList?.classList.contains('open')) {
      // Check if clicking on close button (the ::before pseudo-element)
      const rect = navList.getBoundingClientRect();
      const closeButtonArea = {
        top: rect.top + 20,
        right: rect.right - 20,
        bottom: rect.top + 60,
        left: rect.right - 60
      };
      
      const isClickingCloseButton = e.clientX >= closeButtonArea.left && 
                                   e.clientX <= closeButtonArea.right &&
                                   e.clientY >= closeButtonArea.top && 
                                   e.clientY <= closeButtonArea.bottom;
      
      if (isClickingCloseButton || 
          (!navList.contains(e.target) && !navToggle?.contains(e.target))) {
        navList.classList.remove('open');
        navToggle?.setAttribute('aria-expanded', 'false');
        document.querySelector('.nav').appendChild(navList);
        document.body.style.overflow = '';
      }
    }
  });

  // Close mobile menu on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navList?.classList.contains('open')) {
      navList.classList.remove('open');
      navToggle?.setAttribute('aria-expanded', 'false');
      document.querySelector('.nav').appendChild(navList);
      document.body.style.overflow = '';
    }
  });

  // Close mobile menu on window resize (if screen becomes larger)
  let previousWidth = window.innerWidth;
  window.addEventListener('resize', () => {
    const currentWidth = window.innerWidth;
    if (currentWidth > 760 && previousWidth <= 760 && navList?.classList.contains('open')) {
      navList.classList.remove('open');
      navToggle?.setAttribute('aria-expanded', 'false');
      document.querySelector('.nav').appendChild(navList);
      document.body.style.overflow = '';
    }
    previousWidth = currentWidth;
  });

  // Handle navigation links - close mobile menu and smooth scroll
  document.addEventListener('click', (e) => {
    const target = e.target;
    if (!(target instanceof Element)) return;
    
    // Check if it's an anchor link
    if (target.tagName === 'A' && target.getAttribute('href')?.startsWith('#')) {
      const href = target.getAttribute('href');
      console.log('Clicked anchor link:', href); // Debug log
      
      // Close mobile menu if open (regardless of where the link was clicked)
      const isMenuOpen = navList?.classList.contains('open');
      if (isMenuOpen) {
        e.preventDefault(); // Only prevent default if menu is open
        console.log('Closing mobile menu'); // Debug log
        navList.classList.remove('open');
        navToggle?.setAttribute('aria-expanded', 'false');
        document.querySelector('.nav')?.appendChild(navList);
        document.body.style.overflow = '';
        
        // After closing menu, trigger the link click again
        setTimeout(() => {
          console.log('Re-clicking link after menu closed'); // Debug log
          target.click();
        }, 200);
      } else {
        // Menu is not open, let browser handle the scroll naturally
        console.log('Menu not open, allowing natural scroll'); // Debug log
        // Don't prevent default - let browser handle it
      }
    }
  });

  // Footer year
  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  // Enhanced Honors tooltips with mobile support
  function ensureTooltip() {
    if (!tooltipEl) {
      tooltipEl = document.createElement('div');
      tooltipEl.id = 'tooltip';
      document.body.appendChild(tooltipEl);
    }
  }

  // Touch and mouse support for tooltips
  function showTooltip(target) {
    if (!target.matches('.marquee__item[data-tip]')) return;
    
    ensureTooltip();
    tooltipEl.textContent = target.getAttribute('data-tip') || '';
    const rect = target.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.bottom;
    
    // Adjust position for mobile
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      tooltipEl.style.left = '50%';
      tooltipEl.style.top = `${y + 10}px`;
      tooltipEl.style.transform = 'translateX(-50%)';
    } else {
      tooltipEl.setAttribute('data-pos', 'below');
      tooltipEl.style.left = `${x}px`;
      tooltipEl.style.top = `${y}px`;
      tooltipEl.style.transform = '';
    }
    
    tooltipEl.style.opacity = '1';
  }

  function hideTooltip() {
    if (tooltipEl) tooltipEl.style.opacity = '0';
  }

  // Mouse events
  document.addEventListener('mouseover', (e) => {
    showTooltip(e.target);
  });

  document.addEventListener('mousemove', (e) => {
    if (!tooltipEl || tooltipEl.style.opacity !== '1') return;
    const active = document.querySelector('.marquee__item[data-tip]:hover');
    if (!active) return;
    
    const rect = active.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.bottom;
    
    const isMobile = window.innerWidth <= 768;
    if (!isMobile) {
      tooltipEl.setAttribute('data-pos', 'below');
      tooltipEl.style.left = `${x}px`;
      tooltipEl.style.top = `${y}px`;
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.matches('.marquee__item[data-tip]')) {
      hideTooltip();
    }
  });

  // Touch events for mobile
  let touchTimeout;
  document.addEventListener('touchstart', (e) => {
    const target = e.target;
    if (!target.matches('.marquee__item[data-tip]')) return;
    
    // Clear any existing timeout
    clearTimeout(touchTimeout);
    
    // Show tooltip after a short delay
    touchTimeout = setTimeout(() => {
      showTooltip(target);
    }, 500);
  });

  document.addEventListener('touchend', () => {
    clearTimeout(touchTimeout);
    // Hide tooltip after a delay on touch end
    setTimeout(hideTooltip, 2000);
  });

  // Hide tooltip on scroll
  document.addEventListener('scroll', () => {
    hideTooltip();
  });

  // Add loading state for better mobile experience
  document.addEventListener('DOMContentLoaded', () => {
    // Add a small delay to ensure smooth loading on mobile
    setTimeout(() => {
      document.body.classList.add('loaded');
    }, 100);
  });

  // Improve touch targets for mobile
  function improveTouchTargets() {
    const touchTargets = document.querySelectorAll('.btn, .social-link, .nav-list a');
    touchTargets.forEach(target => {
      const rect = target.getBoundingClientRect();
      if (rect.width < 44 || rect.height < 44) {
        target.style.minHeight = '44px';
        target.style.minWidth = '44px';
        target.style.display = 'flex';
        target.style.alignItems = 'center';
        target.style.justifyContent = 'center';
      }
    });
  }

  // Call on load and resize
  improveTouchTargets();
  window.addEventListener('resize', improveTouchTargets);
})();


