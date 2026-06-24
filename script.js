// ---------- Starfield ----------
  const canvas = document.getElementById('stars');
  const ctx = canvas.getContext('2d');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let stars = [];

  function resize(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const count = Math.floor((canvas.width * canvas.height) / 9000);
    stars = Array.from({length: count}, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.3 + 0.3,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.015 + 0.005
    }));
  }

  function drawStars(t){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#eef1f8';
    stars.forEach(s => {
      const twinkle = reducedMotion ? 0.7 : 0.5 + Math.sin(t * s.speed + s.phase) * 0.5;
      ctx.globalAlpha = 0.25 + twinkle * 0.6;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
  }

  function loop(t){
    drawStars(t || 0);
    if(!reducedMotion) requestAnimationFrame(loop);
  }

  window.addEventListener('resize', resize);
  resize();
  if(reducedMotion){ drawStars(0); } else { requestAnimationFrame(loop); }

  // ---------- Rail nav: scroll progress + active section ----------
  const railFill = document.getElementById('railFill');
  const railDots = document.querySelectorAll('.rail-dot');
  const sections = document.querySelectorAll('main section');

  function updateRailProgress(){
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0;
    if(railFill) railFill.style.height = (progress * 100) + '%';
  }
  window.addEventListener('scroll', updateRailProgress, { passive: true });
  updateRailProgress();

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        railDots.forEach(dot => {
          dot.classList.toggle('active', dot.dataset.section === entry.target.id);
        });
      }
    });
  }, { rootMargin: '-45% 0px -45% 0px' });
  sections.forEach(s => navObserver.observe(s));

  // ---------- Reveal on scroll ----------
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
