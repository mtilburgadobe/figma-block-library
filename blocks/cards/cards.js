import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    const cols = [...row.children];

    // Build card header (photo + name/title + social link)
    const header = document.createElement('div');
    header.className = 'cards-card-header';

    // Column 1: image
    const imageDiv = cols[0];
    if (imageDiv && imageDiv.querySelector('picture')) {
      imageDiv.className = 'cards-card-image';
    }

    // Column 2: split into info (name/title), social link, and bio
    const info = document.createElement('div');
    info.className = 'cards-card-info';
    const body = document.createElement('div');
    body.className = 'cards-card-body';
    let socialEl = null;

    if (cols[1]) {
      let afterIcon = false;
      [...cols[1].children].forEach((child) => {
        if (!afterIcon && child.querySelector('.icon')) {
          socialEl = child;
          socialEl.className = 'cards-card-social';
          afterIcon = true;
        } else if (!afterIcon) {
          info.append(child);
        } else {
          body.append(child);
        }
      });
    }

    // Assemble header: image | info | social (left to right)
    if (imageDiv) header.append(imageDiv);
    if (info.children.length) header.append(info);
    if (socialEl) header.append(socialEl);

    li.append(header);
    if (body.children.length) li.append(body);

    ul.append(li);
  });

  ul.querySelectorAll('picture > img').forEach((img) => img.closest('picture')
    .replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));

  block.replaceChildren(ul);
}
