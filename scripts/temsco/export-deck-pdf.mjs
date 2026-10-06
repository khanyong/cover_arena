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
    if (config.includePages) await page.evaluate(() => {
      document.querySelectorAll('[data-chapter-link="appendix"]').forEach(node => node.remove())
      document.querySelectorAll('[aria-label="본문 장 및 별첨 구성"] > div').forEach(node => {
        if (node.textContent.includes('별첨')) node.remove()
      })
      const group = document.querySelector('[data-section-content-link="valuation-peers"]')
      if (group) {
        group.setAttribute('href', '?slide=30')
        group.children[1].textContent = '시나리오 · 민감도'
        group.children[2].textContent = '30–31'
      }
      document.querySelectorAll('[data-deck-contents], [data-chapter-divider]').forEach(root => {
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
        while (walker.nextNode()) {
          walker.currentNode.textContent = walker.currentNode.textContent
            .replace('+ APPENDIX · 별첨', '')
            .replace('개 장과 평가 근거 별첨', '개 장 구성')
            .replace('CHAPTERS / APPENDIX', 'CHAPTERS')
            .replace('24–33', '24–27, 30–33')
            .replace('별도·연결 DCF · 시장배수 · 시나리오 · 75% 지분·증자 효과', '별도·연결 DCF · 시나리오·민감도 · 75% 지분·증자 효과')
        }
      })
    })
    if (config.omitSourceNotes) await page.evaluate(() => {
      const financialHeader = document.querySelector('.temsco-slide[data-page="20"] [data-financial-source] > div:first-child')
      if (financialHeader) {
        const headerText = document.createTreeWalker(financialHeader, NodeFilter.SHOW_TEXT)
        while (headerText.nextNode()) {
          headerText.currentNode.textContent = headerText.currentNode.textContent.replace(/\s*·\s*반올림 전 원본 기준/g, '')
        }
      }
      const exitNotes = document.querySelector('[data-exit-notes]')
      if (exitNotes) {
        const notice = document.createElement('p')
        notice.textContent = '투자자 유의사항: 본 페이지의 회수금액·수익률·일정 및 Buy-back 조건은 가정에 따른 예시로, 확정 수익·최소 회수금액·지급 보장 또는 매입 의무를 의미하지 않음. 제시 수치만으로 지급·매입을 청구할 권리가 발생하지 않으며, 실제 권리·의무·금액·행사 조건은 당사자 협의 후 체결하는 최종 계약에 따라 확정.'
        notice.style.cssText = 'font-weight:700;color:#92400e;border-top:1px solid #e2e8f0;padding-top:5px;margin-top:5px;line-height:1.5'
        exitNotes.appendChild(notice)
        const exitBody = document.querySelector('[data-exit-body]')
        if (exitBody) exitBody.style.zoom = '0.88'
      }
      document.querySelectorAll('[data-pdf-source]').forEach(node => node.remove())
      const walker = document.createTreeWalker(document.querySelector('.temsco-slide-container'), NodeFilter.SHOW_TEXT)
      while (walker.nextNode()) {
        walker.currentNode.textContent = walker.currentNode.textContent.replace(/\s*\/\s*템스코 회사소개서 p\.44/g, '')
        if (walker.currentNode.parentElement?.closest('.temsco-slide[data-page="32"]')) {
          walker.currentNode.textContent = walker.currentNode.textContent.replace('원본 투자주식', '투자주식')
        }
      }
      document.querySelectorAll('[data-valuation-notes], [data-corporate-note], [data-exit-notes]').forEach(note => {
        if (note.hasAttribute('data-exit-notes')) return
        const slide = note.closest('.temsco-slide')
        if (Number(slide?.dataset.page) >= 19) {
          const definitions = note.innerHTML.split(/<br\s*\/?\s*>/i).filter(line => {
            const probe = document.createElement('div'); probe.innerHTML = line
            return /^\s*\*\s*(SOTP|RCPS|CPS|CB|BW)\s*:/.test(probe.textContent)
          })
          if (definitions.length) note.innerHTML = definitions.join('<br>')
          else note.remove()
          const body = slide.querySelector('[data-valuation-body]')
          if (body) {
            body.style.display = 'flex'
            body.style.flexDirection = 'column'
            body.style.justifyContent = 'space-between'
            body.style.paddingBottom = '20px'
            body.style.paddingTop = '12px'
            if (body.children.length === 1) {
              body.firstElementChild.style.flex = '1'
              body.firstElementChild.style.alignContent = 'space-between'
            }
            body.querySelectorAll('tbody th, tbody td').forEach(cell => {
              const style = getComputedStyle(cell)
              const extra = [25, 26].includes(Number(slide.dataset.page)) ? 0 : 2
              cell.style.paddingTop = `${parseFloat(style.paddingTop) + extra}px`
              cell.style.paddingBottom = `${parseFloat(style.paddingBottom) + extra}px`
            })
          }
          return
        }
        const before = note.textContent
        const lines = note.innerHTML.split(/<br\s*\/?\s*>/i)
        note.innerHTML = lines.filter(line => {
          const probe = document.createElement('div'); probe.innerHTML = line
          return !/^(출처\s*:|회사 재무\s*:|재무자료\s*:|수상\s*:|핌스·풍원정밀 EV\/Sales 단순평균)/.test(probe.textContent.trim())
        }).join('<br>').replace(/:\s*회사 제공/g, '')
        if (!note.textContent.trim()) note.remove()
        else if (before !== note.textContent) {
          const body = note.parentElement.querySelector('[data-valuation-body]')
          if (body) body.style.justifyContent = 'space-between'
        }
      })
      // Source-free technology pages use the recovered footer area for the
      // existing figures and text, without changing the full edition's CSS.
      for (const pageNumber of [12, 14, 15]) {
        const article = document.querySelector(`.temsco-slide[data-page="${pageNumber}"] [data-technology-slide]`)
        if (!article) continue
        const layout = article.children[1].firstElementChild
        layout.style.height = '100%'
        for (const column of layout.children) {
          column.style.display = 'flex'
          column.style.flexDirection = 'column'
          column.style.justifyContent = 'space-between'
          column.style.gap = '10px'
        }
      }
    })
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
    const selectedPages = config.includePages ? pages.filter(slide => config.includePages.includes(slide.page)) : pages
    if (config.includePages && selectedPages.length !== config.includePages.length) throw new Error('Requested PDF pages are missing.')
    const bytes = await page.pdf({ preferCSSPageSize: true, printBackground: true, displayHeaderFooter: false,
      ...(config.includePages ? { pageRanges: config.includePages.join(',') } : {}),
    })
    validateChromiumPdf(bytes, selectedPages.length)
    if (before !== getSourceHash(root)) throw new Error('Source changed during PDF rendering. Run export again.')
    const fileName = `${prefix}-${before.slice(0, 12)}.pdf`
    const manifest = {
      sourceHash: before,
      pdfHash: createHash('sha256').update(bytes).digest('hex'),
      fileName, pageCount: selectedPages.length, generatedAt: new Date().toISOString(),
      ...(config.includePages ? { includedOriginalPages: config.includePages } : {}),
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
