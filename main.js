// ── plan selector prefill ────────────────────────────────
document.querySelectorAll('a[data-plan]').forEach((btn) => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('plan').value = btn.dataset.plan;
    document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => document.getElementById('message').focus(), 600);
  });
});

// ── select: gold placeholder → ink after selection ────────
const planSelect = document.getElementById('plan');
if (planSelect) {
  planSelect.addEventListener('change', () => planSelect.classList.add('has-value'));
}

// ── infinite carousel ─────────────────────────────────────
(function () {
  const track = document.getElementById('carousel-track');
  const dotsEl = document.getElementById('carousel-dots');
  if (!track) return;

  const realSlides = Array.from(track.querySelectorAll('.carousel-slide'));
  const N = realSlides.length;
  if (N < 2) return;

  // Clone first and last slide for seamless wrap
  const cloneFirst = realSlides[0].cloneNode(true);
  const cloneLast = realSlides[N - 1].cloneNode(true);
  track.appendChild(cloneFirst); // position N+1 → wraps to 1
  track.prepend(cloneLast); // position 0  → wraps to N

  // Total slides = N + 2, each takes 1/(N+2) of track width
  const total = N + 2;
  track.style.width = `${total * 100}%`;
  track.querySelectorAll('.carousel-slide').forEach((s) => {
    s.style.width = `${100 / total}%`;
  });

  // Start at position 1 (first real slide, index 0 is the clone-last)
  let pos = 1;
  let transitioning = false;

  function setPos(n, animate) {
    track.style.transition = animate ? 'transform 0.55s cubic-bezier(0.4, 0, 0.2, 1)' : 'none';
    track.style.transform = `translateX(-${(n / total) * 100}%)`;
  }

  function updateDots(realIndex) {
    dotsEl.querySelectorAll('span').forEach((d, i) => {
      d.classList.toggle('active', i === realIndex);
    });
  }

  function goTo(newPos) {
    if (transitioning) return;
    transitioning = true;
    pos = newPos;
    setPos(pos, true);
    updateDots((pos - 1 + N) % N);
  }

  // After transition ends, silently jump if on a clone
  track.addEventListener('transitionend', () => {
    transitioning = false;
    if (pos === 0) {
      pos = N;
      setPos(pos, false);
    } else if (pos === N + 1) {
      pos = 1;
      setPos(pos, false);
    }
  });

  // Build dots
  realSlides.forEach((_, i) => {
    const dot = document.createElement('span');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goTo(i + 1));
    dotsEl.appendChild(dot);
  });

  // Buttons
  document.getElementById('carousel-prev').addEventListener('click', () => {
    clearInterval(timer);
    goTo(pos - 1);
  });
  document.getElementById('carousel-next').addEventListener('click', () => {
    clearInterval(timer);
    goTo(pos + 1);
  });

  // Auto-advance every 3 seconds, pause on manual interaction
  const timer = setInterval(() => goTo(pos + 1), 3000);

  // Start position
  setPos(pos, false);
})();
