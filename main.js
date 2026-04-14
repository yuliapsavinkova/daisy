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

// ── carousel ──────────────────────────────────────────────
(function () {
  const track = document.getElementById('carousel-track');
  const dotsEl = document.getElementById('carousel-dots');
  if (!track) return;

  const fullModules = import.meta.glob('./photos/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG}', {
    eager: true,
  });
  const smallModules = import.meta.glob('./photos/small/*.{webp,jpg,jpeg,png,JPG,JPEG,PNG}', {
    eager: true,
  });

  if (Object.keys(fullModules).length === 0) {
    track.closest('.carousel-wrap').style.display = 'none';
    return;
  }

  const smallByFile = {};
  for (const [key, mod] of Object.entries(smallModules)) {
    smallByFile[key.split('/').pop()] = mod.default;
  }

  const SIZES = '(max-width: 540px) 98vw, clamp(300px, 90vw, 900px)';

  Object.entries(fullModules).forEach(([key, mod], i) => {
    const fullUrl = mod.default;
    const smallUrl = smallByFile[key.split('/').pop()];

    const slide = document.createElement('div');
    slide.className = 'carousel-slide';

    const img = document.createElement('img');
    img.src = fullUrl;
    img.alt = 'Pet being cared for by Yulia in California';
    img.width = 900;
    img.height = 600;

    if (smallUrl) {
      img.srcset = `${smallUrl} 450w, ${fullUrl} 900w`;
      img.sizes = SIZES;
    }

    if (i === 0) {
      img.loading = 'eager';
      img.fetchPriority = 'high';
      img.decoding = 'sync';
    } else {
      img.loading = 'lazy';
      img.decoding = 'async';
    }

    slide.appendChild(img);
    track.appendChild(slide);
  });

  const realSlides = Array.from(track.querySelectorAll('.carousel-slide'));
  const N = realSlides.length;
  if (N < 2) return;

  const cloneFirst = realSlides[0].cloneNode(true);
  const cloneLast = realSlides[N - 1].cloneNode(true);
  cloneFirst.querySelector('img').loading = 'lazy';
  cloneLast.querySelector('img').loading = 'lazy';
  track.appendChild(cloneFirst);
  track.prepend(cloneLast);

  const total = N + 2;
  track.style.width = `${total * 100}%`;
  track.querySelectorAll('.carousel-slide').forEach((s) => {
    s.style.width = `${100 / total}%`;
  });

  let pos = 1;
  let transitioning = false;

  function setPos(n, animate) {
    track.style.transition = animate ? 'transform 0.55s cubic-bezier(0.4, 0, 0.2, 1)' : 'none';
    track.style.transform = `translateX(-${(n / total) * 100}%)`;
  }
  function updateDots(realIndex) {
    dotsEl
      .querySelectorAll('span')
      .forEach((d, i) => d.classList.toggle('active', i === realIndex));
  }
  function goTo(newPos) {
    if (transitioning) return;
    transitioning = true;
    pos = newPos;
    setPos(pos, true);
    updateDots((((pos - 1) % N) + N) % N);
  }

  track.addEventListener('transitionend', () => {
    if (pos === 0) {
      pos = N;
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          setPos(pos, false);
          transitioning = false;
        }),
      );
    } else if (pos === N + 1) {
      pos = 1;
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          setPos(pos, false);
          transitioning = false;
        }),
      );
    } else {
      transitioning = false;
    }
  });

  realSlides.forEach((_, i) => {
    const dot = document.createElement('span');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goTo(i + 1));
    dotsEl.appendChild(dot);
  });

  document.getElementById('carousel-prev').addEventListener('click', () => {
    clearInterval(timer);
    goTo(pos - 1);
  });
  document.getElementById('carousel-next').addEventListener('click', () => {
    clearInterval(timer);
    goTo(pos + 1);
  });

  const timer = setInterval(() => goTo(pos + 1), 3000);
  setPos(pos, false);
})();
