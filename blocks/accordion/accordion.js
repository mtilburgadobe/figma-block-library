import { decorateIcons } from '../../scripts/aem.js';

export default function decorate(block) {
  const rows = [...block.children];
  const container = document.createElement('div');
  container.className = 'accordion-group';

  rows.forEach((row, index) => {
    const cells = [...row.children];
    const title = cells[0]?.textContent.trim() || '';
    const body = cells[1]?.innerHTML || '';
    const num = String(index + 1).padStart(2, '0');

    const item = document.createElement('div');
    item.className = 'accordion-item';

    // header row: number + title + toggle
    const header = document.createElement('div');
    header.className = 'accordion-header';

    const label = document.createElement('div');
    label.className = 'accordion-label';

    const number = document.createElement('span');
    number.className = 'accordion-number';
    number.textContent = num;

    const titleEl = document.createElement('span');
    titleEl.className = 'accordion-title';
    titleEl.textContent = title;

    label.appendChild(number);
    label.appendChild(titleEl);

    const toggle = document.createElement('button');
    toggle.className = 'accordion-toggle';
    toggle.setAttribute('aria-label', 'Toggle');
    toggle.innerHTML = '<span class="icon icon-plus"></span>';

    header.appendChild(label);
    header.appendChild(toggle);

    // body content (hidden by default)
    const content = document.createElement('div');
    content.className = 'accordion-content';

    const divider = document.createElement('hr');
    divider.className = 'accordion-divider';

    const text = document.createElement('div');
    text.className = 'accordion-body';
    text.innerHTML = body;

    content.appendChild(divider);
    content.appendChild(text);

    item.appendChild(header);
    item.appendChild(content);

    header.addEventListener('click', () => {
      const isOpen = item.classList.contains('accordion-open');
      // close all others
      container.querySelectorAll('.accordion-item.accordion-open').forEach((openItem) => {
        openItem.classList.remove('accordion-open');
        openItem.querySelector('.accordion-toggle').innerHTML = '<span class="icon icon-plus"></span>';
        decorateIcons(openItem.querySelector('.accordion-toggle'));
      });
      if (!isOpen) {
        item.classList.add('accordion-open');
        toggle.innerHTML = '<span class="icon icon-minus"></span>';
      } else {
        toggle.innerHTML = '<span class="icon icon-plus"></span>';
      }
      decorateIcons(toggle);
    });

    container.appendChild(item);
  });

  block.textContent = '';
  block.appendChild(container);
  decorateIcons(block);
}
