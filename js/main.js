/* ============================================================================
   MYERS CLARK CHARTERED ACCOUNTANTS — DEMO WEBSITE
   main.js — Taste-skill compliant: MOTION_INTENSITY 6
   Animations: CSS transitions + IntersectionObserver scroll reveals
   Hardware-accelerated: transform + opacity only
   ============================================================================ */

(function () {
  'use strict';

  /* ── Scroll Reveal ─────────────────────────────────────────────────────────
     IntersectionObserver triggers .visible class on .reveal elements.
     CSS handles the actual animation (opacity + translateY).
     NEVER animate top/left/width/height — transform only.
  ──────────────────────────────────────────────────────────────────────────── */
  function initScrollReveal() {
    var revealEls = document.querySelectorAll('.reveal');
    if (!revealEls.length) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ── Nav Scroll State ──────────────────────────────────────────────────────
     Adds .scrolled class to nav when page is scrolled past 20px.
     CSS handles the backdrop-blur and background transition.
  ──────────────────────────────────────────────────────────────────────────── */
  function initNav() {
    var nav = document.getElementById('nav');
    if (!nav) return;

    function onScroll() {
      if (window.scrollY > 20) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── Mobile Navigation ─────────────────────────────────────────────────────
     Hamburger toggles .open on nav links panel.
  ──────────────────────────────────────────────────────────────────────────── */
  function initMobileNav() {
    var burger = document.getElementById('navBurger');
    var links  = document.getElementById('navLinks');
    if (!burger || !links) return;

    var isOpen = false;

    function openMenu() {
      isOpen = true;
      links.classList.add('open');
      burger.classList.add('open');
      burger.setAttribute('aria-expanded', 'true');
      burger.setAttribute('aria-label', 'Close navigation menu');
      document.addEventListener('keydown', onKeydown);
    }

    function closeMenu() {
      isOpen = false;
      links.classList.remove('open');
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      burger.setAttribute('aria-label', 'Open navigation menu');
      document.removeEventListener('keydown', onKeydown);
    }

    function onKeydown(e) {
      if (e.key === 'Escape') closeMenu();
    }

    burger.addEventListener('click', function () {
      if (isOpen) closeMenu();
      else openMenu();
    });

    links.querySelectorAll('.nav__link').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });
  }

  /* ── Demo Modal ────────────────────────────────────────────────────────────
     All .js-cta buttons open this modal.
     Accessible: focus trap, Escape to close.
     Per CLAUDE.md: every CTA must open the demo modal, never navigate.
  ──────────────────────────────────────────────────────────────────────────── */
  function initDemoModal() {
    var modal    = document.getElementById('demoModal');
    var backdrop = document.getElementById('modalBackdrop');
    var closeBtn = document.getElementById('modalClose');
    var ctaBtns  = document.querySelectorAll('.js-cta');

    if (!modal || !backdrop) return;

    var previousFocus = null;

    function getFocusable() {
      return Array.from(
        modal.querySelectorAll(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      );
    }

    function openModal(triggerEl) {
      previousFocus = triggerEl || document.activeElement;
      modal.removeAttribute('hidden');
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          modal.classList.add('open');
          backdrop.classList.add('open');
        });
      });
      backdrop.removeAttribute('aria-hidden');
      document.body.style.overflow = 'hidden';
      var focusable = getFocusable();
      if (focusable.length) focusable[0].focus();
      document.addEventListener('keydown', onModalKeydown);
    }

    function closeModal() {
      modal.classList.remove('open');
      backdrop.classList.remove('open');
      modal.addEventListener('transitionend', function handler(e) {
        if (e.propertyName !== 'opacity') return;
        modal.setAttribute('hidden', '');
        modal.removeEventListener('transitionend', handler);
      });
      backdrop.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onModalKeydown);
      if (previousFocus && previousFocus.focus) {
        previousFocus.focus();
      }
    }

    function onModalKeydown(e) {
      if (e.key === 'Escape') {
        closeModal();
        return;
      }
      if (e.key === 'Tab') {
        var focusable = getFocusable();
        if (!focusable.length) return;
        var first = focusable[0];
        var last  = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    }

    ctaBtns.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        openModal(btn);
      });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    backdrop.addEventListener('click', closeModal);

    document.querySelectorAll('.footer__cta-link').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        openModal(btn);
      });
    });
  }

  /* ── Smooth Scroll ─────────────────────────────────────────────────────── */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var href = link.getAttribute('href');
        if (href === '#') return;
        var target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        var navHeight = 72;
        var top = target.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({ top: top, behavior: 'smooth' });
      });
    });
  }

  /* ── Init ──────────────────────────────────────────────────────────────── */
  function init() {
    initScrollReveal();
    initNav();
    initMobileNav();
    initDemoModal();
    initSmoothScroll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
