import { decorateIcons } from '../../scripts/aem.js';

export default function decorate(block) {
  const rows = [...block.children];
  const container = document.createElement('div');
  container.className = 'plus-icon-group';

  rows.forEach((row) => {
    const cells = [...row.children];
    const question = cells[0]?.textContent.trim() || '';
    const answer = cells[1]?.innerHTML || '';

    const item = document.createElement('div');
    item.className = 'plus-icon-item';

    const header = document.createElement('div');
    header.className = 'plus-icon-header';

    const title = document.createElement('span');
    title.className = 'plus-icon-title';
    title.textContent = question;

    const toggle = document.createElement('button');
    toggle.className = 'plus-icon-toggle';
    toggle.setAttribute('aria-label', 'Toggle');
    toggle.innerHTML = '<span class="icon icon-plus"></span>';

    header.appendChild(title);
    header.appendChild(toggle);

    const content = document.createElement('div');
    content.className = 'plus-icon-content';
    content.innerHTML = answer;

    item.appendChild(header);
    item.appendChild(content);

    header.addEventListener('click', () => {
      const isOpen = item.classList.contains('plus-icon-open');
      item.classList.toggle('plus-icon-open');
      toggle.innerHTML = isOpen
        ? '<span class="icon icon-plus"></span>'
        : '<span class="icon icon-minus"></span>';
      decorateIcons(toggle);
    });

    container.appendChild(item);
  });

  block.textContent = '';
  block.appendChild(container);
  decorateIcons(block);
}
