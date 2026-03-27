import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) {
        div.className = 'cards-card-image';
      } else {
        div.className = 'cards-card-body';
      }
    });

    // restructure for team card layout
    const image = li.querySelector('.cards-card-image');
    const body = li.querySelector('.cards-card-body');

    if (body) {
      const header = document.createElement('div');
      header.className = 'cards-card-header';

      if (image) {
        header.append(image);
      }

      const info = document.createElement('div');
      info.className = 'cards-card-info';

      // extract name (first <strong> text) and title (next sibling text)
      const nameEl = body.querySelector('strong');
      if (nameEl) {
        const namePara = nameEl.closest('p');
        const name = document.createElement('p');
        name.className = 'cards-card-name';
        name.textContent = nameEl.textContent;
        info.append(name);

        // title is the next paragraph after the name
        const titlePara = namePara?.nextElementSibling;
        if (titlePara && !titlePara.querySelector('a') && !titlePara.querySelector('strong')) {
          const title = document.createElement('p');
          title.className = 'cards-card-title';
          title.textContent = titlePara.textContent;
          info.append(title);
          titlePara.remove();
        }
        namePara.remove();
      }

      header.append(info);

      // extract social link if present (last link in body)
      const links = body.querySelectorAll('a');
      if (links.length > 0) {
        const socialLink = links[links.length - 1];
        const social = document.createElement('div');
        social.className = 'cards-card-social';
        const a = document.createElement('a');
        a.href = socialLink.href;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.setAttribute('aria-label', socialLink.textContent || 'Social profile');
        social.append(a);
        header.append(social);
        // remove the link paragraph from body
        const linkPara = socialLink.closest('p');
        if (linkPara) linkPara.remove();
      }

      const divider = document.createElement('hr');
      divider.className = 'cards-card-divider';

      // remaining body content becomes the description
      body.className = 'cards-card-description';

      li.replaceChildren(header, divider, body);
    }

    ul.append(li);
  });

  ul.querySelectorAll('picture > img').forEach((img) => {
    img.closest('picture').replaceWith(
      createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]),
    );
  });

  block.replaceChildren(ul);
}
