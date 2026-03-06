/* ─────────────────────────────────────────
   Polyform — Main JavaScript
   ───────────────────────────────────────── */

// ── Sticky nav ──────────────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// ── Mobile hamburger ─────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', open);
});

// Close menu on link click
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});

// ── Scroll-triggered fade-in ──────────────────
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
);

document.querySelectorAll(
  '.step, .feature-card, .gallery-item, .testimonial, .pricing-card, .faq-item, .contact-option'
).forEach((el, i) => {
  el.style.opacity = '0';
  el.style.animationDelay = `${(i % 4) * 0.1}s`;
  observer.observe(el);
});

// ── Typing animation for prompt bubble ────────
const prompts = [
  '"Cyberpunk tiger with neon city skyline"',
  '"Astronaut surfing on Saturn's rings"',
  '"Vintage mandala with lotus flowers"',
  '"Retro 80s synthwave mountain sunset"',
  '"Minimalist wolf moon geometric"',
];

let promptIndex = 0;
const promptTextEl = document.querySelector('.prompt-text');

function typePrompt(text, el, onDone) {
  el.textContent = '';
  let i = 0;
  const interval = setInterval(() => {
    el.textContent += text[i];
    i++;
    if (i >= text.length) {
      clearInterval(interval);
      if (onDone) setTimeout(onDone, 2400);
    }
  }, 36);
}

function cyclePrompts() {
  promptIndex = (promptIndex + 1) % prompts.length;
  typePrompt(prompts[promptIndex], promptTextEl, cyclePrompts);
}

if (promptTextEl) {
  // Start cycling after 3s
  setTimeout(() => typePrompt(prompts[0], promptTextEl, cyclePrompts), 3000);
}

// ── Contact form handler ───────────────────────
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    const original = btn.textContent;

    btn.textContent = 'Sending…';
    btn.disabled = true;

    // Simulate submission (replace with real endpoint)
    setTimeout(() => {
      btn.textContent = '✓ Message sent! We\'ll be in touch.';
      btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
      contactForm.reset();

      setTimeout(() => {
        btn.textContent = original;
        btn.style.background = '';
        btn.disabled = false;
      }, 4000);
    }, 1200);
  });
}

// ── Smooth-scroll offset for fixed nav ────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ── Active nav link highlight ─────────────────
const sections = document.querySelectorAll('section[id]');
const navAnchorLinks = navLinks.querySelectorAll('a[href^="#"]');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navAnchorLinks.forEach(a => {
          a.style.color = a.getAttribute('href') === `#${entry.target.id}`
            ? 'var(--clr-text)'
            : '';
        });
      }
    });
  },
  { rootMargin: '-40% 0px -50% 0px' }
);

sections.forEach(s => sectionObserver.observe(s));
