/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: wknd-trendsetters cleanup.
 * Selectors from captured DOM of https://www.wknd-trendsetters.site/blog/fashion-blog-post
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.before) {
    // Remove skip link and scripts that may interfere with parsing
    WebImporter.DOMUtils.remove(element, ['.skip-link', 'script']);
  }
  if (hookName === H.after) {
    // Remove non-authorable site chrome
    WebImporter.DOMUtils.remove(element, [
      '.navbar',
      'footer.footer',
      'footer',
      '.breadcrumbs',
      '.blog-meta',
      '.tag',
      'noscript',
      'link',
    ]);
  }
}
