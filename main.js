(() => {
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.dot');
  const counter = document.getElementById('counter');
  const progress = document.getElementById('progress');
  const btnLeft = document.getElementById('btnLeft');
  const btnRight = document.getElementById('btnRight');
  const total = slides.length;
  let current = 0;
  let animating = false;

  // Immediately show slide 0 on load — no black screen
  slides[0].classList.add('active');
  updateUI();

  function goTo(index) {
    if (animating || index === current || index < 0 || index >= total) return;
    animating = true;

    const prev = slides[current];
    const next = slides[index];
    const goingForward = index > current;

    // Remove active from previous
    prev.classList.remove('active');
    prev.classList.add(goingForward ? 'exit-left' : 'exit-right');

    // Set initial position for incoming slide
    next.style.transition = 'none';
    next.style.transform = goingForward ? 'translateX(60px)' : 'translateX(-60px)';
    next.style.opacity = '0';
    next.offsetHeight; // force reflow

    // Animate in
    next.style.transition = '';
    next.classList.add('active');
    next.style.transform = '';
    next.style.opacity = '';

    current = index;
    updateUI();

    setTimeout(() => {
      prev.classList.remove('exit-left', 'exit-right');
      prev.style.transform = '';
      prev.style.opacity = '';
      animating = false;
    }, 550);
  }

  function next() { if (current < total - 1) goTo(current + 1); }
  function prev() { if (current > 0) goTo(current - 1); }

  function updateUI() {
    const c = String(current + 1).padStart(2, '0');
    const t = String(total).padStart(2, '0');
    counter.innerHTML = '<span class="current">' + c + '</span> / ' + t;
    progress.style.width = ((current + 1) / total * 100) + '%';
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
    btnLeft.disabled = (current === 0);
    btnRight.disabled = (current === total - 1);
  }

  // Arrow buttons
  btnLeft.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); prev(); });
  btnRight.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); next(); });

  // Keyboard
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); next(); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
  });

  // Dots
  dots.forEach((d, i) => {
    d.addEventListener('click', (e) => { e.preventDefault(); goTo(i); });
  });

  // Touch swipe
  let touchX = 0;
  document.addEventListener('touchstart', (e) => { touchX = e.touches[0].clientX; });
  document.addEventListener('touchend', (e) => {
    const diff = touchX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { diff > 0 ? next() : prev(); }
  });
})();
