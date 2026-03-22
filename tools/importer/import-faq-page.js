/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroParser from './parsers/hero.js';
import accordionParser from './parsers/accordion.js';
import columnsParser from './parsers/columns.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/wknd-trendsetters-cleanup.js';
import sectionsTransformer from './transformers/wknd-trendsetters-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero': heroParser,
  'accordion': accordionParser,
  'columns': columnsParser,
};

// PAGE TEMPLATE CONFIGURATION — embedded from page-templates.json (faq-page)
const PAGE_TEMPLATE = {
  name: 'faq-page',
  description: 'FAQ page with frequently asked questions and answers',
  urls: [
    'https://www.wknd-trendsetters.site/faq',
  ],
  blocks: [
    {
      name: 'hero',
      instances: ['header .grid-layout.tablet-1-column.grid-gap-xxl'],
    },
    {
      name: 'accordion',
      instances: ['.faq-list'],
    },
    {
      name: 'columns',
      instances: ['.contact-items'],
    },
  ],
  sections: [
    {
      id: 'section-1-hero',
      name: 'Hero Section',
      selector: 'header.section.secondary-section',
      style: null,
      blocks: ['hero'],
      defaultContent: [],
    },
    {
      id: 'section-2-faq',
      name: 'FAQ Section',
      selector: ['section.section:has(.faq-list)', 'section.section:not(.secondary-section):not(.accent-section)'],
      style: null,
      blocks: ['accordion'],
      defaultContent: [],
    },
    {
      id: 'section-3-contact',
      name: 'Contact Section',
      selector: ['section.section.secondary-section:has(.contact-items)', 'section.section.secondary-section'],
      style: null,
      blocks: ['columns'],
      defaultContent: [],
    },
    {
      id: 'section-4-cta',
      name: 'CTA Section',
      selector: 'section.section.accent-section',
      style: 'accent',
      blocks: [],
      defaultContent: ['h2.h2-heading', 'p.paragraph-lg', 'a.button'],
    },
  ],
};

// TRANSFORMER REGISTRY
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = { ...payload, template: PAGE_TEMPLATE };
  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;
    const main = document.body;

    // 1. Execute beforeTransform (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      }
    });

    // 4. Execute afterTransform (final cleanup + section breaks/metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, ''),
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
