document.addEventListener('DOMContentLoaded', () => {
  let lenis;

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
    if (lenis) lenis.start();
  };

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const isActive = hamburger.classList.toggle('active');
      navLinks.classList.toggle('active');
      navBackdrop && navBackdrop.classList.toggle('active');
      body.classList.toggle('overflow-hidden');
      
      if (lenis) {
        if (isActive) {
          lenis.stop();
        } else {
          lenis.start();
        }
      }
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
  lenis = new Lenis({
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

  /* ── 3D Rotating Dotted Globe (Canvas) ── */
  const canvas = document.getElementById('globe-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    
    // Set scale for high-DPI displays
    const dpr = window.devicePixelRatio || 1;
    const baseW = 600;
    const baseH = 600;
    canvas.width = baseW * dpr;
    canvas.height = baseH * dpr;
    ctx.scale(dpr, dpr);
    
    // Unpack WORLD_MAP_DATA (base64 of binary grid)
    const b64_chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    let bitstring = "";
    if (typeof WORLD_MAP_DATA !== 'undefined') {
      for (let i = 0; i < WORLD_MAP_DATA.length; i++) {
        const val = b64_chars.indexOf(WORLD_MAP_DATA[i]);
        if (val !== -1) {
          bitstring += val.toString(2).padStart(6, '0');
        }
      }
    }
    
    const mapW = 120;
    const mapH = 60;
    const radius = 162; // sphere radius
    const rawPoints = [];
    
    // Generate map points on sphere
    for (let y = 0; y < mapH; y++) {
      for (let x = 0; x < mapW; x++) {
        const idx = y * mapW + x;
        if (bitstring[idx] === '1') {
          // Normalize lat/lon coordinates
          const lon = (x / mapW) * 2 * Math.PI - Math.PI; // -PI to PI
          const lat = Math.PI/2 - (y / mapH) * Math.PI;  // PI/2 to -PI/2
          
          // Spherical coordinates
          const px = radius * Math.cos(lat) * Math.sin(lon);
          const py = -radius * Math.sin(lat);
          const pz = radius * Math.cos(lat) * Math.cos(lon);
          
          rawPoints.push({ x: px, y: py, z: pz });
        }
      }
    }
    
    // Generate ambient particle cloud
    const numParticles = 40;
    const particles = [];
    for (let i = 0; i < numParticles; i++) {
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos((Math.random() * 2) - 1);
      const r = radius + 30 + Math.random() * 50; // outside the globe
      
      particles.push({
        x: r * Math.sin(phi) * Math.cos(theta),
        y: r * Math.sin(phi) * Math.sin(theta),
        z: r * Math.cos(phi),
        size: 1 + Math.random() * 1.5,
        color: Math.random() > 0.4 ? '#2DD4B0' : '#5B7FFF'
      });
    }

    // Market locations on the globe
    const MARKETS = [
      { name: "KSA", lat: 23.8, lon: 45.0, color: "#2DD4B0", labelAlign: "middle", labelOffset: { x: 0, y: -14 } },
      { name: "UAE", lat: 24.4, lon: 54.3, color: "#2DD4B0", labelAlign: "middle", labelOffset: { x: 0, y: -14 } },
      { name: "IND", lat: 20.5, lon: 78.9, color: "#5B7FFF", labelAlign: "start", labelOffset: { x: 12, y: 3 } }
    ];

    // Compute initial market points in 3D
    MARKETS.forEach(m => {
      const lonRad = (m.lon * Math.PI) / 180;
      const latRad = (m.lat * Math.PI) / 180;
      m.x = radius * Math.cos(latRad) * Math.sin(lonRad);
      m.y = -radius * Math.sin(latRad);
      m.z = radius * Math.cos(latRad) * Math.cos(lonRad);
      m.pulse = 0;
    });

    // We will define connections between markets: [fromIndex, toIndex]
    const CONNECTIONS = [
      { from: 0, to: 1, type: "solid" }, // KSA to UAE
      { from: 1, to: 2, type: "solid" }, // UAE to IND
      { from: 0, to: 2, type: "dashed" } // KSA to IND
    ];

    // Precompute connection 3D arcs
    CONNECTIONS.forEach(conn => {
      const m1 = MARKETS[conn.from];
      const m2 = MARKETS[conn.to];
      conn.points = [];
      const steps = 40;
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        // Interpolate coordinates
        let px = m1.x + (m2.x - m1.x) * t;
        let py = m1.y + (m2.y - m1.y) * t;
        let pz = m1.z + (m2.z - m1.z) * t;
        
        // Normalize and push out slightly in the middle to form an arc
        const len = Math.sqrt(px*px + py*py + pz*pz);
        const arcHeight = 25 * Math.sin(t * Math.PI);
        const scale = (radius + arcHeight) / len;
        
        conn.points.push({
          x: px * scale,
          y: py * scale,
          z: pz * scale
        });
      }
      conn.beamProgress = Math.random(); // starting progress for the data packet animation
    });

    // Orbit Rings points
    const ORBITS = [
      { radius: radius + 70, tiltX: 0.35, tiltZ: 0.25, speed: 0.003, color: "rgba(45,212,176,0.18)", dotColor: "#2DD4B0", dotProgress: 0 },
      { radius: radius + 40, tiltX: -0.4, tiltZ: -0.3, speed: -0.004, color: "rgba(91,127,255,0.15)", dotColor: "#3B5FDB", dotProgress: 0.5 }
    ];

    let angleY = -1.05; // Initial Y-rotation to center Middle East/India
    let angleX = 0.25;  // Slight down-tilt
    
    // Animation Loop
    function animate() {
      try {
        // Handle resizing/high-DPI dynamically
        const rect = canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        const displayW = rect.width || 600;
        const displayH = rect.height || 600;
        
        if (canvas.width !== displayW * dpr || canvas.height !== displayH * dpr) {
          canvas.width = displayW * dpr;
          canvas.height = displayH * dpr;
          ctx.scale(dpr, dpr);
        }
        
        // Rotate globe
        angleY += 0.0025;
        
        // Clear canvas
        ctx.clearRect(0, 0, displayW, displayH);
        
        // Rotation matrices components
        const cosY = Math.cos(angleY);
        const sinY = Math.sin(angleY);
        const cosX = Math.cos(angleX);
        const sinX = Math.sin(angleX);
        
        const cameraDist = 650;
        const cx = displayW / 2;
        const cy = displayH / 2;
      
      // Rotate and project function
      function project(p) {
        // Rotate Y
        const x1 = p.x * cosY + p.z * sinY;
        const z1 = -p.x * sinY + p.z * cosY;
        const y1 = p.y;
        
        // Rotate X
        const x2 = x1;
        const y2 = y1 * cosX - z1 * sinX;
        const z2 = y1 * sinX + z1 * cosX;
        
        // Perspective projection
        const scale = cameraDist / (cameraDist - z2);
        const px = x2 * scale + cx;
        const py = y2 * scale + cy;
        
        return { x: px, y: py, z: z2, scale: scale };
      }

      const drawQueue = [];

      // 1. Queue Globe Dots
      rawPoints.forEach(p => {
        const proj = project(p);
        
        // Back side points are faded; front side points are brighter
        let color;
        let rSize = 1.25 * proj.scale;
        
        if (proj.z < 0) {
          color = `rgba(45, 212, 176, ${0.07 * (1 + proj.z / radius)})`;
        } else {
          // Dynamic gradient coloring based on position (globe aesthetic)
          const ratio = (p.x + radius) / (2 * radius);
          const r = Math.floor(45 + ratio * 46);   // 45 to 91
          const g = Math.floor(212 - ratio * 85);  // 212 to 127
          const b = Math.floor(176 + ratio * 79);  // 176 to 255
          color = `rgba(${r}, ${g}, ${b}, ${0.75 * proj.scale})`;
          rSize = 1.6 * proj.scale;
        }
        
        drawQueue.push({
          z: proj.z,
          draw: () => {
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(proj.x, proj.y, rSize, 0, 2 * Math.PI);
            ctx.fill();
          }
        });
      });

      // 2. Queue Ambient Particles
      particles.forEach(p => {
        const proj = project(p);
        drawQueue.push({
          z: proj.z,
          draw: () => {
            const alpha = proj.z < 0 ? 0.15 : 0.6;
            ctx.fillStyle = p.color;
            ctx.globalAlpha = alpha;
            ctx.beginPath();
            ctx.arc(proj.x, proj.y, p.size * proj.scale, 0, 2 * Math.PI);
            ctx.fill();
            ctx.globalAlpha = 1.0;
          }
        });
      });

      // 3. Queue Central AI Core
      drawQueue.push({
        z: 0,
        draw: () => {
          // Central Glowing Core
          const size = 18 + Math.sin(Date.now() * 0.002) * 2;
          const grad = ctx.createRadialGradient(cx, cy, 2, cx, cy, size * 2);
          grad.addColorStop(0, '#ffffff');
          grad.addColorStop(0.2, 'rgba(45, 212, 176, 0.8)');
          grad.addColorStop(0.5, 'rgba(59, 95, 219, 0.4)');
          grad.addColorStop(1, 'rgba(59, 95, 219, 0)');
          
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(cx, cy, size * 2, 0, 2 * Math.PI);
          ctx.fill();
          
          // Core center
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(cx, cy, 7, 0, 2 * Math.PI);
          ctx.fill();
          
          // Core border
          ctx.strokeStyle = 'rgba(45, 212, 176, 0.3)';
          ctx.lineWidth = 1;
          ctx.setLineDash([4, 4]);
          ctx.beginPath();
          ctx.arc(cx, cy, size * 1.3, 0, 2 * Math.PI);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      });

      // 4. Queue Orbits and their rotating nodes
      ORBITS.forEach(orb => {
        orb.dotProgress += orb.speed;
        
        // Calculate points of the orbit ellipse in 3D
        const orbitPoints = [];
        const numSegments = 60;
        const cosTX = Math.cos(orb.tiltX);
        const sinTX = Math.sin(orb.tiltX);
        const cosTZ = Math.cos(orb.tiltZ);
        const sinTZ = Math.sin(orb.tiltZ);
        
        for (let i = 0; i <= numSegments; i++) {
          const u = (i / numSegments) * 2 * Math.PI;
          
          // Local circle coordinates
          const lx = orb.radius * Math.cos(u);
          const lz = orb.radius * Math.sin(u);
          const ly = 0;
          
          // Rotate Z
          const rx1 = lx * cosTZ;
          const ry1 = lx * sinTZ;
          const rz1 = lz;
          
          // Rotate X
          const rx2 = rx1;
          const ry2 = ry1 * cosTX - rz1 * sinTX;
          const rz2 = ry1 * sinTX + rz1 * cosTX;
          
          orbitPoints.push({ x: rx2, y: ry2, z: rz2 });
        }
        
        // Draw the ring line (broken up into segments or a solid/dash)
        drawQueue.push({
          z: 0, // Draw orbit ring in the middle depth
          draw: () => {
            ctx.strokeStyle = orb.color;
            ctx.lineWidth = 1.0;
            ctx.setLineDash([8, 12]);
            ctx.beginPath();
            
            orbitPoints.forEach((p, idx) => {
              const proj = project(p);
              if (idx === 0) ctx.moveTo(proj.x, proj.y);
              else ctx.lineTo(proj.x, proj.y);
            });
            
            ctx.stroke();
            ctx.setLineDash([]);
          }
        });
        
        // Particle on the orbit
        const dotAngle = orb.dotProgress * 2 * Math.PI;
        const lx = orb.radius * Math.cos(dotAngle);
        const lz = orb.radius * Math.sin(dotAngle);
        
        const rx1 = lx * cosTZ;
        const ry1 = lx * sinTZ;
        const rz1 = lz;
        
        const rx2 = rx1;
        const ry2 = ry1 * cosTX - rz1 * sinTX;
        const rz2 = ry1 * sinTX + rz1 * cosTX;
        
        const dot3D = { x: rx2, y: ry2, z: rz2 };
        const dotProj = project(dot3D);
        
        drawQueue.push({
          z: dotProj.z,
          draw: () => {
            // Draw particle
            ctx.fillStyle = orb.dotColor;
            ctx.shadowBlur = 10;
            ctx.shadowColor = orb.dotColor;
            ctx.beginPath();
            ctx.arc(dotProj.x, dotProj.y, 4.5 * dotProj.scale, 0, 2 * Math.PI);
            ctx.fill();
            
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(dotProj.x, dotProj.y, 1.8 * dotProj.scale, 0, 2 * Math.PI);
            ctx.fill();
            ctx.shadowBlur = 0; // reset
          }
        });
      });

      // 5. Queue Connections (neural lines + traveling data packet)
      CONNECTIONS.forEach(conn => {
        // Draw connection line
        drawQueue.push({
          z: Math.min(project(MARKETS[conn.from]).z, project(MARKETS[conn.to]).z),
          draw: () => {
            ctx.beginPath();
            conn.points.forEach((pt, idx) => {
              const proj = project(pt);
              if (idx === 0) ctx.moveTo(proj.x, proj.y);
              else ctx.lineTo(proj.x, proj.y);
            });
            
            if (conn.type === "dashed") {
              ctx.strokeStyle = 'rgba(45, 212, 176, 0.25)';
              ctx.lineWidth = 1;
              ctx.setLineDash([3, 6]);
            } else {
              // Create dynamic gradient
              const pStart = project(conn.points[0]);
              const pEnd = project(conn.points[conn.points.length - 1]);
              const grad = ctx.createLinearGradient(pStart.x, pStart.y, pEnd.x, pEnd.y);
              grad.addColorStop(0, MARKETS[conn.from].color);
              grad.addColorStop(1, MARKETS[conn.to].color);
              
              ctx.strokeStyle = grad;
              ctx.lineWidth = 1.6;
            }
            ctx.stroke();
            ctx.setLineDash([]);
          }
        });

        // Traveling data beam dot
        conn.beamProgress += 0.008;
        if (conn.beamProgress > 1.0) conn.beamProgress = 0;
        
        const ptIndex = Math.floor(conn.beamProgress * conn.points.length);
        const pt = conn.points[Math.min(ptIndex, conn.points.length - 1)];
        const ptProj = project(pt);
        
        drawQueue.push({
          z: ptProj.z + 5, // slightly in front of the line
          draw: () => {
            // Only render if start and end locations are not too far on the back side
            const fromProj = project(MARKETS[conn.from]);
            const toProj = project(MARKETS[conn.to]);
            if (fromProj.z < -50 && toProj.z < -50) return;
            
            ctx.fillStyle = '#ffffff';
            ctx.shadowBlur = 8;
            ctx.shadowColor = '#2DD4B0';
            ctx.beginPath();
            ctx.arc(ptProj.x, ptProj.y, 3 * ptProj.scale, 0, 2 * Math.PI);
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        });
      });

      // 6. Queue Market Nodes (pulsing circles & text labels)
      MARKETS.forEach(m => {
        const proj = project(m);
        m.pulse += 0.015;
        if (m.pulse > 1.0) m.pulse = 0;
        
        drawQueue.push({
          z: proj.z + 10, // draw nodes on top of general points
          draw: () => {
            // Hide/fade out if on the back side
            if (proj.z < -40) return;
            const opacity = proj.z < 0 ? (1 + proj.z / 40) : 1.0;
            
            ctx.globalAlpha = opacity;
            
            // Pulse rings
            const maxPulseRadius = 18;
            const rPulse = m.pulse * maxPulseRadius;
            ctx.strokeStyle = m.color;
            ctx.lineWidth = 1.0;
            ctx.globalAlpha = opacity * (1 - m.pulse);
            ctx.beginPath();
            ctx.arc(proj.x, proj.y, rPulse * proj.scale, 0, 2 * Math.PI);
            ctx.stroke();
            
            if (rPulse > 4) {
              ctx.globalAlpha = opacity * 0.15;
              ctx.fillStyle = m.color;
              ctx.beginPath();
              ctx.arc(proj.x, proj.y, (rPulse - 4) * proj.scale, 0, 2 * Math.PI);
              ctx.fill();
            }
            
            // Solid center
            ctx.globalAlpha = opacity;
            ctx.fillStyle = m.color;
            ctx.shadowBlur = 12;
            ctx.shadowColor = m.color;
            ctx.beginPath();
            ctx.arc(proj.x, proj.y, 4.5 * proj.scale, 0, 2 * Math.PI);
            ctx.fill();
            
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(proj.x, proj.y, 2 * proj.scale, 0, 2 * Math.PI);
            ctx.fill();
            ctx.shadowBlur = 0;
            
            // Text Label
            ctx.fillStyle = m.color;
            ctx.font = `900 ${9 * proj.scale}px 'Outfit', sans-serif`;
            ctx.textAlign = m.labelAlign;
            ctx.textBaseline = 'middle';
            
            const tx = proj.x + m.labelOffset.x * proj.scale;
            const ty = proj.y + m.labelOffset.y * proj.scale;
            
            // Text shadow/glow
            ctx.shadowColor = 'rgba(0,0,0,0.85)';
            ctx.shadowBlur = 4;
            ctx.fillText(m.name, tx, ty);
            ctx.shadowBlur = 0;
            
            ctx.globalAlpha = 1.0;
          }
        });
      });

      // 7. Sort the draw queue by depth (painter's algorithm)
      drawQueue.sort((a, b) => a.z - b.z);
      
      // 8. Execute all draw commands
      drawQueue.forEach(item => item.draw());
      
      requestAnimationFrame(animate);
      } catch (err) {
        console.error("Globe Animation Error:", err);
      }
    }
    
    // Start animation loop
    animate();
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
