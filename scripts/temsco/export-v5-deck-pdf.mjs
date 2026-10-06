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

/** Keep original page numbers; slide and chapter IDs are the stable selection keys. */
export function selectDeckPages(pages, config = {}) {
  const { includePages, excludeSlideIds = [], excludeChapterIds = [] } = config
  const uniqueArray = (value, name, valid) => {
    if (!Array.isArray(value) || value.some(item => !valid(item)) || new Set(value).size !== value.length) {
      throw new Error(`${name} must be an array of unique valid values.`)
    }
  }
  uniqueArray(excludeSlideIds, 'excludeSlideIds', id => typeof id === 'string' && id.length > 0)
  uniqueArray(excludeChapterIds, 'excludeChapterIds', id => typeof id === 'string' && id.length > 0)
  if (!pages.length || new Set(pages.map(slide => slide.id)).size !== pages.length ||
      pages.some((slide, i) => !slide.id || slide.page !== i + 1)) throw new Error('Missing, duplicate or unordered slide metadata.')
  if (includePages !== undefined) {
    uniqueArray(includePages, 'includePages', value => Number.isInteger(value) && value > 0)
    if (!includePages.length || excludeSlideIds.length || excludeChapterIds.length) throw new Error('includePages cannot be empty or combined with ID exclusions.')
    if (includePages.some((value, i) => i > 0 && value <= includePages[i - 1])) throw new Error('includePages must be in ascending original-page order.')
    if (includePages.some(value => !pages.some(slide => slide.page === value))) throw new Error('Requested PDF pages are missing.')
  }
  for (const id of excludeSlideIds) if (!pages.some(slide => slide.id === id)) throw new Error(`Unknown excluded slide ID: ${id}`)
  for (const id of excludeChapterIds) if (!pages.some(slide => slide.chapterId === id && slide.kind === 'divider')) throw new Error(`Unknown excluded chapter ID: ${id}`)
  const selected = pages.filter(slide => (!includePages || includePages.includes(slide.page)) &&
    !excludeSlideIds.includes(slide.id) && !excludeChapterIds.includes(slide.chapterId))
  if (!selected.length) throw new Error('PDF selection is empty.')
  return selected
}

/** Browser callback: derive all navigation ranges from the retained DOM slide IDs. */
export function updateNavigationForSelection({ deck, selectedPages }) {
  const retained = new Set(selectedPages.map(slide => slide.id))
  const byId = new Map(deck.map(slide => [slide.id, slide]))
  const pageRange = slides => {
    const segments = []
    for (const slide of slides) {
      const previous = segments[segments.length - 1]
      if (previous && slide.page === previous[1] + 1) previous[1] = slide.page
      else segments.push([slide.page, slide.page])
    }
    return segments.map(([start, end]) => start === end ? String(start) : `${start}–${end}`).join(', ')
  }
  const replaceText = (root, transform) => {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
    while (walker.nextNode()) walker.currentNode.textContent = transform(walker.currentNode.textContent)
  }
  const chapterIds = [...new Set(deck.map(slide => slide.chapterId).filter(Boolean))]
  for (const chapterId of chapterIds) {
    const original = deck.filter(slide => slide.chapterId === chapterId)
    const selected = original.filter(slide => retained.has(slide.id))
    const content = selected.filter(slide => slide.kind !== 'divider')
    const link = document.querySelector(`[data-chapter-link="${chapterId}"]`)
    if (link) {
      if (!selected.length) link.remove()
      else {
        link.setAttribute('href', `?slide=${selected[0].page}`)
        const numbers = link.lastElementChild
        if (numbers?.firstElementChild) numbers.firstElementChild.textContent = String(selected[0].page).padStart(2, '0')
        if (numbers?.lastElementChild) numbers.lastElementChild.textContent = `${chapterId === 'appendix' ? '별첨' : '본문'} ${pageRange(content)}`
      }
    }
    const divider = document.querySelector(`[data-chapter-divider="${chapterId}"]`)
    if (!divider) continue
    const sections = [...divider.querySelectorAll('[data-section-content-link]')]
    sections.forEach((section, index) => {
      const first = byId.get(section.getAttribute('data-section-content-link'))
      const next = index + 1 < sections.length ? byId.get(sections[index + 1].getAttribute('data-section-content-link')) : null
      if (!first) throw new Error('Chapter section points to an unknown slide ID.')
      const originalGroup = original.filter(slide => slide.page >= first.page && (!next || slide.page < next.page))
      const group = originalGroup.filter(slide => retained.has(slide.id))
      if (!group.length) { section.remove(); return }
      section.setAttribute('href', `?slide=${group[0].page}`)
      section.setAttribute('data-section-content-link', group[0].id)
      section.lastElementChild.textContent = pageRange(group)
      if (group.length !== originalGroup.length) {
        const compactLabels = { 'valuation-scenarios': '시나리오', 'valuation-sensitivity': '민감도' }
        section.children[1].textContent = group.map(slide => compactLabels[slide.id] || slide.title).join(' · ')
      }
    })
    const footer = divider.lastElementChild?.lastElementChild
    if (footer) footer.textContent = `${chapterId === 'appendix' ? '별첨' : '본문'} ${pageRange(content)} 페이지`
  }
  const appendixOmitted = !selectedPages.some(slide => slide.chapterId === 'appendix')
  if (appendixOmitted) {
    document.querySelectorAll('[aria-label="본문 장 및 별첨 구성"] > div').forEach(node => {
      if (node.children[1]?.textContent.trim() === '별첨') node.remove()
    })
  }
  document.querySelectorAll('[data-deck-contents], [data-chapter-divider], [data-slide-id="use-of-proceeds"]').forEach(root => replaceText(root, text => {
    let result = appendixOmitted ? text.replace('+ APPENDIX · 별첨', '').replace('개 장과 평가 근거 별첨', '개 장 구성').replace('CHAPTERS / APPENDIX', 'CHAPTERS') : text
    if (!retained.has('valuation-peers') && !retained.has('valuation-methods')) {
      result = result.replace('시장배수 · ', '').replace('시나리오 · 75%', '시나리오·민감도 · 75%')
    }
    if (!retained.has('valuation-scenarios')) {
      result = result.replace(' · 시나리오', '')
    }
    if (!retained.has('investor-exit') && retained.has('use-of-proceeds')) {
      result = result.replace('투자 유치 및 회수 전략', '투자 유치 및 자금 활용 계획')
        .replace('FUNDING & INVESTOR EXIT', 'FUNDING & USE OF PROCEEDS')
        .replace(' · IPO·지분매각·Buy-back', '')
    }
    return result
  }))
  if (!retained.has('valuation-scenarios')) {
    const methods = document.querySelector('[data-slide-id="valuation-methods"]')
    if (methods) replaceText(methods, text => text.replace('요약·FCFF·시나리오의 연결가치', '요약·FCFF의 연결가치'))
  }
}

