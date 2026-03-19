export default function decorate(block) {
  const img = block.querySelector('img');
  if (img) {
    img.classList.add('logo-positivus-img');
    img.setAttribute('loading', 'eager');
  }

  const wrapper = document.createElement('div');
  wrapper.className = 'logo-positivus-wrapper';
  wrapper.append(...block.children);
  block.textContent = '';
  block.appendChild(wrapper);
}
