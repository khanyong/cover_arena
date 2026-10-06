import React, { useEffect, useId, useRef, useState } from 'react';
import { NovelScene } from './novelData';

interface ReviewGuidelinesPanelProps {
  scene: NovelScene;
  guidelines: any[];
  loading?: boolean;
  error?: string;
  onSave: (input: any, existing?: any) => Promise<boolean>;
  onPendingChange?: (pending: boolean) => void;
  onSavingChange?: (saving: boolean) => void;
}

const KINDS = [['style', '문체'], ['translation', '번역'], ['term', '용어'], ['dialogue', '대사'], ['fact', '사실'], ['continuity', '연결'], ['formula', '수식'], ['other', '기타']] as const;
const PRIORITIES = [['required', '필수'], ['suggested', '권장'], ['question', '질문']] as const;
const STATUSES = [['open', '검토 중'], ['sent', '편집 요청 전달'], ['review', '반영 후 재검토'], ['resolved', '확인 완료'], ['held', '보류'], ['withdrawn', '철회']] as const;
const APPLIES_TO = [['all', '전체'], ['dialogue', '대사'], ['narration', '서술'], ['inner_voice', '내면 독백']] as const;
const inputClass = 'w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400 disabled:opacity-50';
const buttonClass = 'rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-200 hover:bg-zinc-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400 disabled:cursor-not-allowed disabled:opacity-40';

function label(options: readonly (readonly [string, string])[], value: string) {
  return options.find(([key]) => key === value)?.[1] || value;
}

function dateLabel(value?: string) {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString('ko-KR');
}

function formValues(item?: any) {
  return {
    scope: item?.scope || 'scene', target_character: item?.target_character || '',
    applies_to: item?.applies_to || 'all', preservation: item?.preservation || '',
    direction: item?.direction || '', proposal: item?.proposal || '', kind: item?.kind || 'style',
    priority: item?.priority || 'suggested', status: item?.status || 'open',
    include_in_export: item ? Boolean(item.include_in_export) : true,
  };
}

function ExampleSnapshot({ item }: { item: any }) {
  const source = item.example || item;
  const body = source.body_snapshot || item.example_body_snapshot || '';
  const quote = source.selected_text || item.example_selected_text || '';
  if (!body && !quote) return <p className="mt-3 text-xs text-zinc-500">특정 위치 지정 없음 · 범위 전체에 적용하는 지침</p>;
  return <details className="mt-3 rounded-lg border border-zinc-700 bg-zinc-950/60 p-3">
    <summary className="cursor-pointer text-xs text-zinc-400">예시로 남긴 원문 확인{source.position ? ` · B${String(source.position).padStart(4, '0')}` : ''}</summary>
    <p className="mt-2 text-xs leading-5 text-amber-300">이 원문은 예시입니다. 이 문장에만 적용하는 수정 요청이 아닙니다.</p>
    {(source.scene_title || item.scene_title) && <p className="mt-2 text-xs text-zinc-500">출처 Scene: {source.scene_title || item.scene_title}</p>}
    {quote && <blockquote className="mt-3 whitespace-pre-wrap break-words border-l-2 border-amber-600 pl-3 text-sm">{quote}</blockquote>}
    {body && <pre className="mt-3 max-h-48 overflow-auto whitespace-pre-wrap break-words font-sans text-xs leading-6 text-zinc-400">{body}</pre>}
    {source.block_version_id && <p className="mt-2 break-all text-xs text-zinc-500">기준 Version: {source.block_version_id}</p>}
    {item.is_stale && <p className="mt-2 text-xs text-rose-300">예시 작성 이후 본문이 변경되었습니다. 현재 문맥을 다시 확인하세요.</p>}
  </details>;
}

