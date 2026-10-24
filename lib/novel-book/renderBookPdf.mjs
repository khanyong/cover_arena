import fs from 'node:fs/promises';
import path from 'node:path';
import puppeteer from 'puppeteer-core';
import { buildBookHtml } from './bookHtml.mjs';
import { BookSnapshotError } from '../../shared/lib/novelBookSnapshot.mjs';

let cssPromise;
let activeRender = false;
export function loadBookAssetCss() {
  cssPromise ||= (async () => {
    const fontRoot = path.join(process.cwd(), 'assets/book-fonts');
    const faces = await Promise.all(['Regular', 'Bold'].map(async (weight, i) => {
      const bytes = await fs.readFile(path.join(fontRoot, `NotoSerifKR-${weight}.otf`));
      return `@font-face{font-family:'Book Serif';font-style:normal;font-weight:${i ? 700 : 400};src:url(data:font/otf;base64,${bytes.toString('base64')}) format('opentype');}`;
    }));
    const katexRoot = path.join(process.cwd(), 'node_modules/katex');
    let katex = await fs.readFile(path.join(katexRoot, 'dist/katex.min.css'), 'utf8');
    // Keep only self-contained WOFF2 sources. No renderer network dependency.
    const names = [...new Set([...katex.matchAll(/url\((fonts\/[^)]+\.woff2)\)/g)].map(match => match[1]))];
    for (const name of names) {
      const bytes = await fs.readFile(path.join(katexRoot, 'dist', name));
      katex = katex.replaceAll(`url(${name})`, `url(data:font/woff2;base64,${bytes.toString('base64')})`);
    }
    katex = katex.replace(/,url\(fonts\/[^)]+\) format\("[^"]+"\)/g, '');
    return faces.join('\n') + '\n' + katex;
  })().catch(error => { cssPromise = undefined; throw error; });
  return cssPromise;
}

export async function browserLaunchOptions() {
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    const { default: chromium } = await import('@sparticuz/chromium');
    return { executablePath: await chromium.executablePath(), args: chromium.args, headless: 'shell' };
  }
  const candidates = [process.env.BOOK_PDF_CHROME_EXECUTABLE,
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser',
    process.env.PROGRAMFILES && path.join(process.env.PROGRAMFILES, 'Google/Chrome/Application/chrome.exe'),
    process.env.LOCALAPPDATA && path.join(process.env.LOCALAPPDATA, 'Google/Chrome/Application/chrome.exe')].filter(Boolean);
  for (const executablePath of candidates) {
    try { await fs.access(executablePath); return { executablePath, headless: true, args: [] }; } catch { /* next path */ }
  }
  throw new BookSnapshotError('BOOK_CHROME_NOT_INSTALLED', 503);
}

/** An isolated browser owns this response until close(). No HTML/PDF is written to public storage. */
export async function renderBookPdf(snapshot, options, { signal } = {}) {
  if (signal?.aborted) throw new BookSnapshotError('BOOK_REQUEST_ABORTED', 504);
  // This is a process-local memory guard, not a distributed rate limiter.
  if (activeRender) throw new BookSnapshotError('BOOK_PDF_BUSY', 429);
  activeRender = true;
  let browser, closing;
  const close = () => {
    signal?.removeEventListener('abort', onAbort);
    closing ||= (browser ? browser.close() : Promise.resolve()).finally(() => { activeRender = false; });
    return closing;
  };
  const onAbort = () => { void close().catch(() => {}); };
  try {
    const html = buildBookHtml(snapshot, options, await loadBookAssetCss());
    browser = await puppeteer.launch({ ...await browserLaunchOptions(), timeout: 45000, protocolTimeout: 240000 });
    signal?.addEventListener('abort', onAbort, { once: true });
    if (signal?.aborted) throw new BookSnapshotError('BOOK_REQUEST_ABORTED', 504);
    const page = await browser.newPage();
    await page.setJavaScriptEnabled(false);
    await page.setRequestInterception(true);
    page.on('request', request => {
      // User-controlled manuscript content can never request files, internal hosts or external resources.
      if (request.url().startsWith('data:')) void request.continue();
      else void request.abort();
    });
    await page.setContent(html, { waitUntil: 'load', timeout: 120000 });
    await page.emulateMediaType('print');
    await page.evaluate(async () => { await document.fonts.ready; });
    const problems = await page.evaluate(() => ({
      blocks: document.querySelectorAll('.body-block').length,
      fontReady: document.fonts.check('11pt "Book Serif"'),
      mathErrors: document.querySelectorAll('.katex-error').length,
    }));
    if (!problems.fontReady || problems.blocks !== snapshot.counts.paragraphs) throw new BookSnapshotError('BOOK_LAYOUT_INCOMPLETE');
    // Never silently publish broken mathematical notation.
    if (problems.mathErrors) throw new BookSnapshotError('BOOK_MATH_RENDER_FAILED');
    const stream = await page.createPDFStream({ printBackground: true, preferCSSPageSize: true,
      displayHeaderFooter: true, headerTemplate: '<span></span>',
      footerTemplate: `<div style="font-family:serif;font-size:8px;width:100%;text-align:center;color:#666"><span class="pageNumber"></span> / <span class="totalPages"></span></div>`,
      tagged: true, outline: true, timeout: 180000 });
    return { stream, close, filename: `ROS-${snapshot.language.toUpperCase()}-${new Date(snapshot.capturedAt).toISOString().slice(0, 10)}-${options.pageSize}.pdf` };
  } catch (error) {
    await close().catch(() => {});
    if (signal?.aborted) throw new BookSnapshotError('BOOK_REQUEST_ABORTED', 504);
    throw error;
  }
}
