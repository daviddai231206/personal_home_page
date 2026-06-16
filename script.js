/**
 * Progressive Enhancement Script
 * All content remains visible without JS.
 * With JS: scroll animations, smooth nav, mobile toggle.
 */

(() => {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Signal JS is active — CSS uses this to set initial hidden states
  document.documentElement.classList.add('js-enabled');

  // ─── Scroll Progress Indicator ─────────────────────────────────────────────
  const createScrollProgress = () => {
    const bar = document.createElement('div');
    bar.className = 'scroll-progress';
    bar.setAttribute('aria-hidden', 'true');
    Object.assign(bar.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      height: '3px',
      width: '0%',
      background: 'var(--accent-primary, #64b5f6)',
      zIndex: '9999',
      transition: 'width 0.1s linear',
      pointerEvents: 'none'
    });
    document.body.prepend(bar);

    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.width = `${progress}%`;
    };

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  };

  // ─── Scroll Animations (IntersectionObserver) ──────────────────────────────
  const initScrollAnimations = () => {
    const animatedElements = document.querySelectorAll('[data-animate]');
    if (!animatedElements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const el = entry.target;
          el.classList.add('visible');

          // Stagger children for a cascading reveal
          const children = el.querySelectorAll('.skill-category, .timeline-item, .project-card, .education-item, .contact-item');
          children.forEach((child, i) => {
            child.style.transitionDelay = `${i * 100}ms`;
            child.classList.add('visible');
          });

          observer.unobserve(el);
        });
      },
      { threshold: 0.15 }
    );

    animatedElements.forEach((el) => observer.observe(el));
  };

  // ─── Smooth Scroll Navigation ─────────────────────────────────────────────
  const initSmoothNav = () => {
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    const sections = document.querySelectorAll('main section[id]');

    // Smooth scroll on click
    navLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        const target = document.querySelector(targetId);
        if (!target) return;

        e.preventDefault();
        target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      });
    });

    // Active link highlighting via IntersectionObserver
    const activateLink = (id) => {
      navLinks.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    };

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            activateLink(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -60% 0px' }
    );

    sections.forEach((section) => sectionObserver.observe(section));
  };

  // ─── Skill Bar Animation ───────────────────────────────────────────────────
  const initSkillBars = () => {
    const skillBars = document.querySelectorAll('.skill-bar-fill');
    if (!skillBars.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const fills = entry.target.querySelectorAll('.skill-bar-fill');
          fills.forEach((fill) => {
            const level = fill.getAttribute('data-level');
            if (level) fill.style.width = `${level}%`;
          });

          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.15 }
    );

    const skillsSection = document.querySelector('#skills');
    if (skillsSection) observer.observe(skillsSection);
  };

  // ─── Mobile Nav Toggle ─────────────────────────────────────────────────────
  const initMobileNav = () => {
    const toggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('nav');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close menu on link click
    const navLinks = nav.querySelectorAll('.nav-links a');
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        nav.classList.remove('nav-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  };

  // ─── Initialize ────────────────────────────────────────────────────────────
  initMobileNav();
  initSmoothNav();
  createScrollProgress();

  if (!prefersReducedMotion) {
    initScrollAnimations();
    initSkillBars();
  }
})();
