var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-faq-page.js
  var import_faq_page_exports = {};
  __export(import_faq_page_exports, {
    default: () => import_faq_page_default
  });

  // tools/importer/parsers/hero.js
  function parse(element, { document }) {
    const image = element.querySelector(".cover-image, img");
    const heading = element.querySelector('h1, h2, [class*="heading"]');
    const paragraphs = element.querySelectorAll("p");
    const contentCell = [];
    if (heading) contentCell.push(heading);
    paragraphs.forEach((p) => contentCell.push(p));
    const cells = [
      [contentCell, image]
    ];
    const block = WebImporter.Blocks.createBlock(document, { name: "hero", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/accordion.js
  function parse2(element, { document }) {
    const faqItems = element.querySelectorAll("details.faq-item, details");
    const cells = [];
    faqItems.forEach((item) => {
      const summary = item.querySelector("summary");
      const questionSpan = summary ? summary.querySelector("span") : null;
      const questionText = questionSpan ? questionSpan.textContent.trim() : summary ? summary.textContent.trim() : "";
      const answerEl = item.querySelector(".faq-answer, div:not(summary)");
      const answerContent = answerEl ? answerEl.innerHTML.trim() : "";
      if (questionText) {
        const answerCell = document.createElement("div");
        answerCell.innerHTML = answerContent;
        cells.push([questionText, answerCell]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "accordion", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns.js
  function parse3(element, { document }) {
    var _a;
    const gridParent = element.closest(".grid-layout") || ((_a = element.parentElement) == null ? void 0 : _a.parentElement);
    const col1 = document.createElement("div");
    if (gridParent) {
      const textDiv = gridParent.querySelector(":scope > div:first-child");
      if (textDiv) {
        const heading = textDiv.querySelector("h2, h3");
        const para = textDiv.querySelector("p");
        if (heading) col1.appendChild(heading);
        if (para) col1.appendChild(para);
      }
    }
    const col2 = document.createElement("div");
    const contactDivs = element.querySelectorAll(":scope > div");
    contactDivs.forEach((contactDiv) => {
      const label = contactDiv.querySelector("h3, h6");
      const value = contactDiv.querySelector("a, p");
      if (label) col2.appendChild(label);
      if (value) col2.appendChild(value);
    });
    const cells = [
      [col1, col2]
    ];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/wknd-trendsetters-cleanup.js
  var H = { before: "beforeTransform", after: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === H.before) {
      WebImporter.DOMUtils.remove(element, [".skip-link", "script"]);
    }
    if (hookName === H.after) {
      WebImporter.DOMUtils.remove(element, [
        ".navbar",
        "footer.footer",
        "footer",
        ".breadcrumbs",
        ".blog-meta",
        ".tag",
        "noscript",
        "link"
      ]);
    }
  }

  // tools/importer/transformers/wknd-trendsetters-sections.js
  var H2 = { before: "beforeTransform", after: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === H2.after) {
      const { template } = payload;
      if (!template || !template.sections || template.sections.length < 2) return;
      const document = element.ownerDocument;
      const sections = [...template.sections].reverse();
      for (const section of sections) {
        const selectorList = Array.isArray(section.selector) ? section.selector : [section.selector];
        let sectionEl = null;
        for (const sel of selectorList) {
          sectionEl = element.querySelector(sel);
          if (sectionEl) break;
        }
        if (!sectionEl) continue;
        if (section.style) {
          const metaBlock = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.append(metaBlock);
        }
        if (section.id !== template.sections[0].id && sectionEl.previousElementSibling) {
          const hr = document.createElement("hr");
          sectionEl.before(hr);
        }
      }
    }
  }

  // tools/importer/import-faq-page.js
  var parsers = {
    "hero": parse,
    "accordion": parse2,
    "columns": parse3
  };
  var PAGE_TEMPLATE = {
    name: "faq-page",
    description: "FAQ page with frequently asked questions and answers",
    urls: [
      "https://www.wknd-trendsetters.site/faq"
    ],
    blocks: [
      {
        name: "hero",
        instances: ["header .grid-layout.tablet-1-column.grid-gap-xxl"]
      },
      {
        name: "accordion",
        instances: [".faq-list"]
      },
      {
        name: "columns",
        instances: [".contact-items"]
      }
    ],
    sections: [
      {
        id: "section-1-hero",
        name: "Hero Section",
        selector: "header.section.secondary-section",
        style: null,
        blocks: ["hero"],
        defaultContent: []
      },
      {
        id: "section-2-faq",
        name: "FAQ Section",
        selector: ["section.section:has(.faq-list)", "section.section:not(.secondary-section):not(.accent-section)"],
        style: null,
        blocks: ["accordion"],
        defaultContent: []
      },
      {
        id: "section-3-contact",
        name: "Contact Section",
        selector: ["section.section.secondary-section:has(.contact-items)", "section.section.secondary-section"],
        style: null,
        blocks: ["columns"],
        defaultContent: []
      },
      {
        id: "section-4-cta",
        name: "CTA Section",
        selector: "section.section.accent-section",
        style: "accent",
        blocks: [],
        defaultContent: ["h2.h2-heading", "p.paragraph-lg", "a.button"]
      }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
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
            section: blockDef.section || null
          });
        });
      });
    });
    return pageBlocks;
  }
  var import_faq_page_default = {
    transform: (payload) => {
      const { document, url, html, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_faq_page_exports);
})();
