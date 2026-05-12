(function () {
  const track = document.getElementById('carousel-track');
  const dotsEl = document.getElementById('carousel-dots');
  if (!track || !dotsEl) return;

  track.innerHTML = '';
  dotsEl.innerHTML = '';

  // Webp variants (modern browsers)
  const webpModules = import.meta.glob('./photos/*.{jpg,jpeg,png,JPG,JPEG,PNG}', {
    eager: true,
    query: { as: 'metadata', format: 'webp' },
    import: 'default',
  });

  // JPEG fallback (Safari / older iOS)
  const jpegModules = import.meta.glob('./photos/*.{jpg,jpeg,png,JPG,JPEG,PNG}', {
    eager: true,
    query: { as: 'metadata', format: 'jpeg' },
    import: 'default',
  });

  const sortedKeys = Object.keys(webpModules).sort();

  sortedKeys.forEach((path, i) => {
    const webpMeta = webpModules[path];
    const jpegMeta = jpegModules[path];
    if (!webpMeta || !Array.isArray(webpMeta)) return;

    const slide = document.createElement('div');
    slide.className = `carousel-slide${i === 0 ? ' active' : ''}`;

    const picture = document.createElement('picture');

    // ── WebP source (Chrome, Firefox, modern Safari) ──
    const webpSource = document.createElement('source');
    webpSource.type = 'image/webp';
    // Set srcset BEFORE sizes (Safari quirk)
    webpSource.srcset = webpMeta.map((m) => `${m.src} ${m.width}w`).join(', ');
    webpSource.sizes = '(min-width: 768px) 50vw, 98vw';

    // ── JPEG fallback (older iOS, any browser) ──
    const img = document.createElement('img');
    img.alt = 'Gallery photo';
    img.loading = i < 2 ? 'eager' : 'lazy';
    img.decoding = 'async';

    if (jpegMeta && Array.isArray(jpegMeta)) {
      // Set srcset BEFORE src — critical for Safari
      img.srcset = jpegMeta.map((m) => `${m.src} ${m.width}w`).join(', ');
      img.sizes = '(min-width: 768px) 50vw, 98vw';
      // Use a mid-size image as src fallback (not the largest)
      const mid = jpegMeta.find((m) => m.width === 800) ?? jpegMeta[0];
      img.src = mid.src;
    } else {
      // Last resort: use webp src if no jpeg available
      const mid = webpMeta.find((m) => m.width === 800) ?? webpMeta[0];
      img.src = mid.src;
    }

    picture.appendChild(webpSource);
    picture.appendChild(img);
    slide.appendChild(picture);
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

  setInterval(() => updateState((currentIndex + 1) % slides.length), 5000);
})();
