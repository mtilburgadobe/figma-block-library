/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero block.
 * Base: hero. Source: https://www.wknd-trendsetters.site
 * Source selector: .grid-layout (two-column grid with text + image)
 *
 * Local hero block layout: single row, two columns — text left, image right
 *   Row 1, Col 1: Heading + description paragraphs
 *   Row 1, Col 2: Image
 */
export default function parse(element, { document }) {
  // Extract image from source DOM — .cover-image or first img in grid
  const image = element.querySelector('.cover-image, img');

  // Extract heading from source DOM — h1 or h2
  const heading = element.querySelector('h1, h2, [class*="heading"]');

  // Extract all description paragraphs (not the heading)
  const paragraphs = element.querySelectorAll('p');

  // Build text content cell: heading + all paragraphs
  const contentCell = [];
  if (heading) contentCell.push(heading);
  paragraphs.forEach((p) => contentCell.push(p));

  const cells = [
    [contentCell, image],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero', cells });
  element.replaceWith(block);
}
