/**
 * ── clean-code carousel engine ──────────────────────────
 * Focuses on state management rather than coordinate math.
 */

(function () {
  const track = document.getElementById('carousel-track');
  const dotsEl = document.getElementById('carousel-dots');
  if (!track) return;

  // Asset Loading
  const fullModules = import.meta.glob('./photos/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG}', {
    eager: true,
  });
  const smallModules = import.meta.glob('./photos/small/*.{webp,jpg,jpeg,png,JPG,JPEG,PNG}', {
    eager: true,
  });

  const sortedKeys = Object.keys(fullModules).sort();
  if (sortedKeys.length === 0) {
    track.closest('.carousel-wrap').style.display = 'none';
    return;
  }

  const smallByFile = {};
  for (const [key, mod] of Object.entries(smallModules)) {
    smallByFile[key.split('/').pop()] = mod.default;
  }

  const SIZES = '(max-width: 540px) 98vw, clamp(300px, 90vw, 900px)';
  let currentIndex = 0;
  const total = sortedKeys.length;

  // 1. DOM Initialization
  sortedKeys.forEach((path, i) => {
    const fileName = path.split('/').pop();

    // Slide creation
    const slide = document.createElement('div');
    slide.className = `carousel-slide ${i === 0 ? 'active' : ''}`;

    const img = document.createElement('img');
    img.src = fullModules[path].default;
    img.alt = 'Portfolio Highlight';
    if (smallByFile[fileName]) {
      img.srcset = `${smallByFile[fileName]} 450w, ${fullModules[path].default} 900w`;
      img.sizes = SIZES;
    }
    img.loading = i === 0 ? 'eager' : 'lazy'; // Performance optimization

    slide.appendChild(img);
    track.appendChild(slide);

    // Dot creation
    const dot = document.createElement('span');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => {
      resetTimer();
      updateState(i);
    });
    dotsEl.appendChild(dot);
  });

  const slides = track.querySelectorAll('.carousel-slide');
  const dots = dotsEl.querySelectorAll('span');

  // 2. State Management
  function updateState(nextIndex) {
    if (nextIndex === currentIndex) return;

    slides[currentIndex].classList.remove('active');
    dots[currentIndex].classList.remove('active');

    currentIndex = nextIndex;

    slides[currentIndex].classList.add('active');
    dots[currentIndex].classList.add('active');
  }

  // 3. Event Listeners
  document.getElementById('carousel-prev').addEventListener('click', () => {
    resetTimer();
    const next = (currentIndex - 1 + total) % total;
    updateState(next);
  });

  document.getElementById('carousel-next').addEventListener('click', () => {
    resetTimer();
    const next = (currentIndex + 1) % total;
    updateState(next);
  });

  // 4. Automation
  let autoTimer = setInterval(() => updateState((currentIndex + 1) % total), 5000);

  function resetTimer() {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => updateState((currentIndex + 1) % total), 5000);
  }
})();

// ── Existing form logic remains untouched ──
const planSelect = document.getElementById('plan');
if (planSelect) {
  planSelect.addEventListener('change', () => planSelect.classList.add('has-value'));
}

document.querySelectorAll('a[data-plan]').forEach((btn) => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('plan').value = btn.dataset.plan;
    document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => document.getElementById('message').focus(), 600);
  });
});
