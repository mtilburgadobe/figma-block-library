const GAP = 50;

function getSlideOffset(block, track, index) {
  const slide = track.children[index];
  if (!slide) return 0;
  const slideWidth = slide.offsetWidth;
  const containerWidth = block.offsetWidth;
  const slideLeft = index * (slideWidth + GAP);
  return -(slideLeft - (containerWidth / 2) + (slideWidth / 2));
}

export default function decorate(block) {
  const rows = [...block.children];

  // Build slides from rows
  const track = document.createElement('div');
  track.className = 'carousel-track';

  rows.forEach((row) => {
    const cells = [...row.children];
    const quote = cells[0]?.innerHTML.trim() || '';
    const attribution = cells[1];

    const slide = document.createElement('div');
    slide.className = 'carousel-slide';

    // Speech bubble
    const bubble = document.createElement('div');
    bubble.className = 'carousel-bubble';

    const quoteEl = document.createElement('div');
    quoteEl.className = 'carousel-quote';
    quoteEl.innerHTML = quote;

    bubble.appendChild(quoteEl);
    slide.appendChild(bubble);

    // Attribution (name + title)
    if (attribution) {
      const attr = document.createElement('div');
      attr.className = 'carousel-attribution';

      const lines = attribution.textContent.trim().split('\n').map((l) => l.trim()).filter(Boolean);
      if (lines.length >= 1) {
        const name = document.createElement('p');
        name.className = 'carousel-name';
        [name.textContent] = lines;
        attr.appendChild(name);
      }
      if (lines.length >= 2) {
        const title = document.createElement('p');
        title.className = 'carousel-title';
        title.textContent = lines.slice(1).join(', ');
        attr.appendChild(title);
      }
      slide.appendChild(attr);
    }

    track.appendChild(slide);
  });

  // Navigation
  const nav = document.createElement('div');
  nav.className = 'carousel-nav';

  const prevBtn = document.createElement('button');
  prevBtn.className = 'carousel-arrow carousel-prev';
  prevBtn.setAttribute('aria-label', 'Previous testimonial');
  prevBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="white" stroke-width="2"/></svg>';

  const nextBtn = document.createElement('button');
  nextBtn.className = 'carousel-arrow carousel-next';
  nextBtn.setAttribute('aria-label', 'Next testimonial');
  nextBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="white" stroke-width="2"/></svg>';

  const dots = document.createElement('div');
  dots.className = 'carousel-dots';
  rows.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = `carousel-dot${i === 0 ? ' active' : ''}`;
    dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
    dots.appendChild(dot);
  });

  nav.appendChild(prevBtn);
  nav.appendChild(dots);
  nav.appendChild(nextBtn);

  // Assemble block
  block.textContent = '';
  block.appendChild(track);
  block.appendChild(nav);

  // Carousel state
  let current = 0;
  const total = rows.length;

  function updateSlide() {
    const offset = getSlideOffset(block, track, current);
    track.style.transform = `translateX(${offset}px)`;
    dots.querySelectorAll('.carousel-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  // Set initial position after layout
  requestAnimationFrame(() => updateSlide());

  prevBtn.addEventListener('click', () => {
    current = (current - 1 + total) % total;
    updateSlide();
  });

  nextBtn.addEventListener('click', () => {
    current = (current + 1) % total;
    updateSlide();
  });

  dots.querySelectorAll('.carousel-dot').forEach((dot, i) => {
    dot.addEventListener('click', () => {
      current = i;
      updateSlide();
    });
  });

  // Recalculate on resize
  window.addEventListener('resize', () => updateSlide());

  // Touch / swipe support
  let startX = 0;
  let startY = 0;
  let isDragging = false;

  track.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    isDragging = true;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    if (!isDragging) return;
    isDragging = false;
    const dx = e.changedTouches[0].clientX - startX;
    const dy = e.changedTouches[0].clientY - startY;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
      if (dx < 0) {
        current = (current + 1) % total;
      } else {
        current = (current - 1 + total) % total;
      }
      updateSlide();
    }
  }, { passive: true });
}
