import { useEffect, useId, useRef, useState } from 'react';
import { supabase } from '../../shared/lib/supabase';

type DownloadState = { busy: boolean; message: string; error: boolean };

const EMPTY_STATE: DownloadState = { busy: false, message: '', error: false };
const SUPPORTED_SLUGS = new Set(['quantum-vibration-novel', 'quantum-vibration-novel-en']);
class EpubDownloadError extends Error {}

// A response header is metadata, not a filesystem path or a navigation URL.
export function bookEpubFilename(header: string | null, slug: string, date = new Date()): string {
  const fallback = `The Resonance of Space - Architects of Spacetime${slug.endsWith('-en') ? '' : ' - Korean Edition'}.epub`;
  if (!header) return fallback;
  const encoded = /filename\*=UTF-8''([^;]+)/i.exec(header)?.[1];
  const plain = /filename="([^"]+)"/i.exec(header)?.[1];
  let filename = plain;
  if (encoded) {
    try { filename = decodeURIComponent(encoded.trim()); } catch { return fallback; }
  }
  return filename && filename.length <= 180 && /^[A-Za-z0-9가-힣][A-Za-z0-9가-힣._ -]*\.epub$/i.test(filename)
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
  if (response.status === 403) return '이 원고를 EPUB로 내려받을 권한이 없습니다.';
  if (response.status === 409) return '생성 중 저장된 원고가 변경되었습니다. 잠시 후 다시 시도해 주세요.';
  if (response.status === 429) return 'EPUB 생성 요청이 많습니다. 잠시 후 다시 시도해 주세요.';
  if (code === 'BOOK_MATH_RENDER_FAILED') return '수식 조판을 확인하지 못해 EPUB 생성을 중단했습니다. 원고는 변경하지 않았습니다.';
  if (response.status === 503 || code === 'BOOK_EPUB_UNAVAILABLE') return 'EPUB 생성 서비스를 사용할 수 없습니다. 잠시 후 다시 시도해 주세요.';
  if (response.status === 504) return 'EPUB 생성 시간이 초과되었습니다. 잠시 후 다시 시도해 주세요.';
  return 'EPUB을 생성하지 못했습니다. 연결을 확인한 뒤 다시 시도해 주세요.';
};

