import { createHash } from 'node:crypto'
import { mkdir, rename, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { validateChromiumPdf } from '../../lib/temsco/pdf-artifact.mjs'

export function localPreviewOrigin(value) {
  const origin = new URL(value)
  if (!['localhost', '127.0.0.1', '[::1]'].includes(origin.hostname) || origin.protocol !== 'http:' || origin.username || origin.password) {
    throw new Error('Preview URL must be a local http origin.')
  }
  return origin.origin
}

/** Shared browser/print plumbing; each caller supplies its own route and source hash. */
export async function exportDeckPdf(config) {
  const root = process.cwd()
  const { label, getSourceHash, verifyArtifact, artifactDirectory, prefix, route, containerSelector, slideSelector } = config
  if (process.argv.includes('--check')) {
    const artifact = verifyArtifact(root)
    console.log(`${label} PDF verified: ${artifact.pageCount} pages · ${artifact.sourceHash}`)
    return
  }
  const origin = localPreviewOrigin(config.previewUrl || process.env.TEMSCO_PREVIEW_URL || 'http://localhost:3001')
  const renderer = process.env.TEMSCO_PLAYWRIGHT_MODULE
    ? pathToFileURL(path.resolve(process.env.TEMSCO_PLAYWRIGHT_MODULE)).href
    : 'playwright'
  const { chromium } = await import(renderer).catch(() => {
    throw new Error('Playwright is required for PDF authoring. Set TEMSCO_PLAYWRIGHT_MODULE to an installed playwright/index.mjs or install Playwright locally.')
  })
  const executablePath = process.env.TEMSCO_CHROME_PATH || (
    process.platform === 'darwin' && existsSync('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome')
      ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' : undefined
  )
  const before = getSourceHash(root)
  const browser = await chromium.launch({ headless: true, executablePath })
  try {
    const page = await browser.newPage({ viewport: { width: 1500, height: 1080 } })
    const errors = []
    page.on('pageerror', error => errors.push(error.message))
    const response = await page.goto(new URL(route, origin).href, { waitUntil: 'networkidle' })
    if (!response || response.status() !== 200) throw new Error(`Preview returned HTTP ${response?.status() ?? 'unknown'}`)
    await page.locator(containerSelector).waitFor({ state: 'attached' })
    await page.locator(slideSelector).first().waitFor({ state: 'attached' })
    await page.emulateMedia({ media: 'print' })
    await page.evaluate(async selector => {
      const container = document.querySelector(selector)
      if (!container) throw new Error('Missing print container.')
      const text = container.textContent
      await Promise.all([300, 400, 500, 700, 900].map(weight => document.fonts.load(`${weight} 16px "Noto Sans KR"`, text)))
      await document.fonts.ready
      if (!document.fonts.check('700 16px "Noto Sans KR"', '템스코 투자제안서')) throw new Error('Korean print font is not ready.')
      await Promise.all([...container.querySelectorAll('img')].map(image => image.decode()))
    }, containerSelector)
    const pages = await page.locator(slideSelector).evaluateAll(slides => slides.map(slide => {
      const bounds = slide.getBoundingClientRect()
      const style = getComputedStyle(slide)
      return {
        id: slide.dataset.slideId, page: Number(slide.dataset.page), text: slide.textContent,
        visible: style.display !== 'none' && style.visibility !== 'hidden' && bounds.width > 0 && bounds.height > 0,
      }
    }))
    if (!pages.length || new Set(pages.map(slide => slide.id)).size !== pages.length ||
        pages.some((slide, i) => slide.page !== i + 1 || !slide.id || !slide.text.trim() || !slide.visible)) {
      throw new Error('The print view has hidden, missing, empty, duplicate or unordered slides.')
    }
    if (errors.length) throw new Error(`Preview errors: ${errors.join('; ')}`)
    const bytes = await page.pdf({ preferCSSPageSize: true, printBackground: true, displayHeaderFooter: false })
    validateChromiumPdf(bytes, pages.length)
    if (before !== getSourceHash(root)) throw new Error('Source changed during PDF rendering. Run export again.')
    const fileName = `${prefix}-${before.slice(0, 12)}.pdf`
    const manifest = {
      sourceHash: before,
      pdfHash: createHash('sha256').update(bytes).digest('hex'),
      fileName, pageCount: pages.length, generatedAt: new Date().toISOString(),
    }
    const output = path.join(root, artifactDirectory)
    await mkdir(output, { recursive: true })
    await writeFile(path.join(output, `${fileName}.tmp`), bytes)
    await rename(path.join(output, `${fileName}.tmp`), path.join(output, fileName))
    await writeFile(path.join(output, 'manifest.json.tmp'), JSON.stringify(manifest, null, 2) + '\n')
    await rename(path.join(output, 'manifest.json.tmp'), path.join(output, 'manifest.json'))
    verifyArtifact(root)
    console.log(JSON.stringify(manifest, null, 2))
  } finally {
    await browser.close()
  }
}
