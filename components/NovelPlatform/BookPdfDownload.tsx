import { selectedBookCapture } from '../../shared/lib/novelBookCaptureSession.js';
import { useEffect, useId, useRef, useState } from 'react';
import { supabase } from '../../shared/lib/supabase';

type PageSize = 'book' | 'A4';
type FontSize = 10 | 11 | 12;
type DownloadState = { busy: boolean; message: string; error: boolean };

const EMPTY_STATE: DownloadState = { busy: false, message: '', error: false };
const SUPPORTED_SLUGS = new Set(['quantum-vibration-novel', 'quantum-vibration-novel-en']);
class PdfDownloadError extends Error {}

// A response header is metadata, not a filesystem path or a navigation URL.
export function bookPdfFilename(header: string | null, slug: string, date = new Date()): string {
  const fallback = `ROS-${slug.endsWith('-en') ? 'EN' : 'KO'}-${date.toISOString().slice(0, 10)}.pdf`;
  if (!header) return fallback;
  const encoded = /filename\*=UTF-8''([^;]+)/i.exec(header)?.[1];
  const plain = /filename="([^"]+)"/i.exec(header)?.[1];
  let filename = plain;
  if (encoded) {
    try { filename = decodeURIComponent(encoded.trim()); } catch { return fallback; }
  }
  return filename && filename.length <= 180 && /^[A-Za-z0-9가-힣][A-Za-z0-9가-힣._ -]*\.pdf$/i.test(filename)
    && !filename.includes('..') ? filename : fallback;
}

const responseError = async (response: Response): Promise<string> => {
  // Read a structured failure when available, but never surface server exception
  // details, manuscript fragments, tokens, or HTML error pages to the UI.
  let code = '';
  if (response.headers.get('content-type')?.toLowerCase().includes('application/json')) {
    try {
      const data: unknown = await response.json();
      if (data && typeof data === 'object' && 'error' in data && typeof data.error === 'string') code = data.error;
    } catch { /* A malformed error response still gets a bounded local message. */ }
  }
  if (response.status === 401) return '로그인이 만료되었습니다. 다시 로그인한 뒤 시도해 주세요.';
  if (response.status === 403) return '이 원고를 PDF로 내려받을 권한이 없습니다.';
  if (response.status === 409) return '생성 중 저장된 원고가 변경되었습니다. 잠시 후 다시 시도해 주세요.';
  if (response.status === 429) return 'PDF 생성 요청이 많습니다. 잠시 후 다시 시도해 주세요.';
  if (code === 'BOOK_CHROME_NOT_INSTALLED') return '로컬 Chrome을 찾지 못했습니다. Chrome을 설치하거나 BOOK_PDF_CHROME_EXECUTABLE 경로를 설정해 주세요.';
  if (code === 'BOOK_MATH_RENDER_FAILED') return '수식 조판을 확인하지 못해 PDF 생성을 중단했습니다. 원고는 변경하지 않았습니다.';
  if (response.status === 503 || code === 'PDF_RENDERER_UNAVAILABLE') return 'PDF 생성 서비스를 사용할 수 없습니다. 잠시 후 다시 시도해 주세요.';
  if (response.status === 504) return 'PDF 생성 시간이 초과되었습니다. 잠시 후 다시 시도해 주세요.';
  return 'PDF를 생성하지 못했습니다. 연결을 확인한 뒤 다시 시도해 주세요.';
};

