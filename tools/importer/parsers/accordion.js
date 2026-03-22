/* eslint-disable */
/* global WebImporter */

/**
 * Parser for accordion block.
 * Base: accordion. Source: https://www.wknd-trendsetters.site/faq
 * Source selector: .faq-list (contains details.faq-item elements)
 *
 * Accordion block layout: 2 columns, multiple rows
 *   Each row: [title text, answer text]
 *   Source uses <details> with <summary> for question and <div class="faq-answer"> for answer
 */
export default function parse(element, { document }) {
  // Extract all FAQ items from source DOM
  const faqItems = element.querySelectorAll('details.faq-item, details');

  const cells = [];

  faqItems.forEach((item) => {
    // Extract question text from summary > span or summary directly
    const summary = item.querySelector('summary');
    const questionSpan = summary ? summary.querySelector('span') : null;
    const questionText = questionSpan
      ? questionSpan.textContent.trim()
      : (summary ? summary.textContent.trim() : '');

    // Extract answer content from .faq-answer or the content after summary
    const answerEl = item.querySelector('.faq-answer, div:not(summary)');
    const answerContent = answerEl ? answerEl.innerHTML.trim() : '';

    if (questionText) {
      const answerCell = document.createElement('div');
      answerCell.innerHTML = answerContent;
      cells.push([questionText, answerCell]);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'accordion', cells });
  element.replaceWith(block);
}
