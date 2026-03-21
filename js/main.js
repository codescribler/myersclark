/* ============================================================================
   MYERS CLARK CHARTERED ACCOUNTANTS — DEMO WEBSITE
   Interactive JavaScript for animations, modal, and navigation
   ============================================================================ */

'use strict';

/**
 * MOBILE MENU TOGGLE
 * Handles mobile navigation menu open/close
 */
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (mobileMenuToggle) {
  mobileMenuToggle.addEventListener('click', () => {
    mobileMenuToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
  });

  // Close menu when a link is clicked
  const navItems = navLinks.querySelectorAll('a');
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      mobileMenuToggle.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.navbar')) {
      mobileMenuToggle.classList.remove('active');
      navLinks.classList.remove('active');
    }
  });
}

/**
 * DEMO MODAL MANAGEMENT
 * Handles opening and closing the demo modal
 */
const modal = document.getElementById('demoModal');
const modalBackdrop = document.querySelector('.modal-backdrop');
const modalClose = document.querySelector('.modal-close');
const ctaButtons = document.querySelectorAll('.cta-button, .cta-primary, .cta-secondary, .cta-large');

function openModal() {
  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  // Focus the close button for accessibility
  setTimeout(() => modalClose.focus(), 100);
}

function closeModal() {
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = 'auto';
}

// Open modal on all CTA button clicks
ctaButtons.forEach(button => {
  button.addEventListener('click', (e) => {
    e.preventDefault();
    openModal();
  });
});

// Close modal
if (modalClose) {
  modalClose.addEventListener('click', closeModal);
}

if (modalBackdrop) {
  modalBackdrop.addEventListener('click', closeModal);
}

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.classList.contains('active')) {
    closeModal();
  }
});

// Modal focus trap
document.addEventListener('keydown', (e) => {
  if (!modal.classList.contains('active')) return;

  if (e.key === 'Tab') {
    const focusableElements = modal.querySelectorAll('button, a[href], [tabindex]:not([tabindex="-1"])');
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault();
      lastElement.focus();
    } else if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault();
      firstElement.focus();
    }
  }
});

/**
 * SCROLL ANIMATIONS
 * Fade in sections as they come into view
 */
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe all animated elements
const animatedElements = document.querySelectorAll(
  '.problem-card, .badge, .team-member, .value-item, ' +
  '.testimonial-card, .step-card, .service-card, .stakes-item, .success-item'
);

animatedElements.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 600ms cubic-bezier(0.34, 1.56, 0.64, 1), transform 600ms cubic-bezier(0.34, 1.56, 0.64, 1)';
  observer.observe(el);
});

/**
 * SMOOTH SCROLL BEHAVIOR
 * Enhance smooth scrolling for anchor links
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;

    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

/**
 * NAVBAR BACKGROUND ON SCROLL
 * Add subtle background when scrolling down
 */
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    navbar.style.borderBottomColor = 'rgba(226, 232, 240, 0.5)';
    navbar.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.05)';
  } else {
    navbar.style.borderBottomColor = '';
    navbar.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.05)';
  }
});

/**
 * ELEMENT VISIBILITY TRACKING
 * Track which section the user is viewing for analytics
 */
const sections = document.querySelectorAll('section');
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Could send analytics here
      // For now, just log for debugging
      console.log('Viewing section:', entry.target.id);
    }
  });
}, { threshold: 0.5 });

sections.forEach(section => {
  sectionObserver.observe(section);
});

/**
 * ACCESSIBILITY ENHANCEMENTS
 * Skip to main content link
 */
const skipLink = document.createElement('a');
skipLink.href = '#problem';
skipLink.textContent = 'Skip to main content';
skipLink.style.position = 'absolute';
skipLink.style.top = '-40px';
skipLink.style.left = '0';
skipLink.style.background = '#0369A1';
skipLink.style.color = 'white';
skipLink.style.padding = '8px';
skipLink.style.zIndex = '100';

skipLink.addEventListener('focus', () => {
  skipLink.style.top = '0';
});

skipLink.addEventListener('blur', () => {
  skipLink.style.top = '-40px';
});

document.body.insertBefore(skipLink, document.body.firstChild);

/**
 * FORM & INTERACTION ENHANCEMENTS
 * Add cursor pointer to interactive elements
 */
document.querySelectorAll('button, a, [role="button"]').forEach(el => {
  if (!el.classList.contains('modal-close')) {
    el.style.cursor = 'pointer';
  }
});

/**
 * PERFORMANCE: Preload hero image
 */
window.addEventListener('load', () => {
  const heroImg = document.querySelector('.hero-image');
  if (heroImg && heroImg.src) {
    const img = new Image();
    img.src = heroImg.src;
  }
});

/**
 * BUTTON RIPPLE EFFECT
 * Add subtle ripple feedback on button clicks
 */
document.querySelectorAll('.cta-button').forEach(button => {
  button.addEventListener('click', function(e) {
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ripple = document.createElement('span');
    ripple.style.position = 'absolute';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.style.width = '20px';
    ripple.style.height = '20px';
    ripple.style.background = 'rgba(255, 255, 255, 0.5)';
    ripple.style.borderRadius = '50%';
    ripple.style.transform = 'translate(-50%, -50%)';
    ripple.style.pointerEvents = 'none';
    ripple.style.animation = 'rippleAnimation 600ms ease-out';

    this.style.position = 'relative';
    this.style.overflow = 'hidden';
    this.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
  });
});

// Add ripple animation keyframes
const style = document.createElement('style');
style.textContent = `
  @keyframes rippleAnimation {
    from {
      opacity: 1;
      transform: translate(-50%, -50%) scale(0);
    }
    to {
      opacity: 0;
      transform: translate(-50%, -50%) scale(4);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    @keyframes rippleAnimation {
      from {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1);
      }
      to {
        opacity: 0;
        transform: translate(-50%, -50%) scale(1);
      }
    }
  }
`;
document.head.appendChild(style);

/**
 * LAZY LOAD OPTIMIZATION
 * Handle native lazy loading fallback
 */
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
        observer.unobserve(img);
      }
    });
  });

  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
}

/**
 * FORM VALIDATION HELPER
 * Validate email before sending
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * CALL TRACKING
 * Log phone clicks for analytics
 */
document.querySelectorAll('a[href^="tel:"]').forEach(link => {
  link.addEventListener('click', () => {
    if (window.clarity) {
      clarity('event', 'Phone Click');
    }
  });
});

/**
 * EMAIL TRACKING
 * Log email clicks for analytics
 */
document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
  link.addEventListener('click', () => {
    if (window.clarity) {
      clarity('event', 'Email Click');
    }
  });
});

/**
 * PAGE VISIBILITY
 * Track when user leaves and returns to page
 */
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    if (window.clarity) {
      clarity('event', 'Page Hidden');
    }
  } else {
    if (window.clarity) {
      clarity('event', 'Page Visible');
    }
  }
});

/**
 * ERROR BOUNDARY
 * Catch any runtime errors gracefully
 */
window.addEventListener('error', (event) => {
  console.error('Runtime error:', event.error);
  // Could send error tracking here
});

/**
 * INIT COMPLETE
 * Log when page is fully interactive
 */
document.addEventListener('DOMContentLoaded', () => {
  console.log('Myers Clark Demo - Interactive features loaded');
  if (window.clarity) {
    clarity('event', 'Page Loaded');
  }
});
