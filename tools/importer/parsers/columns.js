/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns block.
 * Base: columns. Source: https://www.wknd-trendsetters.site/faq
 * Source selector: .contact-items (inside grid-layout with text + contact info)
 *
 * Columns block layout: 1 row, 2 columns
 *   Row 1, Col 1: Heading + description paragraph
 *   Row 1, Col 2: Contact details (email, phone, address)
 *
 * Source DOM: .grid-layout > div (text) + div > .contact-items
 * Parser receives .contact-items, navigates up to get text sibling.
 */
export default function parse(element, { document }) {
  // Navigate up to the grid-layout to find both columns
  const gridParent = element.closest('.grid-layout') || element.parentElement?.parentElement;

  // Col 1: text column (heading + paragraph) — first child div of grid
  const col1 = document.createElement('div');
  if (gridParent) {
    const textDiv = gridParent.querySelector(':scope > div:first-child');
    if (textDiv) {
      const heading = textDiv.querySelector('h2, h3');
      const para = textDiv.querySelector('p');
      if (heading) col1.appendChild(heading);
      if (para) col1.appendChild(para);
    }
  }

  // Col 2: contact details from .contact-items children
  const col2 = document.createElement('div');
  const contactDivs = element.querySelectorAll(':scope > div');
  contactDivs.forEach((contactDiv) => {
    const label = contactDiv.querySelector('h3, h6');
    const value = contactDiv.querySelector('a, p');
    if (label) col2.appendChild(label);
    if (value) col2.appendChild(value);
  });

  const cells = [
    [col1, col2],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns', cells });
  element.replaceWith(block);
}
