document.addEventListener('DOMContentLoaded', () => {
  /* ── Hamburger / Mobile Menu ── */
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  const body = document.body;

  const navBackdrop = document.getElementById('navBackdrop');

  const closeMenu = () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('active');
    navBackdrop && navBackdrop.classList.remove('active');
    body.classList.remove('overflow-hidden');
  };

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('active');
      navBackdrop && navBackdrop.classList.toggle('active');
      body.classList.toggle('overflow-hidden');
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });
  }

  if (navBackdrop) {
    navBackdrop.addEventListener('click', closeMenu);
  }

  /* ── Navbar Scroll Highlight / Shrink + Scroll-top visibility ── */
  const nav = document.getElementById('nav');
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  window.addEventListener('scroll', () => {
    if (nav) nav.classList.toggle('s', window.scrollY > 40);
    if (scrollTopBtn) scrollTopBtn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── Lenis Smooth Scroll ── */
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });
  function raf(time) { 
    lenis.raf(time); 
    requestAnimationFrame(raf); 
  }
  requestAnimationFrame(raf);

  /* ── Scroll Reveal Fallback (For browsers not supporting native scroll-driven animations) ── */
  const hasScrollTimeline = CSS.supports('animation-timeline', 'view()');
  if (!hasScrollTimeline) {
    const revEls = document.querySelectorAll('.sr, .sr-l, .sr-r');
    const revObs = new IntersectionObserver(entries => {
      entries.forEach(e => { 
        if (e.isIntersecting) {
          e.target.classList.add('visible'); 
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    
    revEls.forEach(el => revObs.observe(el));
  } else {
    // If native animation is supported, make sure the elements are ready
    document.querySelectorAll('.sr, .sr-l, .sr-r').forEach(el => {
      el.classList.add('visible'); // Let the animation-timeline handle the keyframes natively
    });
  }

  /* ── Hero Load Animation ── */
  window.addEventListener('load', () => {
    document.querySelectorAll('#hero .sr, #hero .sr-r').forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), 120 + i * 160);
    });
  });

  /* ── Counter Animation ── */
  const cntObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix ?? '';
      if (!target) return;
      let cur = 0;
      const inc = target / 60; // 60 frames
      const tick = () => {
        cur = Math.min(cur + inc, target);
        el.textContent = Math.floor(cur) + suffix;
        if (cur < target) {
          requestAnimationFrame(tick);
        }
      };
      requestAnimationFrame(tick);
      cntObs.unobserve(el);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-count]').forEach(el => cntObs.observe(el));

  /* ── Mouse Parallax for Hero Orbs ── */
  const orb1 = document.querySelector('.hero-orb1');
  const orb2 = document.querySelector('.hero-orb2');
  
  if (orb1 && orb2) {
    let ticking = false;
    window.addEventListener('mousemove', e => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const x = (e.clientX / window.innerWidth - .5) * 32;
          const y = (e.clientY / window.innerHeight - .5) * 32;
          orb1.style.transform = `translate(${x}px, ${y}px)`;
          orb2.style.transform = `translate(${-x * 0.6}px, ${-y * 0.6}px)`;
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ── Active Nav Highlighting ── */
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
  if (sections.length && navAnchors.length) {
    const navObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navAnchors.forEach(a => {
            a.classList.toggle('nav-active', a.getAttribute('href') === `#${id}`);
          });
        }
      });
    }, { threshold: 0.25, rootMargin: '-80px 0px -45% 0px' });
    sections.forEach(s => navObserver.observe(s));
  }

  /* ── Hero Globe Mouse Tilt ── */
  const svgWrap = document.querySelector('.hero-svg-wrap');
  const heroSection = document.getElementById('hero');
  if (svgWrap && heroSection) {
    heroSection.addEventListener('mousemove', e => {
      svgWrap.style.transition = 'transform 0.12s linear';
      const rect = heroSection.getBoundingClientRect();
      const dx = (e.clientX - (rect.left + rect.width  / 2)) / (rect.width  / 2);
      const dy = (e.clientY - (rect.top  + rect.height / 2)) / (rect.height / 2);
      svgWrap.style.transform = `perspective(900px) rotateX(${dy * -7}deg) rotateY(${dx * 7}deg)`;
    }, { passive: true });
    heroSection.addEventListener('mouseleave', () => {
      svgWrap.style.transition = 'transform 0.9s cubic-bezier(0.16,1,0.3,1)';
      svgWrap.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg)';
    });
  }

  /* ── Contact Form Submit ── */
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');
  if (contactForm && formSuccess) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('.form-submit');
      submitBtn.textContent = 'Sending…';
      submitBtn.disabled = true;
      setTimeout(() => {
        contactForm.reset();
        submitBtn.style.display = 'none';
        formSuccess.hidden = false;
      }, 1400);
    });
  }

  /* ── Pause Tech Marquee on Hover ── */
  document.querySelectorAll('.tech-row').forEach(row => {
    row.addEventListener('mouseenter', () => {
      row.style.animationPlayState = 'paused';
    });
    row.addEventListener('mouseleave', () => {
      row.style.animationPlayState = 'running';
    });
  });

  /* ── Technology Filter Logic ── */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const techPills = document.querySelectorAll('.tech-pill');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      if (filter === 'all') {
        techPills.forEach(pill => {
          pill.classList.remove('dimmed');
          pill.classList.remove('highlighted');
        });
      } else {
        techPills.forEach(pill => {
          if (pill.classList.contains(`cat-${filter}`)) {
            pill.classList.remove('dimmed');
            pill.classList.add('highlighted');
          } else {
            pill.classList.add('dimmed');
            pill.classList.remove('highlighted');
          }
        });
      }
    });
  });
});
