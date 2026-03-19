export default function decorate(block) {
  const rows = [...block.children];
  const container = document.createElement('div');
  container.className = 'heading-positivus-group';

  rows.forEach((row) => {
    const cells = [...row.children];
    const variant = cells[0]?.textContent.trim().toLowerCase() || 'green';
    const text = cells[1]?.textContent.trim() || cells[0]?.textContent.trim() || '';

    const item = document.createElement('div');
    item.className = `heading-positivus-item heading-positivus-${variant}`;

    const h2 = document.createElement('h2');
    h2.className = 'heading-positivus-highlight';
    h2.textContent = text;

    item.appendChild(h2);
    container.appendChild(item);
  });

  block.textContent = '';
  block.appendChild(container);
}
