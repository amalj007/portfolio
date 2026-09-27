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
