import puppeteer from 'puppeteer-core';
import { createHash } from 'node:crypto';
import { browserLaunchOptions } from './renderBookPdf.mjs';
import { escapeHtml } from './bookHtml.mjs';
import { BookSnapshotError } from '../../shared/lib/novelBookSnapshot.mjs';

// Send to Kindle may expose MathML's TeX annotation. Rasterize only formulas,
// retaining reflowable prose and the original review-map hashes.
export async function embedKindleMathImages(zip, { signal } = {}) {
  const chapters = [];
  const formulas = new Map();
  for (const name of Object.keys(zip.files).filter(name => /^EPUB\/chapter-.*\.xhtml$/.test(name))) {
    const html = await zip.file(name).async('string');
    chapters.push([name, html]);
    for (const [math] of html.matchAll(/<math\b[\s\S]*?<\/math>/g)) {
      if (!formulas.has(math)) formulas.set(math, { id: `math-${createHash('sha256').update(math).digest('hex').slice(0,24)}` });
    }
  }
  if (!formulas.size) return;
  const check = () => { if (signal?.aborted) throw new BookSnapshotError('BOOK_REQUEST_ABORTED', 504); };
  check();
  let browser;
  const abort = () => { void browser?.close().catch(() => {}); };
  try {
    browser = await puppeteer.launch({ ...await browserLaunchOptions(), timeout: 45000 });
    signal?.addEventListener('abort', abort, { once: true });
    check();
    const page = await browser.newPage();
    await page.setViewport({ width: 1600, height: 1000, deviceScaleFactor: 3 });
    await page.setJavaScriptEnabled(false);
    await page.setRequestInterception(true);
    page.on('request', request => { void request.abort(); });
    await page.setContent('<html><head><meta charset="utf-8"><style>body{margin:0;background:white;color:black;font-size:24px} .formula{width:max-content;padding:4px;} math{margin:0;} annotation{display:none}</style></head><body>' + [...formulas].map(([math, { id }]) => `<div class="formula" id="${id}">${math}</div>`).join('') + '</body></html>');
    await page.evaluate(async () => { await document.fonts.ready; });
    for (const [math, entry] of formulas) {
      check();
      const element = await page.$(`#${entry.id}`);
      const box = await element.boundingBox();
      if (!box || box.width > 10000 || box.height > 10000) throw new BookSnapshotError('BOOK_MATH_RENDER_FAILED');
      const alt = await element.evaluate(el => el.querySelector('annotation')?.textContent || 'Mathematical expression');
      zip.file(`EPUB/images/${entry.id}.png`, await element.screenshot({ type: 'png' }));
      const display = /display="block"/.test(math);
      entry.html = `<img class="${display ? 'math-display' : 'math-inline'}" src="images/${entry.id}.png" alt="${escapeHtml(alt)}" style="width:${(box.width / 24).toFixed(3)}em;max-width:100%;height:auto;${display ? 'display:block;margin:1em auto;' : 'vertical-align:middle;'}"/>`;
      await element.dispose();
    }
    for (const [name, html] of chapters) zip.file(name, html.replace(/<math\b[\s\S]*?<\/math>/g, math => formulas.get(math).html));
    let opf = await zip.file('EPUB/package.opf').async('string');
    opf = opf.replace(/ properties="mathml"/g, '').replace('</manifest>', [...formulas.values()].map(({ id }) => `<item id="${id}" href="images/${id}.png" media-type="image/png"/>`).join('') + '</manifest>');
    // Distinguish this rendering revision from the prior MathML publication.
    opf = opf.replace(/urn:sha256:([a-f0-9]{64})/g, (_, id) => `urn:sha256:${createHash('sha256').update(`${id}:kindle-png-math-v1`).digest('hex')}`);
    zip.file('EPUB/package.opf', opf);
    const ncx = await zip.file('EPUB/toc.ncx').async('string');
    zip.file('EPUB/toc.ncx', ncx.replace(/urn:sha256:([a-f0-9]{64})/g, (_, id) => `urn:sha256:${createHash('sha256').update(`${id}:kindle-png-math-v1`).digest('hex')}`));
  } finally {
    signal?.removeEventListener('abort', abort);
    await browser?.close();
  }
}