/** Broad directions are independent of manuscript mutations and local comments. */
export const ReviewGuidelinesPanel: React.FC<ReviewGuidelinesPanelProps> = ({ scene, guidelines, loading = false, error, onSave, onPendingChange, onSavingChange }) => {
  const panelId = useId();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const directionRef = useRef<HTMLTextAreaElement>(null);
  const [form, setForm] = useState<ReturnType<typeof formValues> | null>(null);
  const [baseline, setBaseline] = useState('');
  const [editing, setEditing] = useState<any>(null);
  const [busy, setBusy] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [notice, setNotice] = useState('');
  const dirty = form !== null && JSON.stringify(form) !== baseline;
  const isReadOnly = Boolean(scene.managedReadOnly);
  const unavailable = loading || Boolean(error) || isReadOnly;
  useEffect(() => { onPendingChange?.(dirty || busy); }, [dirty, busy, onPendingChange]);
  useEffect(() => () => { onPendingChange?.(false); }, [onPendingChange]);
  useEffect(() => { onSavingChange?.(busy); }, [busy, onSavingChange]);
  useEffect(() => () => { onSavingChange?.(false); }, [onSavingChange]);
  const visible = [...guidelines].sort((a, b) => {
    const scopeOrder = (a.scope === 'work' ? 0 : 1) - (b.scope === 'work' ? 0 : 1);
    return scopeOrder || String(b.updated_at || b.created_at || '').localeCompare(String(a.updated_at || a.created_at || ''));
  });

  const openForm = (item?: any) => {
    if (busy || unavailable || (dirty && !window.confirm('작성 중인 지침을 버리고 다른 지침을 열까요?'))) return;
    const next = formValues(item);
    setForm(next); setBaseline(JSON.stringify(next)); setEditing(item || null); setNotice(''); setSaveError('');
    requestAnimationFrame(() => directionRef.current?.focus());
  };
  const closeForm = () => {
    if (busy || (dirty && !window.confirm('저장하지 않은 지침 입력을 버릴까요?'))) return;
    setForm(null); setEditing(null); setSaveError(''); headingRef.current?.focus();
  };
  const field = (name: string, value: unknown) => {
    setForm(previous => previous ? { ...previous, [name]: value } : previous); setNotice('');
  };
  const save = async (input: ReturnType<typeof formValues>, item?: any, close = false) => {
    if (busy || unavailable) return;
    if (!input.direction.trim()) { setSaveError('수정 방향을 입력해 주세요.'); directionRef.current?.focus(); return; }
    setBusy(true); setNotice(''); setSaveError('');
    try {
      const result = await onSave(input, item);
      if (!result) { setSaveError('저장하지 못했습니다. 입력은 유지됩니다.'); return; }
      if (close) { setForm(null); setEditing(null); }
      setNotice('수정 지침을 저장했습니다. 원고와 본문 버전은 바뀌지 않았습니다.');
    } catch (caught) {
      const message = caught && typeof caught === 'object' && 'message' in caught ? (caught as { message?: unknown }).message : null;
      setSaveError(typeof message === 'string' ? message.slice(0, 600) : '저장하지 못했습니다. 입력은 유지됩니다.');
    } finally { setBusy(false); }
  };

  return <section aria-labelledby={`${panelId}-title`} aria-busy={loading || busy} className="space-y-4 rounded-xl border border-zinc-700 bg-zinc-900/60 p-4">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div><h3 ref={headingRef} id={`${panelId}-title`} tabIndex={-1} className="font-semibold text-amber-200">Scene·인물·작품 수정 지침</h3><p className="mt-1 text-xs leading-5 text-zinc-400">공통 방향을 먼저 전달하고, 문장별 코멘트는 별도로 연결합니다. 지침 저장은 본문 수정이 아닙니다.</p></div>
      <button type="button" disabled={busy || unavailable} onClick={() => openForm()} className={buttonClass}>수정 지침 추가</button>
    </div>
    <p className="text-xs leading-5 text-zinc-500">작품 공통 지침은 같은 논리 KO project에 연결된 검토 Scene에서 공유합니다. 영문이나 다른 작품에는 적용하지 않습니다. 대상 인물과 Scene·작품 범위를 명시하고, 다른 Scene을 검토하지 않았다면 전권 반영 완료로 처리하지 않습니다.</p>
    {loading && <p role="status" className="text-sm text-zinc-400">지침을 불러오는 중입니다.</p>}
    {error && <p role="alert" className="whitespace-pre-wrap text-sm text-rose-300">지침을 불러오지 못했습니다. {error}</p>}
    {isReadOnly && <p className="text-xs text-amber-300">과거 구성에서는 지침을 변경하지 않습니다. 최신 review로 돌아가 작성하세요.</p>}
    {saveError && <p role="alert" className="whitespace-pre-wrap rounded-lg border border-red-500/30 bg-red-950/20 p-3 text-sm text-rose-200">{saveError}</p>}
    {notice && <p role="status" className="rounded-lg border border-emerald-600/30 bg-emerald-950/20 p-3 text-sm text-emerald-200">{notice}</p>}

    {form && <form className="space-y-4 rounded-xl border border-amber-500/30 bg-zinc-950/50 p-4" onSubmit={event => { event.preventDefault(); void save(form, editing || undefined, true); }}>
      <h4 className="text-sm font-medium">{editing ? '수정 지침 정정' : '새 수정 지침 · 특정 문장 선택 없이 작성'}</h4>
      <fieldset disabled={busy || unavailable} className="space-y-4 disabled:opacity-60">
        <legend className="sr-only">공통 수정 지침 입력</legend>
        <label className="block space-y-1 text-xs text-zinc-400"><span>적용 범위{editing ? ' · 기존 범위 유지' : ''}</span><select value={form.scope} disabled={Boolean(editing)} onChange={event => field('scope', event.target.value)} className={inputClass}><option value="scene">현재 Scene 전체</option><option value="work">같은 한국어 작품 전체의 공통 지침</option></select></label>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="space-y-1 text-xs text-zinc-400"><span>대상 인물 · 선택</span><input value={form.target_character} maxLength={200} onChange={event => field('target_character', event.target.value)} placeholder="예: 이안 · 비워두면 특정 인물로 제한하지 않음" className={inputClass} /></label>
          <label className="space-y-1 text-xs text-zinc-400"><span>적용할 글의 종류</span><select value={form.applies_to} onChange={event => field('applies_to', event.target.value)} className={inputClass}>{APPLIES_TO.map(([value, text]) => <option key={value} value={value}>{text}</option>)}</select></label>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <label className="space-y-1 text-xs text-zinc-400"><span>유형</span><select value={form.kind} onChange={event => field('kind', event.target.value)} className={inputClass}>{KINDS.map(([value, text]) => <option key={value} value={value}>{text}</option>)}</select></label>
          <label className="space-y-1 text-xs text-zinc-400"><span>우선순위</span><select value={form.priority} onChange={event => field('priority', event.target.value)} className={inputClass}>{PRIORITIES.map(([value, text]) => <option key={value} value={value}>{text}</option>)}</select></label>
          <label className="space-y-1 text-xs text-zinc-400"><span>진행 상태</span><select value={form.status} onChange={event => field('status', event.target.value)} className={inputClass}>{STATUSES.map(([value, text]) => <option key={value} value={value}>{text}</option>)}</select></label>
        </div>
        <label className="block space-y-2 text-sm"><span>수정 방향 <span className="text-amber-300">필수</span></span><textarea ref={directionRef} rows={4} value={form.direction} maxLength={12000} onChange={event => field('direction', event.target.value)} className={inputClass} placeholder="예: 이안의 설명조를 줄이고 짧고 절제된 말투로 정리해 주세요." /></label>
        <label className="block space-y-2 text-sm"><span>보존 조건 · 선택</span><textarea rows={2} value={form.preservation} maxLength={12000} onChange={event => field('preservation', event.target.value)} className={inputClass} placeholder="예: 과학적 의미와 전달 정보 유지. 다른 인물의 말투는 변경하지 않음." /></label>
        <label className="block space-y-2 text-sm"><span>제안 문안·예시 · 선택</span><textarea rows={3} value={form.proposal} maxLength={30000} onChange={event => field('proposal', event.target.value)} className={inputClass} placeholder="참고할 표현을 적어 주세요. 본문에는 자동 반영되지 않습니다." /></label>
        {editing && <ExampleSnapshot item={editing} />}
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.include_in_export} onChange={event => field('include_in_export', event.target.checked)} className="accent-amber-400" />다음 검토 패키지에 포함</label>
        <p className="text-xs leading-5 text-zinc-500">확인 완료·보류·철회 상태는 다운로드 대상에서 제외됩니다. 기존 지침의 범위·출처 예시는 바꾸지 않고, 정정은 새 이력으로 보존합니다.</p>
        <div className="flex justify-end gap-2"><button type="button" onClick={closeForm} className={buttonClass}>취소</button><button type="submit" disabled={!form.direction.trim() || (Boolean(editing) && !dirty)} className="rounded-lg bg-amber-400 px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-amber-300 disabled:opacity-40">{busy ? '저장 중…' : editing ? '지침 정정 저장' : '수정 지침 저장'}</button></div>
      </fieldset>
    </form>}

    {!loading && !error && !visible.length && <p className="text-sm text-zinc-500">아직 저장된 Scene·작품 지침이 없습니다. 인물의 말투나 장면 전체의 편집 방향을 한 번만 기록할 수 있습니다.</p>}
    <div className="space-y-3">{visible.map(item => <article key={item.id} className="rounded-xl border border-zinc-700 bg-zinc-950/40 p-3">
      <div className="flex flex-wrap items-center gap-2 text-xs"><span className="rounded bg-amber-500/10 px-2 py-1 text-amber-200">{item.scope === 'work' ? '작품 공통' : 'Scene 전체'}</span><span className="text-zinc-300">{item.target_character ? `인물: ${item.target_character}` : '특정 인물 제한 없음'} · {label(APPLIES_TO, item.applies_to || 'all')}</span><span className="text-zinc-400">{label(KINDS, item.kind)} · {label(PRIORITIES, item.priority)} · {label(STATUSES, item.status)}</span></div>
      <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-zinc-100">{item.direction}</p>
      {item.preservation && <p className="mt-2 whitespace-pre-wrap break-words text-sm text-amber-100/80">보존 조건: {item.preservation}</p>}
      {item.proposal && <p className="mt-2 whitespace-pre-wrap break-words text-sm text-zinc-400">제안 문안·예시: {item.proposal}</p>}
      <ExampleSnapshot item={item} />
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3"><label className="flex items-center gap-2 text-xs text-zinc-300"><input type="checkbox" checked={Boolean(item.include_in_export)} disabled={busy || unavailable || form !== null || ['resolved', 'held', 'withdrawn'].includes(item.status)} onChange={event => void save({ ...formValues(item), include_in_export: event.target.checked }, item)} className="accent-amber-400" />검토 패키지 포함</label><button type="button" disabled={busy || unavailable} onClick={() => openForm(item)} className={`${buttonClass} !py-1 text-xs`}>정정·상태 변경</button></div>
      <details className="mt-3 border-t border-zinc-800 pt-3 text-xs text-zinc-500"><summary className="cursor-pointer">지침 이력 · r{item.revision} · {dateLabel(item.updated_at || item.created_at)}</summary><p className="mt-2 break-all">지침 ID: {item.id}</p>{(item.history || []).map((event: any, index: number) => {
        const snapshot = event.snapshot || event.payload || event.input || event;
        return <div key={event.event_id || `${item.id}:${event.revision || index}`} className="mt-3 border-l-2 border-zinc-700 pl-3"><p>r{event.revision || index + 1} · {dateLabel(event.updated_at || event.created_at)} · {label(STATUSES, snapshot.status || '')}</p>{snapshot.direction && <p className="mt-1 whitespace-pre-wrap break-words">{snapshot.direction}</p>}{snapshot.preservation && <p className="mt-1 whitespace-pre-wrap">보존 조건: {snapshot.preservation}</p>}</div>;
      })}</details>
    </article>)}</div>
    <p className="text-xs leading-5 text-zinc-500">공통 지침과 개별 코멘트가 충돌하면 reviewer가 확인 사항으로 남기도록 전달합니다. 상태·범위는 자동으로 변경하지 않습니다.</p>
  </section>;
};

export default ReviewGuidelinesPanel;
