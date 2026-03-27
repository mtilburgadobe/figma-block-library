export default function decorate(block) {
  const items = [...block.children];
  const list = document.createElement('div');
  list.className = 'case-studies-list';

  items.forEach((row, i) => {
    const item = document.createElement('div');
    item.className = 'case-studies-item';

    // first cell is the description text, second (optional) is the link
    const cells = [...row.children];
    const textCell = cells[0];
    const linkCell = cells[1];

    const desc = document.createElement('p');
    desc.className = 'case-studies-description';
    desc.textContent = textCell?.textContent?.trim() || '';
    item.append(desc);

    if (linkCell) {
      const link = linkCell.querySelector('a') || document.createElement('a');
      if (!link.href && linkCell.textContent.trim()) {
        link.href = '#';
        link.textContent = linkCell.textContent.trim();
      }
      link.className = 'case-studies-link';
      item.append(link);
    }

    list.append(item);

    // add vertical divider between items (not after last)
    if (i < items.length - 1) {
      const divider = document.createElement('div');
      divider.className = 'case-studies-divider';
      list.append(divider);
    }
  });

  block.replaceChildren(list);
}
