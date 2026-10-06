import React, { useEffect, useMemo, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { NovelParagraph, NovelScene, getParagraphText } from './novelData';
import { NovelDiffViewer } from './NovelDiffViewer';
import { BilingualBlockText, TranslationComparisonRow } from './NovelBilingualReader';

interface ManagedBlockReviewDialogProps {
  scene: NovelScene;
  paragraph: NovelParagraph;
  comments: any[];
  loading?: boolean;
  loadError?: string;
  initialSelection?: { text: string; start: number; end: number };
  englishSource?: TranslationComparisonRow;
  englishSourceLoading?: boolean;
  englishSourceError?: string;
  onClose: () => void;
  onSaveComment: (input: any, existing?: any) => Promise<boolean>;
  onSaveGuideline?: (input: any) => Promise<boolean>;
  onSaveBody: (body: string, note: string) => Promise<boolean>;
  onCopyScene: () => Promise<void>;
  onCopyText: (text: string) => Promise<void>;
}

const KINDS = [
  ['style', '문체'], ['translation', '번역'], ['term', '용어'], ['dialogue', '대사'],
  ['fact', '사실'], ['continuity', '연결'], ['formula', '수식'], ['other', '기타'],
] as const;
const PRIORITIES = [['required', '필수'], ['suggested', '권장'], ['question', '질문']] as const;
const STATUSES = [
  ['open', '검토 중'], ['sent', '편집 요청 전달'], ['review', '반영 후 재검토'],
  ['resolved', '확인 완료'], ['held', '보류'], ['withdrawn', '철회'],
] as const;
const inputClass = 'w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400 disabled:opacity-50';
const buttonClass = 'rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-200 hover:bg-zinc-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400 disabled:cursor-not-allowed disabled:opacity-40';

function label(options: readonly (readonly [string, string])[], value: string) {
  return options.find(([key]) => key === value)?.[1] || value;
}

function dateLabel(value?: string) {
  if (!value) return '';
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleString('ko-KR');
}

function errorMessage(error: unknown, fallback: string) {
  const message = error && typeof error === 'object' && 'message' in error
    ? (error as { message?: unknown }).message : undefined;
  return typeof message === 'string' && message.length > 0 ? message.slice(0, 600) : fallback;
}

function newComment(selection?: { text: string; start: number; end: number }) {
  return {
    kind: 'style', priority: 'suggested', direction: '', proposal: '', status: 'open',
    include_in_export: true,
    selected_text: selection?.text || '',
    selection_start: selection?.text ? selection.start : null as number | null,
    selection_end: selection?.text ? selection.end : null as number | null,
    application_scope: 'local', target_character: '', applies_to: 'all', preservation: '',
  };
}

function editableComment(comment: any) {
  return {
    kind: comment.kind, priority: comment.priority, direction: comment.direction || '',
    proposal: comment.proposal || '', status: comment.status,
    include_in_export: Boolean(comment.include_in_export),
    selected_text: comment.selected_text || '',
    selection_start: comment.selection_start ?? null,
    selection_end: comment.selection_end ?? null,
    application_scope: 'local', target_character: '', applies_to: 'all', preservation: '',
  };
}

/** The comment form never sends a manuscript update. Its target is the captured block version. */
export const ManagedBlockReviewDialog: React.FC<ManagedBlockReviewDialogProps> = ({
  scene, paragraph, comments, loading = false, loadError, initialSelection, onClose, onSaveComment, onSaveGuideline, onSaveBody,
  onCopyScene, onCopyText, englishSource, englishSourceLoading = false, englishSourceError,
}) => {
  const originalBody = getParagraphText(paragraph, paragraph.activeVersion);
  const unitId = paragraph.unitId || paragraph.id;
  const currentVersion = paragraph.revisionVersionId
    || paragraph.versions[paragraph.activeVersion]?.revisionVersionId || paragraph.activeVersion;
  const position = scene.paragraphs.findIndex(item => (item.unitId || item.id) === unitId) + 1;
  const blockLabel = position > 0 ? `B${String(position).padStart(4, '0')}` : (paragraph.sourceKey || '선택 블록');
  const [tab, setTab] = useState<'comment' | 'body' | 'history'>('comment');
  const [scope, setScope] = useState<'block' | 'selection'>(initialSelection?.text ? 'selection' : 'block');
  const [form, setForm] = useState(() => newComment(initialSelection));
  const [savedForm, setSavedForm] = useState(() => JSON.stringify(newComment(initialSelection)));
  const [editing, setEditing] = useState<any>(null);
  const [body, setBody] = useState(originalBody);
  const [bodyBaseline, setBodyBaseline] = useState(originalBody);
  const [note, setNote] = useState('');
  const [showDiff, setShowDiff] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const dialogRef = useRef<HTMLDivElement>(null);
  const firstTabRef = useRef<HTMLButtonElement>(null);
  const directionRef = useRef<HTMLTextAreaElement>(null);
  const closeRef = useRef<() => void>(() => undefined);
  const isReadOnly = Boolean(scene.managedReadOnly);
  const broadScope = !editing && form.application_scope !== 'local';
  const commentDirty = JSON.stringify(form) !== savedForm;
  const bodyDirty = body !== bodyBaseline || note !== '';
  const dirty = commentDirty || bodyDirty;
  const blockComments = useMemo(() => comments
    .filter(comment => comment.block_unit_id === unitId)
    .sort((a, b) => String(b.created_at).localeCompare(String(a.created_at))), [comments, unitId]);

  const requestClose = () => {
    if (busy) return;
    if (dirty && !window.confirm('저장하지 않은 입력이 있습니다. 입력을 버리고 닫을까요?')) return;
    onClose();
  };
  closeRef.current = requestClose;

  useEffect(() => {
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    firstTabRef.current?.focus();
    const keydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        closeRef.current();
      }
      if (event.key !== 'Tab') return;
      const nodes = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), summary, a[href], [tabindex="0"]',
      ) || []).filter(element => !element.matches(':disabled') && element.getClientRects().length > 0);
      if (!nodes.length) {
        event.preventDefault();
        dialogRef.current?.focus();
      } else if (event.shiftKey && (document.activeElement === nodes[0] || !dialogRef.current?.contains(document.activeElement))) {
        event.preventDefault(); nodes[nodes.length - 1].focus();
      } else if (!event.shiftKey && (document.activeElement === nodes[nodes.length - 1] || !dialogRef.current?.contains(document.activeElement))) {
        event.preventDefault(); nodes[0].focus();
      }
    };
    document.addEventListener('keydown', keydown, true);
    return () => {
      document.removeEventListener('keydown', keydown, true);
      document.body.style.overflow = overflow;
      previousFocus?.focus();
    };
  }, []);

  const setField = (field: string, value: unknown) => {
    setForm(previous => ({ ...previous, [field]: value }));
    setNotice('');
  };

  const resetComment = () => {
    const empty = newComment();
    setForm(empty); setSavedForm(JSON.stringify(empty)); setEditing(null); setScope('block');
  };

  const startComment = (comment?: any) => {
    if (busy || (commentDirty && !window.confirm('작성 중인 코멘트를 버리고 다른 코멘트를 열까요?'))) return;
    const next = comment ? editableComment(comment) : newComment();
    setEditing(comment || null); setForm(next); setSavedForm(JSON.stringify(next));
    setScope(next.selected_text ? 'selection' : 'block'); setTab('comment'); setError(''); setNotice('');
    requestAnimationFrame(() => directionRef.current?.focus());
  };

  const saveComment = async () => {
    if (busy || isReadOnly || loading || loadError) return;
    if (!form.direction.trim()) { setError('수정 방향을 입력해 주세요.'); directionRef.current?.focus(); return; }
    if (scope === 'selection' && !form.selected_text) { setError('원문에서 코멘트할 문장을 먼저 선택해 주세요.'); return; }
    setBusy(true); setError(''); setNotice('');
    try {
      const { application_scope, target_character, applies_to, preservation, ...commentInput } = form;
      const input = scope === 'block'
        ? { ...commentInput, selected_text: '', selection_start: null, selection_end: null }
        : { ...commentInput };
      if (broadScope && !onSaveGuideline) { setError('이 화면에서는 공통 지침 저장을 아직 사용할 수 없습니다. 입력은 유지됩니다.'); return; }
      const result = broadScope
        ? await onSaveGuideline!({ ...input, scope: application_scope, target_character, applies_to, preservation })
        : await onSaveComment(input, editing || undefined);
      if (!result) { setError('코멘트를 저장하지 못했습니다. 입력은 유지됩니다.'); return; }
      resetComment(); setNotice(broadScope ? '공통 수정 지침을 저장했습니다. Scene 검토 패키지에서 확인할 수 있습니다. 본문은 바뀌지 않았습니다.' : '코멘트를 저장했습니다. 본문과 본문 버전은 그대로입니다.');
    } catch (caught) {
      setError(errorMessage(caught, '저장하지 못했습니다. 입력은 유지됩니다.'));
    } finally { setBusy(false); }
  };

  const saveBody = async () => {
    if (busy || isReadOnly || commentDirty || body === bodyBaseline) return;
    if (!body.trim()) { setError('본문 전체를 비울 수 없습니다.'); return; }
    if (!window.confirm('이 블록의 수정본을 새 버전으로 저장하고 최신 검토본에 반영할까요?')) return;
    setBusy(true); setError(''); setNotice('');
    try {
      const result = await onSaveBody(body, note);
      if (!result) { setError('본문을 저장하지 못했습니다. 입력은 유지됩니다.'); return; }
      setBodyBaseline(body); setNote(''); setNotice('수정본을 새 블록 버전과 새 Scene 구성으로 저장했습니다.');
    } catch (caught) {
      setError(errorMessage(caught, '본문을 저장하지 못했습니다. 입력은 유지됩니다.'));
    } finally { setBusy(false); }
  };

  const copy = async (action: () => Promise<void>, message: string) => {
    setError(''); setNotice('');
    try { await action(); setNotice(message); }
    catch (caught) { setError(errorMessage(caught, '복사하지 못했습니다.')); }
  };
  const targetBody = editing?.body_snapshot ?? originalBody;
  const historicalVersion = editing && (editing.is_stale || editing.block_version_id !== currentVersion);
  const tabLabels = [['comment', '검토 코멘트'], ['body', '본문 직접 수정'], ['history', '이력']] as const;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-3 backdrop-blur-sm sm:p-6" onMouseDown={event => { if (event.target === event.currentTarget) requestClose(); }}>
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="managed-review-title" tabIndex={-1} aria-busy={busy}
        className="flex max-h-[94vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-amber-500/30 bg-zinc-900 font-sans text-zinc-100 shadow-2xl">
        <header className="shrink-0 border-b border-zinc-800 px-5 pb-0 pt-5 sm:px-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="mb-1 text-xs text-amber-300">{scene.title || 'Scene'} · {blockLabel}</p>
              <h2 id="managed-review-title" className="text-lg font-semibold">블록 검토와 편집</h2>
              <p className="mt-1 text-xs text-zinc-400">{isReadOnly ? '과거 구성 · 읽기 전용' : '현재 review 기준'} · 본문 버전 {paragraph.versions[paragraph.activeVersion]?.versionNo ?? paragraph.activeVersion}</p>
            </div>
            <button type="button" aria-label="검토창 닫기" onClick={requestClose} disabled={busy} className={`${buttonClass} !px-2 !py-1 text-lg`}>×</button>
          </div>
          <div role="tablist" aria-label="블록 작업" className="mt-4 flex gap-1">
            {tabLabels.map(([value, text], index) => <button key={value} ref={index === 0 ? firstTabRef : undefined} type="button" role="tab" aria-selected={tab === value}
              aria-controls={`managed-${value}-panel`} id={`managed-${value}-tab`} disabled={busy} onClick={() => { setTab(value); setError(''); }}
              className={`rounded-t-lg px-4 py-3 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400 ${tab === value ? 'border-b-2 border-amber-400 bg-zinc-800 text-amber-300' : 'text-zinc-400 hover:text-zinc-100'}`}>
              {text}{value === 'history' && blockComments.length > 0 ? ` (${blockComments.length})` : ''}
            </button>)}
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-6">
          {isReadOnly && <p className="mb-4 rounded-lg border border-amber-600/40 bg-amber-950/30 p-3 text-sm text-amber-200">과거 구성은 읽기 전용입니다. 코멘트 작성과 본문 수정은 최신 review에서 진행하세요.</p>}
          {loading && <p role="status" className="mb-4 rounded-lg border border-zinc-700 p-3 text-sm text-zinc-400">저장된 코멘트를 불러오는 중입니다.</p>}
          {loadError && <p role="alert" className="mb-4 whitespace-pre-wrap rounded-lg border border-red-500/40 bg-red-950/40 p-3 text-sm text-red-200">코멘트를 불러오지 못했습니다. {loadError} 창을 다시 열어 조회해 주세요.</p>}
          {error && <p role="alert" className="mb-4 whitespace-pre-wrap rounded-lg border border-red-500/40 bg-red-950/40 p-3 text-sm text-red-200">{error}</p>}
          {notice && <p role="status" className="mb-4 rounded-lg border border-emerald-600/30 bg-emerald-950/30 p-3 text-sm text-emerald-200">{notice}</p>}

          {(englishSource || englishSourceLoading || englishSourceError) && <section aria-label="번역 기준 영문 참고" className="mb-5 rounded-xl border border-sky-700/50 bg-sky-950/10 p-4">
            <h3 className="mb-2 text-sm font-medium text-sky-200">번역 기준 영문 · 읽기 전용</h3>
            {englishSourceLoading && <p role="status" className="text-xs text-zinc-400">선택한 국문 블록의 고정 영문 대응을 확인하고 있습니다…</p>}
            {englishSourceError && <p role="alert" className="text-xs text-amber-200">{englishSourceError} 영문을 추정해 대체하지 않습니다.</p>}
            {englishSource && <><div lang="en" data-en-version-id={englishSource.en_version_id} className="max-h-56 overflow-auto text-sm"><BilingualBlockText body={englishSource.en_body} /></div><p className="mt-3 break-all text-[10px] text-zinc-500">EN Unit {englishSource.en_unit_id} · Version {englishSource.en_version_id}</p><p className="mt-2 text-xs text-zinc-400">현재 KO 블록에 연결된 번역 기준입니다. {englishSource.en_status === 'changed' ? '최신 EN은 기준 이후 변경되었습니다.' : englishSource.en_status === 'unavailable' ? '최신 EN 대응은 미확인입니다.' : '조회 시점 최신 EN과 같습니다.'} 코멘트 대상·적용 범위와 본문 저장은 한국어로 유지합니다.</p>{historicalVersion && <p className="mt-2 text-xs text-amber-200">아래는 과거 코멘트의 국문입니다. 위 영문은 현재 표시 KO 블록의 기준이며 과거 코멘트의 기준 영문이라고 단정하지 않습니다.</p>}</>}
          </section>}

          {tab === 'comment' && <section role="tabpanel" id="managed-comment-panel" aria-labelledby="managed-comment-tab" className="space-y-5">
            <div>
              <div className="mb-2 flex items-center justify-between gap-2"><h3 className="text-sm font-medium text-zinc-300">{editing ? '코멘트 작성 당시 본문' : '현재 본문'} · 읽기 전용</h3><button type="button" className={`${buttonClass} !py-1 text-xs`} onClick={() => copy(() => onCopyText(targetBody), '대상 본문을 복사했습니다.')}>본문 복사</button></div>
              <div className="max-h-52 overflow-auto rounded-xl border border-zinc-700 bg-zinc-950 p-4 text-sm leading-7 [&_.katex-display]:overflow-x-auto [&_.katex-display]:overflow-y-hidden [&_p]:my-2">
                <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{targetBody}</ReactMarkdown>
              </div>
              {historicalVersion && <p className="mt-2 text-xs leading-5 text-amber-300">기준 버전 이후 본문이 변경되었습니다. 이 코멘트는 원래 버전에 연결되어 있습니다. 현재 문장에 새 지시를 남기려면 새 코멘트를 작성하세요.</p>}
            </div>

            <fieldset disabled={busy || isReadOnly || loading || Boolean(loadError)} className="space-y-4 disabled:opacity-60">
              <legend className="sr-only">검토 코멘트 입력</legend>
              {!editing && onSaveGuideline && <div className="space-y-3 rounded-xl border border-amber-500/25 bg-amber-950/10 p-3">
                <label className="block space-y-2 text-sm"><span>수정 지침 적용 범위</span><select value={form.application_scope} onChange={event => setField('application_scope', event.target.value)} className={inputClass}>
                  <option value="local">선택한 이 문장·블록만 수정</option>
                  <option value="scene">이 부분은 예시 · 현재 Scene 전체 검토</option>
                  <option value="work">이 부분은 예시 · 같은 한국어 작품의 공통 지침</option>
                </select></label>
                {broadScope && <>
                  <p className="text-xs leading-5 text-amber-200">아래 원문은 문제를 보여주는 예시입니다. reviewer는 지정된 범위의 다른 문장도 함께 검토합니다. 저장만으로 다른 부분을 자동 수정하지 않습니다.</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="space-y-1 text-xs text-zinc-400"><span>대상 인물 · 선택</span><input value={form.target_character} onChange={event => setField('target_character', event.target.value)} maxLength={200} placeholder="예: 이안" className={inputClass} /></label>
                    <label className="space-y-1 text-xs text-zinc-400"><span>적용할 글의 종류</span><select value={form.applies_to} onChange={event => setField('applies_to', event.target.value)} className={inputClass}><option value="all">전체</option><option value="dialogue">대사</option><option value="narration">서술</option><option value="inner_voice">내면 독백</option></select></label>
                  </div>
                  <label className="block space-y-1 text-xs text-zinc-400"><span>보존 조건 · 선택</span><textarea value={form.preservation} onChange={event => setField('preservation', event.target.value)} rows={2} maxLength={12000} placeholder="예: 과학적 의미와 전달 정보는 유지. 다른 인물의 말투는 변경하지 않음." className={inputClass} /></label>
                  {form.application_scope === 'work' && <p className="text-xs leading-5 text-zinc-400">작품 공통 지침은 같은 논리 KO project에 연결된 검토 Scene에서 공유합니다. 영문·다른 작품에는 적용하지 않으며, 현재 Scene 검토만으로 전권 반영 완료가 되지는 않습니다.</p>}
                </>}
              </div>}
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <span className="text-zinc-400">{broadScope ? '예시로 첨부할 원문' : '대상 범위'}</span>
                {(['block', 'selection'] as const).map(value => <label key={value} className="flex items-center gap-2">
                  <input type="radio" name="managed-comment-scope" value={value} checked={scope === value} disabled={Boolean(editing)} onChange={() => {
                    setScope(value);
                    if (value === 'block') setForm(previous => ({ ...previous, selected_text: '', selection_start: null, selection_end: null }));
                  }} className="accent-amber-400" />{value === 'block' ? '블록 전체' : '선택 문장'}
                </label>)}
                {editing && <span className="text-xs text-zinc-500">기존 대상 범위 유지</span>}
              </div>
              {scope === 'selection' && <div className="space-y-2">
                {!editing && <><label htmlFor="managed-selection-source" className="block text-xs text-zinc-400">아래 원문에서 {broadScope ? '예시 문장' : '대상 문장'}을 드래그하거나 Shift+방향키로 선택하세요.</label>
                  <textarea id="managed-selection-source" readOnly value={targetBody} rows={5} className={`${inputClass} font-mono leading-6`} onSelect={event => {
                    const target = event.currentTarget;
                    const start = target.selectionStart; const end = target.selectionEnd;
                    if (end <= start) return;
                    setForm(previous => ({ ...previous, selected_text: target.value.slice(start, end), selection_start: Array.from(target.value.slice(0, start)).length, selection_end: Array.from(target.value.slice(0, end)).length }));
                  }} /></>}
                <div className="rounded-lg border border-amber-500/20 bg-amber-950/10 p-3 text-sm"><p className="mb-1 text-xs text-amber-300">{broadScope ? '예시로 선택한 정확한 문자열' : '선택한 정확한 문자열'}</p><p className="whitespace-pre-wrap break-words">{form.selected_text || '아직 선택하지 않았습니다.'}</p></div>
              </div>}

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <label className="space-y-1 text-xs text-zinc-400"><span>수정 유형</span><select aria-label="수정 유형" value={form.kind} onChange={event => setField('kind', event.target.value)} className={inputClass}>{KINDS.map(([value, text]) => <option key={value} value={value}>{text}</option>)}</select></label>
                <label className="space-y-1 text-xs text-zinc-400"><span>우선순위</span><select aria-label="우선순위" value={form.priority} onChange={event => setField('priority', event.target.value)} className={inputClass}>{PRIORITIES.map(([value, text]) => <option key={value} value={value}>{text}</option>)}</select></label>
                <label className="col-span-2 space-y-1 text-xs text-zinc-400 sm:col-span-1"><span>진행 상태</span><select aria-label="진행 상태" value={form.status} onChange={event => setField('status', event.target.value)} className={inputClass}>{STATUSES.map(([value, text]) => <option key={value} value={value}>{text}</option>)}</select></label>
              </div>
              <label className="block space-y-2 text-sm"><span>{editing ? '수정 방향 정정' : '수정 방향'} <span className="text-amber-300">필수</span></span><textarea ref={directionRef} value={form.direction} onChange={event => setField('direction', event.target.value)} rows={4} maxLength={12000} className={inputClass} placeholder="예: 수식은 유지하고, 앞뒤 설명에서 용어가 일관적인지 검토해 주세요." /></label>
              <label className="block space-y-2 text-sm"><span>제안 문안 <span className="text-xs text-zinc-500">선택 입력</span></span><textarea value={form.proposal} onChange={event => setField('proposal', event.target.value)} rows={3} maxLength={30000} className={inputClass} placeholder="직접 생각한 대체 문장이 있다면 입력하세요. 본문에 자동 반영되지 않습니다." /></label>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="accent-amber-400" checked={form.include_in_export} onChange={event => setField('include_in_export', event.target.checked)} />다음 편집 요청에 포함</label>
              <p className="text-xs leading-5 text-zinc-500">{broadScope ? '지침과 예시의 기준 버전을 보존합니다. 이 지침은 선택 문장만의 수정 요청이 아니며, Scene 지침 목록에서 정정·상태 변경할 수 있습니다.' : '저장 시 본문은 바뀌지 않습니다. 코멘트는 작성 당시 블록 버전에 연결되고, 정정·철회도 이력에 남습니다.'}</p>
              <div className="flex flex-wrap items-center justify-end gap-2">
                {editing && <button type="button" className={buttonClass} onClick={() => startComment()}>새 코멘트 작성</button>}
                <button type="button" onClick={saveComment} disabled={busy || !form.direction.trim() || (Boolean(editing) && !commentDirty)} className="rounded-lg bg-amber-400 px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-40">{busy ? '저장 중…' : editing ? '코멘트 정정 저장' : broadScope ? '공통 수정 지침 저장' : '검토 코멘트 저장'}</button>
              </div>
            </fieldset>

            {blockComments.length > 0 && <div className="space-y-3 border-t border-zinc-800 pt-4"><h3 className="text-sm font-medium">이 블록의 코멘트 · {blockComments.length}개</h3>
              {blockComments.map(comment => <article key={comment.id} className="rounded-xl border border-zinc-700 bg-zinc-950/50 p-3">
                <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-zinc-400"><span className="text-amber-300">{label(KINDS, comment.kind)}</span><span>{label(PRIORITIES, comment.priority)}</span><span>{label(STATUSES, comment.status)}</span>{comment.include_in_export && <span className="rounded bg-amber-500/10 px-1.5 py-0.5 text-amber-300">요청 포함</span>}{comment.is_stale && <span className="text-rose-300">기준 버전 변경 · 재확인 필요</span>}</div>
                {comment.selected_text && <blockquote className="mb-2 whitespace-pre-wrap border-l-2 border-zinc-600 pl-3 text-xs text-zinc-400">{comment.selected_text}</blockquote>}
                <p className="whitespace-pre-wrap break-words text-sm">{comment.direction}</p>
                {comment.proposal && <p className="mt-2 whitespace-pre-wrap break-words text-sm text-zinc-400">제안 문안: {comment.proposal}</p>}
                <div className="mt-3 flex items-center justify-between gap-3"><span className="text-xs text-zinc-500">{dateLabel(comment.updated_at || comment.created_at)} · 코멘트 r{comment.revision}</span><button type="button" className={`${buttonClass} !py-1 text-xs`} disabled={busy || isReadOnly} onClick={() => startComment(comment)}>정정·상태 변경</button></div>
              </article>)}
            </div>}
          </section>}

          {tab === 'body' && <section role="tabpanel" id="managed-body-panel" aria-labelledby="managed-body-tab" className="space-y-4">
            <p className="rounded-lg border border-amber-500/20 bg-amber-950/20 p-3 text-sm leading-6 text-amber-200">저장하면 이 블록의 새 버전과 새 Scene 구성을 만들고 최신 review로 표시합니다. 문안 최종 확정은 별도입니다.</p>
            {commentDirty && <div className="rounded-lg border border-amber-500/30 bg-amber-950/20 p-3 text-sm text-amber-200"><p>작성 중인 코멘트가 있습니다. 코멘트를 먼저 저장하거나 입력을 비운 뒤 본문을 저장해 주세요.</p><div className="mt-3 flex flex-wrap gap-2"><button type="button" disabled={busy} className={buttonClass} onClick={() => setTab('comment')}>코멘트로 돌아가기</button><button type="button" disabled={busy} className={buttonClass} onClick={() => { resetComment(); setNotice('저장하지 않은 코멘트 입력을 비웠습니다.'); }}>코멘트 입력 비우기</button></div></div>}
            <details className="rounded-lg border border-zinc-700 bg-zinc-950 p-3"><summary className="cursor-pointer text-sm text-zinc-300">기준 본문 보기</summary><pre className="mt-3 whitespace-pre-wrap break-words font-sans text-sm leading-6 text-zinc-400">{bodyBaseline}</pre></details>
            <label className="block space-y-2 text-sm"><span>수정 본문 · {blockLabel} 한 블록</span><textarea value={body} onChange={event => { setBody(event.target.value); setNotice(''); }} disabled={busy || isReadOnly} rows={9} className={`${inputClass} font-mono leading-6`} spellCheck={false} /></label>
            <label className="block space-y-2 text-sm"><span>수정 사유</span><input value={note} onChange={event => setNote(event.target.value)} disabled={busy || isReadOnly} className={inputClass} placeholder="이 버전에서 실제 변경한 내용을 기록합니다." /></label>
            <p className="text-xs leading-5 text-zinc-500">버전 번호는 저장 시 자동 생성됩니다. 현재 구성이 바뀌었다면 저장을 중단하고 최신본을 다시 확인합니다.</p>
            <button type="button" onClick={() => setShowDiff(value => !value)} className={buttonClass}>{showDiff ? '차이 비교 접기' : '변경 전후 비교'}</button>
            {showDiff && <NovelDiffViewer oldContent={bodyBaseline} newContent={body} oldVersionLabel="기준 본문" newVersionLabel="저장 전 수정안" />}
            <div className="flex justify-end"><button type="button" onClick={saveBody} disabled={busy || isReadOnly || commentDirty || body === bodyBaseline || !body.trim()} className="rounded-lg bg-amber-400 px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-40">{busy ? '저장 중…' : '수정본을 새 버전으로 저장'}</button></div>
          </section>}

          {tab === 'history' && <section role="tabpanel" id="managed-history-panel" aria-labelledby="managed-history-tab" className="space-y-5">
            <p className="text-sm text-zinc-400">이력은 읽기 전용입니다. 과거 기록 조회는 최신 review를 변경하지 않습니다.</p>
            <div className="space-y-3"><h3 className="font-medium">검토 코멘트 이력</h3>{!loading && !loadError && blockComments.length === 0 && <p className="text-sm text-zinc-500">저장된 검토 코멘트가 없습니다.</p>}
              {blockComments.map(comment => <details key={comment.id} className="rounded-xl border border-zinc-700 bg-zinc-950/50 p-3">
                <summary className="cursor-pointer text-sm leading-6">{label(STATUSES, comment.status)} · {comment.direction} <span className="text-zinc-500">(r{comment.revision})</span></summary>
                <p className="mt-3 text-xs text-zinc-500">작성: {dateLabel(comment.created_at)} · 기준 Version: {comment.block_version_id}</p>
                <p className="mt-2 whitespace-pre-wrap text-sm">{comment.direction}</p>
                {comment.proposal && <p className="mt-2 whitespace-pre-wrap text-sm text-zinc-400">제안 문안: {comment.proposal}</p>}
                {(comment.history || []).map((event: any, index: number) => {
                  const snapshot = event.snapshot || event.payload || event.input || event;
                  return <div key={event.event_id || `${comment.id}:${event.revision || index}`} className="mt-3 border-l-2 border-zinc-700 pl-3 text-xs text-zinc-400"><p>{dateLabel(event.updated_at || event.at || event.created_at)} · {event.action || event.event || '코멘트 기록'}{event.revision ? ` · r${event.revision}` : ''}</p>{snapshot.direction && <p className="mt-1 whitespace-pre-wrap">{snapshot.direction}</p>}{snapshot.proposal && <p className="mt-1 whitespace-pre-wrap">제안: {snapshot.proposal}</p>}{snapshot.status && <p className="mt-1">{label(STATUSES, snapshot.status)}</p>}</div>;
                })}
              </details>)}
            </div>
            <div className="space-y-3"><h3 className="font-medium">기존 AI 수정 지시</h3>
              {!paragraph.aiPrompt && !paragraph.aiPrompts?.length && <p className="text-sm text-zinc-500">이 블록에 연결된 기존 AI 지시가 없습니다. 구조 전환 전 Scene 전문 기록은 legacy 원형에서 확인하세요.</p>}
              {paragraph.aiPrompts?.map(item => <article key={item.id} className="rounded-lg border border-zinc-700 bg-zinc-950/50 p-3"><p className="mb-2 text-xs text-zinc-500">{dateLabel(item.createdAt)} · {item.targetVersion}</p><p className="whitespace-pre-wrap text-sm">{item.prompt}</p></article>)}
              {paragraph.aiPrompt && <article className="rounded-lg border border-zinc-700 bg-zinc-950/50 p-3"><p className="mb-2 text-xs text-zinc-500">기존 단일 AI 지시</p><p className="whitespace-pre-wrap text-sm">{paragraph.aiPrompt}</p></article>}
              {paragraph.commentary && <article className="rounded-lg border border-zinc-700 bg-zinc-950/50 p-3"><p className="mb-2 text-xs text-zinc-500">기존 메모</p><p className="whitespace-pre-wrap text-sm">{paragraph.commentary}</p></article>}
            </div>
            <div className="space-y-3"><h3 className="font-medium">현재 조회에 포함된 본문 버전</h3>
              {Object.entries(paragraph.versions).map(([key, version]) => <details key={key} className="rounded-lg border border-zinc-700 bg-zinc-950/50 p-3"><summary className="cursor-pointer text-sm">{version.versionNo ? `블록 v${version.versionNo}` : key} · {dateLabel(version.createdAt)}{key === paragraph.activeVersion ? ' · 현재 표시' : ''}</summary>{version.note && <p className="mt-3 text-xs text-zinc-400">수정 사유: {version.note}</p>}<pre className="mt-3 whitespace-pre-wrap break-words font-sans text-sm leading-6">{version.content}</pre></details>)}
              <p className="text-xs leading-5 text-zinc-500">이 목록은 현재 조회에 포함된 버전만 표시합니다. 과거 Scene 구성과 legacy 전문 조회는 Reader의 구성 선택기에서 별도로 확인하세요.</p>
            </div>
          </section>}
        </div>

        <footer className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-zinc-800 px-5 py-3 sm:px-6">
          <div className="flex flex-wrap gap-2"><button type="button" disabled={busy} className={`${buttonClass} text-xs`} onClick={() => copy(onCopyScene, '현재 저장된 Scene 전문을 복사했습니다.')}>Scene 전체 복사</button><button type="button" disabled={busy} className={`${buttonClass} text-xs`} onClick={() => copy(() => onCopyText(`${broadScope ? `[적용 범위]\n${form.application_scope === 'work' ? '같은 한국어 작품 공통' : '현재 Scene 전체'}\n대상 인물: ${form.target_character || '미지정'}\n적용 종류: ${form.applies_to}\n보존 조건: ${form.preservation || '미지정'}\n\n[예시 블록 ${blockLabel}]` : `[대상 블록 ${blockLabel}]`}\n${targetBody}${form.selected_text ? `\n\n[선택 문장]\n${form.selected_text}` : ''}\n\n[수정 방향]\n${form.direction}${form.proposal ? `\n\n[제안 문안]\n${form.proposal}` : ''}`), '본문과 코멘트를 복사했습니다.')}>본문 + 코멘트 복사</button></div>
          <button type="button" disabled={busy} className={buttonClass} onClick={requestClose}>닫기</button>
        </footer>
      </div>
    </div>
  );
};

export default ManagedBlockReviewDialog;