/** Uses the server's latest saved Reader selection, never an in-browser draft. */
export function BookPdfDownload({ slug, hasOpenEditor = false }: { slug: string; hasOpenEditor?: boolean }) {
  const id = useId();
  const [pageSize, setPageSize] = useState<PageSize>('book');
  const [fontSize, setFontSize] = useState<FontSize>(11);
  const [actor, setActor] = useState<string | null | undefined>(undefined);
  const [state, setState] = useState<DownloadState>(EMPTY_STATE);
  const actorRef = useRef<string | null | undefined>(undefined);
  const authEpoch = useRef(0);
  const requestSequence = useRef(0);
  const controllerRef = useRef<AbortController | null>(null);
  const objectUrls = useRef(new Set<string>());
  const scopeRef = useRef({ slug, hasOpenEditor });
  scopeRef.current = { slug, hasOpenEditor };
  const supported = SUPPORTED_SLUGS.has(slug);

  useEffect(() => {
    let mounted = true;
    const initialEpoch = authEpoch.current;
    const setCurrentActor = (next: string | null, forceReset = false) => {
      if (!mounted) return;
      if (actorRef.current !== next || forceReset) {
        authEpoch.current += 1;
        requestSequence.current += 1;
        controllerRef.current?.abort();
        controllerRef.current = null;
        for (const url of objectUrls.current) URL.revokeObjectURL(url);
        objectUrls.current.clear();
        setState(EMPTY_STATE);
      }
      actorRef.current = next;
      setActor(next);
    };
    // Keep this callback synchronous: awaiting another Supabase auth call here
    // can deadlock the client's session lock.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setCurrentActor(session?.user?.id || null, event === 'SIGNED_OUT');
    });
    supabase.auth.getSession().then(({ data, error }) => {
      if (mounted && authEpoch.current === initialEpoch) setCurrentActor(error ? null : data.session?.user?.id || null);
    }).catch(() => {
      if (mounted && authEpoch.current === initialEpoch) setCurrentActor(null);
    });
    return () => {
      mounted = false;
      requestSequence.current += 1;
      controllerRef.current?.abort();
      controllerRef.current = null;
      subscription.unsubscribe();
      for (const url of objectUrls.current) URL.revokeObjectURL(url);
      objectUrls.current.clear();
    };
  }, []);

  useEffect(() => {
    requestSequence.current += 1;
    controllerRef.current?.abort();
    controllerRef.current = null;
    for (const url of objectUrls.current) URL.revokeObjectURL(url);
    objectUrls.current.clear();
    setState(EMPTY_STATE);
    return () => {
      requestSequence.current += 1;
      controllerRef.current?.abort();
      controllerRef.current = null;
    };
  }, [slug, hasOpenEditor]);

  const cancel = () => {
    requestSequence.current += 1;
    controllerRef.current?.abort();
    controllerRef.current = null;
    setState({ busy: false, message: '다운로드 요청을 취소했습니다. 서버의 이미 시작된 작업은 잠시 더 진행될 수 있습니다.', error: false });
  };

  const download = async () => {
    if (!supported || hasOpenEditor || controllerRef.current || !actorRef.current) return;
    const controller = new AbortController();
    controllerRef.current = controller;
    const request = ++requestSequence.current;
    const expectedActor = actorRef.current;
    const expectedEpoch = authEpoch.current;
    let timedOut = false;
    const isCurrent = () => requestSequence.current === request && authEpoch.current === expectedEpoch
      && actorRef.current === expectedActor && scopeRef.current.slug === slug && !scopeRef.current.hasOpenEditor;
    const timeout = window.setTimeout(() => { timedOut = true; controller.abort(); }, 320000);
    setState({ busy: true, message: '저장된 전권을 불러와 책 형태의 PDF를 생성하고 있습니다… 분량에 따라 시간이 걸릴 수 있습니다.', error: false });
    try {
      const { data, error } = await supabase.auth.getSession();
      if (!isCurrent()) return;
      if (controller.signal.aborted) throw new Error('Aborted');
      if (error || !data.session?.access_token || data.session.user.id !== expectedActor) {
        setState({ busy: false, message: '로그인 상태가 변경되었습니다. 다시 로그인한 뒤 시도해 주세요.', error: true });
        return;
      }
      const response = await fetch('/api/novel-book-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${data.session.access_token}` },
        body: JSON.stringify({ slug, options: { pageSize, fontSize }, captureId: selectedBookCapture(expectedActor) }),
        cache: 'no-store',
        credentials: 'same-origin',
        signal: controller.signal,
      });
      if (!isCurrent()) return;
      if (controller.signal.aborted) throw new Error('Aborted');
      if (!response.ok) throw new PdfDownloadError(await responseError(response));
      if (response.status !== 200 || response.headers.get('content-type')?.split(';')[0].trim().toLowerCase() !== 'application/pdf') {
        throw new PdfDownloadError('서버 응답이 PDF 파일이 아닙니다. 파일을 내려받지 않았습니다.');
      }
      const blob = await response.blob();
      if (blob.size < 10 || await blob.slice(0, 5).text() !== '%PDF-'
        || !/%%EOF\s*$/.test(await blob.slice(-1024).text())) {
        throw new PdfDownloadError('PDF 파일 형식을 확인하지 못했습니다. 파일을 내려받지 않았습니다.');
      }
      // Re-read the actor after generation. A late response from a prior account
      // or novel must not trigger a download, including when fetch ignores abort.
      const current = await supabase.auth.getSession();
      if (!isCurrent()) return;
      if (controller.signal.aborted) throw new Error('Aborted');
      if (current.error || current.data.session?.user.id !== expectedActor) {
        setState({ busy: false, message: '로그인 상태가 변경되어 PDF 결과를 폐기했습니다.', error: true });
        return;
      }
      const url = URL.createObjectURL(blob);
      objectUrls.current.add(url);
      const link = document.createElement('a');
      link.href = url;
      link.download = bookPdfFilename(response.headers.get('content-disposition'), slug);
      document.body.appendChild(link);
      try { link.click(); } finally { link.remove(); }
      window.setTimeout(() => { URL.revokeObjectURL(url); objectUrls.current.delete(url); }, 60000);
      setState({ busy: false, message: 'PDF 다운로드를 요청했습니다. 브라우저의 다운로드 목록을 확인해 주세요.', error: false });
    } catch (caught) {
      if (isCurrent()) {
        const message = timedOut ? 'PDF 생성 대기 시간이 초과되었습니다. 잠시 후 다시 시도해 주세요.'
          : caught instanceof PdfDownloadError && !controller.signal.aborted
            ? caught.message : 'PDF 요청을 완료하지 못했습니다. 연결을 확인한 뒤 다시 시도해 주세요.';
        setState({ busy: false, message, error: true });
      }
    } finally {
      window.clearTimeout(timeout);
      if (requestSequence.current === request) controllerRef.current = null;
    }
  };

  if (!supported) return null;
  const disabled = state.busy || hasOpenEditor || !actor;
  return <section aria-label="책 PDF 다운로드" className="w-full rounded-xl border border-emerald-700/50 bg-emerald-950/20 p-3 text-sm text-zinc-200" data-book-pdf-download>
    <div className="flex flex-wrap items-end gap-3">
      <label htmlFor={`${id}-size`} className="flex flex-col gap-1 text-xs text-zinc-300">
        판형
        <select id={`${id}-size`} value={pageSize} disabled={disabled} onChange={event => setPageSize(event.target.value as PageSize)} className="rounded-lg border border-zinc-600 bg-zinc-950 px-2 py-2 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400 disabled:opacity-50">
          <option value="book">책 · 6 × 9인치</option><option value="A4">A4</option>
        </select>
      </label>
      <label htmlFor={`${id}-font`} className="flex flex-col gap-1 text-xs text-zinc-300">
        본문 크기
        <select id={`${id}-font`} value={fontSize} disabled={disabled} onChange={event => setFontSize(Number(event.target.value) as FontSize)} className="rounded-lg border border-zinc-600 bg-zinc-950 px-2 py-2 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400 disabled:opacity-50">
          <option value={10}>10pt</option><option value={11}>11pt</option><option value={12}>12pt</option>
        </select>
      </label>
      <button type="button" onClick={download} disabled={disabled} aria-busy={state.busy} aria-describedby={`${id}-scope ${id}-status`} className="rounded-lg bg-emerald-400 px-4 py-2 font-bold text-zinc-950 hover:bg-emerald-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400 disabled:cursor-not-allowed disabled:opacity-50">
        {state.busy ? 'PDF 생성 중…' : `${slug.endsWith('-en') ? '영문' : '국문'} 전권 PDF 다운로드`}
      </button>
      {state.busy ? <button type="button" onClick={cancel} className="rounded-lg border border-zinc-500 px-3 py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400">요청 취소</button> : null}
    </div>
    <p id={`${id}-scope`} className="mt-2 text-xs leading-relaxed text-zinc-400">서버에 저장된 최신 Reader 전권을 사용합니다. 관리 장면은 최신 review를 사용하며, 화면에서 임시 선택한 과거 버전·저장하지 않은 편집 내용은 포함하지 않습니다. 원고나 final/accepted 상태는 변경하지 않습니다.</p>
    <p id={`${id}-status`} role={state.error ? 'alert' : 'status'} aria-live={state.error ? 'assertive' : 'polite'} className={`mt-1 text-xs leading-relaxed ${state.error ? 'text-red-300' : 'text-zinc-300'}`}>
      {hasOpenEditor ? '작성 중인 내용을 저장하거나 편집창을 닫은 뒤 PDF를 생성해 주세요.' : actor === undefined ? '로그인 상태를 확인하고 있습니다…' : !actor ? '로그인 후 PDF를 다운로드할 수 있습니다.' : state.message}
    </p>
  </section>;
}
