(function () {
  const track = document.getElementById('carousel-track');
  const dotsEl = document.getElementById('carousel-dots');
  if (!track || !dotsEl) return;

  // Clear existing content for hot-reloading stability
  track.innerHTML = '';
  dotsEl.innerHTML = '';

  const imageModules = import.meta.glob('./photos/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG}', {
    eager: true,
    query: { as: 'metadata' },
    import: 'default',
  });

  const sortedKeys = Object.keys(imageModules).sort();

  sortedKeys.forEach((path, i) => {
    const meta = imageModules[path];
    if (!meta || !Array.isArray(meta)) return;

    const slide = document.createElement('div');
    slide.className = `carousel-slide ${i === 0 ? 'active' : ''}`;

    const img = document.createElement('img');

    // iPhone Fix: Provide a clean string URL for the primary src
    img.src = meta[1]?.src || meta[0].src;
    img.srcset = meta.map((m) => `${m.src} ${m.width}w`).join(', ');

    // Match CSS: 50vw on wide screens, 98vw on mobile
    img.sizes = '(min-width: 768px) 50vw, 98vw';
    img.alt = 'Gallery photo';

    // Eager load the first two slides for speed, lazy load the rest
    img.loading = i < 2 ? 'eager' : 'lazy';

    slide.appendChild(img);
    track.appendChild(slide);

    const dot = document.createElement('span');
    if (i === 0) dot.classList.add('active');
    dot.onclick = () => updateState(i);
    dotsEl.appendChild(dot);
  });

  const slides = track.querySelectorAll('.carousel-slide');
  const dots = dotsEl.querySelectorAll('span');
  let currentIndex = 0;

  function updateState(nextIndex) {
    if (currentIndex === nextIndex || !slides[nextIndex]) return;
    slides[currentIndex].classList.remove('active');
    dots[currentIndex].classList.remove('active');
    currentIndex = nextIndex;
    slides[currentIndex].classList.add('active');
    dots[currentIndex].classList.add('active');
  }

  document.getElementById('carousel-prev')?.addEventListener('click', () => {
    updateState((currentIndex - 1 + slides.length) % slides.length);
  });

  document.getElementById('carousel-next')?.addEventListener('click', () => {
    updateState((currentIndex + 1) % slides.length);
  });

  // Auto-play every 5 seconds
  setInterval(() => updateState((currentIndex + 1) % slides.length), 5000);
})();
