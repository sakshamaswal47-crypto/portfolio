/* =========================================================================
   SAKSHAM ASWAL — PORTFOLIO SCRIPT
   Vanilla JavaScript only — no dependencies
   ========================================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ----------------------------------------------------------------------
     1. LOADING SCREEN
     Hides the loader once the page has fully loaded.
  ---------------------------------------------------------------------- */
  const loadingScreen = document.getElementById('loading-screen');
  window.addEventListener('load', () => {
    setTimeout(() => {
      loadingScreen.classList.add('hidden');
    }, 600);
  });

  /* ----------------------------------------------------------------------
     2. SCROLL PROGRESS BAR
     Fills as the user scrolls down the page.
  ---------------------------------------------------------------------- */
  const scrollProgress = document.getElementById('scroll-progress');
  function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = `${percent}%`;
  }

  /* ----------------------------------------------------------------------
     3. NAVBAR — background on scroll + active link highlighting
  ---------------------------------------------------------------------- */
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  function updateNavbar() {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }

  function updateActiveLink() {
    let current = '';
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });
    navLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  }

  /* Combine scroll-driven updates into a single listener for performance */
  window.addEventListener('scroll', () => {
    updateScrollProgress();
    updateNavbar();
    updateActiveLink();
    toggleScrollTopButton();
  });

  /* ----------------------------------------------------------------------
     4. MOBILE NAV TOGGLE
  ---------------------------------------------------------------------- */
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');

  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  /* Close mobile menu when a link is clicked */
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ----------------------------------------------------------------------
     5. TYPING EFFECT — cycles through roles in the hero section
  ---------------------------------------------------------------------- */
  const typingTarget = document.getElementById('typing-text');
  const roles = ['Full Stack Developer', 'Problem Solver', 'DSA Enthusiast'];
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function typeLoop() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      charIndex--;
    } else {
      charIndex++;
    }

    typingTarget.textContent = currentRole.substring(0, charIndex);

    let delay = isDeleting ? 45 : 90;

    if (!isDeleting && charIndex === currentRole.length) {
      delay = 1400; // pause at full word
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      delay = 400;
    }

    setTimeout(typeLoop, delay);
  }

  if (prefersReducedMotion) {
    typingTarget.textContent = roles[0];
  } else {
    typeLoop();
  }

  /* ----------------------------------------------------------------------
     6. SCROLL-TRIGGERED ANIMATIONS (fade-in / slide-up)
     Uses IntersectionObserver for performant reveal-on-scroll.
  ---------------------------------------------------------------------- */
  const animatedEls = document.querySelectorAll('.slide-up, .about-stats .stat-card');
  const skillBars = document.querySelectorAll('.skill-bar-fill');
  const statNumbers = document.querySelectorAll('.stat-number');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  animatedEls.forEach((el) => revealObserver.observe(el));

  /* Animated skill bars — fill width once visible */
  const skillObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const targetWidth = bar.getAttribute('data-width');
          bar.style.width = `${targetWidth}%`;
          skillObserver.unobserve(bar);
        }
      });
    },
    { threshold: 0.4 }
  );
  skillBars.forEach((bar) => skillObserver.observe(bar));

  /* Animated counters for About stats */
  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count'), 10);
    const duration = 1200;
    const startTime = performance.now();

    function step(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const value = Math.floor(progress * target);
      el.textContent = value;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target;
      }
    }
    requestAnimationFrame(step);
  }

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  statNumbers.forEach((num) => counterObserver.observe(num));

  /* ----------------------------------------------------------------------
     7. SCROLL-TO-TOP BUTTON
  ---------------------------------------------------------------------- */
  const scrollTopBtn = document.getElementById('scroll-top-btn');

  function toggleScrollTopButton() {
    scrollTopBtn.classList.toggle('visible', window.scrollY > 500);
  }

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ----------------------------------------------------------------------
     8. CONTACT FORM — client-side handling (no backend wired up)
  ---------------------------------------------------------------------- */
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!contactForm.checkValidity()) {
      formStatus.textContent = 'Please fill in all fields correctly.';
      return;
    }

    // NOTE: Wire this up to your own backend, form service (e.g. Formspree),
    // or email API to actually send messages.
    formStatus.textContent = 'Thanks! Your message has been noted.';
    contactForm.reset();
  });

  /* ----------------------------------------------------------------------
     9. FOOTER — current year
  ---------------------------------------------------------------------- */
  document.getElementById('current-year').textContent = new Date().getFullYear();

  /* ----------------------------------------------------------------------
     10. PARTICLE / NETWORK BACKGROUND
     A lightweight animated node-graph, nodding to graphs & DSA.
     Pauses automatically when the tab is hidden or motion is reduced.
  ---------------------------------------------------------------------- */
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animationFrameId;
  let width, height;

  function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  function createParticles() {
    const count = Math.min(70, Math.floor((width * height) / 18000));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      radius: Math.random() * 1.6 + 1,
    }));
  }

  function drawParticles() {
    ctx.clearRect(0, 0, width, height);

    // Move + draw nodes
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(59, 130, 246, 0.6)';
      ctx.fill();
    });

    // Draw connecting edges between nearby nodes (graph-like effect)
    const maxDist = 130;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(59, 130, 246, ${0.15 * (1 - dist / maxDist)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    animationFrameId = requestAnimationFrame(drawParticles);
  }

  function startParticles() {
    resizeCanvas();
    createParticles();
    if (!prefersReducedMotion) {
      drawParticles();
    }
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animationFrameId);
    } else if (!prefersReducedMotion) {
      drawParticles();
    }
  });

  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      cancelAnimationFrame(animationFrameId);
      startParticles();
    }, 200);
  });

  startParticles();

  /* Run once on load to set initial nav/scroll state */
  updateScrollProgress();
  updateNavbar();
  updateActiveLink();
  toggleScrollTopButton();
});