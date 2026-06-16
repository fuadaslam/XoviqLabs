// ── EmailJS config ──────────────────────────────────────────────────────────
// Sign up at https://www.emailjs.com, create a service + template, then paste
// your credentials here.
const EMAILJS_PUBLIC_KEY  = '6AxY_rlLDiZVso3bVPuMd';   // Account → API Keys
const EMAILJS_SERVICE_ID  = 'service_5ttae88';   // Email Services tab
const EMAILJS_TEMPLATE_ID = 'template_wjzuxlg';  // Email Templates tab

if (typeof emailjs !== 'undefined') {
  emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
}
// ────────────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  // --- Preloader Logic ---
  const splashScreen = document.getElementById('splash-screen');
  const progressText = document.getElementById('splash-progress-text');
  const progressFill = document.getElementById('splash-progress-fill');
  
  let progress = 0;
  const loadDuration = 1500; // Total fake loading time in ms
  const intervalTime = 30; // Update every 30ms
  const increment = (100 / (loadDuration / intervalTime));

  const loadingInterval = setInterval(() => {
    progress += increment;
    
    if (progress >= 100) {
      progress = 100;
      clearInterval(loadingInterval);
      
      // Finish loading
      progressText.innerText = '100%';
      progressFill.style.width = '100%';
      
      setTimeout(() => {
        splashScreen.style.opacity = '0';
        splashScreen.style.visibility = 'hidden';
        
        // Trigger initial scroll reveals once loading is done
        triggerScrollReveals();
      }, 400); // Wait a bit after 100%
      
    } else {
      progressText.innerText = Math.floor(progress) + '%';
      progressFill.style.width = progress + '%';
    }
  }, intervalTime);

  // --- Scroll Reveal Logic ---
  const srElements = document.querySelectorAll('.sr');
  
  const srObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // observer.unobserve(entry.target); // Uncomment to reveal only once
      }
    });
  }, {
    root: null,
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  function triggerScrollReveals() {
    srElements.forEach(el => srObserver.observe(el));
  }
  
  // --- Navbar Scroll Hide/Show Logic (Optional: Hide when scrolling down, show when scrolling up) ---
  const navbar = document.getElementById('navbar');
  let lastScrollTop = 0;

  window.addEventListener('scroll', () => {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // If scrolled past 100px
    if (scrollTop > 100) {
      if (scrollTop > lastScrollTop) {
        // Scrolling down
        navbar.classList.add('hidden');
      } else {
        // Scrolling up
        navbar.classList.remove('hidden');
      }
    } else {
      // At the top
      navbar.classList.remove('hidden');
    }
    
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
  });

  // --- Contact Form → EmailJS ---
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    const submitBtn = document.getElementById('form-submit-btn');
    const statusEl  = document.getElementById('form-status');

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (typeof emailjs === 'undefined') {
        statusEl.textContent = 'Email service unavailable. Please email us directly at info@xoviqlabs.com';
        statusEl.className = 'form-status error';
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';
      statusEl.className = 'form-status';
      statusEl.textContent = '';

      const formData = new FormData(contactForm);
      const templateParams = {
        from_name:    formData.get('name'),
        from_email:   formData.get('email'),
        from_phone:   formData.get('phone'),
        service_type: formData.get('service'),
        message:      formData.get('message'),
        to_email:     'info@xoviqlabs.com',
      };

      try {
        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
        statusEl.textContent = "Message sent! We'll be in touch within 24 hours.";
        statusEl.className = 'form-status success';
        contactForm.reset();
      } catch (err) {
        console.error('EmailJS error:', err);
        statusEl.textContent = 'Something went wrong. Please email us directly at info@xoviqlabs.com';
        statusEl.className = 'form-status error';
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
      }
    });
  }

});
