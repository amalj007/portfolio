document.documentElement.classList.add('js');

const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('#site-nav');

function setMenuOpen(isOpen) {
  if (!navToggle || !siteNav) return;

  navToggle.setAttribute('aria-expanded', String(isOpen));
  navToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
  siteNav.classList.toggle('is-open', isOpen);
}

navToggle?.addEventListener('click', () => {
  const isOpen = navToggle.getAttribute('aria-expanded') !== 'true';
  setMenuOpen(isOpen);
});

siteNav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => setMenuOpen(false));
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && navToggle?.getAttribute('aria-expanded') === 'true') {
    setMenuOpen(false);
    navToggle.focus();
  }
});

document.addEventListener('click', (event) => {
  const isOpen = navToggle?.getAttribute('aria-expanded') === 'true';
  if (isOpen && !siteNav?.contains(event.target) && !navToggle?.contains(event.target)) {
    setMenuOpen(false);
  }
});

const revealItems = document.querySelectorAll('.reveal');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reduceMotion && 'IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14, rootMargin: '0px 0px -28px 0px' }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

const desktopViewport = window.matchMedia('(min-width: 821px)');
desktopViewport.addEventListener?.('change', (event) => {
  if (event.matches) setMenuOpen(false);
});

const depthViewport = window.matchMedia('(min-width: 821px) and (hover: hover) and (pointer: fine)');

if (!reduceMotion && depthViewport.matches) {
  function enableDepthTilt(element, maxTiltX, maxTiltY, parallax = false) {
    let frame = 0;
    let lastPointerEvent;

    element.addEventListener('pointermove', (event) => {
      if (event.pointerType === 'touch') return;
      lastPointerEvent = event;

      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const rect = element.getBoundingClientRect();
        const x = Math.max(0, Math.min(1, (lastPointerEvent.clientX - rect.left) / rect.width));
        const y = Math.max(0, Math.min(1, (lastPointerEvent.clientY - rect.top) / rect.height));
        const tiltX = (0.5 - y) * maxTiltX;
        const tiltY = (x - 0.5) * maxTiltY;

        element.style.setProperty('--pointer-light-x', (x * 100).toFixed(1) + '%');
        element.style.setProperty('--pointer-light-y', (y * 100).toFixed(1) + '%');
        element.style.setProperty('--card-tilt-x', tiltX.toFixed(2) + 'deg');
        element.style.setProperty('--card-tilt-y', tiltY.toFixed(2) + 'deg');

        if (parallax) {
          element.style.setProperty('--tilt-x', tiltX.toFixed(2) + 'deg');
          element.style.setProperty('--tilt-y', tiltY.toFixed(2) + 'deg');
          element.style.setProperty('--parallax-x', ((x - 0.5) * -14).toFixed(2) + 'px');
          element.style.setProperty('--parallax-y', ((y - 0.5) * -10).toFixed(2) + 'px');
        }

        element.classList.add('is-tilting');
      });
    }, { passive: true });

    element.addEventListener('pointerleave', () => {
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
      element.classList.remove('is-tilting');
      element.style.setProperty('--pointer-light-x', '50%');
      element.style.setProperty('--pointer-light-y', '50%');
      element.style.setProperty('--card-tilt-x', '0deg');
      element.style.setProperty('--card-tilt-y', '0deg');
      if (parallax) {
        element.style.setProperty('--tilt-x', '0deg');
        element.style.setProperty('--tilt-y', '0deg');
        element.style.setProperty('--parallax-x', '0px');
        element.style.setProperty('--parallax-y', '0px');
      }
    });
  }

  const heroVisual = document.querySelector('.hero-visual');
  if (heroVisual) {
    enableDepthTilt(heroVisual, 11, 15, true);

    let scrollFrame = 0;
    const updateScrollDepth = () => {
      const rect = heroVisual.getBoundingClientRect();
      const distance = (window.innerHeight * 0.52) - (rect.top + rect.height * 0.5);
      const offset = Math.max(-24, Math.min(24, distance * -0.035));
      heroVisual.style.setProperty('--scroll-depth-y', offset.toFixed(2) + 'px');
      scrollFrame = 0;
    };
    const requestScrollDepth = () => {
      if (!scrollFrame) scrollFrame = window.requestAnimationFrame(updateScrollDepth);
    };

    window.addEventListener('scroll', requestScrollDepth, { passive: true });
    window.addEventListener('resize', requestScrollDepth, { passive: true });
    requestScrollDepth();
  }
  document.querySelectorAll('.project-card').forEach((card) => enableDepthTilt(card, 7, 9));
}