/** Browser callback: omit source footnotes without changing dense accounting layouts. */
export function omitSourceNotesForPrint({ deck, containerSelector }) {
  const container = document.querySelector(containerSelector)
  if (!container) throw new Error('Missing print container.')
  const metadata = new Map(deck.map(slide => [slide.id, slide]))
  const definitionsIn = note => {
    const lines = note.innerHTML.replace(/<\/(p|div|li)>/gi, '</$1><br>').split(/<br\s*\/?\s*>/i)
    return [...new Set(lines.map(line => {
      const probe = document.createElement('div'); probe.innerHTML = line
      return probe.textContent.trim()
    }).filter(text => /^\s*\*?\s*(SOTP|RCPS|CPS|CB|BW)\s*:/.test(text)))]
  }
  const replaceWithDefinitions = (note, definitions) => note.replaceChildren(...definitions.map(text => {
    const paragraph = document.createElement('p'); paragraph.textContent = text; return paragraph
  }))
  const financialHeader = container.querySelector('[data-slide-id="financial-turnaround"] [data-financial-source] > div:first-child')
  if (financialHeader) {
    const walker = document.createTreeWalker(financialHeader, NodeFilter.SHOW_TEXT)
    while (walker.nextNode()) walker.currentNode.textContent = walker.currentNode.textContent.replace(/\s*·\s*반올림 전 원본 기준/g, '')
  }
  const exitNotes = container.querySelector('[data-slide-id="investor-exit"] [data-exit-notes]')
  if (exitNotes) {
    // The abridged edition explicitly retains the entire Exit Plan footnote block.
    if (!exitNotes.querySelector('[data-exit-print-notice]')) {
      const notice = document.createElement('p')
      notice.setAttribute('data-exit-print-notice', '')
      notice.textContent = '투자자 유의사항: 본 페이지의 회수금액·수익률·일정 및 Buy-back 조건은 가정에 따른 예시로, 확정 수익·최소 회수금액·지급 보장 또는 매입 의무를 의미하지 않음. 제시 수치만으로 지급·매입을 청구할 권리가 발생하지 않으며, 실제 권리·의무·금액·행사 조건은 당사자 협의 후 체결하는 최종 계약에 따라 확정.'
      notice.style.cssText = 'font-weight:700;color:#92400e;border-top:1px solid #e2e8f0;padding-top:5px;margin-top:5px;line-height:1.5'
      exitNotes.appendChild(notice)
    }
    const exitBody = container.querySelector('[data-slide-id="investor-exit"] [data-exit-body]')
    if (exitBody) exitBody.style.zoom = '0.88'
  }
  container.querySelectorAll('[data-pdf-source]').forEach(node => node.remove())
  container.querySelectorAll('[data-technology-slide], [data-slide-id="valuation-equity"]').forEach(root => {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
    while (walker.nextNode()) {
      walker.currentNode.textContent = walker.currentNode.textContent.replace(/\s*\/\s*템스코 회사소개서 p\.44/g, '')
      if (root.matches('[data-slide-id="valuation-equity"]')) walker.currentNode.textContent = walker.currentNode.textContent.replace('원본 투자주식', '투자주식')
    }
  })
  container.querySelectorAll('[data-valuation-notes], [data-corporate-note]').forEach(note => {
    const slide = note.closest('[data-slide-id]')
    if (!slide) return
    const chapter = metadata.get(slide.dataset.slideId)?.chapterId
    if (['financials', 'valuation', 'funding', 'appendix'].includes(chapter)) {
      const definitions = definitionsIn(note)
      if (definitions.length) replaceWithDefinitions(note, definitions)
      else note.remove()
      // The reference accounting grids already use deliberately compact rows.
      // Recovering footnote space must not overwrite their flex/grid or cell padding.
      if (slide.querySelector('[data-accounting-valuation]')) return
      const body = slide.querySelector('[data-valuation-body]')
      if (body) {
        body.style.display = 'flex'; body.style.flexDirection = 'column'; body.style.justifyContent = 'space-between'
        body.style.paddingBottom = '20px'; body.style.paddingTop = '12px'
        if (body.children.length === 1) {
          body.firstElementChild.style.flex = '1'; body.firstElementChild.style.alignContent = 'space-between'
        }
        body.querySelectorAll('tbody th, tbody td').forEach(cell => {
          const style = getComputedStyle(cell)
          cell.style.paddingTop = `${parseFloat(style.paddingTop) + 2}px`
          cell.style.paddingBottom = `${parseFloat(style.paddingBottom) + 2}px`
        })
      }
      return
    }
    const previous = note.textContent
    note.innerHTML = note.innerHTML.split(/<br\s*\/?\s*>/i).filter(line => {
      const probe = document.createElement('div'); probe.innerHTML = line
      return !/^(출처\s*:|회사 재무\s*:|재무자료\s*:|수상\s*:|핌스·풍원정밀 EV\/Sales 단순평균)/.test(probe.textContent.trim())
    }).join('<br>').replace(/:\s*회사 제공/g, '')
    if (!note.textContent.trim()) note.remove()
    else if (previous !== note.textContent) {
      const body = note.parentElement.querySelector('[data-valuation-body]')
      if (body) body.style.justifyContent = 'space-between'
    }
  })
  for (const id of ['technology-mask', 'technology-quality', 'technology-development']) {
    const article = container.querySelector(`[data-slide-id="${id}"] [data-technology-slide]`)
    const layout = article?.children[1]?.firstElementChild
    if (!layout) continue
    layout.style.height = '100%'
    for (const column of layout.children) {
      column.style.display = 'flex'; column.style.flexDirection = 'column'; column.style.justifyContent = 'space-between'; column.style.gap = '10px'
    }
  }
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
    const deck = await page.locator(slideSelector).evaluateAll(slides => {
      let chapterId = null
      return slides.map(slide => {
        const divider = slide.querySelector('[data-chapter-divider]')
        if (divider) chapterId = divider.getAttribute('data-chapter-divider')
        return { id: slide.dataset.slideId, page: Number(slide.dataset.page), chapterId,
          kind: slide.dataset.slideKind, title: slide.querySelector('h2')?.textContent?.trim() || '' }
      })
    })
    const selectedPages = selectDeckPages(deck, config)
    const hasSelection = selectedPages.length !== deck.length
    if (hasSelection) await page.evaluate(updateNavigationForSelection, { deck, selectedPages })
    if (config.omitSourceNotes) await page.evaluate(omitSourceNotesForPrint, { deck, containerSelector })
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
    if (pages.length !== deck.length || pages.some((slide, i) => slide.id !== deck[i].id || slide.page !== deck[i].page)) {
      throw new Error('Slide order changed while preparing print navigation.')
    }
    const bytes = await page.pdf({ preferCSSPageSize: true, printBackground: true, displayHeaderFooter: false,
      ...(hasSelection ? { pageRanges: selectedPages.map(slide => slide.page).join(',') } : {}),
    })
    validateChromiumPdf(bytes, selectedPages.length)
    if (before !== getSourceHash(root)) throw new Error('Source changed during PDF rendering. Run export again.')
    const fileName = `${prefix}-${before.slice(0, 12)}.pdf`
    const manifest = {
      sourceHash: before,
      pdfHash: createHash('sha256').update(bytes).digest('hex'),
      fileName, pageCount: selectedPages.length, generatedAt: new Date().toISOString(),
      ...(hasSelection ? { includedOriginalPages: selectedPages.map(slide => slide.page), includedSlideIds: selectedPages.map(slide => slide.id) } : {}),
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
