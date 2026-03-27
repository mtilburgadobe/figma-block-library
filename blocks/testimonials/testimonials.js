export default function decorate(block) {
  const slides = [...block.children];
  let currentSlide = 0;

  // build carousel track
  const track = document.createElement('div');
  track.className = 'testimonials-track';

  slides.forEach((row) => {
    const slide = document.createElement('div');
    slide.className = 'testimonials-slide';

    const cells = [...row.children];
    const quoteCell = cells[0];
    const authorCell = cells[1];

    // quote bubble
    const bubble = document.createElement('div');
    bubble.className = 'testimonials-bubble';
    const quote = document.createElement('p');
    quote.className = 'testimonials-quote';
    quote.textContent = quoteCell?.textContent?.trim() || '';
    bubble.append(quote);
    slide.append(bubble);

    // author info
    if (authorCell) {
      const author = document.createElement('div');
      author.className = 'testimonials-author';
      const lines = authorCell.textContent.trim().split('\n').filter(Boolean);
      if (lines.length > 0) {
        const name = document.createElement('p');
        name.className = 'testimonials-name';
        name.textContent = lines[0].trim();
        author.append(name);
      }
      if (lines.length > 1) {
        const title = document.createElement('p');
        title.className = 'testimonials-title';
        title.textContent = lines.slice(1).join(' ').trim();
        author.append(title);
      }
      slide.append(author);
    }

    track.append(slide);
  });

  // navigation
  const nav = document.createElement('div');
  nav.className = 'testimonials-nav';

  const prevBtn = document.createElement('button');
  prevBtn.className = 'testimonials-prev';
  prevBtn.setAttribute('aria-label', 'Previous testimonial');
  prevBtn.innerHTML = '&#8592;';

  const nextBtn = document.createElement('button');
  nextBtn.className = 'testimonials-next';
  nextBtn.setAttribute('aria-label', 'Next testimonial');
  nextBtn.innerHTML = '&#8594;';

  const dots = document.createElement('div');
  dots.className = 'testimonials-dots';

  function goToSlide(index) {
    currentSlide = index;
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    dots.querySelectorAll('.testimonials-dot').forEach((d, i) => {
      d.classList.toggle('active', i === currentSlide);
    });
  }

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = `testimonials-dot${i === 0 ? ' active' : ''}`;
    dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
    dot.addEventListener('click', () => goToSlide(i));
    dots.append(dot);
  });

  nav.append(prevBtn, dots, nextBtn);

  prevBtn.addEventListener('click', () => {
    goToSlide(currentSlide > 0 ? currentSlide - 1 : slides.length - 1);
  });

  nextBtn.addEventListener('click', () => {
    goToSlide(currentSlide < slides.length - 1 ? currentSlide + 1 : 0);
  });

  block.replaceChildren(track, nav);
}
