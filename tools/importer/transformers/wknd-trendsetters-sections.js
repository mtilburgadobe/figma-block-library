/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: wknd-trendsetters sections.
 * Adds section breaks between template sections.
 * Selectors from captured DOM of https://www.wknd-trendsetters.site/blog/fashion-blog-post
 *
 * Live DOM sections:
 *   1. Hero Section — section:has(.grid-layout) (first section, no <hr> before)
 *   2. Blog Content Section — section:has(.blog-content) (<hr> before)
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.after) {
    const { template } = payload;
    if (!template || !template.sections || template.sections.length < 2) return;

    const document = element.ownerDocument;

    // Process sections in reverse order to preserve DOM positions
    const sections = [...template.sections].reverse();
    for (const section of sections) {
      const selectorList = Array.isArray(section.selector) ? section.selector : [section.selector];
      let sectionEl = null;
      for (const sel of selectorList) {
        sectionEl = element.querySelector(sel);
        if (sectionEl) break;
      }
      if (!sectionEl) continue;

      // Add section-metadata block if section has a style
      if (section.style) {
        const metaBlock = WebImporter.Blocks.createBlock(document, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        sectionEl.append(metaBlock);
      }

      // Add <hr> before non-first sections (when there is content before)
      if (section.id !== template.sections[0].id && sectionEl.previousElementSibling) {
        const hr = document.createElement('hr');
        sectionEl.before(hr);
      }
    }
  }
}
