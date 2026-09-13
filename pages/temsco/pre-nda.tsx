import Head from 'next/head'
import { useCallback, useEffect, useRef, useState } from 'react'
import PdfDownloads from '../../components/TemscoIR/PdfDownloads'

const documents = [{
  id: 'pre-nda', label: 'NDA 이전 PDF', apiUrl: '/api/temsco/pre-nda-pdf',
  artifactDirectory: '/temsco/pre-nda/pdf', filePrefix: 'TEMSCO-PRE-NDA',
  downloadName: 'TEMSCO_NDA이전_투자검토용.pdf',
}]

type PreviewPage = { page: number; title: string; url: string; width: number; height: number }
type Preview = { pages: PreviewPage[]; pageCount: number }
type LoadState = 'loading' | 'ready' | 'unavailable' | 'error'
const previewPattern = /^\/temsco\/pre-nda\/editions\/([a-f0-9]{12})\/preview\.json$/
const pdfPattern = /^\/temsco\/pre-nda\/pdf\/TEMSCO-PRE-NDA-([a-f0-9]{12})\.pdf$/

function validatedPreview(value: unknown, pageCount: number, edition: string): Preview {
  const candidate = value as Partial<Preview> | null
  if (!candidate || candidate.pageCount !== pageCount || !Array.isArray(candidate.pages) || candidate.pages.length !== pageCount) {
    throw new Error('PDF와 미리보기의 페이지 수가 일치하지 않습니다.')
  }
  for (const [index, page] of candidate.pages.entries()) {
    if (!page || page.page !== index + 1 || typeof page.title !== 'string' || !page.title.trim() ||
        page.url !== `/temsco/pre-nda/editions/${edition}/page-${String(index + 1).padStart(2, '0')}.png` ||
        !Number.isFinite(page.width) || !Number.isFinite(page.height) || page.width <= 0 || page.height <= 0) {
      throw new Error('미리보기 페이지의 순서 또는 파일 정보를 확인하지 못했습니다.')
    }
  }
  return candidate as Preview
}

