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

// ── Hero: live generation animation ──────────
const prompts = [
  '"Cyberpunk tiger with neon city skyline"',
  '"Astronaut surfing on Saturn\'s rings"',
  '"Vintage mandala with lotus flowers"',
  '"Retro 80s synthwave mountain sunset"',
  '"Minimalist wolf moon geometric"',
];

let promptIndex = 0;

const promptTextEl  = document.querySelector('.prompt-text');
const genOverlay    = document.getElementById('genOverlay');
const genPctEl      = document.getElementById('genPct');
const statusPill    = document.getElementById('statusPill');
const statusDot     = document.getElementById('statusDot');
const statusTextEl  = document.getElementById('statusText');
const promptLoader  = document.getElementById('promptLoader');
const promptDone    = document.getElementById('promptDone');

function setStatus(state) {
  if (!statusDot) return;
  statusDot.className = 'status-dot';
  if (state === 'generating') {
    statusDot.classList.add('generating');
    statusTextEl.textContent = 'Generating';
    promptLoader.style.display = 'flex';
    promptDone.style.display = 'none';
  } else if (state === 'done') {
    statusDot.classList.add('done');
    statusTextEl.textContent = 'Done';
    promptLoader.style.display = 'none';
    promptDone.style.display = 'block';
  } else {
    statusTextEl.textContent = 'Typing';
    promptLoader.style.display = 'flex';
    promptDone.style.display = 'none';
  }
}

function switchDesign(index) {
  document.querySelectorAll('.design-slide').forEach((el, i) => {
    el.classList.toggle('active', i === index);
  });
}

function runGeneration(onDone) {
  genOverlay.classList.add('visible');
  let pct = 0;
  genPctEl.textContent = '0%';
  const tick = setInterval(() => {
    pct += Math.random() * 9 + 3;
    if (pct >= 100) {
      pct = 100;
      clearInterval(tick);
      genPctEl.textContent = '100%';
      setTimeout(() => {
        genOverlay.classList.remove('visible');
        if (onDone) onDone();
      }, 350);
    } else {
      genPctEl.textContent = Math.floor(pct) + '%';
    }
  }, 55);
}

function typePrompt(text, el, onDone) {
  el.textContent = '';
  let i = 0;
  const interval = setInterval(() => {
    el.textContent += text[i];
    i++;
    if (i >= text.length) {
      clearInterval(interval);
      if (onDone) onDone();
    }
  }, 38);
}

function cyclePrompts() {
  promptIndex = (promptIndex + 1) % prompts.length;
  setStatus('typing');
  typePrompt(prompts[promptIndex], promptTextEl, () => {
    setStatus('generating');
    runGeneration(() => {
      switchDesign(promptIndex);
      setStatus('done');
      setTimeout(cyclePrompts, 2600);
    });
  });
}

if (promptTextEl) {
  // Initial state: design 0 already visible, show as "done"
  setStatus('done');
  // Start first cycle after 3.5s
  setTimeout(cyclePrompts, 3500);
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
