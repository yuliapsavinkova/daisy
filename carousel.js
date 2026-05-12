(function () {
  const track = document.getElementById('carousel-track');
  const dotsEl = document.getElementById('carousel-dots');
  if (!track || !dotsEl) return;

  const imageModules = import.meta.glob('./photos/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG}', {
    eager: true,
    query: { as: 'metadata' },
    import: 'default',
  });

  const sortedKeys = Object.keys(imageModules).sort();
  const total = sortedKeys.length;

  sortedKeys.forEach((path, i) => {
    const meta = imageModules[path];
    if (!meta || !Array.isArray(meta)) return;

    const slide = document.createElement('div');
    slide.className = `carousel-slide ${i === 0 ? 'active' : ''}`;

    const img = document.createElement('img');
    // Use the smallest or second-smallest image as the fallback src
    const fallback = meta[2]?.src || meta[0].src;
    img.src = fallback;
    img.srcset = meta.map((m) => `${m.src} ${m.width}w`).join(', ');

    // Desktop: 50vw | Mobile: 98vw
    img.sizes = '(min-width: 768px) 50vw, 98vw';

    img.src = meta[1]?.src || meta[0].src;
    img.alt = 'Gallery photo';
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
    slides[currentIndex].classList.remove('active');
    dots[currentIndex].classList.remove('active');
    currentIndex = nextIndex;
    slides[currentIndex].classList.add('active');
    dots[currentIndex].classList.add('active');
  }

  document
    .getElementById('carousel-prev')
    ?.addEventListener('click', () => updateState((currentIndex - 1 + total) % total));
  document
    .getElementById('carousel-next')
    ?.addEventListener('click', () => updateState((currentIndex + 1) % total));

  setInterval(() => updateState((currentIndex + 1) % total), 5000);
})();
