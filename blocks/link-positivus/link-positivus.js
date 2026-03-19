import { decorateIcons } from '../../scripts/aem.js';

export default function decorate(block) {
  const rows = [...block.children];
  const container = document.createElement('div');
  container.className = 'link-positivus-group';

  rows.forEach((row) => {
    const cells = [...row.children];
    const variant = cells[0]?.textContent.trim().toLowerCase() || 'dark';
    const labelText = cells[1]?.textContent.trim() || '';
    const link = cells[1]?.querySelector('a') || cells[2]?.querySelector('a');
    const href = link ? link.href : '#';

    const item = document.createElement('a');
    item.className = `link-positivus-item link-positivus-${variant}`;
    item.href = href;

    const hasLabel = labelText && labelText !== href;

    if (variant.startsWith('simple')) {
      if (hasLabel) {
        const label = document.createElement('span');
        label.className = 'link-positivus-label';
        label.textContent = labelText;
        item.appendChild(label);
      }
      const arrow = document.createElement('span');
      arrow.className = 'icon icon-arrow-up-right';
      item.appendChild(arrow);
    } else {
      const circle = document.createElement('span');
      circle.className = 'link-positivus-circle';
      const arrow = document.createElement('span');
      arrow.className = 'icon icon-arrow-up-right';
      circle.appendChild(arrow);
      item.appendChild(circle);

      if (hasLabel) {
        const label = document.createElement('span');
        label.className = 'link-positivus-label';
        label.textContent = labelText;
        item.appendChild(label);
      }
    }

    container.appendChild(item);
  });

  block.textContent = '';
  block.appendChild(container);
  decorateIcons(block);
}