/** Only rendered images from the redacted PDF enter this viewer. No V4 financial-model import. */
export default function TemscoPreNdaPage() {
  const [preview, setPreview] = useState<Preview | null>(null)
  const [loadState, setLoadState] = useState<LoadState>('loading')
  const [notice, setNotice] = useState('')
  const [attempt, setAttempt] = useState(0)
  const [mode, setMode] = useState<'presentation' | 'scroll'>('presentation')
  const [currentPage, setCurrentPage] = useState(1)
  const [scale, setScale] = useState(1)
  const [printing, setPrinting] = useState(false)
  const [imageErrors, setImageErrors] = useState<number[]>([])
  const headerRef = useRef<HTMLElement>(null)
  const printBusy = useRef(false)
  const pageCount = preview?.pageCount ?? 0

  useEffect(() => {
    const controller = new AbortController()
    let cancelled = false
    const timeout = window.setTimeout(() => controller.abort(), 20000)
    setLoadState('loading')
    setPreview(null)
    setNotice('')
    setImageErrors([])
    async function loadPreview() {
      try {
        const response = await fetch('/api/temsco/pre-nda-pdf', { cache: 'no-store', signal: controller.signal })
        if (response.status === 404 || response.status === 409) {
          if (!cancelled) setLoadState('unavailable')
          return
        }
        if (!response.ok) throw new Error('NDA 이전 자료를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.')
        const artifact = await response.json()
        if (!artifact.previewUrl) {
          if (!cancelled) setLoadState('unavailable')
          return
        }
        const previewMatch = typeof artifact.previewUrl === 'string' ? artifact.previewUrl.match(previewPattern) : null
        const pdfMatch = typeof artifact.url === 'string' ? artifact.url.match(pdfPattern) : null
        if (!previewMatch || !pdfMatch || previewMatch[1] !== pdfMatch[1] || !Number.isInteger(artifact.pageCount) || artifact.pageCount < 1) {
          throw new Error('PDF와 미리보기 파일의 버전 정보를 확인하지 못했습니다.')
        }
        const previewResponse = await fetch(artifact.previewUrl, { cache: 'no-store', signal: controller.signal })
        if (!previewResponse.ok) throw new Error('페이지 미리보기를 불러오지 못했습니다. 다시 시도해 주세요.')
        const checked = validatedPreview(await previewResponse.json(), artifact.pageCount, previewMatch[1])
        if (cancelled) return
        const initial = Number(new URLSearchParams(window.location.search).get('slide'))
        setCurrentPage(Number.isInteger(initial) && initial >= 1 && initial <= checked.pageCount ? initial : 1)
        setPreview(checked)
        setLoadState('ready')
      } catch (error) {
        if (cancelled) return
        setNotice(error instanceof Error && error.name !== 'AbortError' ? error.message : '자료 확인 시간이 초과되었습니다. 연결을 확인한 후 다시 시도해 주세요.')
        setLoadState('error')
      } finally {
        window.clearTimeout(timeout)
      }
    }
    void loadPreview()
    return () => { cancelled = true; controller.abort(); window.clearTimeout(timeout) }
  }, [attempt])

  useEffect(() => {
    const resize = () => {
      const widthScale = Math.max(.1, (window.innerWidth - 32) / 1123)
      const headerHeight = headerRef.current?.getBoundingClientRect().height ?? 140
      const heightScale = Math.max(.1, (window.innerHeight - headerHeight - 96) / 794)
      setScale(Math.min(1, widthScale, mode === 'presentation' ? heightScale : widthScale))
    }
    resize()
    window.addEventListener('resize', resize)
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(resize)
    if (headerRef.current) observer?.observe(headerRef.current)
    return () => { window.removeEventListener('resize', resize); observer?.disconnect() }
  }, [mode])

  const goToPage = useCallback((target: number) => {
    if (!pageCount) return
    const next = Math.max(1, Math.min(pageCount, target))
    setCurrentPage(next)
    const url = new URL(window.location.href)
    url.searchParams.set('slide', String(next).padStart(2, '0'))
    window.history.replaceState(null, '', url)
    if (mode === 'scroll') document.getElementById(`pre-page-${next}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [mode, pageCount])

  useEffect(() => {
    if (mode !== 'presentation' || !pageCount) return
    const keydown = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey || (event.target instanceof HTMLElement && event.target.closest('input,select,textarea,[contenteditable="true"]'))) return
      const target = event.key === 'ArrowRight' || event.key === 'PageDown' ? currentPage + 1
        : event.key === 'ArrowLeft' || event.key === 'PageUp' ? currentPage - 1
        : event.key === 'Home' ? 1 : event.key === 'End' ? pageCount : null
      if (target === null) return
      event.preventDefault()
      goToPage(target)
    }
    window.addEventListener('keydown', keydown)
    return () => window.removeEventListener('keydown', keydown)
  }, [mode, pageCount, currentPage, goToPage])

  function changeMode(next: 'presentation' | 'scroll') {
    setMode(next)
    if (next === 'scroll') window.requestAnimationFrame(() => document.getElementById(`pre-page-${currentPage}`)?.scrollIntoView({ block: 'start' }))
  }

  async function printPages() {
    if (!preview || printBusy.current) return
    printBusy.current = true
    setPrinting(true)
    setNotice('')
    try {
      await Promise.all(Array.from(document.querySelectorAll<HTMLImageElement>('.pre-nda-slide img')).map(image => image.decode()))
      window.print()
    } catch {
      setNotice('일부 페이지 이미지를 불러오지 못했습니다. 다시 불러오거나 NDA 이전 PDF를 다운로드해 주세요.')
    } finally {
      printBusy.current = false
      setPrinting(false)
    }
  }

  return <div className="pre-nda-page min-h-screen bg-slate-950 text-slate-100">
    <Head>
      <title>템스코 - NDA 이전 투자 검토용</title>
      <meta name="description" content="템스코 4안 전체 페이지의 목차·도표·설명을 유지하고 민감 수치와 자료를 가린 NDA 이전 투자 검토용" />
      <meta name="robots" content="noindex, nofollow" />
      <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700;900&display=swap" rel="stylesheet" />
      <style>{`
        .pre-nda-page { font-family:'Noto Sans KR',sans-serif; }
        .pre-nda-stack { display:flex; flex-direction:column; align-items:center; gap:28px; padding:24px 16px 36px; }
        .pre-nda-sheet { position:relative; overflow:hidden; flex-shrink:0; scroll-margin-top:160px; box-shadow:0 12px 40px #0004; background:#fff; }
        .pre-nda-sheet[data-hidden="true"] { display:none; }
        .pre-nda-slide,.pre-nda-slide img { display:block; width:100%; height:100%; }
        .pre-nda-slide img { object-fit:contain; }
        @page { size:A4 landscape; margin:0; }
        @media print {
          html,body,#__next,.pre-nda-page { width:297mm!important; margin:0!important; padding:0!important; min-height:0!important; background:#fff!important; }
          body>*:not(#__next),.no-print { display:none!important; }
          .pre-nda-stack { display:block!important; margin:0!important; padding:0!important; }
          .pre-nda-sheet,.pre-nda-sheet[data-hidden="true"] { display:block!important; width:297mm!important; height:210mm!important; margin:0!important; box-shadow:none!important; break-after:page; break-inside:avoid; }
          .pre-nda-sheet:last-child { break-after:auto; }
          .pre-nda-slide,.pre-nda-slide img { width:297mm!important; height:210mm!important; }
          * { -webkit-print-color-adjust:exact!important; print-color-adjust:exact!important; }
        }
      `}</style>
    </Head>
    <header ref={headerRef} className="no-print sticky top-0 z-50 bg-slate-900/95 text-white border-b border-slate-700 px-5 py-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><p className="text-[10px] text-blue-300 font-bold tracking-widest mb-1">TEMSCO · PRE-NDA</p><h1 className="text-sm font-bold">NDA 이전 투자 검토용</h1></div>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={() => void printPages()} disabled={!preview || printing || imageErrors.length > 0} className="text-xs font-semibold px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 disabled:opacity-40">{printing ? '인쇄 준비 중…' : '인쇄'}</button>
          <PdfDownloads documents={documents} />
        </div>
      </div>
      {preview && <div className="flex flex-wrap items-center justify-between gap-3 mt-4">
        <div className="flex items-center gap-1 rounded-lg bg-slate-950 p-1">
          <button type="button" aria-pressed={mode === 'presentation'} onClick={() => changeMode('presentation')} className={`text-xs font-bold rounded px-3 py-2 ${mode === 'presentation' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}>PPT 보기</button>
          <button type="button" aria-pressed={mode === 'scroll'} onClick={() => changeMode('scroll')} className={`text-xs font-bold rounded px-3 py-2 ${mode === 'scroll' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}>연속 스크롤</button>
        </div>
        <label className="flex items-center gap-2 text-xs text-slate-400">목차
          <select aria-label="NDA 이전 자료 목차" value={currentPage} onChange={event => goToPage(Number(event.target.value))} className="bg-slate-800 text-white rounded px-2 py-2 w-[min(360px,70vw)]">
            {preview.pages.map(page => <option key={page.page} value={page.page}>{String(page.page).padStart(2, '0')}. {page.title}</option>)}
          </select>
        </label>
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} aria-label="이전 페이지" className="rounded border border-slate-700 px-3 py-1.5 disabled:opacity-30">←</button>
          <p className="text-xs tabular-nums" aria-live="polite">{String(currentPage).padStart(2, '0')} <span className="text-slate-500">/ {pageCount}</span></p>
          <button type="button" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === pageCount} aria-label="다음 페이지" className="rounded border border-slate-700 px-3 py-1.5 disabled:opacity-30">→</button>
        </div>
      </div>}
    </header>
    {loadState === 'loading' && <div className="no-print px-6 py-24 text-center text-slate-400" role="status">NDA 이전 자료 불러오는 중…</div>}
    {(loadState === 'unavailable' || loadState === 'error') && <div className="no-print max-w-xl mx-auto px-6 py-24 text-center">
      <h2 className="text-lg font-bold">{loadState === 'unavailable' ? 'NDA 이전 자료 준비 중' : '미리보기 확인 필요'}</h2>
      <p className="text-sm text-slate-400 leading-relaxed mt-3" role="status">{loadState === 'unavailable' ? '4안 전체 페이지의 민감 수치·자료를 가린 전송용 PDF와 미리보기 준비 중.' : notice}</p>
      <button type="button" onClick={() => setAttempt(value => value + 1)} className="mt-6 px-4 py-2 rounded-lg bg-slate-800 text-sm hover:bg-slate-700">다시 불러오기</button>
    </div>}
    {preview && <>
      <div className="no-print text-center text-[11px] text-slate-400 px-5 pt-4">4안 전체 {pageCount}페이지 · 목차·도표·설명 유지 · 민감 수치·자료 CONFIDENTIAL 처리 · A4 가로</div>
      {(imageErrors.length > 0 || notice) && <div className="no-print max-w-3xl mx-auto px-5 pt-4 text-sm text-amber-200" role="alert">
        {imageErrors.length > 0 ? `${imageErrors.join(', ')}페이지 이미지를 불러오지 못했습니다.` : notice}
        <button type="button" onClick={() => setAttempt(value => value + 1)} className="underline ml-3">다시 불러오기</button>
      </div>}
      <main className="pre-nda-stack pre-nda-slide-container" aria-label="NDA 이전 투자제안서 페이지">
        {preview.pages.map(page => <div id={`pre-page-${page.page}`} key={page.url} className="pre-nda-sheet" data-hidden={mode === 'presentation' && page.page !== currentPage} style={{ width:1123*scale, height:794*scale }}>
          <article className="pre-nda-slide" data-page={page.page} data-slide-id={`redacted-${page.page}`} aria-label={`${page.page}페이지 ${page.title}`}>
            <img src={page.url} alt={`${page.page}페이지: ${page.title}`} width={page.width} height={page.height} loading="eager" decoding="async"
              onError={() => setImageErrors(previous => previous.includes(page.page) ? previous : [...previous, page.page])} />
          </article>
        </div>)}
      </main>
    </>}
  </div>
}
