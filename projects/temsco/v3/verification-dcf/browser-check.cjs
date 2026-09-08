const { chromium } = require('/Users/M2proMini/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs = require('node:fs');
const path = require('node:path');

// A fresh temporary Chrome profile is created and removed by Playwright.
// No existing user profile, cookies, or authenticated browser is opened.
(async () => {
  const route = process.argv[2] || '/temsco/deck';
  const prefix = process.argv[3] || 'before-final';
  if (!/^\/temsco(?:\/[-a-z0-9]+)?$/.test(route)) throw new Error('Only TEMSCO local pages are supported');
  if (!/^[a-zA-Z0-9_-]+$/.test(prefix)) throw new Error('Invalid output prefix');
  const output = __dirname;
  const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1100 }, deviceScaleFactor: 1 });
    const page = await context.newPage();
    const errors = [];
    const consoleErrors = [];
    const consoleErrorDetails = [];
    const failedResponses = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('console', m => { if (m.type() === 'error') { consoleErrors.push(m.text()); consoleErrorDetails.push({text:m.text(), location:m.location()}); } });
    page.on('response', r => { if (r.status() >= 400) failedResponses.push({ status: r.status(), url: r.url() }); });
    const response = await page.goto(`http://localhost:3000${route}`, { waitUntil: 'networkidle', timeout: 45000 });
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: path.join(output, `${prefix}.png`), fullPage: true });
    const summary = await page.evaluate(() => ({
      title: document.title,
      slides: document.querySelectorAll('.temsco-slide, .v3-slide').length,
      bodyWidth: document.body.scrollWidth,
      viewportWidth: innerWidth,
      headings: [...document.querySelectorAll('h1,h2')].map(e => e.textContent.trim()),
      bodyFont: getComputedStyle(document.body).fontFamily,
      slideFont: document.querySelector('section.temsco-slide') ? getComputedStyle(document.querySelector('section.temsco-slide')).fontFamily : null,
      notoSansKRReady: document.fonts.check('16px "Noto Sans KR"'),
      fontStatus: document.fonts.status,
      pageText: document.body.innerText,
    }));
    const result = { route, httpStatus: response.status(), errors, ...summary };
    if (route === '/temsco/deck-v3') {
      result.consoleErrors = consoleErrors;
      result.consoleErrorDetails = consoleErrorDetails;
      result.failedResponses = failedResponses;
      result.slideChecks = [];
      for (let number = 1; number <= summary.slides; number++) {
        await page.getByLabel('슬라이드 선택', { exact: true }).selectOption(String(number - 1));
        const section = page.locator(`#slide-${number} section.temsco-slide`);
        await section.waitFor({ state: 'visible' });
        await section.screenshot({ path: path.join(output, `slide-${String(number).padStart(2, '0')}.png`) });
        const geometry = await section.evaluate(slide => {
          const bounds = slide.getBoundingClientRect();
          const content = slide.querySelector('[class*="content"]');
          const footer = slide.querySelector('footer');
          const footBounds = footer?.getBoundingClientRect();
          const contentBounds = content?.getBoundingClientRect();
          const children = content ? [...content.querySelectorAll('*')].filter(e => getComputedStyle(e).display !== 'none' && e.getBoundingClientRect().height) : [];
          const childBottom = children.length ? Math.max(...children.map(e => e.getBoundingClientRect().bottom)) : contentBounds?.bottom;
          const overflowText = [];
          const footerOverlap = [];
          const walker = document.createTreeWalker(slide, NodeFilter.SHOW_TEXT);
          let node;
          while ((node = walker.nextNode())) {
            if (!node.textContent.trim() || node.parentElement.closest('svg')) continue;
            const range = document.createRange(); range.selectNodeContents(node);
            for (const rect of range.getClientRects()) {
              if (!rect.width || !rect.height) continue;
              if (rect.left < bounds.left - 1 || rect.right > bounds.right + 1 || rect.top < bounds.top - 1 || rect.bottom > bounds.bottom + 1) overflowText.push(node.textContent.trim());
              if (footBounds && content?.contains(node) && rect.bottom > footBounds.top + 1) footerOverlap.push(node.textContent.trim());
            }
          }
          return { width: bounds.width, height: bounds.height, contentBottom: contentBounds?.bottom, deepestChildBottom: childBottom, footerTop: footBounds?.top, contentIntrudesFooter: !!(childBottom && footBounds && childBottom > footBounds.top + 1), overflowText: [...new Set(overflowText)], footerOverlap: [...new Set(footerOverlap)] };
        });
        result.slideChecks.push({ number, ...geometry });
      }
      const current = () => page.getByLabel('슬라이드 선택', { exact: true }).inputValue();
      await page.evaluate(() => document.activeElement.blur());
      await page.keyboard.press('Home');
      const home = await current();
      await page.keyboard.press('ArrowRight');
      const right = await current();
      await page.keyboard.press('PageDown');
      const down = await current();
      await page.keyboard.press('ArrowLeft');
      const left = await current();
      await page.keyboard.press('End');
      const end = await current();
      result.keyboard = { home, right, down, left, end, pass: home === '0' && right === '1' && down === '2' && left === '1' && end === String(summary.slides - 1) };
      await page.getByRole('button', { name: '전체 보기', exact: true }).click();
      result.scrollMode = { visibleSlides: await page.locator('section.temsco-slide:visible').count() };
      await page.getByRole('button', { name: '발표 보기', exact: true }).click();
      await page.goto('http://localhost:3000/temsco/deck-v3#slide-12', { waitUntil: 'networkidle' });
      await page.waitForFunction(() => document.querySelector('select[aria-label="슬라이드 선택"]')?.value === '11');
      result.directHash = { selection: await current(), visibleSlides: await page.locator('section.temsco-slide:visible').count(), slide12Visible: await page.locator('#slide-12 section').isVisible() };
      await page.getByRole('button', { name: '전체화면', exact: true }).click();
      result.fullscreen = await page.evaluate(() => !!document.fullscreenElement);
      if (result.fullscreen) await page.getByRole('button', { name: '전체화면 종료', exact: true }).click();
      await page.emulateMedia({ media: 'print' });
      result.print = { visibleSlides: await page.locator('section.temsco-slide:visible').count(), footerValues: await page.locator('section.temsco-slide footer b').allTextContents(), slideBounds: await page.locator('section.temsco-slide').evaluateAll(slides => slides.map(slide => { const r = slide.getBoundingClientRect(); return { width: r.width, height: r.height, top: r.top }; })) };
      await page.pdf({ path: path.join(output, 'preview.pdf'), preferCSSPageSize: true, printBackground: true, displayHeaderFooter: false, margin: { top: 0, right: 0, bottom: 0, left: 0 } });
      await page.emulateMedia({ media: 'screen' });
      await page.setViewportSize({ width: 390, height: 844 });
      await page.getByLabel('슬라이드 선택', { exact: true }).selectOption('0');
      await page.screenshot({ path: path.join(output, 'mobile.png'), fullPage: true });
      result.mobile = await page.evaluate(() => ({ scrollWidth: document.documentElement.scrollWidth, viewportWidth: innerWidth }));
      result.checkedAt = new Date().toISOString();
    }
    fs.writeFileSync(path.join(output, `${prefix}.json`), JSON.stringify(result, null, 2));
    console.log(JSON.stringify({ route, httpStatus: result.httpStatus, title: result.title, errors, slides: result.slides, screenshot: path.join(output, `${prefix}.png`) }));
    await context.close();
  } finally {
    await browser.close();
  }
})().catch(e => { console.error(e); process.exitCode = 1; });
