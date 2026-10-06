import React, { useState } from 'react';
import { buildReviewExport, downloadReviewFile } from '../../shared/lib/novelReviewComments';
import type { NovelScene } from './novelData';
import { ReviewGuidelinesPanel } from './ReviewGuidelinesPanel';

const statuses: Record<string, string> = { open: '검토 중', sent: '편집 요청 전달', review: '반영 후 재검토', resolved: '완료', held: '보류', withdrawn: '철회' };
export function SceneReviewCommentsPanel({ scene, comments, guidelines, readerSlug, loading, error, onReload, onClose, onOpen, onToggle, onSaveGuideline, onBuildScenePacket }: {
  scene: NovelScene; comments: any[]; readerSlug: string; loading: boolean; error: string;
  guidelines: any[];
  onSaveGuideline: (input: any, existing?: any) => Promise<boolean>;
  onBuildScenePacket: () => Promise<{ markdown: string; json: string; baseFilename: string }>;
  onReload: () => void; onClose: () => void; onOpen: (comment: any) => void;
  onToggle: (comment: any, included: boolean) => Promise<void>;
}) {
  const [filter, setFilter] = useState('open');
  const [busyId, setBusyId] = useState('');
  const [message, setMessage] = useState('');
  const [exportBusy, setExportBusy] = useState(false);
  const [guidelinePending, setGuidelinePending] = useState(false);
  const [guidelineSaving, setGuidelineSaving] = useState(false);
  const exportScene = async (format: 'markdown' | 'json') => {
    setExportBusy(true); setMessage('');
    try {
      const fullPacket = await onBuildScenePacket();
      if (!downloadReviewFile(fullPacket[format], `${fullPacket.baseFilename}.${format === 'json' ? 'json' : 'md'}`, format === 'json' ? 'application/json' : 'text/markdown')) throw new Error('브라우저 다운로드를 사용할 수 없습니다.');
      setMessage('Scene 전문·공통 지침·위치별 요청을 한 파일로 다운로드했습니다. 검토용 표시는 원고에 저장되지 않습니다.');
    } catch (cause: any) { setMessage(`검토본 다운로드 실패: ${cause.message || cause}`); }
    finally { setExportBusy(false); }
  };
  const visible = comments.filter(c => filter === 'all' || (filter === 'included' ? c.include_in_export && !['resolved', 'withdrawn', 'held'].includes(c.status)
    : filter === 'required' ? c.priority === 'required' && !['resolved', 'withdrawn'].includes(c.status)
    : !['resolved', 'withdrawn', 'held'].includes(c.status)));
  const packet = buildReviewExport(comments, { sceneId: scene.id, sceneTitle: scene.title || '', readerSlug, currentCompositionId: scene.managedReviewCompositionId });
  const exportFile = (format: 'markdown' | 'json') => {
    if (!packet.count) return;
    downloadReviewFile(packet[format], `${packet.baseFilename}.${format === 'json' ? 'json' : 'md'}`, format === 'json' ? 'application/json' : 'text/markdown');
    setMessage(`${packet.count}개 코멘트와 작성 당시 원문을 ${format === 'json' ? 'JSON' : 'Markdown'}으로 다운로드했습니다.`);
  };
  return <section aria-label="Scene 검토 코멘트 목록" className="rounded-2xl border border-blue-500/30 bg-zinc-900 p-5 space-y-4">
    <div className="flex justify-between gap-4"><div><h3 className="font-semibold text-white">Scene 검토본 · {scene.title}</h3><p className="text-xs text-zinc-400 mt-1">Scene 전문에 작품·인물 공통 지침, Scene 지침, 문장별 요청을 연결해 전달합니다. 보류·완료·철회 항목은 제외됩니다.</p></div><button type="button" aria-label="코멘트 목록 닫기" disabled={exportBusy || !!busyId || guidelineSaving} onClick={() => { if (!guidelinePending || window.confirm('저장하지 않은 지침이 있습니다. 입력을 버리고 목록을 닫을까요?')) onClose(); }} className="text-zinc-300 disabled:opacity-40">닫기</button></div>
    <div className="rounded-xl bg-blue-950/20 border border-blue-500/20 p-4 space-y-3">
      <p className="text-sm text-zinc-300">전문을 포함한 검토본입니다. 인물 지침은 지정 범위의 검토 방향이며, 연결된 문장은 예시입니다. 지침 간 충돌은 reviewer가 확인하며 원고를 자동 수정하지 않습니다.</p>
      <div className="flex flex-wrap gap-2"><button type="button" onClick={() => void exportScene('markdown')} disabled={loading || !!error || exportBusy || guidelinePending || !!busyId || scene.managedReadOnly} className="rounded-lg bg-blue-500 text-white px-3 py-2 text-sm disabled:opacity-40">{exportBusy ? '검토본 생성 중…' : 'Scene 전체 + 지침 다운로드 (Markdown)'}</button><button type="button" onClick={() => void exportScene('json')} disabled={loading || !!error || exportBusy || guidelinePending || !!busyId || scene.managedReadOnly} className="rounded-lg bg-zinc-800 text-zinc-200 px-3 py-2 text-sm disabled:opacity-40">Scene 검토본 JSON</button></div>
      <p className="text-xs text-zinc-500">저장된 지침만 포함됩니다. 작성 중인 입력을 먼저 저장하세요. 다른 Scene 원문과 기존 AI 지시 이력은 자동 포함되지 않습니다.</p>
    </div>
    <ReviewGuidelinesPanel scene={scene} guidelines={guidelines} loading={loading || exportBusy || !!busyId} error={error} onSave={onSaveGuideline} onPendingChange={setGuidelinePending} onSavingChange={setGuidelineSaving} />
    <h4 className="text-sm font-semibold text-zinc-200">특정 문장·블록 수정 요청</h4>
    <div className="flex flex-wrap gap-2 items-center">
      <label className="text-sm text-zinc-300">목록 필터 <select aria-label="코멘트 목록 필터" value={filter} onChange={e => setFilter(e.target.value)} className="bg-zinc-950 border border-zinc-700 rounded p-2"><option value="open">열린 코멘트</option><option value="included">편집 요청 포함</option><option value="required">필수</option><option value="all">전체 이력 포함</option></select></label>
      <button type="button" onClick={onReload} disabled={loading || exportBusy || guidelineSaving || !!busyId} className="text-sm text-blue-300 p-2 disabled:opacity-40">새로 조회</button>
      <button type="button" disabled={loading || !!error || !packet.count || exportBusy || guidelineSaving || !!busyId} onClick={() => exportFile('markdown')} className="rounded-lg bg-zinc-800 text-white px-3 py-2 text-sm disabled:opacity-40">발췌 요청만 {packet.count}건 Markdown</button>
      <button type="button" disabled={loading || !!error || !packet.count || exportBusy || guidelineSaving || !!busyId} onClick={() => exportFile('json')} className="rounded-lg bg-zinc-800 text-zinc-200 px-3 py-2 text-sm disabled:opacity-40">발췌 요청만 JSON</button>
    </div>
    {(error || message) && <p role={error ? 'alert' : 'status'} className={error ? 'text-red-300 text-sm' : 'text-blue-200 text-sm'}>{error || message}</p>}
    {loading ? <p role="status" className="text-zinc-400">코멘트 조회 중…</p> : !visible.length ? <p className="text-zinc-400 text-sm">이 조건에 맞는 코멘트가 없습니다. 본문의 블록을 클릭해 수정 방향을 남겨 주세요.</p> : <ul className="space-y-3 max-h-[32rem] overflow-y-auto">
      {visible.map(comment => <li key={comment.id} className="rounded-xl border border-zinc-700 bg-zinc-950 p-4 space-y-2">
        <div className="flex flex-wrap items-center gap-3 text-xs"><strong className="text-amber-300">{comment.source_key || `B${String(comment.position).padStart(4, '0')}`}</strong><span className="text-zinc-400">{statuses[comment.status]} · 코멘트 r{comment.revision}</span>
          <label className="ml-auto text-zinc-300 flex gap-2 items-center"><input type="checkbox" aria-label={`${comment.source_key} 편집 요청에 포함`} checked={comment.include_in_export} disabled={loading || !!error || !!busyId || exportBusy || guidelineSaving || ['resolved', 'withdrawn', 'held'].includes(comment.status)} onChange={async e => {
            const included = e.target.checked; setBusyId(comment.id); setMessage('');
            try { await onToggle(comment, included); } catch (cause: any) { setMessage(`선택 저장 실패: ${cause.message || cause}`); } finally { setBusyId(''); }
          }} />편집 요청에 포함</label></div>
        {comment.is_stale && <p className="text-amber-300 text-xs">작성 이후 본문 버전이 바뀌었습니다. 대상 문장을 다시 확인해 주세요.</p>}
        <blockquote className="border-l-2 border-zinc-600 pl-3 whitespace-pre-wrap text-sm text-zinc-400">{comment.selected_text || comment.body_snapshot}</blockquote>
        <p className="whitespace-pre-wrap text-sm text-zinc-200">{comment.direction}</p>
        {comment.proposal && <p className="whitespace-pre-wrap text-sm text-blue-200">제안 문안: {comment.proposal}</p>}
        <button type="button" disabled={exportBusy || guidelineSaving || !!busyId} onClick={() => onOpen(comment)} className="text-xs text-blue-300 underline disabled:opacity-40">해당 블록으로 이동 · 코멘트 열기</button>
      </li>)}
    </ul>}
  </section>;
}
