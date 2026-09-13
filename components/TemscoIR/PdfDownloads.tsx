import { useRef, useState } from 'react'

export type PdfDocument = {
  id: string
  label: string
  apiUrl: string
  artifactDirectory: string
  filePrefix: string
  downloadName: string
}
type PdfArtifact = { url: string; pageCount: number; generatedAt: string }

/** Download UI only; each edition owns its content and disclosure rules. */
export default function PdfDownloads({ documents, showPrint = false }: { documents: PdfDocument[]; showPrint?: boolean }) {
  const busy = useRef(false)
  const [loading, setLoading] = useState<string | null>(null)
  const [notice, setNotice] = useState('')
  const [pdf, setPdf] = useState<PdfArtifact | null>(null)

  async function downloadPdf(document: PdfDocument) {
    if (busy.current) return
    busy.current = true
    setLoading(document.id)
    setPdf(null)
    setNotice(`${document.label} 파일 확인 중…`)
    const controller = new AbortController()
    const timeout = window.setTimeout(() => controller.abort(), 20000)
    try {
      const response = await fetch(document.apiUrl, { cache: 'no-store', signal: controller.signal })
      const artifact = await response.json()
      if (!response.ok) throw new Error(artifact.error || 'PDF 파일을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.')
      const prefix = `${document.artifactDirectory}/${document.filePrefix}-`
      if (typeof artifact.url !== 'string' || !artifact.url.startsWith(prefix) ||
          !/^[a-f0-9]{12}\.pdf$/.test(artifact.url.slice(prefix.length)) ||
          !Number.isInteger(artifact.pageCount) || artifact.pageCount < 1) {
        throw new Error('PDF 파일 주소와 페이지 정보를 확인하지 못했습니다.')
      }
      setPdf(artifact)
      const link = window.document.createElement('a')
      link.href = artifact.url
      link.download = document.downloadName
      window.document.body.appendChild(link)
      link.click()
      link.remove()
      setNotice(`${document.label} 다운로드 요청 · A4 가로 · 전체 ${artifact.pageCount}페이지`)
    } catch (error) {
      setNotice(error instanceof Error && error.name !== 'AbortError' ? error.message : 'PDF 확인 시간이 초과되었습니다. 연결을 확인한 후 다시 시도해 주세요.')
    } finally {
      window.clearTimeout(timeout)
      busy.current = false
      setLoading(null)
    }
  }

  function printDeck() {
    setPdf(null)
    setNotice('현재 화면 인쇄: A4 · 가로 · 여백 없음 · 배경 그래픽 포함. 인쇄창이 열리지 않으면 PDF 다운로드 이용.')
    try { window.print() } catch { setNotice('이 브라우저에서 인쇄창을 열지 못했습니다. PDF 다운로드를 이용해 주세요.') }
  }

  return <div className="no-print flex flex-wrap items-center gap-2" data-pdf-downloads>
    {showPrint && <button type="button" onClick={printDeck} className="text-xs font-semibold px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700">인쇄</button>}
    {documents.map(document => <button key={document.id} type="button" onClick={() => downloadPdf(document)} disabled={!!loading} aria-busy={loading === document.id}
      className="text-xs font-bold px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition flex items-center gap-1.5 disabled:opacity-60 disabled:cursor-wait">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5" /></svg>
      {loading === document.id ? 'PDF 확인 중…' : document.label}
    </button>)}
    {notice && <div className="no-print fixed bottom-5 left-4 right-4 sm:left-auto sm:w-96 rounded-xl border border-slate-600 bg-slate-900 p-4 text-sm text-slate-100 shadow-xl z-[100]">
      <div className="flex items-start gap-3">
        <p role="status" aria-live="polite" className="flex-1 leading-relaxed">{notice}</p>
        <button type="button" onClick={() => setNotice('')} aria-label="PDF 안내 닫기" className="text-slate-300 hover:text-white px-1">×</button>
      </div>
      {pdf && <div className="mt-3 border-t border-slate-700 pt-3">
        <p className="text-xs text-slate-400">다운로드가 시작되지 않으면 파일을 직접 열어 저장해 주세요.</p>
        <a href={pdf.url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block font-bold text-blue-300 underline">PDF 파일 열기</a>
      </div>}
    </div>}
  </div>
}
