export default function decorate(block) {
  const rows = [...block.children];
  const container = document.createElement('div');
  container.className = 'button-positivus-container';

  rows.forEach((row) => {
    const cells = [...row.children];
    const variant = cells[0]?.textContent.trim().toLowerCase() || 'primary';
    const label = cells[1]?.textContent.trim() || '';
    const link = cells[1]?.querySelector('a');

    const btn = document.createElement('a');
    btn.className = `button ${variant}`;
    btn.href = link ? link.href : '#';
    btn.textContent = label || (link ? link.textContent : 'Button');
    container.appendChild(btn);
  });

  block.textContent = '';
  block.appendChild(container);
}