/** Uses the server's latest saved Reader selection, never an in-browser draft. */
export function BookEpubDownload({ slug, hasOpenEditor = false }: { slug: string; hasOpenEditor?: boolean }) {
  const id = useId();
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
    setState({ busy: true, message: '저장된 전권을 불러와 Kindle용 EPUB을 생성하고 있습니다… 분량에 따라 시간이 걸릴 수 있습니다.', error: false });
    try {
      const { data, error } = await supabase.auth.getSession();
      if (!isCurrent()) return;
      if (controller.signal.aborted) throw new Error('Aborted');
      if (error || !data.session?.access_token || data.session.user.id !== expectedActor) {
        setState({ busy: false, message: '로그인 상태가 변경되었습니다. 다시 로그인한 뒤 시도해 주세요.', error: true });
        return;
      }
      const response = await fetch('/api/novel-book-epub', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${data.session.access_token}` },
        body: JSON.stringify({ slug }),
        cache: 'no-store',
        credentials: 'same-origin',
        signal: controller.signal,
      });
      if (!isCurrent()) return;
      if (controller.signal.aborted) throw new Error('Aborted');
      if (!response.ok) throw new EpubDownloadError(await responseError(response));
      if (response.status !== 200 || response.headers.get('content-type')?.split(';')[0].trim().toLowerCase() !== 'application/epub+zip') {
        throw new EpubDownloadError('서버 응답이 EPUB 파일이 아닙니다. 파일을 내려받지 않았습니다.');
      }
      const blob = await response.blob();
      if (blob.size < 58 || await blob.slice(0, 4).text() !== 'PK\x03\x04' || await blob.slice(30, 58).text() !== 'mimetypeapplication/epub+zip') {
        throw new EpubDownloadError('EPUB 파일 형식을 확인하지 못했습니다. 파일을 내려받지 않았습니다.');
      }
      // Re-read the actor after generation. A late response from a prior account
      // or novel must not trigger a download, including when fetch ignores abort.
      const current = await supabase.auth.getSession();
      if (!isCurrent()) return;
      if (controller.signal.aborted) throw new Error('Aborted');
      if (current.error || current.data.session?.user.id !== expectedActor) {
        setState({ busy: false, message: '로그인 상태가 변경되어 EPUB 결과를 폐기했습니다.', error: true });
        return;
      }
      const url = URL.createObjectURL(blob);
      objectUrls.current.add(url);
      const link = document.createElement('a');
      link.href = url;
      link.download = bookEpubFilename(response.headers.get('content-disposition'), slug);
      document.body.appendChild(link);
      try { link.click(); } finally { link.remove(); }
      window.setTimeout(() => { URL.revokeObjectURL(url); objectUrls.current.delete(url); }, 60000);
      setState({ busy: false, message: 'EPUB 다운로드를 요청했습니다. 브라우저의 다운로드 목록을 확인해 주세요.', error: false });
    } catch (caught) {
      if (isCurrent()) {
        const message = timedOut ? 'EPUB 생성 대기 시간이 초과되었습니다. 잠시 후 다시 시도해 주세요.'
          : caught instanceof EpubDownloadError && !controller.signal.aborted
            ? caught.message : 'EPUB 요청을 완료하지 못했습니다. 연결을 확인한 뒤 다시 시도해 주세요.';
        setState({ busy: false, message, error: true });
      }
    } finally {
      window.clearTimeout(timeout);
      if (requestSequence.current === request) controllerRef.current = null;
    }
  };

  if (!supported) return null;
  const disabled = state.busy || hasOpenEditor || !actor;
  return <section aria-label="Kindle EPUB 다운로드" className="w-full rounded-xl border border-emerald-700/50 bg-emerald-950/20 p-3 text-sm text-zinc-200" data-book-epub-download>
    <div className="flex flex-wrap items-end gap-3">
      <button type="button" onClick={download} disabled={disabled} aria-busy={state.busy} aria-describedby={`${id}-scope ${id}-status`} className="rounded-lg bg-emerald-400 px-4 py-2 font-bold text-zinc-950 hover:bg-emerald-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400 disabled:cursor-not-allowed disabled:opacity-50">
        {state.busy ? 'EPUB 생성 중…' : `${slug.endsWith('-en') ? '영문' : '국문'} Kindle용 EPUB 다운로드`}
      </button>
      {state.busy ? <button type="button" onClick={cancel} className="rounded-lg border border-zinc-500 px-3 py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400">요청 취소</button> : null}
    </div>
    <p className="mt-2 text-xs leading-relaxed">글자 크기를 조절하며 읽는 전자책입니다. 다운로드 후 <a href="https://www.amazon.com/sendtokindle" target="_blank" rel="noreferrer" className="underline">Send to Kindle</a>에 올리고 기기를 동기화하세요. 한글·수식 표시는 기기에서 확인해 주세요.</p>
    <p id={`${id}-scope`} className="mt-2 text-xs leading-relaxed text-zinc-400">서버에 저장된 최신 Reader 전권을 사용합니다. 관리 장면은 최신 review를 사용하며, 화면에서 임시 선택한 과거 버전·저장하지 않은 편집 내용은 포함하지 않습니다. 원고나 final/accepted 상태는 변경하지 않습니다.</p>
    <p id={`${id}-status`} role={state.error ? 'alert' : 'status'} aria-live={state.error ? 'assertive' : 'polite'} className={`mt-1 text-xs leading-relaxed ${state.error ? 'text-red-300' : 'text-zinc-300'}`}>
      {hasOpenEditor ? '작성 중인 내용을 저장하거나 편집창을 닫은 뒤 EPUB을 생성해 주세요.' : actor === undefined ? '로그인 상태를 확인하고 있습니다…' : !actor ? '로그인 후 EPUB을 다운로드할 수 있습니다.' : state.message}
    </p>
  </section>;
}
