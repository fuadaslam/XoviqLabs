// ── EmailJS Configuration ──────────────────────────────────────────────────
const EMAILJS_PUBLIC_KEY  = '8luMZTHA70mjEhdlz';
const EMAILJS_SERVICE_ID  = 'service_5ttae88';
const EMAILJS_TEMPLATE_ID = 'template_wjzuxlg';

if (typeof emailjs !== 'undefined') {
  try {
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
  } catch (err) {
    console.warn('EmailJS initialization note:', err);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // ── 1. Interactive Neural Network Canvas Background ──
  const canvas = document.getElementById('bg-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mouse = { x: null, y: null, radius: 150 };

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    });

    const particles = [];
    const particleCount = Math.min(Math.floor((width * height) / 22000), 65);

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.radius = Math.random() * 1.6 + 0.8;
        this.baseAlpha = Math.random() * 0.4 + 0.2;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 240, 255, ${this.baseAlpha})`;
        ctx.fill();
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx = -this.vx;
        if (this.y < 0 || this.y > height) this.vy = -this.vy;

        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.hypot(dx, dy);
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            this.x -= (dx / dist) * force * 1.5;
            this.y -= (dy / dist) * force * 1.5;
          }
        }
      }
    }

    function initParticles() {
      particles.length = 0;
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    }
    initParticles();

    function animateParticles() {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.hypot(dx, dy);

          if (dist < 130) {
            const alpha = (1 - dist / 130) * 0.18;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }

  // ── 2. Preloader Splash Screen ──
  const splashScreen = document.getElementById('splash-screen');
  const progressText = document.getElementById('splash-progress-text');
  const progressFill = document.getElementById('splash-progress-fill');

  if (splashScreen) {
    let progress = 0;
    const duration = 1200;
    const intervalTime = 25;
    const step = 100 / (duration / intervalTime);

    const loader = setInterval(() => {
      progress += step;
      if (progress >= 100) {
        progress = 100;
        clearInterval(loader);
        if (progressText) progressText.innerText = '100%';
        if (progressFill) progressFill.style.width = '100%';

        setTimeout(() => {
          splashScreen.style.opacity = '0';
          splashScreen.style.visibility = 'hidden';
          triggerScrollReveals();
        }, 300);
      } else {
        if (progressText) progressText.innerText = Math.floor(progress) + '%';
        if (progressFill) progressFill.style.width = progress + '%';
      }
    }, intervalTime);
  }

  // ── 3. Scroll Reveal Observer ──
  const srElements = document.querySelectorAll('.sr');
  const srObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  function triggerScrollReveals() {
    srElements.forEach((el) => srObserver.observe(el));
  }

  // ── 4. Smart Navbar Hide / Reveal ──
  const navbar = document.getElementById('navbar');
  let lastScrollTop = 0;

  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop > 120) {
      if (scrollTop > lastScrollTop && scrollTop - lastScrollTop > 8) {
        navbar?.classList.add('hidden');
      } else if (lastScrollTop - scrollTop > 8) {
        navbar?.classList.remove('hidden');
      }
    } else {
      navbar?.classList.remove('hidden');
    }
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
  });

  // ── 5. Mobile Menu Toggle ──
  const hamburger = document.getElementById('nav-hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  function toggleMenu(open) {
    hamburger?.classList.toggle('open', open);
    mobileMenu?.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }

  hamburger?.addEventListener('click', () => {
    toggleMenu(!mobileMenu?.classList.contains('open'));
  });

  document.querySelectorAll('.mobile-link').forEach((link) => {
    link.addEventListener('click', () => toggleMenu(false));
  });

  // ── 6. Portfolio Filter Tabs ──
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter || category?.includes(filter)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // ── 7. Animated Numbers on Scroll ──
  const statNumbers = document.querySelectorAll('.stat-number');
  let statsTriggered = false;

  const statsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !statsTriggered) {
          statsTriggered = true;
          statNumbers.forEach((el) => {
            const target = parseInt(el.getAttribute('data-target') || '0', 10);
            const prefix = el.getAttribute('data-prefix') || '';
            const suffix = el.getAttribute('data-suffix') || '';
            let count = 0;
            const step = Math.max(1, Math.floor(target / 40));
            const timer = setInterval(() => {
              count += step;
              if (count >= target) {
                count = target;
                clearInterval(timer);
              }
              el.textContent = `${prefix}${count}${suffix}`;
            }, 30);
          });
        }
      });
    },
    { threshold: 0.3 }
  );

  const statsSection = document.getElementById('stats');
  if (statsSection) {
    statsObserver.observe(statsSection);
  }

  // ── 8. Contact Form Submission via EmailJS ──
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    const submitBtn = document.getElementById('form-submit-btn');
    const statusEl = document.getElementById('form-status');

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (typeof emailjs === 'undefined') {
        if (statusEl) {
          statusEl.textContent = 'Direct mail ready. Please email info@xoviqlabs.com';
          statusEl.className = 'form-status error';
        }
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Sending Inquiry...';
      }
      if (statusEl) {
        statusEl.className = 'form-status';
        statusEl.textContent = '';
      }

      const formData = new FormData(contactForm);
      const selectedService = formData.get('service') || 'General Inquiry';
      const selectedBudget = formData.get('budget') || 'Flexible';

      const templateParams = {
        from_name: formData.get('name'),
        from_email: formData.get('email'),
        from_phone: formData.get('phone') || 'Not provided',
        service_type: `${selectedService} (Budget: ${selectedBudget})`,
        message: formData.get('message'),
        to_email: 'info@xoviqlabs.com',
      };

      try {
        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
        if (statusEl) {
          statusEl.textContent = '✨ Message transmitted! Our engineering lead will respond within 24 hours.';
          statusEl.className = 'form-status success';
        }
        contactForm.reset();
      } catch (err) {
        console.error('EmailJS error:', err);
        if (statusEl) {
          statusEl.textContent = 'Transmission error. Please reach out directly to info@xoviqlabs.com';
          statusEl.className = 'form-status error';
        }
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = 'Transmit Project Inquiry &rarr;';
        }
      }
    });
  }
});
